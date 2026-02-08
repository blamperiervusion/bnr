'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionTitle, Button } from '@/components/ui';
import MoshPitGame from './MoshPitGame';

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const handleGameEnd = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
    setIsPlaying(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-pink)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-pink)] uppercase tracking-widest mb-4">
              🎮 Bonus
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight text-[var(--foreground)]">
              MOSH PIT SURVIVOR
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] mt-4 max-w-2xl mx-auto">
              Survie le plus longtemps possible dans le mosh pit ! 
              Évite les moseurs fous et collectionne les guitares.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {!isPlaying ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Game preview / Start screen */}
              <div className="relative bg-[var(--muted)]/50 border-2 border-[var(--border)] rounded-xl p-12 mb-8 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      var(--accent-red) 0px,
                      var(--accent-red) 2px,
                      transparent 2px,
                      transparent 10px
                    )`,
                  }} />
                </div>

                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-6"
                  >
                    🤘
                  </motion.div>

                  <h2 className="font-display text-4xl text-[var(--foreground)] mb-4">
                    PRÊT À MOSHER ?
                  </h2>

                  {highScore > 0 && (
                    <p className="text-[var(--accent-red)] text-xl mb-6">
                      🏆 Meilleur score : {highScore} points
                    </p>
                  )}

                  <div className="space-y-4 text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-4">
                      <kbd className="px-3 py-1 bg-[var(--muted)] rounded border border-[var(--border)]">↑</kbd>
                      <kbd className="px-3 py-1 bg-[var(--muted)] rounded border border-[var(--border)]">↓</kbd>
                      <kbd className="px-3 py-1 bg-[var(--muted)] rounded border border-[var(--border)]">←</kbd>
                      <kbd className="px-3 py-1 bg-[var(--muted)] rounded border border-[var(--border)]">→</kbd>
                      <span className="text-sm">ou WASD pour bouger</span>
                    </div>
                    <p className="text-sm">
                      🎸 Attrape les guitares pour gagner des points<br />
                      💀 Évite les moseurs pour survivre<br />
                      ⚡ Plus tu survis longtemps, plus c&apos;est difficile !
                    </p>
                  </div>

                  <Button onClick={() => setIsPlaying(true)} size="lg">
                    🎮 Commencer la partie
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MoshPitGame onGameEnd={handleGameEnd} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🎯',
                title: 'Objectif',
                description: 'Survie le plus longtemps possible et accumule un maximum de points !',
              },
              {
                emoji: '🎸',
                title: 'Collecte',
                description: 'Chaque guitare attrapée te rapporte des points bonus.',
              },
              {
                emoji: '💀',
                title: 'Danger',
                description: 'Évite les moseurs fous qui arrivent de tous les côtés !',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-6 text-center"
              >
                <span className="text-4xl block mb-3">{item.emoji}</span>
                <h3 className="font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
