import { Metadata } from 'next';
import ProgrammeDay from '@/components/sections/ProgrammeDay';
import { getProgrammeByDay } from '@/lib/data/programme';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Programme Dimanche 28 Juin",
  description: "Découvrez la programmation du dimanche 28 juin 2026 au Barb'n'Rock Festival. Tête d'affiche : Mainkind ! Avec Howlite, Udap, Devon Duxe et Saint Rock Station.",
  openGraph: {
    title: "Programme Dimanche 28 Juin | Barb'n'Rock Festival 2026",
    description: "Jour de repos avec Mainkind en tête d'affiche, Howlite, Udap, Devon Duxe et Saint Rock Station. Rock et détente !",
  },
  alternates: {
    canonical: '/programme/dimanche',
  },
};

export default function DimanchePage() {
  const dayData = getProgrammeByDay('dimanche');
  
  if (!dayData) {
    notFound();
  }

  return <ProgrammeDay dayData={dayData} />;
}
