'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Button, Card } from '@/components/ui';

const missions = [
  {
    id: 'accueil',
    title: 'Accueil & Billetterie',
    icon: '🎫',
    description: 'Accueillir les festivaliers, scanner les billets, informer et orienter.',
  },
  {
    id: 'bar',
    title: 'Bars & Restauration',
    icon: '🍺',
    description: 'Service au bar, aide en cuisine, gestion des stocks.',
  },
  {
    id: 'securite',
    title: 'Sécurité & Prévention',
    icon: '🛡️',
    description: 'Veiller à la sécurité du public, prévention des risques.',
  },
  {
    id: 'technique',
    title: 'Technique & Logistique',
    icon: '🔧',
    description: 'Montage/démontage, aide technique, gestion du matériel.',
  },
  {
    id: 'eco',
    title: 'Éco-équipe',
    icon: '♻️',
    description: 'Sensibilisation au tri, propreté du site, gestion des déchets.',
  },
  {
    id: 'animation',
    title: 'Animation',
    icon: '🎭',
    description: 'Animer les espaces, activités pour le public, ambiance.',
  },
];

const advantages = [
  { icon: '🎵', text: 'Accès gratuit au festival' },
  { icon: '🍽️', text: 'Repas offerts pendant les shifts' },
  { icon: '⛺', text: 'Accès au camping bénévoles' },
  { icon: '👕', text: 'T-shirt bénévole exclusif' },
  { icon: '🎁', text: 'Goodies du festival' },
  { icon: '🤝', text: 'Une expérience humaine unique' },
];

export default function BenevolesPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-purple)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-purple)] uppercase tracking-widest mb-4">
              Rejoins l&apos;équipe
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              DEVENIR BÉNÉVOLE
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Tu veux vivre le festival de l&apos;intérieur ? Rejoins notre équipe de bénévoles 
              et fais partie de l&apos;aventure Barb&apos;n&apos;Rock !
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why become a volunteer */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Pourquoi nous rejoindre ?">
            Les avantages
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 bg-[var(--muted)]/50 p-4 rounded-lg border border-[var(--border)]"
              >
                <span className="text-3xl">{advantage.icon}</span>
                <span className="text-[var(--foreground)]">{advantage.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Missions */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Choisis ta mission">
            Les pôles
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <span className="text-5xl block mb-4">{mission.icon}</span>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {mission.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    {mission.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="En quelques étapes">
            Comment ça marche ?
          </SectionTitle>

          <div className="mt-12 space-y-8">
            {[
              {
                step: '01',
                title: 'Inscris-toi',
                description: 'Remplis le formulaire d\'inscription avec tes disponibilités et préférences de mission.',
              },
              {
                step: '02',
                title: 'On te recontacte',
                description: 'Notre équipe examine ta candidature et te contacte pour confirmer ta participation.',
              },
              {
                step: '03',
                title: 'Formation',
                description: 'Participe à la réunion de briefing avant le festival pour connaître ton rôle.',
              },
              {
                step: '04',
                title: 'Let\'s rock !',
                description: 'Vis le festival de l\'intérieur et profite de cette expérience unique !',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-[var(--accent-red)] rounded-full flex items-center justify-center">
                  <span className="font-display text-2xl text-white">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-6 text-center">
              📋 Conditions requises
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Avoir 18 ans ou plus
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Être disponible minimum 12h sur le festival
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Être motivé et souriant
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Aimer la musique et l&apos;ambiance rock
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Pouvoir se rendre sur le site par ses propres moyens
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-red)]">✓</span>
                Être prêt à vivre une aventure inoubliable !
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA - Registration */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 border border-[var(--border)] rounded-2xl p-12 text-center overflow-hidden"
          >
            {/* Decorative */}
            <div className="absolute top-4 right-4 text-6xl opacity-20">🤘</div>
            <div className="absolute bottom-4 left-4 text-6xl opacity-20">🎸</div>
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-4">
                PRÊT À NOUS REJOINDRE ?
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
                Inscris-toi dès maintenant via notre formulaire en ligne. 
                Les places sont limitées, alors n&apos;attends pas !
              </p>
              
              <Button
                href="https://forms.gle/barbnrock-benevoles"
                external
                size="lg"
              >
                🙋 S&apos;inscrire comme bénévole
              </Button>

              <p className="text-sm text-[var(--muted-foreground)] mt-6">
                Questions ? Écris-nous à{' '}
                <a href="mailto:benevoles@barbnrock-festival.fr" className="text-[var(--accent-red)] hover:underline">
                  benevoles@barbnrock-festival.fr
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
