'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementBannerProps {
  onClose?: () => void;
}

export default function AnnouncementBanner({ onClose }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[var(--accent-red)] via-[#ff4d4d] to-[var(--accent-red)] text-white z-[60] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 sm:gap-4 text-center">
            <span className="text-lg hidden sm:inline">🎸</span>
            <p className="text-xs sm:text-sm font-medium">
              <span className="font-bold">TREMPLIN BARB&apos;N&apos;ROCK 2026</span>
              <span className="mx-2 opacity-60">|</span>
              <span className="hidden sm:inline">4 avril 2026 — </span>
              <span>Inscriptions ouvertes !</span>
            </p>
            <Link
              href="/tremplin"
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
            >
              S&apos;inscrire →
            </Link>
            <button
              onClick={handleClose}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
