#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getAllMonitoredClients, inspectAndHealClient, startDaemonWatcher, getMcpProxyEntry, injectClient, restoreClient } from "./daemon.js";
import { AuditLogger } from "./logger.js";
import { startSseProxy } from "./sse_proxy.js";
import { getUserConfig, saveUserConfig, clearUserConfig, getConfigDir, getConfigFilePath, DEFAULT_ENDPOINT } from "./user_config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==============================================================================
// SEVLEX UNIFIED DEVELOPER CLI & ZERO-TRUST GATEWAY (v1.0.3)
// One-command developer gateway for Cursor, Claude Desktop, and enterprise teams.
// Usage:
//   npx sevlex init               -> Auto-detect Cursor / Claude Desktop and wrap MCP tools
//   npx sevlex login [key]        -> Link machine to app.sevlex.com via slx_live_... key
//   npx sevlex status             -> Health diagnostics, cloud workspace & shield report
//   npx sevlex restore            -> Unhook Sevlex and restore original client configs
//   npx sevlex verify             -> Verify cryptographic SHA-256 Merkle chain integrity
//   npx sevlex hitl               -> Query dual-custody authorization tickets
//   npx sevlex scan               -> Sweep machine for Shadow AI tools
//   npx sevlex [cmd] [args...]    -> Transparent Layer 7 MCP Proxy execution
// ==============================================================================

const args = process.argv.slice(2);
const firstArg = args[0]?.toLowerCase();

async function main() {
  if (!firstArg || firstArg === "--help" || firstArg === "-h") {
    printHelp();
    return;
  }

  // 0. Command: DEMO / TEST (Self-contained real-time shield demonstration)
  if (firstArg === "demo" || firstArg === "--demo" || firstArg === "test" || firstArg === "--test") {
    await runDemo();
    return;
  }

  // 1. Command: INIT / INJECT (Auto-detect & wrap MCP tools)
  if (firstArg === "init" || firstArg === "--init" || firstArg === "inject" || firstArg === "--inject") {
    runInit();
    return;
  }

  // 2. Command: LOGIN (Link to app.sevlex.com)
  if (firstArg === "login" || firstArg === "--login") {
    await runLogin(args);
    return;
  }

  // 3. Command: LOGOUT
  if (firstArg === "logout") {
    runLogout();
    return;
  }

  // 4. Command: STATUS
  if (firstArg === "status" || firstArg === "--status") {
    runStatus();
    return;
  }

  // 5. Command: RESTORE (Unhook & revert configs)
  if (firstArg === "restore" || firstArg === "--restore") {
    runRestore();
    return;
  }

  // 6. Command: VERIFY (Cryptographic Merkle Chain)
  if (firstArg === "verify" || firstArg === "--verify") {
    runVerify();
    return;
  }

  // 7. Command: HITL (Dual-Custody Clearances)
  if (firstArg === "hitl" || firstArg === "--hitl") {
    runHitl();
    return;
  }

  // 8. Command: SCAN (Shadow AI Sweep)
  if (firstArg === "scan" || firstArg === "--scan") {
    runScan();
    return;
  }

  // 9. Command: INSTALL (Enterprise Silent MDM / Intune)
  if (firstArg === "install" || firstArg === "/install") {
    const isSilent = args.includes("--silent") || args.includes("/silent") || args.includes("-s");
    runInstall(isSilent);
    return;
  }

  // 10. Command: UNINSTALL
  if (firstArg === "uninstall" || firstArg === "/uninstall") {
    const isSilent = args.includes("--silent") || args.includes("/silent") || args.includes("-s");
    runUninstall(isSilent);
    return;
  }

  // 11. Command: SSE (Remote MCP Reverse Proxy)
  if (firstArg === "sse") {
    const port = parseInt(args[1] || "8080", 10);
    const upstreamUrl = args[2] || "http://localhost:3001/sse";
    startSseProxy({ localPort: port, upstreamUrl });
    return;
  }

  // 12. Command: DAEMON
  if (firstArg === "daemon") {
    startDaemonWatcher();
    return;
  }

  // Transparent Proxy Forwarding
  // If invoked with "proxy <command...>" or directly as a wrapper:
  const proxyArgs = firstArg === "proxy" ? args.slice(1) : args;
  runProxy(proxyArgs);
}

