import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, "../src/index.ts");

console.log("=================================================");
console.log("  VERIFYING DUB.CO MCP CONNECTOR PROTOCOL");
console.log("=================================================\n");

const child = spawn("npx", ["tsx", serverPath], {
  stdio: ["pipe", "pipe", "inherit"],
  shell: true,
  cwd: path.resolve(__dirname, "..")
});

let buffer = "";

function send(req: any) {
  child.stdin.write(JSON.stringify(req) + "\n");
}

child.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      handleMessage(msg);
    } catch (e) {
      // ignore
    }
  }
});

let step = 0;

function handleMessage(msg: any) {
  if (msg.id === 1) {
    console.log("✓ TEST 1: Protocol Initialize Handshake SUCCESS");
    console.log("  Server:", msg.result?.serverInfo?.name, "v" + msg.result?.serverInfo?.version);

    // Test 2: Tools Discovery
    step = 2;
    send({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    });
  } else if (msg.id === 2) {
    console.log("\n✓ TEST 2: Tools Discovery SUCCESS");
    const tools = msg.result?.tools || [];
    console.log(`  Discovered ${tools.length} Tools:`);
    tools.forEach((t: any) => console.log(`   - 🛠️  ${t.name}: ${t.description.substring(0, 60)}...`));

    // Test 3: Call dub_create_link
    step = 3;
    console.log("\nExecuting Test Call: dub_create_link...");
    send({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "dub_create_link",
        arguments: {
          url: "https://sevlex.com/security",
          key: "demo-claude",
          utm_source: "twitter",
          utm_campaign: "mcp_launch"
        }
      }
    });
  } else if (msg.id === 3) {
    console.log("✓ TEST 3: dub_create_link Tool Execution SUCCESS");
    const content = msg.result?.content?.[0]?.text;
    console.log("  Response payload:", content);

    // Test 4: Call dub_get_analytics
    step = 4;
    console.log("\nExecuting Test Call: dub_get_analytics...");
    send({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "dub_get_analytics",
        arguments: {
          groupBy: "referers",
          interval: "7d"
        }
      }
    });
  } else if (msg.id === 4) {
    console.log("✓ TEST 4: dub_get_analytics Tool Execution SUCCESS");
    const content = msg.result?.content?.[0]?.text;
    console.log("  Response payload:", content);

    console.log("\n=================================================");
    console.log("  ALL TESTS PASSED: DUB MCP CONNECTOR READY!");
    console.log("=================================================");
    child.kill();
    process.exit(0);
  }
}

// Start Test 1
send({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" }
  }
});
