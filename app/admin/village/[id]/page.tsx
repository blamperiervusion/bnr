import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import StandForm from '../StandForm';

async function getStand(id: string) {
  return prisma.villageStand.findUnique({
    where: { id },
  });
}

export default async function EditStandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stand = await getStand(id);

  if (!stand) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/village" className="text-gray-400 hover:text-white transition-colors">
          ← Retour au village
        </Link>
        <div className="flex items-center gap-4 mt-4">
          {stand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={stand.logo} alt={stand.name} className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2" />
          ) : (
            <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center text-2xl">
              🏪
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{stand.name}</h1>
            <p className="text-gray-400">Modifier les informations du stand</p>
          </div>
        </div>
      </div>

      <StandForm stand={stand} />
    </div>
  );
}
