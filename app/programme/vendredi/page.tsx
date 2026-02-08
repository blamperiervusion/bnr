import { Metadata } from 'next';
import ProgrammeDay from '@/components/sections/ProgrammeDay';
import { getProgrammeByDay } from '@/lib/data/programme';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Programme Vendredi 26 Juin",
  description: "Découvrez la programmation du vendredi 26 juin 2026 au Barb'n'Rock Festival. Avec Cachemire, Psykup, Kami No Ikari, Barabbas et Black Hazard !",
  openGraph: {
    title: "Programme Vendredi 26 Juin | Barb'n'Rock Festival 2026",
    description: "Cachemire, Psykup, Kami No Ikari, Barabbas et Black Hazard ! 5 groupes pour une soirée de chaos.",
  },
  alternates: {
    canonical: '/programme/vendredi',
  },
};

export default function VendrediPage() {
  const dayData = getProgrammeByDay('vendredi');
  
  if (!dayData) {
    notFound();
  }

  return <ProgrammeDay dayData={dayData} />;
}
