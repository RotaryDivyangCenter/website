import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Donate',
  description:
    'Support Rotary Divyang Center through secure donations and help provide free prosthetics and orthotics support to people in need.',
  path: '/donate',
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
