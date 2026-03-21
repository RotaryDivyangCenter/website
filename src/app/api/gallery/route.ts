import { NextResponse } from 'next/server';
import { getApiCacheHeaders, getServerFetchOptions } from '@/config/cache';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

function extractDriveFolderId(input?: string): string | null {
    if (!input) return null;

    const trimmed = input.trim();
    if (!trimmed) return null;

    // If already ID
    if (!trimmed.includes('/')) return trimmed;

    try {
        const url = new URL(trimmed);

        const folderMatch = url.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (folderMatch?.[1]) return folderMatch[1];

        const openId = url.searchParams.get('id');
        if (openId) return openId;
    } catch {
        return null;
    }

    return null;
}

type DriveFile = {
    id: string;
    mimeType: string;
};

export async function GET() {
    const folderId = extractDriveFolderId(process.env.GDRIVE_FOLDER_ID);
    const apiKey = process.env.GDRIVE_API_KEY;

    const hasValidApiKey =
        typeof apiKey === 'string' &&
        apiKey.length > 20 &&
        !apiKey.includes('PASTE_');

    const cacheHeaders = getApiCacheHeaders();

    if (!folderId || !hasValidApiKey) {
        return NextResponse.json([], {
            headers: {
                ...cacheHeaders,
                'Content-Type': 'application/json',
                'X-Gallery-Warning': 'Missing Google Drive configuration.',
            },
        });
    }

    try {
        const files: DriveFile[] = [];
        let pageToken: string | undefined;

        do {
            const params = new URLSearchParams({
                key: apiKey!,
                q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
                fields: 'nextPageToken,files(id,mimeType)',
                pageSize: '1000',
                supportsAllDrives: 'true',
                includeItemsFromAllDrives: 'true',
            });

            if (pageToken) {
                params.set('pageToken', pageToken);
            }

            const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, getServerFetchOptions());

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Google Drive API error (${response.status}): ${text}`);
            }

            const data = (await response.json()) as {
                files?: DriveFile[];
                nextPageToken?: string;
            };

            if (data.files?.length) {
                files.push(...data.files);
            }

            pageToken = data.nextPageToken;
        } while (pageToken);

        // Stable sort (prevents random shifts across builds)
        files.sort((a, b) => a.id.localeCompare(b.id));

        const images = files
            .filter((file) => file.mimeType?.startsWith('image/'))
            .map((file) => ({
                id: file.id,
                url: `https://lh3.googleusercontent.com/d/${file.id}=w1000`,
            }));

        return NextResponse.json(images, {
            headers: {
                ...cacheHeaders,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json([], {
            headers: {
                ...cacheHeaders,
                'Content-Type': 'application/json',
                'X-Gallery-Warning': message,
            },
        });
    }
}
