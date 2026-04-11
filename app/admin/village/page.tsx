import Link from 'next/link';
import prisma from '@/lib/prisma';
import { VillageStandCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

const categoryConfig: Record<VillageStandCategory, { label: string; emoji: string; color: string }> = {
  FOOD: { label: 'Food Trucks', emoji: '🍔', color: 'bg-orange-500/20 text-orange-400' },
  BAR: { label: 'Bar', emoji: '🍺', color: 'bg-amber-500/20 text-amber-400' },
  MERCHANDISING: { label: 'Merchandising', emoji: '👕', color: 'bg-purple-500/20 text-purple-400' },
  ARTISANAT: { label: 'Artisanat', emoji: '⚒️', color: 'bg-cyan-500/20 text-cyan-400' },
  TATTOO: { label: 'Tatouage & Piercing', emoji: '🖋️', color: 'bg-red-500/20 text-red-400' },
  BARBIER: { label: 'Barbiers', emoji: '💈', color: 'bg-blue-500/20 text-blue-400' },
  ASSOCIATION: { label: 'Associations', emoji: '🤝', color: 'bg-green-500/20 text-green-400' },
  DIVERS: { label: 'Divers & Curiosités', emoji: '✨', color: 'bg-pink-500/20 text-pink-400' },
};

async function getStands() {
  return prisma.villageStand.findMany({
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  });
}

export default async function VillageAdminPage() {
  const stands = await getStands();

  const standsByCategory = stands.reduce((acc, stand) => {
    if (!acc[stand.category]) {
      acc[stand.category] = [];
    }
    acc[stand.category].push(stand);
    return acc;
  }, {} as Record<VillageStandCategory, typeof stands>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🏕️ Village</h1>
          <p className="text-gray-400 mt-1">Gérer les stands du village</p>
        </div>
        <Link
          href="/admin/village/nouveau"
          className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
        >
          + Ajouter un stand
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = standsByCategory[key as VillageStandCategory]?.length || 0;
          return (
            <div key={key} className={`${config.color} rounded-lg p-4 text-center`}>
              <span className="text-2xl block mb-1">{config.emoji}</span>
              <span className="text-2xl font-bold block">{count}</span>
              <span className="text-xs opacity-80">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Stands par catégorie */}
      <div className="space-y-8">
        {Object.entries(categoryConfig).map(([categoryKey, config]) => {
          const categoryStands = standsByCategory[categoryKey as VillageStandCategory] || [];
          
          return (
            <div key={categoryKey}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${config.color.split(' ')[1]}`}>
                <span>{config.emoji}</span>
                {config.label}
                <span className="text-sm font-normal text-gray-500">({categoryStands.length})</span>
              </h2>
              
              {categoryStands.length === 0 ? (
                <p className="text-gray-500 italic">Aucun stand dans cette catégorie</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStands.map((stand) => (
                    <Link
                      key={stand.id}
                      href={`/admin/village/${stand.id}`}
                      className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#444] transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        {stand.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={stand.logo}
                            alt={stand.name}
                            className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center text-2xl">
                            {config.emoji}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors truncate">
                            {stand.name}
                          </h3>
                          {stand.description && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {stand.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {!stand.isVisible && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                Masqué
                              </span>
                            )}
                            {stand.website && (
                              <span className="text-xs text-gray-500">🌐</span>
                            )}
                            {stand.instagram && (
                              <span className="text-xs text-gray-500">📷</span>
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

      {stands.length === 0 && (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🏕️</span>
          <h2 className="text-xl font-bold text-white mb-2">Aucun stand pour le moment</h2>
          <p className="text-gray-400 mb-6">Commence par ajouter les stands du village</p>
          <Link
            href="/admin/village/nouveau"
            className="inline-block px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            + Ajouter le premier stand
          </Link>
        </div>
      )}
    </div>
  );
}
