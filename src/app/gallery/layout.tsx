import type { Metadata } from 'next';
import { pageMetadata } from '@/app/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Browse photos from camps, prosthetic fitment activities, and community impact initiatives by Rotary Divyang Center.',
  path: '/gallery',
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