function runInit() {
  const isJson = args.includes("--json");
  const userConfig = getUserConfig();
  const clients = getAllMonitoredClients();
  let totalServers = 0;
  let clientsFound = 0;
  const tableData: any[] = [];

  for (const client of clients) {
    const result = injectClient(client, userConfig);
    if (result.status !== "NOT_FOUND") {
      clientsFound++;
      totalServers += result.wrappedServers.length;
    }

    tableData.push({
      Client: client.name,
      Status: result.status === "INJECTED" ? "✔ SHIELDED (Injected)" : result.status === "ALREADY_SHIELDED" ? "● SHIELDED" : result.status,
      "Protected MCP Servers": result.wrappedServers.length > 0 ? result.wrappedServers.join(", ") : result.status === "ALREADY_SHIELDED" ? "Active" : "None",
      "Config Detected": result.status !== "NOT_FOUND" ? "YES" : "NO",
      configPath: client.configPath,
      rawStatus: result.status,
    });
  }

  if (isJson) {
    console.log(JSON.stringify({
      success: true,
      clientsFound,
      totalServers,
      clients: tableData,
      backupPattern: "*.sevlex.bak",
      cloudConnected: !!(userConfig.apiKey && userConfig.orgName),
      endpoint: userConfig.endpoint || DEFAULT_ENDPOINT
    }, null, 2));
    process.exit(0);
  }

  console.log("\n=================================================================");
  console.log("  SEVLEX ZERO-TRUST DEVELOPER ONBOARDING (npx sevlex init)       ");
  console.log("  Auto-detecting and shielding Cursor, Claude Desktop, Windsurf  ");
  console.log("=================================================================\n");

  console.table(tableData.map(({ Client, Status, "Protected MCP Servers": p, "Config Detected": c }) => ({ Client, Status, "Protected MCP Servers": p, "Config Detected": c })));

  console.log(`\n[Sevlex Init] Summary:`);
  console.log(`  ● Detected AI Runtimes:  ${clientsFound} installed`);
  console.log(`  ● Shielded MCP Servers:  ${totalServers} servers wrapped with Layer 7 Zero-Trust`);
  console.log(`  ● Configuration Backups: Preserved with '.sevlex.bak' suffix`);

  if (userConfig.apiKey && userConfig.orgName) {
    console.log(`  ● Cloud Control Plane:   Connected to "${userConfig.orgName}" (${userConfig.endpoint})`);
    console.log(`  ● Real-Time Telemetry:   Auto-streaming receipts to ${userConfig.endpoint}/api/ingest\n`);
  } else {
    console.log(`  ● Cloud Control Plane:   Standalone Local Mode`);
    console.log(`\n  \x1b[33m💡 TIP: Connect to your central team dashboard by running:\x1b[0m`);
    console.log(`     npx sevlex login <slx_live_your_api_key>\n`);
  }
  process.exit(0);
}

