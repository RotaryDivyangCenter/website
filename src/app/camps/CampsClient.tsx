'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, HandHeart, Users } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import { FALLBACK_STATS, type Stats } from '@/utils/getStats';
import type { CampRow } from '@/utils/getCamps';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

function StatNum({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    return (
        <div ref={ref} className="text-center">
            <div className="text-5xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {inView ? <CountUp end={value} duration={2} suffix={suffix} /> : `0${suffix}`}
            </div>
            <p className="text-sm mt-2 uppercase tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</p>
        </div>
    );
}

function numericValue(value: string) {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

export default function CampsClient() {
    const [stats, setStats] = useState<Stats>(FALLBACK_STATS);
    const [campList, setCampList] = useState<CampRow[]>([]);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [isCampsLoading, setIsCampsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadStats = async () => {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) return;

                const data = (await response.json()) as Stats;
                if (mounted) {
                    setStats(data);
                }
            } catch {
                // Keep fallback data.
            } finally {
                if (mounted) {
                    setIsStatsLoading(false);
                }
            }
        };

        const loadCamps = async () => {
            try {
                const response = await fetch('/api/camps');
                if (!response.ok) return;

                const data = (await response.json()) as CampRow[];
                if (mounted && Array.isArray(data)) {
                    setCampList(data);
                }
            } catch {
                // Keep empty list when fetch fails.
            } finally {
                if (mounted) {
                    setIsCampsLoading(false);
                }
            }
        };

        void loadStats();
        void loadCamps();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>OUTREACH</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>
                        Our Camps - Reaching the Unreached
                    </h1>
                    <p className="mt-4 text-[16px] max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Since 2019, we&apos;ve conducted prosthetic fitment camps in communities across India.
                    </p>
                </FadeUp>
            </section>

            {/* Stats */}
            <section style={{ background: '#142d70' }} className="py-12">
                <div className="max-w-[900px] mx-auto px-6">
                    {isStatsLoading ? (
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={`stat-skeleton-${index}`} className="flex flex-col items-center gap-3 py-2">
                                    <Skeleton className="h-10 w-20 rounded bg-[#2A4D96]!" />
                                    <Skeleton className="h-3 w-24 rounded bg-[#345CA8]!" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatNum value={numericValue(stats.camps)} suffix="+" label="Camps Conducted" />
                            <StatNum value={numericValue(stats.prosthetic_limbs)} suffix="+" label="Limbs Provided" />
                            <StatNum value={numericValue(stats.years)} suffix="+" label="Years Active" />
                            <StatNum value={numericValue(stats.csr_partners)} suffix="" label="CSR Partners" />
                        </div>
                    )}
                </div>
            </section>

            {/* Camp Cards */}
            <section className="py-24" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="section-label mb-5 justify-center">Camps</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Featured Camps</h2>
                        <p className="mt-4 text-[16px] leading-[1.7]" style={{ color: '#5C6475' }}>
                            A selection from our {stats.camps || 'many'}+ camps conducted across India
                        </p>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isCampsLoading &&
                            [0, 1, 2, 3, 4, 5].map((index) => (
                                <div key={`camp-skeleton-${index}`} className="holo-card p-8 h-full bg-[#fff] border border-[#E2DDD6] flex flex-col">
                                    <Skeleton className="mb-6 h-[220px] w-full rounded-xl" />
                                    <Skeleton className="mb-4 h-6 w-3/4 rounded" />
                                    <div className="mb-6 flex-1 space-y-2">
                                        <Skeleton className="h-4 w-2/3 rounded" />
                                        <Skeleton className="h-4 w-1/2 rounded" />
                                        <Skeleton className="h-4 w-3/5 rounded" />
                                    </div>
                                    <div className="mt-auto border-t border-[#E2DDD6] pt-4">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-16 rounded" />
                                            <Skeleton className="h-6 w-16 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {!isCampsLoading && campList.map((camp, i) => (
                            <FadeUp key={camp.id} delay={(i % 3) * 0.08}>
                                {(() => {
                                    const hasCampImage = Boolean(camp.image && camp.image.trim().length > 0);
                                    return (
                                        <div className="holo-card p-8 h-full bg-[#fff] border border-[#E2DDD6] group flex flex-col">
                                            {/* Thumbnail rendering based on sheet image value */}
                                            <div
                                                className="rounded-xl mb-6 flex items-center justify-center border border-[#E2DDD6] transition-colors duration-500 overflow-hidden relative group-hover:border-[#1B3A8C]"
                                                style={{ height: '220px', background: '#F7F4EF' }}
                                            >
                                                <Image
                                                    src={hasCampImage ? camp.image : '/logo-circular.png'}
                                                    alt={hasCampImage ? `Camp in ${camp.location}` : 'Rotary Divyang Center logo'}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className={hasCampImage
                                                        ? 'object-cover transition-transform duration-700 group-hover:scale-105'
                                                        : 'object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]'}
                                                />
                                            </div>
                                            <h3 className="font-bold text-[18px] mb-4 text-[#1A1A2E] transition-colors duration-300 group-hover:text-[#1B3A8C]">{camp.location || 'Location TBA'}</h3>
                                            <div className="mb-6 flex-1 flex flex-col gap-2">
                                                {camp.date && (
                                                    <div className="flex items-center gap-2 text-[14px] text-[#5C6475]">
                                                        <Calendar size={16} className="text-[#2AA8C4]" />
                                                        <span>{camp.date}</span>
                                                    </div>
                                                )}
                                                {camp.limbsProvided > 0 && (
                                                    <div className="flex items-center gap-2 text-[14px] text-[#5C6475]">
                                                        <Users size={16} className="text-[#2AA8C4]" />
                                                        <div><strong className="text-[#1A1A2E]">{camp.limbsProvided}</strong> limbs provided</div>
                                                    </div>
                                                )}
                                                {camp.beneficiaries > 0 && (
                                                    <div className="flex items-center gap-2 text-[14px] text-[#5C6475]">
                                                        <Users size={16} className="text-[#2AA8C4]" />
                                                        <div><strong className="text-[#1A1A2E]">{camp.beneficiaries}</strong> beneficiaries</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Partners conditional container. We use min-h to keep card height stable even if empty */}
                                            <div className="mt-auto pt-4 border-t border-[#E2DDD6] min-h-[70px]">
                                                {camp.partners && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#5C6475] mb-2 uppercase tracking-wide">
                                                            <HandHeart size={14} className="text-[#2AA8C4]" /> Partners
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 text-[12px] font-semibold text-[#1B3A8C]">
                                                            {camp.partners.split(',').slice(0, 2).map((sp) => (
                                                                <span key={sp} className="px-3 py-1 bg-[#F7F4EF] border border-[#E2DDD6] transition-colors duration-300 hover:bg-[#1B3A8C] hover:text-white cursor-default rounded-sm">
                                                                    {sp.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[700px] mx-auto px-6 text-center">
                    <FadeUp>
                        <h2 className="text-[30px] font-bold mb-4" style={{ color: '#1A1A2E' }}>
                            Support Our Next Camp
                        </h2>
                        <p className="text-[16px] leading-[1.75] mb-8" style={{ color: '#5C6475' }}>
                            Your donation directly funds the next prosthetic camp. Help us reach more people in need across India.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/donate" className="btn-donate">
                                <HandHeart size={18} /> Donate for a Camp
                            </Link>
                            <Link href="/contact" className="btn-primary">
                                Request a Camp
                            </Link>
                        </div>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
