import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import FilterSelect from './FilterSelect';
import FormattedDate from '../components/FormattedDate';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  CONTACTED: { label: 'Contacté', color: 'bg-blue-500/20 text-blue-500' },
  VALIDATED: { label: 'Validé', color: 'bg-green-500/20 text-green-500' },
  REFUSED: { label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
};

const tierLabels: Record<string, { label: string; color: string }> = {
  chaos: { label: 'CHAOS', color: '#E85D04' },
  headbanger: { label: 'HEADBANGER', color: '#00E5CC' },
  moshpit: { label: 'MOSH PIT', color: '#FFD700' },
  supporter: { label: 'SUPPORTER', color: '#C0C0C0' },
  echange: { label: 'ÉCHANGE', color: '#ec4899' },
  institutional: { label: 'INSTITUTIONNEL', color: '#3b82f6' },
  media: { label: 'MÉDIA', color: '#8b5cf6' },
  technical: { label: 'TECHNIQUE', color: '#06b6d4' },
};

async function getPartners(searchParams: { status?: string; tier?: string }) {
  const where: Record<string, unknown> = {};
  
  if (searchParams.status) {
    where.status = searchParams.status;
  }
  if (searchParams.tier) {
    where.tier = searchParams.tier;
  }

  return prisma.partner.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export default async function PartenairesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tier?: string }>;
}) {
  const params = await searchParams;
  const partners = await getPartners(params);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Partenaires</h1>
          <p className="text-gray-500 text-sm mt-1">{partners.length} partenaire(s)</p>
        </div>
        <Link
          href="/admin/partenaires/nouveau"
          className="px-4 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors text-center"
        >
          + Ajouter
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <FilterSelect
            name="status"
            label="Statut"
            options={[
              { value: 'PENDING', label: 'En attente' },
              { value: 'CONTACTED', label: 'Contactés' },
              { value: 'VALIDATED', label: 'Validés' },
              { value: 'REFUSED', label: 'Refusés' },
            ]}
          />
          <FilterSelect
            name="tier"
            label="Niveau"
            options={[
              { value: 'chaos', label: 'CHAOS' },
              { value: 'headbanger', label: 'HEADBANGER' },
              { value: 'moshpit', label: 'MOSH PIT' },
              { value: 'supporter', label: 'SUPPORTER' },
              { value: 'echange', label: 'ÉCHANGE' },
              { value: 'institutional', label: 'INSTITUTIONNEL' },
              { value: 'media', label: 'MÉDIA' },
              { value: 'technical', label: 'TECHNIQUE' },
            ]}
          />
        </div>
      </div>

      {/* Partners list */}
      {partners.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucun partenaire pour le moment</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {partners.map((partner) => (
              <Link
                key={partner.id}
                href={`/admin/partenaires/${partner.id}`}
                className="block bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#e53e3e]/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.company}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded object-contain bg-white shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-[#333] flex items-center justify-center text-white font-bold shrink-0">
                      {partner.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-medium truncate">{partner.company}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusLabels[partner.status]?.color}`}>
                        {statusLabels[partner.status]?.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{partner.contact}</p>
                    <p className="text-gray-500 text-xs truncate">{partner.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {partner.tier && (
                        <span
                          className="px-2 py-0.5 text-xs rounded font-medium"
                          style={{
                            backgroundColor: `${tierLabels[partner.tier]?.color}20`,
                            color: tierLabels[partner.tier]?.color,
                          }}
                        >
                          {tierLabels[partner.tier]?.label}
                        </span>
                      )}
                      {partner.donationAmount && (
                        <span className="text-white text-sm font-medium">
                          {partner.donationAmount.toLocaleString('fr-FR')}€
                        </span>
                      )}
                      <span className="text-gray-500 text-xs ml-auto">
                        <FormattedDate date={partner.createdAt} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#222]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Logo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Entreprise</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Niveau</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Montant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3">
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.company}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-contain bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#333] flex items-center justify-center text-white font-bold">
                          {partner.company.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/partenaires/${partner.id}`}
                        className="text-white font-medium hover:text-[#e53e3e] transition-colors"
                      >
                        {partner.company}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{partner.contact}</p>
                      <p className="text-gray-500 text-sm">{partner.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {partner.tier ? (
                        <span
                          className="px-2 py-1 text-xs rounded font-medium"
                          style={{
                            backgroundColor: `${tierLabels[partner.tier]?.color}20`,
                            color: tierLabels[partner.tier]?.color,
                          }}
                        >
                          {tierLabels[partner.tier]?.label}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Non défini</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {partner.donationAmount ? (
                        <span className="text-white">
                          {partner.donationAmount.toLocaleString('fr-FR')}€
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[partner.status]?.color}`}>
                        {statusLabels[partner.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      <FormattedDate date={partner.createdAt} />
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
