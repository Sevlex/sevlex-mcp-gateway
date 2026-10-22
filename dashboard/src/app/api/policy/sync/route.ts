import { NextResponse } from 'next/server';
import { getPgPool } from '@/lib/db';
import { validateApiKey } from '@/lib/keys';

export const dynamic = 'force-dynamic';

/**
 * Cloud Policy Synchronization Endpoint
 * Called by developer CLI instances (npx sevlex) to pull the organization's central policy rules.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  let orgId: string | null = null;
  let orgName: string | null = null;

  if (token.startsWith('slx_live_')) {
    const keyContext = await validateApiKey(token);
    if (!keyContext) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Organization API key' }, { status: 401 });
    }
    orgId = keyContext.orgId;
    orgName = keyContext.orgName;
  } else if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    const { searchParams } = new URL(request.url);
    orgId = searchParams.get('org_id');
  } else {
    return NextResponse.json({ error: 'Unauthorized: Organization API key required' }, { status: 401 });
  }

  const pool = getPgPool();
  if (!pool || !orgId) {
    return NextResponse.json({
      policy: {
        defaultAction: 'ALLOW',
        blockedTools: [],
        approvalRequiredTools: [],
      },
      source: 'default',
    });
  }

  try {
    const res = await pool.query(
      `SELECT policy_json, version, updated_at FROM org_policies WHERE org_id = $1 LIMIT 1`,
      [orgId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({
        org_id: orgId,
        org_name: orgName,
        policy: {
          defaultAction: 'ALLOW',
          blockedTools: ['delete_database', 'drop_table'],
          approvalRequiredTools: ['github_list_pull_requests'],
        },
        version: 1,
        source: 'default_provisioned',
      });
    }

    const row = res.rows[0];
    return NextResponse.json({
      org_id: orgId,
      org_name: orgName,
      version: row.version,
      updated_at: row.updated_at,
      policy: row.policy_json,
      source: 'cloud_organization',
    });
  } catch (err: any) {
    console.error('Failed to sync policy:', err);
    return NextResponse.json({ error: 'Failed to sync policy', message: err.message }, { status: 500 });
  }
}
