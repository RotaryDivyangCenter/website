import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Camps',
  description:
    'View Rotary Divyang Center outreach camps, camp locations, and beneficiary impact across India.',
  path: '/camps',
});

export default function CampsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
