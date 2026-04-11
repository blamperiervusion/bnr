import { Metadata } from 'next';
import ProgrammeDay from '@/components/sections/ProgrammeDay';
import { getProgrammeByDayFromDB, getAllDaysFromDB } from '@/lib/data/programme-db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

export default async function VendrediPage() {
  const [dayData, allDays] = await Promise.all([
    getProgrammeByDayFromDB('vendredi'),
    getAllDaysFromDB(),
  ]);
  
  if (!dayData) {
    notFound();
  }

  return <ProgrammeDay dayData={dayData} allDays={allDays} />;
}
