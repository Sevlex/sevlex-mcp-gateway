import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';
import { validateApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  let tenantOrgId: string | null = null;
  let isMasterAdmin = false;

  if (token.startsWith('slx_live_')) {
    const keyContext = await validateApiKey(token);
    if (!keyContext) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or revoked Organization API key' }, { status: 401 });
    }
    tenantOrgId = keyContext.orgId;
  } else if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    isMasterAdmin = true;
    const { searchParams } = new URL(request.url);
    tenantOrgId = searchParams.get('org_id') || null;
  } else {
    return NextResponse.json({ error: 'Unauthorized: Valid API Key required' }, { status: 401 });
  }

  // 1. Production: PostgreSQL (Tenant Isolated)
  const pool = getPgPool();
  if (pool) {
    try {
      let query: string;
      let params: any[] = [];

      if (tenantOrgId) {
        query = `
          SELECT id, org_id, timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash
          FROM audit_logs
          WHERE org_id = $1
          ORDER BY id DESC
          LIMIT 100
        `;
        params = [tenantOrgId];
      } else {
        query = `
          SELECT id, org_id, timestamp, user_id, tool_name, status, raw_request, raw_response, prev_hash, entry_hash
          FROM audit_logs
          ORDER BY id DESC
          LIMIT 100
        `;
      }

      const result = await pool.query(query, params);

      const logs = result.rows.map((row: any) => ({
        id: Number(row.id),
        org_id: row.org_id,
        timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
        user_id: row.user_id,
        tool_name: row.tool_name,
        status: row.status,
        raw_request: row.raw_request,
        raw_response: row.raw_response,
        prev_hash: row.prev_hash,
        entry_hash: row.entry_hash,
      }));

      return NextResponse.json({
        logs,
        storage: 'postgres',
        scoped_org_id: tenantOrgId,
        is_master: isMasterAdmin,
      });
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
