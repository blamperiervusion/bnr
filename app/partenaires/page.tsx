import { Metadata } from 'next';
import PartnersPage from '@/components/sections/PartnersPage';
import prisma from '@/lib/prisma';

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

async function getValidatedPartners() {
  const partners = await prisma.partner.findMany({
    where: {
      status: 'VALIDATED',
    },
    select: {
      id: true,
      company: true,
      logo: true,
      website: true,
      tier: true,
    },
    orderBy: [
      { donationAmount: 'desc' },
      { company: 'asc' },
    ],
  });

  return partners;
}

export default async function Partenaires() {
  const partners = await getValidatedPartners();
  
  return <PartnersPage partners={partners} />;
}
