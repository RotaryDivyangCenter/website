'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type GalleryPhoto = {
    id: string;
    src: string;
    alt: string;
    caption: string;
    tag: string;
    h: string;
};

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const tabs = ['all', 'camps'];
const PREVIEW_IMAGE_COUNT = 20;

type GalleryGridItem =
    | { kind: 'photo'; photo: GalleryPhoto; index: number }
    | { kind: 'show-more'; id: string };

function isSupportedImageSrc(src: string): boolean {
    const value = src.trim();
    if (!value) return false;
    if (value.startsWith('/api/gallery/image?id=')) return true;
    if (/^https?:\/\//i.test(value)) return true;
    // Drive file ID fallback support
    if (/^[a-zA-Z0-9_-]{10,}$/.test(value)) return true;
    return false;
}

function toCampGallerySrc(rawSrc: string): string {
    const value = rawSrc.trim();
    if (value.startsWith('/api/gallery/image?id=')) return value;
    if (/^[a-zA-Z0-9_-]{10,}$/.test(value)) return `/api/gallery/image?id=${value}`;
    return value;
}

function extractDriveId(src: string): string | null {
    const directMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (directMatch?.[1]) {
        return directMatch[1];
    }

    try {
        const url = new URL(src);
        return url.searchParams.get('id');
    } catch {
        return null;
    }
}

function toLightboxSrc(src: string): string {
    const driveId = extractDriveId(src);
    if (!driveId) {
        return src;
    }
    // Route through our server-side proxy. The browser fetches from our
    // own server (no auth issues), our server fetches from lh3 (proven
    // to work). This also avoids the Next.js optimizer timeout on large images.
    return `/api/gallery/image?id=${driveId}`;
}

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
    const [activeTab, setActiveTab] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [columnCount, setColumnCount] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const campPhotos = useMemo(() => {
        return photos
            // Camp-tab photos are injected server-side from camps sheet rows.
            .filter((photo) => photo.id.startsWith('camp-') && isSupportedImageSrc(photo.src))
            .map((photo) => ({
                ...photo,
                src: toCampGallerySrc(photo.src),
            }));
    }, [photos]);

    const filtered = useMemo(() => {
        if (activeTab === 'camps') {
            return campPhotos ?? [];
        }

        if (campPhotos.length === 0) {
            return photos;
        }

        const existing = new Set(photos.map((photo) => photo.src));
        const mergedCampPhotos = campPhotos.filter((photo) => !existing.has(photo.src));
        return [...photos, ...mergedCampPhotos];
    }, [activeTab, campPhotos, photos]);

    const visiblePhotos = useMemo(() => {
        if (isExpanded) {
            return filtered;
        }
        return filtered.slice(0, PREVIEW_IMAGE_COUNT);
    }, [filtered, isExpanded]);

    const shouldShowMoreCard = !isExpanded && filtered.length > PREVIEW_IMAGE_COUNT;
    const showMorePreviewPhotos = useMemo(() => {
        const hidden = filtered.slice(PREVIEW_IMAGE_COUNT, PREVIEW_IMAGE_COUNT + 4);
        if (hidden.length > 0) {
            return hidden;
        }
        return filtered.slice(0, 4);
    }, [filtered]);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth >= 1024) {
                setColumnCount(3);
                return;
            }
            if (window.innerWidth >= 640) {
                setColumnCount(2);
                return;
            }
            setColumnCount(1);
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const masonryColumns = useMemo(() => {
        const buckets = Array.from({ length: columnCount }, () => [] as GalleryGridItem[]);
        const items: GalleryGridItem[] = visiblePhotos.map((photo, index) => ({
            kind: 'photo',
            photo,
            index,
        }));

        if (shouldShowMoreCard) {
            items.push({ kind: 'show-more', id: 'show-more-card' });
        }

        items.forEach((item, index) => {
            buckets[index % columnCount].push(item);
        });

        return buckets;
    }, [visiblePhotos, shouldShowMoreCard, columnCount]);

    return (
        <div>
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>MOMENTS</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Gallery</h1>
                    <p className="mt-3 text-[16px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Stories told through pictures - camps, smiles, and transformed lives.
                    </p>
                </FadeUp>
            </section>

            <section className="py-8" style={{ background: '#fff', borderBottom: '1px solid #E2DDD6' }}>
                <div className="max-w-300 mx-auto px-6 flex gap-3 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setIsExpanded(false);
                                setLightboxIndex(-1);
                            }}
                            className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200"
                            style={{
                                background: activeTab === tab ? '#1B3A8C' : '#EBF4FF',
                                color: activeTab === tab ? '#fff' : '#1B3A8C',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </section>

            <section className="py-16" style={{ background: '#F7F4EF' }}>
                <div className="max-w-300 mx-auto px-6">
                    {activeTab === 'camps' && campPhotos.length === 0 && (
                        <p className="mb-4 text-sm" style={{ color: '#5C6475' }}>
                            No camp image links found yet in camps data.
                        </p>
                    )}
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {masonryColumns.map((column, columnIndex) => (
                                <div key={`column-${columnIndex}`} className="space-y-4">
                                    {column.map((item) => (
                                        item.kind === 'photo' ? (
                                            <motion.div
                                                key={item.photo.id}
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.96 }}
                                                transition={{ duration: 0.1, delay: item.index * 0.03 }}
                                                className={`relative break-inside-avoid overflow-hidden cursor-pointer group ${item.photo.h}`}
                                                onClick={() => {
                                                    const index = visiblePhotos.findIndex(p => p.id === item.photo.id);

                                                    const fullSrc = toLightboxSrc(visiblePhotos[index].src);

                                                    const img = new window.Image();
                                                    img.src = fullSrc;

                                                    setLightboxIndex(index);
                                                }}
                                            >
                                                <Image
                                                    src={item.photo.src}
                                                    alt={item.photo.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    loading={item.index < columnCount ? 'eager' : 'lazy'}
                                                />
                                                <div
                                                    className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{ background: 'rgba(27,58,140,0.26)' }}
                                                >
                                                    <p className="text-white text-sm font-medium">{item.photo.caption}</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key={item.id}
                                                type="button"
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.96 }}
                                                transition={{ duration: 0.3 }}
                                                onClick={() => setIsExpanded(true)}
                                                className="relative h-55 w-full overflow-hidden cursor-pointer group"
                                            >
                                                <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                                                    {showMorePreviewPhotos.map((previewPhoto) => (
                                                        <div key={`show-more-preview-${previewPhoto.id}`} className="relative overflow-hidden">
                                                            <Image
                                                                src={previewPhoto.src}
                                                                alt={previewPhoto.alt}
                                                                fill
                                                                className="object-cover blur-[1.5px] transition-transform duration-500 group-hover:scale-[1.03]"
                                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div
                                                    className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center backdrop-blur-[1px] transition-colors duration-300"
                                                    style={{ background: 'linear-gradient(180deg, rgba(8,20,48,0.48) 0%, rgba(8,20,48,0.62) 100%)' }}
                                                >
                                                    <span
                                                        className="block text-2xl font-bold text-white transition-transform duration-500 group-hover:scale-[1.06]"
                                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.55)' }}
                                                    >
                                                        Show More
                                                    </span>
                                                    <span
                                                        className="mt-2 block rounded-full bg-black/20 px-3 py-1 text-base text-white transition-transform duration-500 group-hover:scale-[1.04]"
                                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                                                    >
                                                        View all remaining photos
                                                    </span>
                                                </div>
                                            </motion.button>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </section>

            <Lightbox
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={visiblePhotos.map((p) => ({
                    src: toLightboxSrc(p.src),
                    alt: p.alt,
                }))}
                render={{
                    slide: ({ slide }) => (
                        <div className="flex h-full w-full items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- intentional: bypasses Next.js optimizer to avoid TimeoutError on large Drive images */}
                            <img
                                src={String(slide.src)}
                                alt={String(slide.alt ?? '')}
                                className="max-h-[90vh] max-w-[94vw] object-contain"
                            />
                        </div>
                    ),
                }}
            />
        </div>
    );
}
