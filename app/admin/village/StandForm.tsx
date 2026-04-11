'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { VillageStand, VillageStandCategory } from '@prisma/client';

const categoryOptions: { value: VillageStandCategory; label: string; emoji: string }[] = [
  { value: 'FOOD', label: 'Food Trucks', emoji: '🍔' },
  { value: 'BAR', label: 'Bar', emoji: '🍺' },
  { value: 'MERCHANDISING', label: 'Merchandising', emoji: '👕' },
  { value: 'ARTISANAT', label: 'Artisanat', emoji: '⚒️' },
  { value: 'TATTOO', label: 'Tatouage & Piercing', emoji: '🖋️' },
  { value: 'BARBIER', label: 'Barbiers', emoji: '💈' },
  { value: 'ASSOCIATION', label: 'Associations', emoji: '🤝' },
  { value: 'DIVERS', label: 'Divers & Curiosités', emoji: '✨' },
];

interface StandFormProps {
  stand?: VillageStand;
  isNew?: boolean;
}

export default function StandForm({ stand, isNew = false }: StandFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: stand?.name || '',
    category: stand?.category || 'DIVERS',
    description: stand?.description || '',
    logo: stand?.logo || '',
    website: stand?.website || '',
    instagram: stand?.instagram || '',
    facebook: stand?.facebook || '',
    contact: stand?.contact || '',
    email: stand?.email || '',
    phone: stand?.phone || '',
    isVisible: stand?.isVisible ?? true,
    order: stand?.order ?? 0,
    notes: stand?.notes || '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Le fichier est trop volumineux (max 2MB)' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'village-logo');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData({ ...formData, logo: url });
        setMessage({ type: 'success', text: 'Logo uploadé !' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de l\'upload' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const url = isNew ? '/api/admin/village' : `/api/admin/village/${stand?.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: isNew ? 'Stand créé !' : 'Modifications enregistrées' });
        if (isNew) {
          router.push(`/admin/village/${data.id}`);
        } else {
          router.refresh();
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de l\'enregistrement' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!stand || !confirm('Supprimer ce stand ?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/village/${stand.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/village');
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">📝 Informations générales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nom du stand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as VillageStandCategory })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none resize-none"
            placeholder="Description du stand..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Logo</label>
          <div className="flex items-start gap-4">
            {formData.logo ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.logo} alt="Preview" className="h-24 w-24 object-contain rounded-lg bg-white/10 p-2" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo: '' })}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 bg-[#222] rounded-lg flex items-center justify-center text-3xl text-gray-500">
                🖼️
              </div>
            )}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {isUploading ? '⏳ Upload...' : formData.logo ? '🔄 Changer' : '📤 Uploader un logo'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, GIF, WebP ou SVG (max 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">🔗 Liens & Réseaux</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Site web</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instagram</label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Facebook</label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">👤 Contact</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nom du contact</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">⚙️ Paramètres</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ordre d&apos;affichage</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Plus le nombre est petit, plus le stand apparaît en premier</p>
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
              className="w-5 h-5 rounded border-[#333] bg-[#0a0a0a] text-[#e53e3e] focus:ring-[#e53e3e]"
            />
            <label htmlFor="isVisible" className="text-white cursor-pointer">
              Visible sur le site
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Notes internes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none resize-none"
            placeholder="Notes pour l'organisation..."
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        {!isNew && stand && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? '⏳ Suppression...' : '🗑️ Supprimer'}
          </button>
        )}
        <div className={isNew ? 'ml-auto' : ''}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '⏳ Enregistrement...' : isNew ? '✅ Créer le stand' : '💾 Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}
