@echo off
setlocal
powershell.exe -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -File "%~dp0uninstall.ps1"
exit /b %ERRORLEVEL%
