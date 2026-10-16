#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '⚡ Launching Sevlex Zero-Trust Gateway & Dashboard...\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const gateway = spawn(npmCmd, ['run', 'dev', '--prefix', 'gateway'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWin
});

const dashboard = spawn(npmCmd, ['run', 'dev', '--prefix', 'dashboard'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWin
});

function cleanup() {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down Sevlex processes...');
  try { gateway.kill(); } catch (_) {}
  try { dashboard.kill(); } catch (_) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
