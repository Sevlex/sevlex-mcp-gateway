# AGENTS.md — AI Agent Integration & Automation Protocol

This document defines the interface for autonomous coding agents (Claude Code, Cursor Composer, Windsurf Cascade, Devin, GitHub Copilot) to inspect, configure, and maintain **Sevlex**.

## Core Commands for Autonomous Agents

| Goal | Command | Description |
|---|---|---|
| **Auto-Shield Host** | `npx sevlex init` | Auto-detects Claude Desktop, Cursor, Windsurf; wraps local MCP tools in L7 firewall |
| **Machine Output** | `npx sevlex init --json` | Returns clean JSON with discovered runtimes and wrapped servers |
| **Verify Protection** | `npx sevlex demo` | Runs live self-contained test proving SQL injection & exfiltration are blocked in <3ms |
| **Check Telemetry** | `npx sevlex status` | Diagnostics report, active policy rules, Merkle chain receipt count |
| **Cryptographic Audit** | `npx sevlex verify` | Verifies SHA-256 Merkle chain integrity across SQLite WAL entries |
| **Safe Revert** | `npx sevlex restore` | Safely unwraps all clients and restores from `*.sevlex.bak` backups |

## Machine-Readable Web Standard
For web-browsing agents requiring full documentation in text format, access:
`https://sevlex.com/llms.txt`

## Safety Guarantees for AI Agents
1. **Never destructive**: All existing config files (`claude_desktop_config.json`, `~/.cursor/mcp.json`, `windsurf/mcp_config.json`) are backed up to `*.sevlex.bak` prior to modification.
2. **Never fails open on corrupt payloads**: Invalid JSON or malformed tokens are arrested to prevent bypass.
3. **Sub-3ms wire latency**: Safe developer queries pass with zero friction (`<0.2ms` average).
