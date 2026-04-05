'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { HandHeart, Phone, Footprints, HeartPulse, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const DONATION_GATEWAY_URL = 'https://portal.getepay.in:8443/getepayPortal/formPayment/RSKFORM';

function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

export default function DonatePage() {
    return (
        <div>
            {/* Hero */}
            <section className="py-28 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>GIVE BACK</p>
                    <h1 className="text-[48px] font-bold text-white mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
                        Make a Difference Today
                    </h1>
                    <p className="text-[17px] max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Every rupee you give funds a free prosthetic limb for someone who truly needs it.
                    </p>
                    <p className="mt-3 italic text-base" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Merriweather', serif" }}>
                        &quot;Giving Hope, Giving Smile&quot;
                    </p>
                </FadeUp>
            </section>

            {/* Emotional Bond */}
            <section className="py-20"  style={{ background: '#F7F4EF' }}>
                <div className="max-w-300 mx-auto px-6">
                    <div className="grid gap-10 items-center md:grid-cols-2">
                        <FadeUp>
                            <p className="section-label mb-4">Human Connection</p>
                            <h2 className="text-[34px] md:text-[40px] font-bold leading-tight mb-5" style={{ color: '#1A1A2E', fontFamily: "'Merriweather', serif" }}>
                                Your kindness reaches a real heart, a real life.
                            </h2>
                            <p className="text-[16px] leading-[1.8]" style={{ color: '#5C6475' }}>
                                Behind every donation is a patient waiting to stand, walk, and smile again. When you donate,
                                you are not just funding treatment. You are holding someone&apos;s hand through their journey
                                back to confidence and dignity.
                            </p>
                            <p className="mt-4 text-[16px] leading-[1.8] italic" style={{ color: '#D14D72', fontFamily: "'Merriweather', serif" }}>
                                A donor&apos;s compassion becomes a patient&apos;s new beginning.
                            </p>
                        </FadeUp>

                        <FadeUp delay={0.15} className="flex justify-center md:justify-end">
                            <div className="relative w-full max-w-150">
                                <Image
                                    src="/donate_heart.png"
                                    alt="Heart symbolizing the emotional bond between donors and patients"
                                    width={620}
                                    height={620}
                                    className="h-auto w-full select-none"
                                    priority
                                />
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* Why Donate */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="section-label mb-5 justify-center">Impact</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Your Donation Goes Directly to Those in Need</h2>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            { icon: <Footprints size={48} className="text-[#1B3A8C]" />, amount: 'INR 6,000', desc: 'Provides one basic prosthetic limb', delay: 0 },
                            { icon: <HeartPulse size={48} className="text-[#1B3A8C]" />, amount: 'INR 1,000', desc: 'Covers post-fitting rehabilitation care', delay: 0.2 },
                        ].map((item) => (
                            <FadeUp key={item.amount} delay={item.delay}>
                                <div className="holo-card group relative h-full border border-[#d8e3ee] bg-white p-7 text-center transition-colors duration-300 hover:border-[#17458F] sm:p-8">
                                    <div className="mb-6 flex justify-center text-[#1B3A8C] transition-colors duration-300 group-hover:text-[#17458F]">{item.icon}</div>
                                    <h3 className="mb-3 text-[30px] sm:text-[34px] font-extrabold leading-none text-[#1B3A8C] transition-colors duration-300 group-hover:text-[#17458F]">
                                        {item.amount}
                                    </h3>
                                    <p className="text-[15px] leading-[1.75] text-[#5C6475]">{item.desc}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                    <FadeUp delay={0.2} className="mt-8 flex justify-center md:hidden">
                        <div className="inline-flex items-center gap-1 rounded-full border border-[#d8e3ee] bg-[#f6f9fd] px-4 py-2 text-[12px] font-medium tracking-[0.04em] text-[#1B3A8C]">
                            Scroll down to donate
                            <ChevronDown size={14} />
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* Donation Redirect */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[640px] mx-auto px-6">
                    <FadeUp>
                        <div className="bg-white rounded-3xl p-8 md:p-10" style={{ boxShadow: '0 16px 48px rgba(27,58,140,0.12)' }}>
                            <h2 className="text-[24px] font-bold mb-2" style={{ color: '#1A1A2E' }}>Donate Now</h2>
                            <h3 className="text-[30px] md:text-[36px] font-extrabold mb-4" style={{ color: '#1B3A8C', fontFamily: "'Merriweather', serif" }}>
                                Rotary Seva Trust Kalyan
                            </h3>
                            <p className="text-sm mb-8" style={{ color: '#5C6475' }}>
                                You will be redirected to the Rotary Seva Trust Kalyan secure gateway, where all donor details and payment steps are completed.
                            </p>

                            <a
                                href={DONATION_GATEWAY_URL}
                                target="_blank"
                                className="btn-donate w-full justify-center mt-2"
                                aria-label="Proceed to secure donation gateway"
                            >
                                <HandHeart size={20} /> Donate via Secure Gateway
                            </a>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* Corporate Donation */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[700px] mx-auto px-6 text-center">
                    <FadeUp>
                        <h2 className="text-[28px] font-bold mb-4" style={{ color: '#1A1A2E' }}>Corporate / CSR Donations</h2>
                        <p className="text-[16px] leading-[1.75] mb-8" style={{ color: '#5C6475' }}>
                            Looking to channel your company&apos;s CSR funds toward a meaningful cause? Partner with Rotary Divyang Center
                            to sponsor prosthetic camps, equipment, or rehabilitation support.
                        </p>
                        <Link href="/contact" className="btn-primary">
                            <Phone size={16} /> Get in Touch
                        </Link>
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
