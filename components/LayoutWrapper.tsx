'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { NoiseOverlay } from '@/components/ui';
import Loader from '@/components/Loader';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [showBanner, setShowBanner] = useState(true);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Loader />
      <NoiseOverlay />
      <AnnouncementBanner onClose={() => setShowBanner(false)} />
      <Navbar bannerVisible={showBanner} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
