'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionTitle, Button } from '@/components/ui';
import { programme } from '@/lib/data/programme';

export default function ProgrammeTeaser() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent-red)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent-cyan)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle subtitle="2 jours de chaos, 1 jour de repos">
          <span className="text-[var(--accent-cyan)]">⚡</span> PROGRAMMATION <span className="text-[var(--accent-cyan)]">⚡</span>
        </SectionTitle>

        {/* Days grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {programme.map((day, index) => (
            <motion.div
              key={day.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={`/programme/${day.slug}`}>
                <motion.div
                  className="group relative bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl p-8 h-full overflow-hidden"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-red)]/0 to-[var(--accent-cyan)]/0 group-hover:from-[var(--accent-red)]/10 group-hover:to-[var(--accent-cyan)]/10 transition-all duration-300" />
                  
                  {/* Day badge */}
                  <div className="relative z-10">
                    <span className="text-6xl font-display text-[var(--accent-red)] block mb-2">
                      {day.day.slice(0, 3).toUpperCase()}
                    </span>
                    <h3 className="text-3xl font-display uppercase tracking-wider text-[var(--foreground)] mb-2">
                      {day.day}
                    </h3>
                    <p className="text-[var(--muted-foreground)] mb-4">
                      {day.date}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6">
                      Ouverture des portes : {day.openingTime}
                    </p>

                    {/* Featured bands */}
                    <div className="space-y-2 mb-6">
                      {day.bands.slice(0, 3).map((band) => (
                        <div
                          key={band.id}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="text-[var(--accent-red)]">▸</span>
                          <span className="text-[var(--foreground)]">{band.name}</span>
                          <span className="text-[var(--muted-foreground)]">{band.time}</span>
                        </div>
                      ))}
                      {day.bands.length > 3 && (
                        <p className="text-sm text-[var(--accent-red)]">
                          + {day.bands.length - 3} autres artistes
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center gap-2 text-[var(--accent-red)] font-bold uppercase text-sm group-hover:gap-4 transition-all">
                      Voir le programme complet
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom border glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-red)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button href="/programme/samedi" variant="outline">
            Découvrir toute la programmation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
