# ==============================================================================
# Sevlex Enterprise Win32 App Silent Uninstaller (Microsoft Intune)
# Standard: Win32 App Packaging (.intunewin)
# ==============================================================================

[CmdletBinding()]
param()

$SysDir = "C:\ProgramData\Sevlex"

# 1. Unhook all AI tools across user profiles
$Profiles = @($env:USERPROFILE)
if (Test-Path "C:\Users") {
    $Profiles = Get-ChildItem -Path "C:\Users" -Directory | Where-Object { 
        $_.Name -notmatch "^(Public|Default|All Users|Default User)$" 
    } | ForEach-Object { $_.FullName }
}

foreach ($p in $Profiles) {
    $Configs = @(
        (Join-Path $p "AppData\Roaming\Claude\claude_desktop_config.json"),
        (Join-Path $p ".claude.json"),
        (Join-Path $p ".cursor\mcp.json"),
        (Join-Path $p ".codeium\windsurf\mcp_config.json"),
        (Join-Path $p ".gemini\config\mcp_config.json")
    )

    foreach ($cfg in $Configs) {
        if (Test-Path $cfg) {
            try {
                $raw = Get-Content -Path $cfg -Raw -Encoding UTF8 | ConvertFrom-Json
                if ($raw.mcpServers -and $raw.mcpServers.PSObject.Properties['sevlex-firewall']) {
                    $raw.mcpServers.PSObject.Properties.Remove('sevlex-firewall')
                    $raw | ConvertTo-Json -Depth 10 | Set-Content -Path $cfg -Encoding UTF8
                }
            } catch {}
        }
    }
}

# 2. Clean ProgramData
if (Test-Path $SysDir) {
    Remove-Item -Path $SysDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output "Sevlex uninstallation finished cleanly."
exit 0
