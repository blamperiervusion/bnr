import { Metadata } from 'next';
import PartnersPage from '@/components/sections/PartnersPage';

export const metadata: Metadata = {
  title: "Nos Partenaires",
  description: "Découvrez les partenaires qui soutiennent le Barb'n'Rock Festival et rendent cet événement possible.",
  openGraph: {
    title: "Nos Partenaires | Barb'n'Rock Festival 2026",
    description: "Les partenaires qui soutiennent le festival et rendent cet événement possible.",
  },
  alternates: {
    canonical: '/partenaires',
  },
};

export default function Partenaires() {
  return <PartnersPage />;
}
