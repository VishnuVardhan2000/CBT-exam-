import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public static assets and public legal pages
  if (
    path.startsWith('/_next') ||
    path === '/login' ||
    path === '/register' ||
    path === '/privacy' ||
    path === '/terms' ||
    path === '/cookies' ||
    path === '/'
  ) {
    return NextResponse.next();
  }

  const authUserCookie = request.cookies.get('sbi_cbt_user');

  // Enforce server-side protection on admin page routes
  if (path.startsWith('/admin')) {
    if (!authUserCookie) {
      // Unauthenticated -> redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const user = JSON.parse(decodeURIComponent(authUserCookie.value));
      if (user.role !== 'admin') {
        // Authenticated but not an admin -> redirect to candidate dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      // Malformed cookie -> redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Enforce server-side protection on admin API routes
  if (path.startsWith('/api/sources')) {
    if (!authUserCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const user = JSON.parse(decodeURIComponent(authUserCookie.value));
      if (user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
