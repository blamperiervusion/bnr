import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import FilterSelect from './FilterSelect';
import FormattedDate from '../components/FormattedDate';

export const dynamic = 'force-dynamic';

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

const teamIcons: Record<string, string> = {
  Accueil: '🎟️',
  Bar: '🍺',
  Sécurité: '🛡️',
  Technique: '🔧',
  'Éco-équipe': '♻️',
  Animation: '🎉',
  Merchandising: '👕',
  Artistes: '🎸',
  Cashless: '💳',
};

async function getTeamStats() {
  const allVolunteers = await prisma.volunteer.findMany({
    select: { team: true, status: true },
  });

  const stats: Record<string, { total: number; validated: number }> = {};
  let unassigned = 0;

  for (const v of allVolunteers) {
    if (v.team) {
      if (!stats[v.team]) stats[v.team] = { total: 0, validated: 0 };
      stats[v.team].total++;
      if (v.status === 'VALIDATED') stats[v.team].validated++;
    } else {
      unassigned++;
    }
  }

  return { stats, unassigned, total: allVolunteers.length };
}

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
  const [volunteers, { stats, unassigned, total }] = await Promise.all([
    getVolunteers(params),
    getTeamStats(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Bénévoles</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/benevoles/planning"
            className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-400 hover:text-white hover:border-[#555] transition-colors text-sm"
          >
            📅 Planning
          </Link>
          <span className="text-gray-500">{volunteers.length} candidature(s)</span>
        </div>
      </div>

      {/* Team stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Répartition par équipe</h2>
          <span className="text-xs text-gray-600">{total} candidature(s) au total · {unassigned} non attribuée(s)</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {teamOptions.map((team) => {
            const s = stats[team];
            const count = s?.total ?? 0;
            const validated = s?.validated ?? 0;
            return (
              <div
                key={team}
                className="bg-[#111] border border-[#222] rounded-lg p-3 flex flex-col items-center gap-1 text-center hover:border-[#e53e3e]/40 transition-colors"
              >
                <span className="text-2xl">{teamIcons[team]}</span>
                <span className="text-2xl font-bold text-white leading-none">{count}</span>
                {validated > 0 && (
                  <span className="text-xs text-green-500 font-medium">{validated} ✓</span>
                )}
                <span className="text-[10px] text-gray-500 leading-tight">{team}</span>
              </div>
            );
          })}
        </div>
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
                    <FormattedDate date={volunteer.createdAt} />
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
