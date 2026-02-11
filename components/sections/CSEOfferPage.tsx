'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionTitle, Button, Card } from '@/components/ui';

const cseOffers = [
  {
    id: 'dimanche',
    day: 'Dimanche 28 Juin',
    title: 'Pack DÉCOUVERTE',
    subtitle: 'Journée détente en famille ou entre collègues',
    color: '#00E5CC',
    description: 'Ambiance familiale, concerts accessibles, animations. Idéal pour une première expérience festival.',
    pricing: [
      { qty: '10-19 places', price: '4€/pers.' },
      { qty: '20-49 places', price: '3,50€/pers.' },
      { qty: '50+ places', price: '3€/pers.' },
    ],
    normalPrice: '5€',
    includes: [
      'Entrée dimanche (concerts + animations)',
      'Accès à tout le village (food trucks, stands)',
      'Bracelet festival',
    ],
    argument: 'Pour le prix d\'un café, offrez un festival à vos salariés',
  },
  {
    id: 'vendredi',
    day: 'Vendredi 26 Juin',
    title: 'Pack ROCK',
    subtitle: 'Afterwork original entre collègues',
    color: '#E85D04',
    description: 'Sortie afterwork qui change de l\'ordinaire. Soirée rock/metal dans une ambiance festive.',
    pricing: [
      { qty: '10-19 places', price: '15€/pers.' },
      { qty: '20-49 places', price: '13€/pers.' },
      { qty: '50+ places', price: '11€/pers.' },
    ],
    normalPrice: '18€',
    includes: [
      'Entrée vendredi soir (programmation rock/metal)',
      'Accès à tout le village',
      'Bracelet festival',
    ],
    argument: 'Un afterwork dont vos équipes se souviendront',
  },
  {
    id: 'samedi',
    day: 'Samedi 27 Juin',
    title: 'Pack PREMIUM',
    subtitle: 'Journée rock pour les fans',
    color: '#FFD700',
    description: 'La grosse journée du festival avec les têtes d\'affiche. Pour les vrais amateurs de musique.',
    pricing: [
      { qty: '10-19 places', price: '18€/pers.' },
      { qty: '20-49 places', price: '16€/pers.' },
      { qty: '50+ places', price: '14€/pers.' },
    ],
    normalPrice: '27€',
    includes: [
      'Entrée samedi (Loudblast, Shaârghot + autres)',
      'Accès à tout le village complet',
      'Bracelet festival',
    ],
    argument: 'La journée phare du festival à prix préférentiel',
  },
];

const groupOffer = {
  title: 'Offre GROUPES',
  subtitle: 'À partir de 10 personnes',
  description: 'Associations, clubs, bande de potes... Profitez de -15% sur tous les pass !',
  pricing: [
    { day: 'Vendredi', normal: '18€', group: '15€' },
    { day: 'Samedi', normal: '27€', group: '23€' },
    { day: 'Dimanche', normal: '5€', group: '4€' },
    { day: 'Pass 3 jours', normal: '42€', group: '36€' },
  ],
};

