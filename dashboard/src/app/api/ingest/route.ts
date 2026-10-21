import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';

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
  // 1. Authentication check
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // 2. Production: PostgreSQL (AWS RDS in VPC or Docker Compose)
    const pool = getPgPool();
    if (pool) {
      await pool.query(`
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

      for (const rec of normalized) {
        await pool.query(
          `INSERT INTO audit_logs (timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [rec.timestamp, rec.user_id, rec.tool_name, rec.status, rec.raw_request, rec.raw_response, rec.prev_hash, rec.entry_hash]
        );
      }

      return NextResponse.json({ success: true, ingested: normalized.length, storage: 'postgres' });
    }

    // 3. Local Offline Dev: SQLite
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

    return NextResponse.json({ error: 'No database configured' }, { status: 500 });
  } catch (err: any) {
    console.error('Error in /api/ingest:', err);
    return NextResponse.json({ error: 'Internal Server Error', message: err?.message }, { status: 500 });
  }
}
