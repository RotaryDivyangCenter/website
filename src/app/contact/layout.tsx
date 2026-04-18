import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact Rotary Divyang Center for prosthetics and orthotics support, camp information, or partnership inquiries.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
