#!/usr/bin/env bash
# ==============================================================================
# Sevlex Enterprise Package Silent Uninstaller (Jamf Pro / macOS)
# ==============================================================================
set -euo pipefail

TARGET_USER="${SUDO_USER:-$(whoami)}"
USER_HOME=$(eval echo "~$TARGET_USER")

# Restore configs
CONFIGS=(
  "$USER_HOME/Library/Application Support/Claude/claude_desktop_config.json"
  "$USER_HOME/.claude.json"
  "$USER_HOME/.cursor/mcp.json"
  "$USER_HOME/.codeium/windsurf/mcp_config.json"
  "$USER_HOME/.gemini/config/mcp_config.json"
)

for cfg in "${CONFIGS[@]}"; do
  if [ -f "$cfg" ]; then
    python3 - <<EOF || true
import json, os
p = "$cfg"
try:
  with open(p, "r") as f: data = json.load(f)
  if "mcpServers" in data and "sevlex-firewall" in data["mcpServers"]:
    del data["mcpServers"]["sevlex-firewall"]
    with open(p, "w") as f: json.dump(data, f, indent=2)
except Exception: pass
EOF
  fi
done

rm -rf /etc/sevlex || true
echo "✅ Sevlex removed cleanly from macOS host."
exit 0
