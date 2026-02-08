import { Metadata } from 'next';
import BenevolesPag from '@/components/sections/BenevolesPage';

export const metadata: Metadata = {
  title: "Devenir Bénévole",
  description: "Rejoins l'équipe de bénévoles du Barb'n'Rock Festival ! Vis le festival de l'intérieur et fais partie de l'aventure.",
  openGraph: {
    title: "Devenir Bénévole | Barb'n'Rock Festival 2026",
    description: "Rejoins l'équipe de bénévoles ! Vis le festival de l'intérieur et fais partie de l'aventure.",
  },
  alternates: {
    canonical: '/benevoles',
  },
};

export default function Benevoles() {
  return <BenevolesPag />;
}
