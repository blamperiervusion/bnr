import { Metadata } from 'next';
import VillagePage from '@/components/sections/VillagePage';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Le Village",
  description: "Découvrez le Village du Barb'n'Rock Festival : stands, artisans, tattoo, food trucks et bières belges. L'esprit punk et metal dans ton assiette !",
  openGraph: {
    title: "Le Village | Barb'n'Rock Festival 2026",
    description: "Stands, artisans, tattoo, food trucks et bières belges. L'esprit punk et metal dans ton assiette !",
  },
  alternates: {
    canonical: '/village',
  },
};

async function getVisibleStands() {
  return prisma.villageStand.findMany({
    where: {
      isVisible: true,
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' },
    ],
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      logo: true,
      website: true,
      instagram: true,
      facebook: true,
    },
  });
}

export default async function Village() {
  const stands = await getVisibleStands();
  
  return <VillagePage stands={stands} />;
}
