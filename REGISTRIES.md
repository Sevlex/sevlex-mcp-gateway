# 🌐 Sevlex MCP Registry & Ecosystem Distribution Handbook

This document contains the exact submission templates, configurations, and steps to list **Sevlex** across all major Model Context Protocol (MCP) registries and Anthropic's official repository.

---

## 1. Smithery.ai (Largest MCP Registry)

Smithery automatically indexes repositories with a `smithery.yaml` file.

- **Status:** `smithery.yaml` is configured in the repository root.
- **Submission URL:** [https://smithery.ai/new](https://smithery.ai/new)
- **Repository URL:** `https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway` (or `https://github.com/Sevlex/sevlex-mcp-gateway`)
- **Package Name:** `sevlex`
- **Category:** `Security & Governance` / `Developer Tools`
- **Tags:** `security`, `gateway`, `zero-trust`, `firewall`, `dlp`, `audit`, `claude`, `cursor`

### Install Command Generated for Users:
```bash
npx -y @smithery/cli install sevlex --client claude
```

---

## 2. Anthropic Official MCP Servers Repository

Anthropic maintains the official community servers list at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

### How to Submit a Pull Request (PR):
1. Fork [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).
2. Edit `README.md` to add Sevlex under the **"Frameworks & Gateways"** or **"Security & Infrastructure"** section:

```markdown
- [Sevlex](https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway) - Enterprise Layer 7 Zero-Trust security gateway, AST parameter firewall, and DLP control plane for Claude, Cursor, and autonomous coding agents.
```

3. Submit the Pull Request with this PR description:

```markdown
### Summary
Add Sevlex to the official MCP Community Gateways list.

### Description
Sevlex is an open-source, sub-millisecond Layer 7 Zero-Trust security gateway and runtime firewall for the Model Context Protocol (MCP). It transparently inspects JSON-RPC 2.0 tool calls over stdio and SSE streams, arresting destructive database DDL (DROP/ALTER/DELETE), path traversals, and credential leaks in real-time.

- **GitHub:** https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway
- **npm:** `sevlex` (https://www.npmjs.com/package/sevlex)
- **Website:** https://sevlex.com
- **License:** Apache-2.0
```

---

## 3. mcp.so (Curated Directory)

- **Submission URL:** [https://mcp.so/submit](https://mcp.so/submit)
- **Name:** Sevlex
- **Tagline:** Enterprise Layer 7 Zero-Trust Security Gateway for MCP
- **Description:** Real-time deep packet inspection, AST normalization, in-flight DLP credential redaction, and Slack Human-in-the-Loop dual custody for Claude Desktop and Cursor IDE.
- **GitHub Link:** `https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway`
- **NPM Package:** `sevlex`
- **Website:** `https://sevlex.com`

---

## 4. Glama.ai (Enterprise MCP Index)

- **Submission URL:** [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)
- **Sign In:** Sign in with GitHub.
- **Add Server:** Paste `meetpanchal-sevlex/sevlex-mcp-gateway`.
- **Capabilities Checked:**
  - `stdio` Transport: Supported (`npx sevlex`)
  - `sse` Transport: Supported (`npx sevlex sse <port> <url>`)
  - Security Clearance: Merkle tree SHA-256 tamper-evident audit receipts.

---

## 5. Live Lead & Alert Configurations (Vercel)

To receive real-time notifications on your phone whenever an enterprise lead submits the `/service` intake form, add any of these environment variables in your **Vercel Project Settings > Environment Variables**:

| Variable | Platform | Example Value |
| :--- | :--- | :--- |
| `SLACK_WEBHOOK_URL` | **Slack** | `https://hooks.slack.com/services/T.../B.../...` |
| `DISCORD_WEBHOOK_URL` | **Discord** | `https://discord.com/api/webhooks/.../...` |
| `TELEGRAM_BOT_TOKEN` | **Telegram** | `7123456789:AAF...` |
| `TELEGRAM_CHAT_ID` | **Telegram** | `123456789` |
| `INTAKE_WEBHOOK_URL` | **Zapier / Make / n8n** | `https://hook.eu1.make.com/...` |
