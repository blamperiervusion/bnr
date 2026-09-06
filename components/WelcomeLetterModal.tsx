'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui';

const STORAGE_KEY = 'bnr_welcome_letter_oct2026';

export default function WelcomeLetterModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY)) return;

    const alreadyLoaded = sessionStorage.getItem('hasVisited');
    const delay = alreadyLoaded ? 400 : 2400;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-[0_0_60px_rgba(0,229,204,0.12)]"
            initial={{ scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative shrink-0 border-b border-[var(--border)] px-6 pb-5 pt-6 sm:px-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,229,204,0.18) 0%, transparent 70%)',
                }}
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={dismiss}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] transition-colors hover:bg-[var(--accent-red)] hover:text-black"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="relative mb-1 text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent-red)]">
                Un mot de l&apos;équipe
              </p>
              <h2
                id={titleId}
                className="relative font-display text-3xl uppercase tracking-wide text-[var(--foreground)] sm:text-4xl"
              >
                Après Barb&apos;n&apos;Rock 2026
              </h2>
            </div>

            <div className="space-y-4 overflow-y-auto px-6 py-6 text-[15px] leading-relaxed text-[var(--muted-foreground)] sm:px-8 sm:text-base">
              <p>Bonjour à toutes et à tous,</p>
              <p>
                C&apos;est déjà la rentrée, et cela fait maintenant deux mois que Barb&apos;n&apos;Rock 2026 s&apos;est
                terminé. Il était temps pour nous de vous écrire.
              </p>
              <p>
                D&apos;abord, un immense merci à toutes les personnes qui sont venues, aux bénévoles, aux
                groupes, aux partenaires privés et publics, ainsi qu&apos;à tous ceux qui font vivre cette
                aventure depuis maintenant 4 éditions.
              </p>
              <p>
                Cette année, malgré une très belle ambiance, l&apos;édition s&apos;est malheureusement terminée
                sur un déficit important. Il faut dire que nous nous sommes battus contre les
                éléments… Une canicule qui a bien failli nous faire annuler à la dernière minute, puis
                une évacuation sous l&apos;orage qui a interrompu notre samedi.
              </p>
              <p>
                Il nous a fallu un peu de temps pour digérer tout ça, faire les comptes et réfléchir à
                la suite.
              </p>
              <p>
                Mais une chose n&apos;a pas changé : notre envie de faire vivre la musique près de chez
                nous.
              </p>

              <p className="rounded-xl border border-[var(--accent-red)]/40 bg-[var(--accent-red)]/10 px-4 py-4 text-[var(--foreground)] font-semibold leading-snug">
                C&apos;est pourquoi nous vous donnons rendez-vous le 17 octobre pour une grande soirée de
                concerts rock et métal.
              </p>

              <p>
                Ce sera l&apos;occasion de se retrouver, de partager un bon moment ensemble et, soyons
                transparents, de donner un coup de pouce à l&apos;association.
              </p>
              <p>
                Le succès de cette soirée sera important pour nous. Il nous permettra de préparer la
                suite et de voir dans quelles conditions nous pourrons faire vivre un Barb&apos;n&apos;Rock en
                2027.
              </p>
              <p>
                Une chose est sûre : si nous voulons continuer l&apos;aventure, il faudra aussi repenser le
                format et l&apos;adapter aux nouvelles contraintes : aléas climatiques, calendrier de plus
                en plus chargé, augmentation des coûts d&apos;organisation… Tout cela fera partie de notre
                réflexion pour la suite.
              </p>
              <p>
                Si Barb&apos;n&apos;Rock compte pour vous, venez faire du bruit avec nous. Chaque entrée, chaque
                consommation et chaque partage nous aideront.
              </p>
              <p>On vous dévoilera très bientôt la programmation et toutes les infos.</p>
              <p>Merci encore pour votre soutien.</p>
              <p className="text-[var(--foreground)]">À très vite devant la scène ! 🤘</p>
            </div>

            <div className="shrink-0 border-t border-[var(--border)] px-6 py-4 sm:px-8">
              <Button onClick={dismiss} className="w-full sm:w-auto">
                On a hâte d&apos;y être
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
