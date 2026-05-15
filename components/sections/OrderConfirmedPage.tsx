'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-8"
        >
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="font-display text-5xl text-[var(--foreground)] mb-4">MERCI !</h1>
        <p className="text-xl text-[var(--muted-foreground)] mb-2">
          Ta commande est confirmée.
        </p>
        <p className="text-[var(--muted-foreground)] mb-8">
          Tu recevras un email de confirmation avec les détails de ta commande et les informations de suivi.
        </p>

        {sessionId && (
          <p className="text-xs text-[var(--muted-foreground)] mb-8 font-mono bg-[var(--muted)] px-3 py-2 rounded">
            Réf. : {sessionId.slice(-12)}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/boutique" size="lg">
            Continuer les achats
          </Button>
          <Button href="/" variant="outline" size="lg">
            Retour au site
          </Button>
        </div>

        <div className="mt-12 p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl text-left">
          <h2 className="font-bold text-[var(--foreground)] mb-3">Et maintenant ?</h2>
          <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <li className="flex gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              <span>Un email de confirmation vient d&apos;être envoyé à ton adresse</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-cyan)] shrink-0">→</span>
              <span>Ta commande est en cours de préparation (2-5 jours ouvrés)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-cyan)] shrink-0">→</span>
              <span>Tu recevras un email avec le numéro de suivi dès l&apos;expédition</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted-foreground)]">Chargement...</div>
      </div>
    }>
      <ConfirmedContent />
    </Suspense>
  );
}
