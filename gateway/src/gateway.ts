import "dotenv/config";
import { spawn } from "node:child_process";
import readline from "node:readline";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { AuditLogger } from "./logger.js";
import { inspectToolParameters, redactToolOutputDlp } from "./toolguard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGatewayRoot(): string {
  let cur = __dirname;
  for (let i = 0; i < 4; i++) {
    if (fs.existsSync(path.join(cur, "sevlex.json"))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(__dirname, "..");
}

const gatewayRoot = getGatewayRoot();

// ============================================================================
// SEVLEX MCP GATEWAY ENGINE (Phase 1)
// The "Toll Booth" that sits between the AI (Cursor/Claude) and the Real Tool.
// ============================================================================

// 1. Initialize our Foundation (Fail-fast config and robust database)
const configPath = process.env.SEVLEX_CONFIG_PATH || path.resolve(gatewayRoot, "sevlex.json");
const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(gatewayRoot, "audit_log.db");
const config = loadConfig(configPath);
const logger = new AuditLogger(dbPath);

// Determine User Identity
const userId = process.env.SEVLEX_USER || os.userInfo().username;

// Track pending tools/list requests
const pendingToolListRequests = new Set<number | string>();

// 2. Identify the Destination
// When the AI starts Sevlex, it tells us where it actually wants to go.
// Example command: node gateway.ts python weather_tool.py
const targetCommand = process.argv[2];
const targetArgs = process.argv.slice(3);

if (!targetCommand) {
  console.error("❌ Sevlex Gateway: Missing target command. You must specify a tool to run.");
  process.exit(1);
}

// 3. Start the REAL Tool in the background
// We connect our "pipes" to it so we can intercept the traffic.
const realTool = spawn(targetCommand, targetArgs, {
  // We intercept stdin (input) and stdout (output). Stderr (errors) bypasses us.
  stdio: ["pipe", "pipe", "inherit"], 
});

// ============================================================================
// 4. REMOTE SIEM FORWARDER (Stateless Disaster Recovery & Enterprise Streaming)
// ============================================================================
function streamToSiem(targetUserId: string, targetToolName: string, status: "ALLOWED" | "BLOCKED" | "DLP_REDACTED" | "HITL_PENDING", rawPayload: any) {
  const siemConfig = config.policy.siem;
  const endpoint = process.env.SEVLEX_SIEM_ENDPOINT || siemConfig?.endpoint;
  const apiKey = process.env.SEVLEX_SIEM_API_KEY || siemConfig?.apiKey;
  const provider = (process.env.SEVLEX_SIEM_PROVIDER || siemConfig?.provider || "webhook").toLowerCase();

  if (!endpoint && !apiKey) return;

  const targetUrl = endpoint || (provider === "datadog" ? "https://http-intake.logs.datadoghq.com/api/v2/logs" : "");
  if (!targetUrl) return;

  const timestamp = new Date().toISOString();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let payload: any;

  if (provider === "datadog") {
    if (apiKey) headers["DD-API-KEY"] = apiKey;
    payload = [{
      ddsource: "sevlex-gateway",
      ddtags: `env:production,user:${targetUserId},tool:${targetToolName},status:${status}`,
      hostname: os.hostname(),
      service: "sevlex-mcp-firewall",
      message: `MCP Tool Execution [${status}]: ${targetUserId} called ${targetToolName}`,
      user_id: targetUserId,
      tool_name: targetToolName,
      status: status,
      timestamp: timestamp,
      raw_request: rawPayload
    }];
  } else if (provider === "splunk") {
    if (apiKey) headers["Authorization"] = `Splunk ${apiKey}`;
    payload = {
      event: {
        user_id: targetUserId,
        tool_name: targetToolName,
        status: status,
        raw_request: rawPayload,
        hostname: os.hostname(),
      },
      sourcetype: "sevlex:mcp:audit",
      time: Math.floor(Date.now() / 1000)
    };
  } else {
    // Generic Webhook
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    payload = {
      source: "sevlex-mcp-gateway",
      timestamp,
      user_id: targetUserId,
      tool_name: targetToolName,
      status,
      hostname: os.hostname(),
      raw_request: rawPayload
    };
  }

  fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  }).catch(err => {
    console.error(`[SIEM Warning] Delivery failed to ${provider}:`, err.message || err);
  });
}

