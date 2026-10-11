import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve(process.cwd(), '../gateway/sevlex.json');

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(rawData);
    const siem = config.policy?.siem || {
      enabled: false,
      provider: 'datadog',
      endpoint: 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs',
    };

    return NextResponse.json({
      siem: {
        ...siem,
        hasApiKey: Boolean(siem.apiKey && siem.apiKey !== 'YOUR_DATADOG_API_KEY_HERE')
      },
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || ''
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read integrations config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. Action: Test Datadog Ping
    if (body.action === 'test_datadog') {
      const endpoint = body.endpoint || 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs';
      const apiKey = body.apiKey || process.env.SEVLEX_SIEM_API_KEY || '70bb17537553cedfad6a9cc2e57dfa52';

      const payload = [{
        ddsource: 'sevlex-dashboard',
        ddtags: 'env:production,test:dashboard_ping,service:sevlex-mcp-firewall',
        hostname: 'sevlex-console',
        service: 'sevlex-mcp-firewall',
        message: '✅ Sevlex Integrations Hub: Live Datadog Connection Verified',
        timestamp: new Date().toISOString()
      }];

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 202 || res.status === 200) {
        return NextResponse.json({ success: true, message: 'Ping accepted by Datadog (202 Accepted)' });
      } else {
        return NextResponse.json({ success: false, error: `Datadog returned status ${res.status}` }, { status: 400 });
      }
    }

    // 2. Action: Test Slack Ping
    if (body.action === 'test_slack') {
      const webhookUrl = body.webhookUrl;
      if (!webhookUrl) {
        return NextResponse.json({ success: false, error: 'Missing Slack Webhook URL' }, { status: 400 });
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '🛡️ *Sevlex Security Alert*: Live connection test verified from Sevlex SecOps Console.'
        })
      });

      if (res.ok) {
        return NextResponse.json({ success: true, message: 'Test alert delivered to Slack channel' });
      } else {
        return NextResponse.json({ success: false, error: `Slack returned status ${res.status}` }, { status: 400 });
      }
    }

    // 3. Save Configuration to sevlex.json
    if (body.siem) {
      const rawData = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const config = JSON.parse(rawData);

      config.policy.siem = {
        enabled: Boolean(body.siem.enabled),
        provider: body.siem.provider || 'datadog',
        endpoint: body.siem.endpoint || 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs',
        apiKey: body.siem.apiKey || config.policy.siem?.apiKey || 'YOUR_DATADOG_API_KEY_HERE'
      };

      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
      return NextResponse.json({ success: true, siem: config.policy.siem });
    }

    return NextResponse.json({ error: 'No valid action provided' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process request' }, { status: 500 });
  }
}
