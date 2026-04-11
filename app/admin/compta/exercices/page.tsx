'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Exercice {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  openingBalance: string;
  closingBalance: string | null;
  calculatedBalance: string;
  totalCredits: string;
  totalDebits: string;
  transactionCount: number;
}

export default function ExercicesPage() {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newBalance, setNewBalance] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchExercices();
  }, []);

  const fetchExercices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/compta/exercices');
      const data = await res.json();
      setExercices(data);
    } catch (error) {
      console.error('Error fetching exercices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (year: number) => {
    try {
      await fetch('/api/admin/compta/exercices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          openingBalance: parseFloat(editValue.replace(',', '.')) || 0,
        }),
      });
      setEditingYear(null);
      fetchExercices();
    } catch (error) {
      console.error('Error saving exercice:', error);
    }
  };

  const handleCreateNew = async () => {
    try {
      await fetch('/api/admin/compta/exercices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: newYear,
          openingBalance: parseFloat(newBalance.replace(',', '.')) || 0,
        }),
      });
      setShowNewForm(false);
      setNewBalance('');
      fetchExercices();
    } catch (error) {
      console.error('Error creating exercice:', error);
    }
  };

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(value));

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la comptabilité
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">📅 Exercices comptables</h1>
            <p className="text-gray-400 mt-1">Gérer les exercices et soldes d&apos;ouverture</p>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            ➕ Nouvel exercice
          </button>
        </div>
      </div>

      {/* New exercice form */}
      {showNewForm && (
        <div className="mb-6 p-6 bg-[#111] border border-[#222] rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">Créer un nouvel exercice</h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Année</label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(parseInt(e.target.value))}
                className="px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white w-32"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Solde d&apos;ouverture (€)</label>
              <input
                type="text"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0,00"
                className="px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white w-40"
              />
            </div>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : exercices.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">📅</span>
          <h2 className="text-xl font-bold text-white mb-2">Aucun exercice</h2>
          <p className="text-gray-400">Créez votre premier exercice comptable</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exercices.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#111] border border-[#222] rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Exercice {ex.year}
                    {ex.isClosed && (
                      <span className="ml-3 text-sm px-2 py-1 bg-gray-600 text-gray-300 rounded">
                        Clôturé
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Du 01/01/{ex.year} au 31/12/{ex.year}
                  </p>
                </div>
                <span className="text-gray-400">
                  {ex.transactionCount} transaction{ex.transactionCount > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Solde d'ouverture */}
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Solde d&apos;ouverture</p>
                  {editingYear === ex.year ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-2 py-1 bg-[#222] border border-[#444] rounded text-white w-24"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(ex.year)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingYear(null)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-blue-400">
                        {formatCurrency(ex.openingBalance)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingYear(ex.year);
                          setEditValue(ex.openingBalance);
                        }}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>

                {/* Total crédits */}
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Total crédits</p>
                  <span className="text-xl font-bold text-green-400">
                    +{formatCurrency(ex.totalCredits)}
                  </span>
                </div>

                {/* Total débits */}
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Total débits</p>
                  <span className="text-xl font-bold text-red-400">
                    -{formatCurrency(ex.totalDebits)}
                  </span>
                </div>

                {/* Solde calculé */}
                <div className="bg-[#0a0a0a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Solde actuel</p>
                  <span className={`text-xl font-bold ${
                    parseFloat(ex.calculatedBalance) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(ex.calculatedBalance)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#222] flex gap-2">
                <Link
                  href={`/admin/compta/transactions?year=${ex.year}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Voir les transactions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">💡 À propos des soldes</h4>
        <p className="text-gray-400 text-sm">
          Le <strong>solde d&apos;ouverture</strong> est le montant sur votre compte bancaire au 1er janvier de l&apos;exercice.
          Il correspond au solde de clôture de l&apos;exercice précédent.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Pour votre relevé de janvier 2025, le solde d&apos;ouverture est l&apos;<strong>Ancien solde créditeur au 31.12.2024</strong> qui figure en haut du relevé.
        </p>
      </div>
    </div>
  );
}