function handleAiMessage(message: any, rawMessage: string) {
  // Handle JSON-RPC batch requests (arrays)
  const messages = Array.isArray(message) ? message : [message];
  let isBlocked = false;

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') continue;

    // TRACK tools/list
    if (msg.method === "tools/list" && msg.id !== undefined) {
      pendingToolListRequests.add(msg.id);
    }

    // Is the AI trying to use a tool?
    if (msg.method === "tools/call" && msg.params && msg.params.name) {
      const toolName = msg.params.name;
      const approvalRequired = (config.policy.approvalRequiredTools || []).includes(toolName);

      // 🔴 CHECK 1: Hard Blocklist Check
      if (config.policy.blockedTools.includes(toolName)) {
        isBlocked = true;
        
        logger.log({
          userId: userId,
          toolName: toolName,
          status: "BLOCKED",
          rawRequest: rawMessage,
        });

        streamToSiem(userId, toolName, "BLOCKED", rawMessage);

        const alertMsg = `[SLACK ALERT] User '${userId}' attempted blocked tool '${toolName}'`;
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: alertMsg })
          }).catch(err => console.error("Slack webhook failed:", err));
        } else {
          console.error(alertMsg);
        }

        const errorResponse = {
          jsonrpc: "2.0",
          id: msg.id,
          error: {
            code: -32600, 
            message: `Sevlex Security: Access to tool '${toolName}' is blocked by company policy.`,
          },
        };
        process.stdout.write(JSON.stringify(errorResponse) + "\n");
      } 
      // 🟣 CHECK 2: Human-In-The-Loop (HITL) Authorization Check
      else if (approvalRequired) {
        isBlocked = true;

        logger.log({
          userId: userId,
          toolName: toolName,
          status: "HITL_PENDING",
          rawRequest: rawMessage,
        });

        streamToSiem(userId, toolName, "HITL_PENDING", rawMessage);

        const alertMsg = `[HITL APPROVAL REQUIRED] User '${userId}' requested high-impact tool '${toolName}'. Waiting for SecOps clearance.`;
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: alertMsg })
          }).catch(err => console.error("Slack webhook failed:", err));
        } else {
          console.error(alertMsg);
        }

        const hitlResponse = {
          jsonrpc: "2.0",
          id: msg.id,
          error: {
            code: -32001,
            message: `Sevlex HITL Guard: Execution of tool '${toolName}' requires human authorization. An approval ticket has been dispatched to SecOps.`,
          },
        };
        process.stdout.write(JSON.stringify(hitlResponse) + "\n");
      }
      // 🛡️ CHECK 3: ToolGuard Call Guard (Deep Parameter & Argument Inspection)
      else {
        const paramCheck = inspectToolParameters(toolName, msg.params.arguments);
        if (!paramCheck.passed && paramCheck.violation) {
          isBlocked = true;

          const violationTag = `${toolName} [${paramCheck.violation.category}]`;
          logger.log({
            userId: userId,
            toolName: violationTag,
            status: "BLOCKED",
            rawRequest: JSON.stringify({ message: msg, violation: paramCheck.violation }),
          });

          streamToSiem(userId, violationTag, "BLOCKED", JSON.stringify({ message: msg, violation: paramCheck.violation }));

          const alertMsg = `[TOOLGUARD BLOCK] User '${userId}' attempted dangerous argument in '${toolName}': ${paramCheck.violation.reason} (matched: ${paramCheck.violation.sample})`;
          if (process.env.SLACK_WEBHOOK_URL) {
            fetch(process.env.SLACK_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: alertMsg })
            }).catch(err => console.error("Slack webhook failed:", err));
          } else {
            console.error(alertMsg);
          }

          const errorResponse = {
            jsonrpc: "2.0",
            id: msg.id,
            error: {
              code: -32602,
              message: `Sevlex ToolGuard: Blocked by Parameter Inspection Rule [${paramCheck.violation.ruleId}]: ${paramCheck.violation.reason}. Dangerous payload intercepted.`,
            },
          };
          process.stdout.write(JSON.stringify(errorResponse) + "\n");
        } else {
          // 🟢 SECURITY CHECK PASSED: Tool & Parameters are safe
          logger.log({
            userId: userId,
            toolName: toolName,
            status: "ALLOWED",
            rawRequest: JSON.stringify(msg),
          });

          streamToSiem(userId, toolName, "ALLOWED", JSON.stringify(msg));
        }
      }
    }
  }

  if (isBlocked) {
    // Return immediately so we DO NOT forward this to the real tool
    return; 
  }

  // Forward the safe message to the actual tool
  realTool.stdin.write(rawMessage + "\n");
}

let inputBuffer = "";

