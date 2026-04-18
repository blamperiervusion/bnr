'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Band {
  name: string;
  imageUrl: string | null;
  day: string;
  order: number;
  isHeadliner: boolean;
}

const SLIDE_WIDTH = 324;
const SLIDE_HEIGHT = 405;

const dayConfig: Record<string, { label: string; date: string; color: string }> = {
  vendredi: { label: 'VENDREDI', date: '26 JUIN', color: '#00E5CC' },
  samedi: { label: 'SAMEDI', date: '27 JUIN', color: '#E85D04' },
  dimanche: { label: 'DIMANCHE', date: '28 JUIN', color: '#00E5CC' },
};

export default function LineupCarouselPage() {
  const [bands, setBands] = useState<Record<string, Band[]>>({ vendredi: [], samedi: [], dimanche: [] });
  const [selectedDay, setSelectedDay] = useState<string>('vendredi');
  const [exporting, setExporting] = useState<number | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/admin/programmation')
      .then(res => res.json())
      .then(data => {
        const byDay: Record<string, Band[]> = { vendredi: [], samedi: [], dimanche: [] };
        data.forEach((band: Band) => {
          if (byDay[band.day]) {
            byDay[band.day].push(band);
          }
        });
        Object.keys(byDay).forEach(day => {
          byDay[day].sort((a, b) => a.order - b.order);
        });
        setBands(byDay);
      });
  }, []);

  const currentBands = bands[selectedDay] || [];
  const config = dayConfig[selectedDay];

  const exportSlide = async (slideIndex: number) => {
    const slide = slidesRef.current[slideIndex];
    if (!slide) return;

    setExporting(slideIndex);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const scale = 1080 / SLIDE_WIDTH;
      const canvas = await html2canvas(slide, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0c0f',
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          const overlay = clonedElement.querySelector('[data-export-overlay]');
          if (overlay) (overlay as HTMLElement).style.display = 'none';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0';
        },
      });

      const link = document.createElement('a');
      const slideName = slideIndex === 0 ? 'lineup' : currentBands[slideIndex - 1]?.name.toLowerCase().replace(/\s+/g, '-');
      link.download = `barbnrock-${selectedDay}-${String(slideIndex + 1).padStart(2, '0')}-${slideName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(null);
    }
  };

  const exportAllSlides = async () => {
    setExportingAll(true);
    const totalSlides = currentBands.length + 1;
    for (let i = 0; i < totalSlides; i++) {
      await exportSlide(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setExportingAll(false);
  };

  return (
    <div className="p-6 min-h-screen bg-[#111]">
      <div className="mb-8">
        <Link href="/admin/ressources" className="text-[#00E5CC] text-sm hover:underline">
          ← Retour aux ressources
        </Link>
        <h1 className="text-4xl font-bold text-white mt-4 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          📸 CARROUSELS LINEUP
        </h1>
        <p className="text-[#00E5CC] text-sm mt-1">
          1 slide lineup + 1 slide par artiste • Format Instagram 1080×1350
        </p>
      </div>

      <div className="flex gap-8">
        {/* Controls */}
        <div className="w-80 shrink-0 bg-[#1a1a1a] rounded-xl p-6 h-fit sticky top-6">
          <h3 className="text-white font-bold mb-4">Sélectionner le jour</h3>
          <div className="flex gap-2 mb-6">
            {Object.entries(dayConfig).map(([day, cfg]) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  selectedDay === day
                    ? 'text-white'
                    : 'bg-[#333] text-gray-400 hover:bg-[#444]'
                }`}
                style={{ backgroundColor: selectedDay === day ? cfg.color : undefined }}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[#333] pt-6">
            <p className="text-gray-400 text-sm mb-4">
              {currentBands.length + 1} slides à exporter
            </p>
            <button
              onClick={exportAllSlides}
              disabled={exportingAll || currentBands.length === 0}
              className="w-full py-4 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: exportingAll ? '#666' : 'linear-gradient(135deg, #E85D04, #ff7b2e)' }}
            >
              {exportingAll ? '⏳ Export en cours...' : '📦 Exporter tout le carrousel'}
            </button>
            <p className="text-gray-500 text-xs mt-3 text-center">
              Ou cliquer sur chaque slide pour export individuel
            </p>
          </div>
        </div>

        {/* Slides Preview */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-5 pb-6">
            {/* Slide 1: Lineup (image générée) */}
            <div
              ref={el => { slidesRef.current[0] = el; }}
              onClick={() => exportSlide(0)}
              className="relative overflow-hidden rounded-xl cursor-pointer shadow-2xl shrink-0"
              style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, background: '#0a0c0f' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/carousel-lineup/${selectedDay}.png`}
                alt={`Lineup ${selectedDay}`}
                className="w-full h-full object-cover"
              />

              {exporting === 0 && (
                <div data-export-overlay className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
                  ⏳ Export...
                </div>
              )}
            </div>

            {/* Artist slides */}
            {currentBands.map((band, index) => (
              <div
                key={band.name}
                ref={el => { slidesRef.current[index + 1] = el; }}
                onClick={() => exportSlide(index + 1)}
                className="relative overflow-hidden rounded-xl cursor-pointer shadow-2xl shrink-0"
                style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, background: '#0a0c0f' }}
              >
                {/* Band image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${band.imageUrl || '/images/placeholder-stand.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                    filter: 'grayscale(20%)',
                  }}
                />
                
                {/* Gradient overlay - reduced opacity */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(10,12,15,0.15) 0%, rgba(10,12,15,0.3) 40%, rgba(10,12,15,0.9) 100%)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-6">
                  {/* Date badge */}
                  <div
                    className="self-start px-4 py-1.5 rounded-full font-bold text-xs"
                    style={{ backgroundColor: config.color, color: config.color === '#E85D04' ? 'white' : 'black' }}
                  >
                    {config.label} {config.date}
                  </div>

                  {/* Band name - centered */}
                  <div className="flex-1 flex items-center justify-center">
                    <h2
                      className="text-white text-center font-bold tracking-wider"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: band.name.length > 12 ? '42px' : '52px',
                        textShadow: '0 0 40px rgba(232, 93, 4, 0.5)',
                        lineHeight: 1.1,
                      }}
                    >
                      {band.name.toUpperCase()}
                    </h2>
                  </div>

                  {/* Footer */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[#00E5CC] text-xs font-bold tracking-widest">BARB'N'ROCK 2026</p>
                      <p className="text-gray-500 text-xs">Crèvecœur-le-Grand</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo.png"
                      alt="Logo"
                      className="w-10 opacity-80"
                    />
                  </div>
                </div>

                {exporting === index + 1 && (
                  <div data-export-overlay className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
                    ⏳ Export...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </div>
  );
}
