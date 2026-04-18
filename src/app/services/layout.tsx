import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description:
    'Explore free prosthetics and orthotics services at Rotary Divyang Center, including limbs, hand prosthetics, and hi-tech options based on clinical assessment.',
  path: '/services',
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
