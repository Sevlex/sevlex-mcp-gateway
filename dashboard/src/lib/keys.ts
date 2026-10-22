import crypto from 'crypto';
import { getPgPool } from './db';

export interface ValidatedKeyContext {
  orgId: string;
  orgName: string;
  orgSlug: string;
  plan: string;
  keyId: string;
  keyName: string;
}

/**
 * Computes a deterministic SHA-256 hash of an API key for safe database storage.
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey.trim()).digest('hex');
}

/**
 * Generates a new cryptographically secure high-entropy Organization API key.
 * Format: slx_live_<48_hex_chars>
 */
export async function createOrganizationApiKey(
  orgId: string,
  keyName: string
): Promise<{ rawKey: string; keyPrefix: string; keyId: string }> {
  const pool = getPgPool();
  if (!pool) {
    throw new Error('PostgreSQL database pool not available to create API key');
  }

  const entropy = crypto.randomBytes(24).toString('hex');
  const rawKey = `slx_live_${entropy}`;
  const keyPrefix = `${rawKey.slice(0, 14)}...`;
  const keyHash = hashApiKey(rawKey);

  const res = await pool.query(
    `INSERT INTO api_keys (org_id, name, key_hash, key_prefix)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [orgId, keyName, keyHash, keyPrefix]
  );

  return {
    rawKey,
    keyPrefix,
    keyId: res.rows[0].id,
  };
}

/**
 * Validates an incoming API key against PostgreSQL.
 * Performs sub-millisecond hash lookup and updates last_used_at.
 */
export async function validateApiKey(rawKey: string): Promise<ValidatedKeyContext | null> {
  const pool = getPgPool();
  if (!pool || !rawKey || !rawKey.startsWith('slx_live_')) {
    return null;
  }

  try {
    const keyHash = hashApiKey(rawKey);
    const result = await pool.query(
      `SELECT 
         k.id AS key_id,
         k.name AS key_name,
         o.id AS org_id,
         o.name AS org_name,
         o.slug AS org_slug,
         o.plan AS plan
       FROM api_keys k
       INNER JOIN organizations o ON k.org_id = o.id
       WHERE k.key_hash = $1 AND k.revoked_at IS NULL
       LIMIT 1`,
      [keyHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // Asynchronously update last_used_at without blocking the request
    pool.query('UPDATE api_keys SET last_used_at = NOW() WHERE id = $1', [row.key_id]).catch((err) => {
      console.warn('Failed to update api_key last_used_at:', err.message);
    });

    return {
      orgId: row.org_id,
      orgName: row.org_name,
      orgSlug: row.org_slug,
      plan: row.plan,
      keyId: row.key_id,
      keyName: row.key_name,
    };
  } catch (err: any) {
    console.error('API key validation error:', err.message);
    return null;
  }
}
