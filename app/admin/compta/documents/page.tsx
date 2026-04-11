'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CategoryData {
  name: string;
  type: string;
  total: number;
  tags: string | null;
}

interface FinancialData {
  byCategory: Record<string, CategoryData>;
  totalCharges: number;
  totalProduits: number;
  resultat: number;
  publicFunding: number;
  privateFunding: number;
  technicalExpenses: number;
  artisticExpenses: number;
  uncategorizedCount: number;
}

export default function DocumentsPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/compta/documents?year=${year}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const charges = data ? Object.entries(data.byCategory)
    .filter(([, v]) => v.type === 'charge')
    .sort((a, b) => a[0].localeCompare(b[0])) : [];

  const produits = data ? Object.entries(data.byCategory)
    .filter(([, v]) => v.type === 'produit')
    .sort((a, b) => a[0].localeCompare(b[0])) : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-[#222] rounded"></div>
          <div className="h-64 bg-[#222] rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-400">Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la comptabilité
        </Link>
        <h1 className="text-3xl font-bold text-white">📄 Documents comptables</h1>
        <div className="flex items-center gap-4 mt-2">
          <label className="text-gray-400">Exercice :</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-1 bg-[#111] border border-[#333] rounded text-white"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {data.uncategorizedCount > 0 && (
        <div className="bg-yellow-500/20 text-yellow-400 p-4 rounded-lg mb-8">
          ⚠️ {data.uncategorizedCount} transactions non catégorisées - les documents peuvent être incomplets
        </div>
      )}

      {/* Compte de résultat */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Compte de résultat</h2>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors print:hidden"
          >
            🖨️ Imprimer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Charges */}
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-4 border-b border-[#333] pb-2">CHARGES</h3>
            <div className="space-y-2">
              {charges.map(([code, cat]) => (
                <div key={code} className="flex justify-between">
                  <span className="text-gray-300">{code} - {cat.name}</span>
                  <span className="text-white font-mono">{formatCurrency(cat.total)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-4 border-t border-[#333]">
                <span className="text-red-400">TOTAL CHARGES</span>
                <span className="text-red-400 font-mono">{formatCurrency(data.totalCharges)}</span>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4 border-b border-[#333] pb-2">PRODUITS</h3>
            <div className="space-y-2">
              {produits.map(([code, cat]) => (
                <div key={code} className="flex justify-between">
                  <span className="text-gray-300">{code} - {cat.name}</span>
                  <span className="text-white font-mono">{formatCurrency(cat.total)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-4 border-t border-[#333]">
                <span className="text-green-400">TOTAL PRODUITS</span>
                <span className="text-green-400 font-mono">{formatCurrency(data.totalProduits)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Résultat */}
        <div className={`mt-8 p-6 rounded-lg text-center ${data.resultat >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <p className="text-lg text-gray-300 mb-2">RÉSULTAT DE L&apos;EXERCICE</p>
          <p className={`text-4xl font-bold ${data.resultat >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(data.resultat)}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {data.resultat >= 0 ? 'Excédent' : 'Déficit'}
          </p>
        </div>
      </div>

      {/* Rapports spécifiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financements publics */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">🏛️ Subventions publiques</h3>
          {data.publicFunding > 0 ? (
            <>
              <p className="text-3xl font-bold text-green-400 mb-4">{formatCurrency(data.publicFunding)}</p>
              <div className="space-y-2">
                {Object.entries(data.byCategory)
                  .filter(([, v]) => v.tags?.includes('public_funding'))
                  .map(([code, cat]) => (
                    <div key={code} className="flex justify-between text-sm">
                      <span className="text-gray-400">{cat.name}</span>
                      <span className="text-white">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Aucune subvention enregistrée</p>
          )}
        </div>

        {/* Mécénat */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">💝 Mécénat et dons</h3>
          {data.privateFunding > 0 ? (
            <>
              <p className="text-3xl font-bold text-orange-400 mb-4">{formatCurrency(data.privateFunding)}</p>
              <div className="space-y-2">
                {Object.entries(data.byCategory)
                  .filter(([, v]) => v.tags?.includes('private_funding'))
                  .map(([code, cat]) => (
                    <div key={code} className="flex justify-between text-sm">
                      <span className="text-gray-400">{cat.name}</span>
                      <span className="text-white">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Aucun mécénat enregistré</p>
          )}
        </div>

        {/* Charges techniques */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">🔧 Charges techniques</h3>
          {data.technicalExpenses > 0 ? (
            <>
              <p className="text-3xl font-bold text-blue-400 mb-4">{formatCurrency(data.technicalExpenses)}</p>
              <div className="space-y-2">
                {Object.entries(data.byCategory)
                  .filter(([, v]) => v.tags?.includes('technical'))
                  .map(([code, cat]) => (
                    <div key={code} className="flex justify-between text-sm">
                      <span className="text-gray-400">{cat.name}</span>
                      <span className="text-white">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Aucune charge technique</p>
          )}
        </div>

        {/* Charges artistiques */}
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎭 Charges artistiques</h3>
          {data.artisticExpenses > 0 ? (
            <>
              <p className="text-3xl font-bold text-purple-400 mb-4">{formatCurrency(data.artisticExpenses)}</p>
              <div className="space-y-2">
                {Object.entries(data.byCategory)
                  .filter(([, v]) => v.tags?.includes('artistic'))
                  .map(([code, cat]) => (
                    <div key={code} className="flex justify-between text-sm">
                      <span className="text-gray-400">{cat.name}</span>
                      <span className="text-white">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Aucune charge artistique</p>
          )}
        </div>
      </div>

      {/* Ratio technique/artistique */}
      {(data.technicalExpenses > 0 || data.artisticExpenses > 0) && (
        <div className="mt-6 bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Ratio technique / artistique</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-[#222] rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(data.technicalExpenses / (data.technicalExpenses + data.artisticExpenses)) * 100}%`,
                }}
              />
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-blue-400">{Math.round((data.technicalExpenses / (data.technicalExpenses + data.artisticExpenses)) * 100)}%</span>
              {' / '}
              <span className="text-purple-400">{Math.round((data.artisticExpenses / (data.technicalExpenses + data.artisticExpenses)) * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
