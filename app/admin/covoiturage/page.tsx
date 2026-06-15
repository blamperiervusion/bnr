import prisma from '@/lib/prisma';
import CarpoolAdminActions from './CarpoolAdminActions';

export const dynamic = 'force-dynamic';

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  VISIBLE: { label: 'Publié', color: 'bg-green-500/20 text-green-500' },
  HIDDEN: { label: 'Masqué', color: 'bg-gray-500/20 text-gray-400' },
};

const TYPE_LABELS = {
  DRIVER: { label: '🚗 Conducteur', color: 'bg-green-500/10 text-green-400' },
  PASSENGER: { label: '🙋 Passager', color: 'bg-blue-500/10 text-blue-400' },
};

const DAY_LABELS: Record<string, string> = {
  vendredi: 'Ven.',
  samedi: 'Sam.',
  dimanche: 'Dim.',
};

async function getOffers() {
  return prisma.carpoolOffer.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function AdminCovoituragePage() {
  const offers = await getOffers();

  const counts = {
    PENDING: offers.filter(o => o.status === 'PENDING').length,
    VISIBLE: offers.filter(o => o.status === 'VISIBLE').length,
    HIDDEN: offers.filter(o => o.status === 'HIDDEN').length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Covoiturage</h1>
          <p className="text-gray-500 text-sm mt-1">{offers.length} annonce(s)</p>
        </div>
        <a
          href="/covoiturage"
          target="_blank"
          rel="noopener"
          className="px-4 py-2 text-sm rounded-lg font-medium text-white border border-[#333] hover:border-[#555] transition-colors text-center"
        >
          Voir la page publique ↗
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.entries(counts) as [keyof typeof counts, number][]).map(([key, count]) => (
          <div key={key} className="bg-[#111] border border-[#222] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${STATUS_LABELS[key].color}`}>
              {STATUS_LABELS[key].label}
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucune annonce pour le moment</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="bg-[#111] border border-[#222] rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_LABELS[offer.type].color}`}>
                        {TYPE_LABELS[offer.type].label}
                      </span>
                      <span className="text-white font-medium text-sm">{offer.name}</span>
                      <span className="text-gray-400 text-sm">· {offer.city}</span>
                    </div>
                    {offer.type === 'DRIVER' && offer.seats && (
                      <p className="text-gray-400 text-xs mt-0.5">{offer.seats} place(s)</p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_LABELS[offer.status].color}`}>
                    {STATUS_LABELS[offer.status].label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {offer.days.map(d => (
                    <span key={d} className="px-1.5 py-0.5 text-xs rounded bg-[#222] text-gray-400">
                      {DAY_LABELS[d] ?? d}
                    </span>
                  ))}
                </div>
                {offer.message && (
                  <p className="text-gray-500 text-xs italic mb-2">&ldquo;{offer.message}&rdquo;</p>
                )}
                <p className="text-gray-600 text-xs mb-3">{offer.email}</p>
                <CarpoolAdminActions
                  offerId={offer.id}
                  currentStatus={offer.status}
                  currentCity={offer.city}
                  hasCoords={offer.lat !== null && offer.lng !== null}
                />
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#222]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Nom · Ville</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Jours</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {offers.map(offer => (
                  <tr key={offer.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_LABELS[offer.type].color}`}>
                        {TYPE_LABELS[offer.type].label}
                        {offer.type === 'DRIVER' && offer.seats ? ` · ${offer.seats}p` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{offer.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-gray-400 text-sm">{offer.city}</p>
                        {offer.lat !== null && offer.lng !== null ? (
                          <span className="text-green-500 text-xs" title={`${offer.lat?.toFixed(4)}, ${offer.lng?.toFixed(4)}`}>📍</span>
                        ) : (
                          <span className="text-orange-400 text-xs" title="Pas de coordonnées">⚠️</span>
                        )}
                      </div>
                      {offer.message && (
                        <p className="text-gray-600 text-xs italic mt-0.5 max-w-xs truncate">&ldquo;{offer.message}&rdquo;</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {offer.days.map(d => (
                          <span key={d} className="px-1.5 py-0.5 text-xs rounded bg-[#222] text-gray-400">
                            {DAY_LABELS[d] ?? d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{offer.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[offer.status].color}`}>
                        {STATUS_LABELS[offer.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CarpoolAdminActions
                        offerId={offer.id}
                        currentStatus={offer.status}
                        currentCity={offer.city}
                        hasCoords={offer.lat !== null && offer.lng !== null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
