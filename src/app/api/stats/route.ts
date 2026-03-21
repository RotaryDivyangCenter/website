import { NextResponse } from 'next/server';
import { getStats } from '@/utils/getStats';
import { getApiCacheHeaders } from '@/config/cache';

export async function GET() {
    const stats = await getStats();
    return NextResponse.json(stats, {
        headers: {
            ...getApiCacheHeaders(),
        },
    });
}
