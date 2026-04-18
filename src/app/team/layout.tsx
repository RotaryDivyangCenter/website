import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Team',
  description:
    'Meet the committee members and LN4 ambassadors of Rotary Divyang Center who lead prosthetics and orthotics outreach initiatives.',
  path: '/team',
});

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
