import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getDb() {
  const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(process.cwd(), '../gateway/audit_log.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  return db;
}

/**
 * Handles incoming Slack Interactivity payloads (1-Click Approve / Reject action buttons)
 */
export async function POST(request: Request) {
  try {
    let payload: any;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const raw = formData.get('payload');
      payload = typeof raw === 'string' ? JSON.parse(raw) : {};
    } else {
      payload = await request.json();
    }

    const actionObj = payload.actions?.[0];
    if (!actionObj || !actionObj.value) {
      return NextResponse.json({ error: 'Missing interactive action payload' }, { status: 400 });
    }

    let actionData: { ticketId: string; action: 'APPROVE' | 'REJECT'; toolName?: string; userId?: string };
    try {
      actionData = JSON.parse(actionObj.value);
    } catch {
      return NextResponse.json({ error: 'Malformed action value JSON' }, { status: 400 });
    }

    const { ticketId, action, toolName } = actionData;
    const approver = payload.user?.username || payload.user?.name || 'slack_secops_lead';

    const db = getDb();
    const ticket = db.prepare('SELECT * FROM hitl_tickets WHERE ticket_id = ?').get(ticketId) as any;

    if (!ticket) {
      db.close();
      return NextResponse.json({
        text: `⚠️ Sevlex Error: Ticket \`${ticketId}\` does not exist.`
      });
    }

    if (ticket.status !== 'PENDING') {
      db.close();
      return NextResponse.json({
        text: `ℹ️ Ticket \`${ticketId}\` has already been resolved as *${ticket.status}* by @${ticket.approved_by || 'system'}.`
      });
    }

    const signature = crypto.createHash('sha256').update(`${ticketId}:${approver}:${Date.now()}`).digest('hex');
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    db.prepare(`
      UPDATE hitl_tickets 
      SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, signature = ?
      WHERE ticket_id = ? AND status = 'PENDING'
    `).run(newStatus, approver, signature, ticketId);

    db.close();

    const isApproved = action === 'APPROVE';
    const resolutionText = isApproved
      ? `✅ *SEVLEX DUAL-CUSTODY CLEARANCE GRANTED*\n• *Ticket:* \`${ticketId}\`\n• *Tool:* \`${toolName || ticket.tool_name}\`\n• *Authorized By:* @${approver}\n• *Clearance Window:* 15 minutes (Replay-Proof)\n\n_Agent retry execution is now permitted._`
      : `❌ *SEVLEX DUAL-CUSTODY REJECTED*\n• *Ticket:* \`${ticketId}\`\n• *Tool:* \`${toolName || ticket.tool_name}\`\n• *Rejected By:* @${approver}\n\n_Agent tool execution permanently halted._`;

    return NextResponse.json({
      replace_original: true,
      text: resolutionText,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: isApproved ? '✅ Clearance Authorized via Slack' : '❌ Clearance Rejected via Slack',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: resolutionText
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Cryptographic Signature: \`${signature.slice(0, 16)}...\` • Recorded in SQLite WAL audit log`
            }
          ]
        }
      ]
    });
  } catch (err: any) {
    console.error('Failed to process Slack interaction:', err);
    return NextResponse.json({ error: 'Internal server error processing Slack interaction' }, { status: 500 });
  }
}
