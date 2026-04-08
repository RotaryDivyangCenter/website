import { camps as FALLBACK_CAMPS } from '@/data/camps';
import { getServerFetchOptions } from '@/config/cache';

export type CampRow = {
    id: number;
    location: string;
    partners: string;
    date: string;
    limbsProvided: number;
    beneficiaries: number;
    image: string;
    // kept for fallback compatibility
    name: string;
    sponsors: string[];
};

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || '';
const CAMPS_SHEET_URL = GOOGLE_SHEET_URL ? `${GOOGLE_SHEET_URL}&sheet=camps&headers=1` : '';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

// Column order in the camps sheet:
// A=Location, B=Partners, C=Date, D=LimbsProvided, E=Beneficiaries,
// F=ImageURL (plain URL or Drive ID for website rendering)
type GvizCell = { v?: string | number | null; f?: string | null };

type GvizResponse = {
    table?: {
        rows?: Array<{ c?: GvizCell[] }>;
    };
};

type DriveFile = {
    id: string;
    name: string;
    mimeType: string;
};

let driveNameToIdCache:
    | {
          expiresAt: number;
          map: Map<string, string>;
      }
    | null = null;

function extractDriveFolderId(input?: string): string | null {
    if (!input) return null;

    const trimmed = input.trim();
    if (!trimmed) return null;

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

async function getDriveImageNameToIdMap(): Promise<Map<string, string>> {
    const now = Date.now();
    if (driveNameToIdCache && driveNameToIdCache.expiresAt > now) {
        return driveNameToIdCache.map;
    }

    const folderId = extractDriveFolderId(process.env.GDRIVE_FOLDER_ID);
    const apiKey = process.env.GDRIVE_API_KEY;

    const hasValidApiKey =
        typeof apiKey === 'string' &&
        apiKey.length > 20 &&
        !apiKey.includes('PASTE_');

    if (!folderId || !hasValidApiKey) {
        return new Map<string, string>();
    }

    const files: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            key: apiKey,
            q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
            fields: 'nextPageToken,files(id,name,mimeType)',
            pageSize: '1000',
            supportsAllDrives: 'true',
            includeItemsFromAllDrives: 'true',
        });

        if (pageToken) {
            params.set('pageToken', pageToken);
        }

        const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, getServerFetchOptions());
        if (!response.ok) break;

        const data = (await response.json()) as {
            files?: DriveFile[];
            nextPageToken?: string;
        };

        if (data.files?.length) {
            files.push(...data.files);
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    const map = new Map<string, string>();
    for (const file of files) {
        if (!file.mimeType?.startsWith('image/')) continue;
        if (!file.name) continue;
        map.set(file.name.trim().toLowerCase(), file.id);
    }

    // Keep cache short to reflect Drive updates reasonably quickly.
    driveNameToIdCache = {
        expiresAt: now + 5 * 60 * 1000,
        map,
    };

    return map;
}

function extractDriveFileId(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Raw file ID case
    if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
        return trimmed;
    }

    try {
        const url = new URL(trimmed);

        // https://drive.google.com/file/d/<id>/view
        const fileMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch?.[1]) return fileMatch[1];

        // https://lh3.googleusercontent.com/d/<id>=w1000
        const lh3Match = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (lh3Match?.[1]) return lh3Match[1];

        // https://drive.google.com/uc?id=<id>
        const idParam = url.searchParams.get('id');
        if (idParam && /^[a-zA-Z0-9_-]{10,}$/.test(idParam)) return idParam;
    } catch {
        return null;
    }

    return null;
}

