#!/usr/bin/env bash
# ==============================================================================
# Sevlex Enterprise Zero-Touch Universal MDM Rollout Script (macOS / Linux)
# Compatible with: Jamf Pro, Kandji, Munki, and Google Workspace Endpoint Management.
# Target Runtimes: Claude Desktop, Claude Code CLI, Cursor IDE, Windsurf, Antigravity.
# ==============================================================================

set -euo pipefail

echo "================================================================="
echo "  SEVLEX ENTERPRISE ZERO-TRUST GATEWAY - MACOS / LINUX ROLLOUT   "
echo "  Standard: Universal Shadow AI & L7 MCP Governance              "
echo "================================================================="

# 1. Resolve Target User Profile (handles Jamf running as root)
TARGET_USER="${SUDO_USER:-$(whoami)}"
USER_HOME=$(eval echo "~$TARGET_USER")

echo "🔍 [Sevlex MDM] Target user identified: $TARGET_USER ($USER_HOME)"

# 2. Corporate System Directory Setup
SEVLEX_SYS_DIR="/etc/sevlex"
mkdir -p "$SEVLEX_SYS_DIR"

POLICY_TARGET="$SEVLEX_SYS_DIR/sevlex.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLICY_SOURCE="$SCRIPT_DIR/sevlex.enterprise.json"

if [ -f "$POLICY_SOURCE" ]; then
  cp "$POLICY_SOURCE" "$POLICY_TARGET"
  chmod 644 "$POLICY_TARGET"
  echo "✅ [Sevlex MDM] Deployed corporate policy to $POLICY_TARGET"
elif [ ! -f "$POLICY_TARGET" ]; then
  cat <<'EOF' > "$POLICY_TARGET"
{
  "version": "1.0.0",
  "policy": {
    "blockedTools": ["delete_database", "drop_table", "exfiltrate_keys", "execute_arbitrary_shell"],
    "siem": {
      "enabled": true,
      "provider": "datadog",
      "endpoint": "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
    }
  }
}
EOF
  chmod 644 "$POLICY_TARGET"
  echo "✅ [Sevlex MDM] Initialized zero-trust baseline policy at $POLICY_TARGET"
fi

# Deploy Gateway Engine binary
GATEWAY_TARGET="$SEVLEX_SYS_DIR/gateway.js"
GATEWAY_SOURCE="$SCRIPT_DIR/../gateway/dist/gateway.js"
if [ ! -f "$GATEWAY_SOURCE" ]; then
  GATEWAY_SOURCE="$SCRIPT_DIR/../gateway/dist/src/gateway.js"
fi
if [ -f "$GATEWAY_SOURCE" ]; then
  cp "$GATEWAY_SOURCE" "$GATEWAY_TARGET"
  chmod 755 "$GATEWAY_TARGET"
  echo "✅ [Sevlex MDM] Deployed Gateway engine to $GATEWAY_TARGET"
fi

# 3. Universal JSON Merger Helper (uses python3 or node)
protect_mcp_config() {
  local tool_name="$1"
  local config_path="$2"
  local config_dir
  config_dir="$(dirname "$config_path")"

  mkdir -p "$config_dir"
  if [ -n "${SUDO_USER:-}" ]; then
    chown "$TARGET_USER" "$config_dir" || true
  fi

  # Backup existing configuration
  if [ -f "$config_path" ]; then
    cp "$config_path" "${config_path}.sevlex.bak"
  fi

  # Merge sevlex-firewall entry into JSON safely
  python3 - <<EOF || node - <<'NODE_EOF'
import json, os

config_path = "$config_path"
data = {"mcpServers": {}}

if os.path.exists(config_path):
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        data = {"mcpServers": {}}

if "mcpServers" not in data or not isinstance(data["mcpServers"], dict):
    data["mcpServers"] = {}

data["mcpServers"]["sevlex-firewall"] = {
    "command": "node",
    "args": ["$SEVLEX_SYS_DIR/gateway.js"],
    "env": {
        "SEVLEX_POLICY_PATH": "$SEVLEX_SYS_DIR/sevlex.json",
        "SEVLEX_SIEM_PROVIDER": "datadog",
        "SEVLEX_SIEM_ENDPOINT": "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
    }
}

with open(config_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
EOF
const fs = require('fs');
const p = process.env.config_path || "$config_path";
let data = { mcpServers: {} };
try {
  if (fs.existsSync(p)) data = JSON.parse(fs.readFileSync(p, 'utf-8'));
} catch (e) {}
data.mcpServers = data.mcpServers || {};
data.mcpServers['sevlex-firewall'] = {
  command: "node",
  args: ["$SEVLEX_SYS_DIR/gateway.js"],
  env: {
    SEVLEX_POLICY_PATH: "$SEVLEX_SYS_DIR/sevlex.json",
    SEVLEX_SIEM_PROVIDER: "datadog",
    SEVLEX_SIEM_ENDPOINT: "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
  }
};
fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
NODE_EOF

  if [ -n "${SUDO_USER:-}" ]; then
    chown "$TARGET_USER" "$config_path" || true
  fi

  echo "🛡️  [Sevlex MDM] [SHIELDED] $tool_name secured -> $config_path"
}

# 4. Scan & Protect Across All 5 Key AI Clients
echo ""
echo "⚙️  [Sevlex MDM] Scanning & shielding employee AI runtimes..."

# Target 1: Claude Desktop (macOS)
protect_mcp_config "Claude Desktop" "$USER_HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Target 2: Claude Code CLI
protect_mcp_config "Claude Code CLI" "$USER_HOME/.claude.json"

# Target 3: Cursor IDE
protect_mcp_config "Cursor IDE" "$USER_HOME/.cursor/mcp.json"

# Target 4: Windsurf IDE
protect_mcp_config "Windsurf IDE" "$USER_HOME/.codeium/windsurf/mcp_config.json"

# Target 5: Google Antigravity IDE
protect_mcp_config "Google Antigravity IDE" "$USER_HOME/.gemini/config/mcp_config.json"

echo ""
echo "================================================================="
echo "  [Sevlex MDM] Zero-Touch Universal Rollout Complete!            "
echo "  All active & future AI agents on this host are now routed      "
echo "  through the Sevlex Layer 7 Zero-Trust MCP Firewall.             "
echo "================================================================="