export default function CSEOfferPage() {
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
              Tarifs préférentiels
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight text-[var(--foreground)]">
              OFFRES CSE & GROUPES
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-3xl mx-auto">
              Offrez une sortie originale à vos salariés ! Tarifs dégressifs pour les comités d&apos;entreprise 
              et les groupes à partir de 6 personnes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why CSE */}
      <section className="py-12 px-4 bg-[var(--muted)]/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: '💰', title: 'Économique', desc: 'Jusqu\'à -40% sur les tarifs publics' },
              { icon: '🎉', title: 'Original', desc: 'Une sortie différente des activités classiques' },
              { icon: '👥', title: 'Fédérateur', desc: 'Moment convivial entre collègues' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-4xl block mb-2">{item.icon}</span>
                <h3 className="font-bold text-[var(--foreground)]">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSE Offers */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Tarifs dégressifs selon la quantité">
            Offres CSE par journée
          </SectionTitle>

          <div className="space-y-8 mt-12">
            {cseOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-0 overflow-hidden" hover={false}>
                  <div 
                    className="h-2"
                    style={{ backgroundColor: offer.color }}
                  />
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Left: Info */}
                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-wider mb-1" style={{ color: offer.color }}>
                          {offer.day}
                        </p>
                        <h3 className="text-2xl font-display uppercase text-[var(--foreground)]">
                          {offer.title}
                        </h3>
                        <p className="text-[var(--muted-foreground)] text-sm mb-4">
                          {offer.subtitle}
                        </p>
                        <p className="text-[var(--muted-foreground)] mb-4">
                          {offer.description}
                        </p>
                        <ul className="space-y-1">
                          {offer.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-[var(--accent-cyan)]">✓</span>
                              <span className="text-[var(--muted-foreground)]">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-sm italic text-[var(--accent-orange)]">
                          &quot;{offer.argument}&quot;
                        </p>
                      </div>

                      {/* Right: Pricing */}
                      <div className="md:w-64">
                        <div className="bg-[var(--muted)]/50 rounded-lg p-4">
                          <p className="text-xs text-[var(--muted-foreground)] mb-3">
                            Prix public : <span className="line-through">{offer.normalPrice}</span>
                          </p>
                          <div className="space-y-2">
                            {offer.pricing.map((tier, i) => (
                              <div 
                                key={i}
                                className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0"
                              >
                                <span className="text-sm text-[var(--muted-foreground)]">{tier.qty}</span>
                                <span className="font-bold text-[var(--foreground)]" style={{ color: offer.color }}>
                                  {tier.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Offer */}
      <section className="py-20 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Associations, clubs, bande de potes...">
            Tarif Groupes (-15%)
          </SectionTitle>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="p-6 md:p-8" hover={false}>
              <p className="text-center text-[var(--muted-foreground)] mb-6">
                À partir de <span className="text-[var(--accent-cyan)] font-bold">10 personnes</span>, 
                profitez de -15% sur tous les pass !
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupOffer.pricing.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-[var(--muted)]/50 rounded-lg p-4 text-center"
                  >
                    <p className="text-sm text-[var(--muted-foreground)] mb-1">{item.day}</p>
                    <p className="text-xs text-[var(--muted-foreground)] line-through">{item.normal}</p>
                    <p className="text-2xl font-bold text-[var(--accent-cyan)]">{item.group}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
                CSE, asso, club, bande de potes... Contactez-nous pour réserver !
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Simple et rapide">
            Comment réserver ?
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { step: '1', title: 'Contactez-nous', desc: 'Envoyez-nous un email avec le nombre de personnes et la date souhaitée.' },
              { step: '2', title: 'Recevez votre devis', desc: 'On vous envoie une offre personnalisée avec le tarif dégressif applicable.' },
              { step: '3', title: 'Réservez', desc: 'Paiement par virement ou chèque. Bracelets envoyés ou à retirer sur place.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--accent-cyan)] text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-[var(--muted-foreground)] mt-8"
          >
            📅 Réservation avant le 31 mai 2026 pour garantir vos places
          </motion.p>
        </div>
      </section>

      {/* Contact Form */}
      <CSEContactForm offers={cseOffers} />
    </div>
  );
}

function CSEContactForm({ offers }: { offers: typeof cseOffers }) {
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    employees: '',
    pack: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cse',
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ company: '', contact: '', email: '', phone: '', employees: '', pack: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4" id="devis">
      <div className="max-w-3xl mx-auto">
        <SectionTitle subtitle="Recevez votre offre personnalisée">
          Demander un devis
        </SectionTitle>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Entreprise / Organisation *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Nom du contact *
              </label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Nombre de collaborateurs envisagé *
              </label>
              <input
                type="text"
                required
                placeholder="ex: 25"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Pack souhaité
              </label>
              <select
                value={formData.pack}
                onChange={(e) => setFormData({ ...formData, pack: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              >
                <option value="">Je ne sais pas encore</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title} - {offer.day}
                  </option>
                ))}
                <option value="vip">Pack VIP Team Building</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Message / Questions
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Vos besoins spécifiques, questions..."
              className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors resize-none"
            />
          </div>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center"
            >
              ✅ Merci ! Nous vous enverrons un devis personnalisé dans les 48h.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center"
            >
              ❌ Une erreur est survenue. Veuillez réessayer ou nous contacter par email.
            </motion.div>
          )}

          <div className="text-center">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Envoi en cours...' : 'Demander un devis'}
            </Button>
          </div>
        </motion.form>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-8">
          Vous pouvez également nous contacter directement à{' '}
          <a href="mailto:cse@barbnrock-festival.fr" className="text-[var(--accent-cyan)] hover:underline">
            cse@barbnrock-festival.fr
          </a>
        </p>
      </div>
    </section>
  );
}
