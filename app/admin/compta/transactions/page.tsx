'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  code: string;
  name: string;
  type: string;
  tags: string | null;
}

interface Transaction {
  id: string;
  date: string;
  label: string;
  amount: string;
  type: 'debit' | 'credit';
  categoryId: string | null;
  category: Category | null;
  isReconciled: boolean;
  notes: string | null;
  exerciceYear: number;
}

interface TransactionCounts {
  total: number;
  uncategorized: number;
  credits: number;
  debits: number;
}

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get('year');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<TransactionCounts>({ total: 0, uncategorized: 0, credits: 0, debits: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'uncategorized' | 'debit' | 'credit'>('all');
  const [yearFilter, setYearFilter] = useState<number>(yearParam ? parseInt(yearParam) : new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<string>('');
  
  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'none' | 'year' | 'category' | 'type'>('none');
  const [bulkYear, setBulkYear] = useState<number>(new Date().getFullYear());
  const [bulkCategoryId, setBulkCategoryId] = useState<string>('');
  const [bulkType, setBulkType] = useState<'debit' | 'credit'>('debit');

  useEffect(() => {
    fetchData();
    fetchCounts();
  }, [filter, yearFilter, searchQuery]);

  useEffect(() => {
    fetchCounts();
  }, [yearFilter]);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`/api/admin/compta/transactions/counts?year=${yearFilter}`);
      const data = await res.json();
      setCounts(data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('year', yearFilter.toString());
      if (filter === 'uncategorized') params.set('uncategorized', 'true');
      if (filter === 'debit' || filter === 'credit') params.set('type', filter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const [transRes, catRes] = await Promise.all([
        fetch(`/api/admin/compta/transactions?${params}`),
        fetch('/api/admin/compta/categories'),
      ]);

      const transData = await transRes.json();
      const catData = await catRes.json();

      setTransactions(transData);
      setCategories(catData.categories || []);
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (transactionId: string, categoryId: string) => {
    try {
      await fetch(`/api/admin/compta/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: categoryId || null }),
      });
      
      setEditingId(null);
      fetchData();
      fetchCounts();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map(t => t.id)));
    }
  };

  const handleBulkUpdate = async (updateData: Record<string, unknown>) => {
    if (selectedIds.size === 0) return;
    
    try {
      await fetch('/api/admin/compta/transactions/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          ...updateData,
        }),
      });
      
      setBulkAction('none');
      setSelectedIds(new Set());
      fetchData();
      fetchCounts();
    } catch (error) {
      console.error('Error bulk updating:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Supprimer ${selectedIds.size} transaction(s) ?`)) return;
    
    try {
      await fetch('/api/admin/compta/transactions/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      
      setSelectedIds(new Set());
      fetchData();
      fetchCounts();
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const formatCurrency = (amount: string) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(amount));

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('fr-FR');

  const chargeCategories = categories.filter(c => c.type === 'charge');
  const produitCategories = categories.filter(c => c.type === 'produit');

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la comptabilité
        </Link>
        <h1 className="text-3xl font-bold text-white">📋 Transactions</h1>
        <p className="text-gray-400 mt-1">Gérer et catégoriser les transactions</p>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6 space-y-4">
        {/* Ligne 1: Recherche + Exercice */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Rechercher dans les libellés..."
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-[#e53e3e] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Exercice :</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/compta/import"
              className="px-4 py-2 bg-[#222] text-gray-300 rounded-lg hover:bg-[#333] transition-colors"
            >
              📥 Importer
            </Link>
            <Link
              href="/admin/compta/transactions/nouveau"
              className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
            >
              ➕ Nouvelle
            </Link>
          </div>
        </div>

        {/* Ligne 2: Filtres type avec compteurs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Toutes', count: counts.total, color: '' },
            { value: 'uncategorized', label: '⚠️ Non catégorisées', count: counts.uncategorized, color: 'bg-yellow-500' },
            { value: 'credit', label: '📈 Crédits', count: counts.credits, color: 'bg-green-500' },
            { value: 'debit', label: '📉 Débits', count: counts.debits, color: 'bg-red-500' },
          ].map(({ value, label, count, color }) => (
            <button
              key={value}
              onClick={() => setFilter(value as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                filter === value
                  ? 'bg-[#e53e3e] text-white'
                  : 'bg-[#222] text-gray-400 hover:bg-[#333]'
              }`}
            >
              {label}
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                filter === value 
                  ? 'bg-white/20 text-white' 
                  : color ? `${color}/20 text-white` : 'bg-gray-600 text-gray-300'
              }`}>
                {count}
              </span>
            </button>
          ))}
          {searchQuery && (
            <span className="px-4 py-2 text-sm text-cyan-400">
              Recherche : &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-400 font-medium">
              {selectedIds.size} transaction(s) sélectionnée(s)
            </span>
            <button
              onClick={() => { setSelectedIds(new Set()); setBulkAction('none'); }}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕ Désélectionner
            </button>
          </div>
          
          {bulkAction === 'none' ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBulkAction('category')}
                className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                🏷️ Catégoriser
              </button>
              <button
                onClick={() => setBulkAction('type')}
                className="px-3 py-1.5 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                🔄 Changer le type
              </button>
              <button
                onClick={() => setBulkAction('year')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                📅 Changer l&apos;année
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                🗑️ Supprimer
              </button>
            </div>
          ) : bulkAction === 'year' ? (
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Nouvelle année :</label>
              <select
                value={bulkYear}
                onChange={(e) => setBulkYear(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={() => handleBulkUpdate({ exerciceYear: bulkYear })}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                ✓ Appliquer
              </button>
              <button
                onClick={() => setBulkAction('none')}
                className="px-3 py-1.5 bg-[#333] text-gray-300 rounded text-sm hover:bg-[#444]"
              >
                Annuler
              </button>
            </div>
          ) : bulkAction === 'category' ? (
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Catégorie :</label>
              <select
                value={bulkCategoryId}
                onChange={(e) => setBulkCategoryId(e.target.value)}
                className="px-3 py-1.5 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm min-w-[250px]"
              >
                <option value="">-- Aucune catégorie --</option>
                <optgroup label="Charges">
                  {chargeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Produits">
                  {produitCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <button
                onClick={() => handleBulkUpdate({ categoryId: bulkCategoryId || null })}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                ✓ Appliquer
              </button>
              <button
                onClick={() => setBulkAction('none')}
                className="px-3 py-1.5 bg-[#333] text-gray-300 rounded text-sm hover:bg-[#444]"
              >
                Annuler
              </button>
            </div>
          ) : bulkAction === 'type' ? (
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Nouveau type :</label>
              <select
                value={bulkType}
                onChange={(e) => setBulkType(e.target.value as 'debit' | 'credit')}
                className="px-3 py-1.5 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
              >
                <option value="debit">📉 Débit (charge)</option>
                <option value="credit">📈 Crédit (produit)</option>
              </select>
              <button
                onClick={() => handleBulkUpdate({ type: bulkType })}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                ✓ Appliquer
              </button>
              <button
                onClick={() => setBulkAction('none')}
                className="px-3 py-1.5 bg-[#333] text-gray-300 rounded text-sm hover:bg-[#444]"
              >
                Annuler
              </button>
            </div>
          ) : null}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">📋</span>
          <h2 className="text-xl font-bold text-white mb-2">Aucune transaction</h2>
          <p className="text-gray-400 mb-6">
            {filter === 'uncategorized'
              ? 'Toutes les transactions sont catégorisées !'
              : 'Commencez par importer un relevé bancaire'}
          </p>
          <Link
            href="/admin/compta/import"
            className="inline-block px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            📥 Importer un relevé
          </Link>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === transactions.length && transactions.length > 0}
                    onChange={selectAll}
                    className="rounded border-[#444] bg-[#222]"
                  />
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Libellé</th>
                <th className="text-left p-4 text-gray-400 font-medium">Catégorie</th>
                <th className="text-right p-4 text-gray-400 font-medium">Montant</th>
                <th className="p-4 text-gray-400 font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr 
                  key={t.id} 
                  className={`border-b border-[#222] hover:bg-[#1a1a1a] ${
                    selectedIds.has(t.id) ? 'bg-blue-500/10' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(t.id)}
                      onChange={() => toggleSelection(t.id)}
                      className="rounded border-[#444] bg-[#222]"
                    />
                  </td>
                  <td className="p-4 text-gray-300">{formatDate(t.date)}</td>
                  <td className="p-4">
                    <span className="text-white">{t.label}</span>
                  </td>
                  <td className="p-4">
                    {editingId === t.id ? (
                      <div className="flex gap-2">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                        >
                          <option value="">-- Aucune --</option>
                          {t.type === 'debit' ? (
                            <optgroup label="Charges">
                              {chargeCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.code} - {c.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : (
                            <optgroup label="Produits">
                              {produitCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.code} - {c.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <button
                          onClick={() => handleCategoryChange(t.id, editCategory)}
                          className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(t.id);
                          setEditCategory(t.categoryId || '');
                        }}
                        className={`px-2 py-1 rounded text-sm ${
                          t.category
                            ? 'bg-[#222] text-gray-300 hover:bg-[#333]'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                      >
                        {t.category ? (
                          <span>{t.category.code} - {t.category.name}</span>
                        ) : (
                          <span>⚠️ À catégoriser</span>
                        )}
                      </button>
                    )}
                  </td>
                  <td className={`p-4 text-right font-mono font-bold ${
                    t.type === 'credit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 justify-center">
                      <Link
                        href={`/admin/compta/transactions/${t.id}/detail`}
                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Détailler"
                      >
                        📝
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
