import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==============================================================================
// SEVLEX 24/7 TAMPER-RESISTANT WATCHER DAEMON (Level 4 Engine)
// Monitors employee AI tool configurations in real time.
// Auto-heals within 30ms if a developer attempts to delete or bypass the firewall.
// ==============================================================================

export interface MonitoredClient {
  name: string;
  configPath: string;
}

export function getMcpProxyEntry(userConfig?: { apiKey?: string | undefined; endpoint?: string | undefined }): Record<string, any> {
  const isWindows = process.platform === "win32";
  const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";
  const corporateGateway = path.join(sysDir, "gateway.js");
  const localGateway = path.resolve(__dirname, "gateway.js");
  const gatewayPath = fs.existsSync(corporateGateway) ? corporateGateway : localGateway;
  const userPolicy = path.join(os.homedir(), ".sevlex", "sevlex.json");
  const sysPolicy = path.join(sysDir, "sevlex.json");
  const localPolicy = path.resolve(__dirname, "../sevlex.json");
  const policyPath = fs.existsSync(userPolicy) ? userPolicy : fs.existsSync(sysPolicy) ? sysPolicy : localPolicy;

  const env: Record<string, string> = {
    SEVLEX_POLICY_PATH: policyPath,
  };

  if (userConfig?.apiKey) {
    env.SEVLEX_API_KEY = userConfig.apiKey;
    env.SEVLEX_INGEST_URL = `${(userConfig.endpoint || "https://app.sevlex.com").replace(/\/$/, "")}/api/ingest`;
  }

  return {
    command: "node",
    args: [gatewayPath],
    env,
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
      name: "Cline (VS Code Extension)",
      configPath: isWindows
        ? path.join(appData, "Code", "User", "globalStorage", "saoudrizwan.claude-dev", "settings", "cline_mcp_settings.json")
        : path.join(userHome, ".config", "Code", "User", "globalStorage", "saoudrizwan.claude-dev", "settings", "cline_mcp_settings.json")
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

export interface InjectionResult {
  client: string;
  configPath: string;
  status: "INJECTED" | "ALREADY_SHIELDED" | "NOT_FOUND" | "ERROR";
  wrappedServers: string[];
  totalServers: number;
  backupPath?: string | undefined;
  error?: string | undefined;
}

export function injectClient(client: MonitoredClient, userConfig?: { apiKey?: string | undefined; endpoint?: string | undefined }): InjectionResult {
  try {
    if (!fs.existsSync(client.configPath)) {
      return {
        client: client.name,
        configPath: client.configPath,
        status: "NOT_FOUND",
        wrappedServers: [],
        totalServers: 0,
      };
    }

    const raw = fs.readFileSync(client.configPath, "utf-8");
    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {
      return {
        client: client.name,
        configPath: client.configPath,
        status: "ERROR",
        wrappedServers: [],
        totalServers: 0,
        error: "Malformed JSON configuration file"
      };
    }

    data.mcpServers = data.mcpServers || {};
    const serverKeys = Object.keys(data.mcpServers);

    // Create safe backup if it does not exist
    const backupPath = `${client.configPath}.sevlex.bak`;
    if (!fs.existsSync(backupPath)) {
      try {
        fs.writeFileSync(backupPath, raw, "utf-8");
      } catch {}
    }

    const isWindows = process.platform === "win32";
    const sysDir = isWindows ? "C:\\ProgramData\\Sevlex" : "/etc/sevlex";
    const corporateGateway = path.join(sysDir, "gateway.js");
    const localGateway = path.resolve(__dirname, "gateway.js");
    const gatewayPath = fs.existsSync(corporateGateway) ? corporateGateway : localGateway;
    const userPolicy = path.join(os.homedir(), ".sevlex", "sevlex.json");
    const sysPolicy = path.join(sysDir, "sevlex.json");
    const localPolicy = path.resolve(__dirname, "../sevlex.json");
    const policyPath = fs.existsSync(userPolicy) ? userPolicy : fs.existsSync(sysPolicy) ? sysPolicy : localPolicy;

    const wrappedServers: string[] = [];

    for (const key of serverKeys) {
      if (key === "sevlex-firewall") continue;
      const srv = data.mcpServers[key];
      if (!srv || typeof srv !== "object") continue;

      // Check if already injected
      if (srv._sevlex_injected) continue;
      if (srv.args && Array.isArray(srv.args) && srv.args.some((a: string) => typeof a === "string" && a.includes("gateway.js"))) {
        continue;
      }

      // Preserve original invocation
      const originalCommand = srv.command;
      const originalArgs = Array.isArray(srv.args) ? srv.args : [];

      srv._sevlex_injected = true;
      srv._sevlex_original = {
        command: originalCommand,
        args: originalArgs,
        env: srv.env ? { ...srv.env } : undefined,
      };

      // Wrap command with Sevlex gateway
      srv.command = "node";
      srv.args = [gatewayPath, originalCommand, ...originalArgs];
      srv.env = {
        ...(srv.env || {}),
        SEVLEX_POLICY_PATH: policyPath,
        ...(userConfig?.apiKey ? { SEVLEX_API_KEY: userConfig.apiKey } : {}),
        ...(userConfig?.endpoint ? { SEVLEX_INGEST_URL: `${userConfig.endpoint.replace(/\/$/, '')}/api/ingest` } : {}),
      };

      wrappedServers.push(key);
    }

    // Ensure sevlex-firewall entry is also present
    if (!data.mcpServers["sevlex-firewall"]) {
      data.mcpServers["sevlex-firewall"] = getMcpProxyEntry(userConfig);
    }

    fs.writeFileSync(client.configPath, JSON.stringify(data, null, 2), "utf-8");

    return {
      client: client.name,
      configPath: client.configPath,
      status: wrappedServers.length > 0 || !serverKeys.includes("sevlex-firewall") ? "INJECTED" : "ALREADY_SHIELDED",
      wrappedServers,
      totalServers: Object.keys(data.mcpServers).filter(k => k !== "sevlex-firewall").length,
      backupPath: fs.existsSync(backupPath) ? backupPath : undefined,
    };
  } catch (err: any) {
    return {
      client: client.name,
      configPath: client.configPath,
      status: "ERROR",
      wrappedServers: [],
      totalServers: 0,
      error: err.message,
    };
  }
}

export interface RestoreResult {
  client: string;
  configPath: string;
  status: "RESTORED_FROM_BACKUP" | "UNWRAPPED_CLEAN" | "NOT_FOUND" | "NO_CHANGE";
  unwrappedServers: string[];
  error?: string | undefined;
}

export function restoreClient(client: MonitoredClient): RestoreResult {
  try {
    const backupPath = `${client.configPath}.sevlex.bak`;

    // Priority 1: Restore bit-for-bit from backup if available
    if (fs.existsSync(backupPath)) {
      try {
        const backupRaw = fs.readFileSync(backupPath, "utf-8");
        JSON.parse(backupRaw); // validate JSON before restoring
        fs.writeFileSync(client.configPath, backupRaw, "utf-8");
        try { fs.unlinkSync(backupPath); } catch {}
        return {
          client: client.name,
          configPath: client.configPath,
          status: "RESTORED_FROM_BACKUP",
          unwrappedServers: [],
        };
      } catch {}
    }

    // Priority 2: In-place unwrapping if backup is absent
    if (!fs.existsSync(client.configPath)) {
      return {
        client: client.name,
        configPath: client.configPath,
        status: "NOT_FOUND",
        unwrappedServers: [],
      };
    }

    const raw = fs.readFileSync(client.configPath, "utf-8");
    const data = JSON.parse(raw);
    const unwrappedServers: string[] = [];

    if (data.mcpServers) {
      if (data.mcpServers["sevlex-firewall"]) {
        delete data.mcpServers["sevlex-firewall"];
        unwrappedServers.push("sevlex-firewall");
      }

      for (const [key, srv] of Object.entries<any>(data.mcpServers)) {
        if (srv._sevlex_original) {
          srv.command = srv._sevlex_original.command;
          srv.args = srv._sevlex_original.args;
          if (srv._sevlex_original.env) {
            srv.env = srv._sevlex_original.env;
          } else {
            delete srv.env;
          }
          delete srv._sevlex_original;
          delete srv._sevlex_injected;
          unwrappedServers.push(key);
        } else if (srv.args && Array.isArray(srv.args) && srv.args[0]?.includes("gateway.js")) {
          srv.command = srv.args[1];
          srv.args = srv.args.slice(2);
          delete srv._sevlex_injected;
          unwrappedServers.push(key);
        }
      }

      fs.writeFileSync(client.configPath, JSON.stringify(data, null, 2), "utf-8");
    }

    return {
      client: client.name,
      configPath: client.configPath,
      status: unwrappedServers.length > 0 ? "UNWRAPPED_CLEAN" : "NO_CHANGE",
      unwrappedServers,
    };
  } catch (err: any) {
    return {
      client: client.name,
      configPath: client.configPath,
      status: "NO_CHANGE",
      unwrappedServers: [],
      error: err.message,
    };
  }
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
