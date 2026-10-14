# ==============================================================================
# Sevlex Enterprise Win32 App Silent Installer (Microsoft Intune)
# Standard: Win32 App Packaging (.intunewin)
# Execution: SYSTEM Account / Administrative Mode
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$SysDir = "C:\ProgramData\Sevlex"
if (-not (Test-Path $SysDir)) {
    New-Item -ItemType Directory -Path $SysDir -Force | Out-Null
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Copy binary & policy to ProgramData
Copy-Item -Path (Join-Path $ScriptDir "*") -Destination $SysDir -Recurse -Force

# Execute CLI install routine
if (Test-Path (Join-Path $SysDir "deploy-mdm.ps1")) {
    & (Join-Path $SysDir "deploy-mdm.ps1")
}

Write-Output "Sevlex enterprise rollout finished successfully."
exit 0
