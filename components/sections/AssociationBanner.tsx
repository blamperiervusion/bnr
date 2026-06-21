'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AssociationBanner() {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-[var(--muted)]/20">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent-red)]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--accent-red)]/5 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-2 border-[var(--accent-red)] rounded-2xl p-8 md:p-12 bg-[var(--background)]/60 backdrop-blur-sm"
        >
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--accent-red)] text-sm font-bold uppercase tracking-widest text-center mb-2"
          >
            💝 Solidarité · Association soutenue en 2026
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-display text-5xl md:text-7xl text-center text-[var(--foreground)] uppercase tracking-tight mb-2"
          >
            Les Fées Sourires
          </motion.h2>

          {/* Instagram link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <a
              href="https://www.instagram.com/association.les.fees.sourires/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
            >
              <span>📷</span>
              <span>@association.les.fees.sourires</span>
            </a>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-[var(--muted-foreground)] text-center max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Améliorer la qualité de vie des enfants hospitalisés et de leurs familles — jeux, 
            activités, présence lors des anniversaires, des fêtes et des moments importants 
            de l&apos;hospitalisation.
          </motion.p>

          {/* Two engagement boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4 bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 rounded-xl p-5"
            >
              <span className="text-3xl flex-shrink-0">🏪</span>
              <div>
                <p className="font-bold text-[var(--foreground)] uppercase tracking-wide text-sm">10% des ventes du Village</p>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">
                  Chaque stand s&apos;engage à reverser 10% de ses recettes à l&apos;association.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="flex items-start gap-4 bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 rounded-xl p-5"
            >
              <span className="text-3xl flex-shrink-0">🎟️</span>
              <div>
                <p className="font-bold text-[var(--foreground)] uppercase tracking-wide text-sm">Tombola solidaire</p>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">
                  Les gains de la tombola du festival sont intégralement reversés à l&apos;association.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link
              href="/village"
              className="inline-flex items-center gap-2 text-[var(--accent-red)] font-bold text-sm uppercase tracking-wider hover:underline"
            >
              En savoir plus sur nos engagements →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
