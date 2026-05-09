'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceLine {
  description: string;
  amount: number;
}

interface Partner {
  id: string;
  company: string;
  contact: string;
  siret: string | null;
  address: string | null;
  donationAmount: number | null;
}

interface InvoiceFormProps {
  partners: Partner[];
  onSuccess?: () => void;
}

export default function InvoiceForm({ partners, onSuccess }: InvoiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    partnerId: '',
    clientName: '',
    clientSiret: '',
    clientAddress: '',
    clientContact: '',
    clientEmail: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentDate: '',
    paymentMethod: 'virement',
    notes: '',
  });

  const [lines, setLines] = useState<InvoiceLine[]>([
    { description: '', amount: 0 },
  ]);

  const totalAmount = lines.reduce((sum, l) => sum + (l.amount || 0), 0);

  const handlePartnerSelect = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (partner) {
      setForm((prev) => ({
        ...prev,
        partnerId,
        clientName: partner.company,
        clientSiret: partner.siret || '',
        clientAddress: partner.address || '',
        clientContact: partner.contact,
      }));
      if (partner.donationAmount) {
        setLines([{ description: `Partenariat Barb'n'Rock Festival 2026`, amount: partner.donationAmount }]);
      }
    } else {
      setForm((prev) => ({ ...prev, partnerId: '' }));
    }
  };

  const addLine = () => setLines([...lines, { description: '', amount: 0 }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof InvoiceLine, value: string | number) => {
    setLines(lines.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const handleSubmit = async (e: React.FormEvent, generatePdf = false) => {
    e.preventDefault();
    if (!form.clientName || lines.every((l) => !l.description)) {
      setMessage({ type: 'error', text: 'Nom du client et au moins une ligne requise' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          lines: lines.filter((l) => l.description),
          totalAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' });
        return;
      }

      const { invoice } = await res.json();
      setMessage({ type: 'success', text: `Facture ${invoice.invoiceNumber} créée` });

      if (generatePdf) {
        const pdfRes = await fetch(`/api/admin/invoices/${invoice.id}/pdf`, {
          method: 'POST',
          credentials: 'include',
        });
        if (pdfRes.ok) {
          const blob = await pdfRes.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `facture-${invoice.invoiceNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }

      router.refresh();
      onSuccess?.();
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Nouvelle facture</h2>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">

        {/* Pré-remplir depuis un partenaire */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Pré-remplir depuis un partenaire (optionnel)
          </label>
          <select
            value={form.partnerId}
            onChange={(e) => handlePartnerSelect(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
          >
            <option value="">— Facture libre —</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>{p.company}</option>
            ))}
          </select>
        </div>

        {/* Infos client */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Raison sociale *</label>
              <input
                type="text"
                required
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="Entreprise SAS"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">SIRET</label>
              <input
                type="text"
                value={form.clientSiret}
                onChange={(e) => setForm({ ...form, clientSiret: e.target.value })}
                placeholder="123 456 789 00012"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Contact</label>
              <input
                type="text"
                value={form.clientContact}
                onChange={(e) => setForm({ ...form, clientContact: e.target.value })}
                placeholder="Prénom Nom"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                placeholder="contact@entreprise.fr"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Adresse</label>
              <input
                type="text"
                value={form.clientAddress}
                onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                placeholder="123 rue de la Paix, 75000 Paris"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dates & paiement */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Dates &amp; règlement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Date de la facture</label>
              <input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Date de règlement</label>
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Mode de règlement</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              >
                <option value="virement">Virement bancaire</option>
                <option value="cheque">Chèque</option>
                <option value="especes">Espèces</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lignes de facturation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Lignes *</h3>
            <button
              type="button"
              onClick={addLine}
              className="text-xs px-3 py-1.5 bg-[#222] text-gray-300 rounded hover:bg-[#333] transition-colors"
            >
              + Ajouter une ligne
            </button>
          </div>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={line.description}
                  onChange={(e) => updateLine(i, 'description', e.target.value)}
                  placeholder="Désignation de la prestation"
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#e53e3e] focus:outline-none text-sm"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.amount || ''}
                    onChange={(e) => updateLine(i, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-28 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2.5 text-white focus:border-[#e53e3e] focus:outline-none text-sm text-right"
                  />
                  <span className="text-gray-500 text-sm">€</span>
                </div>
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    className="text-red-500 hover:text-red-400 text-lg leading-none shrink-0 w-6"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3 pt-3 border-t border-[#222]">
            <div className="bg-[#e53e3e] text-white px-4 py-2 rounded-lg font-bold">
              Total : {totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Notes (apparaissent sur la facture)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="Informations complémentaires..."
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none resize-none text-sm"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-2 border-t border-[#222]">
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
            className="px-5 py-2.5 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 text-sm font-medium"
          >
            Créer la facture
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
            className="px-5 py-2.5 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50 text-sm font-semibold"
          >
            {isLoading ? 'Génération…' : 'Créer + télécharger PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}
