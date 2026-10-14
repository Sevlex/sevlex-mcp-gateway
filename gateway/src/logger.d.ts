export interface AuditLogEntry {
    userId: string;
    toolName: string;
    status: "ALLOWED" | "BLOCKED" | "ERROR";
    rawRequest: string;
    rawResponse?: string;
}
export declare class AuditLogger {
    private db;
    private insertStatement;
    constructor(dbPath: string);
    /**
     * Writes a secure audit log to the database.
     */
    log(entry: AuditLogEntry): void;
    close(): void;
}
//# sourceMappingURL=logger.d.ts.map