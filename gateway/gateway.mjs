import 'dotenv/config';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import { createClient } from '@supabase/supabase-js';

// Validate required env vars at startup
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'MCP_UPSTREAM_CMD', 'SVX_API_KEY'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  process.stderr.write(`[gateway] FATAL: missing required env vars: ${missing.join(', ')}\n`);
  process.exit(1);
}

const SESSION_ID = randomUUID();
const RESPONSE_SIZE_LIMIT = 10_000; // 10KB — truncate response bodies above this

// admin client — bypasses RLS for inserts
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Resolve customer_id once on startup from SVX_API_KEY
let customerId = null;
let serverName = 'unknown';

const { data: customer, error: customerError } = await supabaseAdmin
  .from('customers')
  .select('id')
  .eq('api_key', process.env.SVX_API_KEY)
  .single();

if (customerError || !customer) {
  process.stderr.write('[gateway] WARNING: SVX_API_KEY not found in customers table\n');
} else {
  customerId = customer.id;
  process.stderr.write(`[gateway] customer resolved: ${customerId}\n`);
}

const [cmd, ...args] = process.env.MCP_UPSTREAM_CMD.split(' ');
const upstream = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'inherit'], env: process.env, cwd: import.meta.dirname });

upstream.on('exit', (code) => {
  // Flush any orphaned in-flight calls on exit
  if (pendingCalls.size > 0) {
    process.stderr.write(`[gateway] upstream exited with ${pendingCalls.size} orphaned call(s): ${[...pendingCalls.keys()].join(', ')}\n`);
    pendingCalls.clear();
  }
  process.exit(code ?? 0);
});

upstream.on('error', (err) => {
  process.stderr.write(`[gateway] upstream error: ${err.message}\n`);
  process.exit(1);
});

// pendingCalls tracks in-flight tools/call requests: id → { toolName, params, startTime }
const pendingCalls = new Map();

// Truncate a response body to RESPONSE_SIZE_LIMIT bytes to avoid blowing up Supabase rows
function truncateResponse(result) {
  if (result == null) return { value: null, truncated: false };
  const json = JSON.stringify(result);
  if (json.length <= RESPONSE_SIZE_LIMIT) return { value: result, truncated: false };
  return { value: json.slice(0, RESPONSE_SIZE_LIMIT) + '…[truncated]', truncated: true };
}

// Messages from Claude → upstream
const fromClaude = createInterface({ input: process.stdin, terminal: false });
fromClaude.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    if (msg.method === 'tools/call') {
      pendingCalls.set(msg.id, {
        toolName: msg.params?.name ?? 'unknown',
        params: msg.params?.arguments ?? {},
        startTime: Date.now(),
      });
    }
  } catch (err) {
    process.stderr.write(`[gateway] JSON parse error (Claude→upstream): ${err.message}\n`);
  }
  upstream.stdin.write(line + '\n');
});

// Messages from upstream → Claude
const fromUpstream = createInterface({ input: upstream.stdout, terminal: false });
fromUpstream.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);

    // Capture server name from initialize response
    if (msg.result?.serverInfo?.name) {
      serverName = msg.result.serverInfo.name;
    }

    const pending = pendingCalls.get(msg.id);
    if (pending && customerId !== null) {
      const duration_ms = Date.now() - pending.startTime;
      pendingCalls.delete(msg.id);
      const { value: response, truncated: response_truncated } = truncateResponse(msg.result);
      let flagReason = null;

const toolCallCount = [...pendingCalls.values()].filter(
  c => c.toolName === pending.toolName
).length;

if (duration_ms > 5000) {
  flagReason = 'slow_call';
}
if (toolCallCount >= 3) {
  flagReason = 'retry_loop';
}
if (JSON.stringify(msg.result).length > 8000) {
  flagReason = 'large_response';
}
      supabaseAdmin.from('tool_calls').insert({
        tool_name: pending.toolName,
        parameters: pending.params,
        agent_id: process.env.SVX_AGENT_ID ?? 'unknown-agent',
        customer_id: customerId,
        server_name: serverName,
        session_id: SESSION_ID,
        duration_ms,
        response,
        response_truncated,
        status: flagReason ? 'flagged' : 'allowed',
        flag_reason: flagReason ?? null,
      }).then(({ error }) => {
        if (error) process.stderr.write(`[gateway] supabase error: ${error.message}\n`);
      });
    } else if (pending && customerId === null) {
      process.stderr.write(`[gateway] skipping insert for tool "${pending.toolName}" — customer_id not resolved\n`);
      pendingCalls.delete(msg.id);
    }
  } catch (err) {
    process.stderr.write(`[gateway] JSON parse error (upstream→Claude): ${err.message}\n`);
  }
  process.stdout.write(line + '\n');
});
