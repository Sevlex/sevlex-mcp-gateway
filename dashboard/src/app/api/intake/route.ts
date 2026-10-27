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

    // 2. Dispatch Real-Time Instant Lead Alerts (Slack, Discord, Telegram, or Webhook)
    const alertPromises: Promise<any>[] = [];

    // A. Slack Webhook
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl && slackWebhookUrl.startsWith('https://hooks.slack.com')) {
      alertPromises.push(
        fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Custom MCP Server Request Received*`,
            attachments: [
              {
                color: '#34D59A',
                fields: [
                  { title: 'Contact Name', value: name, short: true },
                  { title: 'Email Address', value: email, short: true },
                  { title: 'Target Stack', value: sourceType || 'Custom', short: true },
                  { title: 'AI Runtime Client', value: aiClient || 'Claude Desktop / Cursor', short: true },
                  { title: 'Project Scope', value: details || 'None provided', short: false },
                ],
                footer: 'Sevlex Enterprise Inbound Lead',
                ts: Math.floor(Date.now() / 1000),
              },
            ],
          }),
        }).catch((err) => console.error('[Sevlex Intake] Slack dispatch notice:', err.message))
      );
    }

    // B. Discord Webhook
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl && (discordWebhookUrl.includes('discord.com/api/webhooks') || discordWebhookUrl.includes('discordapp.com/api/webhooks'))) {
      alertPromises.push(
        fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🎯 **New Custom MCP Server Request Received**\n**Name:** ${name}\n**Email:** ${email}\n**Target Stack:** ${sourceType || 'Custom'}\n**AI Runtime:** ${aiClient || 'Claude Desktop / Cursor'}\n**Project Scope:**\n\`\`\`\n${details || 'None provided'}\n\`\`\``,
          }),
        }).catch((err) => console.error('[Sevlex Intake] Discord dispatch notice:', err.message))
      );
    }

    // C. Telegram Bot Notification
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      const telegramText = `🎯 *New Custom MCP Server Request*\n\n*Name:* ${name}\n*Email:* ${email}\n*Target Stack:* ${sourceType || 'Custom'}\n*AI Runtime:* ${aiClient || 'Claude Desktop / Cursor'}\n\n*Project Scope:*\n${details || 'None provided'}`;
      alertPromises.push(
        fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramText,
            parse_mode: 'Markdown',
          }),
        }).catch((err) => console.error('[Sevlex Intake] Telegram dispatch notice:', err.message))
      );
    }

    // D. Generic Custom Webhook (Make / Zapier / n8n / Custom endpoint)
    const genericWebhookUrl = process.env.INTAKE_WEBHOOK_URL;
    if (genericWebhookUrl && genericWebhookUrl.startsWith('http')) {
      alertPromises.push(
        fetch(genericWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead.created',
            name,
            email,
            sourceType,
            aiClient,
            details,
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => console.error('[Sevlex Intake] Webhook dispatch notice:', err.message))
      );
    }

    if (alertPromises.length > 0) {
      await Promise.allSettled(alertPromises);
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
