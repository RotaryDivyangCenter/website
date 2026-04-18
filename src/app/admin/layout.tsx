import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
