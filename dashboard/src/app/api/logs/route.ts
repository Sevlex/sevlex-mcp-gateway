import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';

// Force Next.js to not cache this route so the logs are always live
export const dynamic = 'force-dynamic';

declare global {
  var __SEVLEX_INGESTED_LOGS__: any[] | undefined;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Direct PostgreSQL / AWS RDS in Customer VPC (if DATABASE_URL configured)
  const pool = getPgPool();
  if (pool) {
    try {
      const result = await pool.query(`
        SELECT id, timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash
        FROM audit_logs
        ORDER BY id DESC
        LIMIT 100
      `);

      const logs = result.rows.map((row: any) => ({
        id: Number(row.id),
        timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
        user_id: row.user_id,
        tool_name: row.tool_name,
        status: row.status,
        raw_request: row.raw_request,
        raw_response: row.raw_response,
        prev_hash: row.prev_hash,
        entry_hash: row.entry_hash,
      }));

      return NextResponse.json({ logs, storage: 'postgres' });
    } catch (err) {
      console.error('Direct PostgreSQL query failed, attempting fallbacks:', err);
    }
  }

  // 2. Cloud DB: Supabase / PostgreSQL REST API (if SUPABASE_URL configured)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/audit_logs?select=*&order=id.desc&limit=100`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const rawLogs = await res.json();
        const logs = rawLogs.map((row: any) => ({
          id: row.id,
          timestamp: row.timestamp || row.created_at,
          user_id: row.user_id,
          tool_name: row.tool_name,
          status: row.status,
          raw_request: row.raw_request,
          raw_response: row.raw_response,
          prev_hash: row.prev_hash,
          entry_hash: row.entry_hash,
        }));
        return NextResponse.json({ logs, storage: 'supabase' });
      }
    } catch (err) {
      console.error('Failed to fetch logs from Supabase, falling back:', err);
    }
  }

  // 3. Local SQLite fallback (using built-in node:sqlite via getSqliteDb)
  try {
    const db = getSqliteDb(true);
    if (db) {
      const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all();
      db.close();
      return NextResponse.json({ logs, storage: 'sqlite' });
    }
  } catch (err) {
    console.warn('Local SQLite read failed, falling back to memory:', err);
  }

  // 4. In-Memory fallback buffer (useful in serverless or container bootstrap without DB)
  if (globalThis.__SEVLEX_INGESTED_LOGS__ && globalThis.__SEVLEX_INGESTED_LOGS__.length > 0) {
    const logs = [...globalThis.__SEVLEX_INGESTED_LOGS__].reverse().slice(0, 100);
    return NextResponse.json({ logs, storage: 'memory' });
  }

  return NextResponse.json({ logs: [], storage: 'none' });
}
