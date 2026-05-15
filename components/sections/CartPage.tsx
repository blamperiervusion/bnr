'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store/cart';

interface ShippingSettings {
  shippingCost: number;
  freeShippingThreshold: number;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shippingCost: 5,
    freeShippingThreshold: 0,
  });

  useEffect(() => {
    fetch('/api/boutique/settings')
      .then((r) => r.json())
      .then((data: ShippingSettings) => setShippingSettings(data))
      .catch(console.error);
  }, []);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    line1: '',
    line2: '',
    city: '',
    zip: '',
    country: 'FR',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          customerEmail: form.customerEmail,
          customerName: form.customerName,
          customerPhone: form.customerPhone || undefined,
          shippingAddress: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            zip: form.zip,
            country: form.country,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du paiement');
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total();
  const { shippingCost: baseShippingCost, freeShippingThreshold } = shippingSettings;
  const shippingCost =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? 0 : baseShippingCost;
  const orderTotal = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-6xl">🛒</p>
        <h1 className="font-display text-3xl text-[var(--foreground)]">Panier vide</h1>
        <p className="text-[var(--muted-foreground)]">Ajoute des produits depuis la boutique.</p>
        <Button href="/boutique" size="lg">Découvrir la boutique</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="mb-8 text-sm text-[var(--muted-foreground)]">
          <Link href="/boutique" className="hover:text-[var(--foreground)] transition-colors">Boutique</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--foreground)]">Panier</span>
        </nav>

        <h1 className="font-display text-5xl text-[var(--foreground)] mb-10">MON PANIER</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items + checkout form */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--muted)] shrink-0 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-40">👕</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--foreground)] truncate">{item.productName}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{item.variantName}</p>
                    <p className="text-[var(--accent-red)] font-bold mt-1">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-red)] transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-[var(--foreground)]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-red)] transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="w-8 h-8 rounded-lg text-[var(--muted-foreground)] hover:text-red-400 transition-colors flex items-center justify-center ml-2"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Checkout form */}
            {step === 'checkout' && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCheckout}
                className="mt-6 space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6"
              >
                <h2 className="font-display text-2xl text-[var(--foreground)]">Informations de livraison</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Adresse *</label>
                  <input
                    type="text"
                    required
                    placeholder="15 rue de la Paix"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Complément d&apos;adresse</label>
                  <input
                    type="text"
                    placeholder="Appartement, étage..."
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Code postal *</label>
                    <input
                      type="text"
                      required
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Ville *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-sm"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-[var(--accent-red)] text-white font-bold rounded-lg hover:shadow-[0_0_20px_var(--accent-red)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                  >
                    {loading ? 'Redirection...' : '💳 Payer avec Stripe'}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sticky top-28">
              <h2 className="font-display text-2xl text-[var(--foreground)] mb-6">Récapitulatif</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>Livraison</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-400 font-medium">Gratuite</span>
                  ) : (
                    <span>{shippingCost.toFixed(2).replace('.', ',')} €</span>
                  )}
                </div>
                {freeShippingThreshold > 0 && shippingCost > 0 && (
                  <div className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/30 rounded-lg px-3 py-2">
                    Plus que{' '}
                    <strong className="text-green-400">
                      {(freeShippingThreshold - subtotal).toFixed(2).replace('.', ',')} €
                    </strong>{' '}
                    d&apos;achat pour la livraison gratuite !
                  </div>
                )}
                <div className="border-t border-[var(--border)] pt-3 flex justify-between text-[var(--foreground)] font-bold text-base">
                  <span>Total</span>
                  <span className="text-[var(--accent-red)]">{orderTotal.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              {step === 'cart' && (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full mt-6 px-4 py-3 bg-[var(--accent-red)] text-white font-bold rounded-lg hover:shadow-[0_0_20px_var(--accent-red)] transition-all uppercase tracking-wide text-sm"
                >
                  Commander →
                </button>
              )}

              <p className="text-xs text-[var(--muted-foreground)] mt-4 text-center">
                Paiement sécurisé via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
