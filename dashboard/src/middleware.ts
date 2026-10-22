import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Don't rewrite API routes, static files, or internal Next.js requests
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If traffic arrives on app.sevlex.com or app.localhost, rewrite root to /console
  if (host.startsWith('app.') || host.includes('app.sevlex.com')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/console', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
