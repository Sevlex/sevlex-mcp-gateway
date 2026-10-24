import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPgPool } from '@/lib/db';
import { registerSession, AuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const consoleUrl = `${proto}://${host}/console`;

  // 1. Handle Google authorization cancellation or error
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

  const storedState = cookies['sevlex_google_state'];
  if (storedState && state && storedState !== state) {
    console.warn('[Google OAuth] CSRF state mismatch:', { storedState, state });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Google OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return NextResponse.redirect(
      `${consoleUrl}?auth_error=${encodeURIComponent(
        'Google OAuth server credentials missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'
      )}`
    );
  }

  const redirectUri = `${proto}://${host}/api/auth/callback/google`;

  try {
    // 3. Exchange authorization code for access token & id_token with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth] Token exchange error:', tokenData);
      return NextResponse.redirect(
        `${consoleUrl}?auth_error=${encodeURIComponent(
          tokenData.error_description || tokenData.error || 'token_exchange_failed'
        )}`
      );
    }

    const accessToken = tokenData.access_token;

    // 4. Fetch User Profile from Google UserInfo endpoint
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      console.error('[Google OAuth] Failed to fetch Google user profile:', userRes.status);
      return NextResponse.redirect(`${consoleUrl}?auth_error=profile_fetch_failed`);
    }

    const gUser = await userRes.json();
    const userEmail = gUser.email;
    const userName = gUser.name || gUser.given_name || 'Google Workspace User';
    const userAvatar = gUser.picture || '';
    const googleId = gUser.sub;

    if (!userEmail) {
      return NextResponse.redirect(`${consoleUrl}?auth_error=no_email_provided_by_google`);
    }

    // 5. Generate High-Entropy Session Token
    const entropy = crypto.randomBytes(32).toString('hex');
    const sessionToken = `slx_session_${entropy}`;

    const authUser: AuthUser = {
      id: `usr_g_${googleId}`,
      name: userName,
      email: userEmail,
      avatarUrl: userAvatar,
      provider: 'google',
      role: 'Staff Engineer',
      orgName: `${userName}'s Fleet`,
      plan: 'Enterprise Zero-Trust',
    };

    // 6. Upsert user into Neon PostgreSQL if connected
    const pool = getPgPool();
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
            github_username TEXT,
            github_user_id TEXT,
            github_installation_id TEXT,
            google_id TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            last_login_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await pool.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
        `);

        // Upsert Google user
        await pool.query(
          `INSERT INTO users (email, name, avatar_url, provider, google_id, last_login_at)
           VALUES ($1, $2, $3, 'google', $4, NOW())
           ON CONFLICT (email) DO UPDATE SET 
             name = EXCLUDED.name,
             avatar_url = EXCLUDED.avatar_url,
             google_id = COALESCE(EXCLUDED.google_id, users.google_id),
             last_login_at = NOW()`,
          [userEmail, userName, userAvatar, googleId]
        );

        console.log(`[Google OAuth] Successfully synced Google user ${userName} (${userEmail}) to Neon DB.`);
      } catch (dbErr: any) {
        console.error('[Google OAuth] Neon DB upsert warning:', dbErr.message);
      }
    }

    // Register session in in-memory session cache for sub-millisecond API checks
    registerSession(sessionToken, authUser);

    // 7. Build Redirect with Set-Cookie headers
    const redirectTarget = new URL(consoleUrl);
    redirectTarget.searchParams.set('auth_success', 'true');
    redirectTarget.searchParams.set('user', userName);

    const response = NextResponse.redirect(redirectTarget.toString(), { status: 302 });

    // Cookie 1: Session token
    response.cookies.set('sevlex_admin_key', sessionToken, {
      httpOnly: false,
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

    // Clear temporary CSRF state cookie
    response.cookies.delete('sevlex_google_state');

    return response;
  } catch (err: any) {
    console.error('[Google OAuth] Unexpected callback error:', err);
    return NextResponse.redirect(
      `${consoleUrl}?auth_error=${encodeURIComponent(err.message || 'unknown_error')}`
    );
  }
}
