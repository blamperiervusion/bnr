'use client';

import { useState } from 'react';
import Link from 'next/link';

interface VideoPreset {
  id: string;
  title: string;
  badge: string;
  badgeClass?: 'cyan' | 'orange' | 'red';
  mainText: string;
  subtitle: string;
  infoBox: string;
  youtubeUrl?: string;
  youtubeStart?: number;
}

interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  presets: VideoPreset[];
}

const videoPresets: VideoCategory[] = [
  {
    id: 'artistes',
    title: 'Artistes',
    icon: '🎤',
    presets: [
      {
        id: 'shaarghot',
        title: 'Shaârghot',
        badge: '🔥 ANNONCE',
        mainText: 'SHAÂRGHOT',
        subtitle: 'Cyber Metal • Paris',
        infoBox: 'SAMEDI 27 JUIN',
        youtubeUrl: 'dQw4w9WgXcQ',
        youtubeStart: 0,
      },
      {
        id: 'loudblast',
        title: 'Loudblast',
        badge: '🔥 ANNONCE',
        mainText: 'LOUDBLAST',
        subtitle: 'Death Metal • Lille • Depuis 1985',
        infoBox: 'SAMEDI 27 JUIN',
      },
      {
        id: 'psykup',
        title: 'Psykup',
        badge: '🔥 ANNONCE',
        mainText: 'PSYKUP',
        subtitle: 'AutrucheCore • Toulouse • 30 ans',
        infoBox: 'VENDREDI 26 JUIN',
      },
      {
        id: 'cachemire',
        title: 'Cachemire',
        badge: '🔥 ANNONCE',
        mainText: 'CACHEMIRE',
        subtitle: "Rock'n'Roll • Nantes",
        infoBox: 'VENDREDI 26 JUIN',
      },
      {
        id: 'kravboca',
        title: 'Krav Boca',
        badge: '🔥 ANNONCE',
        mainText: 'KRAV BOCA',
        subtitle: 'Punk Rap Mandoline',
        infoBox: 'SAMEDI 27 JUIN',
      },
      {
        id: 'akiavel',
        title: 'Akiavel',
        badge: '🔥 ANNONCE',
        mainText: 'AKIAVEL',
        subtitle: 'Death Metal Moderne',
        infoBox: 'SAMEDI 27 JUIN',
      },
    ],
  },
  {
    id: 'programmation',
    title: 'Programmation',
    icon: '📋',
    presets: [
      {
        id: 'prog-complete',
        title: 'Prog Complète',
        badge: '🔥 PROGRAMME',
        badgeClass: 'orange',
        mainText: '',
        subtitle: '',
        infoBox: '',
      },
      {
        id: 'prog-vendredi',
        title: 'Vendredi',
        badge: 'VENDREDI',
        badgeClass: 'cyan',
        mainText: 'VENDREDI<br><span class="accent">26 JUIN</span>',
        subtitle: 'Psykup • Cachemire • ...',
        infoBox: '13€ LA JOURNÉE',
      },
      {
        id: 'prog-samedi',
        title: 'Samedi',
        badge: 'SAMEDI',
        badgeClass: 'orange',
        mainText: 'SAMEDI<br><span class="orange">27 JUIN</span>',
        subtitle: 'Loudblast • Shaârghot • Akiavel • Krav Boca • ...',
        infoBox: '22€ LA JOURNÉE',
      },
    ],
  },
  {
    id: 'countdown',
    title: 'Countdown',
    icon: '⏱️',
    presets: [
      {
        id: 'countdown-j60',
        title: 'J-60',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-60',
        subtitle: 'LE CHAOS APPROCHE',
        infoBox: '36€ PASS 3 JOURS',
      },
      {
        id: 'countdown-j30',
        title: 'J-30',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-30',
        subtitle: "PLUS QU'UN MOIS",
        infoBox: '36€ PASS 3 JOURS',
      },
      {
        id: 'countdown-j7',
        title: 'J-7',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-7',
        subtitle: 'UNE SEMAINE',
        infoBox: 'DERNIÈRES PLACES',
      },
    ],
  },
  {
    id: 'billetterie',
    title: 'Billetterie',
    icon: '🎫',
    presets: [
      {
        id: 'billets-ouverture',
        title: 'Ouverture Billetterie',
        badge: "🎫 C'EST PARTI",
        badgeClass: 'orange',
        mainText: 'BILLETS<br><span class="accent">EN VENTE</span>',
        subtitle: '36€ le pass 3 jours',
        infoBox: 'CAMPING GRATUIT',
      },
      {
        id: 'billets-earlybird',
        title: 'Early Bird épuisés',
        badge: '🔥 SOLD OUT',
        badgeClass: 'red',
        mainText: 'EARLY BIRD<br><span class="accent">ÉPUISÉS</span>',
        subtitle: 'Merci ! 🖤',
        infoBox: 'TARIF NORMAL : 42€',
      },
    ],
  },
  {
    id: 'benevoles',
    title: 'Bénévoles',
    icon: '🙋',
    presets: [
      {
        id: 'benevoles-appel',
        title: 'Appel Bénévoles',
        badge: '🙋 BÉNÉVOLES',
        badgeClass: 'cyan',
        mainText: "REJOINS<br><span class='accent'>L'ÉQUIPE</span>",
        subtitle: '50+ bénévoles recherchés',
        infoBox: 'PASS OFFERT',
      },
    ],
  },
];

