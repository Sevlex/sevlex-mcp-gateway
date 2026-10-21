import { NextResponse } from 'next/server';
import { getSqliteDb } from '@/lib/db';

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

  // 1. Cloud DB: Supabase / PostgreSQL REST API (if SUPABASE_URL configured)
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

  // 2. Local SQLite fallback (using built-in node:sqlite via getSqliteDb)
  try {
    const db = getSqliteDb(true);
    if (db) {
      const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all();
      db.close();
      return NextResponse.json({ logs, storage: 'sqlite' });
    }
  } catch (error) {
    console.warn('SQLite fetch failed or unavailable:', error);
  }

  // 3. In-memory buffer fallback (for serverless environments or preview deployments)
  const memLogs = (globalThis.__SEVLEX_INGESTED_LOGS__ || []).slice(-100).reverse();
  return NextResponse.json({ logs: memLogs, storage: 'memory' });
}
