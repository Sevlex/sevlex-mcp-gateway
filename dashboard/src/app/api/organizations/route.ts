import { NextResponse } from 'next/server';
import { getPgPool } from '@/lib/db';
import { createOrganizationApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Master admin clearance required to provision new organizations via API
  if (process.env.ADMIN_API_KEY && token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized: Master admin clearance required' }, { status: 401 });
  }

  const pool = getPgPool();
  if (!pool) {
    return NextResponse.json({ error: 'PostgreSQL database connection required for multi-tenant provisioning' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, slug, plan = 'free' } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields: name and slug' }, { status: 400 });
    }

    // Clean and validate slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    // 1. Create Organization in PostgreSQL
    const orgRes = await pool.query(
      `INSERT INTO organizations (name, slug, plan)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, slug, plan, created_at`,
      [name, cleanSlug, plan]
    );

    const org = orgRes.rows[0];

    // 2. Generate First Production API Key for this Organization
    const keyData = await createOrganizationApiKey(org.id, 'Default CLI Gateway Key');

    // 3. Initialize Default Dynamic Policy
    await pool.query(
      `INSERT INTO org_policies (org_id, policy_json, version)
       VALUES ($1, $2, 1)
       ON CONFLICT (org_id) DO NOTHING`,
      [
        org.id,
        JSON.stringify({
          defaultAction: 'ALLOW',
          blockedTools: ['delete_database', 'drop_table'],
          approvalRequiredTools: ['github_list_pull_requests', 'aws_terminate_instance'],
        }),
      ]
    );

    return NextResponse.json({
      success: true,
      organization: org,
      initialApiKey: {
        rawKey: keyData.rawKey, // Returned ONLY once!
        keyPrefix: keyData.keyPrefix,
        keyId: keyData.keyId,
        instructions: `Run on your workstation: npx sevlex config set api_key=${keyData.rawKey}`,
      },
    });
  } catch (err: any) {
    console.error('Failed to provision organization:', err);
    return NextResponse.json({ error: 'Failed to create organization', message: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  const pool = getPgPool();
  if (!pool) {
    return NextResponse.json({ error: 'PostgreSQL required' }, { status: 500 });
  }

  if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    // Return all organizations for master admin
    const res = await pool.query(`
      SELECT o.id, o.name, o.slug, o.plan, o.created_at,
             COUNT(DISTINCT k.id) as active_keys,
             COUNT(DISTINCT a.id) as total_receipts
      FROM organizations o
      LEFT JOIN api_keys k ON o.id = k.org_id AND k.revoked_at IS NULL
      LEFT JOIN audit_logs a ON o.id = a.org_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return NextResponse.json({ organizations: res.rows });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
