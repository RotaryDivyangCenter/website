'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { HandHeart, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/partners', label: 'Partners' },
  { href: '/camps', label: 'Camps' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-3 focus:left-3 focus:z-[999] focus:bg-white focus:text-[#17458F] focus:rounded-md"
      >
        Skip to content
      </a>

      <nav
        className="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300"
        style={{
          background: '#ffffff',
          borderColor: scrolled ? '#d8e3ee' : 'rgba(216,227,238,0.65)',
          boxShadow: scrolled ? '0 10px 32px rgba(17, 51, 109, 0.08)' : 'none',
        }}
      >
        <div className="container-shell h-24 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0" aria-label="Rotary Divyang Center home">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full border border-[#d8e3ee]">
              <Image
                src="/logo-circular.png"
                alt="Rotary Divyang Center logo"
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
                priority
              />
            </div>
            <div className="block min-w-0">
              <p className="text-[clamp(0.76rem,3.35vw,1.02rem)] sm:text-[1.18rem] font-bold leading-tight text-[#17458F] whitespace-nowrap">
                Rotary Divyang Center
              </p>
              <p className="text-[clamp(0.60rem,2.6vw,0.82rem)] sm:text-[0.80rem] text-[#7C8A97] whitespace-nowrap">Giving Hope, Giving Smile</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group rounded-md px-2.5 py-2.5 text-[1.02rem] font-semibold transition-all duration-200 ${
                  isActive(link.href) ? 'text-[#17458F]' : 'text-[#1A1A1A] hover:text-[#17458F]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-2.5 right-2.5 bottom-1 h-[2px] origin-left bg-[#17458F] transition-transform duration-250 ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href="https://rcnewkalyan.rotaryindia.org"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Rotary Club of New Kalyan website"
              className="inline-block sm:hidden transition-transform active:scale-95"
            >
              <span className="relative block h-[clamp(2.85rem,11vw,4.9rem)] w-[clamp(5.6rem,27vw,9.8rem)] min-h-[2.85rem] min-w-[5.6rem]">
                <Image
                  src="/rcnewkalyan_no_bg.png"
                  alt="Rotary Club of New Kalyan logo"
                  fill
                  sizes="(max-width: 380px) 96px, 128px"
                  loading="eager"
                  className="object-contain"
                />
              </span>
            </a>
            <a
              href="https://rcnewkalyan.rotaryindia.org"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Rotary Club of New Kalyan website"
              className="hidden xl:inline-block xl:-ml-5"
            >
              <span className="relative block h-16 w-46">
                <Image
                  src="/rcnewkalyan_no_bg.png"
                  alt="Rotary Club of New Kalyan logo"
                  fill
                  sizes="112px"
                  loading="eager"
                  className="object-contain"
                />
              </span>
            </a>
            <div className="hidden lg:block">
              <Link href="/donate" className="btn-donate !text-[0.95rem] !px-6 !py-3" aria-label="Donate now">
                <HandHeart size={18} /> Donate
              </Link>
            </div>
            <button
              type="button"
              className="rounded-md border border-[#d8e3ee] p-2.5 lg:hidden transition-all active:scale-95 active:bg-[#edf3f8]"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} color="#17458F" /> : <Menu size={22} color="#17458F" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="border-t lg:hidden"
              style={{ borderColor: '#d8e3ee', background: '#fff' }}
            >
              <div className="container-shell py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3.5 py-3 text-[1rem] font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-[#edf3f8] text-[#17458F] active:bg-[#dde9f3]'
                        : 'text-[#1A1A1A] hover:bg-[#edf3f8] active:bg-[#edf3f8] active:text-[#17458F]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/donate" onClick={() => setOpen(false)} className="btn-donate mt-2 !text-[1rem] transition-transform active:scale-[0.98]">
                  <HandHeart size={18} /> Donate Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="h-24" />
    </>
  );
}
