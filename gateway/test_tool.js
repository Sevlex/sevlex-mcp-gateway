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
            { name: 'read_company_knowledge', description: 'Read safe internal company documentation and guides', inputSchema: { type: 'object', properties: { topic: { type: 'string' } } } },
            { name: 'delete_database', description: 'Permanently drop and wipe company database tables', inputSchema: { type: 'object', properties: { confirm: { type: 'boolean' } } } }
          ]
        }
      };
      console.log(JSON.stringify(response));
    } else if (msg.method === 'tools/call') {
      const response = {
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          content: [{ type: 'text', text: `Tool ${msg.params?.name} executed successfully` }]
        }
      };
      console.log(JSON.stringify(response));
    }
  } catch (e) {
    // ignore
  }
});
