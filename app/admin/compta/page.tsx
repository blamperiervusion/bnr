import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getComptaStats() {
  const currentYear = new Date().getFullYear();

  const exercice = await prisma.comptaExercice.findUnique({
    where: { year: currentYear },
  });

  const transactions = await prisma.transaction.findMany({
    where: { exerciceYear: currentYear },
    include: { category: true },
  });

  const totalDebit = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalCredit = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const uncategorized = transactions.filter(t => !t.categoryId).length;

  // Group by category type
  const chargesByCategory = transactions
    .filter(t => t.type === 'debit' && t.category)
    .reduce((acc, t) => {
      const code = t.category!.code.substring(0, 2);
      acc[code] = (acc[code] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const produitsByCategory = transactions
    .filter(t => t.type === 'credit' && t.category)
    .reduce((acc, t) => {
      const code = t.category!.code.substring(0, 2);
      acc[code] = (acc[code] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  return {
    exercice,
    totalTransactions: transactions.length,
    totalDebit,
    totalCredit,
    balance: totalCredit - totalDebit,
    uncategorized,
    chargesByCategory,
    produitsByCategory,
  };
}

export default async function ComptaPage() {
  const stats = await getComptaStats();
  const currentYear = new Date().getFullYear();

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Comptabilité</h1>
          <p className="text-gray-400 mt-1">Exercice {currentYear}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/compta/import"
            className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            📥 Importer un relevé
          </Link>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-500/20 text-green-400 rounded-lg p-6">
          <p className="text-sm opacity-80">Total Produits</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalCredit)}</p>
        </div>
        <div className="bg-red-500/20 text-red-400 rounded-lg p-6">
          <p className="text-sm opacity-80">Total Charges</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalDebit)}</p>
        </div>
        <div className={`${stats.balance >= 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'} rounded-lg p-6`}>
          <p className="text-sm opacity-80">Résultat</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(stats.balance)}</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <p className="text-sm text-gray-400">Transactions</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalTransactions}</p>
          {stats.uncategorized > 0 && (
            <p className="text-sm text-yellow-400 mt-1">{stats.uncategorized} à catégoriser</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Link
          href="/admin/compta/exercices"
          className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#444] transition-colors group"
        >
          <span className="text-3xl block mb-2">📅</span>
          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors">Exercices</h3>
          <p className="text-sm text-gray-400">Soldes d&apos;ouverture</p>
        </Link>
        <Link
          href="/admin/compta/transactions"
          className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#444] transition-colors group"
        >
          <span className="text-3xl block mb-2">📋</span>
          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors">Transactions</h3>
          <p className="text-sm text-gray-400">Voir et catégoriser</p>
        </Link>
        <Link
          href="/admin/compta/import"
          className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#444] transition-colors group"
        >
          <span className="text-3xl block mb-2">📥</span>
          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors">Import</h3>
          <p className="text-sm text-gray-400">Relevés bancaires</p>
        </Link>
        <Link
          href="/admin/compta/categories"
          className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#444] transition-colors group"
        >
          <span className="text-3xl block mb-2">🏷️</span>
          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors">Catégories</h3>
          <p className="text-sm text-gray-400">Plan comptable</p>
        </Link>
        <Link
          href="/admin/compta/documents"
          className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#444] transition-colors group"
        >
          <span className="text-3xl block mb-2">📄</span>
          <h3 className="font-bold text-white group-hover:text-[#e53e3e] transition-colors">Documents</h3>
          <p className="text-sm text-gray-400">Bilan & Résultat</p>
        </Link>
      </div>

      {/* Aperçu par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">📈 Produits par catégorie</h3>
          {Object.entries(stats.produitsByCategory).length === 0 ? (
            <p className="text-gray-500 italic">Aucun produit enregistré</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.produitsByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([code, amount]) => (
                  <div key={code} className="flex justify-between items-center">
                    <span className="text-gray-300">Compte {code}x</span>
                    <span className="text-green-400 font-bold">{formatCurrency(amount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">📉 Charges par catégorie</h3>
          {Object.entries(stats.chargesByCategory).length === 0 ? (
            <p className="text-gray-500 italic">Aucune charge enregistrée</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.chargesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([code, amount]) => (
                  <div key={code} className="flex justify-between items-center">
                    <span className="text-gray-300">Compte {code}x</span>
                    <span className="text-red-400 font-bold">{formatCurrency(amount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
