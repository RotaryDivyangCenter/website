'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { camps } from '@/data/camps';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Link from 'next/link';
import { Calendar, MapPin, HandHeart, Users, Tent } from 'lucide-react';
import { FALLBACK_STATS, getStats, type Stats } from '@/utils/getStats';

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

export default function CampsPage() {
    const [stats, setStats] = useState<Stats>(FALLBACK_STATS);

    useEffect(() => {
        let mounted = true;

        const loadStats = async () => {
            const data = await getStats();
            if (mounted) {
                setStats(data);
            }
        };

        void loadStats();

        return () => {
            mounted = false;
        };
    }, []);

    const numericValue = (value: string) => {
        const parsed = Number(value.replace(/[^\d.-]/g, ''));
        return Number.isFinite(parsed) ? parsed : 0;
    };

    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>OUTREACH</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>
                        Our Camps — Reaching the Unreached
                    </h1>
                    <p className="mt-4 text-[16px] max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Since 2019, we&apos;ve conducted prosthetic fitment camps in communities across India.
                    </p>
                </FadeUp>
            </section>

            {/* Stats */}
            <section style={{ background: '#142d70' }} className="py-12">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatNum value={numericValue(stats.camps)} suffix="+" label="Camps Conducted" />
                        <StatNum value={numericValue(stats.prosthetic_limbs)} suffix="+" label="Limbs Provided" />
                        <StatNum value={numericValue(stats.years)} suffix="+" label="Years Active" />
                        <StatNum value={numericValue(stats.csr_partners)} suffix="" label="CSR Partners" />
                    </div>
                </div>
            </section>

            {/* Camp Cards */}
            <section className="py-24" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="section-label mb-5 justify-center">Sample Camps</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Featured Camps</h2>
                        <p className="mt-4 text-[16px] leading-[1.7]" style={{ color: '#5C6475' }}>A selection from our 85+ camps conducted across India</p>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {camps.map((camp, i) => (
                            <FadeUp key={camp.id} delay={(i % 3) * 0.08}>
                                <div className="holo-card p-8 h-full bg-[#fff] border border-[#E2DDD6] group flex flex-col">
                                    {/* Placeholder thumb */}
                                    <div
                                        className="rounded-xl mb-6 flex items-center justify-center border border-[#E2DDD6] transition-colors duration-500 group-hover:bg-[#1B3A8C] group-hover:border-[#1B3A8C]"
                                        style={{ height: '120px', background: '#F7F4EF' }}
                                    >
                                        <Tent size={48} className="text-[#1B3A8C] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="font-bold text-[18px] mb-4 text-[#1A1A2E] transition-colors duration-300 group-hover:text-[#1B3A8C]">{camp.name}</h3>
                                    <div className="space-y-3 mb-6 flex-1">
                                        <div className="flex items-center gap-3 text-[14px] text-[#5C6475]">
                                            <MapPin size={16} className="text-[#2AA8C4]" /> {camp.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-[14px] text-[#5C6475]">
                                            <Calendar size={16} className="text-[#2AA8C4]" /> {camp.date}
                                        </div>
                                        <div className="flex items-center gap-3 text-[14px] text-[#5C6475]">
                                            <Users size={16} className="text-[#2AA8C4]" /> <strong className="text-[#1A1A2E]">{camp.limbsProvided}</strong> limbs provided
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-[#E2DDD6]">
                                        {camp.sponsors.slice(0, 2).map((sp) => (
                                            <span key={sp} className="text-[12px] font-semibold px-3 py-1 bg-[#F7F4EF] text-[#1B3A8C] border border-[#E2DDD6]">
                                                {sp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
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

