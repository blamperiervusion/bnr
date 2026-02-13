'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HELLOASSO_URL } from '@/lib/constants';

const footerLinks = {
  festival: [
    { href: '/programme/vendredi', label: 'Programme Vendredi' },
    { href: '/programme/samedi', label: 'Programme Samedi' },
    { href: '/programme/dimanche', label: 'Programme Dimanche' },
    { href: '/village', label: 'Le Village' },
    { href: '/faq', label: 'FAQ' },
  ],
  pratique: [
    { href: HELLOASSO_URL, label: 'Billetterie', external: true },
    { href: '/boutique', label: 'Boutique' },
    { href: '/benevoles', label: 'Devenir bénévole' },
  ],
  partenaires: [
    { href: '/partenaires', label: 'Nos partenaires' },
    { href: '/devenir-partenaire', label: 'Devenir partenaire' },
  ],
};

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/barbnrock',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/barbnrock',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@barbnrock',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/playlist/barbnrock',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--muted)]/50 border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-16 h-16"
              >
                <Image
                  src="/images/logo.png"
                  alt="Barb'n'Rock"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                className="text-2xl font-display uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-[var(--foreground)]">BARB&apos;N&apos;</span>
                <span className="text-[var(--accent-red)]">ROCK</span>
              </motion.div>
            </Link>
            <p className="text-[var(--muted-foreground)] mb-4">
              Le festival rock & metal qui fait trembler l&apos;Oise depuis 2023.
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              Organisé par l&apos;ACPC (Association Crépicordienne pour la Promotion de la Culture) - Loi 1901
            </p>
            <p className="text-2xl font-display text-[var(--accent-red)]">
              26-28 JUIN 2026
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              📍 Crèvecœur-le-Grand (60)
            </p>
          </div>

          {/* Festival Links */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-[var(--foreground)]">
              Le Festival
            </h3>
            <ul className="space-y-3">
              {footerLinks.festival.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pratique Links */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-[var(--foreground)]">
              Infos Pratiques
            </h3>
            <ul className="space-y-3">
              {footerLinks.pratique.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires + Social */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-[var(--foreground)]">
              Partenaires
            </h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.partenaires.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-[var(--foreground)]">
              Suivez-nous
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Barb&apos;n&apos;Rock Festival. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/mentions-legales"
              className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              href="mailto:barbnrock.festival@gmail.com"
              className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
