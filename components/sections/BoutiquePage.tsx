'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionTitle } from '@/components/ui';
import { useCartStore } from '@/store/cart';

interface Variant {
  id: string;
  name: string;
  price: string;
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

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/boutique/panier"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--accent-red)] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-[0_0_20px_var(--accent-red)] transition-all font-bold"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count > 0 && (
        <span className="bg-white text-[var(--accent-red)] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
      <span className="text-sm">Panier</span>
    </Link>
  );
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    fetch('/api/boutique/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getMinPrice = (variants: Variant[]) => {
    if (!variants.length) return null;
    const prices = variants.map((v) => parseFloat(v.price));
    const min = Math.min(...prices);
    return min.toFixed(2).replace('.', ',') + ' €';
  };

  return (
    <div className="pt-24 pb-16">
      <CartIcon count={itemCount} />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-cyan)]/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[var(--accent-cyan)] uppercase tracking-widest mb-4">Merch officiel</p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              BOUTIQUE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Affiche ton style rock avec les produits officiels du Barb&apos;n&apos;Rock Festival !
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="T-shirts, hoodies, goodies et plus encore">
            Nos produits
          </SectionTitle>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[var(--muted)] rounded-lg" />
                  <div className="mt-4 h-4 bg-[var(--muted)] rounded w-3/4" />
                  <div className="mt-2 h-3 bg-[var(--muted)] rounded w-full" />
                  <div className="mt-2 h-4 bg-[var(--muted)] rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 relative rounded-2xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--accent-red)]/10 via-[var(--background)] to-[var(--accent-cyan)]/10 p-12 text-center"
            >
              <div className="absolute top-4 left-6 text-5xl opacity-10 select-none">🎸</div>
              <div className="absolute bottom-4 right-6 text-5xl opacity-10 select-none">🤘</div>
              <div className="relative z-10">
                <p className="text-5xl mb-6">👕</p>
                <h2 className="font-display text-3xl md:text-4xl text-[var(--foreground)] mb-3">
                  ON PRÉPARE LA PROCHAINE ÉDITION !
                </h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto text-lg">
                  Le merch 2026 arrive bientôt. Revenez vite pour découvrir la collection officielle du festival.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 bg-[var(--muted)]/40 border border-[var(--border)] px-5 py-2.5 rounded-full text-sm text-[var(--muted-foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse inline-block" />
                  Festival les 26, 27 &amp; 28 juin 2026
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/boutique/${product.slug}`} className="group block">
                    <div className="aspect-square bg-gradient-to-br from-[var(--muted)] to-[var(--background)] rounded-lg overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent-red)] transition-colors relative">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                          <span className="text-5xl opacity-40">👕</span>
                          <p className="text-[var(--muted-foreground)] text-xs">Aperçu à venir</p>
                        </div>
                      )}
                      {product.type === 'PRINTIFY' && (
                        <span className="absolute top-2 right-2 bg-[var(--accent-cyan)] text-black text-xs font-bold px-2 py-0.5 rounded">
                          Print-on-demand
                        </span>
                      )}
                    </div>
                    <div className="mt-4 px-1">
                      <h3 className="font-bold text-[var(--foreground)] group-hover:text-[var(--accent-red)] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-display text-[var(--accent-red)] mt-2">
                        {getMinPrice(product.variants) ?? 'Prix sur demande'}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {product.variants.length} variante{product.variants.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* On-site info */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl text-[var(--foreground)] mb-4">ÉGALEMENT SUR PLACE</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            Retrouve notre stand merchandising pendant tout le festival !
            Éditions exclusives et produits disponibles uniquement sur place.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-[var(--muted)] px-6 py-3 rounded-full">
            <span className="text-2xl">📍</span>
            <span className="text-[var(--foreground)]">Stand Merch — Entrée principale</span>
          </div>
        </div>
      </section>
    </div>
  );
}
