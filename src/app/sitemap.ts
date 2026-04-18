import type { MetadataRoute } from 'next';
import { SITE_URL } from './seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    '/',
    '/about',
    '/services',
    '/partners',
    '/camps',
    '/gallery',
    '/team',
    '/donate',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
