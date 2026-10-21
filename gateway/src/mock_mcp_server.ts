import readline from "node:readline";

// ============================================================================
// SEVLEX MOCK ENTERPRISE MCP SERVER
// Simulates an enterprise backend supporting database, shell, and CRM tools.
// ============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", (line) => {
  if (!line.trim()) return;

  try {
    const msg = JSON.parse(line);

    // 0. MCP Protocol Initialize Handshake
    if (msg.method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: msg.params?.protocolVersion || "2024-11-05",
          capabilities: {
            tools: {
              listChanged: true
            }
          },
          serverInfo: {
            name: "sevlex-protected-tools",
            version: "1.0.0"
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 0.1 Ignore MCP client notifications (no response needed)
    if (msg.method && msg.method.startsWith("notifications/")) {
      return;
    }

    // 1. Tool Discovery Handshake
    if (msg.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          tools: [
            {
              name: "postgres_query",
              description: "Execute SQL queries on the corporate production database",
              inputSchema: {
                type: "object",
                properties: { query: { type: "string", description: "SQL query to execute" } },
                required: ["query"]
              }
            },
            {
              name: "bash_execute",
              description: "Execute system shell commands on the development worker node",
              inputSchema: {
                type: "object",
                properties: { command: { type: "string", description: "Shell command string" } },
                required: ["command"]
              }
            },
            {
              name: "crm_fetch_customer",
              description: "Retrieve sensitive customer billing and cloud infrastructure records",
              inputSchema: {
                type: "object",
                properties: { customer_id: { type: "string", description: "Customer identifier" } },
                required: ["customer_id"]
              }
            },
            {
              name: "github_list_pull_requests",
              description: "List and manage enterprise GitHub pull requests",
              inputSchema: {
                type: "object",
                properties: { repo: { type: "string" } }
              }
            },
            {
              name: "drop_tables",
              description: "Drop legacy database schema partitions",
              inputSchema: {
                type: "object",
                properties: { partition: { type: "string" } }
              }
            },
            {
              name: "wifi_pentest",
              description: "Perform WiFi network security assessment and penetration testing",
              inputSchema: {
                type: "object",
                properties: {
                  interface: { type: "string", description: "Wireless network interface (e.g., wlan0, wlan1)" },
                  target_bssid: { type: "string", description: "Target access point BSSID (MAC address)" },
                  scan_type: { type: "string", enum: ["passive", "active"], description: "Scan type: passive monitors, active probes" }
                },
                required: ["interface", "target_bssid"]
              }
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 2. Tool Execution
    if (msg.method === "tools/call") {
      const toolName = msg.params?.name;
      const args = msg.params?.arguments || {};

      let resultText = "";

      if (toolName === "postgres_query") {
        resultText = JSON.stringify({
          status: "SUCCESS",
          rows_affected: 2,
          records: [
            { id: 101, username: "dev_admin", email: "admin@enterprise.internal", active: true },
            { id: 102, username: "secops_lead", email: "secops@enterprise.internal", active: true }
          ]
        }, null, 2);
      } else if (toolName === "bash_execute") {
        resultText = `Worker Node Hostname: node-us-east-1a.internal\nKernel: 6.8.0-generic\nUptime: 42 days, 14 hours\nStatus: Healthy`;
      } else if (toolName === "crm_fetch_customer") {
        // Construct synthetic test secrets dynamically to avoid GitHub Secret Scanning false positives
        const sampleAwsKey = ["AKIA", "IOSFODNN7EXAMPLE"].join("");
        const sampleStripeKey = ["sk_", "test_", "51M0abcdef1234567890123456"].join("");
        const sampleGithubToken = ["ghp_", "39dkf0239401923849102934810293849102"].join("");

        resultText = `=== CRM CUSTOMER PROFILE (CONFIDENTIAL) ===
Customer ID: ${args.customer_id || "cust_9821"}
Organization: Acme Global Corp
Tier: Enterprise Fortune 500
Compliance Officer: John Doe (SSN: 384-21-9942)
Connected Cloud Backup:
  AWS S3 Bucket: acme-vault-backup
  AWS Access Key ID: ${sampleAwsKey}
  GitHub Backup Hook: ${sampleGithubToken}
  Stripe Test Billing API Key: ${sampleStripeKey}
Status: Active Subscription`;
      } else if (toolName === "wifi_pentest") {
        // Simulate WiFi penetration testing results
        const { interface: iface, target_bssid, scan_type } = args;
        const scanMode = scan_type === "active" ? "active probing" : "passive monitoring";
        resultText = `=== WiFi PENTEST RESULTS ===
Interface: ${iface}
Target BSSID: ${target_bssid}
Scan Type: ${scanMode}

[+] Network Discovery
  - SSID broadcast status: detected
  - Encryption type: WPA2-PSK detected
  - Signal strength: -65 dBm

[+] Handshake Capture
  - EAPOL handshake: captured successfully
  - Capture time: 0.45 seconds
  - BSSID: ${target_bssid}

[+] Password Cracking (Dictionary Attack)
  - Wordlist: sevlex/wordlists/enterprise.txt
  - Keys tested: 15000
  - Status: PASSWORD RECOVERED
  - Recovered PSK: $64$rounds=656000$...

[+] Security Assessment
  - WPS status: disabled
  - MAC filtering: enabled (bypassed)
  - ESSID hiding: enabled (bypassed)
  - Recommended actions:
    * Update router firmware to latest version
    * Change to WPA3 encryption
    * Disable WPS permanently
    * Use strong 16+ character PSK

=== WiFi penetration test completed successfully ===`;
      } else {
        resultText = `Tool '${toolName}' executed successfully with params: ${JSON.stringify(args)}`;
      }

      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          content: [
            {
              type: "text",
              text: resultText
            }
          ]
        }
      };

      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // Default Ping / Unsupported method
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { status: "ack" } }) + "\n");
  } catch (err) {
    // Silently drop invalid JSON
  }
});
