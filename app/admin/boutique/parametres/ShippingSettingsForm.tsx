'use client';

import { useEffect, useState } from 'react';

export default function ShippingSettingsForm() {
  const [shippingCost, setShippingCost] = useState('');
  const [freeThreshold, setFreeThreshold] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/boutique/settings')
      .then((r) => r.json())
      .then((data) => {
        setShippingCost(data.boutique_shipping_cost ?? '5.00');
        setFreeThreshold(data.boutique_free_shipping_threshold ?? '0');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch('/api/admin/boutique/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boutique_shipping_cost: shippingCost,
        boutique_free_shipping_threshold: freeThreshold,
      }),
    });

    if (res.ok) {
      setMessage({ type: 'success', text: 'Paramètres enregistrés !' });
    } else {
      const d = await res.json();
      setMessage({ type: 'error', text: d.error || 'Erreur lors de la sauvegarde' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-[#222] rounded w-1/3" />
          <div className="h-10 bg-[#1a1a1a] rounded" />
          <div className="h-10 bg-[#1a1a1a] rounded" />
        </div>
      </div>
    );
  }

  const freeThresholdNum = parseFloat(freeThreshold);
  const shippingCostNum = parseFloat(shippingCost);

  return (
    <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Frais de livraison</h2>
        <p className="text-sm text-gray-500">
          Ces paramètres s&apos;appliquent à toutes les commandes passées sur la boutique.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Frais de port (€)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="w-36 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e] text-sm"
          />
          <span className="text-sm text-gray-400">
            {shippingCostNum === 0 ? 'Livraison gratuite pour tous' : `${shippingCostNum.toFixed(2).replace('.', ',')} € par commande`}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">Mettre 0 pour offrir la livraison à tous.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Livraison gratuite à partir de (€)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={freeThreshold}
            onChange={(e) => setFreeThreshold(e.target.value)}
            className="w-36 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e] text-sm"
          />
          <span className="text-sm text-gray-400">
            {freeThresholdNum === 0
              ? 'Seuil désactivé'
              : `Gratuit dès ${freeThresholdNum.toFixed(2).replace('.', ',')} € d'achat`}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">Mettre 0 pour désactiver la livraison gratuite conditionnelle.</p>
      </div>

      {/* Preview */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 text-sm space-y-1">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Aperçu</p>
        {shippingCostNum === 0 ? (
          <p className="text-green-400">✓ Livraison offerte sur toutes les commandes</p>
        ) : freeThresholdNum > 0 ? (
          <>
            <p className="text-gray-300">
              Commande &lt; {freeThresholdNum.toFixed(2).replace('.', ',')} € → frais de port : <strong className="text-white">{shippingCostNum.toFixed(2).replace('.', ',')} €</strong>
            </p>
            <p className="text-green-400">
              Commande ≥ {freeThresholdNum.toFixed(2).replace('.', ',')} € → <strong>livraison gratuite</strong>
            </p>
          </>
        ) : (
          <p className="text-gray-300">
            Frais de port : <strong className="text-white">{shippingCostNum.toFixed(2).replace('.', ',')} €</strong> sur toutes les commandes
          </p>
        )}
      </div>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 bg-[#e53e3e] text-white font-medium rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
