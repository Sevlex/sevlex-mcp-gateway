import "dotenv/config";
import { spawn } from "node:child_process";
import readline from "node:readline";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { AuditLogger } from "./logger.js";
import { inspectToolParameters, redactToolOutputDlp } from "./toolguard.js";
import { AgentCircuitBreaker } from "./agentguard.js";
import { sendSlackHitlCard } from "./slack_notifier.js";
import { getUserConfig } from "./user_config.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGatewayRoot(): string {
  let cur = __dirname;
  for (let i = 0; i < 4; i++) {
    if (fs.existsSync(path.join(cur, "sevlex.json"))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(__dirname, "..");
}

const gatewayRoot = getGatewayRoot();

// ============================================================================
// SEVLEX MCP GATEWAY ENGINE (Phase 1)
// The "Toll Booth" that sits between the AI (Cursor/Claude) and the Real Tool.
// ============================================================================

// 1. Initialize our Foundation (Fail-fast config and robust database)
const configPath = process.env.SEVLEX_CONFIG_PATH || path.resolve(gatewayRoot, "sevlex.json");
const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(gatewayRoot, "audit_log.db");
let config = loadConfig(configPath);
const logger = new AuditLogger(dbPath);

// Dynamic Policy Hot-Reloading (Sub-5ms In-Memory Update without process restarts)
function initPolicyHotReload(targetPath: string) {
  const reload = () => {
    try {
      if (fs.existsSync(targetPath)) {
        config = loadConfig(targetPath);
        console.error(`[Sevlex Gateway] ⚡ Policy hot-reloaded: ${config.policy.blockedTools.length} blocked, ${(config.policy.approvalRequiredTools || []).length} HITL protected.`);
      }
    } catch {}
  };

  try {
    const dir = path.dirname(targetPath);
    if (fs.existsSync(dir)) {
      fs.watch(dir, (_eventType, filename) => {
        if (filename && filename.toLowerCase() === path.basename(targetPath).toLowerCase()) {
          setTimeout(reload, 25);
        }
      });
    }
  } catch {}

  try {
    fs.watchFile(targetPath, { interval: 300 }, (curr, prev) => {
      if (curr.mtimeMs !== prev.mtimeMs) {
        reload();
      }
    });
  } catch {}
}

initPolicyHotReload(configPath);

// Determine User Identity
const userId = process.env.SEVLEX_USER || os.userInfo().username;

// Track pending tools/list requests
const pendingToolListRequests = new Set<number | string>();

// Initialize AgentGuard Autonomous Circuit Breaker
const circuitBreaker = new AgentCircuitBreaker({
  maxCallsPerWindow: 25,
  windowMs: 30_000,
  maxConsecutiveFailures: 5,
  maxIdenticalCalls: 3,
});

// Stream backpressure helpers to prevent memory bloat on large payloads
function safeWriteStdout(data: string): boolean {
  return process.stdout.write(data);
}

function safeWriteToolStdin(data: string): boolean {
  if (realTool.stdin && !realTool.stdin.destroyed) {
    return realTool.stdin.write(data);
  }
  return false;
}

// 2. Identify the Destination
// When the AI starts Sevlex, it tells us where it actually wants to go.
// Example command: node gateway.ts python weather_tool.py
const targetCommand = process.argv[2];
const targetArgs = process.argv.slice(3);

if (!targetCommand) {
  console.error("❌ Sevlex Gateway: Missing target command. You must specify a tool to run.");
  process.exit(1);
}

// 3. Start the REAL Tool in the background
// We connect our "pipes" to it so we can intercept the traffic.
const realTool = spawn(targetCommand, targetArgs, {
  // We intercept stdin (input) and stdout (output). Stderr (errors) bypasses us.
  stdio: ["pipe", "pipe", "inherit"], 
  shell: process.platform === "win32",
});

realTool.on("error", (err) => {
  console.error("❌ Sevlex Gateway: Failed to spawn target process:", err);
});


// ============================================================================
// 4. REMOTE SIEM FORWARDER (Stateless Disaster Recovery & Enterprise Streaming)
// ============================================================================
function streamToSiem(targetUserId: string, targetToolName: string, status: "ALLOWED" | "BLOCKED" | "DLP_REDACTED" | "HITL_PENDING" | "CIRCUIT_BROKEN", rawPayload: any) {
  const siemConfig = config.policy.siem;
  const endpoint = process.env.SEVLEX_SIEM_ENDPOINT || siemConfig?.endpoint;
  const apiKey = process.env.SEVLEX_SIEM_API_KEY || siemConfig?.apiKey;
  const provider = (process.env.SEVLEX_SIEM_PROVIDER || siemConfig?.provider || "webhook").toLowerCase();

  if (!endpoint && !apiKey) return;

  const targetUrl = endpoint || (provider === "datadog" ? "https://http-intake.logs.datadoghq.com/api/v2/logs" : "");
  if (!targetUrl) return;

  const timestamp = new Date().toISOString();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let payload: any;

  if (provider === "datadog") {
    if (apiKey) headers["DD-API-KEY"] = apiKey;
    payload = [{
      ddsource: "sevlex-gateway",
      ddtags: `env:production,user:${targetUserId},tool:${targetToolName},status:${status}`,
      hostname: os.hostname(),
      service: "sevlex-mcp-firewall",
      message: `MCP Tool Execution [${status}]: ${targetUserId} called ${targetToolName}`,
      user_id: targetUserId,
      tool_name: targetToolName,
      status: status,
      timestamp: timestamp,
      raw_request: rawPayload
    }];
  } else if (provider === "splunk") {
    if (apiKey) headers["Authorization"] = `Splunk ${apiKey}`;
    payload = {
      event: {
        user_id: targetUserId,
        tool_name: targetToolName,
        status: status,
        raw_request: rawPayload,
        hostname: os.hostname(),
      },
      sourcetype: "sevlex:mcp:audit",
      time: Math.floor(Date.now() / 1000)
    };
  } else {
    // Generic Webhook
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    payload = {
      source: "sevlex-mcp-gateway",
      timestamp,
      user_id: targetUserId,
      tool_name: targetToolName,
      status,
      hostname: os.hostname(),
      raw_request: rawPayload
    };
  }

  fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  }).catch(err => {
    console.error(`[SIEM Warning] Delivery failed to ${provider}:`, err.message || err);
  });
}

