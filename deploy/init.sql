-- ======================================================================
-- SEVLEX ENTERPRISE MULTI-TENANT DATABASE SCHEMA
-- Target: PostgreSQL 14+ / AWS RDS / Aurora / Neon / Cloud Native
-- ======================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------
-- 1. Organizations & Workspaces
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'team', 'enterprise_vpc'
    max_seats INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- ----------------------------------------------------------------------
-- 2. Organization API Keys (slx_live_...)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL, -- SHA-256 hash of secret key
    key_prefix TEXT NOT NULL,     -- e.g. "slx_live_ab12..."
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- ----------------------------------------------------------------------
-- 3. Dynamic Organization Policies (Synchronized to developer CLIs)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS org_policies (
    org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    policy_json JSONB NOT NULL DEFAULT '{}',
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------
-- 4. Audit Logs (Tenant-Scoped with Cryptographic SHA-256 Merkle Chain)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    status TEXT NOT NULL,
    raw_request TEXT NOT NULL,
    raw_response TEXT,
    prev_hash TEXT,
    entry_hash TEXT
);

-- Fast lookup indexes for Tenant SIEM and Analytics queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_timestamp ON audit_logs(org_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tool_name ON audit_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);

-- ----------------------------------------------------------------------
-- 5. Dual-Custody HITL (Human-in-the-Loop) Clearance Tickets
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hitl_tickets (
    ticket_id TEXT PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    arguments TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    signature TEXT
);

CREATE INDEX IF NOT EXISTS idx_hitl_tickets_org_status ON hitl_tickets(org_id, status);
CREATE INDEX IF NOT EXISTS idx_hitl_tickets_status ON hitl_tickets(status);
CREATE INDEX IF NOT EXISTS idx_hitl_tickets_requested_at ON hitl_tickets(requested_at DESC);
