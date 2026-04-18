import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partners',
  description:
    'Meet the CSR partners supporting Rotary Divyang Center and helping us deliver free prosthetics and orthotics support to beneficiaries.',
  path: '/partners',
});

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
