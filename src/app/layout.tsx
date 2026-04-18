import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Rotary Divyang Center",
  description:
    "Rotary Divyang Center provides free artificial limbs (prosthetics and orthotics) to people with disabilities across India. Run by Rotary Club of New Kalyan, Dist. 3142. Giving Hope, Giving Smile.",
  keywords: [
    "prosthetics",
    "orthotics",
    "free artificial limbs",
    "Rotary Divyang Center",
    "Rotary Club New Kalyan",
    "disability",
    "India outreach",
  ],
  openGraph: {
    title: "Rotary Divyang Center — Giving Hope, Giving Smile",
    description:
      "Free prosthetic limbs for people with disabilities across India. An initiative of Rotary Club of New Kalyan.",
    type: "website",
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
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
