'use client';

import { motion } from 'framer-motion';
import { SectionTitle, Button } from '@/components/ui';
import { partnerCategories } from '@/lib/data/partners';

interface PartnerData {
  id: string;
  company: string;
  logo: string | null;
  website: string | null;
  tier: string | null;
}

function PartnerCard({ partner, size = 'md' }: { partner: PartnerData; size?: 'lg' | 'md' | 'sm' }) {
  const sizes = {
    lg: 'w-48 h-32',
    md: 'w-40 h-24',
    sm: 'w-32 h-20',
  };

  const tier = (partner.tier || 'supporter') as keyof typeof partnerCategories;
  const category = partnerCategories[tier] || { name: 'Partenaire', color: '#666666' };

  return (
    <motion.a
      href={partner.website || '#'}
      target={partner.website ? '_blank' : undefined}
      rel={partner.website ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${sizes[size]} bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg flex items-center justify-center p-4 hover:border-opacity-50 transition-all cursor-pointer group relative overflow-hidden`}
      style={{ '--hover-color': category.color } as React.CSSProperties}
    >
      {/* Hover glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: category.color }}
      />
      
      {partner.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={partner.logo} 
          alt={partner.company} 
          className="max-w-full max-h-full object-contain relative z-10" 
        />
      ) : (
        <span className="text-[var(--muted-foreground)] text-sm text-center font-medium relative z-10 group-hover:text-[var(--foreground)] transition-colors">
          {partner.company}
        </span>
      )}
    </motion.a>
  );
}

interface PartnersPageProps {
  partners: PartnerData[];
}

export default function PartnersPage({ partners }: PartnersPageProps) {
  const chaosPartners = partners.filter(p => p.tier === 'chaos');
  const headbangerPartners = partners.filter(p => p.tier === 'headbanger');
  const moshpitPartners = partners.filter(p => p.tier === 'moshpit');
  const supporterPartners = partners.filter(p => p.tier === 'supporter');
  const mediaPartners = partners.filter(p => p.tier === 'media');
  const institutionalPartners = partners.filter(p => p.tier === 'institutional');
  const technicalPartners = partners.filter(p => p.tier === 'technical');
  const echangePartners = partners.filter(p => p.tier === 'echange');

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
              Ils nous soutiennent
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              NOS PARTENAIRES
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Le Barb&apos;n&apos;Rock Festival n&apos;existerait pas sans le soutien de nos partenaires. Un immense merci à tous !
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners sections */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Message si aucun partenaire */}
          {partners.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <span className="text-6xl block mb-6">🎸</span>
              <h2 className="text-2xl font-display text-[var(--foreground)] mb-4">
                Les partenaires arrivent bientôt !
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">
                Nous sommes en train de finaliser nos partenariats pour cette 4ème édition.
                Vous souhaitez nous rejoindre ? C&apos;est le moment !
              </p>
            </motion.div>
          )}

          {/* Chaos Partners (Mécènes principaux) */}
          {chaosPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-3xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.chaos.color }}
              >
                🔥 {partnerCategories.chaos.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {chaosPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PartnerCard partner={partner} size="lg" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Headbanger Partners */}
          {headbangerPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-2xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.headbanger.color }}
              >
                🤘 {partnerCategories.headbanger.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {headbangerPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PartnerCard partner={partner} size="md" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mosh Pit Partners */}
          {moshpitPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.moshpit.color }}
              >
                🎸 {partnerCategories.moshpit.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {moshpitPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Supporter Partners */}
          {supporterPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.supporter.color }}
              >
                ❤️ {partnerCategories.supporter.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {supporterPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Media Partners */}
          {mediaPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.media.color }}
              >
                📺 {partnerCategories.media.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {mediaPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Institutional Partners */}
          {institutionalPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.institutional.color }}
              >
                🏛️ {partnerCategories.institutional.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {institutionalPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Technical Partners */}
          {technicalPartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.technical.color }}
              >
                🔧 {partnerCategories.technical.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {technicalPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Echange Partners */}
          {echangePartners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-xl font-display text-center mb-8 uppercase tracking-wider"
                style={{ color: partnerCategories.echange.color }}
              >
                🤝 {partnerCategories.echange.name}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {echangePartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PartnerCard partner={partner} size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 mt-8">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Rejoignez l'aventure Barb'n'Rock">
            Devenir Partenaire
          </SectionTitle>
          <p className="text-[var(--muted-foreground)] mb-4 max-w-xl mx-auto">
            Vous souhaitez associer votre marque à un événement rock unique dans l&apos;Oise ? 
            Découvrez nos différentes formules de partenariat.
          </p>
          <p className="text-[var(--accent-orange)] font-bold mb-8">
            Association loi 1901 : 60% de réduction fiscale sur vos dons
          </p>
          <Button href="/devenir-partenaire" size="lg">
            Découvrir nos offres
          </Button>
        </div>
      </section>
    </div>
  );
}
