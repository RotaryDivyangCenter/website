import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

const INBOUND_FORWARD_TO_EMAIL = 'rcnewkalyan@gmail.com';
const RESEND_FROM_EMAIL = 'noreply@rotarydivyangcenter.org';

function getRequiredHeader(req: NextRequest, name: string): string | null {
    const value = req.headers.get(name);
    if (!value || !value.trim()) {
        return null;
    }

    return value;
}

type ReceivedEventData = {
    email_id?: string;
};

type ReceivedEvent = {
    type?: string;
    data?: ReceivedEventData;
};

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return NextResponse.json({ error: 'Missing RESEND_WEBHOOK_SECRET.' }, { status: 500 });
    }

    const svixId = getRequiredHeader(req, 'svix-id');
    const svixTimestamp = getRequiredHeader(req, 'svix-timestamp');
    const svixSignature = getRequiredHeader(req, 'svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: 'Missing webhook signature headers.' }, { status: 400 });
    }

    const payload = await req.text();
    const resend = getResendClient();

    let event: ReceivedEvent;

    try {
        event = (await resend.webhooks.verify({
            payload,
            headers: {
                id: svixId,
                timestamp: svixTimestamp,
                signature: svixSignature,
            },
            webhookSecret,
        })) as ReceivedEvent;
    } catch {
        return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
    }

    if (event.type !== 'email.received') {
        return NextResponse.json({ ok: true, ignored: true });
    }

    const data = event.data ?? {};
    const emailId = data.email_id;

    if (!emailId) {
        return NextResponse.json({ error: 'Missing email_id in inbound event.' }, { status: 400 });
    }

    try {
        await resend.emails.receiving.forward({
            emailId,
            to: INBOUND_FORWARD_TO_EMAIL,
            from: RESEND_FROM_EMAIL,
            passthrough: true,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to forward inbound email as passthrough.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
