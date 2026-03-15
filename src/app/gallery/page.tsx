'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const allPhotos = [
    { src: '/1.jpg', alt: 'Rotary Divyang Center Exterior', caption: 'Rotary Divyang Center, Kalyan', tag: 'center', h: 'h-[290px]' },
    { src: '/2.jpg', alt: 'Inside the Center', caption: 'Inside the Prosthetics Unit', tag: 'center', h: 'h-[220px]' },
    { src: '/3.jpg', alt: 'Center Building', caption: 'Center building and facilities', tag: 'center', h: 'h-[260px]' },
    { src: '/4.jpg', alt: 'Gallery Photo 4', caption: 'Prosthetic fitting session', tag: 'camps', h: 'h-[330px]' },
    { src: '/1.jpg', alt: 'Camp Photo 1', caption: 'Camp at Kalyan - March 2015', tag: 'camps', h: 'h-[240px]' },
    { src: '/2.jpg', alt: 'Camp Photo 2', caption: 'LN4 Limb fitment camp', tag: 'camps', h: 'h-[300px]' },
    { src: '/3.jpg', alt: 'Event Photo 1', caption: 'Award ceremony 2024', tag: 'events', h: 'h-[250px]' },
    { src: '/4.jpg', alt: 'Event Photo 2', caption: '10 Years Celebration', tag: 'events', h: 'h-[310px]' },
];

const tabs = ['all', 'center', 'camps', 'events'];

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const filtered = activeTab === 'all' ? allPhotos : allPhotos.filter((p) => p.tag === activeTab);

    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>MOMENTS</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Gallery</h1>
                    <p className="mt-3 text-[16px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Stories told through pictures — camps, smiles, and transformed lives.
                    </p>
                </FadeUp>
            </section>

            {/* Filter Tabs */}
            <section className="py-8" style={{ background: '#fff', borderBottom: '1px solid #E2DDD6' }}>
                <div className="max-w-[1200px] mx-auto px-6 flex gap-3 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
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

            {/* Masonry Grid */}
            <section className="py-16" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <AnimatePresence mode="popLayout">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
                            {filtered.map((photo, i) => (
                                <motion.div
                                    key={photo.src + photo.caption + i}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className={`relative mb-4 break-inside-avoid overflow-hidden cursor-pointer group ${photo.h}`}
                                    onClick={() => setLightboxIndex(i)}
                                >
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        loading="lazy"
                                    />
                                    {/* Hover overlay */}
                                    <div
                                        className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: 'rgba(27,58,140,0.26)' }}
                                    >
                                        <p className="text-white text-sm font-medium">{photo.caption}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Lightbox */}
            <Lightbox
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={filtered.map((p) => ({ src: p.src, alt: p.alt }))}
            />
        </div>
    );
}
