import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const protectedPaths = [
    '/courses/new',
    '/courses/forgot-password',
    '/profile',
    '/admin/users'
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  // Additional protection: /courses/:slug/dashboard
  const isCourseDashboard = /^\/courses\/[^/]+\/dashboard(\/.*)?$/.test(
    request.nextUrl.pathname
  );

  if ((isProtectedPath || isCourseDashboard) && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/courses/new',
    '/courses/forgot-password',
    '/profile',
    '/admin/users',
    '/admin/users/:path*',
    '/courses/:slug/dashboard',
    '/courses/:slug/dashboard/:path*'
  ]
};