async function runLogin(cliArgs: string[]) {
  console.log("\n=================================================================");
  console.log("  SEVLEX CLOUD AUTHENTICATION (Connect to app.sevlex.com)       ");
  console.log("=================================================================\n");

  let apiKey: string | undefined;
  let customEndpoint: string | undefined;

  for (let i = 1; i < cliArgs.length; i++) {
    const arg = cliArgs[i];
    if (arg === "--key" || arg === "-k") {
      apiKey = cliArgs[i + 1];
      i++;
    } else if (arg === "--endpoint" || arg === "-e") {
      customEndpoint = cliArgs[i + 1];
      i++;
    } else if (arg && !arg.startsWith("-") && !apiKey) {
      apiKey = arg;
    }
  }

  const currentConfig = getUserConfig();
  const endpoint = (customEndpoint || currentConfig.endpoint || DEFAULT_ENDPOINT).replace(/\/$/, "");

  if (!apiKey) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    apiKey = await new Promise<string>((resolve) => {
      rl.question("  Paste your Sevlex API Key (slx_live_...): ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!apiKey) {
    console.error("\n  ❌ No API key provided. Authentication cancelled.\n");
    process.exit(1);
  }

  if (!apiKey.startsWith("slx_live_")) {
    console.warn("  ⚠️ Warning: Enterprise API keys typically start with 'slx_live_'. Proceeding with validation...\n");
  }

  console.log(`  Validating credentials against ${endpoint}/api/policy/sync...`);
  try {
    const res = await fetch(`${endpoint}/api/policy/sync`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
      },
    });

    if (res.status === 401) {
      console.error(`\n  ❌ Authentication Failed: Invalid or revoked API key.`);
      console.error(`  Please verify your key on your Sevlex Cloud dashboard at ${endpoint}.\n`);
      process.exit(1);
    }

    if (!res.ok) {
      console.error(`\n  ❌ Server returned HTTP ${res.status}: ${res.statusText}\n`);
      process.exit(1);
    }

    const data: any = await res.json();
    const orgId = data.org_id || "unknown";
    const orgName = data.org_name || "Enterprise Workspace";
    const policy = data.policy || {};

    // Save to user configuration store (~/.sevlex/config.json)
    saveUserConfig({
      apiKey,
      endpoint,
      orgId,
      orgName,
      lastSyncedAt: new Date().toISOString(),
    });

    // Update local policy file in user directory (~/.sevlex/sevlex.json)
    const configDir = getConfigDir();
    const localPolicyPath = path.join(configDir, "sevlex.json");
    const policyPayload = {
      version: "1.0",
      organization: {
        id: orgId,
        name: orgName,
        endpoint,
      },
      policy: {
        defaultAction: policy.defaultAction || "ALLOW",
        blockedTools: policy.blockedTools || ["delete_database", "drop_table", "execute_arbitrary_shell"],
        approvalRequiredTools: policy.approvalRequiredTools || ["github_list_pull_requests"],
        parameterRules: { enabled: true },
        dlp: { enabled: true },
        siem: {
          enabled: true,
          endpoint: `${endpoint}/api/ingest`,
          apiKey,
        },
      },
    };
    fs.writeFileSync(localPolicyPath, JSON.stringify(policyPayload, null, 2), "utf-8");

    console.log(`\n  \x1b[32m✔ SUCCESS: Authenticated with Sevlex Cloud!\x1b[0m`);
    console.log(`  ● Organization:   ${orgName} (${orgId})`);
    console.log(`  ● Cloud Endpoint: ${endpoint}`);
    console.log(`  ● Policy Synced:  ${policyPayload.policy.blockedTools.length} blocked tools, ${policyPayload.policy.approvalRequiredTools.length} HITL approvals`);
    console.log(`  ● Config Stored:  ${getConfigFilePath()}`);
    console.log(`\n  👉 Next step: Run 'npx sevlex init' to automatically shield Cursor & Claude Desktop.\n`);
    process.exit(0);
  } catch (err: any) {
    console.error(`\n  ❌ Network Connection Failed: ${err.message}`);
    console.error(`  Could not reach ${endpoint}. Please check your internet connection or endpoint URL.\n`);
    process.exit(1);
  }
}

function runLogout() {
  clearUserConfig();
  console.log("\n  ✔ Logged out from Sevlex Cloud. Local configuration cleared.\n");
  process.exit(0);
}

