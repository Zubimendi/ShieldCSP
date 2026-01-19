import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if user is authenticated (temporary hardcoded check)
  const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup');

  // If not authenticated and trying to access protected routes
  if (!isAuthenticated && !isAuthPage) {
    const protectedPaths = ['/dashboard', '/domains', '/scanner', '/violations', '/codegen', '/xss-lab'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/domains/:path*',
    '/scanner/:path*',
    '/violations/:path*',
    '/codegen/:path*',
    '/xss-lab/:path*',
  ],
};
