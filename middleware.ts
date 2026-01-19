import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAuthenticated = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup') ||
                     request.nextUrl.pathname.startsWith('/reset');

  // If not authenticated and trying to access protected routes
  if (!isAuthenticated && !isAuthPage) {
    const protectedPaths = ['/dashboard', '/domains', '/scanner', '/violations', '/codegen', '/xss-lab', '/policies'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPage && !request.nextUrl.pathname.startsWith('/reset')) {
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
    '/policies/:path*',
    '/reset/:path*',
  ],
};
