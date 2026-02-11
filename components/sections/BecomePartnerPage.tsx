'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionTitle, Button, Card } from '@/components/ui';
import { partnershipTiers } from '@/lib/data/partners';

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    tier: '',
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
          type: 'partenaire',
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ company: '', contact: '', email: '', phone: '', tier: '', message: '' });
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
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-red)] uppercase tracking-widest mb-4">
              Rejoignez l&apos;aventure
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              DEVENIR PARTENAIRE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-3xl mx-auto">
              Associez votre marque à l&apos;événement rock, punk et metal de l&apos;année dans l&apos;Oise. 
              Bénéficiez de 60% de réduction fiscale et d&apos;une visibilité unique auprès d&apos;un public passionné.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tax benefit highlight */}
      <section className="py-12 px-4 bg-[var(--accent-orange)]/10 border-y border-[var(--accent-orange)]/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--accent-orange)] font-bold uppercase tracking-wider mb-2">
              💰 Association loi 1901 - Réduction fiscale
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-[var(--foreground)] mb-4">
              60% DE RÉDUCTION D&apos;IMPÔT
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-6">
              Un don de <span className="text-[var(--accent-orange)] font-bold">500€</span> ne coûte réellement que{' '}
              <span className="text-[var(--accent-cyan)] font-bold">200€</span> à votre entreprise.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { value: '3000', label: 'Festivaliers attendus' },
                { value: '15+', label: 'Groupes confirmés' },
                { value: '4ème', label: 'Édition' },
                { value: '3', label: 'Jours de festival' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-display text-[var(--accent-cyan)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why partner section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="4 ans d'existence, un ancrage local fort">
            Vos atouts en tant que partenaire
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: '✅',
                title: 'Crédibilité',
                description: '4 ans d\'existence, nous ne sommes pas des débutants. Un festival qui s\'installe dans le paysage local.',
              },
              {
                icon: '📍',
                title: 'Ancrage local',
                description: 'Événement ancré dans le territoire de l\'Oise, à Crèvecœur-le-Grand. Public local et régional.',
              },
              {
                icon: '🎟️',
                title: 'Prix accessible',
                description: 'Image positive, pas élitiste. Un événement ouvert à tous les passionnés de musique.',
              },
              {
                icon: '💰',
                title: 'Réduction fiscale',
                description: 'Association loi 1901 : 60% de réduction d\'impôt sur vos dons. Un don de 500€ = 200€ net.',
              },
              {
                icon: '🎯',
                title: 'Visibilité ciblée',
                description: 'Touchez un public passionné de rock, punk et metal, fidèle et engagé.',
              },
              {
                icon: '🤘',
                title: 'Valeurs partagées',
                description: 'Associez votre marque à un événement authentique, indépendant et convivial.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <span className="text-3xl block mb-3">{benefit.icon}</span>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership tiers */}
      <section className="py-20 px-4 bg-[var(--muted)]/20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Choisissez votre niveau d'engagement">
            Nos formules partenaires
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {partnershipTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-2 rounded-t-lg"
                  style={{ backgroundColor: tier.color }}
                />
                <Card className="p-6 h-full pt-8" hover={false}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        className="text-2xl font-display uppercase"
                        style={{ color: tier.color }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {tier.subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--foreground)]">
                        {tier.price}
                      </p>
                      <p className="text-sm text-[var(--accent-cyan)] font-medium">
                        {tier.realCost}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--accent-cyan)] mt-0.5">✓</span>
                        <span className="text-[var(--muted-foreground)]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Note flexibilité */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-[var(--muted-foreground)] mt-6"
          >
            💡 La répartition des contreparties peut être adaptée selon vos besoins (pass journée au lieu de pass 3 jours, plus de visibilité, etc.)
          </motion.p>

          {/* Échange marchandise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 border-2 border-dashed border-[var(--border)]">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <span className="text-5xl">🤝</span>
                <div>
                  <h3 className="text-xl font-display uppercase text-[var(--foreground)]">
                    Pack Échange Marchandise
                  </h3>
                  <p className="text-[var(--muted-foreground)] mt-2">
                    Pour les entreprises qui ne peuvent pas donner en cash : brasserie locale (fûts contre visibilité), 
                    imprimeur (impression contre logo), traiteur (repas bénévoles contre emplacement), etc.
                  </p>
                </div>
                <Button href="mailto:partenaires@barbnrock-festival.fr" variant="outline" external>
                  Nous contacter
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Offre CSE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <Card className="p-6 bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/30">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <span className="text-5xl">👥</span>
                <div className="flex-1">
                  <h3 className="text-xl font-display uppercase text-[var(--foreground)]">
                    Vous êtes un CSE ?
                  </h3>
                  <p className="text-[var(--muted-foreground)] mt-2">
                    Offrez une sortie originale à vos salariés ! Tarifs dégressifs jusqu&apos;à -40% 
                    pour les comités d&apos;entreprise et les groupes à partir de 10 personnes.
                  </p>
                </div>
                <Button href="/offre-cse">
                  Voir les offres CSE
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Contactez-nous pour en savoir plus">
            Intéressé ?
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
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Formule souhaitée
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-cyan)] focus:outline-none transition-colors"
              >
                <option value="">Je ne sais pas encore</option>
                {partnershipTiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} - {tier.price}
                  </option>
                ))}
                <option value="echange">Pack Échange Marchandise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Message
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Parlez-nous de votre entreprise et de vos attentes..."
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center"
              >
                ✅ Merci ! Votre demande a bien été envoyée. Nous vous recontacterons rapidement.
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
                {isSubmitting ? '⏳ Envoi en cours...' : 'Envoyer ma demande'}
              </Button>
            </div>
          </motion.form>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-8">
            Vous pouvez également nous contacter directement à{' '}
            <a href="mailto:partenaires@barbnrock-festival.fr" className="text-[var(--accent-red)] hover:underline">
              partenaires@barbnrock-festival.fr
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
