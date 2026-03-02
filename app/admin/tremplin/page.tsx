import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import FilterSelect from './FilterSelect';
import FormattedDate from '../components/FormattedDate';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  PRESELECTED: { label: 'Présélectionné', color: 'bg-blue-500/20 text-blue-500' },
  SELECTED: { label: 'Sélectionné', color: 'bg-green-500/20 text-green-500' },
  REJECTED: { label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
};

const genreOptions = [
  { value: 'samedi-metal-punk', label: 'Samedi — Metal/Punk' },
  { value: 'dimanche-rock-reprises', label: 'Dimanche — Rock/Reprises' },
];

const getGenreLabel = (value: string) => {
  const option = genreOptions.find(o => o.value === value);
  return option ? option.label : value;
};

async function getBands(searchParams: { status?: string; genre?: string }) {
  const where: Record<string, unknown> = {};
  
  if (searchParams.status) {
    where.status = searchParams.status;
  }
  if (searchParams.genre) {
    where.genre = searchParams.genre;
  }

  return prisma.tremplinBand.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export default async function TremplinAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; genre?: string }>;
}) {
  const params = await searchParams;
  const bands = await getBands(params);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🎸 Tremplin 2026</h1>
          <p className="text-gray-500 mt-1">Gestion des inscriptions au concours</p>
        </div>
        <span className="text-gray-500">{bands.length} groupe(s)</span>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusLabels).map(([key, { label, color }]) => {
          const count = bands.filter((b) => b.status === key).length;
          return (
            <div
              key={key}
              className="bg-[#111] border border-[#222] rounded-lg p-4 text-center"
            >
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {label}
              </span>
              <p className="text-2xl font-bold text-white mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <FilterSelect
            name="status"
            label="Statut"
            options={[
              { value: 'PENDING', label: 'En attente' },
              { value: 'PRESELECTED', label: 'Présélectionnés' },
              { value: 'SELECTED', label: 'Sélectionnés' },
              { value: 'REJECTED', label: 'Refusés' },
            ]}
          />
          <FilterSelect
            name="genre"
            label="Genre"
            options={genreOptions}
          />
        </div>
      </div>

      {/* Bands list */}
      {bands.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucune inscription pour le moment</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#222]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Groupe</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Genre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Liens</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Note</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {bands.map((band) => (
                <tr key={band.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    {band.photoUrl ? (
                      <Image
                        src={band.photoUrl}
                        alt={band.bandName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#333] flex items-center justify-center text-white text-lg">
                        🎸
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tremplin/${band.id}`}
                      className="text-white font-medium hover:text-[#e53e3e] transition-colors"
                    >
                      {band.bandName}
                    </Link>
                    <p className="text-gray-500 text-sm">{band.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-[#333] text-gray-300 text-xs rounded">
                      {getGenreLabel(band.genre)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-400 text-sm">{band.contactName}</p>
                    <p className="text-gray-500 text-xs">{band.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {band.youtubeLink && (
                        <a
                          href={band.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400"
                          title="YouTube"
                        >
                          🎬
                        </a>
                      )}
                      {band.spotifyLink && (
                        <a
                          href={band.spotifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-400"
                          title="Spotify"
                        >
                          🎧
                        </a>
                      )}
                      {band.bandcampLink && (
                        <a
                          href={band.bandcampLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400"
                          title="Bandcamp"
                        >
                          💿
                        </a>
                      )}
                      {band.facebookLink && (
                        <a
                          href={band.facebookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                          title="Facebook"
                        >
                          📘
                        </a>
                      )}
                      {band.instagramLink && (
                        <a
                          href={band.instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-400"
                          title="Instagram"
                        >
                          📷
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {band.rating ? (
                      <span className="text-yellow-500">
                        {'★'.repeat(band.rating)}{'☆'.repeat(5 - band.rating)}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[band.status]?.color}`}
                    >
                      {statusLabels[band.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    <FormattedDate date={band.createdAt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
