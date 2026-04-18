'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { services } from '@/data/services';
import { Footprints, Hand, Zap } from 'lucide-react';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

export default function ServicesPage() {
    const legs = services.filter((s) => s.category === 'legs');
    const hands = services.filter((s) => s.category === 'hands');

    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (!hash) return;

            const el = document.getElementById(hash);
            if (!el) return;

            const yOffset = 110;
            const y = el.getBoundingClientRect().top + window.scrollY - yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        };

        const timer = window.setTimeout(scrollToHash, 80);
        window.addEventListener('hashchange', scrollToHash);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('hashchange', scrollToHash);
        };
    }, []);

    const ServiceCard = ({ service, delay }: { service: (typeof services)[0]; delay: number }) => (
        <FadeUp delay={delay}>
            <div className="holo-card p-8 h-full flex flex-col border border-[#E2DDD6] bg-[#fff] group relative">
                {/* Badges */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {service.badge === 'basic' ? (
                        <span className="text-xs font-semibold px-3 py-1 bg-[#F7F4EF] text-[#1A1A2E] border border-[#E2DDD6]">Basic</span>
                    ) : (
                        <span className="text-xs font-semibold px-3 py-1 bg-[#1A1A2E] text-white flex items-center justify-center">Hi-Tech* <Zap size={12} className="ml-1 text-yellow-400" /></span>
                    )}
                    <span className="text-xs font-semibold px-3 py-1 bg-[#EBF4FF] text-[#1B3A8C]">100% Free</span>
                </div>
                <h3 className="text-[20px] font-bold mb-3 text-[#1A1A2E] transition-colors duration-300 group-hover:text-[#1B3A8C]">{service.name}</h3>
                <p className="text-[15px] leading-[1.75] mb-6 flex-1 text-[#5C6475]">{service.description}</p>
                <div className="space-y-2 text-[14px] text-[#5C6475] pt-6 border-t border-[#E2DDD6]">
                    <p><strong className="text-[#1A1A2E] font-semibold">Material:</strong> {service.material}</p>
                    <p><strong className="text-[#1A1A2E] font-semibold">Eligibility:</strong> {service.eligibility}</p>
                </div>
            </div>
        </FadeUp>
    );

    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>WHAT WE OFFER</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Our Services</h1>
                    <p className="mt-4 text-[16px] max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        100% free prosthetic and orthotic solutions, from basic to advanced hi-tech*.
                    </p>
                </FadeUp>
            </section>

            {/* Intro */}
            <section className="py-16" style={{ background: '#fff' }}>
                <div className="max-w-[860px] mx-auto px-6 text-center">
                    <FadeUp>
                        <h2 className="text-[28px] font-bold mb-4" style={{ color: '#1A1A2E' }}>Restoring Function. Restoring Dignity.</h2>
                        <p className="text-[16px] leading-[1.8]" style={{ color: '#5C6475' }}>
                            At Rotary Divyang Center, we assess each beneficiary individually to determine
                            the most suitable prosthetic solution. Whether basic or hi-tech*, every device is custom-fitted and
                            provided <strong style={{ color: '#5A9E3A' }}>100% free of charge</strong> to the recipient.
                        </p>
                    </FadeUp>
                </div>
            </section>

            {/* Legs */}
            <section id="limbs" className="py-16" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EBF4FF' }}>
                            <Footprints size={24} style={{ color: '#1B3A8C' }} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-bold" style={{ color: '#1A1A2E' }}>Limbs</h2>
                            <p className="text-sm" style={{ color: '#5C6475' }}>Category A — Limb and Orthotic Support</p>
                        </div>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {legs.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.07} />)}
                    </div>
                    <FadeUp delay={0.12}>
                        <p className="mt-8 text-[14px]" style={{ color: '#5C6475' }}>
                            * Hi-tech options are available only in BK and AK categories, based on clinical assessment and final decision.
                        </p>
                    </FadeUp>
                </div>
            </section>

            {/* Hands */}
            <section id="hands" className="py-16" style={{ background: '#fff' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F3E8FF' }}>
                            <Hand size={24} style={{ color: '#7B2D8B' }} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-bold" style={{ color: '#1A1A2E' }}>Hands</h2>
                            <p className="text-sm" style={{ color: '#5C6475' }}>Category B — Hand Prosthetics</p>
                        </div>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hands.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 0.07} />)}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-24" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="mb-16 max-w-2xl mx-auto text-center">
                        <span className="section-label mb-5 justify-center">How It Works</span>
                        <h2 className="text-[36px] font-bold leading-tight" style={{ color: '#1A1A2E' }}>How to Get a Free Prosthetic Limb</h2>
                        <p className="mt-4 text-[15px] leading-[1.75]" style={{ color: '#5C6475' }}>
                            The center is open every Saturday and Sunday from 10:00 AM to 1:00 PM.
                        </p>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {[
                            { step: '01', title: 'Visit on Sat/Sun', desc: 'The patient visits the center during 10:00 AM to 1:00 PM on Saturday or Sunday.' },
                            { step: '02', title: 'Measurement at Center', desc: 'Our team records detailed limb measurements and clinical requirements the same day.' },
                            { step: '03', title: 'Return Next Week', desc: 'On the exact same day next week, the patient returns for the prepared custom limb.' },
                            { step: '04', title: 'No-Cost Fitment', desc: 'The customized limb is fitted and guided at zero cost to the patient.' },
                        ].map((item, i) => (
                            <FadeUp key={item.step} delay={i * 0.08}>
                                <div className="holo-card p-8 text-center relative h-full bg-[#fff] border border-[#E2DDD6] group">
                                    <div className="mb-6 text-[48px] font-extrabold leading-none text-[rgba(27,58,140,0.12)] transition-colors duration-500 group-hover:text-[#17458F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.step}</div>
                                    <h3 className="font-bold text-[18px] mb-3" style={{ color: '#1A1A2E' }}>{item.title}</h3>
                                    <p className="text-[15px] leading-[1.75]" style={{ color: '#5C6475' }}>{item.desc}</p>

                                    {/* Subtle connecting line instead of chevron */}
                                    {i < 3 && (
                                        <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-[1px] bg-[#E2DDD6] z-10" />
                                    )}
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