export default function VideoGeneratorPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(videoPresets[0].id);
  const [selectedPreset, setSelectedPreset] = useState<VideoPreset>(videoPresets[0].presets[0]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Custom overrides
  const [customBadge, setCustomBadge] = useState('');
  const [customMainText, setCustomMainText] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customInfoBox, setCustomInfoBox] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeStart, setYoutubeStart] = useState(0);

  const currentCategory = videoPresets.find((c) => c.id === selectedCategory);

  const handlePresetSelect = (preset: VideoPreset) => {
    setSelectedPreset(preset);
    setCustomBadge('');
    setCustomMainText('');
    setCustomSubtitle('');
    setCustomInfoBox('');
    setYoutubeUrl(preset.youtubeUrl || '');
    setYoutubeStart(preset.youtubeStart || 0);
    // Replay animation
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  };

  const replayAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Get display values
  const displayBadge = customBadge || selectedPreset.badge;
  const displayMainText = customMainText || selectedPreset.mainText;
  const displaySubtitle = customSubtitle || selectedPreset.subtitle;
  const displayInfoBox = customInfoBox || selectedPreset.infoBox;
  const displayYoutubeUrl = youtubeUrl || selectedPreset.youtubeUrl;

  // Build YouTube embed URL
  const youtubeEmbedUrl = displayYoutubeUrl
    ? `https://www.youtube.com/embed/${displayYoutubeUrl}?autoplay=1&mute=1&loop=1&playlist=${displayYoutubeUrl}&controls=0&showinfo=0&start=${youtubeStart}`
    : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/ressources" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux ressources
          </Link>
          <h1 className="text-2xl font-bold text-white">Générateur Vidéo</h1>
          <p className="text-sm text-gray-500">Format 9:16 pour TikTok / Reels</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Categories & Presets */}
        <div className="w-80 shrink-0">
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            {videoPresets.map((category) => (
              <div key={category.id} className="border-b border-[#222] last:border-b-0">
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#00E5CC]/10 text-[#00E5CC]'
                      : 'text-gray-400 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.title}
                  <span className="ml-auto text-xs opacity-50">{category.presets.length}</span>
                </button>
                {selectedCategory === category.id && (
                  <div className="border-t border-[#222]">
                    {category.presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          selectedPreset.id === preset.id
                            ? 'bg-[#00E5CC]/10 text-white border-l-2 border-[#00E5CC]'
                            : 'text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300'
                        }`}
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Customization */}
          <div className="mt-4 bg-[#111] border border-[#222] rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">Personnalisation</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Badge</label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  placeholder={selectedPreset.badge}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Texte principal (HTML)</label>
                <input
                  type="text"
                  value={customMainText}
                  onChange={(e) => setCustomMainText(e.target.value)}
                  placeholder={selectedPreset.mainText.replace(/<[^>]*>/g, '')}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder={selectedPreset.subtitle}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Info Box</label>
                <input
                  type="text"
                  value={customInfoBox}
                  onChange={(e) => setCustomInfoBox(e.target.value)}
                  placeholder={selectedPreset.infoBox}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">YouTube Video ID</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="ex: dQw4w9WgXcQ"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Démarrer à (secondes)</label>
                <input
                  type="number"
                  value={youtubeStart}
                  onChange={(e) => setYoutubeStart(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Info */}
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500">
              Preview 40% • Résolution réelle : 1080×1920
            </p>
          </div>

          {/* Video Preview Container */}
          <div
            className="relative overflow-hidden rounded-none shadow-2xl"
            style={{
              width: 432, // 1080 * 0.4
              height: 768, // 1920 * 0.4
              background: 'black',
              border: '2px solid #00E5CC',
            }}
          >
            {/* YouTube Background */}
            {youtubeEmbedUrl && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 1366 * 0.4,
                  height: 768,
                }}
              >
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}

            {/* Fallback Background */}
            {!youtubeEmbedUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/images/hero-visual.jpg)',
                  opacity: 0.6,
                }}
              />
            )}

            {/* Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.85) 100%)',
              }}
            />

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
              }}
            />

            {/* Content Layer */}
            <div
              className="absolute inset-0 flex flex-col z-10"
              style={{ padding: '100px 35px 120px 35px' }}
            >
              {/* Header */}
              <div
                className={`flex justify-between items-start ${isAnimating ? 'animate-fade-slide-down' : 'opacity-0'}`}
              >
                <div
                  className="font-bold tracking-wider"
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 12 * 0.4 * 2.5,
                    padding: '6px 12px',
                    background: selectedPreset.badgeClass === 'cyan' ? '#00E5CC' : selectedPreset.badgeClass === 'red' ? '#dc2626' : '#E85D04',
                    color: selectedPreset.badgeClass === 'cyan' ? 'black' : 'white',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  {displayBadge}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    style={{ width: 40 * 0.4 * 2.5, height: 'auto' }}
                  />
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22 * 0.4 * 2.5, letterSpacing: 2, color: 'white', lineHeight: 1 }}>
                    BARB&apos;N&apos;<span style={{ color: '#E85D04' }}>ROCK</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                {displayMainText && (
                  <div
                    className={`leading-tight ${isAnimating ? 'animate-zoom-in' : 'opacity-0'}`}
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 60 * 0.4 * 2.5,
                      letterSpacing: 5 * 0.4 * 2.5,
                      color: 'white',
                      textShadow: '0 0 60px rgba(0, 229, 204, 0.6), 0 4px 20px rgba(0,0,0,0.8)',
                    }}
                    dangerouslySetInnerHTML={{ __html: displayMainText }}
                  />
                )}
                {displaySubtitle && (
                  <div
                    className={`${isAnimating ? 'animate-fade-slide-up' : 'opacity-0'}`}
                    style={{
                      fontSize: 14 * 0.4 * 2.5,
                      color: '#00E5CC',
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      marginTop: 12 * 0.4 * 2.5,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      animationDelay: '0.5s',
                    }}
                  >
                    {displaySubtitle}
                  </div>
                )}
                {displayInfoBox && (
                  <div
                    className={`${isAnimating ? 'animate-fade-slide-up' : 'opacity-0'}`}
                    style={{
                      marginTop: 20 * 0.4 * 2.5,
                      padding: '10px 25px',
                      border: '2px solid #00E5CC',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 20 * 0.4 * 2.5,
                      color: '#00E5CC',
                      letterSpacing: 2,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      animationDelay: '0.8s',
                    }}
                  >
                    {displayInfoBox}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className={`flex justify-between items-end ${isAnimating ? 'animate-fade-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '1s' }}
              >
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18 * 0.4 * 2.5, color: 'white', letterSpacing: 1 }}>
                    26 • 27 • 28 JUIN 2026
                  </div>
                  <div style={{ fontSize: 11 * 0.4 * 2.5, color: '#8b9299' }}>
                    Crèvecœur-le-Grand
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 14 * 0.4 * 2.5,
                    padding: '8px 18px',
                    background: '#E85D04',
                    color: 'white',
                    borderRadius: 20,
                    letterSpacing: 2,
                  }}
                >
                  BILLETS DISPO
                </div>
              </div>
            </div>

            {/* Corner accents */}
            <div
              className={`absolute opacity-30 ${isAnimating ? 'animate-corner-tl' : 'opacity-0'}`}
              style={{
                top: 40 * 0.4 * 2.5,
                left: 30 * 0.4 * 2.5,
                width: 50 * 0.4 * 2.5,
                height: 50 * 0.4 * 2.5,
                borderTop: '2px solid #E85D04',
                borderLeft: '2px solid #E85D04',
              }}
            />
            <div
              className={`absolute opacity-30 ${isAnimating ? 'animate-corner-br' : 'opacity-0'}`}
              style={{
                bottom: 40 * 0.4 * 2.5,
                right: 30 * 0.4 * 2.5,
                width: 50 * 0.4 * 2.5,
                height: 50 * 0.4 * 2.5,
                borderBottom: '2px solid #E85D04',
                borderRight: '2px solid #E85D04',
              }}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={replayAnimation}
              className="flex items-center gap-2 px-6 py-3 bg-[#00E5CC] text-black rounded-lg font-medium hover:bg-[#00d4bc] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rejouer animation
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-[#111] border border-[#222] rounded-lg p-4 max-w-md">
            <h3 className="text-sm font-medium text-white mb-2">📱 Export pour TikTok/Reels</h3>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Utilise un outil de screen recording (OBS, ScreenFlow...)</li>
              <li>Enregistre la zone de preview pendant 5-10 secondes</li>
              <li>Ajoute la musique dans ton éditeur vidéo</li>
              <li>Exporte en 1080×1920 pour TikTok/Reels</li>
            </ol>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        .accent {
          color: #00E5CC;
        }
        .orange {
          color: #E85D04;
        }
        
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(1.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes cornerFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
        
        .animate-fade-slide-down {
          animation: fadeSlideDown 0.6s ease forwards;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease forwards;
        }
        
        .animate-zoom-in {
          animation: zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animate-corner-tl {
          animation: cornerFade 0.5s ease forwards;
          animation-delay: 1.5s;
        }
        
        .animate-corner-br {
          animation: cornerFade 0.5s ease forwards;
          animation-delay: 1.7s;
        }
      `}</style>
    </div>
  );
}
