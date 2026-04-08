import { NextResponse } from 'next/server';
import { getCamps } from '@/utils/getCamps';
import { CACHE_CONFIG, getApiCacheHeaders, withDevTimingHeaders } from '@/config/cache';

let campsCache:
    | {
          expiresAt: number;
          camps: Awaited<ReturnType<typeof getCamps>>;
      }
    | null = null;

function withDevCacheHit(headers: Record<string, string>, value: 'HIT' | 'MISS'): Record<string, string> {
    if (!CACHE_CONFIG.isDev) {
        return headers;
    }

    return {
        ...headers,
        'X-Cache-Hit': value,
    };
}

export async function GET() {
    const startedAtMs = Date.now();
    const now = Date.now();

    if (campsCache && campsCache.expiresAt > now) {
        return NextResponse.json(campsCache.camps, {
            headers: withDevTimingHeaders(withDevCacheHit(getApiCacheHeaders(), 'HIT'), startedAtMs),
        });
    }

    const camps = await getCamps();

    const memoryCacheSeconds = CACHE_CONFIG.isDev ? 30 : Math.max(1, CACHE_CONFIG.serverlessSeconds);
    campsCache = {
        expiresAt: now + memoryCacheSeconds * 1000,
        camps,
    };

    return NextResponse.json(camps, {
        headers: withDevTimingHeaders(withDevCacheHit(getApiCacheHeaders(), 'MISS'), startedAtMs),
    });
}
