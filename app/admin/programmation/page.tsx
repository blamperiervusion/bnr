import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const dayConfig: Record<string, { label: string; color: string }> = {
  vendredi: { label: 'Vendredi 26 Juin', color: 'bg-purple-500/20 text-purple-400' },
  samedi: { label: 'Samedi 27 Juin', color: 'bg-red-500/20 text-red-400' },
  dimanche: { label: 'Dimanche 28 Juin', color: 'bg-orange-500/20 text-orange-400' },
};

async function getBands() {
  return prisma.band.findMany({
    orderBy: [
      { day: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  });
}

export default async function ProgrammationAdminPage() {
  const bands = await getBands();

  const bandsByDay = bands.reduce((acc, band) => {
    if (!acc[band.day]) {
      acc[band.day] = [];
    }
    acc[band.day].push(band);
    return acc;
  }, {} as Record<string, typeof bands>);

  const days = ['vendredi', 'samedi', 'dimanche'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🎤 Programmation</h1>
          <p className="text-gray-400 mt-1">Gérer les groupes du festival</p>
        </div>
        <Link
          href="/admin/programmation/nouveau"
          className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
        >
          + Ajouter un groupe
        </Link>
      </div>

      {/* Stats par jour */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {days.map((day) => {
          const config = dayConfig[day];
          const dayBands = bandsByDay[day] || [];
          const headliners = dayBands.filter(b => b.isHeadliner).length;
          
          return (
            <div key={day} className={`${config.color} rounded-lg p-4`}>
              <h3 className="font-bold text-lg">{config.label}</h3>
              <p className="text-3xl font-bold mt-2">{dayBands.length}</p>
              <p className="text-sm opacity-80">
                {headliners > 0 ? `dont ${headliners} tête${headliners > 1 ? 's' : ''} d'affiche` : 'groupes'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Groupes par jour */}
      <div className="space-y-8">
        {days.map((day) => {
          const config = dayConfig[day];
          const dayBands = bandsByDay[day] || [];

          return (
            <div key={day}>
              <h2 className={`text-xl font-bold mb-4 ${config.color.split(' ')[1]}`}>
                {config.label}
                <span className="text-sm font-normal text-gray-500 ml-2">({dayBands.length} groupes)</span>
              </h2>

              {dayBands.length === 0 ? (
                <p className="text-gray-500 italic">Aucun groupe programmé ce jour</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayBands.map((band) => (
                    <Link
                      key={band.id}
                      href={`/admin/programmation/${band.id}`}
                      className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#444] transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        {band.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={band.imageUrl}
                            alt={band.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center text-2xl">
                            🎸
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors truncate">
                              {band.name}
                            </h3>
                            {band.isHeadliner && (
                              <span className="text-yellow-400 text-sm">⭐</span>
                            )}
                          </div>
                          {band.time && (
                            <p className="text-[#e53e3e] text-sm font-medium mt-1">
                              {band.time}{band.endTime ? ` - ${band.endTime}` : ''}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {!band.isVisible && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                Masqué
                              </span>
                            )}
                            {band.techRiderUrl && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                Tech Rider
                              </span>
                            )}
                            {band.contractUrl && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                Contrat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {bands.length === 0 && (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🎤</span>
          <h2 className="text-xl font-bold text-white mb-2">Aucun groupe pour le moment</h2>
          <p className="text-gray-400 mb-6">Commence par ajouter les groupes programmés</p>
          <Link
            href="/admin/programmation/nouveau"
            className="inline-block px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            + Ajouter le premier groupe
          </Link>
        </div>
      )}
    </div>
  );
}
