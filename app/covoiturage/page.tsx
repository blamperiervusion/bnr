import prisma from '@/lib/prisma';
import CarpoolClient from './CarpoolClient';
import HeroSection from './HeroSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Covoiturage — Barb'n'Rock 2026",
  description: "Proposez ou cherchez un covoiturage pour le Barb'n'Rock Festival 2026 à Crèvecœur-le-Grand.",
};

async function getVisibleOffers() {
  return prisma.carpoolOffer.findMany({
    where: { status: 'VISIBLE' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      name: true,
      city: true,
      lat: true,
      lng: true,
      seats: true,
      days: true,
      message: true,
      createdAt: true,
    },
  });
}

export default async function CovoituragePage() {
  const offers = await getVisibleOffers();
  const serialized = offers.map(o => ({ ...o, createdAt: o.createdAt.toISOString() }));

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <CarpoolClient initialOffers={serialized} />
      </div>
    </main>
  );
}
