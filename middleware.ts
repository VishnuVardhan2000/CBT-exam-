import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public static assets and legal pages
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
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
  
  // If no auth cookie present, fallback to client-side auth state in mock mode or redirect
  // For admin routes, enforce admin role validation if cookie is present
  if (path.startsWith('/admin')) {
    if (authUserCookie) {
      try {
        const user = JSON.parse(authUserCookie.value);
        if (user.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (e) {
        // Invalid cookie syntax
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
