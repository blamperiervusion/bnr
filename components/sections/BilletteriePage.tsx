'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Button, Card, Countdown } from '@/components/ui';

const tickets = [
  {
    id: 'pass-1j',
    name: 'Pass 1 Jour',
    price: '35€',
    description: 'Accès au festival pour une journée de votre choix',
    features: [
      'Accès à toutes les scènes',
      'Accès aux animations',
      'Bracelet festival',
    ],
    popular: false,
  },
  {
    id: 'pass-3j',
    name: 'Pass 3 Jours',
    price: '80€',
    originalPrice: '105€',
    description: 'L\'expérience complète du festival !',
    features: [
      'Accès aux 3 jours',
      'Accès camping inclus',
      'Accès à toutes les scènes',
      'Accès aux animations',
      'Bracelet collector',
      'Goodies exclusifs',
    ],
    popular: true,
  },
  {
    id: 'pass-vip',
    name: 'Pass VIP',
    price: '150€',
    description: 'L\'expérience ultime en backstage',
    features: [
      'Tout le Pass 3 Jours',
      'Accès espace VIP',
      'Open bar espace VIP',
      'Rencontre artistes',
      'Parking prioritaire',
      'T-shirt exclusif',
    ],
    popular: false,
  },
];

export default function BilletteriePage() {
  const festivalDate = new Date('2026-06-26T00:00:00');

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/20 via-transparent to-transparent" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, var(--accent-red) 0%, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-red)] uppercase tracking-widest mb-4">
              Places limitées
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              BILLETTERIE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Réserve ta place pour l&apos;événement punk/metal de l&apos;année !
              <br />
              <span className="text-[var(--accent-red)]">26 - 28 Juin 2026</span>
              <br />
              <span className="text-[var(--accent-cyan)]">📍 Crèvecœur-le-Grand (60)</span>
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-[var(--muted-foreground)] mb-4 uppercase tracking-wider">
              Le festival commence dans
            </p>
            <Countdown targetDate={festivalDate} />
          </motion.div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Choisis ta formule">
            Nos Pass
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {ticket.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[var(--accent-red)] text-white text-sm font-bold px-4 py-1 rounded-full uppercase">
                      🔥 Le + populaire
                    </span>
                  </div>
                )}
                
                <Card 
                  className={`h-full p-8 ${ticket.popular ? 'border-[var(--accent-red)] border-2' : ''}`}
                  hover={false}
                >
                  <div className="text-center mb-6">
                    <h3 className="font-display text-3xl text-[var(--foreground)] mb-2">
                      {ticket.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-display text-[var(--accent-red)]">
                        {ticket.price}
                      </span>
                      {ticket.originalPrice && (
                        <span className="text-lg text-[var(--muted-foreground)] line-through">
                          {ticket.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mt-2">
                      {ticket.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--accent-red)]">✓</span>
                        <span className="text-[var(--foreground)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    href="https://billetterie.barbnrock-festival.fr" 
                    external
                    variant={ticket.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Réserver
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[var(--accent-red)] to-[var(--accent-cyan)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6">
              N&apos;ATTENDS PAS !
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
              Les éditions précédentes ont affiché complet. 
              Réserve dès maintenant pour être sûr d&apos;y être !
            </p>
            <Button
              href="https://billetterie.barbnrock-festival.fr"
              external
              size="lg"
              className="bg-white text-[var(--accent-red)] hover:bg-white/90"
            >
              🎫 Accéder à la billetterie
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-display text-2xl text-[var(--foreground)] mb-4">
                📋 Bon à savoir
              </h3>
              <ul className="space-y-2 text-[var(--muted-foreground)]">
                <li>• Les enfants de moins de 10 ans entrent gratuitement</li>
                <li>• Tarif réduit pour les moins de 16 ans</li>
                <li>• Les billets ne sont ni échangeables ni remboursables</li>
                <li>• Pièce d&apos;identité obligatoire à l&apos;entrée</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-display text-2xl text-[var(--foreground)] mb-4">
                ❓ Des questions ?
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Consulte notre FAQ pour trouver toutes les réponses à tes questions sur la billetterie, l&apos;accès et le camping.
              </p>
              <Button href="/faq" variant="outline" size="sm">
                Voir la FAQ
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
