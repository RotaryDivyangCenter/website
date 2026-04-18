import { NextRequest, NextResponse } from 'next/server';
import { getOutboundAdminToken, setAdminSessionCookie } from '@/lib/adminAuth';

type LoginPayload = {
    password?: string;
};

export async function POST(req: NextRequest) {
    const configuredToken = getOutboundAdminToken();

    if (!configuredToken) {
        return NextResponse.json({ error: 'Admin token is not configured on server.' }, { status: 500 });
    }

    let payload: LoginPayload;

    try {
        payload = (await req.json()) as LoginPayload;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const password = payload.password?.trim() || '';

    if (!password) {
        return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    if (password !== configuredToken) {
        return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    setAdminSessionCookie(response, configuredToken);
    return response;
}
