import { Resend } from 'resend';

export function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('Missing RESEND_API_KEY in environment variables.');
    }

    return new Resend(apiKey);
}