function toRenderableImageUrl(input: string): string {
    const normalizedInput = input
        .trim()
        // Users often prefix with apostrophe in Sheets to force text.
        .replace(/^'+/, '')
        // Handle quoted text values like "https://...".
        .replace(/^"(.+)"$/, '$1')
        .trim();

    const driveId = extractDriveFileId(normalizedInput);
    if (driveId) {
        return `/api/gallery/image?id=${driveId}`;
    }
    return normalizedInput;
}

function normalizeImageCell(cell?: GvizCell): string {
    const rawCandidates = [cell?.f, cell?.v]
        .filter((value): value is string | number => value !== null && value !== undefined)
        .map((value) => String(value).trim())
        .filter(Boolean);

    for (const raw of rawCandidates) {
        // Google Sheets formula: IMAGE("https://...")
        const imageFormula = raw.match(/IMAGE\(\s*"([^"]+)"/i);
        if (imageFormula?.[1]) {
            return toRenderableImageUrl(imageFormula[1].trim());
        }

        // Google Sheets formula: HYPERLINK("https://...", ...)
        const hyperlinkFormula = raw.match(/HYPERLINK\(\s*"([^"]+)"/i);
        if (hyperlinkFormula?.[1]) {
            return toRenderableImageUrl(hyperlinkFormula[1].trim());
        }

        // HTML markup case: <img src="...">
        const htmlImage = raw.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (htmlImage?.[1]) {
            return toRenderableImageUrl(htmlImage[1].trim());
        }

        if (/^https?:\/\//i.test(raw)) {
            return toRenderableImageUrl(raw);
        }

        // Sometimes Sheet cell stores only a Drive file ID
        const driveId = extractDriveFileId(raw);
        if (driveId) {
            return `/api/gallery/image?id=${driveId}`;
        }
    }

    return rawCandidates[0] ?? '';
}

function isAbsoluteUrl(input: string): boolean {
    return /^https?:\/\//i.test(input.trim());
}

async function enrichCampImagesWithDriveNames(camps: CampRow[]): Promise<CampRow[]> {
    const needsNameLookup = camps.some((camp) => {
        const value = camp.image?.trim();
        if (!value) return false;
        if (value.startsWith('/api/gallery/image?id=')) return false;
        if (isAbsoluteUrl(value)) return false;
        if (extractDriveFileId(value)) return false;
        return true;
    });

    if (!needsNameLookup) {
        return camps;
    }

    try {
        const nameToId = await getDriveImageNameToIdMap();
        if (nameToId.size === 0) return camps;

        return camps.map((camp) => {
            const value = camp.image?.trim();
            if (!value) return camp;

            if (value.startsWith('/api/gallery/image?id=') || isAbsoluteUrl(value) || extractDriveFileId(value)) {
                return camp;
            }

            const id = nameToId.get(value.toLowerCase());
            if (!id) return camp;

            return {
                ...camp,
                image: `/api/gallery/image?id=${id}`,
            };
        });
    } catch {
        return camps;
    }
}

function extractJson(text: string): string {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || start >= end) return text;
    return text.slice(start, end + 1);
}

function mapRows(parsed: GvizResponse): CampRow[] | null {
    const rows = parsed.table?.rows ?? [];

    if (!rows.length) return null;

    const result: CampRow[] = rows.map((row, i) => {
        const c = (row.c ?? []) as GvizCell[];
        const str = (idx: number) => {
            const cell = c[idx];
            if (!cell) return '';
            // Prefer formatted value (f) for strings, fallback to raw value (v)
            return String(cell.f ?? cell.v ?? '').trim();
        };
        const num = (idx: number) => {
            const n = Number(c[idx]?.v ?? 0);
            return Number.isFinite(n) ? n : 0;
        };

        const location = str(0);
        return {
            id: i + 1,
            location,
            partners: str(1),
            date: str(2),
            limbsProvided: num(3),
            beneficiaries: num(4),
            image: normalizeImageCell(c[5]),
            // compatibility aliases for fallback Camp type
            name: location,
            sponsors: str(1) ? str(1).split(',').map((s) => s.trim()) : [],
        };
    });

    // Filter out rows where location is empty (blank trailing rows)
    return result.filter((r) => r.location.length > 0);
}

export async function getCamps(): Promise<CampRow[]> {
    try {
        const response = await fetch(CAMPS_SHEET_URL, getServerFetchOptions());

        if (!response.ok) return FALLBACK_CAMPS as unknown as CampRow[];

        const rawText = await response.text();
        const jsonText = extractJson(rawText);
        const parsed = JSON.parse(jsonText) as GvizResponse;
        const mapped = mapRows(parsed);

        if (!mapped || mapped.length === 0) return FALLBACK_CAMPS as unknown as CampRow[];

        return await enrichCampImagesWithDriveNames(mapped);
    } catch {
        return FALLBACK_CAMPS as unknown as CampRow[];
    }
}
