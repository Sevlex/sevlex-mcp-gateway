@echo off
echo Starting Sevlex Enterprise MCP Gateway MVP...

echo Booting Gateway...
start "Sevlex Gateway" cmd /k "cd gateway && npx tsx src/gateway.ts"

echo Booting Dashboard...
start "Sevlex Dashboard" cmd /k "cd dashboard && npm run dev"

echo Both services launched successfully.
