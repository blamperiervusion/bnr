import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-400' },
  PAID: { label: 'Payée', color: 'bg-green-500/20 text-green-400' },
  PROCESSING: { label: 'En traitement', color: 'bg-blue-500/20 text-blue-400' },
  SHIPPED: { label: 'Expédiée', color: 'bg-purple-500/20 text-purple-400' },
  DELIVERED: { label: 'Livrée', color: 'bg-gray-500/20 text-gray-400' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-500/20 text-red-400' },
  REFUNDED: { label: 'Remboursée', color: 'bg-orange-500/20 text-orange-400' },
};

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;

  const orders = await prisma.order.findMany({
    where: params.status ? { status: params.status as never } : undefined,
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const counts = await prisma.order.groupBy({
    by: ['status'],
    _count: { _all: true },
  });

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Commandes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} commande(s)
            {!params.status && ` — ${total.toFixed(2).replace('.', ',')} € total`}
          </p>
        </div>
        <Link
          href="/admin/boutique"
          className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-gray-300 rounded-lg hover:bg-[#222] transition-colors text-sm"
        >
          ← Produits
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/boutique/commandes"
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            !params.status
              ? 'bg-[#e53e3e]/20 text-[#e53e3e] border border-[#e53e3e]/30'
              : 'bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white'
          }`}
        >
          Toutes ({orders.length + (params.status ? 0 : 0)})
        </Link>
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={`/admin/boutique/commandes?status=${key}`}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              params.status === key
                ? 'bg-[#e53e3e]/20 text-[#e53e3e] border border-[#e53e3e]/30'
                : 'bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white'
            }`}
          >
            {label} {countMap[key] ? `(${countMap[key]})` : ''}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">📦</p>
          <p>Aucune commande{params.status ? ' avec ce statut' : ''}.</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#222] text-gray-500 uppercase tracking-wider text-xs">
                <th className="text-left px-6 py-4">Commande</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Client</th>
                <th className="text-left px-6 py-4 hidden lg:table-cell">Articles</th>
                <th className="text-left px-6 py-4">Total</th>
                <th className="text-left px-6 py-4">Statut</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const s = statusConfig[order.status] ?? statusConfig.PENDING;
                return (
                  <tr key={order.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-white text-xs">{order.orderNumber}</p>
                      {order.printifyOrderId && (
                        <p className="text-purple-400 text-xs mt-0.5">Printify ✓</p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-white">{order.customerName}</p>
                      <p className="text-gray-500 text-xs">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} article(s)
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {Number(order.total).toFixed(2).replace('.', ',')} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/boutique/commandes/${order.id}`}
                        className="px-3 py-1.5 bg-[#222] text-gray-300 rounded hover:bg-[#333] transition-colors text-xs"
                      >
                        Détail
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
