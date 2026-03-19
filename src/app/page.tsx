'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  ArrowRight,
  HandHeart,
  MapPin,
  HeartPulse,
  Activity,
  HelpingHand,
  Calendar,
} from 'lucide-react';
import { campStats } from '@/data/camps';

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function ImpactStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div
      ref={ref}
      className="holo-card group py-6 sm:py-8 px-6 text-center h-full flex flex-col justify-center border border-[#d8e3ee] bg-white"
    >
      <p className="text-[2rem] sm:text-[2.8rem] font-bold leading-none text-[#6BA539] font-[var(--font-jakarta)] tracking-tight transition-colors duration-300 group-hover:text-[#17458F]">
        {inView ? <CountUp end={value} duration={0.9} useEasing={false} /> : 0}
        {suffix}
      </p>
      <p className="mt-2 text-sm sm:text-base leading-snug text-[#5A5A5A] transition-colors duration-300 group-hover:text-[#1A1A1A]">
        {label}
      </p>
    </div>
  );
}

const services = [
  {
    title: 'Artificial Legs',
    desc: 'Reliable lower-limb prosthetics designed for comfort, gait support, and daily independence.',
    icon: Activity,
  },
  {
    title: 'Artificial Hands',
    desc: 'Upper-limb prosthetic options that improve function for essential work and home activities.',
    icon: HelpingHand,
  },
  {
    title: 'LN4 Prosthetics*',
    desc: 'Hi-tech* LN4 solutions and advanced mobility support for beneficiaries needing enhanced movement.',
    icon: HeartPulse,
  },
];

const csrPartners = [
  { name: 'Acutaas', logo: '/acutaas.png' },
  { name: 'Atos', logo: '/atos.svg' },
  { name: 'Century Rayon', logo: '/century_rayon.png' },
  { name: 'Legrand', logo: '/legrand.png' },
];

