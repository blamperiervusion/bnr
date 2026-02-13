import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import FilterSelect from './FilterSelect';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  VALIDATED: { label: 'Validé', color: 'bg-green-500/20 text-green-500' },
  REFUSED: { label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
};

const missionLabels: Record<string, string> = {
  accueil: 'Accueil & Billetterie',
  bar: 'Bars',
  securite: 'Sécurité & Prévention',
  technique: 'Technique & Logistique',
  eco: 'Éco-équipe',
  animation: 'Animation',
  merchandising: 'Merchandising',
  artistes: 'Artistes (Catering & Loges)',
  cashless: 'Cashless',
};

const teamOptions = [
  'Accueil',
  'Bar',
  'Sécurité',
  'Technique',
  'Éco-équipe',
  'Animation',
  'Merchandising',
  'Artistes',
  'Cashless',
];

async function getVolunteers(searchParams: { status?: string; team?: string }) {
  const where: Record<string, unknown> = {};
  
  if (searchParams.status) {
    where.status = searchParams.status;
  }
  if (searchParams.team) {
    where.team = searchParams.team;
  }

  return prisma.volunteer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export default async function BenevolesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; team?: string }>;
}) {
  const params = await searchParams;
  const volunteers = await getVolunteers(params);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Bénévoles</h1>
        <span className="text-gray-500">{volunteers.length} candidature(s)</span>
      </div>

      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <FilterSelect
            name="status"
            label="Statut"
            options={[
              { value: 'PENDING', label: 'En attente' },
              { value: 'VALIDATED', label: 'Validés' },
              { value: 'REFUSED', label: 'Refusés' },
            ]}
          />
          <FilterSelect
            name="team"
            label="Équipe"
            options={teamOptions.map((team) => ({ value: team, label: team }))}
          />
        </div>
      </div>

      {/* Volunteers list */}
      {volunteers.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucune candidature pour le moment</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#222]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Missions</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Équipe</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    {volunteer.profileImage ? (
                      <Image
                        src={volunteer.profileImage}
                        alt={volunteer.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white font-bold">
                        {volunteer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/benevoles/${volunteer.id}`}
                      className="text-white font-medium hover:text-[#e53e3e] transition-colors"
                    >
                      {volunteer.name}
                    </Link>
                    {volunteer.age && (
                      <span className="text-gray-500 text-sm ml-2">({volunteer.age} ans)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-400 text-sm">{volunteer.email}</p>
                    {volunteer.phone && (
                      <p className="text-gray-500 text-sm">{volunteer.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.missions.slice(0, 2).map((mission) => (
                        <span
                          key={mission}
                          className="px-2 py-0.5 bg-[#333] text-gray-300 text-xs rounded"
                        >
                          {missionLabels[mission] || mission}
                        </span>
                      ))}
                      {volunteer.missions.length > 2 && (
                        <span className="text-gray-500 text-xs">
                          +{volunteer.missions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {volunteer.team ? (
                      <span className="px-2 py-1 bg-[#e53e3e]/20 text-[#e53e3e] text-xs rounded">
                        {volunteer.team}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Non attribué</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[volunteer.status]?.color}`}>
                      {statusLabels[volunteer.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(volunteer.createdAt).toLocaleDateString('fr-FR')}
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
