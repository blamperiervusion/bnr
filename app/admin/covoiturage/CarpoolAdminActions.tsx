'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Status = 'PENDING' | 'VISIBLE' | 'HIDDEN';

export default function CarpoolAdminActions({
  offerId,
  currentStatus,
  currentCity,
  hasCoords,
}: {
  offerId: string;
  currentStatus: Status;
  currentCity: string;
  hasCoords: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [cityInput, setCityInput] = useState(currentCity);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'not_found'>('idle');

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

  async function updateLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setLocationStatus('loading');
    try {
      const res = await fetch(`/api/admin/covoiturage/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLocationStatus('error');
        return;
      }
      setLocationStatus(data.geocoded ? 'success' : 'not_found');
      if (data.geocoded) {
        setTimeout(() => {
          setShowLocationForm(false);
          setLocationStatus('idle');
          router.refresh();
        }, 1500);
      }
    } catch {
      setLocationStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-2">
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
          onClick={() => { setShowLocationForm(v => !v); setLocationStatus('idle'); }}
          disabled={loading}
          className={`px-2 py-1 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
            !hasCoords
              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          }`}
          title={hasCoords ? 'Corriger la position sur la carte' : 'Aucune coordonnée — corriger la ville'}
        >
          {hasCoords ? '📍 Position' : '⚠️ Position'}
        </button>
        <button
          onClick={deleteOffer}
          disabled={loading}
          className="px-2 py-1 text-xs rounded font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>

      {showLocationForm && (
        <form onSubmit={updateLocation} className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={cityInput}
            onChange={e => { setCityInput(e.target.value); setLocationStatus('idle'); }}
            placeholder="Nom de la ville…"
            className="flex-1 min-w-0 px-2 py-1 text-xs rounded bg-[#1a1a1a] border border-[#333] text-white outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={locationStatus === 'loading' || !cityInput.trim()}
            className="px-2 py-1 text-xs rounded font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {locationStatus === 'loading' ? '…' : 'Géocoder'}
          </button>
          {locationStatus === 'success' && <span className="text-xs text-green-400">✓</span>}
          {locationStatus === 'not_found' && <span className="text-xs text-orange-400">Ville introuvable</span>}
          {locationStatus === 'error' && <span className="text-xs text-red-400">Erreur</span>}
        </form>
      )}
    </div>
  );
}
