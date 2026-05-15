'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Variant {
  id?: string;
  name: string;
  size: string;
  color: string;
  price: string;
  stock: string;
  printifyVariantId: string;
  sku: string;
  isAvailable: boolean;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  type: 'LOCAL' | 'PRINTIFY';
  images: string[];
  printifyProductId: string;
  isVisible: boolean;
  order: string;
  variants: Variant[];
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const emptyVariant = (): Variant => ({
  name: '',
  size: '',
  color: '',
  price: '',
  stock: '0',
  printifyVariantId: '',
  sku: '',
  isAvailable: true,
});

export default function ProductForm({ initial }: { initial?: Partial<ProductFormData> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ProductFormData>({
    id: initial?.id,
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    type: initial?.type ?? 'LOCAL',
    images: initial?.images ?? [],
    printifyProductId: initial?.printifyProductId ?? '',
    isVisible: initial?.isVisible ?? true,
    order: String(initial?.order ?? 0),
    variants: initial?.variants ?? [emptyVariant()],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const updateVariant = (index: number, field: keyof Variant, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, emptyVariant()] }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/boutique/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploadingImage(false);
    if (!res.ok) {
      setUploadError(data.error || 'Erreur lors de l\'upload');
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(uploadImage);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    files.forEach(uploadImage);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const moveImage = (from: number, to: number) => {
    setForm((prev) => {
      const imgs = [...prev.images];
      const [item] = imgs.splice(from, 1);
      imgs.splice(to, 0, item);
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      type: form.type,
      images: form.images,
      printifyProductId: form.printifyProductId || null,
      isVisible: form.isVisible,
      order: parseInt(form.order) || 0,
      variants: form.variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        name: v.name,
        size: v.size || null,
        color: v.color || null,
        price: parseFloat(v.price) || 0,
        stock: parseInt(v.stock) || 0,
        printifyVariantId: v.printifyVariantId || null,
        sku: v.sku || null,
        isAvailable: v.isAvailable,
      })),
    };

    const url = isEdit ? `/api/admin/boutique/products/${form.id}` : '/api/admin/boutique/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Erreur');
      setLoading(false);
      return;
    }

    router.push('/admin/boutique');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!isEdit || !form.id) return;
    setLoading(true);
    await fetch(`/api/admin/boutique/products/${form.id}`, { method: 'DELETE' });
    router.push('/admin/boutique');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* General info */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Informations générales</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nom *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({ ...prev, name, slug: prev.slug || slugify(name) }));
              }}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as 'LOCAL' | 'PRINTIFY' }))}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e]"
            >
              <option value="LOCAL">Stock local</option>
              <option value="PRINTIFY">Printify</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ordre d&apos;affichage</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e]"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) => setForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
                className="w-4 h-4 accent-[#e53e3e]"
              />
              <span className="text-sm text-gray-300">Visible en boutique</span>
            </label>
          </div>
        </div>

        {form.type === 'PRINTIFY' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">ID produit Printify</label>
            <input
              type="text"
              value={form.printifyProductId}
              onChange={(e) => setForm((prev) => ({ ...prev, printifyProductId: e.target.value }))}
              placeholder="ex: 5d15ca1cbf50b8f5cd5e3f21"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e53e3e] font-mono text-sm"
            />
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Images</h2>

        {/* Drop zone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#e53e3e] bg-[#e53e3e]/5'
              : 'border-[#333] hover:border-[#555] bg-[#1a1a1a]'
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileInput}
            disabled={uploadingImage}
          />
          {uploadingImage ? (
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm">Upload en cours...</span>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Glisse tes images ici ou <span className="text-[#e53e3e] font-medium">clique pour parcourir</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP, GIF — max 5 Mo par image</p>
              </div>
            </>
          )}
        </label>

        {uploadError && (
          <p className="text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">{uploadError}</p>
        )}

        {/* Image previews */}
        {form.images.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">
              {form.images.length} image(s) — glisse pour réordonner, la première est l&apos;image principale
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-[#333]"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[#e53e3e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                      Principal
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(i, i - 1)}
                        className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded text-white text-xs transition-colors flex items-center justify-center"
                        title="Déplacer à gauche"
                      >
                        ←
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded text-white text-xs transition-colors flex items-center justify-center"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                    {i < form.images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(i, i + 1)}
                        className="w-7 h-7 bg-white/20 hover:bg-white/40 rounded text-white text-xs transition-colors flex items-center justify-center"
                        title="Déplacer à droite"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variants */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Variantes</h2>
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1.5 bg-[#222] text-gray-300 rounded-lg hover:bg-[#333] transition-colors text-sm"
          >
            + Ajouter
          </button>
        </div>

        {form.variants.map((v, i) => (
          <div key={i} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">Variante {i + 1}</p>
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-400 hover:text-red-300 transition-colors text-xs"
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs text-gray-500 mb-1">Nom affiché *</label>
                <input
                  type="text"
                  required
                  value={v.name}
                  onChange={(e) => updateVariant(i, 'name', e.target.value)}
                  placeholder="ex: M / Noir"
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Taille</label>
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  placeholder="M, L, XL..."
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Couleur</label>
                <input
                  type="text"
                  value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                  placeholder="Noir, Blanc..."
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Prix (€) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={v.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                />
              </div>
              {form.type === 'LOCAL' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                  />
                </div>
              )}
              {form.type === 'PRINTIFY' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">ID variante Printify</label>
                  <input
                    type="text"
                    value={v.printifyVariantId}
                    onChange={(e) => updateVariant(i, 'printifyVariantId', e.target.value)}
                    placeholder="ex: 12345"
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e] font-mono"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">SKU</label>
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#e53e3e]"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={v.isAvailable}
                    onChange={(e) => updateVariant(i, 'isAvailable', e.target.checked)}
                    className="w-4 h-4 accent-[#e53e3e]"
                  />
                  <span className="text-xs text-gray-300">Disponible</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-400 bg-red-400/10 px-4 py-3 rounded-lg text-sm">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#e53e3e] text-white font-medium rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/boutique')}
          className="px-6 py-2.5 bg-[#1a1a1a] border border-[#333] text-gray-300 rounded-lg hover:bg-[#222] transition-colors text-sm"
        >
          Annuler
        </button>
        {isEdit && (
          <div className="ml-auto">
            {deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-400">Confirmer la suppression ?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Oui, supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-gray-300 rounded-lg text-sm hover:bg-[#222] transition-colors"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Supprimer le produit
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
