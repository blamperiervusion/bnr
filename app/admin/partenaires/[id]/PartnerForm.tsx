'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Partner } from '@prisma/client';

const PAYMENT_FORM_OPTIONS = [
  { value: 'virement', label: 'Virement / Carte bancaire' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'especes', label: 'Espèces' },
];

const tierOptions = [
  // Partenaires financiers (visibles dans le formulaire public)
  { value: 'chaos', label: 'CHAOS (2000€+)', color: '#E85D04', group: 'financial' },
  { value: 'headbanger', label: 'HEADBANGER (1000€)', color: '#00E5CC', group: 'financial' },
  { value: 'moshpit', label: 'MOSH PIT (500€)', color: '#FFD700', group: 'financial' },
  { value: 'supporter', label: 'SUPPORTER (250€)', color: '#C0C0C0', group: 'financial' },
  { value: 'echange', label: 'ÉCHANGE MARCHANDISE', color: '#ec4899', group: 'financial' },
  // Partenaires non-financiers (admin uniquement)
  { value: 'institutional', label: 'INSTITUTIONNEL', color: '#3b82f6', group: 'other' },
  { value: 'media', label: 'MÉDIA', color: '#8b5cf6', group: 'other' },
  { value: 'technical', label: 'TECHNIQUE', color: '#06b6d4', group: 'other' },
];

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  { value: 'CONTACTED', label: 'Contacté', color: 'bg-blue-500/20 text-blue-500' },
  { value: 'VALIDATED', label: 'Validé', color: 'bg-green-500/20 text-green-500' },
  { value: 'REFUSED', label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
];

interface AdminUser {
  id: string;
  name: string;
}

interface PartnerFormProps {
  partner: Partner & { assignedTo?: AdminUser | null };
  adminUsers: AdminUser[];
}

