'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Volunteer } from '@prisma/client';

const teamOptions = [
  'Accueil',
  'Bar',
  'Sécurité',
  'Technique',
  'Éco-équipe',
  'Animation',
  'Merchandising',
  'Artistes',
  'Cashless',
];

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  { value: 'VALIDATED', label: 'Validé', color: 'bg-green-500/20 text-green-500' },
  { value: 'REFUSED', label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
];

interface VolunteerFormProps {
  volunteer: Volunteer;
}

export default function VolunteerForm({ volunteer }: VolunteerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    status: volunteer.status,
    team: volunteer.team || '',
    notes: volunteer.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/volunteers/${volunteer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Modifications enregistrées' });
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la sauvegarde' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/volunteers/${volunteer.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/benevoles');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Gestion de la candidature</h2>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Statut
          </label>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: option.value as typeof formData.status })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.status === option.value
                    ? option.color + ' ring-2 ring-white/20'
                    : 'bg-[#222] text-gray-400 hover:bg-[#333]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Équipe attribuée
          </label>
          <select
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
          >
            <option value="">Non attribuée</option>
            {teamOptions.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Notes internes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Notes pour l'équipe d'organisation..."
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222]">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            Supprimer
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
