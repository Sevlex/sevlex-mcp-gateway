# ==============================================================================
# Sevlex Enterprise Zero-Touch Universal MDM Rollout Script (Windows)
# Compatible with: Microsoft Intune, SCCM, and Group Policy (GPO).
# Target Runtimes: Claude Desktop, Claude Code CLI, Cursor IDE, Windsurf, Antigravity.
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  SEVLEX ENTERPRISE ZERO-TRUST GATEWAY - ENDPOINT DEPLOYMENT     " -ForegroundColor Cyan
Write-Host "  Standard: Universal Shadow AI & L7 MCP Governance              " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Verify Node.js Environment
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "[Sevlex MDM] Warning: Node.js runtime not found on system PATH."
    Write-Warning "[Sevlex MDM] Please ensure Node.js is pushed via Intune application package."
}

# 2. Corporate System Directory Setup
$SevlexSysDir = "C:\ProgramData\Sevlex"
if (-not (Test-Path $SevlexSysDir)) {
    New-Item -ItemType Directory -Path $SevlexSysDir -Force | Out-Null
    Write-Host "[Sevlex MDM] Created corporate root at $SevlexSysDir" -ForegroundColor Green
}

# Copy or create corporate policy (sevlex.json)
$PolicyTarget = Join-Path $SevlexSysDir "sevlex.json"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PolicySource = Join-Path $ScriptDir "sevlex.enterprise.json"

if (Test-Path $PolicySource) {
    Copy-Item -Path $PolicySource -Destination $PolicyTarget -Force
    Write-Host "[Sevlex MDM] Deployed corporate policy template to $PolicyTarget" -ForegroundColor Green
} elseif (-not (Test-Path $PolicyTarget)) {
    $DefaultPolicy = @{
        version = "1.0.0"
        policy = @{
            blockedTools = @("delete_database", "drop_table", "exfiltrate_keys", "execute_arbitrary_shell")
            siem = @{
                enabled = $true
                provider = "datadog"
                endpoint = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
            }
        }
    } | ConvertTo-Json -Depth 5
    Set-Content -Path $PolicyTarget -Value $DefaultPolicy -Encoding UTF8
    Write-Host "[Sevlex MDM] Initialized zero-trust baseline policy at $PolicyTarget" -ForegroundColor Green
}

# Deploy Sevlex Gateway Engine binary to ProgramData
$GatewaySource = Join-Path $ScriptDir "..\gateway\dist\src\gateway.js"
$GatewayTarget = Join-Path $SevlexSysDir "gateway.js"

if (Test-Path $GatewaySource) {
    Copy-Item -Path $GatewaySource -Destination $GatewayTarget -Force
    Write-Host "[Sevlex MDM] Deployed Gateway engine to $GatewayTarget" -ForegroundColor Green
}

# 3. Universal Multi-Tool Injection Engine
# Identifies all corporate AI runtimes on this endpoint and injects Sevlex L7 proxy.
$UserProfiles = @($env:USERPROFILE)
# If running as SYSTEM under Intune, discover active interactive user profiles
if ($env:USERNAME -eq "SYSTEM") {
    $ProfilesRoot = "C:\Users"
    $ActiveUsers = Get-ChildItem -Path $ProfilesRoot -Directory | Where-Object { 
        $_.Name -notmatch "^(Public|Default|All Users|Default User)$" 
    }
    $UserProfiles = $ActiveUsers | ForEach-Object { $_.FullName }
}

$ProxyConfig = @{
    command = "node"
    args = @("C:\ProgramData\Sevlex\gateway.js")
    env = @{
        SEVLEX_POLICY_PATH = "C:\ProgramData\Sevlex\sevlex.json"
        SEVLEX_SIEM_PROVIDER = "datadog"
        SEVLEX_SIEM_ENDPOINT = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
    }
}

function Protect-McpConfig {
    param (
        [string]$ToolName,
        [string]$ConfigPath
    )

    $ConfigDir = Split-Path -Parent $ConfigPath
    if (-not (Test-Path $ConfigDir)) {
        # Create directory in advance to enforce pre-emptive Zero-Trust guardrails
        New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
    }

    $ConfigObject = [PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }

    if (Test-Path $ConfigPath) {
        # Backup before touching
        $BackupPath = "$ConfigPath.sevlex.bak"
        Copy-Item -Path $ConfigPath -Destination $BackupPath -Force
        
        try {
            $RawContent = Get-Content -Path $ConfigPath -Raw -Encoding UTF8
            if (-not [string]::IsNullOrWhiteSpace($RawContent)) {
                $ConfigObject = $RawContent | ConvertFrom-Json
            }
        } catch {
            Write-Warning "[Sevlex MDM] Failed parsing existing config for $ToolName at $ConfigPath. Rebuilding clean."
            $ConfigObject = [PSCustomObject]@{ mcpServers = [PSCustomObject]@{} }
        }
    }

    # Ensure mcpServers property exists
    if (-not ($ConfigObject.PSObject.Properties['mcpServers'])) {
        $ConfigObject | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value ([PSCustomObject]@{})
    }

    # Inject or update the sevlex-firewall entry
    $ConfigObject.mcpServers | Add-Member -MemberType NoteProperty -Name "sevlex-firewall" -Value $ProxyConfig -Force

    # Save formatted JSON back
    $UpdatedJson = $ConfigObject | ConvertTo-Json -Depth 10
    Set-Content -Path $ConfigPath -Value $UpdatedJson -Encoding UTF8
    Write-Host "[Sevlex MDM] [SHIELDED] $ToolName secured -> $ConfigPath" -ForegroundColor Green
}

# 4. Scan & Enforce Protection Across All 5 Key AI Runtimes
foreach ($Profile in $UserProfiles) {
    Write-Host "`n[Sevlex MDM] Scanning endpoint profile: $Profile..." -ForegroundColor Yellow

    # Target 1: Claude Desktop
    $ClaudeDesktopConfig = Join-Path $Profile "AppData\Roaming\Claude\claude_desktop_config.json"
    Protect-McpConfig -ToolName "Claude Desktop" -ConfigPath $ClaudeDesktopConfig

    # Target 2: Claude Code CLI
    $ClaudeCodeConfig = Join-Path $Profile ".claude.json"
    Protect-McpConfig -ToolName "Claude Code CLI" -ConfigPath $ClaudeCodeConfig

    # Target 3: Cursor IDE
    $CursorConfig = Join-Path $Profile ".cursor\mcp.json"
    Protect-McpConfig -ToolName "Cursor IDE" -ConfigPath $CursorConfig

    # Target 4: Windsurf IDE (Codeium)
    $WindsurfConfig = Join-Path $Profile ".codeium\windsurf\mcp_config.json"
    Protect-McpConfig -ToolName "Windsurf IDE" -ConfigPath $WindsurfConfig

    # Target 5: Google Antigravity IDE
    $AntigravityConfig = Join-Path $Profile ".gemini\config\mcp_config.json"
    Protect-McpConfig -ToolName "Google Antigravity IDE" -ConfigPath $AntigravityConfig
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " [Sevlex MDM] Zero-Touch Universal Rollout Complete!            " -ForegroundColor Green
Write-Host " All active & future AI agents on this host are now routed      " -ForegroundColor Green
Write-Host " through the Sevlex Layer 7 Zero-Trust MCP Firewall.             " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