process.stdin.on("data", (chunk) => {
  inputBuffer += chunk.toString();

  // Prevent memory bloat from unbounded JSON payloads
  if (inputBuffer.length > 10 * 1024 * 1024) {
    logger.log({
      userId: userId,
      toolName: "unknown",
      status: "BLOCKED",
      rawRequest: "Buffer limit exceeded",
    });
    inputBuffer = "";
    return;
  }

  let i = 0;
  while (i < inputBuffer.length) {
    let startIdx = inputBuffer.indexOf('{', i);
    let startArr = inputBuffer.indexOf('[', i);
    
    if (startIdx === -1) {
      startIdx = startArr;
    } else if (startArr !== -1 && startArr < startIdx) {
      startIdx = startArr;
    }

    if (startIdx === -1) {
      // Discard buffer if no JSON start is found to prevent memory leak
      inputBuffer = "";
      break;
    }

    let inString = false;
    let escape = false;
    let braces = 0;
    let foundEnd = false;

    for (let j = startIdx; j < inputBuffer.length; j++) {
      const char = inputBuffer[j];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{' || char === '[') {
          braces++;
        } else if (char === '}' || char === ']') {
          braces--;
          if (braces === 0) {
            const jsonStr = inputBuffer.substring(startIdx, j + 1);
            try {
              const message = JSON.parse(jsonStr);
              handleAiMessage(message, jsonStr);
            } catch (err) {
              // Ignore invalid JSON that matched brackets. Do NOT fail-open.
            }
            // Move buffer forward
            inputBuffer = inputBuffer.substring(j + 1);
            i = 0;
            foundEnd = true;
            break; // Break inner loop, continue while loop
          }
        }
      }
    }

    if (!foundEnd) {
      // Incomplete object, wait for more data. 
      // Trim everything before startIdx to prevent buffer bloat.
      inputBuffer = inputBuffer.substring(startIdx);
      break; // Wait for next chunk
    }
  }
});

// ============================================================================
// 5. THE RETURN TRIP: TOOL -> AI
// ============================================================================
const toolOutput = readline.createInterface({
  input: realTool.stdout,
  terminal: false,
});

toolOutput.on("line", (line) => {
  try {
    const response = JSON.parse(line);
    if (response.id !== undefined && pendingToolListRequests.has(response.id)) {
      pendingToolListRequests.delete(response.id);
      if (response.result && Array.isArray(response.result.tools)) {
        const DISCOVERED_TOOLS_PATH = path.join(gatewayRoot, "discovered_tools.json");
        let existingTools: any[] = [];
        try {
          if (fs.existsSync(DISCOVERED_TOOLS_PATH)) {
            existingTools = JSON.parse(fs.readFileSync(DISCOVERED_TOOLS_PATH, "utf-8"));
          }
        } catch (e) {}

        const serverName = targetCommand;
        
        let serverEntry = existingTools.find(s => s.server === serverName);
        if (!serverEntry) {
          serverEntry = { server: serverName, tools: [] };
          existingTools.push(serverEntry);
        }
        
        const newToolNames = response.result.tools.map((t: any) => t.name);
        const mergedTools = Array.from(new Set([...serverEntry.tools, ...newToolNames]));
        serverEntry.tools = mergedTools;

        fs.writeFileSync(DISCOVERED_TOOLS_PATH, JSON.stringify(existingTools, null, 2), "utf-8");
      }
    }
  } catch (e) {
    // Ignore parse errors from tool stdout
  }

  // 🛡️ ToolGuard Output Guard: Real-Time Secret Redaction & DLP
  let finalLine = line;
  try {
    const dlpResult = redactToolOutputDlp(line);
    if (dlpResult.redactionCount > 0) {
      finalLine = dlpResult.sanitized;

      logger.log({
        userId: userId,
        toolName: "ToolGuard DLP",
        status: "DLP_REDACTED",
        rawRequest: `Redacted ${dlpResult.redactionCount} sensitive secret(s): ${dlpResult.redactedTypes.join(", ")}`,
        rawResponse: dlpResult.sanitized,
      });

      streamToSiem(userId, "ToolGuard DLP", "DLP_REDACTED", {
        redactions: dlpResult.redactionCount,
        types: dlpResult.redactedTypes,
      });

      const dlpAlert = `[DLP ALERT] Redacted ${dlpResult.redactionCount} secret(s) (${dlpResult.redactedTypes.join(", ")}) from tool output before reaching AI context.`;
      if (process.env.SLACK_WEBHOOK_URL) {
        fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: dlpAlert })
        }).catch(err => console.error("Slack webhook failed:", err));
      } else {
        console.error(dlpAlert);
      }
    }
  } catch (err) {
    // Fail-safe
  }

  // Pass sanitized answer straight back to the AI
  process.stdout.write(finalLine + "\n");
});

// Clean up the database when the AI disconnects
process.on("SIGINT", () => {
  logger.close();
  process.exit(0);
});
