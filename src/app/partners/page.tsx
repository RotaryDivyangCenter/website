'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const partners = [
    {
        name: 'Acutaas',
        logo: '/acutaas.png',
        description: 'Healthcare solutions company sponsoring prosthetic equipment and camps across Thane district.',
        type: 'Healthcare & Technology',
        color: '#1B3A8C',
        bg: '#EBF4FF',
    },
    {
        name: 'Atos India',
        logo: '/atos.svg',
        description: 'Global IT services leader contributing CSR funds for hi-tech prosthetic limbs and LN4 program.',
        type: 'Information Technology',
        color: '#7B2D8B',
        bg: '#F3E8FF',
    },
    {
        name: 'Century Rayon',
        logo: '/century_rayon.png',
        description: 'Textile industry pioneer partnering to fund prosthetic camps for workers and families in Maharashtra.',
        type: 'Textile Manufacturing',
        color: '#5A9E3A',
        bg: '#ECFDF5',
    },
    {
        name: 'Legrand',
        logo: '/legrand.png',
        description: 'Global electrical infrastructure leader supporting disability welfare through prosthetics sponsorship.',
        type: 'Electrical Infrastructure',
        color: '#2AA8C4',
        bg: '#EBF4FF',
    },
];

const intl = [
    {
        name: 'Ellen Meados Prosthetic Hand Foundation',
        country: 'USA',
        desc: 'Pioneering foundation that developed the LN4 hi-tech prosthetic hand technology. Provides training and technology partnership to RDC.',
    },
    {
        name: 'Rotary Club of Poona Downtown',
        country: 'India – Dist. 3131',
        desc: 'Sister Rotary club supporting RDC through joint camps, funding, and Rotarian volunteerism.',
    },
];

export default function PartnersPage() {
    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>TOGETHER WE SERVE</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Our CSR Partners</h1>
                    <p className="mt-4 text-[16px] max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Empowering us to serve thousands with your support and trust.
                    </p>
                </FadeUp>
            </section>

            {/* CSR Partners */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-14">
                        <span className="section-label block mb-3">Corporate Partners</span>
                        <h2 className="text-[32px] font-bold" style={{ color: '#1A1A2E' }}>Valued CSR Partners</h2>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partners.map((p, i) => (
                            <FadeUp key={p.name} delay={i * 0.08}>
                                <div className="holo-card group p-6 flex flex-col items-center text-center h-full border border-[#E2DDD6] bg-[#fff]">
                                    <div
                                        className={`w-full h-16 mb-4 flex items-center justify-center ${
                                            p.name === 'Legrand' ? 'rounded-md group-hover:bg-[#FF0000] transition-colors duration-500' : ''
                                        }`}
                                    >
                                        <Image
                                            src={p.logo}
                                            alt={`${p.name} logo`}
                                            width={150}
                                            height={60}
                                            className={`max-h-14 w-auto object-contain transition duration-500 ${
                                                p.name === 'Legrand'
                                                    ? 'brightness-0 opacity-60 group-hover:brightness-100 group-hover:opacity-100'
                                                    : p.name === 'Century Rayon'
                                                        ? 'max-h-16 grayscale group-hover:grayscale-0'
                                                        : 'grayscale group-hover:grayscale-0'
                                            }`}
                                        />
                                    </div>
                                    <h3 className="font-bold text-[18px] mb-1 transition-colors duration-300 group-hover:text-[#1B3A8C]" style={{ color: '#1A1A2E' }}>{p.name}</h3>
                                    <span className="text-[12px] font-semibold px-3 py-1 rounded-full mb-3" style={{ background: p.bg, color: p.color }}>
                                        {p.type}
                                    </span>
                                    <p className="text-[13px] leading-relaxed" style={{ color: '#5C6475' }}>{p.description}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* International Partners */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[1000px] mx-auto px-6">
                    <FadeUp className="text-center mb-12">
                        <span className="section-label block mb-3">International</span>
                        <h2 className="text-[32px] font-bold" style={{ color: '#1A1A2E' }}>Global Acknowledgements</h2>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {intl.map((p, i) => (
                            <FadeUp key={p.name} delay={i * 0.1}>
                                <div className="holo-card group p-6 flex gap-5 border border-[#E2DDD6] bg-[#fff]">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:-translate-y-1" style={{ background: '#EBF4FF' }}>
                                        <Users size={22} style={{ color: '#1B3A8C' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[16px] mb-0.5 transition-colors duration-300 group-hover:text-[#1B3A8C]" style={{ color: '#1A1A2E' }}>{p.name}</h3>
                                        <p className="text-[12px] font-semibold mb-2" style={{ color: '#2AA8C4' }}>{p.country}</p>
                                        <p className="text-[13px] leading-relaxed" style={{ color: '#5C6475' }}>{p.desc}</p>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* Become a Partner CTA */}
            <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B3A8C 0%, #7B2D8B 100%)' }}>
                <div className="max-w-[700px] mx-auto px-6 text-center">
                    <FadeUp>
                        <h2 className="text-[32px] font-bold text-white mb-4">Become a CSR Partner</h2>
                        <p className="text-[16px] mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Partner with Rotary Divyang Center to fulfill your CSR mandate while transforming lives.
                            80G tax exemption available on all eligible donations.
                        </p>
                        <a href="/contact" className="btn-donate">
                            Get in Touch
                        </a>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
