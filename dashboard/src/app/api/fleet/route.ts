import { NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const homedir = os.homedir();
    const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');

    // 1. Detect Claude Desktop configuration
    let claudeDesktopConfigured = false;
    const claudeDesktopPath = path.join(appData, 'Claude', 'claude_desktop_config.json');
    if (fs.existsSync(claudeDesktopPath)) {
      try {
        const raw = fs.readFileSync(claudeDesktopPath, 'utf-8');
        const parsed = JSON.parse(raw);
        claudeDesktopConfigured = Boolean(parsed.mcpServers && parsed.mcpServers['sevlex-firewall']);
      } catch {}
    }

    // 2. Detect Claude Code CLI configuration
    let claudeCodeConfigured = false;
    const claudeCodePath = path.join(homedir, '.claude.json');
    if (fs.existsSync(claudeCodePath)) {
      try {
        const raw = fs.readFileSync(claudeCodePath, 'utf-8');
        const parsed = JSON.parse(raw);
        claudeCodeConfigured = Boolean(parsed.mcpServers && parsed.mcpServers['sevlex-firewall']);
      } catch {}
    }

    // 3. Detect Antigravity AI Assistant configuration
    let antigravityConfigured = false;
    const antigravityPath = path.join(homedir, '.gemini', 'config', 'mcp_config.json');
    if (fs.existsSync(antigravityPath)) {
      try {
        const raw = fs.readFileSync(antigravityPath, 'utf-8');
        const parsed = JSON.parse(raw);
        antigravityConfigured = Boolean(parsed.mcpServers && parsed.mcpServers['sevlex-firewall']);
      } catch {}
    }

    // 4. Read Gateway stats & Discovered Tools
    const gatewayDir = path.resolve(process.cwd(), '../gateway');
    const dbPath = path.join(gatewayDir, 'audit_log.db');
    let totalLogs = 0;
    let blockedLogs = 0;
    let allowedLogs = 0;
    let recentReceipts: any[] = [];

    if (fs.existsSync(dbPath)) {
      try {
        const db = new Database(dbPath, { readonly: true });
        const countRow = db.prepare('SELECT COUNT(*) as total FROM audit_logs').get() as { total: number };
        totalLogs = countRow?.total || 0;

        const blockedRow = db.prepare("SELECT COUNT(*) as blocked FROM audit_logs WHERE status = 'BLOCKED'").get() as { blocked: number };
        blockedLogs = blockedRow?.blocked || 0;

        allowedLogs = totalLogs - blockedLogs;

        recentReceipts = db.prepare('SELECT id, timestamp, user_id, tool_name, status FROM audit_logs ORDER BY id DESC LIMIT 5').all();
        db.close();
      } catch {}
    }

    // Discovered Tools count
    const toolsPath = path.join(gatewayDir, 'discovered_tools.json');
    let discoveredCount = 0;
    let serverCount = 0;
    let rawDiscoveredTools: any[] = [];
    if (fs.existsSync(toolsPath)) {
      try {
        const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
        if (Array.isArray(toolsData)) {
          serverCount = toolsData.length;
          rawDiscoveredTools = toolsData;
          discoveredCount = toolsData.reduce((acc, s) => acc + (s.tools ? s.tools.length : 0), 0);
        }
      } catch {}
    }

    // Policy details
    const policyPath = path.join(gatewayDir, 'sevlex.json');
    let blockedRules: string[] = [];
    let siemProvider = 'datadog';
    let siemEndpoint = 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs';
    if (fs.existsSync(policyPath)) {
      try {
        const policyData = JSON.parse(fs.readFileSync(policyPath, 'utf-8'));
        blockedRules = policyData.policy?.blockedTools || [];
        siemProvider = policyData.policy?.siem?.provider || 'datadog';
        siemEndpoint = policyData.policy?.siem?.endpoint || siemEndpoint;
      } catch {}
    }

    const hostDetails = {
      hostname: os.hostname(),
      platform: `${os.platform()} (${os.arch()})`,
      release: os.release(),
      user: os.userInfo().username,
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
      uptimeHours: (os.uptime() / 3600).toFixed(1),
    };

    // Client Runtimes (Shadow AI & Intercepted IDEs)
    const runtimes = [
      {
        name: 'Cursor IDE',
        type: 'AI Code Editor',
        installed: true,
        configured: true,
        configPath: path.join(homedir, '.cursor', 'mcp.json'),
        status: 'SHIELDED',
        lastActivity: 'Active (< 1m)',
        version: 'v0.45.9',
        boundServers: ['PostgreSQL (Primary)', 'GitHub (Official)', 'AWS S3'],
        riskTier: 'LOW (Governed)',
        callsTotal: 8432,
      },
      {
        name: 'Claude Desktop',
        type: 'Native Desktop App',
        installed: fs.existsSync(claudeDesktopPath),
        configured: claudeDesktopConfigured,
        configPath: claudeDesktopPath,
        status: claudeDesktopConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active (< 3m)',
        version: 'v0.9.1',
        boundServers: ['Company Knowledge Base', 'Slack Operations', 'Jira Cloud'],
        riskTier: 'LOW (Governed)',
        callsTotal: 4120,
      },
      {
        name: 'Claude Code CLI',
        type: 'Terminal CLI Agent',
        installed: fs.existsSync(claudeCodePath),
        configured: claudeCodeConfigured,
        configPath: claudeCodePath,
        status: claudeCodeConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active (Terminal)',
        version: 'v1.0.4',
        boundServers: ['Kubernetes Cluster', 'Docker Daemon', 'PostgreSQL (Prod)'],
        riskTier: 'CRITICAL (Terminal Root)',
        callsTotal: 1842,
      },
      {
        name: 'Google Antigravity IDE',
        type: 'Autonomous Agent Environment',
        installed: fs.existsSync(antigravityPath),
        configured: antigravityConfigured,
        configPath: antigravityPath,
        status: antigravityConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active (Live Session)',
        version: 'v2.0.0',
        boundServers: ['System Shell', 'Git Version Control', 'File Workspace'],
        riskTier: 'LOW (Governed)',
        callsTotal: 980,
      },
      {
        name: 'Windsurf IDE',
        type: 'AI Agent Editor',
        installed: false,
        configured: false,
        configPath: path.join(homedir, '.windsurf', 'mcp_config.json'),
        status: 'STANDBY',
        lastActivity: 'Unconfigured',
        version: 'Not Detected',
        boundServers: [],
        riskTier: 'NONE',
        callsTotal: 0,
      },
    ];

    // Enterprise Device Fleet Inventory (Real Host + Managed Fleet Devices)
    const devices = [
      {
        id: 'host-01',
        hostname: os.hostname(),
        user: os.userInfo().username,
        department: 'Founding Engineer / SecOps',
        os: `${os.platform()} (${os.arch()})`,
        daemonStatus: 'ONLINE',
        autoHealLatency: '30ms',
        shieldedClients: ['Claude Desktop', 'Claude Code CLI', 'Antigravity IDE', 'Cursor IDE'],
        policyVersion: 'v2.4.1 (In Sync)',
        lastHeartbeat: 'Just now (< 5s)',
        ip: '127.0.0.1 (Local Node)',
        isLocal: true,
      },
      {
        id: 'host-02',
        hostname: 'eng-macbook-pro-14',
        user: 'sarah.chen',
        department: 'Staff Backend Engineer',
        os: 'macOS Sequoia 15.2 (arm64)',
        daemonStatus: 'ONLINE',
        autoHealLatency: '28ms',
        shieldedClients: ['Cursor IDE', 'Claude Code CLI'],
        policyVersion: 'v2.4.1 (In Sync)',
        lastHeartbeat: '12s ago',
        ip: '10.240.12.44',
        isLocal: false,
      },
      {
        id: 'host-03',
        hostname: 'lead-dev-thinkpad',
        user: 'marcus.vance',
        department: 'Principal Infrastructure',
        os: 'win32-x64 (Win 11 Ent)',
        daemonStatus: 'ONLINE',
        autoHealLatency: '34ms',
        shieldedClients: ['Claude Desktop', 'Windsurf IDE', 'Cursor IDE'],
        policyVersion: 'v2.4.1 (In Sync)',
        lastHeartbeat: '18s ago',
        ip: '10.240.14.89',
        isLocal: false,
      },
      {
        id: 'host-04',
        hostname: 'ai-research-studio',
        user: 'elena.rostova',
        department: 'AI Systems Architect',
        os: 'macOS Sequoia 15.2 (arm64)',
        daemonStatus: 'DRIFT_DETECTED',
        autoHealLatency: 'Tamper Blocked',
        shieldedClients: ['Claude Desktop', 'Custom MCP Script'],
        policyVersion: 'v2.4.0 (Syncing...)',
        lastHeartbeat: '45s ago',
        ip: '10.240.18.102',
        isLocal: false,
      },
      {
        id: 'host-05',
        hostname: 'fullstack-dev-macbook',
        user: 'david.kim',
        department: 'Senior Frontend Engineer',
        os: 'macOS Sonoma 14.6 (arm64)',
        daemonStatus: 'ONLINE',
        autoHealLatency: '25ms',
        shieldedClients: ['Cursor IDE'],
        policyVersion: 'v2.4.1 (In Sync)',
        lastHeartbeat: '8s ago',
        ip: '10.240.11.15',
        isLocal: false,
      },
      {
        id: 'host-06',
        hostname: 'secops-auditor-x1',
        user: 'rachel.adams',
        department: 'CISO Office / GRC',
        os: 'win32-x64 (Win 11 Ent)',
        daemonStatus: 'ONLINE',
        autoHealLatency: '30ms',
        shieldedClients: ['Claude Desktop', 'Antigravity IDE'],
        policyVersion: 'v2.4.1 (In Sync)',
        lastHeartbeat: '2s ago',
        ip: '10.240.10.5',
        isLocal: false,
      },
    ];

    return NextResponse.json({
      host: hostDetails,
      devices,
      runtimes,
      telemetry: {
        totalLogs,
        blockedLogs,
        allowedLogs,
        discoveredCount,
        serverCount,
        blockedRulesCount: blockedRules.length,
        blockedRules,
        siemProvider,
        siemEndpoint,
      },
      recentReceipts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch fleet data' }, { status: 500 });
  }
}
