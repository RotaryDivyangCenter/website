import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_EMAIL_COOKIE = 'rdc_admin_email_session';

export function getOutboundAdminToken(): string {
    return process.env.OUTBOUND_ADMIN_TOKEN || '';
}

export function isAdminSessionValid(req: NextRequest): boolean {
    const token = getOutboundAdminToken();
    if (!token) {
        return false;
    }

    const cookieValue = req.cookies.get(ADMIN_EMAIL_COOKIE)?.value;
    return cookieValue === token;
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set({
        name: ADMIN_EMAIL_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 30,
    });
}

export function clearAdminSessionCookie(response: NextResponse): void {
    response.cookies.set({
        name: ADMIN_EMAIL_COOKIE,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}
