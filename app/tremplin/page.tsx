import { Metadata } from 'next';
import TremplinPage from '@/components/sections/TremplinPage';

export const metadata: Metadata = {
  title: "Tremplin Barb'n'Rock 2026",
  description: "Participe au Tremplin Barb'n'Rock 2026 ! Concours musical ouvert aux groupes émergents de rock, metal et punk. Le groupe gagnant jouera au festival.",
  openGraph: {
    title: "Tremplin Barb'n'Rock 2026 | Concours Musical",
    description: "Participe au Tremplin ! Concours ouvert aux groupes émergents. Le gagnant jouera au festival Barb'n'Rock 2026.",
  },
  alternates: {
    canonical: '/tremplin',
  },
};

export default function Tremplin() {
  return <TremplinPage />;
}
