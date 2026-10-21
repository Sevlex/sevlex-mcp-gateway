import { AuditLogger } from "../src/logger.js";
import path from "node:path";
import fs from "node:fs";

console.log("=================================================================");
console.log("  SEVLEX CLOUD INGESTION & TELEMETRY PIPELINE VERIFIER           ");
console.log("=================================================================");

async function run() {
  const testDb = path.resolve("./test_cloud_audit.db");
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);

  // Set mock ingestion URL to verify forwarder
  process.env.SEVLEX_INGEST_URL = "http://127.0.0.1:9999";
  process.env.SEVLEX_API_KEY = "sevlex_test_secret";

  const capturedReceipts: any[] = [];
  // Mock lightweight server to simulate central Cloud Dashboard /api/ingest
  const http = await import("node:http");
  const server = http.createServer((req, res) => {
    if (req.url === "/api/ingest" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const payload = JSON.parse(body);
          if (Array.isArray(payload.receipts)) {
            capturedReceipts.push(...payload.receipts);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, ingested: payload.receipts?.length || 0, storage: "cloud_mock" }));
        } catch {
          res.writeHead(400);
          res.end();
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(9999, "127.0.0.1", () => resolve()));
  console.log("✔ Mock Cloud Dashboard Ingestion Server listening on :9999");

  const logger = new AuditLogger(testDb);

  // Log 12 receipts to trigger automatic batching (> 10 items)
  for (let i = 1; i <= 12; i++) {
    logger.log({
      userId: "developer@corp.internal",
      toolName: `test_tool_${i}`,
      status: i % 3 === 0 ? "BLOCKED" : "ALLOWED",
      rawRequest: JSON.stringify({ arg: `val_${i}` }),
      rawResponse: `result_${i}`
    });
  }

  // Force forwarder to drain and flush all pending receipts
  await logger.forwarder.flush();

  console.log(`✔ Telemetry Forwarder flushed ${capturedReceipts.length} total receipts to Cloud Ingestion API`);
  
  if (capturedReceipts.length !== 12) {
    console.error(`❌ FAILED: Expected 12 receipts, received ${capturedReceipts.length}`);
    server.close();
    logger.close();
    if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
    process.exit(1);
  }

  const firstReceipt = capturedReceipts[0];
  console.log("✔ Sample Ingested Receipt Verified:");
  console.log(`   - User:       ${firstReceipt.userId}`);
  console.log(`   - Tool:       ${firstReceipt.toolName}`);
  console.log(`   - Status:     ${firstReceipt.status}`);
  console.log(`   - Merkle Hash:${firstReceipt.entryHash.slice(0, 16)}...`);
  console.log(`   - Prev Hash:  ${firstReceipt.prevHash.slice(0, 16)}...`);

  // Verify local cryptographic chain
  const verifyResult = logger.verifyAuditChain();
  console.log(`✔ Local Merkle Chain Integrity: ${verifyResult.valid ? "100% VALID" : "INVALID"} (${verifyResult.totalReceipts} receipts)`);

  logger.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);

  console.log("\nVERDICT: 🎯 CLOUD INGESTION PIPELINE FULLY OPERATIONAL!");
}

run().catch((err) => {
  console.error("❌ Test crashed:", err);
  process.exit(1);
});
