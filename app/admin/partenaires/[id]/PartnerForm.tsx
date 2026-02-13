'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Partner } from '@prisma/client';

const tierOptions = [
  { value: 'chaos', label: 'CHAOS (2000€+)', color: '#E85D04' },
  { value: 'headbanger', label: 'HEADBANGER (1000€)', color: '#00E5CC' },
  { value: 'moshpit', label: 'MOSH PIT (500€)', color: '#FFD700' },
  { value: 'supporter', label: 'SUPPORTER (250€)', color: '#C0C0C0' },
  { value: 'echange', label: 'ÉCHANGE MARCHANDISE', color: '#ec4899' },
];

const statusOptions = [
  { value: 'PENDING', label: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
  { value: 'CONTACTED', label: 'Contacté', color: 'bg-blue-500/20 text-blue-500' },
  { value: 'VALIDATED', label: 'Validé', color: 'bg-green-500/20 text-green-500' },
  { value: 'REFUSED', label: 'Refusé', color: 'bg-red-500/20 text-red-500' },
];

interface PartnerFormProps {
  partner: Partner;
}

export default function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    status: partner.status,
    tier: partner.tier || '',
    logo: partner.logo || '',
    siret: partner.siret || '',
    address: partner.address || '',
    donationAmount: partner.donationAmount?.toString() || '',
    donationDate: partner.donationDate ? new Date(partner.donationDate).toISOString().split('T')[0] : '',
    notes: partner.notes || '',
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

  const handleGenerateReceipt = async () => {
    if (!formData.donationAmount || !formData.siret || !formData.address) {
      setMessage({ type: 'error', text: 'SIRET, adresse et montant requis pour le reçu' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/receipt/${partner.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Télécharger le PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recu-fiscal-${partner.company.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        router.refresh();
        setMessage({ type: 'success', text: 'Reçu fiscal généré' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur génération reçu' });
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
      });

      if (response.ok) {
        router.push('/admin/partenaires');
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

          {/* Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Niveau de partenariat</label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
            >
              <option value="">Non défini</option>
              {tierOptions.map((tier) => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                Supprimer
              </button>
              <button
                type="button"
                onClick={handleGenerateReceipt}
                disabled={isLoading || !formData.donationAmount}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Générer reçu fiscal
              </button>
            </div>
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
    </div>
  );
}