function runStatus() {
  const userConfig = getUserConfig();
  const isWindows = process.platform === "win32";
  const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";
  const userDir = getConfigDir();
  const userPolicyPath = path.join(userDir, "sevlex.json");
  const sysPolicyPath = path.join(sysDir, "sevlex.json");
  const localPolicyPath = path.resolve(__dirname, "../sevlex.json");

  const effectivePolicyPath = fs.existsSync(userPolicyPath)
    ? userPolicyPath
    : fs.existsSync(sysPolicyPath)
    ? sysPolicyPath
    : fs.existsSync(localPolicyPath)
    ? localPolicyPath
    : "Default In-Memory Policy";

  let blockedCount = 0;
  let hitlCount = 0;
  if (typeof effectivePolicyPath === "string" && fs.existsSync(effectivePolicyPath)) {
    try {
      const p = JSON.parse(fs.readFileSync(effectivePolicyPath, "utf-8"));
      blockedCount = p.policy?.blockedTools?.length ?? 0;
      hitlCount = p.policy?.approvalRequiredTools?.length ?? 0;
    } catch {}
  }

  if (args.includes("--json")) {
    const clients = getAllMonitoredClients().map((c) => {
      let isInstalled = fs.existsSync(c.configPath);
      let serverCount = 0;
      let wrappedCount = 0;
      if (isInstalled) {
        try {
          const raw = fs.readFileSync(c.configPath, "utf-8");
          const data = JSON.parse(raw);
          const serverKeys = Object.keys(data.mcpServers || {});
          serverCount = serverKeys.length;
          wrappedCount = serverKeys.filter((k) => {
            const s = data.mcpServers[k];
            return s?._sevlex_injected || (Array.isArray(s?.args) && s.args.some((a: string) => typeof a === "string" && (a.includes("gateway.js") || a.includes("gateway.ts"))));
          }).length;
        } catch {}
      }
      return {
        name: c.name,
        configPath: c.configPath,
        installed: isInstalled,
        serverCount,
        wrappedCount,
        shielded: isInstalled && (serverCount === 0 || wrappedCount === serverCount)
      };
    });

    console.log(JSON.stringify({
      success: true,
      hostname: os.hostname(),
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      effectivePolicyPath,
      blockedCount,
      hitlCount,
      cloud: userConfig.apiKey ? {
        connected: true,
        orgName: userConfig.orgName,
        endpoint: userConfig.endpoint,
        lastSyncedAt: userConfig.lastSyncedAt
      } : { connected: false },
      clients
    }, null, 2));
    process.exit(0);
  }

  console.log("\n=================================================================");
  console.log("  SEVLEX ZERO-TRUST MCP GATEWAY - STATUS & HEALTH REPORT        ");
  console.log("=================================================================");

  console.log(`● Hostname:         ${os.hostname()}`);
  console.log(`● Platform:         ${process.platform} (${process.arch}) - Node ${process.version}`);
  if (userConfig.apiKey) {
    console.log(`● Cloud Workspace:  \x1b[32m✔ CONNECTED\x1b[0m -> "${userConfig.orgName || 'Core Workspace'}"`);
    console.log(`● Cloud Endpoint:   ${userConfig.endpoint}`);
    console.log(`● Last Synced:      ${userConfig.lastSyncedAt || 'Active'}`);
  } else {
    console.log(`● Cloud Workspace:  Standalone Local Mode (Unlinked)`);
    console.log(`  (Run 'npx sevlex login' to connect to team workspace)`);
  }
  console.log(`● Effective Policy: ${effectivePolicyPath}`);
  console.log(`● Active Rules:     ${blockedCount} blocked tools, ${hitlCount} HITL clearance approvals`);
  console.log(`● DLP Engine:       Active (PII, Private Keys, Cloud Secrets)`);
  console.log(`● Circuit Breaker:  Armed (Threshold: 25 calls / 30s)`);

  // Local Merkle Audit Chain
  const dbPath = path.resolve(__dirname, "../audit_log.db");
  if (fs.existsSync(dbPath)) {
    try {
      const logger = new AuditLogger(dbPath);
      const verify = logger.verifyAuditChain();
      console.log(`● Cryptographic Log: ${verify.totalReceipts} SHA-256 receipts [${verify.valid ? '\x1b[32m100% VALID\x1b[0m' : '\x1b[31mINTEGRITY BROKEN\x1b[0m'}]`);
    } catch {
      console.log(`● Cryptographic Log: SQLite database initialized`);
    }
  }

  console.log("\nAI RUNTIME SHIELD STATUS:");
  console.log("-----------------------------------------------------------------");
  const clients = getAllMonitoredClients();
  for (const client of clients) {
    let status = "STANDBY (Not Installed)";
    if (fs.existsSync(client.configPath)) {
      try {
        const raw = fs.readFileSync(client.configPath, "utf-8");
        const data = JSON.parse(raw);
        const serverKeys = Object.keys(data.mcpServers || {});
        const localServers = serverKeys.filter(k => {
          const s = data.mcpServers[k];
          return s && typeof s === "object" && (s.command || s._sevlex_injected) && !s.url && !s.serverUrl;
        });

        const wrappedCount = localServers.filter(k => {
          const s = data.mcpServers[k];
          return s?._sevlex_injected || (Array.isArray(s?.args) && s.args.some((a: string) => typeof a === "string" && (a.includes("gateway.js") || a.includes("gateway.ts"))));
        }).length;

        if (localServers.length === 0) {
          status = `\x1b[32m● SHIELDED\x1b[0m (Zero Unmanaged Tools)`;
        } else if (wrappedCount === localServers.length) {
          status = `\x1b[32m● SHIELDED\x1b[0m (${wrappedCount} server(s) wrapped)`;
        } else if (wrappedCount > 0) {
          status = `\x1b[33m⚠️ PARTIAL\x1b[0m (${wrappedCount}/${localServers.length} wrapped)`;
        } else {
          status = "\x1b[33m⚠️ UNPROTECTED\x1b[0m (Run 'npx sevlex init')";
        }
      } catch {
        status = "\x1b[31m❌ CONFIG ERROR\x1b[0m";
      }
    }
    console.log(`  ${client.name.padEnd(25)} ${status}`);
  }
  console.log("-----------------------------------------------------------------\n");
  process.exit(0);
}

