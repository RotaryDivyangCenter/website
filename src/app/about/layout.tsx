import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Learn about Rotary Divyang Center, our mission, vision, journey, and center details in Kalyan serving beneficiaries across India.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}