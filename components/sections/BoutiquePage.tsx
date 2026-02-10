'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Button, Card } from '@/components/ui';

const products = [
  {
    id: 'tshirt-2025',
    name: 'T-shirt Festival 2025',
    price: '15€',
    image: '/images/boutique/tshirt-2025.jpg',
    description: 'Le t-shirt officiel du festival - édition 2025 - est de retour ! Le grand classique (180 g/m²) 100 % coton',
  },
];

export default function BoutiquePage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-cyan)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-cyan)] uppercase tracking-widest mb-4">
              Merch officiel
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              BOUTIQUE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Affiche ton style rock avec les produits officiels du Barb&apos;n&apos;Rock Festival !
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Quelques aperçus de notre collection">
            Nos produits
          </SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-[var(--muted)] to-[var(--background)] flex items-center justify-center">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-6xl">👕</span>
                        <p className="text-[var(--muted-foreground)] text-sm mt-2">Image à venir</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--foreground)]">{product.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">{product.description}</p>
                    <p className="text-xl font-display text-[var(--accent-red)] mt-3">{product.price}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-red)]/20 border border-[var(--border)] rounded-2xl p-12 text-center overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-6xl opacity-20">🎸</div>
            <div className="absolute bottom-4 right-4 text-6xl opacity-20">🤘</div>
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-4">
                ACCÈDE À LA BOUTIQUE
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
                Retrouve tous nos produits sur notre boutique en ligne officielle. 
                T-shirts, hoodies, accessoires et éditions limitées !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="https://www.helloasso.com/associations/association-crepicordienne-pour-la-promotion-de-la-culture-acpc/boutiques/barb-n-shop"
                  external
                  size="lg"
                >
                  👕 Accéder à la boutique
                </Button>
              </div>

              <p className="text-sm text-[var(--muted-foreground)] mt-6">
                🛒 Boutique hébergée sur HelloAsso
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* On-site info */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl text-[var(--foreground)] mb-4">
            ÉGALEMENT SUR PLACE
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            Retrouve notre stand merchandising pendant tout le festival ! 
            Éditions exclusives et produits disponibles uniquement sur place.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-[var(--muted)] px-6 py-3 rounded-full">
            <span className="text-2xl">📍</span>
            <span className="text-[var(--foreground)]">Stand Merch - Entrée principale</span>
          </div>
        </div>
      </section>
    </div>
  );
}
