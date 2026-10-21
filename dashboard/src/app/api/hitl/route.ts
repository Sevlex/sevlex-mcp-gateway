import { NextResponse } from 'next/server';
import { getSqliteDb } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getDb() {
  return getSqliteDb(false);
}

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
    const approvedBy = approver || 'secops_admin@enterprise.internal';
    const signature = crypto.createHash('sha256').update(`${ticketId}:${approvedBy}:${Date.now()}`).digest('hex');
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

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
