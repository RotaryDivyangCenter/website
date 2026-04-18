import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_EMAIL_COOKIE, getOutboundAdminToken } from './src/lib/adminAuth';

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (!pathname.startsWith('/admin/email')) {
        return NextResponse.next();
    }

    if (pathname === '/admin/email/login') {
        return NextResponse.next();
    }

    const token = getOutboundAdminToken();
    const cookieValue = req.cookies.get(ADMIN_EMAIL_COOKIE)?.value;

    if (!token || cookieValue !== token) {
        const loginUrl = new URL('/admin/email/login', req.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/email/:path*'],
};
