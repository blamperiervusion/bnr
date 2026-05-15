import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const typeLabels: Record<string, { label: string; color: string }> = {
  LOCAL: { label: 'Stock local', color: 'bg-blue-500/20 text-blue-400' },
  PRINTIFY: { label: 'Printify', color: 'bg-purple-500/20 text-purple-400' },
};

export default async function AdminBoutiquePage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produit(s)</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/boutique/commandes"
            className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-gray-300 rounded-lg hover:bg-[#222] transition-colors text-sm"
          >
            📦 Commandes
          </Link>
          <Link
            href="/admin/boutique/nouveau"
            className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors text-sm font-medium"
          >
            + Nouveau produit
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">👕</p>
          <p>Aucun produit pour l&apos;instant.</p>
          <Link href="/admin/boutique/nouveau" className="mt-4 inline-block text-[#e53e3e] hover:underline text-sm">
            Créer le premier produit →
          </Link>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#222] text-gray-500 uppercase tracking-wider text-xs">
                <th className="text-left px-6 py-4">Produit</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Type</th>
                <th className="text-left px-6 py-4 hidden lg:table-cell">Variantes</th>
                <th className="text-left px-6 py-4 hidden lg:table-cell">Commandes</th>
                <th className="text-left px-6 py-4">Visible</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const t = typeLabels[product.type] ?? typeLabels.LOCAL;
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={product.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">/boutique/{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${t.color}`}>{t.label}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400">
                      {product.variants.length} variante(s)
                      {product.type === 'LOCAL' && (
                        <span className="ml-2 text-xs text-gray-600">({totalStock} en stock)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400">
                      {product._count.orderItems}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`w-2 h-2 rounded-full inline-block ${product.isVisible ? 'bg-green-500' : 'bg-gray-600'}`} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/boutique/${product.id}`}
                        className="px-3 py-1.5 bg-[#222] text-gray-300 rounded hover:bg-[#333] transition-colors text-xs"
                      >
                        Modifier
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
