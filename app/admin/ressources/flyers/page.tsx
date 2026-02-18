'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type FlyerType = 'chaos' | 'famille';

interface FlyerConfig {
  type: FlyerType;
  title: string;
  badge: string;
  mainTitle: string;
  subtitle: string;
  headliners: string;
  lineup: string;
  date: string;
  price: string;
  priceLabel: string;
  highlights: string[];
}

const flyerConfigs: FlyerConfig[] = [
  {
    type: 'chaos',
    title: '2 Jours de Chaos',
    badge: 'METAL • PUNK • ROCK',
    mainTitle: '2 JOURS DE <span class="accent">CHAOS</span>',
    subtitle: '100% METAL FRANÇAIS',
    headliners: 'Loudblast • Shaârghot • Psykup',
    lineup: 'Akiavel • Cachemire • Krav Boca • Dirty Fonzy • Kami No Ikari • Barabbas • Black Hazard • Breakout',
    date: 'VENDREDI 26 & SAMEDI 27 JUIN 2026',
    price: '33€',
    priceLabel: '2 JOURS',
    highlights: ['🎸 12 groupes', '🍺 Village', '🏕️ Camping gratuit'],
  },
  {
    type: 'famille',
    title: 'Dimanche en Famille',
    badge: 'JOURNÉE FAMILLE',
    mainTitle: 'DIMANCHE <span class="accent">EN FAMILLE</span>',
    subtitle: 'ROCK ACCESSIBLE À TOUS',
    headliners: 'Mainkind + Tremplin',
    lineup: 'Animations • Concours de Barbe • Air Guitar • Espace Enfants',
    date: 'DIMANCHE 28 JUIN 2026',
    price: '5€',
    priceLabel: 'DIMANCHE',
    highlights: ['👶 -12 ans gratuit', '🎉 Animations', '🏕️ Ambiance détendue'],
  },
];

export default function FlyerGeneratorPage() {
  const [selectedType, setSelectedType] = useState<FlyerType>('chaos');
  const [isExporting, setIsExporting] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  const config = flyerConfigs.find((c) => c.type === selectedType)!;

  const exportPNG = async () => {
    if (!flyerRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2.5, // For A5 print quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0c0f',
      });

      const link = document.createElement('a');
      link.download = `flyer-${selectedType}-a5.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const accentColor = selectedType === 'chaos' ? '#E85D04' : '#00E5CC';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/ressources" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux ressources
          </Link>
          <h1 className="text-2xl font-bold text-white">Générateur Flyers A5</h1>
          <p className="text-sm text-gray-500">Format A5 (148×210mm) pour impression</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-72 shrink-0">
          {/* Type selector */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-white mb-3">Type de flyer</h3>
            <div className="space-y-2">
              {flyerConfigs.map((flyer) => (
                <button
                  key={flyer.type}
                  onClick={() => setSelectedType(flyer.type)}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    selectedType === flyer.type
                      ? flyer.type === 'chaos'
                        ? 'bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]'
                        : 'bg-[#00E5CC]/20 text-[#00E5CC] border border-[#00E5CC]'
                      : 'bg-[#1a1a1a] text-gray-400 border border-[#333] hover:bg-[#222]'
                  }`}
                >
                  <div className="font-medium">{flyer.title}</div>
                  <div className="text-xs opacity-70 mt-1">{flyer.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">Détails</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Prix affiché :</span>
                <span className="text-white ml-2">{config.price}</span>
              </div>
              <div>
                <span className="text-gray-500">Têtes d&apos;affiche :</span>
                <p className="text-white mt-1">{config.headliners}</p>
              </div>
              <div>
                <span className="text-gray-500">Highlights :</span>
                <ul className="text-white mt-1 space-y-1">
                  {config.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="mt-4">
            <button
              onClick={exportPNG}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E85D04] text-white rounded-lg font-medium hover:bg-[#ff6b1a] transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Export...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter PNG (A5)
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Résolution haute qualité pour impression
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500 mb-4">
              Preview (50% de la taille réelle)
            </div>

            {/* Flyer */}
            <div
              ref={flyerRef}
              className="relative overflow-hidden shadow-2xl"
              style={{
                width: 370, // 148mm * 2.5
                height: 525, // 210mm * 2.5
                background: '#0a0c0f',
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/images/hero-visual.jpg)',
                  opacity: selectedType === 'chaos' ? 0.5 : 0.45,
                  filter: selectedType === 'chaos'
                    ? 'grayscale(100%) contrast(1.2) sepia(30%)'
                    : 'grayscale(100%) contrast(1.1) hue-rotate(180deg)',
                }}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: selectedType === 'chaos'
                    ? 'linear-gradient(180deg, rgba(10,12,15,0.3) 0%, rgba(10,12,15,0.5) 25%, rgba(20,10,5,0.75) 60%, rgba(10,12,15,0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(10,12,15,0.25) 0%, rgba(10,12,15,0.45) 30%, rgba(5,15,15,0.7) 65%, rgba(10,12,15,0.92) 100%)',
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-16 h-auto"
                  />
                  <div
                    className="text-white font-bold text-xs tracking-wider px-3 py-1.5"
                    style={{
                      fontFamily: 'Oswald, sans-serif',
                      background: accentColor,
                      color: selectedType === 'famille' ? '#0a0c0f' : 'white',
                    }}
                  >
                    {config.badge}
                  </div>
                </div>

                {/* Main */}
                <div className="flex-1 flex flex-col justify-center text-center px-2">
                  <div
                    className="text-4xl font-bold uppercase leading-none mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: config.mainTitle }}
                  />
                  <div
                    className="text-sm text-gray-400 uppercase tracking-widest mb-5"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {config.subtitle}
                  </div>

                  <div
                    className="text-base font-semibold text-white uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {config.headliners}
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed mb-4">
                    {config.lineup}
                  </div>

                  <div className="flex justify-center gap-4 flex-wrap">
                    {config.highlights.map((h, i) => (
                      <span key={i} className="text-xs text-gray-400">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <div
                    className="text-xl font-semibold text-white mb-1"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {config.date}
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Crèvecœur-le-Grand (60) • 1h de Paris
                  </div>

                  <div className="flex justify-center gap-5 mb-4">
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold"
                        style={{ fontFamily: 'Oswald, sans-serif', color: accentColor }}
                      >
                        {config.price}
                      </div>
                      <div className="text-xs text-gray-400 uppercase">
                        {config.priceLabel}
                      </div>
                    </div>
                    {selectedType === 'chaos' && (
                      <div className="text-center">
                        <div
                          className="text-3xl font-bold"
                          style={{ fontFamily: 'Oswald, sans-serif', color: accentColor }}
                        >
                          36€
                        </div>
                        <div className="text-xs text-gray-400 uppercase">
                          PASS 3 JOURS
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="inline-block px-6 py-2 text-sm font-semibold uppercase tracking-wider rounded"
                    style={{
                      fontFamily: 'Oswald, sans-serif',
                      background: accentColor,
                      color: selectedType === 'famille' ? '#0a0c0f' : 'white',
                    }}
                  >
                    barbnrock-festival.fr
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for accent class */}
      <style jsx global>{`
        .accent {
          color: ${accentColor};
        }
      `}</style>
    </div>
  );
}
