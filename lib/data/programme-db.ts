import prisma from '@/lib/prisma';
import type { DayProgrammeData, BandData } from '@/components/sections/ProgrammeDay';

// Fallback config in case DB is not seeded
const defaultDayConfig: Record<string, { day: string; date: string; openingTime: string }> = {
  vendredi: { day: 'Vendredi', date: '26 Juin 2026', openingTime: '18h00' },
  samedi: { day: 'Samedi', date: '27 Juin 2026', openingTime: '13h00' },
  dimanche: { day: 'Dimanche', date: '28 Juin 2026', openingTime: '14h00' },
};

export const allDays = [
  { day: 'Vendredi', slug: 'vendredi' },
  { day: 'Samedi', slug: 'samedi' },
  { day: 'Dimanche', slug: 'dimanche' },
];

function formatFestivalDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(/^\d/, (match) => match);
}

export async function getProgrammeByDayFromDB(slug: string): Promise<DayProgrammeData | null> {
  // Try to get day config from database
  const festivalDay = await prisma.festivalDay.findUnique({
    where: { slug },
  });

  // Use database config or fallback to default
  const config = festivalDay
    ? {
        day: festivalDay.name,
        date: formatFestivalDate(festivalDay.date),
        openingTime: festivalDay.openingTime,
      }
    : defaultDayConfig[slug];

  if (!config) return null;

  const bands = await prisma.band.findMany({
    where: {
      day: slug,
      isVisible: true,
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' },
    ],
  });

  const formattedBands: BandData[] = bands.map((band) => ({
    id: band.id,
    name: band.name,
    order: band.order,
    time: band.time,
    description: band.description,
    imageUrl: band.imageUrl,
    videoUrl: band.videoUrl,
    socialLinks: {
      website: band.website,
      facebook: band.facebook,
      instagram: band.instagram,
      spotify: band.spotify,
    },
  }));

  return {
    day: config.day,
    date: config.date,
    slug,
    openingTime: config.openingTime,
    bands: formattedBands,
  };
}

export async function getAllBandsFromDB(): Promise<(BandData & { daySlug: string; dayName: string })[]> {
  // Get festival days from DB for mapping
  const festivalDays = await prisma.festivalDay.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
  const dayMap = new Map(festivalDays.map(d => [d.slug, d.name]));

  const bands = await prisma.band.findMany({
    where: {
      isVisible: true,
    },
    orderBy: [
      { day: 'asc' },
      { order: 'asc' },
    ],
  });

  return bands.map((band) => {
    const dayName = dayMap.get(band.day) || defaultDayConfig[band.day]?.day || band.day;
    return {
      id: band.id,
      name: band.name,
      order: band.order,
      time: band.time,
      description: band.description,
      imageUrl: band.imageUrl,
      videoUrl: band.videoUrl,
      socialLinks: {
        website: band.website,
        facebook: band.facebook,
        instagram: band.instagram,
        spotify: band.spotify,
      },
      daySlug: band.day,
      dayName,
    };
  });
}

export async function getAllDaysFromDB(): Promise<{ day: string; slug: string }[]> {
  const festivalDays = await prisma.festivalDay.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
    select: { name: true, slug: true },
  });

  if (festivalDays.length > 0) {
    return festivalDays.map(d => ({ day: d.name, slug: d.slug }));
  }

  return allDays;
}
