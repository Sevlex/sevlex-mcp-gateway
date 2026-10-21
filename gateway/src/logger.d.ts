import Database from "better-sqlite3";
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
export declare class TelemetryForwarder {
    private queue;
    private flushTimer;
    private ingestUrl;
    private apiKey;
    private maxQueueSize;
    private batchSize;
    private flushIntervalMs;
    private activeFlush;
    constructor();
    enqueue(receipt: IngestionReceipt): void;
    private startTimer;
    flush(): Promise<void>;
    stop(): void;
}
export declare class AuditLogger {
    db: Database.Database;
    forwarder: TelemetryForwarder;
    private insertStatement;
    private lastHash;
    constructor(dbPath: string);
    /**
     * Computes an immutable SHA-256 hash of the audit entry anchored to prev_hash.
     */
    private computeHash;
    /**
     * Writes a cryptographically signed audit log to the tamper-evident chain.
     */
    log(entry: AuditLogEntry): {
        entryHash: string;
        prevHash: string;
    };
    /**
     * Registers a stateful Human-in-the-Loop ticket awaiting SecOps clearance.
     */
    createHitlTicket(userId: string, toolName: string, rawRequest: string): string;
    /**
     * Authorizes a pending HITL ticket.
     */
    approveHitlTicket(ticketId: string, approvedBy: string): boolean;
    /**
     * Rejects a pending HITL ticket.
     */
    rejectHitlTicket(ticketId: string, rejectedBy: string): boolean;
    /**
     * Fetches HITL tickets.
     */
    getHitlTickets(status?: "PENDING" | "APPROVED" | "REJECTED"): any[];
    /**
     * Checks if an approved clearance ticket exists for a tool call.
     * If found and within the validity window (15 mins), marks it as CONSUMED and returns the clearance details.
     */
    consumeApprovedHitlClearance(userId: string, toolName: string): {
        approved: boolean;
        ticketId?: string;
        approvedBy?: string;
    };
    /**
     * Mathematically verifies the cryptographic integrity of the entire audit chain.
     */
    verifyAuditChain(): {
        valid: boolean;
        totalReceipts: number;
        brokenAtId?: number;
    };
    close(): void;
}
//# sourceMappingURL=logger.d.ts.map