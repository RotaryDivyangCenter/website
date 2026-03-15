'use client';
import { motion } from 'framer-motion';
import { teamMembers, ambassadors } from '@/data/team';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

function MemberCard({ initials, name, role, tenure, delay }: { initials: string; name: string; role: string; tenure?: string; delay: number }) {
    return (
        <FadeUp delay={delay}>
            <div className="p-8 text-center flex flex-col items-center h-full border border-[#E2DDD6] bg-[#fff] group hover:-translate-y-2 transition-transform duration-500">
                {/* Monogram Avatar */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 flex-shrink-0 bg-[#F7F4EF] text-[#1B3A8C] group-hover:bg-[#1B3A8C] group-hover:text-white transition-colors duration-500"
                    style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                >
                    {initials}
                </div>
                <h3 className="font-bold text-[18px] mb-1 text-[#1A1A2E]">{name}</h3>
                <p className="font-semibold text-[14px] mb-2 text-[#5C6475]">{role}</p>
                {tenure && (
                    <span className="text-[12px] px-3 py-1 rounded-full mt-2 bg-[#F7F4EF] text-[#1B3A8C] border border-[#E2DDD6]">
                        {tenure}
                    </span>
                )}
                <p className="mt-4 text-[12px] uppercase tracking-wider font-semibold text-[#5C6475]">
                    Rotary Club of New Kalyan
                </p>
            </div>
        </FadeUp>
    );
}

export default function TeamPage() {
    return (
        <div>
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: '#1B3A8C' }}>
                <FadeUp>
                    <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>THE PEOPLE BEHIND THE MISSION</p>
                    <h1 className="text-[48px] font-bold text-white" style={{ fontFamily: "'Merriweather', serif" }}>Our Committee</h1>
                    <p className="mt-4 text-[16px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Dedicated Rotarians driving the Divyang Center forward.
                    </p>
                </FadeUp>
            </section>

            {/* Committee Members */}
            <section className="py-24" style={{ background: '#F7F4EF' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="section-label mb-5 justify-center">Leadership</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>Committee Members</h2>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((m, i) => (
                            <MemberCard key={m.id} initials={m.initials} name={m.name} role={m.role} tenure={m.tenure} delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Ambassadors */}
            <section className="py-24" style={{ background: '#fff' }}>
                <div className="max-w-[1200px] mx-auto px-6">
                    <FadeUp className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="section-label mb-5 justify-center">LN4 Program</span>
                        <h2 className="text-[36px] font-bold" style={{ color: '#1A1A2E' }}>LN4 Ambassadors</h2>
                        <p className="mt-4 text-[16px] leading-[1.7] max-w-lg mx-auto" style={{ color: '#5C6475' }}>
                            Key individuals driving the LN4 hi-tech prosthetics program in South Asia.
                        </p>
                    </FadeUp>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {ambassadors.map((a, i) => (
                            <MemberCard key={a.name} initials={a.initials} name={a.name} role={a.role} delay={i * 0.1} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
