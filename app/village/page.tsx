import { Metadata } from 'next';
import VillagePage from '@/components/sections/VillagePage';

export const metadata: Metadata = {
  title: "Le Village",
  description: "Découvrez le Village du Barb'n'Rock Festival : stands, artisans, tattoo, food trucks et bières artisanales. L'esprit punk et metal dans ton assiette !",
  openGraph: {
    title: "Le Village | Barb'n'Rock Festival 2026",
    description: "Stands, artisans, tattoo, food trucks et bières artisanales. L'esprit punk et metal dans ton assiette !",
  },
  alternates: {
    canonical: '/village',
  },
};

export default function Village() {
  return <VillagePage />;
}
