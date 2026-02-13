import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://barnrock-festival.fr'),
  title: {
    default: "Barb'n'Rock Festival 2026 | Crèvecœur-le-Grand",
    template: "%s | Barb'n'Rock Festival 2026",
  },
  description: "Barb'n'Rock Festival - Bearded Rock Experience. 2 jours de chaos, 1 jour de repos. Punk et Metal sans compromis du 26 au 28 juin 2026 à Crèvecœur-le-Grand (Oise). Billetterie, programmation et chaos organisé.",
  keywords: ["festival", "punk", "metal", "hardcore", "musique", "concert", "barbnrock", "2026", "crèvecoeur le grand", "oise", "picardie"],
  authors: [{ name: "Barb'n'Rock Festival" }],
  creator: "Barb'n'Rock Festival",
  publisher: "Barb'n'Rock Festival",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Barb'n'Rock",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Barb'n'Rock Festival 2026 | Crèvecœur-le-Grand",
    description: "2 jours de chaos, 1 jour de repos. Punk et Metal sans compromis. 26-28 juin 2026 à Crèvecœur-le-Grand.",
    type: "website",
    locale: "fr_FR",
    url: 'https://barnrock-festival.fr',
    siteName: "Barb'n'Rock Festival",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Barb'n'Rock Festival 2026 - Punk et Metal à Crèvecœur-le-Grand",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Barb'n'Rock Festival 2026",
    description: "2 jours de chaos, 1 jour de repos. Punk et Metal sans compromis. 26-28 juin 2026.",
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} font-body antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen`}
      >
        <JsonLd data={organizationSchema} />
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