async function handleAiMessage(message: any, rawMessage: string): Promise<void> {
  // Handle JSON-RPC batch requests (arrays)
  const messages = Array.isArray(message) ? message : [message];
  let isBlocked = false;

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') continue;

    // TRACK tools/list
    if (msg.method === "tools/list" && msg.id !== undefined) {
      pendingToolListRequests.add(msg.id);
    }

    // Is the AI trying to use a tool?
    if (msg.method === "tools/call" && msg.params && msg.params.name) {
      const toolName = msg.params.name;
      const approvalRequired = (config.policy.approvalRequiredTools || []).includes(toolName);

      // 🛡️ CHECK 0: AgentGuard™ Autonomous Circuit Breaker (Trajectory & Loop Interception)
      const circuitCheck = circuitBreaker.checkBeforeExecution(toolName, msg.params.arguments);
      if (!circuitCheck.allowed) {
        isBlocked = true;
        circuitBreaker.recordResult(false, true);

        const breakerTag = `${toolName} [CIRCUIT_TRIPPED]`;
        logger.log({
          userId: userId,
          toolName: breakerTag,
          status: "CIRCUIT_BROKEN",
          rawRequest: JSON.stringify({ message: msg, reason: circuitCheck.reason }),
        });

        streamToSiem(userId, breakerTag, "CIRCUIT_BROKEN", circuitCheck.reason);

        const alertMsg = `[CIRCUIT BREAKER TRIPPED] User '${userId}' triggered loop breaker on '${toolName}': ${circuitCheck.reason}`;
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: alertMsg }),
          }).catch((err) => console.error("Slack webhook failed:", err));
        } else {
          console.error(alertMsg);
        }

        const breakerResponse = {
          jsonrpc: "2.0",
          id: msg.id,
          error: {
            code: circuitCheck.code || -32002,
            message: circuitCheck.reason,
          },
        };
        safeWriteStdout(JSON.stringify(breakerResponse) + "\n");
        continue;
      }

      // 🚫 CHECK 1: Hard Blocklist Check
      if (config.policy.blockedTools.includes(toolName)) {
        isBlocked = true;
        circuitBreaker.recordResult(false, true);
        
        logger.log({
          userId: userId,
          toolName: toolName,
          status: "BLOCKED",
          rawRequest: rawMessage,
        });

        streamToSiem(userId, toolName, "BLOCKED", rawMessage);

        const alertMsg = `[SLACK ALERT] User '${userId}' attempted blocked tool '${toolName}'`;
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: alertMsg })
          }).catch(err => console.error("Slack webhook failed:", err));
        } else {
          console.error(alertMsg);
        }

        const errorResponse = {
          jsonrpc: "2.0",
          id: msg.id,
          error: {
            code: -32600, 
            message: `Sevlex Security: Access to tool '${toolName}' is blocked by company policy.`,
          },
        };
        safeWriteStdout(JSON.stringify(errorResponse) + "\n");
        continue;
      } 
      
      // 🛡️ CHECK 2: ToolGuard Call Guard & CodeGuard™ (Deep Parameter & Dynamic Script Inspection)
      const paramCheck = inspectToolParameters(toolName, msg.params.arguments, config.policy.parameterRules?.customRules);
      
      if (!paramCheck.passed && paramCheck.action === "BLOCK") {
        const violation = paramCheck.violation!;
        isBlocked = true;
        circuitBreaker.recordResult(false, true);

        const violationTag = `${toolName} [${violation.category}]`;
        logger.log({
          userId: userId,
          toolName: violationTag,
          status: "BLOCKED",
          rawRequest: JSON.stringify({ message: msg, violation }),
        });

        streamToSiem(userId, violationTag, "BLOCKED", JSON.stringify({ message: msg, violation }));

        const alertMsg = `[TOOLGUARD BLOCK] User '${userId}' attempted dangerous argument in '${toolName}': ${violation.reason} (matched: ${violation.sample})`;
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: alertMsg })
          }).catch(err => console.error("Slack webhook failed:", err));
        } else {
          console.error(alertMsg);
        }

        const errorResponse = {
          jsonrpc: "2.0",
          id: msg.id,
          error: {
            code: -32602,
            message: `Sevlex ToolGuard: Blocked by Parameter Inspection Rule [${violation.ruleId}]: ${violation.reason}. Dangerous payload intercepted.`,
          },
        };
        safeWriteStdout(JSON.stringify(errorResponse) + "\n");
        continue;
      }

      // 🔒 CHECK 3: Human-In-The-Loop (HITL) Stateful Clearance Check
      // Triggered either by tool-level policy OR by parameter-level rule with action: "REQUIRE_APPROVAL"
      const needsApproval = approvalRequired || (!paramCheck.passed && paramCheck.action === "REQUIRE_APPROVAL");

      if (needsApproval) {
        // Check if SecOps has ALREADY authorized this tool call
        const clearance = logger.consumeApprovedHitlClearance(userId, toolName);

        if (clearance.approved) {
          // Dual-Custody Clearance Granted!
          circuitBreaker.recordResult(true, false);

          const approvalTag = `${toolName} [HITL_CLEARED]`;
          logger.log({
            userId: userId,
            toolName: approvalTag,
            status: "ALLOWED",
            rawRequest: JSON.stringify({ message: msg, clearance }),
          });

          streamToSiem(userId, approvalTag, "ALLOWED", { message: msg, clearance });
          // Fall through to forward to real tool
        } else {
          isBlocked = true;
          circuitBreaker.recordResult(false, true);

          // Register persistent clearance ticket in SQLite
          const ticketId = logger.createHitlTicket(userId, toolName, rawMessage);
          const riskReason = paramCheck.violation?.reason || "High-Impact Privileged Tool Operation";

          logger.log({
            userId: userId,
            toolName: toolName,
            status: "HITL_PENDING",
            rawRequest: JSON.stringify({ message: msg, ticketId, riskReason }),
          });

          streamToSiem(userId, toolName, "HITL_PENDING", { message: msg, ticketId });

          const alertMsg = `[HITL APPROVAL REQUIRED] User '${userId}' requested tool '${toolName}'. Ticket: ${ticketId}. Risk: ${riskReason}`;
          console.error(alertMsg);

          const userCfg = getUserConfig();
          const cloudUrl = process.env.SEVLEX_CLOUD_URL || userCfg.endpoint || "https://app.sevlex.com";
          const apiKey = process.env.SEVLEX_API_KEY || userCfg.apiKey || "sevlex_secret_123";

          // Sync ticket to Central Cloud Database (Neon Postgres)
          fetch(`${cloudUrl}/api/hitl/ticket`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": apiKey,
            },
            body: JSON.stringify({
              ticketId,
              userId,
              toolName,
              arguments: msg.params?.arguments || {},
            }),
          }).catch(() => {});

          // Dispatch interactive Slack Block Kit Card
          if (process.env.SLACK_WEBHOOK_URL) {
            sendSlackHitlCard({
              webhookUrl: process.env.SLACK_WEBHOOK_URL,
              userId,
              toolName,
              ticketId,
              argsSnippet: JSON.stringify(msg.params?.arguments || {}, null, 2),
              dashboardUrl: cloudUrl,
            }).catch(err => console.error("Slack interactive webhook failed:", err));
          }

          // Active 10-second fast poll for instant Slack button clearance
          let approvedInstantly = false;
          if (cloudUrl) {
            const startPoll = Date.now();
            while (Date.now() - startPoll < 10000) {
              await new Promise(r => setTimeout(r, 1000));
              try {
                const checkRes = await fetch(`${cloudUrl}/api/hitl/ticket?ticketId=${ticketId}`, {
                  headers: { "Authorization": apiKey }
                });
                if (checkRes.ok) {
                  const checkData = await checkRes.json();
                  if (checkData.status === "APPROVED") {
                    logger.approveHitlTicket(ticketId, checkData.approvedBy || "slack_admin");
                    const approvedClearance = logger.consumeApprovedHitlClearance(userId, toolName);
                    if (approvedClearance.approved) {
                      approvedInstantly = true;
                      isBlocked = false;
                      circuitBreaker.recordResult(true, false);

                      const approvalTag = `${toolName} [HITL_SLACK_AUTHORIZED]`;
                      logger.log({
                        userId: userId,
                        toolName: approvalTag,
                        status: "ALLOWED",
                        rawRequest: JSON.stringify({ message: msg, clearance: approvedClearance }),
                      });
                      break;
                    }
                  } else if (checkData.status === "REJECTED") {
                    break;
                  }
                }
              } catch {}
            }
          }

          if (!approvedInstantly) {
            const hitlResponse = {
              jsonrpc: "2.0",
              id: msg.id,
              error: {
                code: -32001,
                message: `Sevlex HITL Guard: Execution of tool '${toolName}' requires human authorization. Ticket '${ticketId}' dispatched to SecOps Slack. Risk: ${riskReason}. Once authorized, retry tool call to execute.`,
                data: { ticketId, status: "PENDING" },
              },
            };
            safeWriteStdout(JSON.stringify(hitlResponse) + "\n");
            continue;
          }
        }
      }
      else {
        // 🟢 SECURITY CHECK PASSED: Tool & Parameters are safe
        circuitBreaker.recordResult(true, false);

        logger.log({
          userId: userId,
          toolName: toolName,
          status: "ALLOWED",
          rawRequest: JSON.stringify(msg),
        });

        streamToSiem(userId, toolName, "ALLOWED", JSON.stringify(msg));
      }
    }
  }

  if (isBlocked) {
    // Return immediately so we DO NOT forward this to the real tool
    return; 
  }

  // Forward the safe message to the actual tool with backpressure
  safeWriteToolStdin(rawMessage + "\n");
}

