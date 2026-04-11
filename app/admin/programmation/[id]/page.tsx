import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import BandForm from '../BandForm';

async function getBand(id: string) {
  return prisma.band.findUnique({
    where: { id },
  });
}

export default async function EditBandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const band = await getBand(id);

  if (!band) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/programmation"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la programmation
        </Link>
        <div className="flex items-center gap-4">
          {band.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={band.imageUrl}
              alt={band.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {band.name}
              {band.isHeadliner && <span className="text-yellow-400">⭐</span>}
            </h1>
            <p className="text-gray-400 mt-1">
              {band.day.charAt(0).toUpperCase() + band.day.slice(1)}
              {band.time && ` • ${band.time}`}
            </p>
          </div>
        </div>
      </div>

      <BandForm band={band} />
    </div>
  );
}