export default function PartnerForm({ partner, adminUsers }: PartnerFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [paymentForm, setPaymentForm] = useState('virement');
  const [generatedDocs, setGeneratedDocs] = useState({
    invoiceNumber: partner.invoiceNumber || '',
    receiptNumber: partner.receiptNumber || '',
  });

  const [formData, setFormData] = useState({
    status: partner.status,
    tier: partner.tier || '',
    logo: partner.logo || '',
    siret: partner.siret || '',
    address: partner.address || '',
    donationAmount: partner.donationAmount?.toString() || '',
    donationDate: partner.donationDate ? new Date(partner.donationDate).toISOString().split('T')[0] : '',
    notes: partner.notes || '',
    assignedToId: partner.assignedToId || '',
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'partner-logo');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, logo: data.url }));
        setMessage({ type: 'success', text: 'Logo uploadé' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur upload' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          donationAmount: formData.donationAmount ? parseFloat(formData.donationAmount) : null,
          donationDate: formData.donationDate || null,
        }),
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

  const handleGenerateInvoice = async () => {
    if (!formData.donationAmount) {
      setMessage({ type: 'error', text: 'Montant requis pour générer une facture' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/invoice/${partner.id}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        downloadPdf(blob, `facture-${partner.company.replace(/\s+/g, '-')}.pdf`);
        const newNum = response.headers.get('X-Invoice-Number') || '';
        if (newNum) setGeneratedDocs(prev => ({ ...prev, invoiceNumber: newNum }));
        router.refresh();
        setMessage({ type: 'success', text: 'Facture générée et téléchargée' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur génération facture' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCerfa = async () => {
    if (!formData.donationAmount || !formData.siret) {
      setMessage({ type: 'error', text: 'SIRET et montant requis pour le CERFA' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/cerfa/${partner.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentForm }),
      });

      if (response.ok) {
        const blob = await response.blob();
        downloadPdf(blob, `cerfa-2041-MEC-SD-${partner.company.replace(/\s+/g, '-')}.pdf`);
        const newNum = response.headers.get('X-Receipt-Number') || '';
        if (newNum) setGeneratedDocs(prev => ({ ...prev, receiptNumber: newNum }));
        router.refresh();
        setMessage({ type: 'success', text: 'CERFA 2041-MEC-SD généré et téléchargé' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur génération CERFA' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/partenaires');
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo upload */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Logo</h2>
        <div className="flex items-center gap-6">
          {formData.logo ? (
            <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center p-2">
              <Image
                src={formData.logo}
                alt="Logo"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-[#333] flex items-center justify-center text-gray-500">
              Pas de logo
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Upload...' : 'Changer le logo'}
            </button>
            <p className="text-gray-500 text-sm mt-2">PNG, JPG ou SVG. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* Main form */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Informations partenariat</h2>

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
            <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
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

          {/* Tier & Assigned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Niveau de partenariat</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              >
                <option value="">Non défini</option>
                <optgroup label="Partenaires financiers">
                  {tierOptions.filter(t => t.group === 'financial').map((tier) => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Autres partenaires">
                  {tierOptions.filter(t => t.group === 'other').map((tier) => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Géré par</label>
              <select
                value={formData.assignedToId}
                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              >
                <option value="">Non assigné</option>
                {adminUsers.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Company info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">SIRET</label>
              <input
                type="text"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="123 456 789 00012"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 rue de la Paix, 75000 Paris"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>

          {/* Donation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Montant du don (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.donationAmount}
                onChange={(e) => setFormData({ ...formData, donationAmount: e.target.value })}
                placeholder="500"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date du don</label>
              <input
                type="date"
                value={formData.donationDate}
                onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Notes internes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Notes pour l'équipe..."
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#222]">
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

      {/* Documents section */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Documents</h2>
        <p className="text-gray-500 text-sm mb-6">
          Générez une facture (partenariat commercial) ou le CERFA officiel 2041-MEC-SD (mécénat, réduction d&apos;impôt art. 238 bis CGI).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Facture */}
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧾</span>
              <h3 className="text-white font-semibold">Facture</h3>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Pour les partenariats commerciaux (contrepartie : visibilité, billets, stands…).
              TVA non applicable — art. 293 B CGI.
            </p>
            {generatedDocs.invoiceNumber && (
              <div className="mb-3 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs font-mono">
                Dernier n° : {generatedDocs.invoiceNumber}
              </div>
            )}
            <button
              type="button"
              onClick={handleGenerateInvoice}
              disabled={isLoading || !formData.donationAmount}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? 'Génération…' : 'Générer la facture (PDF)'}
            </button>
            {!formData.donationAmount && (
              <p className="text-yellow-600 text-xs mt-2">Renseigner le montant du partenariat d&apos;abord.</p>
            )}
          </div>

          {/* CERFA */}
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📋</span>
              <h3 className="text-white font-semibold">CERFA 2041-MEC-SD</h3>
              <span className="text-xs text-gray-500 font-mono">N°16216*03</span>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Reçu officiel des dons — article 238 bis CGI. Permet à l&apos;entreprise de déduire 60% du montant.
            </p>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Mode de versement</label>
              <div className="flex gap-2 flex-wrap">
                {PAYMENT_FORM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentForm(opt.value)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      paymentForm === opt.value
                        ? 'bg-[#e53e3e] text-white'
                        : 'bg-[#222] text-gray-400 hover:bg-[#333]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {generatedDocs.receiptNumber && (
              <div className="mb-3 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs font-mono">
                Dernier n° : {generatedDocs.receiptNumber}
              </div>
            )}
            <button
              type="button"
              onClick={handleGenerateCerfa}
              disabled={isLoading || !formData.donationAmount || !formData.siret}
              className="w-full px-4 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? 'Génération…' : 'Générer le CERFA (PDF)'}
            </button>
            {(!formData.donationAmount || !formData.siret) && (
              <p className="text-yellow-600 text-xs mt-2">
                {!formData.donationAmount ? 'Renseigner le montant.' : 'SIRET requis pour le CERFA.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
