// Test script for gateway.ts
import { spawn } from 'child_process';

const gateway = spawn('npx', ['tsx', 'src/gateway.ts', 'node', 'test_tool.js'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'inherit']
});

gateway.stdout.on('data', (data) => {
  console.log(`Received from gateway: ${data.toString()}`);
  
  if (data.toString().includes('result')) {
    // We expect the tools to be added to discovered_tools.json
    console.log('Got response. Waiting for JSON write...');
    setTimeout(() => {
      gateway.kill();
      process.exit(0);
    }, 1000);
  }
});

// Send tools/list request
const request = {
  jsonrpc: '2.0',
  method: 'tools/list',
  id: 1
};

console.log('Sending request...');
gateway.stdin.write(JSON.stringify(request) + '\n');
