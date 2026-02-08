'use client';

import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function SectionTitle({ 
  children, 
  subtitle, 
  className = '',
  align = 'center' 
}: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div
      className={`mb-12 ${alignClasses[align]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <GlitchText
        as="h2"
        className="text-5xl md:text-6xl lg:text-7xl font-display uppercase tracking-wider text-[var(--foreground)]"
      >
        {children}
      </GlitchText>
      
      {subtitle && (
        <motion.p
          className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Decorative line */}
      <motion.div
        className={`mt-6 h-1 bg-gradient-to-r from-transparent via-[var(--accent-red)] to-transparent ${
          align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto' : 'ml-auto'
        }`}
        initial={{ width: 0 }}
        whileInView={{ width: '200px' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </motion.div>
  );
}
