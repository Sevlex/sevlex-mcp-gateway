import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';
import { validateApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

/**
 * GET /api/hitl/ticket?ticketId=...
 * Checks the real-time status of a HITL approval ticket.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticketId') || searchParams.get('id');

  if (!ticketId) {
    return NextResponse.json({ error: 'Missing ticketId parameter' }, { status: 400 });
  }

  // 1. Check PostgreSQL (Neon Cloud)
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query(
        'SELECT ticket_id, user_id, tool_name, arguments, status, requested_at, approved_by, approved_at, signature FROM hitl_tickets WHERE ticket_id = $1',
        [ticketId]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return NextResponse.json({
          ticketId: row.ticket_id,
          userId: row.user_id,
          toolName: row.tool_name,
          status: row.status,
          requestedAt: row.requested_at,
          approvedBy: row.approved_by,
          approvedAt: row.approved_at,
          signature: row.signature,
          storage: 'postgres',
        });
      }
    } catch (err: any) {
      console.warn('PostgreSQL query error in hitl ticket lookup:', err.message);
    }
  }

  // 2. Check local SQLite fallback
  const db = getSqliteDb(true);
  if (db) {
    try {
      const row = db.prepare('SELECT * FROM hitl_tickets WHERE ticket_id = ?').get(ticketId) as any;
      if (row) {
        return NextResponse.json({
          ticketId: row.ticket_id,
          userId: row.user_id,
          toolName: row.tool_name,
          status: row.status,
          requestedAt: row.created_at || row.requested_at,
          approvedBy: row.approved_by,
          approvedAt: row.approved_at,
          signature: row.signature,
          storage: 'sqlite',
        });
      }
    } finally {
      db.close();
    }
  }

  return NextResponse.json({ error: 'Ticket not found', ticketId }, { status: 404 });
}

/**
 * POST /api/hitl/ticket
 * Registers a new pending HITL ticket from an edge gateway into the central cloud registry.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  let tenantOrgId: string | null = null;
  if (token.startsWith('slx_live_')) {
    const keyContext = await validateApiKey(token);
    if (!keyContext) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API key' }, { status: 401 });
    }
    tenantOrgId = keyContext.orgId;
  } else if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    tenantOrgId = null;
  } else {
    return NextResponse.json({ error: 'Unauthorized: Valid API Key required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticketId, userId, toolName, arguments: rawArgs } = body;

    if (!ticketId || !toolName) {
      return NextResponse.json({ error: 'Missing required ticket fields' }, { status: 400 });
    }

    const pool = getPgPool();
    if (pool) {
      await pool.query(
        `INSERT INTO hitl_tickets (ticket_id, org_id, user_id, tool_name, arguments, status, requested_at)
         VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW())
         ON CONFLICT (ticket_id) DO UPDATE SET arguments = EXCLUDED.arguments`,
        [ticketId, tenantOrgId, userId || 'developer', toolName, typeof rawArgs === 'object' ? JSON.stringify(rawArgs) : String(rawArgs || '{}')]
      );

      return NextResponse.json({
        success: true,
        ticketId,
        storage: 'postgres',
        status: 'PENDING',
      });
    }

    const db = getSqliteDb(false);
    if (db) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS hitl_tickets (
          ticket_id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          tool_name TEXT NOT NULL,
          arguments TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_by TEXT,
          approved_at DATETIME,
          signature TEXT
        )
      `);

      db.prepare(`
        INSERT OR REPLACE INTO hitl_tickets (ticket_id, user_id, tool_name, arguments, status)
        VALUES (?, ?, ?, ?, 'PENDING')
      `).run(ticketId, userId || 'developer', toolName, typeof rawArgs === 'object' ? JSON.stringify(rawArgs) : String(rawArgs || '{}'));

      db.close();
      return NextResponse.json({ success: true, ticketId, storage: 'sqlite', status: 'PENDING' });
    }

    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  } catch (err: any) {
    console.error('Error creating HITL ticket:', err);
    return NextResponse.json({ error: 'Failed to create HITL ticket', message: err?.message }, { status: 500 });
  }
}
