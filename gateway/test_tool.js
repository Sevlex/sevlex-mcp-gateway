// Fake tool server
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const msg = JSON.parse(line);
    if (msg.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          tools: [
            { name: 'fake_tool_1', description: 'desc 1' },
            { name: 'fake_tool_2', description: 'desc 2' }
          ]
        }
      };
      console.log(JSON.stringify(response));
    }
  } catch (e) {
    // ignore
  }
});
