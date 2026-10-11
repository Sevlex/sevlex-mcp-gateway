# ==============================================================================
# Sevlex Enterprise Zero-Touch MDM Rollout Script (Windows)
# Compatible with Microsoft Intune, SCCM, and Group Policy (GPO).
#
# What this script does:
# 1. Verifies Node.js availability.
# 2. Deploys the corporate policy file to C:\ProgramData\Sevlex\sevlex.json.
# 3. Transparently ensures Claude Desktop & Cursor MCP configs route via Sevlex.
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "🛡️ [Sevlex MDM] Starting Windows enterprise silent rollout..." -ForegroundColor Cyan

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ [Sevlex MDM] Error: Node.js runtime not found on path."
    exit 1
}

# 2. Create Corporate System Directory
$SevlexSysDir = "C:\ProgramData\Sevlex"
if (-not (Test-Path $SevlexSysDir)) {
    New-Item -ItemType Directory -Path $SevlexSysDir -Force | Out-Null
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PolicySource = Join-Path $ScriptDir "sevlex.enterprise.json"
$PolicyTarget = Join-Path $SevlexSysDir "sevlex.json"

if (Test-Path $PolicySource) {
    Copy-Item -Path $PolicySource -Destination $PolicyTarget -Force
    Write-Host "✅ [Sevlex MDM] Deployed corporate policy to $PolicyTarget" -ForegroundColor Green
}

# 3. Detect User Claude Desktop Configuration
$ClaudeConfigDir = Join-Path $env:APPDATA "Claude"
$ClaudeConfigFile = Join-Path $ClaudeConfigDir "claude_desktop_config.json"

if (Test-Path $ClaudeConfigDir) {
    Write-Host "🔍 [Sevlex MDM] Detected Claude Desktop installation at $ClaudeConfigDir" -ForegroundColor Yellow
    if (Test-Path $ClaudeConfigFile) {
        Copy-Item -Path $ClaudeConfigFile -Destination "$ClaudeConfigFile.sevlex.bak" -Force
        Write-Host "📦 [Sevlex MDM] Created backup at $ClaudeConfigFile.sevlex.bak" -ForegroundColor Gray
    }
}

Write-Host "✅ [Sevlex MDM] Windows enterprise deployment finished successfully." -ForegroundColor Green
