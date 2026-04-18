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
    
    // Attendre que les fonts soient chargées
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const html2canvas = (await import('html2canvas')).default;
      // Augmenter le scale pour une meilleure qualité (4x au lieu de 3.33x)
      const scale = 4;
      const canvas = await html2canvas(slide, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0c0f',
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc, clonedElement) => {
          const overlay = clonedElement.querySelector('[data-export-overlay]');
          if (overlay) (overlay as HTMLElement).style.display = 'none';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0';
        },
      });
      
      // Redimensionner à 1080x1350 pour une qualité optimale
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1080;
      finalCanvas.height = 1350;
      const ctx = finalCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, 1080, 1350);
      }

      const link = document.createElement('a');
      const slideName = slideIndex === 0 ? 'lineup' : currentBands[slideIndex - 1]?.name.toLowerCase().replace(/\s+/g, '-');
      link.download = `barbnrock-${selectedDay}-${String(slideIndex + 1).padStart(2, '0')}-${slideName}.png`;
      link.href = finalCanvas.toDataURL('image/png', 1.0);
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
              style={{ 
                width: SLIDE_WIDTH, 
                height: SLIDE_HEIGHT, 
                backgroundImage: `url(/images/carousel-lineup/${selectedDay}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0a0c0f',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                flexShrink: 0,
              }}
            >
              {exporting === 0 && (
                <div 
                  data-export-overlay 
                  style={{ 
                    position: 'absolute', 
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#ffffff' 
                  }}
                >
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
                style={{ 
                  width: SLIDE_WIDTH, 
                  height: SLIDE_HEIGHT, 
                  backgroundColor: '#0a0c0f',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  flexShrink: 0,
                }}
              >
                {/* Band image */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${band.imageUrl || '/images/placeholder-stand.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                  }}
                />
                
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(10,12,15,0.15) 0%, rgba(10,12,15,0.3) 40%, rgba(10,12,15,0.9) 100%)',
                  }}
                />

                {/* Date badge - absolute top left */}
                <div
                  style={{ 
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 10,
                    padding: '6px 16px', 
                    borderRadius: 9999, 
                    fontWeight: 'bold', 
                    fontSize: 12,
                    backgroundColor: config.color, 
                    color: config.color === '#E85D04' ? '#ffffff' : '#000000',
                  }}
                >
                  {config.label} {config.date}
                </div>

                {/* Band name - absolute center */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: '90%',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      letterSpacing: 2,
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: band.name.length > 12 ? 42 : 52,
                      textShadow: '0 0 40px rgba(232, 93, 4, 0.5)',
                    }}
                  >
                    {band.name.toUpperCase()}
                  </span>
                </div>

                {/* Footer left - absolute bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    zIndex: 10,
                  }}
                >
                  <div style={{ color: '#00E5CC', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 }}>
                    BARB&apos;N&apos;ROCK 2026
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>
                    Crèvecœur-le-Grand
                  </div>
                </div>

                {/* Logo - absolute bottom right */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  style={{ 
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 40, 
                    opacity: 0.8,
                    zIndex: 10,
                  }}
                />

                {exporting === index + 1 && (
                  <div 
                    data-export-overlay 
                    style={{ 
                      position: 'absolute', 
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.7)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#ffffff',
                      zIndex: 20,
                    }}
                  >
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
