'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  code: string;
  name: string;
  type: string;
}

export default function NewTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    label: '',
    description: '',
    amount: '',
    type: 'debit' as 'debit' | 'credit',
    categoryId: '',
    exerciceYear: new Date().getFullYear(),
    notes: '',
  });

  useEffect(() => {
    fetch('/api/admin/compta/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/compta/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount.replace(',', '.')),
          date: new Date(formData.date),
        }),
      });

      if (response.ok) {
        router.push('/admin/compta/transactions');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chargeCategories = categories.filter(c => c.type === 'charge');
  const produitCategories = categories.filter(c => c.type === 'produit');

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta/transactions"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour aux transactions
        </Link>
        <h1 className="text-3xl font-bold text-white">➕ Nouvelle transaction</h1>
        <p className="text-gray-400 mt-1">Ajouter une transaction manuellement</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'debit', categoryId: '' })}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                    formData.type === 'debit'
                      ? 'bg-red-900/30 border border-red-500 text-red-400'
                      : 'bg-[#222] border border-[#333] text-gray-400'
                  }`}
                >
                  Dépense (Débit)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'credit', categoryId: '' })}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                    formData.type === 'credit'
                      ? 'bg-green-900/30 border border-green-500 text-green-400'
                      : 'bg-[#222] border border-[#333] text-gray-400'
                  }`}
                >
                  Recette (Crédit)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Libellé *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              placeholder="Ex: Virement HelloAsso, Location sono..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description (optionnel)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails complémentaires"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Montant * (€)
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="123,45"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Exercice
              </label>
              <select
                value={formData.exerciceYear}
                onChange={(e) => setFormData({ ...formData, exerciceYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Catégorie comptable
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            >
              <option value="">-- Non catégorisé --</option>
              
              {formData.type === 'debit' && chargeCategories.length > 0 && (
                <optgroup label="📤 Charges">
                  {chargeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.code} - {cat.name}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {formData.type === 'credit' && produitCategories.length > 0 && (
                <optgroup label="📥 Produits">
                  {produitCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.code} - {cat.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes internes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Notes pour vous-même..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#333]">
            <Link
              href="/admin/compta/transactions"
              className="px-6 py-3 bg-[#222] text-gray-400 rounded-lg hover:bg-[#333] transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '⏳ Création...' : '✓ Créer la transaction'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
