import type { Metadata } from 'next';
import CjdOffrePriveIframe from '@/components/CjdOffrePriveIframe';

export const metadata: Metadata = {
  title: 'Offre mécène CJD Amiens (accès privé)',
  description:
    "Offre mécène réservée au CJD Amiens — page non référencée dans le menu du site.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/p/cjd-mecene-26',
  },
};

/**
 * Page « secrète » : non listée dans la navbar.
 * URL à partager : /p/cjd-mecene-26
 * Le HTML statique et les visuels sont servis depuis /offre-privee/
 */
export default function CjdMecenePrivePage() {
  return (
    <div className="bg-white min-h-screen">
      <CjdOffrePriveIframe />
    </div>
  );
}