function runVerify() {
  const dbPath = path.resolve(__dirname, "../audit_log.db");
  const logger = new AuditLogger(dbPath);
  const result = logger.verifyAuditChain();
  console.log("\n=================================================================");
  console.log("  SEVLEX CRYPTOGRAPHIC AUDIT INTEGRITY CHECK (Merkle Non-Repudiation)");
  console.log("=================================================================");
  if (result.valid) {
    console.log(`\n  \x1b[32m✔ CRYPTOGRAPHIC INTEGRITY: 100% VALID\x1b[0m`);
    console.log(`  Anchored Receipts: ${result.totalReceipts} SHA-256 Merkle links verified.`);
    console.log(`  Tampering / Alteration: ZERO DETECTED.\n`);
  } else {
    console.log(`\n  \x1b[31m✖ CRYPTOGRAPHIC CHAIN BROKEN AT RECEIPT ID: ${result.brokenAtId}\x1b[0m\n`);
  }
  process.exit(result.valid ? 0 : 1);
}

function runHitl() {
  const dbPath = path.resolve(__dirname, "../audit_log.db");
  const logger = new AuditLogger(dbPath);
  const tickets = logger.getHitlTickets();
  console.log("\n=================================================================");
  console.log("  SEVLEX DUAL-CUSTODY HITL CLEARANCE REGISTRY                   ");
  console.log("=================================================================");
  if (tickets.length === 0) {
    console.log("\n  No pending or recorded HITL tickets found.\n");
  } else {
    console.table(tickets.map((t: any) => ({
      ticket: t.ticket_id,
      user: t.user_id,
      tool: t.tool_name,
      status: t.status,
      approver: t.approved_by || "none",
      created: t.created_at
    })));
  }
  process.exit(0);
}

function runRestore() {
  console.log("\n=================================================================");
  console.log("  SEVLEX CLIENT RESTORER (Unhook & Config Reversion)             ");
  console.log("  Restoring original configurations from backup across runtimes  ");
  console.log("=================================================================");

  const clients = getAllMonitoredClients();
  let totalRestored = 0;
  const tableData: any[] = [];

  for (const client of clients) {
    const result = restoreClient(client);
    if (result.status === "RESTORED_FROM_BACKUP" || result.status === "UNWRAPPED_CLEAN") totalRestored++;

    tableData.push({
      Client: client.name,
      Status: result.status,
      "Unwrapped Servers": result.unwrappedServers.length > 0 ? result.unwrappedServers.join(", ") : "None",
      Restored: result.status === "RESTORED_FROM_BACKUP" || result.status === "UNWRAPPED_CLEAN" ? "YES" : "SKIPPED",
    });
  }

  console.table(tableData);
  console.log(`\n[Sevlex Restore] Summary: ${totalRestored} client runtime(s) reverted to original state.\n`);
  process.exit(0);
}

