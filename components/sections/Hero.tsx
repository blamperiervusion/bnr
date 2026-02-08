'use client';

import { Button } from '@/components/ui';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// Lightning bolt SVG component
const LightningBolt = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 100 200"
    className={`${className} pointer-events-none`}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
    }}
    style={{
      filter: 'drop-shadow(0 0 10px var(--accent-orange))',
    }}
    transition={{ 
      duration: 0.2,
      repeat: Infinity,
      repeatDelay: 2 + delay,
      delay: delay,
    }}
  >
    <path
      d="M50 0 L30 80 L50 80 L20 200 L80 70 L55 70 L80 0 Z"
      fill="var(--accent-orange)"
    />
  </motion.svg>
);

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y }}>
        {/* Base background */}
        <div className="absolute inset-0 bg-[#0a0c0f]" />
        
        {/* Cyan spotlight from top */}
        <div 
          className="absolute top-0 left-0 right-0 h-[70vh]"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,234,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Orange glows at bottom corners */}
        <div 
          className="absolute bottom-0 left-0 w-[50%] h-[50%]"
          style={{
            background: 'radial-gradient(ellipse at 0% 100%, rgba(232,93,4,0.25) 0%, transparent 60%)',
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[50%] h-[50%]"
          style={{
            background: 'radial-gradient(ellipse at 100% 100%, rgba(232,93,4,0.25) 0%, transparent 60%)',
          }}
        />

        {/* Lightning bolts */}
        <LightningBolt className="absolute top-[15%] left-[8%] w-12 h-24" delay={0} />
        <LightningBolt className="absolute top-[20%] right-[10%] w-10 h-20" delay={1.2} />
        <LightningBolt className="absolute top-[25%] left-[15%] w-8 h-16" delay={2.4} />
        <LightningBolt className="absolute top-[18%] right-[5%] w-10 h-20" delay={0.6} />
        <LightningBolt className="absolute bottom-[25%] left-[3%] w-8 h-16" delay={1.8} />
        <LightningBolt className="absolute bottom-[20%] right-[8%] w-10 h-20" delay={0.9} />

        {/* Bottom glow animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(to top, rgba(232,93,4,0.3) 0%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-4xl mx-auto"
        style={{ opacity }}
      >
        {/* Logo */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, -1, 1, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 mx-auto"
          >
            <Image
              src="/images/logo.png"
              alt="Barb'n'Rock"
              fill
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,229,204,0.4))' }}
              priority
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-[var(--accent-cyan)]">Bearded</span>
          <span className="text-[var(--accent-orange)] mx-2">⚡</span>
          <span className="text-[var(--accent-cyan)]">Rock</span>
          <span className="text-[var(--accent-orange)] mx-2">⚡</span>
          <span className="text-[var(--accent-cyan)]">Experience</span>
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="font-display leading-none tracking-tight mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white">BARB&apos;N&apos;</span>
          <motion.span
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[var(--accent-orange)]"
            animate={{
              textShadow: [
                '0 0 20px rgba(232,93,4,0.5)',
                '0 0 40px rgba(232,93,4,0.8)',
                '0 0 20px rgba(232,93,4,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ROCK
          </motion.span>
        </motion.h1>

        {/* Date */}
        <motion.div
          className="mb-8 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-2xl sm:text-3xl md:text-4xl font-display tracking-wider text-white">
            26 — 28 JUIN 2026
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/90 uppercase tracking-widest">
            Crèvecœur-le-Grand
          </p>
          <p className="text-sm sm:text-base text-[var(--accent-cyan)] uppercase tracking-wide font-semibold pt-1">
            2 jours de chaos, 1 jour de repos — Camping gratuit
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button href="/billetterie" size="lg">
            Réserver mes places 🎫
          </Button>
          <Button href="/programme/samedi" variant="outline" size="lg">
            Voir le programme
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-[var(--accent-cyan)]/50 rounded-full flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-[var(--accent-orange)] rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
