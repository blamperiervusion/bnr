'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NoiseOverlay } from '@/components/ui';
import Loader from '@/components/Loader';
import AnnouncementBanner from '@/components/AnnouncementBanner';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [bannerVisible, setBannerVisible] = useState(true);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Loader />
      <NoiseOverlay />
      <AnnouncementBanner onClose={() => setBannerVisible(false)} />
      <Navbar bannerVisible={bannerVisible} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