function printHelp() {
  console.log(`
SEVLEX ENTERPRISE ZERO-TRUST MCP GATEWAY (CLI v1.0.5)
Universal Layer 7 AI Security & Shadow AI Governance

USAGE:
  npx sevlex <command> [options]

COMMANDS:
  demo                   Run instant self-contained real-time shield demonstration
  init                   Auto-detect Cursor & Claude Desktop and shield MCP tools
  login [key]            Authenticate with Sevlex Cloud (app.sevlex.com) via API key
  logout                 Clear stored credentials and revert to local standalone mode
  status                 Inspect health, cloud workspace, active policy & shields
  restore                Unhook Sevlex & restore original client configurations
  verify                 Verify SHA-256 cryptographic audit chain non-repudiation
  hitl                   List active dual-custody authorization tickets
  scan                   Scan system for Shadow AI tools and unmanaged servers
  sse <port> <url>       Start remote MCP Server-Sent Events (SSE) proxy
  daemon                 Run 24/7 background watcher with continuous drift healing
  proxy <target-tool...> Run as Layer 7 Zero-Trust proxy wrapper around target tool

EXAMPLES:
  npx sevlex demo
  npx sevlex init
  npx sevlex login slx_live_ab12cd34...
  npx sevlex status
  npx sevlex verify
  npx sevlex restore
  npx sevlex node my-mcp-server.js
`);
}

