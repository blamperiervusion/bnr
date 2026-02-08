'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and show loader only on first visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasVisited', 'true');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative"
        >
          {/* Fire glow effect */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            animate={{
              background: [
                'radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(103,232,249,0.6) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Logo image */}
          <motion.div
            className="relative w-40 h-40 md:w-56 md:h-56 mx-auto"
            animate={{ 
              rotate: [0, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/images/logo.png"
              alt="Barb'n'Rock"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
              priority
            />
          </motion.div>
          
          <motion.h1
            className="font-display text-4xl md:text-5xl relative z-10 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-[var(--foreground)]">BARB&apos;N&apos;</span>
            <span className="text-[var(--accent-red)]">ROCK</span>
          </motion.h1>
        </motion.div>

        {/* Loading bar */}
        <div className="mt-8 w-48 h-1 bg-[var(--muted)] rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-red)] to-[var(--accent-cyan)]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          className="mt-4 text-sm uppercase tracking-widest font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-[var(--accent-cyan)]">⚡</span>
          <span className="text-[var(--muted-foreground)]"> BEARDED ROCK EXPERIENCE </span>
          <span className="text-[var(--accent-cyan)]">⚡</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
