'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="uppercase tracking-widest text-sm mb-4" style={{ color: 'var(--accent-red)' }}>
            Barb&apos;n&apos;Rock 2026 · 26–28 juin · Crèvecœur-le-Grand
          </p>

          <h1 className="font-display text-6xl md:text-8xl tracking-tight" style={{ color: 'var(--foreground)' }}>
            Covoiturage
          </h1>

          <p className="text-xl mt-6 max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            L&apos;essence coûte cher. Plutôt que de faire la route seul(e), organisez-vous —
            c&apos;est économique, convivial, et bon pour la planète.
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-2xl mx-auto text-left"
        >
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm flex-1"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            <span style={{ color: 'var(--muted-foreground)' }}>
              Les annonces sont <strong style={{ color: 'var(--foreground)' }}>vérifiées avant publication</strong> par notre équipe.
            </span>
          </div>

          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm flex-1"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span className="text-base shrink-0 mt-0.5">⚠️</span>
            <span style={{ color: 'var(--muted-foreground)' }}>
              <strong style={{ color: 'var(--foreground)' }}>Sécurité.</strong>{' '}
              La mise en relation reste de votre responsabilité. Des éthylotests seront disponibles sur le festival —
              alcool et volant, ça ne se mélange pas.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
