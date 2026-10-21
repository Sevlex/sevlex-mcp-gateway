-- ======================================================================
-- SEVLEX ENTERPRISE DATABASE INITIALIZATION SCHEMA
-- Target: PostgreSQL 14+ / AWS RDS PostgreSQL / Aurora PostgreSQL
-- ======================================================================

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

-- Fast lookup indexes for Enterprise SecOps SIEM queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tool_name ON audit_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);

-- Dual-Custody HITL (Human-in-the-Loop) clearance tickets
CREATE TABLE IF NOT EXISTS hitl_tickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    arguments TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    signature TEXT
);

CREATE INDEX IF NOT EXISTS idx_hitl_tickets_status ON hitl_tickets(status);
CREATE INDEX IF NOT EXISTS idx_hitl_tickets_requested_at ON hitl_tickets(requested_at DESC);
