import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getDb() {
  return getSqliteDb(false);
}

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Production PostgreSQL (Neon / RDS)
  const pool = getPgPool();
  if (pool) {
    try {
      const res = await pool.query(`
        SELECT ticket_id, org_id, user_id, tool_name, arguments, status, requested_at, approved_by, approved_at, signature
        FROM hitl_tickets
        ORDER BY requested_at DESC
        LIMIT 50
      `);
      return NextResponse.json({ tickets: res.rows });
    } catch (err: any) {
      console.warn('PostgreSQL HITL query failed, falling back to SQLite:', err.message);
    }
  }

  try {
    const db = getDb();
    if (!db) return NextResponse.json({ tickets: [] });
    const tickets = db.prepare('SELECT * FROM hitl_tickets ORDER BY created_at DESC LIMIT 50').all();
    db.close();
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Failed to read HITL tickets:', error);
    return NextResponse.json({ tickets: [] });
  }
}

export async function POST(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticketId, action, approver } = body;

    if (!ticketId || !action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const approvedBy = approver || 'secops_admin@enterprise.internal';
    const signature = crypto.createHash('sha256').update(`${ticketId}:${approvedBy}:${Date.now()}`).digest('hex');
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // 1. Production PostgreSQL (Neon / RDS)
    const pool = getPgPool();
    if (pool) {
      try {
        const result = await pool.query(`
          UPDATE hitl_tickets 
          SET status = $1, approved_by = $2, approved_at = NOW(), signature = $3
          WHERE ticket_id = $4 AND status = 'PENDING'
          RETURNING *;
        `, [newStatus, approvedBy, signature, ticketId]);

        if (result.rowCount === 0) {
          // Check if ticket exists but already resolved
          const existing = await pool.query('SELECT * FROM hitl_tickets WHERE ticket_id = $1', [ticketId]);
          if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Ticket already resolved', ticket: existing.rows[0] }, { status: 409 });
          }
          return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, ticket: result.rows[0] });
      } catch (err: any) {
        console.warn('PostgreSQL HITL update failed, falling back to SQLite:', err.message);
      }
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const result = db.prepare(`
      UPDATE hitl_tickets 
      SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, signature = ?
      WHERE ticket_id = ? AND status = 'PENDING'
    `).run(newStatus, approvedBy, signature, ticketId);

    if (result.changes === 0) {
      db.close();
      return NextResponse.json({ error: 'Ticket not found or already resolved' }, { status: 404 });
    }

    const updated = db.prepare('SELECT * FROM hitl_tickets WHERE ticket_id = ?').get(ticketId);
    db.close();

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error('Failed to update HITL ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
