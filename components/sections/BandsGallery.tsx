'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SectionTitle, Button } from '@/components/ui';
import { programme, Band } from '@/lib/data/programme';

interface BandWithDay extends Band {
  daySlug: string;
  dayName: string;
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
}

export default function BandsGallery() {
  const [selectedBand, setSelectedBand] = useState<BandWithDay | null>(null);

  // Custom order for bands on home page
  const customOrder = [
    'Shaârghot',
    'Krav Boca',
    'Cachemire',
    'Loudblast',
    'Psykup',
    'Akiavel',
    'Dirty Fonzy',
    'Kami No Ikari',
    'Breakout',
    'Barabbas',
    'Black Hazard',
    'Mainkind',
    'Howlite',
    'Udap',
    'Devon Duxe',
    'Saint Rock Station',
  ];
  
  const confirmedBands = programme
    .flatMap(day => day.bands.map(band => ({ ...band, daySlug: day.slug, dayName: day.day })))
    .filter(band => !band.name.includes('confirmer') && !band.name.includes('Tremplin'))
    .sort((a, b) => {
      const indexA = customOrder.indexOf(a.name);
      const indexB = customOrder.indexOf(b.name);
      // If both are in custom order, sort by custom order
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only one is in custom order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // Otherwise, sort by day (dimanche last) then by order
      const dayOrder = { 'vendredi': 1, 'samedi': 2, 'dimanche': 3 };
      const dayDiff = (dayOrder[a.daySlug as keyof typeof dayOrder] || 0) - (dayOrder[b.daySlug as keyof typeof dayOrder] || 0);
      if (dayDiff !== 0) return dayDiff;
      return a.order - b.order;
    });

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent-red)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent-cyan)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle subtitle="2 jours de chaos, 1 jour de repos">
          <span className="text-[var(--accent-cyan)]">⚡</span> LES GROUPES <span className="text-[var(--accent-cyan)]">⚡</span>
        </SectionTitle>

        {/* Bands grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12">
          {confirmedBands.map((band, index) => (
            <motion.div
              key={band.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedBand(band)}
              className="cursor-pointer group"
            >
              <motion.div
                className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent group-hover:border-[var(--accent-red)] transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Band image or placeholder */}
                <div className="absolute inset-0 bg-[var(--muted)]">
                  {band.imageUrl ? (
                    <Image
                      src={band.imageUrl}
                      alt={band.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--muted)] to-[var(--background)]">
                      <span className="text-4xl font-display text-[var(--accent-cyan)]">{band.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Day badge */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                  band.daySlug === 'vendredi' ? 'bg-[var(--accent-cyan)] text-black' :
                  band.daySlug === 'samedi' ? 'bg-[var(--accent-orange)] text-white' :
                  'bg-white/90 text-black'
                }`}>
                  {band.dayName.slice(0, 3)}
                </div>

                {/* Overlay with play button or info icon */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-[var(--accent-cyan)] flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    {band.videoUrl ? (
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </motion.div>
                </div>

                {/* Band name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <h3 className="font-display text-sm md:text-base uppercase tracking-wider text-white truncate">
                    {band.name}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button href="/programme/samedi" variant="outline">
            Voir toute la programmation
          </Button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedBand && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={() => setSelectedBand(null)}
            />

            {/* Modal content */}
            <motion.div
              className="relative z-10 w-full max-w-4xl bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBand(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center hover:bg-[var(--accent-red)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video embed */}
              {selectedBand.videoUrl && (
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedBand.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Band info */}
              <div className="p-6">
                <h3 className="font-display text-3xl uppercase tracking-wider text-[var(--accent-red)] mb-2">
                  {selectedBand.name}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {selectedBand.description}
                </p>
                <div className="flex items-center gap-4">
                  {selectedBand.time && (
                    <span className="text-sm text-[var(--accent-cyan)]">
                      {selectedBand.dayName} {selectedBand.time}
                    </span>
                  )}
                  <Button href={`/programme/${selectedBand.daySlug}`} size="sm">
                    Voir le programme complet
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
