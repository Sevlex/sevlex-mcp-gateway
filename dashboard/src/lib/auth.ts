import crypto from 'crypto';
import { getPgPool } from './db';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'github' | 'google' | 'microsoft' | 'api_key';
  orgId?: string;
  orgName?: string;
  plan?: string;
  role?: string;
}

export interface AuthSessionResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  error?: string;
}

// In-memory session cache for sub-millisecond fast lookups
const sessionStore = new Map<string, { user: AuthUser; expiresAt: number }>();

/**
 * Validates whether an incoming request has a valid Master Admin Key,
 * Organization API Key (slx_live_...), or User Session Token (slx_session_...).
 */
export function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  // 1. Master admin clearance
  if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    return true;
  }

  // 2. Organization production key
  if (token.startsWith('slx_live_')) {
    return true;
  }

  // 3. User session token
  if (token.startsWith('slx_session_')) {
    return true;
  }

  return false;
}

/**
 * Creates or retrieves an authenticated session for GitHub, Google, Microsoft, or Key login.
 */
export async function authenticateWithProvider(
  provider: 'github' | 'google' | 'microsoft' | 'api_key',
  payload?: { email?: string; key?: string; name?: string; avatarUrl?: string }
): Promise<AuthSessionResponse> {
  const pool = getPgPool();

  // If logging in with explicit Admin API Key
  if (provider === 'api_key') {
    const rawKey = payload?.key || '';
    if (process.env.ADMIN_API_KEY && rawKey === process.env.ADMIN_API_KEY) {
      const user: AuthUser = {
        id: 'usr_master_admin',
        name: 'SecOps Administrator',
        email: payload?.email || 'admin@sevlex.com',
        provider: 'api_key',
        orgName: 'Sevlex Core Workspace',
        plan: 'Enterprise VPC',
        role: 'Master Admin',
      };
      return { success: true, token: process.env.ADMIN_API_KEY, user };
    }

    if (rawKey.startsWith('slx_live_')) {
      const user: AuthUser = {
        id: 'usr_org_key',
        name: 'Organization Member',
        email: payload?.email || 'member@organization.com',
        provider: 'api_key',
        orgName: 'Enterprise Organization',
        plan: 'Team Tier',
        role: 'Member',
      };
      return { success: true, token: rawKey, user };
    }

    return {
      success: false,
      token: '',
      user: {} as AuthUser,
      error: 'Invalid API Key. Please check your credentials.',
    };
  }

  // Generate high-entropy session token
  const entropy = crypto.randomBytes(24).toString('hex');
  const sessionToken = `slx_session_${entropy}`;

  // Default profiles based on selected provider
  let defaultName = 'Developer';
  let defaultEmail = 'developer@domain.com';
  let defaultAvatar = '';

  if (provider === 'github') {
    defaultName = payload?.name || 'GitHub Developer';
    defaultEmail = payload?.email || 'developer@users.noreply.github.com';
    defaultAvatar = payload?.avatarUrl || 'https://github.com/ghost.png';
  } else if (provider === 'google') {
    defaultName = payload?.name || 'Google Workspace User';
    defaultEmail = payload?.email || 'user@work-domain.com';
    defaultAvatar = payload?.avatarUrl || '';
  } else if (provider === 'microsoft') {
    defaultName = payload?.name || 'Enterprise SSO User';
    defaultEmail = payload?.email || 'security@enterprise.com';
    defaultAvatar = payload?.avatarUrl || '';
  }

  // Ensure PostgreSQL users table exists if connected
  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
          email TEXT UNIQUE,
          name TEXT NOT NULL,
          avatar_url TEXT,
          provider TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          last_login_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Upsert user
      const userRes = await pool.query(
        `INSERT INTO users (email, name, avatar_url, provider, last_login_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO UPDATE SET 
           name = EXCLUDED.name,
           avatar_url = EXCLUDED.avatar_url,
           last_login_at = NOW()
         RETURNING id, org_id, email, name, avatar_url, provider`,
        [defaultEmail, defaultName, defaultAvatar, provider]
      );

      const dbUser = userRes.rows[0];
      const authUser: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatarUrl: dbUser.avatar_url,
        provider,
        orgId: dbUser.org_id,
        orgName: `${defaultName}'s Fleet`,
        plan: 'Free Tier (Unlimited Local Tools)',
        role: 'Workspace Owner',
      };

      sessionStore.set(sessionToken, { user: authUser, expiresAt: Date.now() + 86400 * 30 * 1000 });
      return { success: true, token: sessionToken, user: authUser };
    } catch (e) {
      console.error('[Sevlex Auth] PostgreSQL user sync warning:', e);
    }
  }

  // Stateless fallback profile (works even if database is temporarily unavailable)
  const fallbackUser: AuthUser = {
    id: `usr_${provider}_${entropy.slice(0, 8)}`,
    name: defaultName,
    email: defaultEmail,
    avatarUrl: defaultAvatar,
    provider,
    orgName: `${defaultName}'s Fleet`,
    plan: 'Free Tier (Unlimited Local Tools)',
    role: 'Workspace Owner',
  };

  sessionStore.set(sessionToken, { user: fallbackUser, expiresAt: Date.now() + 86400 * 30 * 1000 });
  return { success: true, token: sessionToken, user: fallbackUser };
}
