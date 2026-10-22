import { NextResponse } from 'next/server';
import { getPgPool } from '@/lib/db';
import { createOrganizationApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY && !token.startsWith('slx_live_')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = getPgPool();
  if (!pool) {
    // Offline / Local SQLite fallback with mock representation
    return NextResponse.json({
      keys: [
        {
          id: 'local-key-01',
          name: 'Default Local Development Key',
          key_prefix: 'slx_live_dev1...',
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
          revoked_at: null,
          org_id: 'default-org',
          org_name: 'Local Standalone Workspace',
          plan: 'enterprise_vpc',
        },
      ],
      storage: 'sqlite_offline',
    });
  }

  try {
    const res = await pool.query(`
      SELECT 
        k.id, 
        k.name, 
        k.key_prefix, 
        k.created_at, 
        k.last_used_at, 
        k.revoked_at,
        o.id AS org_id, 
        o.name AS org_name, 
        o.slug AS org_slug, 
        o.plan AS plan
      FROM api_keys k
      INNER JOIN organizations o ON k.org_id = o.id
      ORDER BY k.created_at DESC
    `);

    return NextResponse.json({ keys: res.rows, storage: 'postgres' });
  } catch (err: any) {
    console.error('Failed to fetch API keys:', err);
    return NextResponse.json({ error: 'Failed to fetch API keys', message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY && !token.startsWith('slx_live_')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = getPgPool();
  if (!pool) {
    return NextResponse.json({ error: 'PostgreSQL connection required to issue production API keys' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name = 'Developer Gateway Token', org_id } = body;

    let targetOrgId = org_id;

    // If no org_id supplied, find or create the default enterprise workspace
    if (!targetOrgId) {
      const defaultOrgRes = await pool.query(
        `INSERT INTO organizations (name, slug, plan)
         VALUES ('Sevlex Core Workspace', 'sevlex-core', 'team')
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`
      );
      targetOrgId = defaultOrgRes.rows[0].id;
    }

    const keyData = await createOrganizationApiKey(targetOrgId, name);

    return NextResponse.json({
      success: true,
      key: {
        id: keyData.keyId,
        name,
        rawKey: keyData.rawKey, // Returned ONLY ONCE!
        keyPrefix: keyData.keyPrefix,
        org_id: targetOrgId,
        setupCommand: `npx sevlex config set api_key=${keyData.rawKey}`,
      },
    });
  } catch (err: any) {
    console.error('Failed to generate API key:', err);
    return NextResponse.json({ error: 'Failed to generate API key', message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pool = getPgPool();
  if (!pool) {
    return NextResponse.json({ error: 'PostgreSQL connection required' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ error: 'Missing key ID parameter' }, { status: 400 });
    }

    await pool.query('UPDATE api_keys SET revoked_at = NOW() WHERE id = $1', [keyId]);

    return NextResponse.json({ success: true, revoked_id: keyId });
  } catch (err: any) {
    console.error('Failed to revoke API key:', err);
    return NextResponse.json({ error: 'Failed to revoke API key', message: err.message }, { status: 500 });
  }
}
