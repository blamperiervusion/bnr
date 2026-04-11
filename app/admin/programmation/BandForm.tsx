'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Band } from '@prisma/client';

const dayOptions = [
  { value: 'vendredi', label: 'Vendredi 26 Juin' },
  { value: 'samedi', label: 'Samedi 27 Juin' },
  { value: 'dimanche', label: 'Dimanche 28 Juin' },
];

interface BandFormProps {
  band?: Band;
  isNew?: boolean;
}

export default function BandForm({ band, isNew = false }: BandFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const techRiderInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: band?.name || '',
    day: band?.day || 'samedi',
    order: band?.order ?? 0,
    time: band?.time || '',
    endTime: band?.endTime || '',
    description: band?.description || '',
    imageUrl: band?.imageUrl || '',
    videoUrl: band?.videoUrl || '',
    website: band?.website || '',
    facebook: band?.facebook || '',
    instagram: band?.instagram || '',
    spotify: band?.spotify || '',
    techRiderUrl: band?.techRiderUrl || '',
    contractUrl: band?.contractUrl || '',
    notes: band?.notes || '',
    isVisible: band?.isVisible ?? true,
    isHeadliner: band?.isHeadliner ?? false,
  });

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'imageUrl' | 'techRiderUrl' | 'contractUrl',
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'band-image' ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: `Fichier trop volumineux (max ${maxSize / 1024 / 1024}MB)` });
      return;
    }

    setUploadingField(field);
    setMessage(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData({ ...formData, [field]: url });
        setMessage({ type: 'success', text: 'Fichier uploadé !' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de l\'upload' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const url = isNew ? '/api/admin/programmation' : `/api/admin/programmation/${band?.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: isNew ? 'Groupe créé !' : 'Modifications enregistrées' });
        if (isNew) {
          router.push(`/admin/programmation/${data.id}`);
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
    if (!band || !confirm('Supprimer ce groupe ?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/programmation/${band.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/programmation');
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

      {/* Informations principales */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">🎸 Informations du groupe</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nom du groupe <span className="text-red-500">*</span>
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
              Jour <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              required
            >
              {dayOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Heure de passage</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="Ex: 21h30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Heure de fin</label>
            <input
              type="text"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="Ex: 22h30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ordre d&apos;affichage</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none resize-none"
            placeholder="Biographie du groupe..."
            required
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isHeadliner}
              onChange={(e) => setFormData({ ...formData, isHeadliner: e.target.checked })}
              className="w-5 h-5 rounded border-[#333] bg-[#0a0a0a] text-[#e53e3e] focus:ring-[#e53e3e]"
            />
            <span className="text-white">⭐ Tête d&apos;affiche</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
              className="w-5 h-5 rounded border-[#333] bg-[#0a0a0a] text-[#e53e3e] focus:ring-[#e53e3e]"
            />
            <span className="text-white">👁️ Visible sur le site</span>
          </label>
        </div>
      </div>

      {/* Image et vidéo */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">🖼️ Médias</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Photo du groupe</label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
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
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleFileUpload(e, 'imageUrl', 'band-image')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingField === 'imageUrl'}
                  className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {uploadingField === 'imageUrl' ? '⏳ Upload...' : formData.imageUrl ? '🔄 Changer' : '📤 Uploader'}
                </button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF ou WebP (max 2MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Vidéo YouTube</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {/* Liens sociaux */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">🔗 Liens & Réseaux</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Facebook</label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://facebook.com/..."
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Spotify</label>
            <input
              type="url"
              value={formData.spotify}
              onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
              placeholder="https://open.spotify.com/..."
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">📄 Documents</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Fiche technique (Tech Rider)</label>
            <div className="flex items-center gap-4">
              {formData.techRiderUrl ? (
                <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg">
                  <span>📄</span>
                  <a href={formData.techRiderUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Voir le fichier
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, techRiderUrl: '' })}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-gray-500">Aucun fichier</span>
              )}
              <input
                ref={techRiderInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'techRiderUrl', 'band-techrider')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => techRiderInputRef.current?.click()}
                disabled={uploadingField === 'techRiderUrl'}
                className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {uploadingField === 'techRiderUrl' ? '⏳ Upload...' : '📤 Uploader'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF ou Word (max 10MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contrat</label>
            <div className="flex items-center gap-4">
              {formData.contractUrl ? (
                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-2 rounded-lg">
                  <span>📄</span>
                  <a href={formData.contractUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Voir le fichier
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contractUrl: '' })}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-gray-500">Aucun fichier</span>
              )}
              <input
                ref={contractInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'contractUrl', 'band-contract')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => contractInputRef.current?.click()}
                disabled={uploadingField === 'contractUrl'}
                className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {uploadingField === 'contractUrl' ? '⏳ Upload...' : '📤 Uploader'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF ou Word (max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Notes internes */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-bold text-white">📝 Notes internes</h3>

        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none resize-none"
          placeholder="Notes pour l'organisation (hébergement, restauration, contacts...)..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        {!isNew && band && (
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
            {isSubmitting ? '⏳ Enregistrement...' : isNew ? '✅ Créer le groupe' : '💾 Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}
