'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarpoolBanner from '@/components/CarpoolBanner';
import { NoiseOverlay } from '@/components/ui';
import Loader from '@/components/Loader';
import WelcomeLetterModal from '@/components/WelcomeLetterModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin     = pathname?.startsWith('/admin');
  const isPresse    = pathname?.startsWith('/presse');
  const isBenevoles = pathname?.startsWith('/benevoles/reunion');

  const [bannerVisible, setBannerVisible] = useState(false);

  const handleBannerVisibility = useCallback((visible: boolean) => {
    setBannerVisible(visible);
    document.documentElement.style.setProperty('--banner-h', visible ? '36px' : '0px');
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', '0px');
  }, []);

  if (isAdmin || isPresse || isBenevoles) {
    return <>{children}</>;
  }

  return (
    <>
      <Loader />
      <NoiseOverlay />
      <WelcomeLetterModal />
      <CarpoolBanner onVisibilityChange={handleBannerVisibility} />
      <Navbar bannerVisible={bannerVisible} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
