'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

export default function GlitchText({ 
  children, 
  className = '', 
  as: Component = 'span' 
}: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative inline-block"
    >
      <Component className={`relative ${className}`}>
        {/* Main text */}
        <span className="relative z-10">{children}</span>
        
        {/* Glitch layers */}
        {isHovered && (
          <>
            <motion.span
              className="absolute top-0 left-0 text-[var(--accent-red)] opacity-70"
              animate={{
                x: [0, -2, 2, -2, 0],
                y: [0, 1, -1, 1, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              aria-hidden="true"
            >
              {children}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 text-[var(--accent-pink)] opacity-70"
              animate={{
                x: [0, 2, -2, 2, 0],
                y: [0, -1, 1, -1, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              aria-hidden="true"
            >
              {children}
            </motion.span>
          </>
        )}
      </Component>
    </motion.div>
  );
}