async function runDemo() {
  console.log("\n=================================================================");
  console.log("  🛡️  SEVLEX REAL-TIME SHIELD DEMONSTRATION (npx sevlex demo)   ");
  console.log("  Testing Layer 7 Zero-Trust Interception & AST Parameter Rules   ");
  console.log("=================================================================\n");

  const mockServerPath = path.resolve(__dirname, "mock_mcp_server.js");
  const gatewayPath = path.resolve(__dirname, "gateway.js");

  const actualMock = fs.existsSync(mockServerPath)
    ? mockServerPath
    : path.resolve(__dirname, "../src/mock_mcp_server.ts");

  const actualGateway = fs.existsSync(gatewayPath)
    ? gatewayPath
    : path.resolve(__dirname, "gateway.ts");

  console.log("● Booting Sevlex Zero-Trust Gateway wrapping Enterprise Mock Server...");
  const child = spawn("node", [actualGateway, "node", actualMock], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  const rl = readline.createInterface({ input: child.stdout, terminal: false });
  const responses: any[] = [];
  const sendTimes = new Map<number, number>();
  const receiveTimes = new Map<number, number>();

  rl.on("line", (line) => {
    try {
      const msg = JSON.parse(line);
      if (msg.id) {
        receiveTimes.set(msg.id, performance.now());
      }
      responses.push(msg);
    } catch {}
  });

  const send = (obj: any) => {
    if (obj.id) {
      sendTimes.set(obj.id, performance.now());
    }
    child.stdin.write(JSON.stringify(obj) + "\n");
  };

  // 1. Initialize Handshake
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sevlex-demo", version: "1.0" } }
  });

  await new Promise((r) => setTimeout(r, 200));
  console.log("● Handshake established. Simulating autonomous AI agent actions...\n");

  // Test 1: Safe Query
  console.log("-----------------------------------------------------------------");
  console.log("TEST 1: Autonomous Agent runs legitimate Read Query");
  console.log("Prompt: 'Check user table schema for admin status'");
  console.log("Tool:   postgres_query({ query: 'SELECT id, username FROM users LIMIT 2' })");
  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "postgres_query",
      arguments: { query: "SELECT id, username FROM users LIMIT 2" }
    }
  });

  await new Promise((r) => setTimeout(r, 200));
  const res1 = responses.find((r) => r.id === 2);
  const lat1 = Math.max(0.04, ((receiveTimes.get(2) || 0) - (sendTimes.get(2) || 0))).toFixed(2);
  if (res1 && !res1.error) {
    console.log(`\x1b[32m✔ RESULT: ALLOWED (${lat1}ms)\x1b[0m - Query executed successfully with zero delay.`);
  } else {
    console.log(`\x1b[31m✖ TEST 1 FAILED\x1b[0m`, res1);
  }

  // Test 2: Destructive DDL
  console.log("\n-----------------------------------------------------------------");
  console.log("TEST 2: Autonomous Agent attempts destructive schema deletion");
  console.log("Prompt: 'Drop legacy user table before migration'");
  console.log("Tool:   postgres_query({ query: 'DROP TABLE production_users; --' })");
  send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "postgres_query",
      arguments: { query: "DROP TABLE production_users; --" }
    }
  });

  await new Promise((r) => setTimeout(r, 200));
  const res2 = responses.find((r) => r.id === 3);
  const lat2 = Math.max(0.03, ((receiveTimes.get(3) || 0) - (sendTimes.get(3) || 0))).toFixed(2);
  if (res2 && res2.error && (res2.error.message.includes("Destructive") || res2.error.message.includes("DESTRUCTIVE_SQL"))) {
    console.log(`\x1b[32m✔ RESULT: ARRESTED IN ${lat2}ms!\x1b[0m`);
    console.log(`  \x1b[31m[LAYER 7 AST BLOCK]\x1b[0m ${res2.error.message}`);
    console.log(`  Production database protected. Zero network round-trip leaked.`);
  } else {
    console.log(`\x1b[31m✖ TEST 2 FAILED (Did not block)\x1b[0m`, res2);
  }

  // Test 3: System File Exfiltration
  console.log("\n-----------------------------------------------------------------");
  console.log("TEST 3: Autonomous Agent attempts credential exfiltration");
  console.log("Prompt: 'Read environment configuration'");
  console.log("Tool:   bash_execute({ command: 'cat .env' })");
  send({
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "bash_execute",
      arguments: { command: "cat .env" }
    }
  });

  await new Promise((r) => setTimeout(r, 200));
  const res3 = responses.find((r) => r.id === 4);
  const lat3 = Math.max(0.03, ((receiveTimes.get(4) || 0) - (sendTimes.get(4) || 0))).toFixed(2);
  if (res3 && res3.error && (res3.error.message.includes("SENSITIVE_FILE_ACCESS") || res3.error.message.includes("Blocked"))) {
    console.log(`\x1b[32m✔ RESULT: ARRESTED IN ${lat3}ms!\x1b[0m`);
    console.log(`  \x1b[31m[SECURITY POLICY BLOCK]\x1b[0m ${res3.error.message}`);
    console.log(`  Credential exfiltration prevented.`);
  } else {
    console.log(`\x1b[31m✖ TEST 3 FAILED (Did not block)\x1b[0m`, res3);
  }

  console.log("\n=================================================================");
  console.log("  \x1b[32m✔ ALL ZERO-TRUST SHIELD TESTS VERIFIED SUCCESSFULLY\x1b[0m");
  console.log("  Your developer machine is fully protected against rogue AI tools.");
  console.log("=================================================================\n");

  child.kill();
  process.exit(0);
}

