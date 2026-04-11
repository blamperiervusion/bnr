import { Hero, BandsGallery, PartnersTeaser, CTASection } from '@/components/sections';
import JsonLd, { festivalSchema } from '@/components/JsonLd';
import prisma from '@/lib/prisma';
import { getAllBandsFromDB } from '@/lib/data/programme-db';

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

export default async function Home() {
  const [partners, bands] = await Promise.all([
    getValidatedPartners(),
    getAllBandsFromDB(),
  ]);
  
  return (
    <>
      <JsonLd data={festivalSchema} />
      <Hero />
      <BandsGallery bands={bands} />
      <CTASection />
      <PartnersTeaser partners={partners} />
    </>
  );
}
