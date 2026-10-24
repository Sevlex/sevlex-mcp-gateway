import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  // Determine origin (localhost or production domain)
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const consoleUrl = `${proto}://${host}/console`;
  const redirectUri = `${proto}://${host}/api/auth/callback/google`;

  if (!clientId) {
    console.warn('[Google OAuth] GOOGLE_CLIENT_ID is not configured in server environment');
    const msg = encodeURIComponent(
      'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.'
    );
    return NextResponse.redirect(`${consoleUrl}?auth_error=${msg}`);
  }

  // Cryptographically random CSRF state
  const state = crypto.randomBytes(24).toString('hex');

  // Google OAuth 2.0 authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(authUrl.toString(), { status: 302 });

  // Store CSRF state in secure cookie (expires in 10 minutes)
  response.cookies.set('sevlex_google_state', state, {
    httpOnly: true,
    secure: proto === 'https',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  return response;
}
