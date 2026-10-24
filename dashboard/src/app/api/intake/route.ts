import { NextResponse } from 'next/server';
import { getPgPool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, sourceType, aiClient, details } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // 1. Persist to Neon PostgreSQL if available
    const pool = getPgPool();
    if (pool) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS intake_leads (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            source_type VARCHAR(255),
            ai_client VARCHAR(255),
            details TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        await pool.query(
          `INSERT INTO intake_leads (name, email, source_type, ai_client, details)
           VALUES ($1, $2, $3, $4, $5)`,
          [name, email, sourceType || '', aiClient || '', details || '']
        );
      } catch (dbErr: any) {
        console.error('[Sevlex Intake] Database insert notice:', dbErr.message);
      }
    }

    // 2. Dispatch Slack Notification if Webhook Configured
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl && slackWebhookUrl.startsWith('https://hooks.slack.com')) {
      try {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Custom MCP Server Request Received*`,
            attachments: [
              {
                color: '#3B82F6',
                fields: [
                  { title: 'Contact Name', value: name, short: true },
                  { title: 'Email Address', value: email, short: true },
                  { title: 'Target Data Source', value: sourceType || 'Custom', short: true },
                  { title: 'AI Runtime Client', value: aiClient || 'Claude Desktop / Cursor', short: true },
                  { title: 'Project Scope', value: details || 'None provided', short: false },
                ],
                footer: 'Sevlex Enterprise White-Glove Ingestion',
                ts: Math.floor(Date.now() / 1000),
              },
            ],
          }),
        });
      } catch (slackErr: any) {
        console.error('[Sevlex Intake] Slack dispatch notice:', slackErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your custom MCP server request has been securely recorded. Our solutions architect will contact you within 24 hours.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process intake submission', details: error.message },
      { status: 500 }
    );
  }
}
