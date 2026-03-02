import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BandForm from './BandForm';
import FormattedDate from '../../components/FormattedDate';

export const dynamic = 'force-dynamic';

interface BandMember {
  name: string;
  instrument: string;
}

const genreOptions = [
  { value: 'samedi-metal-punk', label: 'Samedi — Metal/Punk' },
  { value: 'dimanche-rock-reprises', label: 'Dimanche — Rock/Reprises' },
];

const getGenreLabel = (value: string) => {
  const option = genreOptions.find(o => o.value === value);
  return option ? option.label : value;
};

async function getBand(id: string) {
  return prisma.tremplinBand.findUnique({
    where: { id },
  });
}

export default async function BandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const band = await getBand(id);

  if (!band) {
    notFound();
  }

  let members: BandMember[] = [];
  try {
    members = JSON.parse(band.members || '[]');
  } catch {
    members = [];
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/tremplin"
          className="text-gray-400 hover:text-white transition-colors"
        >
          &larr; Retour
        </Link>
        <h1 className="text-3xl font-bold text-white">{band.bandName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Photo & basic info */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            {/* Photo */}
            <div className="flex justify-center mb-6">
              {band.photoUrl ? (
                <Image
                  src={band.photoUrl}
                  alt={band.bandName}
                  width={200}
                  height={200}
                  className="w-48 h-48 rounded-lg object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-lg bg-[#333] flex items-center justify-center text-6xl">
                  🎸
                </div>
              )}
            </div>

            {/* Basic info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Genre</label>
                <p className="text-white">
                  <span className="px-2 py-1 bg-[#e53e3e]/20 text-[#e53e3e] text-sm rounded">
                    {getGenreLabel(band.genre)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Ville</label>
                <p className="text-white">{band.city}</p>
              </div>
              {band.formationYear && (
                <div>
                  <label className="text-sm text-gray-500">Année de formation</label>
                  <p className="text-white">{band.formationYear}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Inscrit le</label>
                <p className="text-white">
                  <FormattedDate date={band.createdAt} format="long" />
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">📞 Contact</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nom</label>
                <p className="text-white">{band.contactName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-white">
                  <a href={`mailto:${band.contactEmail}`} className="hover:text-[#e53e3e]">
                    {band.contactEmail}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Téléphone</label>
                <p className="text-white">
                  <a href={`tel:${band.contactPhone}`} className="hover:text-[#e53e3e]">
                    {band.contactPhone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">👥 Membres</h3>
            <div className="space-y-2">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-[#222] last:border-0"
                  >
                    <span className="text-white">{member.name}</span>
                    <span className="text-gray-500 text-sm">{member.instrument}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucun membre renseigné</p>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">🔗 Liens</h3>
            <div className="space-y-2">
              {band.youtubeLink && (
                <a
                  href={band.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  🎬 YouTube
                </a>
              )}
              {band.spotifyLink && (
                <a
                  href={band.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
                >
                  🎧 Spotify
                </a>
              )}
              {band.bandcampLink && (
                <a
                  href={band.bandcampLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  💿 Bandcamp
                </a>
              )}
              {band.facebookLink && (
                <a
                  href={band.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  📘 Facebook
                </a>
              )}
              {band.instagramLink && (
                <a
                  href={band.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  📷 Instagram
                </a>
              )}
              {band.otherLink && (
                <a
                  href={band.otherLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  🔗 Autre lien
                </a>
              )}
              {band.demoUrl && (
                <a
                  href={band.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#e53e3e] transition-colors"
                >
                  🎵 Fichier démo
                </a>
              )}
              {!band.youtubeLink && !band.spotifyLink && !band.bandcampLink && !band.facebookLink && !band.instagramLink && !band.otherLink && !band.demoUrl && (
                <p className="text-gray-500">Aucun lien renseigné</p>
              )}
            </div>
          </div>
        </div>

        {/* Main content & form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">📝 Biographie</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{band.bio}</p>
          </div>

          {/* Motivation */}
          {band.motivation && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">💬 Motivation</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{band.motivation}</p>
            </div>
          )}

          {/* Edit form */}
          <BandForm band={band} />
        </div>
      </div>
    </div>
  );
}
