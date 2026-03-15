'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>GET IN TOUCH</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Find Us</h1>
                </FadeUp>
            </section>

            {/* Map + Contact Details */}
            <section className="py-20" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Map */}
                        <FadeUp>
                            <div>
                                <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(27,58,140,0.12)', height: '420px' }}>
                                    <iframe
                                        src="https://www.google.com/maps?q=Rotary+Divyang+Center,+64VH%2BCG+Kalyan,+Maharashtra&z=17&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Rotary Divyang Center location map"
                                    />
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=Rotary+Divyang+Center,+64VH%2BCG+Kalyan,+Maharashtra"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-primary"
                                        aria-label="Get directions to Rotary Divyang Center"
                                    >
                                        Get Directions
                                    </a>
                                    <a
                                        href="https://www.google.com/maps/place/Rotary+Divyang+Center/@19.2436222,73.1288657,17z/data=!3m1!4b1!4m6!3m5!1s0x3be795db254325bd:0x1aed09bf8c056b91!8m2!3d19.2436222!4d73.1288657!16s%2Fg%2F11fn0jh5fz?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-secondary"
                                        aria-label="Open Rotary Divyang Center in Google Maps"
                                    >
                                        Open in Maps
                                    </a>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Contact Card */}
                        <FadeUp delay={0.1}>
                            <div className="p-10 h-full border border-[#E2DDD6] bg-[#fff]">
                                <h2 className="text-[28px] font-bold mb-8" style={{ color: '#1A1A2E' }}>Contact Information</h2>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EBF4FF' }}>
                                            <MapPin size={18} style={{ color: '#1B3A8C' }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[14px] mb-0.5" style={{ color: '#1A1A2E' }}>Address</p>
                                            <p className="text-[14px] leading-relaxed" style={{ color: '#5C6475' }}>
                                                Rotary Divyang Center<br />
                                                Sabnis Bungalow, Sahajanand Chowk, opp. Katkar Hospital, Tilak Chowk,<br />
                                                Kalyan, Maharashtra 421301, India
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EBF4FF' }}>
                                            <Phone size={18} style={{ color: '#1B3A8C' }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[14px] mb-0.5" style={{ color: '#1A1A2E' }}>Phone</p>
                                            <a href="tel:+919876543210" className="text-[14px] hover:underline" style={{ color: '#2AA8C4' }}>+91 98765 43210</a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EBF4FF' }}>
                                            <Mail size={18} style={{ color: '#1B3A8C' }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[14px] mb-0.5" style={{ color: '#1A1A2E' }}>Email</p>
                                            <a href="mailto:info@rotarydivyangcenter.org" className="text-[14px] hover:underline" style={{ color: '#2AA8C4' }}>
                                                info@rotarydivyangcenter.org
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EBF4FF' }}>
                                            <Clock size={18} style={{ color: '#1B3A8C' }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[14px] mb-0.5" style={{ color: '#1A1A2E' }}>Working Hours</p>
                                            <p className="text-[14px]" style={{ color: '#5C6475' }}>
                                                Saturday: 10:00 AM – 1:00 PM<br />Sunday: 10:00 AM – 1:00 PM
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-6 pt-5 border-t" style={{ borderColor: '#E2DDD6' }}>
                                    <p className="text-[13px] font-medium mb-1" style={{ color: '#1A1A2E' }}>Rotary Club of New Kalyan</p>
                                    <p className="text-[13px]" style={{ color: '#5C6475' }}>District 3142 · Club ID: 90509</p>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20" style={{ background: '#fff' }}>
                <div className="max-w-[640px] mx-auto px-6">
                    <FadeUp className="text-center mb-16">
                        <span className="section-label mb-5 justify-center">Send Us a Message</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>We&apos;d love to hear from you</h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        {sent ? (
                            <div
                                className="p-12 text-center bg-[#F7F4EF] border border-[#5A9E3A]"
                            >
                                <div className="mb-6 flex justify-center"><CheckCircle size={64} className="text-[#5A9E3A]" /></div>
                                <h3 className="text-[24px] font-bold mb-3" style={{ color: '#5A9E3A' }}>Message Sent!</h3>
                                <p className="text-[16px] leading-[1.7]" style={{ color: '#5C6475' }}>Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-10 bg-[#fff] border border-[#E2DDD6] space-y-6">
                                {[
                                    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Full name' },
                                    { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                                ].map((field) => (
                                    <div key={field.id}>
                                        <label htmlFor={field.id} className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.id}
                                            type={field.type}
                                            required
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
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={5}
                                        placeholder="How can we help you?"
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none transition-all resize-none"
                                        style={{ border: '1.5px solid #E2DDD6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        onFocus={(e) => (e.target.style.border = '1.5px solid #1B3A8C')}
                                        onBlur={(e) => (e.target.style.border = '1.5px solid #E2DDD6')}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full justify-center">
                                    <Send size={16} /> Send Message
                                </button>
                            </form>
                        )}
                    </FadeUp>
                </div>
            </section>
        </div>
    );
}
