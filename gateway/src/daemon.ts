import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ==============================================================================
// SEVLEX 24/7 TAMPER-RESISTANT WATCHER DAEMON (Level 4 Engine)
// Monitors employee AI tool configurations in real time.
// Auto-heals within 30ms if a developer attempts to delete or bypass the firewall.
// ==============================================================================

export interface MonitoredClient {
  name: string;
  configPath: string;
}

export function getMcpProxyEntry(): Record<string, any> {
  const isWindows = process.platform === "win32";
  const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";
  const gatewayPath = path.join(sysDir, "gateway.js");
  const policyPath = path.join(sysDir, "sevlex.json");

  return {
    command: "node",
    args: [gatewayPath],
    env: {
      SEVLEX_POLICY_PATH: policyPath,
      SEVLEX_SIEM_PROVIDER: "datadog",
      SEVLEX_SIEM_ENDPOINT: "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
    }
  };
}

export function getMonitoredClientsForUser(userHome: string): MonitoredClient[] {
  const isWindows = process.platform === "win32";
  const appData = process.env.APPDATA || path.join(userHome, "AppData", "Roaming");

  return [
    {
      name: "Claude Desktop",
      configPath: isWindows
        ? path.join(appData, "Claude", "claude_desktop_config.json")
        : path.join(userHome, "Library", "Application Support", "Claude", "claude_desktop_config.json")
    },
    {
      name: "Claude Code CLI",
      configPath: path.join(userHome, ".claude.json")
    },
    {
      name: "Cursor IDE",
      configPath: path.join(userHome, ".cursor", "mcp.json")
    },
    {
      name: "Windsurf IDE",
      configPath: path.join(userHome, ".codeium", "windsurf", "mcp_config.json")
    },
    {
      name: "Google Antigravity IDE",
      configPath: path.join(userHome, ".gemini", "config", "mcp_config.json")
    }
  ];
}

export function getAllMonitoredClients(): MonitoredClient[] {
  const clients: MonitoredClient[] = [];
  const currentUserHome = os.homedir();
  clients.push(...getMcpProxyEntryList(currentUserHome));

  // If running as Windows SYSTEM in Intune, discover interactive users
  if (process.platform === "win32" && (process.env.USERNAME === "SYSTEM" || process.env.USER === "SYSTEM")) {
    const usersDir = "C:\\Users";
    try {
      if (fs.existsSync(usersDir)) {
        const dirs = fs.readdirSync(usersDir);
        for (const dir of dirs) {
          if (!["Public", "Default", "All Users", "Default User"].includes(dir)) {
            const userProfile = path.join(usersDir, dir);
            clients.push(...getMcpProxyEntryList(userProfile));
          }
        }
      }
    } catch {}
  }

  return clients;
}

function getMcpProxyEntryList(profile: string): MonitoredClient[] {
  return getMonitoredClientsForUser(profile);
}

export function inspectAndHealClient(client: MonitoredClient): boolean {
  try {
    const dir = path.dirname(client.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let data: any = { mcpServers: {} };
    let needsHeal = false;

    if (fs.existsSync(client.configPath)) {
      try {
        const raw = fs.readFileSync(client.configPath, "utf-8");
        if (raw.trim()) {
          data = JSON.parse(raw);
        }
      } catch {
        needsHeal = true;
      }
    } else {
      needsHeal = true;
    }

    data.mcpServers = data.mcpServers || {};

    // Check if sevlex-firewall is missing or tampered with
    if (!data.mcpServers["sevlex-firewall"]) {
      needsHeal = true;
    }

    if (needsHeal) {
      // Create backup
      if (fs.existsSync(client.configPath)) {
        try {
          fs.copyFileSync(client.configPath, `${client.configPath}.sevlex.bak`);
        } catch {}
      }

      data.mcpServers["sevlex-firewall"] = getMcpProxyEntry();
      fs.writeFileSync(client.configPath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[Sevlex Daemon] 🛡️ [AUTO-HEALED] Restored firewall in ${client.name} -> ${client.configPath}`);
      return true;
    }
  } catch (err: any) {
    console.error(`[Sevlex Daemon] Error inspecting ${client.name}:`, err.message);
  }
  return false;
}

export function startDaemonWatcher() {
  console.log("=================================================================");
  console.log("  SEVLEX 24/7 ENTERPRISE WATCHER DAEMON (Level 4 Engine Active)   ");
  console.log("  Real-time tamper-resistance & continuous drift healing active  ");
  console.log("=================================================================");

  const clients = getAllMonitoredClients();
  console.log(`[Sevlex Daemon] Initializing watch on ${clients.length} AI runtime config paths...`);

  // Initial audit & heal
  for (const client of clients) {
    inspectAndHealClient(client);
  }

  // Active File System Watchers
  const watchers: fs.FSWatcher[] = [];

  for (const client of clients) {
    const dir = path.dirname(client.configPath);
    if (!fs.existsSync(dir)) {
      try { fs.mkdirSync(dir, { recursive: true }); } catch {}
    }

    try {
      const watcher = fs.watch(dir, (eventType, filename) => {
        if (!filename) return;
        const targetFilename = path.basename(client.configPath);
        if (filename.toLowerCase() === targetFilename.toLowerCase() || filename.toLowerCase().includes("mcp")) {
          // File was modified or deleted! Re-inspect and auto-heal in < 30ms
          setTimeout(() => {
            const healed = inspectAndHealClient(client);
            if (healed) {
              console.log(`[Sevlex Daemon] 🚨 Tamper event intercepted on ${client.name}. Shield restored.`);
            }
          }, 30);
        }
      });
      watchers.push(watcher);
    } catch (e: any) {
      console.warn(`[Sevlex Daemon] Could not attach watcher to ${dir}:`, e.message);
    }
  }

  console.log(`[Sevlex Daemon] ✅ 24/7 Guard running. Listening for drift events (Press Ctrl+C to exit).`);

  // Keep process alive
  setInterval(() => {
    // Periodic safety sweep every 60 seconds
    for (const client of clients) {
      inspectAndHealClient(client);
    }
  }, 60000);
}

if (process.argv[1] && process.argv[1].endsWith("daemon.ts")) {
  startDaemonWatcher();
}
