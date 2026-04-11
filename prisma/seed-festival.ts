import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding festival days...');

  const festivalDays = [
    {
      slug: 'vendredi',
      name: 'Vendredi',
      date: new Date('2026-06-19'),
      openingTime: '18h00',
      closingTime: '02h00',
      order: 0,
    },
    {
      slug: 'samedi',
      name: 'Samedi',
      date: new Date('2026-06-20'),
      openingTime: '14h00',
      closingTime: '03h00',
      order: 1,
    },
    {
      slug: 'dimanche',
      name: 'Dimanche',
      date: new Date('2026-06-21'),
      openingTime: '12h00',
      closingTime: '00h00',
      order: 2,
    },
  ];

  for (const day of festivalDays) {
    await prisma.festivalDay.upsert({
      where: { slug: day.slug },
      update: {
        name: day.name,
        date: day.date,
        openingTime: day.openingTime,
        closingTime: day.closingTime,
        order: day.order,
      },
      create: day,
    });
    console.log(`Created/updated day: ${day.name}`);
  }

  console.log('Festival days seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
