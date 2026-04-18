import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';
import { isAdminSessionValid } from '@/lib/adminAuth';
import { listAdminEmailHistory } from '@/lib/adminEmailHistory';

/**
 * Resend emails.list() has a hard cap of 100. Requesting more returns 100 anyway.
 * We clamp to 100 to avoid confusion and make pagination explicit.
 */
const RESEND_MAX_LIMIT = 100;

function parseLimit(value: string | null): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 100;
    }

    return Math.min(200, Math.floor(parsed));
}

function mergeById(
    primary: Array<{
        id: string;
        sentAt: string;
        from: string;
        to: string[];
        subject: string;
        replyTo: string[];
        status: string;
    }>,
    fallback: Array<{
        id: string;
        sentAt: string;
        from: string;
        to: string[];
        subject: string;
        replyTo: string[];
        status: string;
    }>,
    limit: number,
) {
    const merged = [...primary];
    const seen = new Set(primary.map((item) => item.id));

    for (const item of fallback) {
        if (!seen.has(item.id)) {
            merged.push(item);
            seen.add(item.id);
        }
    }

    merged.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    return merged.slice(0, limit);
}

export async function GET(req: NextRequest) {
    if (!isAdminSessionValid(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = parseLimit(req.nextUrl.searchParams.get('limit'));
    const fallbackItems = listAdminEmailHistory(limit);

    try {
        const resend = getResendClient();
        // Resend caps at 100; clamp our limit accordingly.
        const resendLimit = Math.min(limit, RESEND_MAX_LIMIT);
        const response = await resend.emails.list({ limit: resendLimit });

        if (response.error) {
            return NextResponse.json({
                items: fallbackItems,
                hasMore: false,
                source: 'fallback',
                warning: `Resend API error: ${response.error.message || 'Unknown error'}. Showing server-side fallback history.`,
            });
        }

        const resendItems = (response.data?.data || []).map((email) => ({
            id: email.id,
            sentAt: email.created_at,
            from: email.from,
            // Resend returns to as string[] but SDK type may be string; normalise both.
            to: Array.isArray(email.to) ? email.to : [email.to],
            subject: email.subject ?? '',
            replyTo: Array.isArray(email.reply_to) ? email.reply_to : (email.reply_to ? [email.reply_to] : []),
            // last_event is null for freshly queued emails; default to 'sent'.
            status: email.last_event ?? 'sent',
        }));

        const items = mergeById(resendItems, fallbackItems, limit);

        return NextResponse.json({
            items,
            hasMore: Boolean(response.data?.has_more),
            source: 'resend',
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to fetch email history.';
        return NextResponse.json({
            items: fallbackItems,
            hasMore: false,
            source: 'fallback',
            warning: `${message} Showing server-side fallback history.`,
        });
    }
}
