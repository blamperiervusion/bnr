'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowColor?: 'red' | 'cyan' | 'pink' | 'purple';
}

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  glowColor = 'cyan' 
}: CardProps) {
  const glowColors = {
    red: 'hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(103,232,249,0.3)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  };

  return (
    <motion.div
      className={`
        bg-[var(--muted)]/50 backdrop-blur-sm
        border border-[var(--border)]
        rounded-lg overflow-hidden
        transition-all duration-300
        ${hover ? `hover:border-[var(--accent-red)] ${glowColors[glowColor]}` : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hover ? { y: -5 } : undefined}
    >
      {children}
    </motion.div>
  );
}
