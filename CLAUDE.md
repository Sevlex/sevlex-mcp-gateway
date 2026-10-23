# Sevlex AI Assistant Guide (CLAUDE.md)

Welcome! You are an AI coding agent operating in or configuring the **Sevlex Enterprise Model Context Protocol (MCP) Security Gateway**.

## 1. What is Sevlex?
Sevlex is a transparent Layer 7 Zero-Trust Security Firewall that intercepts `stdio` and `SSE` JSON-RPC traffic between AI runtimes (Cursor, Claude Desktop, Windsurf, Antigravity) and downstream MCP tools (PostgreSQL, Filesystem, GitHub, AWS, Slack).

It protects hosts by:
- Intercepting destructive AST commands (`DROP TABLE`, `TRUNCATE`, `rm -rf /`, `cat ~/.aws/credentials`).
- Redacting private credentials & API keys in-flight (DLP).
- Breaking recursive hallucination loops with velocity limiting.
- Writing cryptographically verifiable SHA-256 Merkle chain audit receipts into SQLite WAL mode.

---

## 2. Standard Agent Workflows & Commands

### A. Automatic Host Shielding
To automatically discover and wrap all installed MCP clients on this host:
```bash
npx sevlex init
```
*Note: This command safely backs up original configs to `*.sevlex.bak` before making changes.*

### B. Machine-Readable Agent Execution (`--json`)
If you are running in automated pipelines or scripting, pass `--json` to receive structured JSON output:
```bash
npx sevlex init --json
npx sevlex status --json
npx sevlex verify --json
```

### C. Self-Contained Interception Verification
To test and verify that Layer 7 parameter inspection is arresting destructive commands in <3ms:
```bash
npx sevlex demo
```

### D. Reverting to Original Configurations
To unhook Sevlex and restore original client configs from backup at any time:
```bash
npx sevlex restore
```

---

## 3. Architecture & Repository Structure

- `gateway/`:
  - `src/gateway.ts`: Core Layer 7 proxy engine. Intercepts JSON-RPC `tools/call`, performs AST validation, and logs receipts.
  - `src/cli.ts`: Developer CLI (`npx sevlex init`, `demo`, `status`, `verify`).
  - `src/daemon.ts`: Background auto-heal watcher (<30ms tamper recovery).
  - `src/toolguard.ts`: AST parameter rules for SQL, shell, and filesystem access.
  - `src/agentguard.ts`: Circuit breaker and velocity limiter.
  - `src/logger.ts`: SQLite WAL cryptographic Merkle hash chain logger.
- `dashboard/`:
  - Next.js App Router SecOps Console (`app.sevlex.com` and `sevlex.com`).
  - `src/app/page.tsx`: Landing page with interactive in-browser Exploit Simulator.
  - `src/app/console/page.tsx`: Obsidian SecOps dashboard.

---

## 4. Policy Customization (`sevlex.json`)
The firewall is governed by `sevlex.json`:
```json
{
  "policy": {
    "defaultAction": "ALLOW",
    "blockedTools": ["delete_database", "drop_table", "cat_env_file"],
    "approvalRequiredTools": ["production_deploy", "modify_iam_role"],
    "parameterRules": {
      "enabled": true
    },
    "dlp": {
      "enabled": true
    }
  }
}
```
