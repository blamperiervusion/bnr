import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getCategories() {
  return prisma.comptaCategory.findMany({
    orderBy: { code: 'asc' },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  const charges = categories.filter(c => c.type === 'charge');
  const produits = categories.filter(c => c.type === 'produit');

  const tagColors: Record<string, string> = {
    technical: 'bg-blue-500/20 text-blue-400',
    artistic: 'bg-purple-500/20 text-purple-400',
    public_funding: 'bg-green-500/20 text-green-400',
    private_funding: 'bg-orange-500/20 text-orange-400',
  };

  const tagLabels: Record<string, string> = {
    technical: '🔧 Technique',
    artistic: '🎭 Artistique',
    public_funding: '🏛️ Financement public',
    private_funding: '💝 Mécénat',
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la comptabilité
        </Link>
        <h1 className="text-3xl font-bold text-white">🏷️ Plan comptable</h1>
        <p className="text-gray-400 mt-1">Catégories adaptées au festival</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Charges */}
        <div>
          <h2 className="text-xl font-bold text-red-400 mb-4">📉 Classe 6 - Charges</h2>
          <div className="space-y-2">
            {charges.map((cat) => (
              <div
                key={cat.id}
                className={`bg-[#111] border border-[#222] rounded-lg p-4 ${
                  cat.parentCode ? 'ml-6' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-red-400 font-mono font-bold">{cat.code}</span>
                    <span className="text-white ml-3">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.tags && (
                      <span className={`text-xs px-2 py-1 rounded ${tagColors[cat.tags] || 'bg-[#222] text-gray-400'}`}>
                        {tagLabels[cat.tags] || cat.tags}
                      </span>
                    )}
                    {cat._count.transactions > 0 && (
                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded">
                        {cat._count.transactions} transactions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produits */}
        <div>
          <h2 className="text-xl font-bold text-green-400 mb-4">📈 Classe 7 - Produits</h2>
          <div className="space-y-2">
            {produits.map((cat) => (
              <div
                key={cat.id}
                className={`bg-[#111] border border-[#222] rounded-lg p-4 ${
                  cat.parentCode ? 'ml-6' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-green-400 font-mono font-bold">{cat.code}</span>
                    <span className="text-white ml-3">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.tags && (
                      <span className={`text-xs px-2 py-1 rounded ${tagColors[cat.tags] || 'bg-[#222] text-gray-400'}`}>
                        {tagLabels[cat.tags] || cat.tags}
                      </span>
                    )}
                    {cat._count.transactions > 0 && (
                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded">
                        {cat._count.transactions} transactions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
