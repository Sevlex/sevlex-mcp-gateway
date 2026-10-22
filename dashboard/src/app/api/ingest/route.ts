import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';
import { validateApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

export interface IngestionReceipt {
  userId?: string;
  user_id?: string;
  toolName?: string;
  tool_name?: string;
  status: string;
  rawRequest?: string;
  raw_request?: string;
  rawResponse?: string | null;
  raw_response?: string | null;
  prevHash?: string;
  prev_hash?: string;
  entryHash?: string;
  entry_hash?: string;
  timestamp?: string;
}

export async function POST(request: Request) {
  // 1. Dual Authentication: Multi-Tenant API Key (slx_live_...) OR Enterprise Master Key
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  let tenantOrgId: string | null = null;
  let tenantOrgName: string | null = null;

  if (token.startsWith('slx_live_')) {
    const keyContext = await validateApiKey(token);
    if (!keyContext) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or revoked Organization API key' }, { status: 401 });
    }
    tenantOrgId = keyContext.orgId;
    tenantOrgName = keyContext.orgName;
  } else if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    // Master admin clearance (Single-tenant VPC or root administrative ingestion)
    tenantOrgId = null;
  } else {
    return NextResponse.json({ error: 'Unauthorized: Valid API Key required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawReceipts: IngestionReceipt[] = Array.isArray(body.receipts)
      ? body.receipts
      : body.receipt
      ? [body.receipt]
      : Array.isArray(body)
      ? body
      : [];

    if (rawReceipts.length === 0) {
      return NextResponse.json({ error: 'No receipts provided in payload' }, { status: 400 });
    }

    const normalized = rawReceipts.map((r, idx) => ({
      id: Date.now() + idx,
      timestamp: r.timestamp || new Date().toISOString(),
      user_id: r.userId || r.user_id || 'unknown',
      tool_name: r.toolName || r.tool_name || 'unknown',
      status: r.status || 'ALLOWED',
      raw_request: typeof (r.rawRequest ?? r.raw_request) === 'object'
        ? JSON.stringify(r.rawRequest ?? r.raw_request)
        : String(r.rawRequest ?? r.raw_request ?? '{}'),
      raw_response: r.rawResponse ?? r.raw_response ?? null,
      prev_hash: r.prevHash || r.prev_hash || '0000000000000000000000000000000000000000000000000000000000000000',
      entry_hash: r.entryHash || r.entry_hash || null,
    }));

    // 2. Production: PostgreSQL (Multi-Tenant & Tenant Isolated)
    const pool = getPgPool();
    if (pool) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS audit_logs (
            id BIGSERIAL PRIMARY KEY,
            org_id UUID,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            user_id TEXT NOT NULL,
            tool_name TEXT NOT NULL,
            status TEXT NOT NULL,
            raw_request TEXT NOT NULL,
            raw_response TEXT,
            prev_hash TEXT,
            entry_hash TEXT
          );
          CREATE INDEX IF NOT EXISTS idx_audit_logs_org_timestamp ON audit_logs(org_id, timestamp DESC);
          CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
        `);

        for (const rec of normalized) {
          await pool.query(
            `INSERT INTO audit_logs (org_id, timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [tenantOrgId, rec.timestamp, rec.user_id, rec.tool_name, rec.status, rec.raw_request, rec.raw_response, rec.prev_hash, rec.entry_hash]
          );
        }

        return NextResponse.json({
          success: true,
          ingested: normalized.length,
          storage: 'postgres',
          org_id: tenantOrgId,
          org_name: tenantOrgName,
        });
      } catch (err: any) {
        console.warn('PostgreSQL write failed, falling back to local SQLite:', err.message);
      }
    }

    // 3. Local Offline Dev / Demo Fallback: SQLite
    const db = getSqliteDb(false);
    if (db) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          user_id TEXT NOT NULL,
          tool_name TEXT NOT NULL,
          status TEXT NOT NULL,
          raw_request TEXT NOT NULL,
          raw_response TEXT,
          prev_hash TEXT,
          entry_hash TEXT
        )
      `);

      const insert = db.prepare(`
        INSERT INTO audit_logs (timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rec of normalized) {
        insert.run(rec.timestamp, rec.user_id, rec.tool_name, rec.status, rec.raw_request, rec.raw_response, rec.prev_hash, rec.entry_hash);
      }
      db.close();

      return NextResponse.json({ success: true, ingested: normalized.length, storage: 'sqlite' });
    }

    return NextResponse.json({ error: 'No database available' }, { status: 500 });
  } catch (err: any) {
    console.error('Error in /api/ingest:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err?.message }, { status: 500 });
  }
}
