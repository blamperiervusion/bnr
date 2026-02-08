import { Metadata } from 'next';
import BoutiquePage from '@/components/sections/BoutiquePage';

export const metadata: Metadata = {
  title: "Boutique Officielle",
  description: "Retrouvez tous les produits officiels du Barb'n'Rock Festival : t-shirts, hoodies, accessoires et plus encore !",
  openGraph: {
    title: "Boutique Officielle | Barb'n'Rock Festival 2026",
    description: "Tous les produits officiels du festival : t-shirts, hoodies, accessoires et plus encore !",
  },
  alternates: {
    canonical: '/boutique',
  },
};

export default function Boutique() {
  return <BoutiquePage />;
}
