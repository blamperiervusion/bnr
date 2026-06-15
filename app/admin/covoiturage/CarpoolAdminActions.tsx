'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Status = 'PENDING' | 'VISIBLE' | 'HIDDEN';

export default function CarpoolAdminActions({
  offerId,
  currentStatus,
}: {
  offerId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: Status) {
    setLoading(true);
    await fetch(`/api/admin/covoiturage/${offerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  async function deleteOffer() {
    if (!confirm('Supprimer cette annonce ?')) return;
    setLoading(true);
    await fetch(`/api/admin/covoiturage/${offerId}`, { method: 'DELETE' });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {currentStatus !== 'VISIBLE' && (
        <button
          onClick={() => setStatus('VISIBLE')}
          disabled={loading}
          className="px-2 py-1 text-xs rounded font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
        >
          Publier
        </button>
      )}
      {currentStatus !== 'HIDDEN' && currentStatus !== 'PENDING' && (
        <button
          onClick={() => setStatus('HIDDEN')}
          disabled={loading}
          className="px-2 py-1 text-xs rounded font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
        >
          Masquer
        </button>
      )}
      {currentStatus !== 'PENDING' && (
        <button
          onClick={() => setStatus('PENDING')}
          disabled={loading}
          className="px-2 py-1 text-xs rounded font-medium bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors disabled:opacity-50"
        >
          En attente
        </button>
      )}
      <button
        onClick={deleteOffer}
        disabled={loading}
        className="px-2 py-1 text-xs rounded font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
