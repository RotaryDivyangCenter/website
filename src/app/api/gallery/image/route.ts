import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side image proxy for Google Drive images.
 *
 * Fetches from lh3.googleusercontent.com server-side (same access path that
 * Next.js Image uses for thumbnails) and streams bytes to the browser.
 * Avoids both client-side auth redirects AND Next.js optimizer timeouts.
 *
 * Usage: GET /api/gallery/image?id={driveFileId}
 */
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    const requestedWidth = Number(searchParams.get('w'));

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        return new NextResponse('Missing or invalid id', { status: 400 });
    }

    const width = Number.isFinite(requestedWidth)
        ? Math.min(1800, Math.max(320, Math.round(requestedWidth)))
        : 1200;

    const upstreamCandidates = [
        `https://lh3.googleusercontent.com/d/${id}=w${width}`,
        `https://lh3.googleusercontent.com/d/${id}`,
        `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`,
        `https://drive.google.com/uc?export=view&id=${id}`,
    ];

    try {
        for (const upstream of upstreamCandidates) {
            const res = await fetch(upstream, {
                headers: {
                    Accept: 'image/*,*/*;q=0.8',
                },
                redirect: 'follow',
            });

            if (!res.ok) {
                continue;
            }

            const contentType = res.headers.get('content-type') ?? '';
            if (!contentType.startsWith('image/')) {
                continue;
            }

            const buffer = await res.arrayBuffer();

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    // Keep client cache reasonably long for mobile repeat visits.
                    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
                },
            });
        }

        return new NextResponse('Unable to fetch image from upstream providers', { status: 502 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[gallery/image] Proxy fetch failed:', message);
        return new NextResponse(`Proxy fetch failed: ${message}`, { status: 502 });
    }
}

