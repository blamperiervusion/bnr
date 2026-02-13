import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import VolunteerForm from './VolunteerForm';

const missionLabels: Record<string, string> = {
  accueil: 'Accueil & Billetterie',
  bar: 'Bars & Restauration',
  securite: 'Sécurité & Prévention',
  technique: 'Technique & Logistique',
  eco: 'Éco-équipe',
  animation: 'Animation',
};

const dispoLabels: Record<string, string> = {
  vendredi: 'Vendredi 26 juin',
  samedi: 'Samedi 27 juin',
  dimanche: 'Dimanche 28 juin',
  montage: 'Montage (avant festival)',
  demontage: 'Démontage (après festival)',
};

async function getVolunteer(id: string) {
  return prisma.volunteer.findUnique({
    where: { id },
  });
}

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const volunteer = await getVolunteer(id);

  if (!volunteer) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/benevoles"
          className="text-gray-400 hover:text-white transition-colors"
        >
          &larr; Retour
        </Link>
        <h1 className="text-3xl font-bold text-white">{volunteer.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            {/* Profile image */}
            <div className="flex justify-center mb-6">
              {volunteer.profileImage ? (
                <Image
                  src={volunteer.profileImage}
                  alt={volunteer.name}
                  width={150}
                  height={150}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#333] flex items-center justify-center text-4xl text-white font-bold">
                  {volunteer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-white">
                  <a href={`mailto:${volunteer.email}`} className="hover:text-[#e53e3e]">
                    {volunteer.email}
                  </a>
                </p>
              </div>
              {volunteer.phone && (
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p className="text-white">
                    <a href={`tel:${volunteer.phone}`} className="hover:text-[#e53e3e]">
                      {volunteer.phone}
                    </a>
                  </p>
                </div>
              )}
              {volunteer.age && (
                <div>
                  <label className="text-sm text-gray-500">Âge</label>
                  <p className="text-white">{volunteer.age} ans</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Inscrit le</label>
                <p className="text-white">
                  {new Date(volunteer.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Disponibilités */}
            <div className="mt-6">
              <label className="text-sm text-gray-500 block mb-2">Disponibilités</label>
              <div className="flex flex-wrap gap-2">
                {volunteer.disponibilites.map((dispo) => (
                  <span
                    key={dispo}
                    className="px-2 py-1 bg-[#38a169]/20 text-[#38a169] text-xs rounded"
                  >
                    {dispoLabels[dispo] || dispo}
                  </span>
                ))}
              </div>
            </div>

            {/* Missions souhaitées */}
            <div className="mt-6">
              <label className="text-sm text-gray-500 block mb-2">Missions souhaitées</label>
              <div className="flex flex-wrap gap-2">
                {volunteer.missions.map((mission) => (
                  <span
                    key={mission}
                    className="px-2 py-1 bg-[#00E5CC]/20 text-[#00E5CC] text-xs rounded"
                  >
                    {missionLabels[mission] || mission}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {volunteer.experience && (
              <div className="mt-6">
                <label className="text-sm text-gray-500 block mb-2">Expérience</label>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {volunteer.experience}
                </p>
              </div>
            )}

            {/* Message */}
            {volunteer.message && (
              <div className="mt-6">
                <label className="text-sm text-gray-500 block mb-2">Message</label>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {volunteer.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <VolunteerForm volunteer={volunteer} />
        </div>
      </div>
    </div>
  );
}
