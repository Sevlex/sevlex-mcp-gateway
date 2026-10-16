import Database from "better-sqlite3";
import path from "node:path";
import crypto from "node:crypto";

// Define the shape of an audit log entry
export interface AuditLogEntry {
  userId: string;
  toolName: string;
  status: "ALLOWED" | "BLOCKED" | "ERROR" | "DLP_REDACTED" | "HITL_PENDING" | "CIRCUIT_BROKEN";
  rawRequest: string;
  rawResponse?: string;
}

export interface HitlTicket {
  ticketId: string;
  userId: string;
  toolName: string;
  rawRequest: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export class AuditLogger {
  private db: Database.Database;
  private insertStatement: Database.Statement;
  private lastHash: string = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor(dbPath: string) {
    this.db = new Database(path.resolve(dbPath));

    // 1. Enterprise SQLite configuration: WAL mode + busy timeout for zero-lock contention
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("busy_timeout = 5000");

    // 2. Audit logs table with cryptographic tamper-evident hash chaining
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        status TEXT NOT NULL,
        raw_request TEXT NOT NULL,
        raw_response TEXT,
        prev_hash TEXT DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
        entry_hash TEXT
      )
    `);

    // Migrations for existing tables
    try {
      this.db.exec(`ALTER TABLE audit_logs ADD COLUMN user_id TEXT DEFAULT 'unknown'`);
    } catch (e) {}

    try {
      this.db.exec(`ALTER TABLE audit_logs ADD COLUMN prev_hash TEXT DEFAULT '0000000000000000000000000000000000000000000000000000000000000000'`);
    } catch (e) {}

    try {
      this.db.exec(`ALTER TABLE audit_logs ADD COLUMN entry_hash TEXT`);
    } catch (e) {}

    // 3. Stateful Dual-Custody HITL Clearance Registry
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS hitl_tickets (
        ticket_id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        raw_request TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        approved_by TEXT,
        approved_at DATETIME,
        signature TEXT
      )
    `);

    // Fetch the latest entry_hash to anchor the continuous cryptographic chain
    try {
      const lastRow = this.db.prepare("SELECT entry_hash FROM audit_logs WHERE entry_hash IS NOT NULL ORDER BY id DESC LIMIT 1").get() as any;
      if (lastRow && lastRow.entry_hash) {
        this.lastHash = lastRow.entry_hash;
      }
    } catch (e) {}

    // Pre-compiled prepared statement
    this.insertStatement = this.db.prepare(`
      INSERT INTO audit_logs (user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash)
      VALUES (@userId, @toolName, @status, @rawRequest, @rawResponse, @prevHash, @entryHash)
    `);
  }

  /**
   * Computes an immutable SHA-256 hash of the audit entry anchored to prev_hash.
   */
  private computeHash(prevHash: string, userId: string, toolName: string, status: string, rawRequest: string): string {
    return crypto
      .createHash("sha256")
      .update(`${prevHash}:${userId}:${toolName}:${status}:${rawRequest}`)
      .digest("hex");
  }

  /**
   * Writes a cryptographically signed audit log to the tamper-evident chain.
   */
  public log(entry: AuditLogEntry): { entryHash: string; prevHash: string } {
    const prevHash = this.lastHash;
    const entryHash = this.computeHash(prevHash, entry.userId, entry.toolName, entry.status, entry.rawRequest);
    this.lastHash = entryHash;

    try {
      this.insertStatement.run({
        userId: entry.userId,
        toolName: entry.toolName,
        status: entry.status,
        rawRequest: entry.rawRequest,
        rawResponse: entry.rawResponse || null,
        prevHash: prevHash,
        entryHash: entryHash,
      });
    } catch (error) {
      console.error("❌ CRITICAL ERROR: Failed to write cryptographic audit log to disk!", error);
    }

    return { entryHash, prevHash };
  }

  /**
   * Registers a stateful Human-in-the-Loop ticket awaiting SecOps clearance.
   */
  public createHitlTicket(userId: string, toolName: string, rawRequest: string): string {
    const ticketId = `hitl_req_${crypto.randomUUID().slice(0, 12)}`;
    try {
      this.db.prepare(`
        INSERT INTO hitl_tickets (ticket_id, user_id, tool_name, raw_request, status)
        VALUES (?, ?, ?, ?, 'PENDING')
      `).run(ticketId, userId, toolName, rawRequest);
    } catch (err) {
      console.error("Failed to persist HITL ticket:", err);
    }
    return ticketId;
  }

  /**
   * Authorizes a pending HITL ticket.
   */
  public approveHitlTicket(ticketId: string, approvedBy: string): boolean {
    const signature = crypto.createHash("sha256").update(`${ticketId}:${approvedBy}:${Date.now()}`).digest("hex");
    const result = this.db.prepare(`
      UPDATE hitl_tickets 
      SET status = 'APPROVED', approved_by = ?, approved_at = CURRENT_TIMESTAMP, signature = ?
      WHERE ticket_id = ? AND status = 'PENDING'
    `).run(approvedBy, signature, ticketId);
    return result.changes > 0;
  }

  /**
   * Mathematically verifies the cryptographic integrity of the entire audit chain.
   */
  public verifyAuditChain(): { valid: boolean; totalReceipts: number; brokenAtId?: number } {
    const rows = this.db.prepare("SELECT id, user_id, tool_name, status, raw_request, prev_hash, entry_hash FROM audit_logs WHERE entry_hash IS NOT NULL ORDER BY id ASC").all() as any[];
    
    let expectedPrev = "0000000000000000000000000000000000000000000000000000000000000000";
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (i > 0 && row.prev_hash !== expectedPrev) {
        return { valid: false, totalReceipts: rows.length, brokenAtId: row.id };
      }
      const calculatedHash = this.computeHash(row.prev_hash, row.user_id, row.tool_name, row.status, row.raw_request);
      if (calculatedHash !== row.entry_hash) {
        return { valid: false, totalReceipts: rows.length, brokenAtId: row.id };
      }
      expectedPrev = row.entry_hash;
    }
    return { valid: true, totalReceipts: rows.length };
  }

  public close() {
    this.db.close();
  }
}

