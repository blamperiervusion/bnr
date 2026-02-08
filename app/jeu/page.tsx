import { Metadata } from 'next';
import GamePage from '@/components/game/GamePage';

export const metadata: Metadata = {
  title: "Mosh Pit Survivor",
  description: "Joue au mini-jeu Mosh Pit Survivor et prouve que tu as l'âme d'un vrai rockeur !",
  openGraph: {
    title: "Mosh Pit Survivor | Barb'n'Rock Festival 2026",
    description: "Joue au mini-jeu et prouve que tu as l'âme d'un vrai rockeur !",
  },
  alternates: {
    canonical: '/jeu',
  },
};

export default function Jeu() {
  return <GamePage />;
}