let inputBuffer = "";

process.stdin.on("data", async (chunk) => {
  inputBuffer += chunk.toString();

  // Prevent memory bloat from unbounded JSON payloads
  if (inputBuffer.length > 10 * 1024 * 1024) {
    logger.log({
      userId: userId,
      toolName: "unknown",
      status: "BLOCKED",
      rawRequest: "Buffer limit exceeded",
    });
    inputBuffer = "";
    return;
  }

  let i = 0;
  while (i < inputBuffer.length) {
    let startIdx = inputBuffer.indexOf('{', i);
    let startArr = inputBuffer.indexOf('[', i);
    
    if (startIdx === -1) {
      startIdx = startArr;
    } else if (startArr !== -1 && startArr < startIdx) {
      startIdx = startArr;
    }

    if (startIdx === -1) {
      // Discard buffer if no JSON start is found to prevent memory leak
      inputBuffer = "";
      break;
    }

    let inString = false;
    let escape = false;
    let braces = 0;
    let foundEnd = false;

    for (let j = startIdx; j < inputBuffer.length; j++) {
      const char = inputBuffer[j];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{' || char === '[') {
          braces++;
        } else if (char === '}' || char === ']') {
          braces--;
          if (braces === 0) {
            const jsonStr = inputBuffer.substring(startIdx, j + 1);
            try {
              const message = JSON.parse(jsonStr);
              await handleAiMessage(message, jsonStr);
            } catch (err) {
              // Ignore invalid JSON that matched brackets. Do NOT fail-open.
            }
            // Move buffer forward
            inputBuffer = inputBuffer.substring(j + 1);
            i = 0;
            foundEnd = true;
            break; // Break inner loop, continue while loop
          }
        }
      }
    }

    if (!foundEnd) {
      // Incomplete object, wait for more data. 
      // Trim everything before startIdx to prevent buffer bloat.
      inputBuffer = inputBuffer.substring(startIdx);
      break; // Wait for next chunk
    }
  }
});

