import type { Metadata } from 'next';

export const SITE_URL = 'https://rotarydivyangcenter.org';
export const SITE_NAME = 'Rotary Divyang Center';
export const DEFAULT_OG_IMAGE = '/logo.jpg';

type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function pageMetadata({ title, description, path = '/' }: SeoInput): Metadata {
  const canonical = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
          width: 1200,
          height: 630,
          alt: 'Rotary Divyang Center',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    },
  };
}