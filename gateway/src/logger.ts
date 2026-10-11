import Database from "better-sqlite3";
import path from "node:path";

// Define the shape of an audit log entry
export interface AuditLogEntry {
  userId: string;
  toolName: string;
  status: "ALLOWED" | "BLOCKED" | "ERROR";
  rawRequest: string;
  rawResponse?: string;
}

export class AuditLogger {
  private db: Database.Database;
  private insertStatement: Database.Statement;

  constructor(dbPath: string) {
    // 1. Initialize the SQLite database
    // better-sqlite3 is synchronous, meaning it avoids async race conditions 
    // when writing hundreds of logs per second.
    this.db = new Database(path.resolve(dbPath));

    // 2. Enforce strict database settings for reliability (WAL mode is faster and safer)
    this.db.pragma("journal_mode = WAL");

    // 3. Create the table if it doesn't exist yet
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        status TEXT NOT NULL,
        raw_request TEXT NOT NULL,
        raw_response TEXT
      )
    `);
    
    // Add user_id column if it doesn't exist (migration)
    try {
      this.db.exec(`ALTER TABLE audit_logs ADD COLUMN user_id TEXT DEFAULT 'unknown'`);
    } catch (e) {
      // Column probably already exists
    }

    // 4. Pre-compile the SQL statement for maximum performance
    // A prepared statement prevents SQL Injection attacks and runs 10x faster.
    this.insertStatement = this.db.prepare(`
      INSERT INTO audit_logs (user_id, tool_name, status, raw_request, raw_response)
      VALUES (@userId, @toolName, @status, @rawRequest, @rawResponse)
    `);
  }

  /**
   * Writes a secure audit log to the database.
   */
  public log(entry: AuditLogEntry) {
    try {
      this.insertStatement.run({
        userId: entry.userId,
        toolName: entry.toolName,
        status: entry.status,
        rawRequest: entry.rawRequest,
        rawResponse: entry.rawResponse || null,
      });
    } catch (error) {
      // In enterprise systems, if the audit log fails, we must alert immediately.
      console.error("❌ CRITICAL ERROR: Failed to write audit log to disk!", error);
      // Depending on strictness, a CISO might want the gateway to crash here if logging fails.
      // For Phase 1, we will log the error but keep the proxy running.
    }
  }

  public close() {
    this.db.close();
  }
}
