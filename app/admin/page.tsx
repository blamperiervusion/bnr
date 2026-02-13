import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [
    totalVolunteers,
    pendingVolunteers,
    validatedVolunteers,
    totalPartners,
    pendingPartners,
    validatedPartners,
  ] = await Promise.all([
    prisma.volunteer.count(),
    prisma.volunteer.count({ where: { status: 'PENDING' } }),
    prisma.volunteer.count({ where: { status: 'VALIDATED' } }),
    prisma.partner.count(),
    prisma.partner.count({ where: { status: 'PENDING' } }),
    prisma.partner.count({ where: { status: 'VALIDATED' } }),
  ]);

  return {
    totalVolunteers,
    pendingVolunteers,
    validatedVolunteers,
    totalPartners,
    pendingPartners,
    validatedPartners,
  };
}

async function getRecentActivity() {
  const [recentVolunteers, recentPartners] = await Promise.all([
    prisma.volunteer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    }),
    prisma.partner.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, company: true, contact: true, status: true, createdAt: true },
    }),
  ]);

  return { recentVolunteers, recentPartners };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const { recentVolunteers, recentPartners } = await getRecentActivity();

  const statCards = [
    {
      title: 'Bénévoles',
      total: stats.totalVolunteers,
      pending: stats.pendingVolunteers,
      validated: stats.validatedVolunteers,
      icon: '🙋',
      href: '/admin/benevoles',
      color: '#38a169',
    },
    {
      title: 'Partenaires',
      total: stats.totalPartners,
      pending: stats.pendingPartners,
      validated: stats.validatedPartners,
      icon: '🤝',
      href: '/admin/partenaires',
      color: '#e53e3e',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#333] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{card.icon}</span>
              <span
                className="text-4xl font-bold"
                style={{ color: card.color }}
              >
                {card.total}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{card.title}</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-yellow-500">
                {card.pending} en attente
              </span>
              <span className="text-green-500">
                {card.validated} validés
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent volunteers */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Dernières candidatures bénévoles
            </h2>
            <Link
              href="/admin/benevoles"
              className="text-sm text-[#e53e3e] hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentVolunteers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune candidature pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {recentVolunteers.map((volunteer) => (
                <Link
                  key={volunteer.id}
                  href={`/admin/benevoles/${volunteer.id}`}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{volunteer.name}</p>
                    <p className="text-sm text-gray-500">{volunteer.email}</p>
                  </div>
                  <StatusBadge status={volunteer.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent partners */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Dernières demandes partenaires
            </h2>
            <Link
              href="/admin/partenaires"
              className="text-sm text-[#e53e3e] hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentPartners.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune demande pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {recentPartners.map((partner) => (
                <Link
                  key={partner.id}
                  href={`/admin/partenaires/${partner.id}`}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{partner.company}</p>
                    <p className="text-sm text-gray-500">{partner.contact}</p>
                  </div>
                  <StatusBadge status={partner.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
    CONTACTED: { label: 'Contacté', color: 'bg-blue-500/20 text-blue-500' },
    VALIDATED: { label: 'Validé', color: 'bg-green-500/20 text-green-500' },
    REFUSED: { label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
