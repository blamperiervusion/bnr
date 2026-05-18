import prisma from '@/lib/prisma';
import Link from 'next/link';
import FilterSelect from '../FilterSelect';

export const dynamic = 'force-dynamic';

const disponibiliteOptions = [
  { id: 'montage', label: 'Montage' },
  { id: 'vendredi', label: 'Ven. 26 juin' },
  { id: 'samedi', label: 'Sam. 27 juin' },
  { id: 'dimanche', label: 'Dim. 28 juin' },
  { id: 'demontage', label: 'Démontage' },
];

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

const teamColors: Record<string, string> = {
  Accueil: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Bar: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Sécurité: 'bg-red-500/20 text-red-400 border-red-500/30',
  Technique: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Éco-équipe': 'bg-green-500/20 text-green-400 border-green-500/30',
  Animation: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Merchandising: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Artistes: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Cashless: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

const statusDot: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  VALIDATED: 'bg-green-500',
  REFUSED: 'bg-red-500',
};

const statusLabel: Record<string, string> = {
  PENDING: 'En attente',
  VALIDATED: 'Validé',
  REFUSED: 'Refusé',
};

async function getVolunteers(team?: string, status?: string) {
  const where: Record<string, unknown> = {};
  if (team) where.team = team;
  if (status) where.status = status;

  return prisma.volunteer.findMany({
    where,
    select: {
      id: true,
      name: true,
      team: true,
      status: true,
      disponibilites: true,
    },
    orderBy: [{ team: 'asc' }, { name: 'asc' }],
  });
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; status?: string }>;
}) {
  const params = await searchParams;
  const volunteers = await getVolunteers(params.team, params.status);

  const totalBySlot: Record<string, number> = {};
  for (const slot of disponibiliteOptions) {
    totalBySlot[slot.id] = volunteers.filter((v) =>
      v.disponibilites.includes(slot.id)
    ).length;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/benevoles"
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← Liste
          </Link>
          <h1 className="text-3xl font-bold text-white">Planning bénévoles</h1>
        </div>
        <span className="text-gray-500 text-sm">{volunteers.length} bénévole(s)</span>
      </div>

      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <FilterSelect
            name="team"
            label="Équipe"
            options={teamOptions.map((t) => ({ value: t, label: t }))}
          />
          <FilterSelect
            name="status"
            label="Statut"
            options={[
              { value: 'PENDING', label: 'En attente' },
              { value: 'VALIDATED', label: 'Validés' },
              { value: 'REFUSED', label: 'Refusés' },
            ]}
          />
        </div>
      </div>

      {volunteers.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucun bénévole pour ces critères</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#222]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 w-52 min-w-[200px]">
                  Bénévole
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 w-28">
                  Équipe
                </th>
                {disponibiliteOptions.map((slot) => (
                  <th
                    key={slot.id}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-400 w-28"
                  >
                    <div>{slot.label}</div>
                    <div className="text-xs text-gray-600 font-normal mt-0.5">
                      {totalBySlot[slot.id]} pers.
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {volunteers.map((volunteer) => (
                <tr
                  key={volunteer.id}
                  className="hover:bg-[#161616] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${statusDot[volunteer.status]}`}
                        title={statusLabel[volunteer.status]}
                      />
                      <Link
                        href={`/admin/benevoles/${volunteer.id}`}
                        className="text-white text-sm font-medium hover:text-[#e53e3e] transition-colors truncate"
                      >
                        {volunteer.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {volunteer.team ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${teamColors[volunteer.team] ?? 'bg-[#333] text-gray-300 border-transparent'}`}
                      >
                        {volunteer.team}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  {disponibiliteOptions.map((slot) => {
                    const available = volunteer.disponibilites.includes(slot.id);
                    return (
                      <td key={slot.id} className="px-4 py-3 text-center">
                        {available ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[#2a2a2a] text-sm">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#0a0a0a] border-t border-[#222]">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-xs text-gray-500 font-medium">
                  Total
                </td>
                {disponibiliteOptions.map((slot) => (
                  <td key={slot.id} className="px-4 py-3 text-center">
                    <span className="text-white text-sm font-bold">{totalBySlot[slot.id]}</span>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
