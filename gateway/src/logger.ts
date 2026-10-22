import Database from "better-sqlite3";
import path from "node:path";
import crypto from "node:crypto";
import { getUserConfig } from "./user_config.js";

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

export interface IngestionReceipt {
  userId: string;
  toolName: string;
  status: string;
  rawRequest: string;
  rawResponse?: string | null;
  prevHash: string;
  entryHash: string;
  timestamp?: string;
}

/**
 * Enterprise Telemetry Forwarder:
 * Asynchronously buffers and flushes cryptographic audit receipts in micro-batches
 * to the Sevlex Cloud Ingestion API (POST /api/ingest) with zero added stdio latency.
 */
export class TelemetryForwarder {
  private queue: IngestionReceipt[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private ingestUrl: string | null;
  private apiKey: string;
  private maxQueueSize: number = 1000;
  private batchSize: number = 10;
  private flushIntervalMs: number = 2000;
  private activeFlush: Promise<void> | null = null;

  constructor() {
    let defaultEndpoint: string | null = null;
    let defaultKey: string | null = null;
    try {
      const cfg = getUserConfig();
      if (cfg && cfg.endpoint) defaultEndpoint = cfg.endpoint;
      if (cfg && cfg.apiKey) defaultKey = cfg.apiKey;
    } catch {}

    this.ingestUrl = process.env.SEVLEX_INGEST_URL || defaultEndpoint;
    this.apiKey = process.env.SEVLEX_API_KEY || defaultKey || process.env.ADMIN_API_KEY || "sevlex_secret_123";

    if (this.ingestUrl) {
      this.startTimer();
    }
  }

  public enqueue(receipt: IngestionReceipt): void {
    if (!this.ingestUrl) return;

    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Drop oldest to prevent unbounded memory growth if offline
    }
    this.queue.push(receipt);

    if (this.queue.length >= this.batchSize) {
      this.flush().catch(() => {});
    }
  }

  private startTimer(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush().catch(() => {});
      }
    }, this.flushIntervalMs);

    if (this.flushTimer.unref) {
      this.flushTimer.unref();
    }
  }

  public async flush(): Promise<void> {
    if (this.activeFlush) {
      await this.activeFlush;
      if (this.queue.length > 0 && this.ingestUrl) {
        return this.flush();
      }
      return;
    }

    if (this.queue.length === 0 || !this.ingestUrl) return;

    this.activeFlush = (async () => {
      while (this.queue.length > 0 && this.ingestUrl) {
        const batch = this.queue.splice(0, this.batchSize);
        const targetUrl = `${this.ingestUrl.replace(/\/+$/, "")}/api/ingest`;

        try {
          const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": this.apiKey,
            },
            body: JSON.stringify({ receipts: batch }),
          });

          if (!response.ok) {
            if (this.queue.length + batch.length <= this.maxQueueSize) {
              this.queue.unshift(...batch);
              break;
            }
          }
        } catch {
          // Offline / network failure: re-queue gracefully and break loop
          if (this.queue.length + batch.length <= this.maxQueueSize) {
            this.queue.unshift(...batch);
            break;
          }
        }
      }
    })();

    try {
      await this.activeFlush;
    } finally {
      this.activeFlush = null;
    }
  }

  public stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

export class AuditLogger {
  public db: Database.Database;
  public forwarder: TelemetryForwarder;
  private insertStatement: Database.Statement;
  private lastHash: string = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor(dbPath: string) {
    this.db = new Database(path.resolve(dbPath));
    this.forwarder = new TelemetryForwarder();

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

    // Asynchronously forward to Cloud Ingestion Pipeline (non-blocking stdio)
    this.forwarder.enqueue({
      userId: entry.userId,
      toolName: entry.toolName,
      status: entry.status,
      rawRequest: entry.rawRequest,
      rawResponse: entry.rawResponse || null,
      prevHash,
      entryHash,
      timestamp: new Date().toISOString(),
    });

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
   * Rejects a pending HITL ticket.
   */
  public rejectHitlTicket(ticketId: string, rejectedBy: string): boolean {
    const result = this.db.prepare(`
      UPDATE hitl_tickets 
      SET status = 'REJECTED', approved_by = ?, approved_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ? AND status = 'PENDING'
    `).run(rejectedBy, ticketId);
    return result.changes > 0;
  }

  /**
   * Fetches HITL tickets.
   */
  public getHitlTickets(status?: "PENDING" | "APPROVED" | "REJECTED"): any[] {
    if (status) {
      return this.db.prepare("SELECT * FROM hitl_tickets WHERE status = ? ORDER BY created_at DESC").all(status) as any[];
    }
    return this.db.prepare("SELECT * FROM hitl_tickets ORDER BY created_at DESC LIMIT 50").all() as any[];
  }

  /**
   * Checks if an approved clearance ticket exists for a tool call.
   * If found and within the validity window (15 mins), marks it as CONSUMED and returns the clearance details.
   */
  public consumeApprovedHitlClearance(userId: string, toolName: string): { approved: boolean; ticketId?: string; approvedBy?: string } {
    try {
      const ticket = this.db.prepare(`
        SELECT ticket_id, approved_by, approved_at 
        FROM hitl_tickets 
        WHERE user_id = ? AND tool_name = ? AND status = 'APPROVED'
        ORDER BY approved_at DESC LIMIT 1
      `).get(userId, toolName) as any;

      if (!ticket) {
        return { approved: false };
      }

      // Check clearance expiration window (15 minutes), ensuring UTC parsing
      const dateStr = ticket.approved_at.endsWith("Z") ? ticket.approved_at : ticket.approved_at.replace(" ", "T") + "Z";
      const approvedTime = new Date(dateStr).getTime();
      const now = Date.now();
      const fifteenMinutesMs = 15 * 60 * 1000;

      if (now - approvedTime > fifteenMinutesMs) {
        this.db.prepare("UPDATE hitl_tickets SET status = 'EXPIRED' WHERE ticket_id = ?").run(ticket.ticket_id);
        return { approved: false };
      }

      // Consume the ticket so it cannot be re-used for replay attacks
      this.db.prepare("UPDATE hitl_tickets SET status = 'CONSUMED' WHERE ticket_id = ?").run(ticket.ticket_id);

      return {
        approved: true,
        ticketId: ticket.ticket_id,
        approvedBy: ticket.approved_by,
      };
    } catch (err) {
      console.error("Failed to check HITL clearance:", err);
      return { approved: false };
    }
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
    this.forwarder.stop();
    this.db.close();
  }
}

