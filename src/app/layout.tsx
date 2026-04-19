import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from './seo';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rotary Divyang Center',
    template: '%s | Rotary Divyang Center',
  },
  description:
    'Rotary Divyang Center provides free prosthetics and orthotics support to people with disabilities across India. Run by Rotary Club of New Kalyan, Dist. 3142. Giving Hope, Giving Smile.',
  keywords: [
    "prosthetics",
    "orthotics",
    "free artificial limbs",
    "Rotary Divyang Center",
    "Rotary Club New Kalyan",
    "disability",
    "India outreach",
    'Jaipur Foot',
    'Divyang support',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Rotary Divyang Center | Giving Hope, Giving Smile',
    description:
      'Free prosthetics and orthotics support for people with disabilities across India. An initiative of Rotary Club of New Kalyan.',
    url: SITE_URL,
    siteName: 'Rotary Divyang Center',
    locale: 'en_IN',
    type: "website",
    images: [
      {
        url: `${SITE_URL}/4.jpg`,
        width: 1200,
        height: 630,
        alt: 'Rotary Divyang Center prosthetic support at the center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotary Divyang Center | Giving Hope, Giving Smile',
    description:
      'Free prosthetics and orthotics support for people with disabilities across India.',
    images: [`${SITE_URL}/4.jpg`],
  },
  other: {
    'og:logo': `${SITE_URL}/logo.jpg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-[var(--font-inter)]`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['Organization', 'NonProfitOrganization', 'MedicalOrganization'],
              name: 'Rotary Divyang Center',
              alternateName: 'RDC',
              url: SITE_URL,
              logo: `${SITE_URL}/logo-circular.png`,
              image: `${SITE_URL}/4.jpg`,
              description:
                'Free prosthetics and orthotics support for people with disabilities across India. An initiative of Rotary Club of New Kalyan, Dist. 3142.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Sabnis Bungalow, Sahajanand Chowk, Opp. Katkar Hospital, Tilak Chowk',
                addressLocality: 'Kalyan',
                addressRegion: 'Maharashtra',
                postalCode: '421301',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 19.2436222,
                longitude: 73.1288657,
              },
              telephone: '+919820562796',
              email: 'contact@rotarydivyangcenter.org',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '10:00',
                  closes: '13:00',
                },
              ],
              sameAs: ['https://rcnewkalyan.rotaryindia.org'],
              parentOrganization: {
                '@type': 'Organization',
                name: 'Rotary Club of New Kalyan',
                url: 'https://rcnewkalyan.rotaryindia.org',
              },
              foundingDate: '2019',
              areaServed: {
                '@type': 'Country',
                name: 'India',
              },
              makesOffer: {
                '@type': 'Offer',
                name: 'Free Prosthetic and Orthotic Support',
                price: '0',
                priceCurrency: 'INR',
                description: 'Free prosthetic limbs and orthotics for persons with disabilities.',
              },
            }),
          }}
        />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
