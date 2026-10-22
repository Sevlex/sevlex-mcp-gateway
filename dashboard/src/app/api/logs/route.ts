import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Production: PostgreSQL (AWS RDS in VPC or Docker Compose)
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
    } catch (err: any) {
      console.warn('PostgreSQL query unavailable, falling back to local SQLite:', err.message);
    }
  }

  // 2. Local Offline Dev / Demo Fallback: SQLite
  try {
    const db = getSqliteDb(true);
    if (db) {
      const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all();
      db.close();
      return NextResponse.json({ logs, storage: 'sqlite' });
    }
  } catch (err: any) {
    console.error('SQLite query error:', err);
  }

  return NextResponse.json({ logs: [], storage: 'none' });
}
