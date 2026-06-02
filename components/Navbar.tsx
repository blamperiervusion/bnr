'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Programme',
    submenu: [
      { href: '/programme/vendredi', label: 'Vendredi 26' },
      { href: '/programme/samedi', label: 'Samedi 27' },
      { href: '/programme/dimanche', label: 'Dimanche 28' },
    ],
  },
  { href: '/village', label: 'Le Village' },
  { href: '/partenaires', label: 'Partenaires' },
  { href: '/benevoles', label: 'Bénévoles' },
  { href: '/faq', label: 'FAQ' },
  { href: '/jeu', label: '🎮 Jouer' },
];

import { HELLOASSO_URL } from '@/lib/constants';

const ctaLinks = [
  { href: '/boutique', label: 'Boutique' },
  { href: HELLOASSO_URL, label: 'Billetterie', primary: true, external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    open: {
      opacity: 1,
      clipPath: 'circle(150% at calc(100% - 40px) 40px)',
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12"
              >
                <Image
                  src="/images/logo.png"
                  alt="Barb'n'Rock"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                className="text-xl font-display uppercase tracking-wider hidden sm:block"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-[var(--foreground)]">BARB&apos;N&apos;</span>
                <span className="text-[var(--accent-red)]">ROCK</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  {link.submenu ? (
                    <>
                      <button
                        className="text-[var(--foreground)] hover:text-[var(--accent-red)] transition-colors font-medium uppercase tracking-wide text-sm flex items-center gap-1"
                        onMouseEnter={() => setOpenSubmenu(link.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        {link.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {openSubmenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg overflow-hidden min-w-[180px]"
                            onMouseEnter={() => setOpenSubmenu(link.label)}
                            onMouseLeave={() => setOpenSubmenu(null)}
                          >
                            {link.submenu.map((sublink) => (
                              <Link
                                key={sublink.href}
                                href={sublink.href}
                                className={`block px-4 py-3 text-sm hover:bg-[var(--accent-red)] hover:text-white transition-colors ${
                                  pathname === sublink.href ? 'text-[var(--accent-red)]' : 'text-[var(--foreground)]'
                                }`}
                              >
                                {sublink.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                        pathname === link.href
                          ? 'text-[var(--accent-red)]'
                          : 'text-[var(--foreground)] hover:text-[var(--accent-red)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 ml-4">
                {ctaLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-bold uppercase tracking-wide px-4 py-2 rounded transition-all ${
                        link.primary
                          ? 'bg-[var(--accent-red)] text-white hover:bg-[var(--accent-red-dark)] hover:shadow-[0_0_20px_var(--accent-red)]'
                          : 'border border-[var(--foreground)] text-[var(--foreground)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]'
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-bold uppercase tracking-wide px-4 py-2 rounded transition-all ${
                        link.primary
                          ? 'bg-[var(--accent-red)] text-white hover:bg-[var(--accent-red-dark)] hover:shadow-[0_0_20px_var(--accent-red)]'
                          : 'border border-[var(--foreground)] text-[var(--foreground)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-[var(--foreground)] origin-left"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? -2 : 0,
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-[var(--foreground)]"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? 20 : 0,
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-[var(--foreground)] origin-left"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? 2 : 0,
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden bg-[var(--background)]"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  className="text-center"
                >
                  {link.submenu ? (
                    <div className="space-y-4">
                      <span className="text-2xl font-display uppercase text-[var(--muted-foreground)]">
                        {link.label}
                      </span>
                      <div className="flex flex-col gap-2">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className={`text-xl font-display uppercase tracking-wider ${
                              pathname === sublink.href
                                ? 'text-[var(--accent-red)]'
                                : 'text-[var(--foreground)]'
                            }`}
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-3xl font-display uppercase tracking-wider ${
                        pathname === link.href
                          ? 'text-[var(--accent-red)] neon-glow'
                          : 'text-[var(--foreground)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                custom={navLinks.length}
                variants={linkVariants}
                initial="closed"
                animate="open"
                className="flex flex-col gap-4 mt-8"
              >
                {ctaLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xl font-bold uppercase tracking-wide px-8 py-3 rounded text-center ${
                        link.primary
                          ? 'bg-[var(--accent-red)] text-white'
                          : 'border-2 border-[var(--foreground)] text-[var(--foreground)]'
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-xl font-bold uppercase tracking-wide px-8 py-3 rounded text-center ${
                        link.primary
                          ? 'bg-[var(--accent-red)] text-white'
                          : 'border-2 border-[var(--foreground)] text-[var(--foreground)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-10 text-[200px] font-display text-[var(--muted)] opacity-20 select-none">
              🤘
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
