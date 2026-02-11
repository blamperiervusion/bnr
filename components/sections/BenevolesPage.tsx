'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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

const disponibiliteOptions = [
  { id: 'vendredi', label: 'Vendredi 26 juin' },
  { id: 'samedi', label: 'Samedi 27 juin' },
  { id: 'dimanche', label: 'Dimanche 28 juin' },
  { id: 'montage', label: 'Montage (avant festival)' },
  { id: 'demontage', label: 'Démontage (après festival)' },
];

export default function BenevolesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    disponibilites: [] as string[],
    missions: [] as string[],
    experience: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDispoChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      disponibilites: prev.disponibilites.includes(id)
        ? prev.disponibilites.filter(d => d !== id)
        : [...prev.disponibilites, id],
    }));
  };

  const handleMissionChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      missions: prev.missions.includes(id)
        ? prev.missions.filter(m => m !== id)
        : [...prev.missions, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'benevole',
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', age: '', disponibilites: [], missions: [], experience: '', message: '' });
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

      {/* Registration Form */}
      <section className="py-20 px-4" id="inscription">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Remplis le formulaire ci-dessous">
            🙋 Inscription bénévole
          </SectionTitle>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="mt-12 space-y-6"
          >
            {/* Infos personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Âge *
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Disponibilités */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                Disponibilités *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {disponibiliteOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.disponibilites.includes(option.id)
                        ? 'bg-[var(--accent-purple)]/20 border-[var(--accent-purple)]'
                        : 'bg-[var(--muted)] border-[var(--border)] hover:border-[var(--accent-purple)]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.disponibilites.includes(option.id)}
                      onChange={() => handleDispoChange(option.id)}
                      className="sr-only"
                    />
                    <span className={`text-sm ${
                      formData.disponibilites.includes(option.id)
                        ? 'text-[var(--foreground)]'
                        : 'text-[var(--muted-foreground)]'
                    }`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Missions souhaitées */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                Missions souhaitées (plusieurs choix possibles) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {missions.map((mission) => (
                  <label
                    key={mission.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.missions.includes(mission.id)
                        ? 'bg-[var(--accent-cyan)]/20 border-[var(--accent-cyan)]'
                        : 'bg-[var(--muted)] border-[var(--border)] hover:border-[var(--accent-cyan)]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.missions.includes(mission.id)}
                      onChange={() => handleMissionChange(mission.id)}
                      className="sr-only"
                    />
                    <span className="text-xl">{mission.icon}</span>
                    <span className={`text-sm ${
                      formData.missions.includes(mission.id)
                        ? 'text-[var(--foreground)]'
                        : 'text-[var(--muted-foreground)]'
                    }`}>
                      {mission.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Expérience */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                As-tu déjà été bénévole en festival ?
              </label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Si oui, dis-nous où et quand..."
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Un message pour nous ?
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Motivations, questions, infos complémentaires..."
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-purple)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center"
              >
                ✅ Merci pour ta candidature ! Nous te recontacterons très bientôt.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center"
              >
                ❌ Une erreur est survenue. Réessaie ou contacte-nous par email.
              </motion.div>
            )}

            {/* Submit */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting || formData.disponibilites.length === 0 || formData.missions.length === 0}
              >
                {isSubmitting ? '⏳ Envoi en cours...' : '🙋 Envoyer ma candidature'}
              </Button>
            </div>
          </motion.form>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-8">
            Questions ? Écris-nous à{' '}
            <a href="mailto:barbnrock.festival@gmail.com" className="text-[var(--accent-red)] hover:underline">
              barbnrock.festival@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
