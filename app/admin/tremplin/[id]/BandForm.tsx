'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TremplinBand } from '@prisma/client';

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-500' },
  { value: 'PRESELECTED', label: 'Présélectionné', color: 'bg-blue-500' },
  { value: 'SELECTED', label: 'Sélectionné', color: 'bg-green-500' },
  { value: 'REJECTED', label: 'Refusé', color: 'bg-red-500' },
];

export default function BandForm({ band }: { band: TremplinBand }) {
  const router = useRouter();
  const [status, setStatus] = useState(band.status);
  const [rating, setRating] = useState(band.rating || 0);
  const [notes, setNotes] = useState(band.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resendRejection, setResendRejection] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, unknown> = { 
        status, 
        rating: rating || null, 
        notes: notes || null 
      };
      
      if (resendRejection && status === 'REJECTED') {
        payload.rejectionEmailSent = false;
      }

      const response = await fetch(`/api/admin/tremplin/${band.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.emailSent) {
          setMessage({ type: 'success', text: '✅ Email de refus envoyé au groupe' });
        } else if (status === 'REJECTED' && band.rejectionEmailSent && !resendRejection) {
          setMessage({ type: 'info', text: 'ℹ️ Email de refus déjà envoyé précédemment' });
        } else {
          setMessage({ type: 'success', text: '✅ Modifications enregistrées' });
        }
        setResendRejection(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: '❌ Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tremplin/${band.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/tremplin');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-6">⚙️ Gestion</h3>

      {/* Message de feedback */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400' :
          message.type === 'error' ? 'bg-red-500/20 text-red-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Status */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 block mb-2">Statut</label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatus(option.value as typeof status)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                status === option.value
                  ? `${option.color} border-transparent text-white`
                  : 'border-[#333] text-gray-400 hover:border-[#555]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Info email de refus */}
        {status === 'REJECTED' && !band.rejectionEmailSent && band.status !== 'REJECTED' && (
          <p className="mt-3 text-sm text-orange-400">
            📧 Un email de refus avec le code promo TREMPLIN26 sera envoyé au groupe
          </p>
        )}
        
        {/* Option pour renvoyer l'email de refus */}
        {status === 'REJECTED' && band.rejectionEmailSent && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-green-500">✅ Email de refus déjà envoyé</span>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={resendRejection}
                onChange={(e) => setResendRejection(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              Renvoyer l&apos;email
            </label>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 block mb-2">Note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(rating === star ? 0 : star)}
              className={`text-3xl transition-colors ${
                star <= rating ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <button
              onClick={() => setRating(0)}
              className="ml-2 text-sm text-gray-500 hover:text-white"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 block mb-2">Notes internes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Ajouter des notes sur ce groupe..."
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDeleting ? '⏳ Suppression...' : '🗑️ Supprimer'}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
        >
          {isSaving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
        </button>
      </div>
    </div>
  );
}
