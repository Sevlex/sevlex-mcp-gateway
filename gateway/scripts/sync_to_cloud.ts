import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

console.log("=================================================================");
console.log("  SEVLEX LOCAL-TO-CLOUD TELEMETRY SYNC ENGINE                   ");
console.log("=================================================================");

async function sync() {
  const dbPath = path.resolve("./audit_log.db");
  if (!fs.existsSync(dbPath)) {
    console.log("No local audit_log.db found to sync.");
    return;
  }

  // Load env from process.env or dashboard/.env.local
  let supabaseUrl = process.env.SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const envPath = path.resolve("../dashboard/.env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const [k, ...v] = line.trim().split("=");
        if (k === "SUPABASE_URL") supabaseUrl = v.join("=");
        if (k === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = v.join("=");
      }
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
    process.exit(1);
  }

  const db = new DatabaseSync(dbPath, { readOnly: true });
  const rows = db.prepare("SELECT timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash FROM audit_logs WHERE entry_hash IS NOT NULL ORDER BY id ASC").all() as any[];
  db.close();

  console.log(`Found ${rows.length} local cryptographic receipts in SQLite.`);

  // Upload in batches of 50
  const batchSize = 50;
  let uploaded = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const res = await fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(batch)
    });

    if (res.ok) {
      uploaded += batch.length;
      process.stdout.write(`\r  Syncing receipts to Supabase: ${uploaded}/${rows.length} complete...`);
    } else {
      console.error("\nBatch failed:", res.status, await res.text());
      break;
    }
  }

  console.log(`\n\n✔ SYNC COMPLETE: ${uploaded} cryptographic receipts synced to Supabase (Sevlex-mcp-cloud)!`);
}

sync().catch(err => console.error("Sync error:", err));
