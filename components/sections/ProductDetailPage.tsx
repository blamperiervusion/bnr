'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store/cart';

interface Variant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: string;
  stock: number;
  isAvailable: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  type: string;
  variants: Variant[];
}

export default function ProductDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    fetch('/api/boutique/products')
      .then((r) => r.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
          const first = found.variants.find((v) => v.isAvailable) ?? null;
          setSelectedVariant(first);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      price: parseFloat(selectedVariant.price),
      image: product.images[0] ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sizes = [...new Set(product?.variants.filter((v) => v.size).map((v) => v.size!))];
  const colors = [...new Set(product?.variants.filter((v) => v.color).map((v) => v.color!))];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    const match = product.variants.find((v) => {
      const sizeMatch = !selectedSize || v.size === selectedSize;
      const colorMatch = !selectedColor || v.color === selectedColor;
      return sizeMatch && colorMatch && v.isAvailable;
    });
    setSelectedVariant(match ?? null);
  }, [selectedSize, selectedColor, product]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted-foreground)]">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-display text-[var(--foreground)]">Produit introuvable</p>
        <Button href="/boutique" variant="outline">Retour à la boutique</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Cart button */}
      <Link
        href="/boutique/panier"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--accent-red)] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-[0_0_20px_var(--accent-red)] transition-all font-bold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="bg-white text-[var(--accent-red)] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
        <span className="text-sm">Panier</span>
      </Link>

      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--muted-foreground)]">
          <Link href="/boutique" className="hover:text-[var(--foreground)] transition-colors">Boutique</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--foreground)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-[var(--muted)] to-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)] relative">
              {product.images[currentImage] ? (
                <Image
                  src={product.images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-30">👕</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors relative ${
                      currentImage === i ? 'border-[var(--accent-red)]' : 'border-[var(--border)]'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {product.type === 'PRINTIFY' && (
              <span className="inline-block bg-[var(--accent-cyan)] text-black text-xs font-bold px-3 py-1 rounded mb-4">
                Print-on-demand
              </span>
            )}
            <h1 className="font-display text-4xl md:text-5xl text-[var(--foreground)]">{product.name}</h1>
            <p className="text-3xl font-display text-[var(--accent-red)] mt-4">
              {selectedVariant
                ? `${parseFloat(selectedVariant.price).toFixed(2).replace('.', ',')} €`
                : '—'}
            </p>
            <p className="text-[var(--muted-foreground)] mt-4 leading-relaxed">{product.description}</p>

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Couleur</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                          : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-red)]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                    );
                    const available = variant?.isAvailable ?? false;
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`w-12 h-12 rounded-lg border text-sm font-bold transition-colors ${
                          selectedSize === size
                            ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                            : available
                            ? 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-red)]'
                            : 'border-[var(--border)] text-[var(--muted-foreground)] opacity-40 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Variant selector (if no size/color) */}
            {sizes.length === 0 && colors.length === 0 && product.variants.length > 1 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Option</p>
                <div className="flex flex-col gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => v.isAvailable && setSelectedVariant(v)}
                      disabled={!v.isAvailable}
                      className={`px-4 py-3 rounded-lg border text-sm text-left transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
                          : v.isAvailable
                          ? 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-red)]'
                          : 'border-[var(--border)] text-[var(--muted-foreground)] opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-medium">{v.name}</span>
                      <span className="ml-2 text-[var(--muted-foreground)]">
                        {parseFloat(v.price).toFixed(2).replace('.', ',')} €
                      </span>
                      {!v.isAvailable && <span className="ml-2 text-xs">(indisponible)</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator for local products */}
            {product.type === 'LOCAL' && selectedVariant && (
              <p className={`mt-4 text-sm ${
                selectedVariant.stock > 5
                  ? 'text-green-400'
                  : selectedVariant.stock > 0
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {selectedVariant.stock > 5
                  ? `En stock (${selectedVariant.stock} disponibles)`
                  : selectedVariant.stock > 0
                  ? `Plus que ${selectedVariant.stock} en stock !`
                  : 'Rupture de stock'}
              </p>
            )}

            {/* Add to cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || !selectedVariant.isAvailable || (product.type === 'LOCAL' && selectedVariant.stock === 0)}
                size="lg"
                className="flex-1"
              >
                {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
              </Button>
              <Button href="/boutique/panier" variant="outline" size="lg">
                Voir le panier
              </Button>
            </div>

            <p className="mt-4 text-xs text-[var(--muted-foreground)]">
              Livraison en France métropolitaine — frais de port : 5 €
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
