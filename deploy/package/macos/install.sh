#!/usr/bin/env bash
# ==============================================================================
# Sevlex Enterprise Package Silent Installer (Jamf Pro / macOS)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEVLEX_DIR="/etc/sevlex"
mkdir -p "$SEVLEX_DIR"

# Copy package payload to /etc/sevlex
cp -R "$SCRIPT_DIR"/* "$SEVLEX_DIR"/ || true

# Run universal deployment
if [ -f "$SEVLEX_DIR/deploy-mdm.sh" ]; then
  bash "$SEVLEX_DIR/deploy-mdm.sh"
fi

echo "✅ Sevlex Jamf package installed successfully."
exit 0
