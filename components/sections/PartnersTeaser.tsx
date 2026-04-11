'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionTitle, Button } from '@/components/ui';
import { partnerCategories } from '@/lib/data/partners';

interface PartnerData {
  id: string;
  company: string;
  logo: string | null;
  website: string | null;
  tier: string | null;
}

interface PartnersTeaserProps {
  partners?: PartnerData[];
}

export default function PartnersTeaser({ partners = [] }: PartnersTeaserProps) {
  const chaosPartners = partners.filter(p => p.tier === 'chaos');
  const headbangerPartners = partners.filter(p => p.tier === 'headbanger');
  const moshpitPartners = partners.filter(p => p.tier === 'moshpit');
  const otherPartners = partners.filter(p => !['chaos', 'headbanger', 'moshpit'].includes(p.tier || ''));
  const hasPartners = partners.length > 0;

  return (
    <section className="py-24 px-4 bg-[var(--muted)]/20">
      <div className="max-w-7xl mx-auto">
        <SectionTitle subtitle="Ils nous font confiance">
          NOS PARTENAIRES
        </SectionTitle>

        {hasPartners ? (
          <>
            {/* Chaos Partners (Mécènes) */}
            {chaosPartners.length > 0 && (
              <div className="mt-12">
                <h3 className="text-center text-sm uppercase tracking-wider mb-6" style={{ color: partnerCategories.chaos.color }}>
                  {partnerCategories.chaos.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-8">
                  {chaosPartners.map((partner, index) => (
                    <motion.a
                      key={partner.id}
                      href={partner.website || undefined}
                      target={partner.website ? '_blank' : undefined}
                      rel={partner.website ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-44 h-28 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg flex items-center justify-center p-4 hover:border-[var(--accent-orange)]/50 transition-colors cursor-pointer"
                    >
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={partner.logo} alt={partner.company} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-sm text-center font-medium">
                          {partner.company}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Headbanger Partners */}
            {headbangerPartners.length > 0 && (
              <div className="mt-10">
                <h3 className="text-center text-sm uppercase tracking-wider mb-6" style={{ color: partnerCategories.headbanger.color }}>
                  {partnerCategories.headbanger.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {headbangerPartners.map((partner, index) => (
                    <motion.a
                      key={partner.id}
                      href={partner.website || undefined}
                      target={partner.website ? '_blank' : undefined}
                      rel={partner.website ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-36 h-24 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg flex items-center justify-center p-3 hover:border-[var(--accent-cyan)]/50 transition-colors cursor-pointer"
                    >
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={partner.logo} alt={partner.company} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-xs text-center">
                          {partner.company}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Moshpit + Other Partners */}
            {(moshpitPartners.length > 0 || otherPartners.length > 0) && (
              <div className="mt-10">
                <div className="flex flex-wrap justify-center gap-4">
                  {[...moshpitPartners, ...otherPartners].map((partner, index) => (
                    <motion.a
                      key={partner.id}
                      href={partner.website || undefined}
                      target={partner.website ? '_blank' : undefined}
                      rel={partner.website ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-28 h-20 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg flex items-center justify-center p-2 hover:border-[var(--accent-cyan)]/50 transition-colors cursor-pointer"
                    >
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={partner.logo} alt={partner.company} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[var(--muted-foreground)] text-[10px] text-center">
                          {partner.company}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Message si pas encore de partenaires */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-[var(--muted)]/30 border border-dashed border-[var(--border)] rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-[var(--accent-orange)] font-bold text-lg mb-2">
                🔥 Devenez notre premier partenaire !
              </p>
              <p className="text-[var(--muted-foreground)] mb-4">
                Association loi 1901 : bénéficiez de <span className="text-[var(--accent-cyan)] font-bold">60% de réduction fiscale</span> sur vos dons.
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Un don de 500€ ne coûte réellement que 200€ à votre entreprise.
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hasPartners && (
              <>
                <Link
                  href="/partenaires"
                  className="text-[var(--accent-cyan)] hover:underline font-medium"
                >
                  Voir tous nos partenaires →
                </Link>
                <span className="hidden sm:inline text-[var(--muted-foreground)]">|</span>
              </>
            )}
            <Button href="/devenir-partenaire" variant="outline">
              Devenir partenaire
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
