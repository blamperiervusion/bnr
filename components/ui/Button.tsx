'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold uppercase tracking-wider
    transition-all duration-300 ease-out
    relative overflow-hidden
    cursor-pointer
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[var(--accent-red)] to-[var(--accent-red-dark)]
      text-white border-none
      hover:shadow-[0_0_30px_var(--accent-red)]
    `,
    outline: `
      bg-transparent text-[var(--foreground)]
      border-2 border-[var(--accent-red)]
      hover:bg-[var(--accent-red)] hover:text-white
      hover:shadow-[0_0_20px_var(--accent-red)]
    `,
    ghost: `
      bg-transparent text-[var(--foreground)]
      border-none
      hover:text-[var(--accent-red)]
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const MotionComponent = motion.button;

  const content = (
    <>
      {/* Shine effect */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClasses} group`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content}
        </motion.a>
      );
    }
    return (
      <Link href={href} className={`${buttonClasses} group`}>
        <motion.span
          className="flex items-center justify-center gap-2 w-full h-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <MotionComponent
      type={type}
      onClick={onClick}
      className={`${buttonClasses} group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {content}
    </MotionComponent>
  );
}
