'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

export default function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background with aggressive gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[var(--accent-red-dark)] to-black" />
      
      {/* Diagonal stripes overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent 0px,
            transparent 10px,
            var(--accent-red) 10px,
            var(--accent-red) 12px
          )`,
        }}
      />
      
      {/* Animated noise */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-display text-5xl md:text-7xl lg:text-9xl text-white mb-6 tracking-tight uppercase"
            animate={{ 
              textShadow: [
                '4px 4px 0 var(--accent-red)',
                '6px 6px 0 var(--accent-red)',
                '4px 4px 0 var(--accent-red)'
              ] 
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            PRÊT À{' '}
            <motion.span
              className="inline-block"
              animate={{ 
                rotate: [-2, 2, -2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              MOSHER
            </motion.span>
            ?
          </motion.h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-bold">
            2 JOURS DE CHAOS. 1 JOUR DE REPOS. PLACES LIMITÉES.
            <span className="block text-[var(--accent-cyan)] mt-2">
              Ramène tes potes.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/billetterie"
              size="lg"
              className="bg-white text-black font-black hover:bg-[var(--accent-cyan)] hover:text-black hover:shadow-[0_0_40px_var(--accent-cyan)] transition-all uppercase"
            >
              🎫 Chope ton pass
            </Button>
            <Button
              href="/village"
              variant="outline"
              size="lg"
              className="border-white border-2 text-white hover:bg-white hover:text-black font-black uppercase"
            >
              🍺 Le Village
            </Button>
          </div>
        </motion.div>

        {/* Decorative elements - skulls and stuff */}
        <motion.div 
          className="absolute -bottom-10 left-1/4 text-[150px] opacity-20 select-none pointer-events-none"
          animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💀
        </motion.div>
        <motion.div 
          className="absolute -top-10 right-1/4 text-[100px] opacity-20 select-none pointer-events-none"
          animate={{ rotate: [0, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <motion.div 
          className="absolute top-1/2 left-10 text-[80px] opacity-30 select-none pointer-events-none text-[var(--accent-cyan)]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚡
        </motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-10 text-[60px] opacity-30 select-none pointer-events-none text-[var(--accent-cyan)]"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        >
          ⚡
        </motion.div>
      </div>
    </section>
  );
}