// ============================================================================
// 5. THE RETURN TRIP: TOOL -> AI
// ============================================================================
const toolOutput = readline.createInterface({
  input: realTool.stdout,
  terminal: false,
});

toolOutput.on("line", (line) => {
  try {
    const response = JSON.parse(line);
    if (response.id !== undefined && pendingToolListRequests.has(response.id)) {
      pendingToolListRequests.delete(response.id);
      if (response.result && Array.isArray(response.result.tools)) {
        const DISCOVERED_TOOLS_PATH = path.join(gatewayRoot, "discovered_tools.json");
        let existingTools: any[] = [];
        try {
          if (fs.existsSync(DISCOVERED_TOOLS_PATH)) {
            existingTools = JSON.parse(fs.readFileSync(DISCOVERED_TOOLS_PATH, "utf-8"));
          }
        } catch (e) {}

        const serverName = targetCommand;
        
        let serverEntry = existingTools.find(s => s.server === serverName);
        if (!serverEntry) {
          serverEntry = { server: serverName, tools: [] };
          existingTools.push(serverEntry);
        }
        
        const newToolNames = response.result.tools.map((t: any) => t.name);
        const mergedTools = Array.from(new Set([...serverEntry.tools, ...newToolNames]));
        serverEntry.tools = mergedTools;

        fs.writeFileSync(DISCOVERED_TOOLS_PATH, JSON.stringify(existingTools, null, 2), "utf-8");
      }
    }
  } catch (e) {
    // Ignore parse errors from tool stdout
  }

  // 🛡️ ToolGuard Output Guard: Real-Time Secret Redaction & DLP
  let finalLine = line;
  try {
    const dlpResult = redactToolOutputDlp(line);
    if (dlpResult.redactionCount > 0) {
      finalLine = dlpResult.sanitized;

      logger.log({
        userId: userId,
        toolName: "ToolGuard DLP",
        status: "DLP_REDACTED",
        rawRequest: `Redacted ${dlpResult.redactionCount} sensitive secret(s): ${dlpResult.redactedTypes.join(", ")}`,
        rawResponse: dlpResult.sanitized,
      });

      streamToSiem(userId, "ToolGuard DLP", "DLP_REDACTED", {
        redactions: dlpResult.redactionCount,
        types: dlpResult.redactedTypes,
      });

      const dlpAlert = `[DLP ALERT] Redacted ${dlpResult.redactionCount} secret(s) (${dlpResult.redactedTypes.join(", ")}) from tool output before reaching AI context.`;
      if (process.env.SLACK_WEBHOOK_URL) {
        fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: dlpAlert })
        }).catch(err => console.error("Slack webhook failed:", err));
      } else {
        console.error(dlpAlert);
      }
    }
  } catch (err) {
    // Fail-safe
  }

  // Pass sanitized answer straight back to the AI
  safeWriteStdout(finalLine + "\n");
});

// Clean up child process and database when the AI disconnects
function cleanupAndExit(code: number = 0) {
  try {
    if (realTool && !realTool.killed) {
      realTool.kill("SIGTERM");
      setTimeout(() => {
        if (!realTool.killed) realTool.kill("SIGKILL");
      }, 1000).unref();
    }
    logger.close();
  } catch (e) {}
  process.exit(code);
}

process.on("SIGINT", () => cleanupAndExit(0));
process.on("SIGTERM", () => cleanupAndExit(0));
if (process.platform !== "win32") {
  process.on("SIGHUP", () => cleanupAndExit(0));
}

realTool.on("exit", (code) => {
  cleanupAndExit(code ?? 0);
});
