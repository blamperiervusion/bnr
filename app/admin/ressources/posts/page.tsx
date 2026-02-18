'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { postPresets, PostPreset, PresetCategory } from '@/lib/data/post-presets';

type Format = 'square' | 'portrait' | 'story';

// Dimensions de preview (comme les carrousels) - export à scale 1080/previewWidth
const formats: { id: Format; label: string; previewWidth: number; previewHeight: number; exportWidth: number }[] = [
  { id: 'square', label: '1:1 (Feed)', previewWidth: 400, previewHeight: 400, exportWidth: 1080 },
  { id: 'portrait', label: '4:5 (Portrait)', previewWidth: 324, previewHeight: 405, exportWidth: 1080 },
  { id: 'story', label: '9:16 (Story)', previewWidth: 270, previewHeight: 480, exportWidth: 1080 },
];

export default function PostGeneratorPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(postPresets[0].id);
  const [selectedPreset, setSelectedPreset] = useState<PostPreset>(postPresets[0].posts[0]);
  const [format, setFormat] = useState<Format>('square');
  const [isExporting, setIsExporting] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  // Custom overrides
  const [customBadge, setCustomBadge] = useState('');
  const [customMainText, setCustomMainText] = useState('');
  const [customSubText, setCustomSubText] = useState('');
  const [customDescText, setCustomDescText] = useState('');

  const currentCategory = postPresets.find((c) => c.id === selectedCategory);
  const currentFormat = formats.find((f) => f.id === format)!;

  // Dimensions fixes pour preview (comme les carrousels)
  const previewWidth = currentFormat.previewWidth;
  const previewHeight = currentFormat.previewHeight;
  
  // Facteur d'échelle pour adapter les polices selon le format (base = 400px)
  const fontScale = previewWidth / 400;

  const handlePresetSelect = (preset: PostPreset) => {
    setSelectedPreset(preset);
    setCustomBadge('');
    setCustomMainText('');
    setCustomSubText('');
    setCustomDescText('');
  };

  const exportPNG = async () => {
    if (!postRef.current) return;
    setIsExporting(true);

    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Scale pour obtenir la résolution finale (comme les carrousels)
      const scale = currentFormat.exportWidth / currentFormat.previewWidth;
      const canvas = await html2canvas(postRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0c0f',
        onclone: (clonedDoc, clonedElement) => {
          // Retirer les bords arrondis et ombres
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0';
          // Appliquer les décalages de texte pour l'export (fix Bebas Neue)
          const offsetElements = clonedElement.querySelectorAll('[data-export-offset]');
          offsetElements.forEach((el) => {
            const offset = (el as HTMLElement).dataset.exportOffset;
            if (offset) {
              (el as HTMLElement).style.position = 'relative';
              (el as HTMLElement).style.top = `-${offset}px`;
            }
          });
        },
      });

      const link = document.createElement('a');
      link.download = `${selectedPreset.id}-${format}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export. Vérifiez la console.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(selectedPreset.caption);
    alert('Caption copiée !');
  };

  // Get display values (custom or preset)
  const displayBadge = customBadge || selectedPreset.badge;
  const displayMainText = customMainText || selectedPreset.mainText;
  const displaySubText = customSubText || selectedPreset.subText;
  const displayDescText = customDescText || selectedPreset.descText;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/ressources" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux ressources
          </Link>
          <h1 className="text-2xl font-bold text-white">Générateur de Posts</h1>
        </div>
        <div className="flex gap-2">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                format === f.id
                  ? 'bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]'
                  : 'bg-[#222] text-gray-400 border border-[#333] hover:bg-[#333]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Categories & Presets */}
        <div className="w-72 shrink-0">
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            {postPresets.map((category) => (
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
                  <span className="ml-auto text-xs opacity-50">{category.posts.length}</span>
                </button>
                {selectedCategory === category.id && (
                  <div className="border-t border-[#222]">
                    {category.posts.map((preset) => (
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
                <label className="block text-xs text-gray-500 mb-1">Texte principal</label>
                <input
                  type="text"
                  value={customMainText}
                  onChange={(e) => setCustomMainText(e.target.value)}
                  placeholder={selectedPreset.mainText.replace(/<[^>]*>/g, '')}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sous-texte</label>
                <input
                  type="text"
                  value={customSubText}
                  onChange={(e) => setCustomSubText(e.target.value)}
                  placeholder={selectedPreset.subText}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={customDescText}
                  onChange={(e) => setCustomDescText(e.target.value)}
                  placeholder={selectedPreset.descText}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Post Preview */}
          <div
            ref={postRef}
            className="relative overflow-hidden rounded-lg shadow-2xl"
            style={{
              width: previewWidth,
              height: previewHeight,
              background: '#0a0c0f',
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage: `url(${selectedPreset.bg})`,
                filter: 'grayscale(10%)',
              }}
            />
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 12, 15, 0.1) 0%, rgba(10, 12, 15, 0.4) 50%, rgba(10, 12, 15, 0.9) 100%)',
              }}
            />
            {/* Corner accents */}
            <div
              className="absolute opacity-30"
              style={{
                top: 15 * fontScale,
                left: 15 * fontScale,
                width: 50 * fontScale,
                height: 50 * fontScale,
                borderTop: '2px solid #E85D04',
                borderLeft: '2px solid #E85D04',
              }}
            />
            <div
              className="absolute opacity-30"
              style={{
                bottom: 15 * fontScale,
                right: 15 * fontScale,
                width: 50 * fontScale,
                height: 50 * fontScale,
                borderBottom: '2px solid #E85D04',
                borderRight: '2px solid #E85D04',
              }}
            />
            {/* Content */}
            <div
              className="relative z-10 h-full flex flex-col"
              style={{ padding: 25 * fontScale }}
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div
                  className="font-bold tracking-wider"
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 14 * fontScale,
                    letterSpacing: 2 * fontScale,
                    padding: `${8 * fontScale}px ${15 * fontScale}px`,
                    background: selectedPreset.badgeClass === 'cyan' ? '#00E5CC' : selectedPreset.badgeClass === 'gold' ? '#FFD700' : '#E85D04',
                    color: selectedPreset.badgeClass === 'cyan' || selectedPreset.badgeClass === 'gold' ? 'black' : 'white',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  <span data-export-offset="6">{displayBadge}</span>
                </div>
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  style={{ width: 50 * fontScale, height: 'auto' }}
                />
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div
                  className="leading-tight"
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: (selectedPreset.mainClass === 'price' ? 80 : selectedPreset.mainClass === 'countdown' ? 120 : 48) * fontScale,
                    letterSpacing: 4 * fontScale,
                    lineHeight: 1.1,
                    color: selectedPreset.mainClass === 'price' ? '#E85D04' : selectedPreset.mainClass === 'countdown' ? '#00E5CC' : '#f0f0f0',
                    textShadow: selectedPreset.mainClass === 'price'
                      ? '0 0 40px rgba(232, 93, 4, 0.5)'
                      : selectedPreset.mainClass === 'countdown'
                      ? '0 0 60px rgba(0, 229, 204, 0.6)'
                      : '0 0 30px rgba(0, 229, 204, 0.4)',
                  }}
                >
                  <span data-export-offset="12" dangerouslySetInnerHTML={{ __html: displayMainText }} />
                </div>
                {displaySubText && (
                  <div
                    className="text-white"
                    style={{
                      fontSize: 14 * fontScale,
                      marginTop: 5 * fontScale,
                    }}
                  >
                    {displaySubText}
                  </div>
                )}
                {displayDescText && (
                  <div
                    style={{
                      fontSize: 14 * fontScale,
                      marginTop: 15 * fontScale,
                      color: '#8b9299',
                      lineHeight: 1.5,
                    }}
                  >
                    {displayDescText}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div>
                  <div
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 16 * fontScale,
                      color: '#f0f0f0',
                      letterSpacing: 1,
                    }}
                  >
                    <span data-export-offset="6">26 • 27 • 28 JUIN 2026</span>
                  </div>
                  <div
                    style={{
                      fontSize: 11 * fontScale,
                      color: '#8b9299',
                    }}
                  >
                    Crèvecœur-le-Grand
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 18 * fontScale,
                    padding: `${12 * fontScale}px ${25 * fontScale}px`,
                    background: '#E85D04',
                    color: 'white',
                    borderRadius: 30 * fontScale,
                    letterSpacing: 2 * fontScale,
                  }}
                >
                  <span data-export-offset="8">BILLETS DISPO</span>
                </div>
              </div>
            </div>

            {/* CSS accent class for dangerouslySetInnerHTML */}
            <style jsx global>{`
              .accent {
                color: #00E5CC;
              }
              .accent-orange {
                color: #E85D04;
              }
            `}</style>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={exportPNG}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-[#E85D04] text-white rounded-lg font-medium hover:bg-[#ff6b1a] transition-colors disabled:opacity-50"
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
                  Exporter PNG
                </>
              )}
            </button>
            <button
              onClick={copyCaption}
              className="flex items-center gap-2 px-6 py-3 bg-[#222] text-white rounded-lg font-medium hover:bg-[#333] transition-colors border border-[#333]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copier Caption
            </button>
          </div>

          {/* Caption Preview */}
          <div className="mt-6 w-full max-w-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Caption suggérée</h3>
            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                {selectedPreset.caption}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
