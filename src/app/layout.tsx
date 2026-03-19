import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    "Rotary Divyang Center provides free artificial limbs (prosthetics & orthotics) to people with disabilities. Run by Rotary Club of New Kalyan, Dist. 3142. Giving Hope, Giving Smile.",
  keywords: [
    "prosthetics",
    "orthotics",
    "free artificial limbs",
    "Rotary Divyang Center",
    "Rotary Club New Kalyan",
    "disability",
    "Kalyan Maharashtra",
  ],
  openGraph: {
    title: "Rotary Divyang Center — Giving Hope, Giving Smile",
    description:
      "Free prosthetic limbs for people with disabilities in Kalyan, Maharashtra. An initiative of Rotary Club of New Kalyan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-[var(--font-inter)]`}>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
