'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statusOptions = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'PAID', label: 'Payée' },
  { value: 'PROCESSING', label: 'En traitement' },
  { value: 'SHIPPED', label: 'Expédiée' },
  { value: 'DELIVERED', label: 'Livrée' },
  { value: 'CANCELLED', label: 'Annulée' },
  { value: 'REFUNDED', label: 'Remboursée' },
];

interface Props {
  orderId: string;
  currentStatus: string;
  hasPrintifyItems: boolean;
  alreadySentToPrintify: boolean;
}

export default function OrderActions({ orderId, currentStatus, hasPrintifyItems, alreadySentToPrintify }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [printifyLoading, setPrintifyLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateStatus = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/boutique/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: notes || undefined }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Statut mis à jour !' });
        router.refresh();
      } else {
        const d = await res.json();
        setMessage({ type: 'error', text: d.error || 'Erreur' });
      }
    } finally {
      setLoading(false);
    }
  };

  const sendToPrintify = async () => {
    setPrintifyLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/boutique/orders/${orderId}/printify`, {
        method: 'POST',
      });
      const d = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Commande envoyée à Printify !' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: d.error || 'Erreur Printify' });
      }
    } finally {
      setPrintifyLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold text-white">Actions</h2>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </p>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Changer le statut</label>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={updateStatus}
            disabled={loading || status === currentStatus}
            className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notes internes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Ajouter une note..."
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e] resize-none"
        />
        <button
          onClick={updateStatus}
          disabled={loading || !notes.trim()}
          className="mt-2 px-4 py-1.5 bg-[#222] border border-[#333] text-gray-300 rounded-lg hover:bg-[#333] transition-colors text-xs disabled:opacity-50"
        >
          Enregistrer la note
        </button>
      </div>

      {hasPrintifyItems && (
        <div className="border-t border-[#222] pt-4">
          <p className="text-sm text-gray-400 mb-3">
            Cette commande contient des articles Printify.
          </p>
          {alreadySentToPrintify ? (
            <p className="text-green-400 text-sm flex items-center gap-2">
              <span>✓</span> Déjà envoyée à Printify
            </p>
          ) : (
            <button
              onClick={sendToPrintify}
              disabled={printifyLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {printifyLoading ? 'Envoi...' : '🖨️ Envoyer à Printify'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
