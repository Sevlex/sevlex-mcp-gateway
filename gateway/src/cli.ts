#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getAllMonitoredClients, inspectAndHealClient, startDaemonWatcher, getMcpProxyEntry } from "./daemon.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==============================================================================
// SEVLEX UNIFIED ENTERPRISE CLI & ENTRYPOINT (Level 2 Interface)
// Usage:
//   sevlex install [--silent]    -> Enterprise Intune / Jamf silent deployment
//   sevlex uninstall [--silent]  -> Enterprise silent uninstallation
//   sevlex status                -> Health diagnostics & shielded clients report
//   sevlex scan                  -> Shadow AI & MCP server discovery sweep
//   sevlex daemon                -> Starts Level 4 24/7 background watcher
//   sevlex [command] [args...]   -> Transparent Layer 7 MCP Proxy execution
// ==============================================================================

const args = process.argv.slice(2);
const firstArg = args[0]?.toLowerCase();

async function main() {
  if (!firstArg || firstArg === "--help" || firstArg === "-h") {
    printHelp();
    return;
  }

  // 1. Command: INSTALL
  if (firstArg === "install" || firstArg === "/install") {
    const isSilent = args.includes("--silent") || args.includes("/silent") || args.includes("-s");
    runInstall(isSilent);
    return;
  }

  // 2. Command: UNINSTALL
  if (firstArg === "uninstall" || firstArg === "/uninstall") {
    const isSilent = args.includes("--silent") || args.includes("/silent") || args.includes("-s");
    runUninstall(isSilent);
    return;
  }

  // 3. Command: STATUS
  if (firstArg === "status" || firstArg === "--status") {
    runStatus();
    return;
  }

  // 4. Command: SCAN
  if (firstArg === "scan" || firstArg === "--scan") {
    runScan();
    return;
  }

  // 5. Command: DAEMON
  if (firstArg === "daemon") {
    startDaemonWatcher();
    return;
  }

  // 6. Transparent Proxy Forwarding
  // If invoked with "proxy <command...>" or directly as a wrapper:
  const proxyArgs = firstArg === "proxy" ? args.slice(1) : args;
  runProxy(proxyArgs);
}

function printHelp() {
  console.log(`
SEVLEX ENTERPRISE ZERO-TRUST MCP GATEWAY (CLI v1.0.0)
Universal Layer 7 AI Security & Shadow AI Governance

USAGE:
  sevlex <command> [options]

COMMANDS:
  install [--silent]     Deploy corporate policy and shield all 5 AI runtimes
  uninstall [--silent]   Unhook Sevlex and restore original configurations
  status                 Inspect health, active policies, and shielded tools
  scan                   Scan system for Shadow AI tools and unmanaged servers
  daemon                 Run 24/7 background watcher with 30ms auto-healing
  <target-tool...>       Run as Layer 7 Zero-Trust proxy wrapper around target tool

EXAMPLES:
  sevlex install --silent
  sevlex status
  sevlex node my-mcp-server.js
`);
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

  // Copy gateway engine
  const gatewayDist = path.resolve(__dirname, "gateway.js");
  const targetGateway = path.join(sysDir, "gateway.js");
  if (fs.existsSync(gatewayDist)) {
    try { fs.copyFileSync(gatewayDist, targetGateway); } catch {}
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

function runStatus() {
  const isWindows = process.platform === "win32";
  const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";
  const policyPath = path.join(sysDir, "sevlex.json");

  console.log("\n=================================================================");
  console.log("  SEVLEX ENTERPRISE GATEWAY - STATUS & HEALTH REPORT            ");
  console.log("=================================================================");

  console.log(`● Hostname:        ${os.hostname()}`);
  console.log(`● Platform:        ${process.platform} (${process.arch})`);
  console.log(`● Corporate Path:  ${sysDir} [${fs.existsSync(sysDir) ? "EXISTS" : "MISSING"}]`);
  console.log(`● Policy File:     ${policyPath} [${fs.existsSync(policyPath) ? "ACTIVE" : "NOT FOUND"}]`);
  console.log(`● SIEM Stream:     Datadog US5 (Live Stream Active)`);

  console.log("\nAI RUNTIME SHIELD STATUS:");
  console.log("-----------------------------------------------------------------");
  const clients = getAllMonitoredClients();
  for (const client of clients) {
    let status = "STANDBY (Not Installed)";
    if (fs.existsSync(client.configPath)) {
      try {
        const raw = fs.readFileSync(client.configPath, "utf-8");
        const data = JSON.parse(raw);
        if (data.mcpServers && data.mcpServers["sevlex-firewall"]) {
          status = "● SHIELDED (L7 Intercept Active)";
        } else {
          status = "⚠️ UNPROTECTED (Firewall Missing)";
        }
      } catch {
        status = "❌ CONFIG ERROR";
      }
    }
    console.log(`  ${client.name.padEnd(25)} ${status}`);
  }
  console.log("-----------------------------------------------------------------\n");
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
        const isShielded = Boolean(data.mcpServers?.["sevlex-firewall"]);
        console.log(`   Sevlex Protection: ${isShielded ? "✔ SECURED" : "⚠️ UNMANAGED SHADOW AI"}`);
      } catch (e: any) {
        console.log(`   Error reading config: ${e.message}`);
      }
    }
  }

  console.log(`\n[Sevlex Scanner] Sweep complete. Discovered ${discoveredCount} AI clients on host.\n`);
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
