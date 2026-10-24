import { NextResponse } from 'next/server';
import { authenticateWithProvider, checkAuth, getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider = 'github', email, key, name, avatarUrl } = body;

    const result = await authenticateWithProvider(provider, {
      email,
      key,
      name,
      avatarUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Authentication failed' }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const isValid = checkAuth(request);
  if (!isValid) {
    return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
  }

  const authHeader = request.headers.get('Authorization') || request.headers.get('x-sevlex-api-key') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const sessionUser = getSession(token);

  return NextResponse.json({ 
    authenticated: true,
    user: sessionUser || undefined
  });
}