export default function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <div>
      <section
        className="py-14 sm:py-20"
        style={{ background: 'linear-gradient(140deg, #FFFFFF 0%, #EDF3F8 100%)' }}
      >
        <div className="container-shell grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#ffffff] border border-[#d8e3ee] text-[#2C5AA0]">
              Rotary Divyang Center · Giving Hope, Giving Smile
            </div>
            <h1 className="mt-5 text-[2.2rem] sm:text-[3.2rem] leading-[1.12] font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Restoring Steps.
              <br />
              Rebuilding Confidence.
            </h1>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] sm:text-[1.08rem] leading-[1.75] text-[#5A5A5A]">
              Rotary Divyang Center helps people walk and work again through free prosthetic services, long-term follow-up,
              and outreach camps across communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/donate" className="btn-donate" aria-label="Donate for prosthetic support">
                <HandHeart size={17} /> Donate Now
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div className="rounded-2xl border border-[#d8e3ee] bg-white p-4 sm:p-5 shadow-[0_18px_40px_rgba(21,58,117,0.08)]">
              <div className="mb-3 flex items-center gap-2.5">
                <Image src="/logo.jpg" alt="Rotary Divyang Center logo" width={36} height={36} className="rounded-full" />
                <p className="text-sm font-semibold text-[#17458F]">Serving with dignity since 2019</p>
              </div>
              <Image
                src="/4.jpg"
                alt="Prosthetic support activity"
                width={900}
                height={640}
                className="h-auto w-full rounded-xl object-cover"
                priority
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white" id="about">
        <div className="container-shell grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
          <FadeUp>
            <p className="section-label">About Divyang Center</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              A humanitarian prosthetic initiative led by Rotary
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-[#5A5A5A] leading-[1.85] text-[1rem]">
              Located in Kalyan, Maharashtra, Rotary Divyang Center provides free prosthetic limbs and rehabilitation
              guidance to beneficiaries. The program collaborates with CSR partners and outreach volunteers to ensure access for
              families who need support the most.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: '#F6F9FC' }} id="services">
        <div className="container-shell">
          <FadeUp>
            <p className="section-label">Services</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Basic and hi-tech* prosthetic support
            </h2>
          </FadeUp>

          <div className="mt-10 grid md:grid-cols-3 gap-7">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <FadeUp key={service.title} delay={index * 0.08}>
                  <article className="group border-b border-[#d8e3ee] pb-6">
                    <div className="h-12 w-12 rounded-md bg-[#EDF3F8] text-[#2CA7B0] flex items-center justify-center">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-[1.18rem] font-semibold text-[#1A1A1A]">{service.title}</h3>
                    <p className="mt-2 text-[#5A5A5A] leading-[1.7] text-[0.98rem]">{service.desc}</p>
                    <Link href="/services" className="mt-4 link-inline text-[#17458F]">
                      Learn more <ArrowRight size={15} />
                    </Link>
                  </article>
                </FadeUp>
              );
            })}
          </div>
          <FadeUp delay={0.12}>
            <p className="mt-7 text-[14px] text-[#5A5A5A]">
              * Hi-tech limbs are provided only to selected beneficiaries, based on the center&apos;s clinical assessment and final decision.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white" id="impact">
        <div className="container-shell">
          <FadeUp>
            <p className="section-label">Impact Statistics</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Measurable service over the years
            </h2>
          </FadeUp>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ImpactStat value={campStats.totalBeneficiaries} suffix="+" label="Lives supported" />
            <ImpactStat value={campStats.totalLimbs} suffix="+" label="Prosthetic limbs fitted" />
            <ImpactStat value={campStats.totalCamps} suffix="+" label="Outreach camps conducted" />
            <ImpactStat value={40} suffix="+" label="Hours per week" />
            <ImpactStat value={campStats.yearsActive} suffix="+" label="Years of service" />
            <ImpactStat value={4} suffix="+" label="CSR and institutional partners" />
          </div>
        </div>
      </section>
      
            <section className="py-16 sm:py-20" style={{ background: '#F6F9FC' }}>
              <div className="container-shell">
                <FadeUp>
                  <div className="mb-12 max-w-2xl sm:mb-16">
                    <p className="section-label">How It Works</p>
                    <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
                      How to Get a Free Prosthetic Limb
                    </h2>
                    <p className="mt-4 text-[15px] leading-[1.75] text-[#5C6475]">
                      The center is open every Saturday and Sunday from 10:00 AM to 1:00 PM.
                    </p>
                  </div>
                </FadeUp>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 sm:gap-y-10">
                  {[
                    { step: '01', title: 'Visit on Sat/Sun', desc: 'The patient visits the center during 10:00 AM to 1:00 PM on Saturday or Sunday.' },
                    { step: '02', title: 'Measurement at Center', desc: 'Our team records detailed limb measurements and clinical requirements the same day.' },
                    { step: '03', title: 'Return Next Week', desc: 'On the exact same day next week, the patient returns for the prepared custom limb.' },
                    { step: '04', title: 'No-Cost Fitment', desc: 'The customized limb is fitted and guided at zero cost to the patient.' },
                  ].map((item, i) => (
                    <FadeUp key={item.step} delay={i * 0.08}>
                      <div className="holo-card group relative h-full border border-[#d8e3ee] bg-white p-7 text-center transition-colors duration-300 hover:border-[#17458F] sm:p-8">
                        <div
                          className="mb-6 text-[48px] font-extrabold leading-none text-[rgba(27,58,140,0.12)] transition-colors duration-500 group-hover:text-[#17458F]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {item.step}
                        </div>
                        <h3 className="mb-3 text-[18px] font-bold text-[#1A1A2E]">{item.title}</h3>
                        <p className="text-[15px] leading-[1.75] text-[#5C6475]">{item.desc}</p>

                        {i < 3 && <div className="absolute -right-4 top-1/2 z-10 hidden h-[1px] w-8 bg-[#d8e3ee] lg:block" />}
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>

      <section className="py-16 sm:py-20 bg-white" id="partners">
        <div className="container-shell">
          <FadeUp>
            <p className="section-label">CSR Partners</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Sustained support from responsible partners
            </h2>
          </FadeUp>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
            {csrPartners.map((partner) => (
              <FadeUp key={partner.name}>
                <div className="holo-card group border border-[#d8e3ee] bg-white px-4 py-5 text-center">
                  <div
                    className={`h-14 flex items-center justify-center ${
                      partner.name === 'Legrand' ? 'rounded-md group-hover:bg-[#FF0000] transition-colors duration-500' : ''
                    }`}
                  >
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={130}
                      height={52}
                      className={`max-h-12 w-auto object-contain transition duration-500 ${
                        partner.name === 'Legrand'
                          ? 'brightness-0 opacity-60 group-hover:brightness-100 group-hover:opacity-100'
                          : partner.name === 'Century Rayon'
                            ? 'max-h-14 grayscale group-hover:grayscale-0'
                            : 'grayscale group-hover:grayscale-0'
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-sm sm:text-base font-semibold tracking-wide text-[#7C8A97] transition-colors duration-300 group-hover:text-[#17458F]">
                    {partner.name}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: '#F6F9FC' }} id="camps">
        <div className="container-shell grid md:grid-cols-[0.95fr_1.05fr] gap-8 sm:gap-10 items-start">
          <FadeUp>
            <p className="section-label">Camps and Outreach</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Regular camps expand access to prosthetic care
            </h2>
            <p className="mt-4 text-[#5A5A5A] leading-[1.8]">
              Outreach camps are organized with local institutions and CSR teams to identify beneficiaries, assess mobility needs,
              and deliver prosthetic fitment at scale.
            </p>
            <Link href="/camps" className="btn-primary mt-6">
              View Camp Schedule <Calendar size={16} />
            </Link>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="space-y-4">
              {[
                'Community screening and mobility assessment',
                'On-site measurement and prosthetic fitting',
                'Post-fitment gait training and follow-up',
              ].map((item) => (
                <div key={item} className="border-l-2 pl-4 py-1.5" style={{ borderColor: '#2CA7B0' }}>
                  <p className="text-[#1A1A1A] font-medium">{item}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: '#17458F' }} id="donate">
        <div className="container-shell text-white">
          <FadeUp>
            <div className="h-[2px] w-20 mb-6" style={{ background: '#A31A6F' }} />
            <h2 className="text-[2rem] sm:text-[2.7rem] leading-tight font-bold font-[var(--font-jakarta)] max-w-[46rem]">
              Helping someone walk again changes a life forever.
            </h2>
            <p className="mt-4 max-w-[40rem] text-white/85 leading-[1.75]">
              Your contribution supports prosthetic fitment, camp operations, and rehabilitation assistance. Donate securely through
              Razorpay and directly strengthen someone&apos;s independence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/donate" className="btn-donate" aria-label="Donate">
                <HandHeart size={18} /> Donate
              </Link>
              <Link href="/donate" className="btn-secondary border-white text-white bg-transparent hover:bg-white hover:text-[#17458F]">
                See donation impact
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white" id="location">
        <div className="container-shell grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <FadeUp>
            <p className="section-label">Location</p>
            <h2 className="mt-4 text-[1.9rem] sm:text-[2.4rem] leading-tight font-bold text-[#17458F] font-[var(--font-jakarta)]">
              Visit the Rotary Divyang Center
            </h2>
            <p className="mt-4 text-[#5A5A5A] leading-[1.8]">
              Rotary Divyang Center, Kalyan, Thane, Maharashtra. Reach out to schedule prosthetic assessment, follow-up, or camp
              collaboration.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-[#1A1A1A] font-medium">
              <MapPin size={16} color="#2CA7B0" /> Rotary Divyang Center<br />
              Sabnis Bungalow, Sahajanand Chowk,<br />
              Opp. Katkar Hospital, Tilak Chowk,<br />
              Kalyan, Maharashtra 421301, India
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div>
              <div className="overflow-hidden border border-[#d8e3ee] bg-[#edf3f8] min-h-[300px] sm:min-h-[380px]">
                <iframe
                  title="Rotary Divyang Center location"
                  src="https://www.google.com/maps?q=Rotary+Divyang+Center,+64VH%2BCG+Kalyan,+Maharashtra&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Rotary+Divyang+Center,+64VH%2BCG+Kalyan,+Maharashtra"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Get Directions
                </a>
                <a
                  href="https://www.google.com/maps/place/Rotary+Divyang+Center/@19.2436222,73.1288657,17z/data=!3m1!4b1!4m6!3m5!1s0x3be795db254325bd:0x1aed09bf8c056b91!8m2!3d19.2436222!4d73.1288657!16s%2Fg%2F11fn0jh5fz?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
