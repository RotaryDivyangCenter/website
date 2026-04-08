import { NextResponse } from 'next/server';
import { getStats } from '@/utils/getStats';
import { getApiCacheHeaders, withDevTimingHeaders } from '@/config/cache';

export async function GET() {
    const startedAtMs = Date.now();
    const stats = await getStats();
    return NextResponse.json(stats, {
        headers: withDevTimingHeaders(getApiCacheHeaders(), startedAtMs),
    });
}
