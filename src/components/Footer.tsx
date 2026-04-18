import Image from 'next/image';
import Link from 'next/link';
import { Globe, HandHeart, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ background: '#f6f9fc', borderColor: '#d8e3ee' }}>
      <div className="container-shell py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-[#d8e3ee]">
              <Image src="/logo-circular.png" alt="Rotary Divyang Center" fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-[#17458F] font-[var(--font-jakarta)] text-[0.98rem]">Rotary Divyang Center</p>
              <p className="text-[0.80rem] text-[#7C8A97]">Giving Hope, Giving Smile</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#5A5A5A]">
            Restoring mobility and dignity through free prosthetics and orthotics support, camps, and long-term rehabilitation assistance.
          </p>
          <a
            href="https://rcnewkalyan.rotaryindia.org"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Rotary Club of New Kalyan website"
            className="mt-5 inline-block"
          >
            <span className="relative block h-14 w-44">
              <Image
                src="/rcnewkalyan_no_bg.png"
                alt="Rotary Club of New Kalyan logo"
                fill
                sizes="176px"
                loading="eager"
                className="object-contain"
              />
            </span>
          </a>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm uppercase tracking-[0.14em] font-semibold mb-4 text-[#17458F]">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-[#5A5A5A]">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/services', 'Services'],
              ['/partners', 'Partners'],
              ['/gallery', 'Gallery'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-[#17458F] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm uppercase tracking-[0.14em] font-semibold mb-4 text-[#17458F]">Contact</h3>
          <ul className="space-y-3 text-sm text-[#5A5A5A]">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 text-[#2CA7B0]" />
              <span>Kalyan, Thane, Maharashtra, India</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 text-[#2CA7B0]" />
              <a href="tel:+919820562796" className="hover:text-[#17458F]">
                +91 9820562796
              </a>
              <a href="tel:+919819323947" className="hover:text-[#17458F]">
                +91 9819323947
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 text-[#2CA7B0]" />
              <a href="mailto:contact@rotarydivyangcenter.org" className="hover:text-[#17458F]">
                contact@rotarydivyangcenter.org
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe size={16} className="mt-0.5 text-[#2CA7B0]" />
              <a href="https://rotarydivyangcenter.org" target="_blank" rel="noreferrer" className="hover:text-[#17458F]">
                rotarydivyangcenter.org
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm uppercase tracking-[0.14em] font-semibold mb-4 text-[#17458F]">CSR Partners</h3>
          <ul className="space-y-2 text-sm text-[#5A5A5A]">
            <li>Acutaas</li>
            <li>Atos</li>
            <li>Century Rayon</li>
            <li>Legrand</li>
          </ul>
          <Link href="/donate" className="btn-primary mt-5">
            <HandHeart size={18} /> Support With Donation
          </Link>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: '#d8e3ee' }}>
        <div className="container-shell py-4 text-[0.82rem] text-[#7C8A97] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {currentYear} Rotary Divyang Center. All rights reserved.</p>
          <p>Built for accessibility and community impact.</p>
        </div>
      </div>
    </footer>
  );
}
