'use client';

import { motion } from 'framer-motion';
<<<<<<< HEAD
import { HandHeart, Shield, Info, Phone, Footprints, Bot, HeartPulse } from 'lucide-react';
=======
import type { ReactNode } from 'react';
import { HandHeart, Phone, Footprints, HeartPulse } from 'lucide-react';
>>>>>>> a8a3fa3 (update: redirected donate button to gateway)
import Link from 'next/link';

const DONATION_GATEWAY_URL = 'https://portal.getepay.in:8443/getepayPortal/formPayment/RSKFORM';

function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

<<<<<<< HEAD
const amounts = [500, 1000, 2500, 5000, 10000];

export default function DonatePage() {
    const [selected, setSelected] = useState<number | 'custom'>(2500);
    const [custom, setCustom] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    const displayAmount = selected === 'custom' ? Number(custom) || 0 : selected;

    const handleDonate = () => {
        alert(`Thank you, ${form.name || 'donor'}! Razorpay integration will process ₹${displayAmount}. This is a placeholder — connect your Razorpay key to go live.`);
    };

=======
export default function DonatePage() {
>>>>>>> a8a3fa3 (update: redirected donate button to gateway)
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
                </div>
            </section>

            {/* Donation Redirect */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[640px] mx-auto px-6">
                    <FadeUp>
                        <div className="bg-white rounded-3xl p-8 md:p-10" style={{ boxShadow: '0 16px 48px rgba(27,58,140,0.12)' }}>
                            <h2 className="text-[24px] font-bold mb-2" style={{ color: '#1A1A2E' }}>Donate Now</h2>
<<<<<<< HEAD
                            <p className="text-sm mb-6" style={{ color: '#5C6475' }}>Select an amount or enter a custom value</p>

                            {/* Amount buttons */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {amounts.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelected(amt); setCustom(''); }}
                                        className="py-3 rounded-xl font-bold text-[15px] transition-all duration-200"
                                        style={{
                                            border: selected === amt ? '2px solid #E8430A' : '1.5px solid #E2DDD6',
                                            background: selected === amt ? '#FFF3EF' : '#F7F4EF',
                                            color: selected === amt ? '#E8430A' : '#1A1A2E',
                                        }}
                                    >
                                        ₹{amt.toLocaleString('en-IN')}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setSelected('custom')}
                                    className="col-span-3 py-3 rounded-xl font-bold text-[15px] transition-all duration-200"
                                    style={{
                                        border: selected === 'custom' ? '2px solid #E8430A' : '1.5px solid #E2DDD6',
                                        background: selected === 'custom' ? '#FFF3EF' : '#F7F4EF',
                                        color: selected === 'custom' ? '#E8430A' : '#1A1A2E',
                                    }}
                                >
                                    Custom Amount
                                </button>
                            </div>
                            {selected === 'custom' && (
                                <div className="mb-4">
                                    <input
                                        type="number"
                                        placeholder="Enter amount in ₹"
                                        value={custom}
                                        onChange={(e) => setCustom(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none"
                                        style={{ border: '1.5px solid #E2DDD6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    />
                                </div>
                            )}

                            {/* Form fields */}
                            <div className="space-y-4 mt-6">
                                {[
                                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                                    { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                                ].map((field) => (
                                    <div key={field.id}>
                                        <label htmlFor={field.id} className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.id}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={form[field.id as keyof typeof form]}
                                            onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none transition-all"
                                            style={{ border: '1.5px solid #E2DDD6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            onFocus={(e) => (e.target.style.border = '1.5px solid #1B3A8C')}
                                            onBlur={(e) => (e.target.style.border = '1.5px solid #E2DDD6')}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Donate button */}
                            <button
                                onClick={handleDonate}
                                className="btn-donate w-full justify-center mt-8"
                                aria-label={`Donate ₹${displayAmount} via Razorpay`}
                            >
                                <HandHeart size={20} />
                                Donate ₹{displayAmount > 0 ? displayAmount.toLocaleString('en-IN') : '—'} via Razorpay
                            </button>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
                                <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#5C6475' }}>
                                    <Shield size={14} style={{ color: '#5A9E3A' }} /> Secure Payment
                                </span>
                                <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#5C6475' }}>
                                    <Info size={14} style={{ color: '#1B3A8C' }} /> 80G Tax Exemption Available
                                </span>
                            </div>
=======
                            <h3 className="text-[30px] md:text-[36px] font-extrabold mb-4" style={{ color: '#1B3A8C', fontFamily: "'Merriweather', serif" }}>
                                Rotary Seva Trust Kalyan
                            </h3>
                            <p className="text-sm mb-8" style={{ color: '#5C6475' }}>
                                You will be redirected to the Rotary Seva Trust Kalyan secure gateway, where all donor details and payment steps are completed.
                            </p>

                            <a
                                href={DONATION_GATEWAY_URL}
                                className="btn-donate w-full justify-center mt-2"
                                aria-label="Proceed to secure donation gateway"
                            >
                                <HandHeart size={20} /> Donate via Secure Gateway
                            </a>
>>>>>>> a8a3fa3 (update: redirected donate button to gateway)
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
