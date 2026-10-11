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
    if (fs.existsSync(toolsPath)) {
      try {
        const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
        if (Array.isArray(toolsData)) {
          serverCount = toolsData.length;
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

    const runtimes = [
      {
        name: 'Claude Code CLI',
        type: 'Terminal CLI Agent',
        installed: fs.existsSync(claudeCodePath),
        configured: claudeCodeConfigured,
        configPath: claudeCodePath,
        status: claudeCodeConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active',
      },
      {
        name: 'Claude Desktop',
        type: 'Native Desktop App',
        installed: fs.existsSync(claudeDesktopPath),
        configured: claudeDesktopConfigured,
        configPath: claudeDesktopPath,
        status: claudeDesktopConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active',
      },
      {
        name: 'Google Antigravity IDE',
        type: 'Autonomous Agent Environment',
        installed: fs.existsSync(antigravityPath),
        configured: antigravityConfigured,
        configPath: antigravityPath,
        status: antigravityConfigured ? 'SHIELDED' : 'DETECTED',
        lastActivity: 'Active',
      },
      {
        name: 'Cursor IDE',
        type: 'AI Code Editor',
        installed: false,
        configured: false,
        configPath: path.join(homedir, '.cursor', 'mcp.json'),
        status: 'READY_TO_CONNECT',
        lastActivity: 'Standby',
      },
    ];

    return NextResponse.json({
      host: hostDetails,
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
