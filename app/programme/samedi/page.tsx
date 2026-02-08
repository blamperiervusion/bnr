import { Metadata } from 'next';
import ProgrammeDay from '@/components/sections/ProgrammeDay';
import { getProgrammeByDay } from '@/lib/data/programme';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Programme Samedi 27 Juin",
  description: "Découvrez la programmation du samedi 27 juin 2026 au Barb'n'Rock Festival. Avec Shaârghot, Krav Boca, Loudblast, Akiavel, Dirty Fonzy, Breakout et le vainqueur du tremplin !",
  openGraph: {
    title: "Programme Samedi 27 Juin | Barb'n'Rock Festival 2026",
    description: "Shaârghot, Krav Boca, Loudblast, Akiavel, Dirty Fonzy, Breakout ! 7 groupes pour une journée de chaos intense.",
  },
  alternates: {
    canonical: '/programme/samedi',
  },
};

export default function SamediPage() {
  const dayData = getProgrammeByDay('samedi');
  
  if (!dayData) {
    notFound();
  }

  return <ProgrammeDay dayData={dayData} />;
}
