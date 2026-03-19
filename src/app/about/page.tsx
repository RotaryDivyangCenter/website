'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Eye, Globe, Star, MapPin, Building2, Bookmark, IdCard, Calendar } from 'lucide-react';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

const timeline = [
    { year: '2019', title: 'Center Founded', desc: 'Rotary Divyang Center established under Rotary Club of New Kalyan, Dist. 3142.' },
    { year: '2016', title: 'First Major Camp', desc: 'First large-scale camp conducted — over 50 prosthetic limbs provided to beneficiaries.' },
    { year: '2019', title: 'LN4 Hi-Tech Limbs', desc: 'Introduction of LN4 Jaipur Foot technology and hi-tech prosthetic hands in collaboration with international partners.' },
    { year: '2022', title: '500+ Limbs Milestone', desc: 'Crossed the 500 prosthetic limbs milestone — a landmark moment for the center.' },
    { year: '2024', title: '10 Years — 1000+ Lives', desc: 'Celebrated 10 years of service with over 1,000 lives transformed through free prosthetic limbs.' },
    { year: '2025', title: 'Ongoing Expansion', desc: 'Expanding reach to more districts in Maharashtra with new camp partnerships and CSR support.' },
];

const acknowledgements = [
    { name: 'Ellen Meados Prosthetic Hand Foundation', country: 'USA', icon: <Globe size={24} />, desc: 'International partner providing LN4 hi-tech prosthetic hand technology.' },
    { name: 'Rotary Club of Poona Downtown', country: 'India', icon: <Star size={24} />, desc: 'Sister Rotary club providing collaborative support for camps and outreach.' },
    { name: 'Rtn. K.V. Mohan Kumar', country: 'LN-4 Ambassador, South Asia', icon: <Star size={24} />, desc: 'Instrumental in bringing LN4 technology to the center.' },
    { name: 'Rtn. Sudhish Nair', country: 'L4 Coordinator, Rotary Club of New Kalyan', icon: <Star size={24} />, desc: 'Coordinating LN4 prosthetic programs within the club.' },
];

export default function AboutPage() {
    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>WHO WE ARE</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>About Us</h1>
                    <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Home / About</p>
                </FadeUp>
            </section>

            {/* Mission & Vision */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16">
                        <span className="section-label mb-5 justify-center">Purpose</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Mission & Vision</h2>
                    </FadeUp>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: <Target size={32} style={{ color: '#1B3A8C' }} />,
                                title: 'Our Mission',
                                desc: 'To provide free, high-quality prosthetic limbs to people with disabilities across Maharashtra — regardless of economic status — so every individual can walk, work, and live with dignity.',
                                delay: 0,
                            },
                            {
                                icon: <Eye size={32} style={{ color: '#7B2D8B' }} />,
                                title: 'Our Vision',
                                desc: 'A world where every person with a disability (Divyang) walks with confidence and dignity. We envision a Maharashtra free from mobility-related limitations for amputees.',
                                delay: 0.1,
                            },
                        ].map((item) => (
                            <FadeUp key={item.title} delay={item.delay}>
                                <div className="holo-card p-10 h-full border border-[#E2DDD6] bg-[#fff] group">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 border border-[#E2DDD6]" style={{ background: '#F7F4EF' }}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-[24px] font-bold mb-4" style={{ color: '#1A1A2E' }}>{item.title}</h3>
                                    <p className="text-[16px] leading-[1.8]" style={{ color: '#5C6475' }}>{item.desc}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[900px] mx-auto px-6">
                    <FadeUp className="text-center mb-20">
                        <span className="section-label mb-5 justify-center">Our Journey</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Our Story</h2>
                    </FadeUp>
                    <div className="relative">
                        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px]" style={{ background: '#E2DDD6', transform: 'translateX(-50%)' }} />
                        <div className="space-y-10">
                            {timeline.map((item, i) => (
                                <FadeUp key={item.year} delay={i * 0.08}>
                                    <div className={`flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                                        {/* Content */}
                                        <div className={`md:w-[calc(50%-32px)] ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} pl-16 md:pl-0`}>
                                            <div className="holo-card p-6 bg-[#fff] border border-[#E2DDD6] relative group transition-all duration-500 overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#1B3A8C] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                                                <span className="text-xs font-bold uppercase tracking-widest transition-colors duration-300 text-[#1B3A8C]">{item.year}</span>
                                                <h3 className="text-[18px] font-bold mt-2 mb-3 transition-colors duration-300 group-hover:text-[#1B3A8C]" style={{ color: '#1A1A2E' }}>{item.title}</h3>
                                                <p className="text-[15px] leading-[1.7]" style={{ color: '#5C6475' }}>{item.desc}</p>
                                            </div>
                                        </div>
                                        {/* Dot */}
                                        <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-2 border-white mt-5" style={{ background: '#1B3A8C', boxShadow: '0 0 0 3px rgba(27,58,140,0.2)' }} />
                                    </div>
                                </FadeUp>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo + Details */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeUp>
                            <div className="rounded-xl img-reveal-wrapper w-full">
                                <Image src="/2.jpg" alt="Inside Rotary Divyang Center" width={800} height={600} className="object-cover w-full h-auto img-reveal" sizes="(max-width: 768px) 100vw, 50vw" />
                            </div>
                        </FadeUp>
                        <FadeUp delay={0.1}>
                            <h2 className="text-[32px] font-bold mb-4" style={{ color: '#1A1A2E' }}>Our Center</h2>
                            <p className="text-[16px] leading-[1.75] mb-6" style={{ color: '#5C6475' }}>
                                Rotary Divyang Center is conveniently located in Kalyan, the heart of Thane district,
                                making it accessible to beneficiaries from Thane, Raigad, Palghar, and beyond.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    [<MapPin size={18} className="text-[#1B3A8C]" key="1" />, 'Location', 'Kalyan, Thane, Maharashtra'],
                                    [<Building2 size={18} className="text-[#1B3A8C]" key="2" />, 'Type', 'Prosthetic & Orthotics Unit'],
                                    [<Bookmark size={18} className="text-[#1B3A8C]" key="3" />, 'Club', 'Rotary Club of New Kalyan'],
                                    [<Globe size={18} className="text-[#1B3A8C]" key="4" />, 'District', 'Rotary International District 3142'],
                                    [<IdCard size={18} className="text-[#1B3A8C]" key="5" />, 'Club ID', '90509'],
                                    [<Calendar size={18} className="text-[#1B3A8C]" key="6" />, 'Founded', '2019'],
                                ].map(([icon, label, value]) => (
                                    <li key={String(label)} className="flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">{icon}</span>
                                        <div>
                                            <span className="font-semibold text-[14px]" style={{ color: '#1A1A2E' }}>{label}: </span>
                                            <span className="text-[14px]" style={{ color: '#5C6475' }}>{value}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>
                    </div>
                </div>
            </section>
        </div>
    );
}
