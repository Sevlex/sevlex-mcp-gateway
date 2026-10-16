@echo off
set ROOT_DIR=%~dp0..
cd /d "%ROOT_DIR%"
echo Starting Sevlex Enterprise MCP Gateway & Dashboard...

echo Booting Gateway Engine...
start "Sevlex Gateway" cmd /k "cd gateway && npx tsx src/gateway.ts"

echo Booting Next.js Dashboard...
start "Sevlex Dashboard" cmd /k "cd dashboard && npm run dev"

echo Both services launched successfully.

