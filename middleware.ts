import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La page de login et les routes NextAuth sont toujours accessibles
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  // Routes API admin → 401 JSON si non authentifié
  if (pathname.startsWith('/api/admin/')) {
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Pages admin → redirection vers /admin/login
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
