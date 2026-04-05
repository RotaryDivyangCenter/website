import { NextResponse } from 'next/server';
import { getCamps } from '@/utils/getCamps';
import { getApiCacheHeaders } from '@/config/cache';

export async function GET() {
    const camps = await getCamps();
    return NextResponse.json(camps, {
        headers: {
            ...getApiCacheHeaders(),
        },
    });
}
