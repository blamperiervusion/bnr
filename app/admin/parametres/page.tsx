'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FestivalDay {
  id: string;
  slug: string;
  name: string;
  date: string;
  openingTime: string;
  closingTime: string | null;
  isVisible: boolean;
  order: number;
}

export default function FestivalSettingsPage() {
  const [days, setDays] = useState<FestivalDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newDay, setNewDay] = useState({
    slug: '',
    name: '',
    date: '',
    openingTime: '14h00',
    closingTime: '02h00',
  });

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    try {
      const response = await fetch('/api/admin/festival/days');
      if (response.ok) {
        const data = await response.json();
        setDays(data);
      }
    } catch (error) {
      console.error('Error fetching days:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDay = async (id: string, updates: Partial<FestivalDay>) => {
    setSaving(id);
    try {
      const response = await fetch(`/api/admin/festival/days/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        setDays(days.map(d => d.id === id ? updated : d));
        setEditingDay(null);
      }
    } catch (error) {
      console.error('Error updating day:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleCreateDay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('new');
    try {
      const response = await fetch('/api/admin/festival/days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDay,
          order: days.length,
        }),
      });

      if (response.ok) {
        await fetchDays();
        setShowNewForm(false);
        setNewDay({
          slug: '',
          name: '',
          date: '',
          openingTime: '14h00',
          closingTime: '02h00',
        });
      }
    } catch (error) {
      console.error('Error creating day:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (!confirm('Supprimer cette journée ?')) return;

    try {
      const response = await fetch(`/api/admin/festival/days/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDays(days.filter(d => d.id !== id));
      }
    } catch (error) {
      console.error('Error deleting day:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-[#222] rounded"></div>
          <div className="h-40 bg-[#222] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour au dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">⚙️ Paramètres du festival</h1>
        <p className="text-gray-400 mt-1">Gérer les journées et horaires du festival</p>
      </div>

      {/* Journées du festival */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📅 Journées du festival</h2>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors"
          >
            + Ajouter une journée
          </button>
        </div>

        {/* Formulaire nouvelle journée */}
        {showNewForm && (
          <form onSubmit={handleCreateDay} className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Nouvelle journée</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Identifiant (slug)</label>
                <input
                  type="text"
                  value={newDay.slug}
                  onChange={(e) => setNewDay({ ...newDay, slug: e.target.value.toLowerCase() })}
                  placeholder="vendredi"
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nom affiché</label>
                <input
                  type="text"
                  value={newDay.name}
                  onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                  placeholder="Vendredi"
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newDay.date}
                  onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Heure d&apos;ouverture</label>
                <input
                  type="text"
                  value={newDay.openingTime}
                  onChange={(e) => setNewDay({ ...newDay, openingTime: e.target.value })}
                  placeholder="14h00"
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Heure de fermeture</label>
                <input
                  type="text"
                  value={newDay.closingTime}
                  onChange={(e) => setNewDay({ ...newDay, closingTime: e.target.value })}
                  placeholder="02h00"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={saving === 'new'}
                className="px-4 py-2 bg-[#e53e3e] text-white rounded hover:bg-[#c53030] disabled:opacity-50"
              >
                {saving === 'new' ? 'Enregistrement...' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 bg-[#222] text-gray-400 rounded hover:bg-[#333]"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste des journées */}
        {days.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-lg p-8 text-center">
            <p className="text-gray-400">Aucune journée configurée</p>
            <p className="text-sm text-gray-500 mt-2">
              Ajoutez les journées du festival pour pouvoir configurer les horaires
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.id}
                className={`bg-[#111] border rounded-lg p-6 ${
                  day.isVisible ? 'border-[#222]' : 'border-yellow-500/30 opacity-60'
                }`}
              >
                {editingDay === day.id ? (
                  <DayEditForm
                    day={day}
                    onSave={(updates) => handleUpdateDay(day.id, updates)}
                    onCancel={() => setEditingDay(null)}
                    saving={saving === day.id}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-4xl">
                        {day.slug === 'vendredi' ? '🎸' : day.slug === 'samedi' ? '🤘' : '🎵'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{day.name}</h3>
                        <p className="text-gray-400 text-sm">{formatDate(day.date)}</p>
                      </div>
                      <div className="bg-[#222] px-4 py-2 rounded-lg">
                        <span className="text-gray-400 text-sm">Ouverture</span>
                        <p className="text-white font-bold text-lg">{day.openingTime}</p>
                      </div>
                      {day.closingTime && (
                        <div className="bg-[#222] px-4 py-2 rounded-lg">
                          <span className="text-gray-400 text-sm">Fermeture</span>
                          <p className="text-white font-bold text-lg">{day.closingTime}</p>
                        </div>
                      )}
                      {!day.isVisible && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                          Masqué
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingDay(day.id)}
                        className="px-3 py-2 bg-[#222] text-white rounded hover:bg-[#333] transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteDay(day.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lien rapide vers programmation */}
      <section className="mt-8 p-6 bg-[#111] border border-[#222] rounded-lg">
        <h3 className="text-lg font-bold text-white mb-2">Liens utiles</h3>
        <div className="flex gap-4">
          <Link
            href="/admin/programmation"
            className="px-4 py-2 bg-[#222] text-white rounded hover:bg-[#333] transition-colors"
          >
            🎵 Gérer la programmation
          </Link>
          <Link
            href="/admin/village"
            className="px-4 py-2 bg-[#222] text-white rounded hover:bg-[#333] transition-colors"
          >
            🏕️ Gérer le village
          </Link>
        </div>
      </section>
    </div>
  );
}

function DayEditForm({
  day,
  onSave,
  onCancel,
  saving,
}: {
  day: FestivalDay;
  onSave: (updates: Partial<FestivalDay>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: day.name,
    slug: day.slug,
    date: day.date.split('T')[0],
    openingTime: day.openingTime,
    closingTime: day.closingTime || '',
    isVisible: day.isVisible,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Identifiant (slug)</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nom affiché</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Heure d&apos;ouverture</label>
          <input
            type="text"
            value={form.openingTime}
            onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
            placeholder="14h00"
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Heure de fermeture</label>
          <input
            type="text"
            value={form.closingTime}
            onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
            placeholder="02h00"
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id={`visible-${day.id}`}
            checked={form.isVisible}
            onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor={`visible-${day.id}`} className="text-gray-400">
            Visible sur le site
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[#e53e3e] text-white rounded hover:bg-[#c53030] disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-[#222] text-gray-400 rounded hover:bg-[#333]"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