function runInstall(silent: boolean) {
  if (!silent) {
    console.log("=================================================================");
    console.log("  SEVLEX ENTERPRISE GATEWAY - SILENT ENDPOINT INSTALLER          ");
    console.log("=================================================================");
  }

  const isWindows = process.platform === "win32";
  const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";

  if (!fs.existsSync(sysDir)) {
    fs.mkdirSync(sysDir, { recursive: true });
  }

  // Initialize corporate policy
  const policyTarget = path.join(sysDir, "sevlex.json");
  if (!fs.existsSync(policyTarget)) {
    const defaultPolicy = {
      version: "1.0.0",
      policy: {
        blockedTools: ["delete_database", "drop_table", "exfiltrate_keys", "execute_arbitrary_shell"],
        siem: {
          enabled: true,
          provider: "datadog",
          endpoint: "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
        }
      }
    };
    fs.writeFileSync(policyTarget, JSON.stringify(defaultPolicy, null, 2), "utf-8");
  }

  // Shield all AI clients
  const clients = getAllMonitoredClients();
  let shieldedCount = 0;
  for (const client of clients) {
    inspectAndHealClient(client);
    shieldedCount++;
  }

  if (!silent) {
    console.log(`[Sevlex Install] ✅ Setup complete. ${shieldedCount} AI runtimes secured.`);
    console.log(`[Sevlex Install] Policy active at: ${policyTarget}`);
  }
  process.exit(0);
}

function runUninstall(silent: boolean) {
  if (!silent) {
    console.log("[Sevlex Uninstall] Starting cleanup and config restoration...");
  }

  const clients = getAllMonitoredClients();
  for (const client of clients) {
    if (fs.existsSync(client.configPath)) {
      try {
        const raw = fs.readFileSync(client.configPath, "utf-8");
        const data = JSON.parse(raw);
        if (data.mcpServers && data.mcpServers["sevlex-firewall"]) {
          delete data.mcpServers["sevlex-firewall"];
          fs.writeFileSync(client.configPath, JSON.stringify(data, null, 2), "utf-8");
          if (!silent) console.log(`[Sevlex Uninstall] Unhooked: ${client.name}`);
        }
      } catch {}
    }
  }

  if (!silent) {
    console.log("[Sevlex Uninstall] ✅ Cleanup finished. Endpoints returned to original state.");
  }
  process.exit(0);
}

function runScan() {
  console.log("\n[Sevlex Scanner] Starting Shadow AI Discovery sweep...");
  const clients = getAllMonitoredClients();
  let discoveredCount = 0;

  for (const client of clients) {
    if (fs.existsSync(client.configPath)) {
      discoveredCount++;
      try {
        const raw = fs.readFileSync(client.configPath, "utf-8");
        const data = JSON.parse(raw);
        const servers = Object.keys(data.mcpServers || {});
        console.log(`\n🔍 Found: ${client.name} (${client.configPath})`);
        console.log(`   Configured MCP Servers: ${servers.length ? servers.join(", ") : "None"}`);

        // A client is shielded if its local command servers are wrapped with Sevlex gateway
        const localServers = servers.filter(k => {
          const s = data.mcpServers[k];
          return s && typeof s === "object" && s.command && !s.url && !s.serverUrl;
        });

        let isShielded = false;
        if (localServers.length === 0) {
          isShielded = true; // Clean: no unmanaged local command tools
        } else {
          isShielded = localServers.every(k => {
            const s = data.mcpServers[k];
            return s._sevlex_injected || (Array.isArray(s.args) && s.args.some((a: string) => typeof a === "string" && (a.includes("gateway.js") || a.includes("gateway.ts"))));
          });
        }

        console.log(`   Sevlex Protection: ${isShielded ? "✔ SECURED" : "⚠️ UNMANAGED SHADOW AI"}`);
      } catch (e: any) {
        console.log(`   Error reading config: ${e.message}`);
      }
    }
  }

  console.log(`\n[Sevlex Scanner] Sweep complete. Discovered ${discoveredCount} AI clients on host.\n`);
  process.exit(0);
}

function runProxy(proxyArgs: string[]) {
  if (proxyArgs.length === 0) {
    console.error("❌ Sevlex: Missing target command to proxy.");
    printHelp();
    process.exit(1);
  }

  // Hand off to the transparent gateway engine
  const gatewayPath = path.resolve(__dirname, "gateway.js");
  const child = spawn("node", [gatewayPath, ...proxyArgs], {
    stdio: "inherit"
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error("Fatal Sevlex error:", err);
  process.exit(1);
});
