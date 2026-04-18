import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_URL } from './seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'RDC',
    description: 'Free prosthetics and orthotics support by Rotary Divyang Center.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f6f9fc',
    theme_color: '#17458F',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    id: SITE_URL,
  };
}
