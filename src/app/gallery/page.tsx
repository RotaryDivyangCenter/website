import GalleryClient from './GalleryClient';
import { getServerFetchOptions } from '@/config/cache';
import { getCamps } from '@/utils/getCamps';

export const dynamic = 'force-dynamic';

type ApiPhoto = {
    id: string;
    url: string;
};

type GalleryPhoto = {
    id: string;
    src: string;
    alt: string;
    caption: string;
    tag: string;
    h: string;
};

const SEED = 'rotary-gallery';

const HEIGHTS = ['h-[290px]', 'h-[220px]', 'h-[260px]', 'h-[330px]', 'h-[240px]', 'h-[300px]', 'h-[250px]', 'h-[310px]'];
const TAGS = ['center', 'camps', 'events'];

const fallbackPhotos: GalleryPhoto[] = [
    { id: 'fallback-1', src: '/1.jpg', alt: 'Rotary Divyang Center Exterior', caption: 'Rotary Divyang Center, Kalyan', tag: 'center', h: 'h-[290px]' },
    { id: 'fallback-2', src: '/2.jpg', alt: 'Inside the Center', caption: 'Inside the Prosthetics Unit', tag: 'center', h: 'h-[220px]' },
    { id: 'fallback-3', src: '/3.jpg', alt: 'Center Building', caption: 'Center building and facilities', tag: 'center', h: 'h-[260px]' },
    { id: 'fallback-4', src: '/4.jpg', alt: 'Prosthetic fitting session', caption: 'Prosthetic fitting session', tag: 'camps', h: 'h-[330px]' },
    { id: 'fallback-5', src: '/1.jpg', alt: 'Camp at Kalyan', caption: 'Camp at Kalyan - March 2015', tag: 'camps', h: 'h-[240px]' },
    { id: 'fallback-6', src: '/2.jpg', alt: 'Limb fitment camp', caption: 'LN4 Limb fitment camp', tag: 'camps', h: 'h-[300px]' },
    { id: 'fallback-7', src: '/3.jpg', alt: 'Award ceremony', caption: 'Award ceremony 2024', tag: 'events', h: 'h-[250px]' },
    { id: 'fallback-8', src: '/4.jpg', alt: '10 Years celebration', caption: '10 Years Celebration', tag: 'events', h: 'h-[310px]' },
];

function hashString(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function mulberry32(seed: number) {
    return function random() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function seededShuffle<T>(items: T[], seed: string): T[] {
    const array = [...items];
    const random = mulberry32(hashString(seed));

    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function mapDrivePhotos(apiPhotos: ApiPhoto[]): GalleryPhoto[] {
    return apiPhotos.map((photo, index) => ({
        id: photo.id,
        // Route every gallery image through our proxy for consistent loading.
        src: `/api/gallery/image?id=${photo.id}`,
        alt: `Rotary gallery photo ${index + 1}`,
        caption: 'Rotary Divyang Center moments',
        tag: TAGS[index % TAGS.length],
        h: HEIGHTS[index % HEIGHTS.length],
    }));
}

async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
    try {
        const endpoint = '/api/gallery';
        let response: Response;
        const requestOptions = {
            ...getServerFetchOptions(),
            cache: 'no-store' as const,
        };

        try {
            response = await fetch(endpoint, requestOptions);
        } catch {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
            response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch gallery images: ${response.status}`);
        }

        const data = (await response.json()) as ApiPhoto[];

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No gallery images returned from API');
        }

        return mapDrivePhotos(seededShuffle(data, SEED));
    } catch {
        return seededShuffle(fallbackPhotos, SEED);
    }
}

async function getCampTabPhotos(baseHeights: string[]): Promise<GalleryPhoto[]> {
    try {
        const camps = await getCamps();
        const withImages = camps.filter((camp) => camp.image && camp.image.trim().length > 0);

        const uniqueBySrc = new Set<string>();
        return withImages
            .filter((camp) => {
                const key = camp.image.trim();
                if (uniqueBySrc.has(key)) return false;
                uniqueBySrc.add(key);
                return true;
            })
            .map((camp, index) => ({
                id: `camp-${camp.id}-${index}`,
                src: camp.image,
                alt: `Camp in ${camp.location}`,
                caption: camp.date ? `${camp.location} - ${camp.date}` : camp.location,
                tag: 'camps',
                h: baseHeights[index % baseHeights.length] ?? 'h-[260px]',
            }));
    } catch {
        return [];
    }
}

export default async function GalleryPage() {
    const galleryPhotos = await getGalleryPhotos();
    const campTabPhotos = await getCampTabPhotos(HEIGHTS);

    // Keep all camp-sheet images for the Camps tab; duplicates (if any) reflect sheet rows.
    const merged = [...galleryPhotos, ...campTabPhotos];

    return <GalleryClient photos={merged} />;
}
