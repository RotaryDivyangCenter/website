import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';

type ContactPayload = {
    name?: string;
    email?: string;
    message?: string;
};

const CONTACT_RECEIVER_EMAIL = 'contact@rotarydivyangcenter.org';
const RESEND_FROM_EMAIL = 'noreply@rotarydivyangcenter.org';

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
    let payload: ContactPayload;

    try {
        payload = (await req.json()) as ContactPayload;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    const name = payload.name?.trim() ?? '';
    const email = payload.email?.trim() ?? '';
    const message = payload.message?.trim() ?? '';

    if (!name || !email || !message) {
        return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    try {
        const resend = getResendClient();

        const result = await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: [CONTACT_RECEIVER_EMAIL],
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
        });

        return NextResponse.json({
            success: true,
            id: result.data?.id,
        });
    } catch (error) {
        const messageText = error instanceof Error ? error.message : 'Unable to send message right now.';
        return NextResponse.json({ error: messageText }, { status: 500 });
    }
}
