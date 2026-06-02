'use client';

import { useState } from 'react';

const defaultForm = {
  dossierRef: '',
  documentNumber: 'DP-SACEM-2026-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  amount: '1500',
  tvaMode: 'subvention_non_imposable' as const,
  siret: '',
  addressLine: 'Crèvecœur-le-Grand',
  postalCode: '60360',
  city: 'Crèvecœur-le-Grand',
  contactName: 'Benjamin Lampérier',
  phone: '',
  email: 'barbnrock.festival@gmail.com',
  accountHolder: 'Association Crépicordienne pour la Promotion de la Culture',
  iban: '',
  bic: '',
  bankName: '',
  aidSubject:
    "Aide financière Action culturelle de la Sacem — programme Festivals et salles 2026, au titre de l'organisation du Barb'n'Rock Festival (26, 27 et 28 juin 2026, Crèvecœur-le-Grand, Oise). Montant alloué par convention : 1 500,00 €.",
};

export default function SacemInvoiceForm() {
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/invoices/sacem/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          dossierRef: form.dossierRef.trim(),
          documentNumber: form.documentNumber.trim(),
          invoiceDate: form.invoiceDate,
          amount: parseFloat(form.amount),
          tvaMode: form.tvaMode,
          beneficiary: {
            legalForm: 'Association loi 1901',
            siret: form.siret.trim(),
            addressLine: form.addressLine,
            postalCode: form.postalCode,
            city: form.city,
            contactName: form.contactName,
            phone: form.phone.trim(),
            email: form.email.trim(),
          },
          bank: {
            accountHolder: form.accountHolder,
            iban: form.iban.replace(/\s/g, ''),
            bic: form.bic.trim(),
            bankName: form.bankName || undefined,
          },
          aidSubject: form.aidSubject,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Erreur génération PDF' });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sacem-${form.dossierRef.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage({ type: 'success', text: 'PDF généré — joignez aussi le RIB à votre email Sacem' });
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6 max-w-2xl">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            N° dossier Sacem * (MA01-26xxxxx ou MA03-26xxxxx)
          </label>
          <input
            required
            value={form.dossierRef}
            onChange={(e) => setForm({ ...form, dossierRef: e.target.value })}
            placeholder="MA01-26xxxxx"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">N° pièce</label>
            <input
              value={form.documentNumber}
              onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
            <input
              type="date"
              required
              value={form.invoiceDate}
              onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Montant (€) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Régime TVA</label>
            <select
              value={form.tvaMode}
              onChange={(e) =>
                setForm({
                  ...form,
                  tvaMode: e.target.value as 'subvention_non_imposable' | 'facture_avec_tva',
                })
              }
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="subvention_non_imposable">
                Subvention non imposable (demande de paiement)
              </option>
              <option value="facture_avec_tva">Facture avec TVA 20 %</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">SIRET ACPC *</label>
          <input
            required
            value={form.siret}
            onChange={(e) => setForm({ ...form, siret: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contact</label>
            <input
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Téléphone *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">IBAN *</label>
          <input
            required
            value={form.iban}
            onChange={(e) => setForm({ ...form, iban: e.target.value })}
            placeholder="FR76 ..."
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">BIC *</label>
            <input
              required
              value={form.bic}
              onChange={(e) => setForm({ ...form, bic: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Banque</label>
            <input
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Objet de l&apos;aide</label>
          <textarea
            rows={4}
            value={form.aidSubject}
            onChange={(e) => setForm({ ...form, aidSubject: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Génération…' : 'Télécharger le PDF'}
        </button>
      </form>
    </div>
  );
}
