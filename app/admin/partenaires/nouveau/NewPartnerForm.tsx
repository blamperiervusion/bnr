'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const tierOptions = [
  // Partenaires financiers
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

export default function NewPartnerForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    tier: '',
    status: 'VALIDATED',
    logo: '',
    siret: '',
    address: '',
    donationAmount: '',
    donationDate: '',
    notes: '',
    website: '',
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'partner-logo');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
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

    if (!formData.company || !formData.contact || !formData.email) {
      setMessage({ type: 'error', text: 'Entreprise, contact et email sont requis' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          donationAmount: formData.donationAmount || null,
          donationDate: formData.donationDate || null,
        }),
      });

      if (response.ok) {
        const partner = await response.json();
        router.push(`/admin/partenaires/${partner.id}`);
        router.refresh();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' });
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
              {isUploading ? 'Upload...' : 'Ajouter un logo'}
            </button>
            <p className="text-gray-500 text-sm mt-2">PNG, JPG ou SVG. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* Main form */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Informations du partenaire</h2>

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
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Entreprise <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nom de l'entreprise"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Nom du contact"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@entreprise.fr"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Site web</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://www.entreprise.fr"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value })}
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Type de partenariat</label>
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
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#222]">
            <button
              type="button"
              onClick={() => router.push('/admin/partenaires')}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer le partenaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
