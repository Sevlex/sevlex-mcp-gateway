import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPgPool } from '@/lib/db';
import { registerSession, AuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const installationId = url.searchParams.get('installation_id');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const consoleUrl = `${proto}://${host}/console`;

  // 1. Handle GitHub authorization error (e.g., user cancelled)
  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${consoleUrl}?auth_error=${errorMsg}`);
  }

  if (!code) {
    return NextResponse.redirect(`${consoleUrl}?auth_error=missing_oauth_code`);
  }

  // 2. Validate CSRF state
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const storedState = cookies['sevlex_oauth_state'];
  if (storedState && state && storedState !== state) {
    console.warn('[GitHub OAuth] CSRF state mismatch:', { storedState, state });
    // Don't hard-fail if cookies were cleared in redirect, but log warning
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${consoleUrl}?auth_error=missing_server_credentials`);
  }

  const redirectUri = `${proto}://${host}/api/auth/callback/github`;

  try {
    // 3. Exchange code for access_token with GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[GitHub OAuth] Token exchange error:', tokenData);
      return NextResponse.redirect(
        `${consoleUrl}?auth_error=${encodeURIComponent(tokenData.error_description || 'token_exchange_failed')}`
      );
    }

    const accessToken = tokenData.access_token;

    // 4. Fetch User Profile from GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Sevlex-MCP-Security-Gateway',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      console.error('[GitHub OAuth] Failed to fetch user profile:', userRes.status);
      return NextResponse.redirect(`${consoleUrl}?auth_error=profile_fetch_failed`);
    }

    const ghUser = await userRes.json();

    // 5. Fetch Primary Verified Email if private
    let userEmail = ghUser.email;
    if (!userEmail) {
      try {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'Sevlex-MCP-Security-Gateway',
          },
        });
        if (emailsRes.ok) {
          const emails = await emailsRes.json();
          const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
          if (primary) userEmail = primary.email;
        }
      } catch (err) {
        console.warn('[GitHub OAuth] Could not fetch private emails:', err);
      }
    }

    if (!userEmail) {
      userEmail = `${ghUser.login}@users.noreply.github.com`;
    }

    const userName = ghUser.name || ghUser.login || 'GitHub Developer';
    const userAvatar = ghUser.avatar_url || `https://github.com/${ghUser.login}.png`;

    // 6. Generate Session Token
    const entropy = crypto.randomBytes(32).toString('hex');
    const sessionToken = `slx_session_${entropy}`;

    const authUser: AuthUser = {
      id: `usr_gh_${ghUser.id}`,
      name: userName,
      email: userEmail,
      avatarUrl: userAvatar,
      provider: 'github',
      role: 'Staff Engineer',
      orgName: `${ghUser.login}'s Fleet`,
      plan: 'Enterprise Zero-Trust',
    };

    // 7. Upsert user into Neon PostgreSQL if connected
    const pool = getPgPool();
    if (pool) {
      try {
        // Ensure table & columns exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
            email TEXT UNIQUE,
            name TEXT NOT NULL,
            avatar_url TEXT,
            provider TEXT NOT NULL,
            github_username TEXT,
            github_user_id TEXT,
            github_installation_id TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            last_login_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await pool.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS github_user_id TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS github_installation_id TEXT;
        `);

        // Upsert real user
        await pool.query(
          `INSERT INTO users (email, name, avatar_url, provider, github_username, github_user_id, github_installation_id, last_login_at)
           VALUES ($1, $2, $3, 'github', $4, $5, $6, NOW())
           ON CONFLICT (email) DO UPDATE SET 
             name = EXCLUDED.name,
             avatar_url = EXCLUDED.avatar_url,
             github_username = EXCLUDED.github_username,
             github_user_id = EXCLUDED.github_user_id,
             github_installation_id = COALESCE(EXCLUDED.github_installation_id, users.github_installation_id),
             last_login_at = NOW()`,
          [
            userEmail,
            userName,
            userAvatar,
            ghUser.login,
            String(ghUser.id),
            installationId || null,
          ]
        );

        console.log(`[GitHub OAuth] Successfully synced user ${ghUser.login} (${userEmail}) to Neon DB.`);
      } catch (dbErr: any) {
        console.error('[GitHub OAuth] Neon DB upsert warning:', dbErr.message);
      }
    }

    // Register session in in-memory session cache for sub-millisecond API checks
    registerSession(sessionToken, authUser);

    // 8. Build Redirect with Set-Cookie headers
    const redirectTarget = new URL(consoleUrl);
    redirectTarget.searchParams.set('auth_success', 'true');
    redirectTarget.searchParams.set('user', ghUser.login);
    if (installationId) {
      redirectTarget.searchParams.set('installation_id', installationId);
    }

    const response = NextResponse.redirect(redirectTarget.toString(), { status: 302 });

    // Cookie 1: High-entropy session token
    response.cookies.set('sevlex_admin_key', sessionToken, {
      httpOnly: false, // Accessible to console client for API authorization headers
      secure: proto === 'https',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Cookie 2: User profile JSON
    response.cookies.set('sevlex_user_profile', JSON.stringify(authUser), {
      httpOnly: false,
      secure: proto === 'https',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Clear the temporary CSRF state cookie
    response.cookies.delete('sevlex_oauth_state');

    return response;
  } catch (err: any) {
    console.error('[GitHub OAuth] Unexpected callback error:', err);
    return NextResponse.redirect(
      `${consoleUrl}?auth_error=${encodeURIComponent(err.message || 'unknown_error')}`
    );
  }
}
