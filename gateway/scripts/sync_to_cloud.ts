import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { Client } from "pg";

console.log("=================================================================");
console.log("  SEVLEX LOCAL-TO-POSTGRESQL TELEMETRY SYNC ENGINE               ");
console.log("=================================================================");

async function sync() {
  const dbPath = path.resolve("./audit_log.db");
  if (!fs.existsSync(dbPath)) {
    console.log("No local audit_log.db found to sync.");
    return;
  }

  const connectionString = process.env.DATABASE_URL || "postgres://sevlex:sevlex_secret_pwd@localhost:5432/sevlex";

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");
  } catch (err: any) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  }

  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGSERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      user_id TEXT NOT NULL,
      tool_name TEXT NOT NULL,
      status TEXT NOT NULL,
      raw_request TEXT NOT NULL,
      raw_response TEXT,
      prev_hash TEXT,
      entry_hash TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
  `);

  const db = new DatabaseSync(dbPath, { readOnly: true });
  const rows = db.prepare("SELECT timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash FROM audit_logs WHERE entry_hash IS NOT NULL ORDER BY id ASC").all() as any[];
  db.close();

  console.log(`Found ${rows.length} local cryptographic receipts in SQLite.`);

  let uploaded = 0;
  for (const r of rows) {
    await client.query(
      `INSERT INTO audit_logs (timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [r.timestamp, r.user_id, r.tool_name, r.status, r.raw_request, r.raw_response, r.prev_hash, r.entry_hash]
    );
    uploaded++;
    if (uploaded % 100 === 0 || uploaded === rows.length) {
      process.stdout.write(`\r  Syncing receipts to PostgreSQL: ${uploaded}/${rows.length} complete...`);
    }
  }

  await client.end();
  console.log(`\n\n✔ SYNC COMPLETE: ${uploaded} cryptographic receipts synced to PostgreSQL!`);
}

sync().catch(err => console.error("Sync error:", err));
