# Dub.co Model Context Protocol (MCP) Connector

Official-spec Anthropic Model Context Protocol connector for **[Dub.co](https://dub.co)** link management, UTM campaign tracking, and real-time click analytics.

Built and secured by **Sevlex**.

---

## 🛠️ Included Tools

1. **`dub_create_link`**
   - Create branded shortlinks on Dub.co with custom slugs (`key`), custom domains (`dub.sh` or branded domain), comments, and UTM campaign parameters (`utm_source`, `utm_medium`, `utm_campaign`).
2. **`dub_list_links`**
   - Query recently created links, destination URLs, tags, and click counts with optional search and sorting.
3. **`dub_get_analytics`**
   - Retrieve real-time click analytics, top referrers (e.g. Twitter, LinkedIn), and geographic visitor breakdown.

---

## ⚡ Instant Setup in Claude Desktop

Add this configuration to your Claude Desktop config file:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dub": {
      "command": "node",
      "args": [
        "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\connectors\\dub-mcp\\dist\\index.js"
      ],
      "env": {
        "DUB_API_KEY": "YOUR_DUB_API_KEY"
      }
    }
  }
}
```

*(Note: If `DUB_API_KEY` is omitted, the connector automatically runs in interactive demo simulation mode so you can test the Claude workflow immediately!)*

---

## 🧪 Verification & Testing

To run the protocol handshake and tool test suite:

```bash
cd connectors/dub-mcp
npm run demo
# or
npx tsx scripts/test.ts
```

All 4 test suites will execute and verify JSON-RPC 2.0 handshake, schema discovery, link creation, and analytics retrieval.

---

## 🎥 45-Second Loom Demo Script (For Steven Tey)

1. **0:00 - 0:10:**
   > *"Hey Steven, love what you're building with Dub. I noticed Dub doesn't have an official Anthropic Claude MCP connector yet so users can create tracked links and query click analytics directly from Claude."*
2. **0:10 - 0:30:**
   > *(Type in Claude)*: *"Claude, write a short tweet announcing our new feature and create a shortlink for `https://sevlex.com` with UTM source `twitter` and campaign `ai_launch`."*
   > *(Show Claude invoking `dub_create_link` live on screen and generating `https://dub.sh/...`)*
3. **0:30 - 0:45:**
   > *"I built this prototype using Anthropic's official SDK and your REST API. If you'd like this hosted as a production Remote SSE server with 1-click OAuth for your users, let's talk!"*
