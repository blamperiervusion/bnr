'use client';

import { useState } from 'react';

interface PartnerActionsProps {
  partnerId: string;
  companyName: string;
  hasDonation: boolean;
  hasSiret: boolean;
}

export default function PartnerActions({
  partnerId,
  companyName,
  hasDonation,
  hasSiret,
}: PartnerActionsProps) {
  const [loading, setLoading] = useState<'invoice' | 'cerfa' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slug = companyName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

  const downloadPdf = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleInvoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasDonation) return;

    setLoading('invoice');
    setError(null);
    try {
      const response = await fetch(`/api/admin/invoice/${partnerId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        downloadPdf(blob, `facture-${slug}.pdf`);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur');
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Erreur réseau');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(null);
    }
  };

  const handleCerfa = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasDonation || !hasSiret) return;

    setLoading('cerfa');
    setError(null);
    try {
      const response = await fetch(`/api/admin/cerfa/${partnerId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentForm: 'virement' }),
      });
      if (response.ok) {
        const blob = await response.blob();
        downloadPdf(blob, `cerfa-2041-MEC-SD-${slug}.pdf`);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur');
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Erreur réseau');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {error && (
        <span className="text-red-400 text-xs mr-1">{error}</span>
      )}
      <button
        onClick={handleInvoice}
        disabled={!hasDonation || loading !== null}
        title={hasDonation ? 'Générer la facture' : 'Montant requis'}
        className="px-2 py-1 rounded text-xs font-medium transition-colors bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading === 'invoice' ? '…' : '🧾 Facture'}
      </button>
      <button
        onClick={handleCerfa}
        disabled={!hasDonation || !hasSiret || loading !== null}
        title={!hasDonation ? 'Montant requis' : !hasSiret ? 'SIRET requis' : 'Générer le CERFA'}
        className="px-2 py-1 rounded text-xs font-medium transition-colors bg-green-700/20 text-green-400 hover:bg-green-700/40 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading === 'cerfa' ? '…' : '📋 CERFA'}
      </button>
    </div>
  );
}
