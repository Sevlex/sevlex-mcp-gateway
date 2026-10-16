import http from "node:http";
import fs from "node:fs";
import { URL } from "node:url";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { AuditLogger } from "./logger.js";
import { inspectToolParameters, redactToolOutputDlp } from "./toolguard.js";
import { AgentCircuitBreaker } from "./agentguard.js";
import { sendSlackHitlCard } from "./slack_notifier.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGatewayRoot(): string {
  let cur = __dirname;
  for (let i = 0; i < 4; i++) {
    cur = path.dirname(cur);
  }
  return path.resolve(__dirname, "..");
}

const gatewayRoot = path.resolve(__dirname, "..");
const configPath = process.env.SEVLEX_CONFIG_PATH || path.resolve(gatewayRoot, "sevlex.json");
const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(gatewayRoot, "audit_log.db");

export interface SseProxyOptions {
  localPort: number;
  upstreamUrl: string;
  userId?: string;
}

export function startSseProxy(options: SseProxyOptions): http.Server {
  let config = loadConfig(configPath);
  const logger = new AuditLogger(dbPath);
  const circuitBreaker = new AgentCircuitBreaker();
  const userId = options.userId || process.env.SEVLEX_USER || os.userInfo().username;
  const upstream = new URL(options.upstreamUrl);

  // Dynamic Policy Hot-Reloading
  try {
    const dir = path.dirname(configPath);
    if (fs.existsSync(dir)) {
      fs.watch(dir, (_eventType: string, filename: string | null) => {
        if (filename && filename.toLowerCase() === path.basename(configPath).toLowerCase()) {
          setTimeout(() => {
            try {
              config = loadConfig(configPath);
              console.error(`[Sevlex SSE Proxy] ⚡ Policy hot-reloaded.`);
            } catch {}
          }, 25);
        }
      });
    }
  } catch {}

  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url || "/", `http://${req.headers.host}`);

    // CORS Headers for modern AI client integrations
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    // 1. SSE Connection Handshake (/sse)
    if (req.method === "GET" && reqUrl.pathname.endsWith("/sse")) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // Announce Sevlex local message intake endpoint to client
      const sessionId = `sevlex_sess_${Date.now()}`;
      res.write(`event: endpoint\ndata: /message?sessionId=${sessionId}\n\n`);

      // Forward heartbeat
      const heartbeat = setInterval(() => {
        res.write(": ping\n\n");
      }, 15000);

      req.on("close", () => {
        clearInterval(heartbeat);
      });
      return;
    }

    // 2. Incoming JSON-RPC Message Intake (/message)
    if (req.method === "POST" && reqUrl.pathname.includes("/message")) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const rpc = JSON.parse(body);

          // If message is a tool execution request
          if (rpc.method === "tools/call" && rpc.params && rpc.params.name) {
            const toolName = rpc.params.name;
            const approvalRequired = (config.policy.approvalRequiredTools || []).includes(toolName);

            // 🛡️ CHECK 0: AgentGuard Circuit Breaker
            const circuitCheck = circuitBreaker.checkBeforeExecution(toolName, rpc.params.arguments);
            if (!circuitCheck.allowed) {
              circuitBreaker.recordResult(false, true);
              const breakerTag = `${toolName} [CIRCUIT_TRIPPED]`;
              logger.log({
                userId,
                toolName: breakerTag,
                status: "CIRCUIT_BROKEN",
                rawRequest: JSON.stringify({ message: rpc, reason: circuitCheck.reason }),
              });

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  jsonrpc: "2.0",
                  id: rpc.id,
                  error: { code: circuitCheck.code || -32002, message: circuitCheck.reason },
                })
              );
              return;
            }

            // 🚫 CHECK 1: Hard Blocklist Check
            if (config.policy.blockedTools.includes(toolName)) {
              circuitBreaker.recordResult(false, true);
              logger.log({
                userId,
                toolName,
                status: "BLOCKED",
                rawRequest: body,
              });

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  jsonrpc: "2.0",
                  id: rpc.id,
                  error: {
                    code: -32600,
                    message: `Sevlex Security: Access to tool '${toolName}' is blocked by company policy.`,
                  },
                })
              );
              return;
            }

            // 🔒 CHECK 2: HITL Dual-Custody Check
            if (approvalRequired) {
              const clearance = logger.consumeApprovedHitlClearance(userId, toolName);

              if (clearance.approved) {
                circuitBreaker.recordResult(true, false);
                logger.log({
                  userId,
                  toolName: `${toolName} [HITL_CLEARED]`,
                  status: "ALLOWED",
                  rawRequest: JSON.stringify({ message: rpc, clearance }),
                });
                // Authorized: continue processing
                circuitBreaker.recordResult(false, true);
                const ticketId = logger.createHitlTicket(userId, toolName, body);

                logger.log({
                  userId,
                  toolName,
                  status: "HITL_PENDING",
                  rawRequest: JSON.stringify({ message: rpc, ticketId }),
                });

                if (process.env.SLACK_WEBHOOK_URL) {
                  sendSlackHitlCard({
                    webhookUrl: process.env.SLACK_WEBHOOK_URL,
                    userId,
                    toolName,
                    ticketId,
                    argsSnippet: JSON.stringify(rpc.params?.arguments || {}, null, 2),
                    dashboardUrl: process.env.SEVLEX_DASHBOARD_URL || "http://localhost:3000",
                  }).catch(err => console.error("Slack interactive webhook failed:", err));
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    id: rpc.id,
                    error: {
                      code: -32001,
                      message: `Sevlex HITL Guard: Execution of tool '${toolName}' requires human authorization. Ticket '${ticketId}' dispatched to SecOps. Once authorized, retry tool call to execute.`,
                      data: { ticketId, status: "PENDING" },
                    },
                  })
                );
                return;
              }
            }

            // 🛡️ CHECK 3: ToolGuard Deep Parameter Inspection
            const paramCheck = inspectToolParameters(toolName, rpc.params.arguments);
            if (!paramCheck.passed && paramCheck.violation) {
              circuitBreaker.recordResult(false, true);
              const violationTag = `${toolName} [${paramCheck.violation.category}]`;

              logger.log({
                userId,
                toolName: violationTag,
                status: "BLOCKED",
                rawRequest: JSON.stringify({ message: rpc, violation: paramCheck.violation }),
              });

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  jsonrpc: "2.0",
                  id: rpc.id,
                  error: {
                    code: -32602,
                    message: `Sevlex ToolGuard: Blocked by Parameter Inspection Rule [${paramCheck.violation.ruleId}]: ${paramCheck.violation.reason}. Dangerous payload intercepted.`,
                  },
                })
              );
              return;
            }

            // Record safe execution
            circuitBreaker.recordResult(true, false);
          }

          // 3. Forward Authorized Traffic Upstream to Remote MCP Server
          const forwardReq = http.request(
            {
              hostname: upstream.hostname,
              port: upstream.port || 80,
              path: upstream.pathname + upstream.search,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body),
              },
            },
            (upstreamRes) => {
              let upstreamBody = "";
              upstreamRes.on("data", (chunk) => {
                upstreamBody += chunk.toString();
              });

              upstreamRes.on("end", () => {
                // 🔐 CHECK 4: ToolGuard Output Guard In-Flight DLP Redaction
                const dlpCheck = redactToolOutputDlp(upstreamBody);
                let finalPayload = upstreamBody;

                if (dlpCheck.redactionCount > 0) {
                  finalPayload = dlpCheck.sanitized;
                  logger.log({
                    userId,
                    toolName: "ToolGuard DLP (SSE)",
                    status: "DLP_REDACTED",
                    rawRequest: `Redacted ${dlpCheck.redactionCount} secret(s): ${dlpCheck.redactedTypes.join(", ")}`,
                    rawResponse: dlpCheck.sanitized,
                  });
                } else if (rpc.method === "tools/call") {
                  logger.log({
                    userId,
                    toolName: rpc.params?.name || "sse_tool",
                    status: "ALLOWED",
                    rawRequest: body,
                    rawResponse: upstreamBody,
                  });
                }

                res.writeHead(upstreamRes.statusCode || 200, upstreamRes.headers);
                res.end(finalPayload);
              });
            }
          );

          forwardReq.on("error", (err) => {
            console.error("Upstream SSE Proxy error:", err);
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message: "Bad Gateway to upstream MCP server" } }));
          });

          forwardReq.write(body);
          forwardReq.end();
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }

    // Default Fallback
    res.writeHead(404);
    res.end("Sevlex MCP SSE Gateway: Endpoint not found.");
  });

  server.listen(options.localPort, () => {
    console.log(`[Sevlex SSE Gateway] Listening on http://localhost:${options.localPort}/sse`);
    console.log(`[Sevlex SSE Gateway] Forwarding to upstream: ${options.upstreamUrl}`);
    console.log(`[Sevlex SSE Gateway] Real-Time Layer 7 ToolGuard & DLP Active.`);
  });

  return server;
}
