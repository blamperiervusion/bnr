'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { carrouselArtistsData, CarrouselArtistData } from '@/lib/data/carrousel-presets';

// Dimensions Instagram portrait (1080x1350 = ratio 4:5)
const SLIDE_WIDTH = 324;  // Export: 324 * (1080/324) = 1080
const SLIDE_HEIGHT = 405; // Export: 405 * (1080/324) = 1350

export default function CarrouselsPage() {
  const [selectedArtist, setSelectedArtist] = useState<CarrouselArtistData>(carrouselArtistsData[0]);
  const [customName, setCustomName] = useState(selectedArtist.name);
  const [customBio, setCustomBio] = useState(selectedArtist.bio);
  const [exporting, setExporting] = useState<number | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleArtistChange = (artist: CarrouselArtistData) => {
    setSelectedArtist(artist);
    setCustomName(artist.name);
    setCustomBio(artist.bio);
  };

  const exportSlide = useCallback(async (slideIndex: number, artistName: string) => {
    const slide = slidesRef.current[slideIndex];
    if (!slide) return;

    setExporting(slideIndex);

    // Petit délai pour afficher l'overlay visuellement, puis on le cache pour l'export
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // Capturer avec un scale fixe pour obtenir 1080x1350
      const scale = 1080 / SLIDE_WIDTH;
      const canvas = await html2canvas(slide, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0c0f',
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          // Masquer l'overlay d'export dans le clone
          const overlay = clonedElement.querySelector('[data-export-overlay]');
          if (overlay) {
            (overlay as HTMLElement).style.display = 'none';
          }
          // Retirer les bords arrondis et ombres
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.borderRadius = '0';
          // Appliquer les décalages de texte pour l'export
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
      link.download = `barbnrock-carrousel-${artistName.toLowerCase().replace(/\s+/g, '-')}-slide-${slideIndex + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erreur export:', error);
    } finally {
      setExporting(null);
    }
  }, []);

  const exportAllSlides = async () => {
    setExportingAll(true);
    for (let i = 0; i < 5; i++) {
      await exportSlide(i, selectedArtist.name);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setExportingAll(false);
  };

  // Grouper les artistes par jour
  const artistsByDay = {
    vendredi: carrouselArtistsData.filter((a) => a.day === 'vendredi'),
    samedi: carrouselArtistsData.filter((a) => a.day === 'samedi'),
    dimanche: carrouselArtistsData.filter((a) => a.day === 'dimanche'),
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#111' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <Link
          href="/admin/ressources"
          style={{ color: '#00E5CC', textDecoration: 'none', fontSize: '14px' }}
        >
          ← Retour aux ressources
        </Link>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '42px',
            color: 'white',
            marginTop: '15px',
            letterSpacing: '4px',
          }}
        >
          📸 CARROUSELS ARTISTES
        </h1>
        <p style={{ color: '#00E5CC', fontSize: '14px' }}>
          5 slides par artiste • Format Instagram 1080×1350
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Panneau de contrôle */}
        <div
          style={{
            width: '350px',
            minWidth: '350px',
            background: '#1a1a1a',
            padding: '25px',
            borderRadius: '12px',
            height: 'fit-content',
            position: 'sticky',
            top: '20px',
          }}
        >
          {/* Sélection artiste par jour */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '15px' }}>
              🎨 Sélection rapide
            </h3>

            {Object.entries(artistsByDay).map(([day, artists]) => (
              <div key={day} style={{ marginBottom: '15px' }}>
                <p
                  style={{
                    color: day === 'dimanche' ? '#00E5CC' : '#E85D04',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  {day === 'vendredi'
                    ? 'Vendredi 26'
                    : day === 'samedi'
                      ? 'Samedi 27'
                      : 'Dimanche 28'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {artists.map((artist) => (
                    <button
                      key={artist.id}
                      onClick={() => handleArtistChange(artist)}
                      style={{
                        padding: '6px 12px',
                        background: selectedArtist.id === artist.id ? '#E85D04' : '#333',
                        border: '1px solid #444',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {artist.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: '#333', margin: '20px 0' }} />

          {/* Personnalisation */}
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#888',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '5px',
              }}
            >
              Nom de l'artiste
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '6px',
                background: '#222',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                color: '#888',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '5px',
              }}
            >
              Bio (slide 2)
            </label>
            <textarea
              value={customBio}
              onChange={(e) => setCustomBio(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '6px',
                background: '#222',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ height: '1px', background: '#333', margin: '20px 0' }} />

          {/* Export */}
          <button
            onClick={exportAllSlides}
            disabled={exportingAll}
            style={{
              width: '100%',
              padding: '14px',
              background: exportingAll
                ? '#666'
                : 'linear-gradient(135deg, #E85D04, #ff7b2e)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: exportingAll ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {exportingAll ? '⏳ Export en cours...' : '📦 Exporter les 5 slides (PNG)'}
          </button>

          <p style={{ color: '#666', fontSize: '11px', marginTop: '10px', textAlign: 'center' }}>
            Ou cliquer sur chaque slide pour export individuel
          </p>
        </div>

        {/* Preview des slides */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px', paddingBottom: '20px' }}>
            {/* Slide 1 - Accroche */}
            <div
              ref={(el) => { slidesRef.current[0] = el; }}
              onClick={() => exportSlide(0, selectedArtist.name)}
              style={{
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                minWidth: SLIDE_WIDTH,
                background: '#0a0c0f',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#00E5CC',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  zIndex: 100,
                }}
              >
                <span data-export-offset="7">1/5</span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(/images/bands/${selectedArtist.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(10,12,15,0.1) 0%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.9) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  height: '100%',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{selectedArtist.emoji}</div>
                <h1
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '64px',
                    color: '#f0f0f0',
                    letterSpacing: '6px',
                    textShadow: '0 0 40px rgba(0, 229, 204, 0.5)',
                    marginBottom: '15px',
                  }}
                >
                  {customName}
                </h1>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '28px',
                    color: '#00E5CC',
                    letterSpacing: '3px',
                    marginBottom: '40px',
                  }}
                >
                  {selectedArtist.dayDisplay}
                </p>
                <p style={{ color: '#8b9299', fontSize: '16px' }}>
                  Swipe pour découvrir <span style={{ animation: 'swipe 1.5s ease-in-out infinite' }}>→</span>
                </p>
              </div>
              <img
                src="/images/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '40px',
                  opacity: 0.7,
                }}
              />
              {exporting === 0 && (
                <div
                  data-export-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  ⏳ Export...
                </div>
              )}
            </div>

            {/* Slide 2 - Bio */}
            <div
              ref={(el) => { slidesRef.current[1] = el; }}
              onClick={() => exportSlide(1, selectedArtist.name)}
              style={{
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                minWidth: SLIDE_WIDTH,
                background: '#0a0c0f',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#00E5CC',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  zIndex: 100,
                }}
              >
                <span data-export-offset="7">2/5</span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(/images/bands/${selectedArtist.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(10,12,15,0.1) 0%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.9) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  height: '100%',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '36px',
                    color: '#E85D04',
                    letterSpacing: '3px',
                    marginBottom: '20px',
                  }}
                >
                  QUI SONT-ILS ?
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#f0f0f0',
                    lineHeight: 1.6,
                    marginBottom: '25px',
                  }}
                >
                  {customBio}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li
                    style={{
                      color: '#f0f0f0',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    📍 <span style={{ color: '#8b9299' }}>{selectedArtist.city}</span>
                  </li>
                  <li
                    style={{
                      color: '#f0f0f0',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    🎵 <span style={{ color: '#8b9299' }}>{selectedArtist.genre}</span>
                  </li>
                  <li
                    style={{
                      color: '#f0f0f0',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    📅 <span style={{ color: '#8b9299' }}>{selectedArtist.since}</span>
                  </li>
                </ul>
              </div>
              <img
                src="/images/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '40px',
                  opacity: 0.7,
                }}
              />
              {exporting === 1 && (
                <div
                  data-export-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  ⏳ Export...
                </div>
              )}
            </div>

            {/* Slide 3 - À écouter */}
            <div
              ref={(el) => { slidesRef.current[2] = el; }}
              onClick={() => exportSlide(2, selectedArtist.name)}
              style={{
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                minWidth: SLIDE_WIDTH,
                background: '#0a0c0f',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#00E5CC',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  zIndex: 100,
                }}
              >
                <span data-export-offset="7">3/5</span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(/images/bands/${selectedArtist.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(10,12,15,0.1) 0%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.9) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  height: '100%',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '36px',
                    color: '#00E5CC',
                    letterSpacing: '3px',
                    marginBottom: '25px',
                  }}
                >
                  À ÉCOUTER 🎧
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px' }}>
                  {selectedArtist.albums.map((album, i) => (
                    <li
                      key={i}
                      style={{
                        color: '#f0f0f0',
                        fontSize: '15px',
                        marginBottom: '12px',
                        paddingLeft: '25px',
                        position: 'relative',
                      }}
                    >
                      <span style={{ position: 'absolute', left: 0 }}>💿</span>
                      {album}
                    </li>
                  ))}
                </ul>
                <p style={{ color: '#8b9299', fontSize: '13px', marginBottom: '15px' }}>
                  {selectedArtist.ytLink}
                </p>
                <div
                  style={{
                    background: 'rgba(0, 229, 204, 0.1)',
                    borderLeft: '3px solid #00E5CC',
                    padding: '12px 15px',
                    fontSize: '14px',
                    color: '#00E5CC',
                    marginTop: 'auto',
                    lineHeight: 1.2,
                  }}
                >
                  <span data-export-offset="8">{selectedArtist.tip}</span>
                </div>
              </div>
              <img
                src="/images/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '40px',
                  opacity: 0.7,
                }}
              />
              {exporting === 2 && (
                <div
                  data-export-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  ⏳ Export...
                </div>
              )}
            </div>

            {/* Slide 4 - Pourquoi les voir */}
            <div
              ref={(el) => { slidesRef.current[3] = el; }}
              onClick={() => exportSlide(3, selectedArtist.name)}
              style={{
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                minWidth: SLIDE_WIDTH,
                background: '#0a0c0f',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#00E5CC',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  zIndex: 100,
                }}
              >
                <span data-export-offset="7">4/5</span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(/images/bands/${selectedArtist.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(10,12,15,0.1) 0%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.9) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  height: '100%',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '26px',
                    color: '#E85D04',
                    letterSpacing: '2px',
                    marginBottom: '18px',
                  }}
                >
                  POURQUOI LES VOIR ? 🔥
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '15px', flex: 1 }}>
                  {selectedArtist.reasons.map((reason, i) => (
                    <li
                      key={i}
                      style={{
                        color: '#f0f0f0',
                        fontSize: '13px',
                        marginBottom: '10px',
                        paddingLeft: '20px',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '5px',
                          color: '#00E5CC',
                          fontSize: '16px',
                        }}
                      >
                        •
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    fontStyle: 'italic',
                    color: '#00E5CC',
                    fontSize: '13px',
                    padding: '12px',
                    border: '1px solid #00E5CC',
                    borderRadius: '8px',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  <span data-export-offset="6">{selectedArtist.quote}</span>
                </div>
              </div>
              <img
                src="/images/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  width: '35px',
                  opacity: 0.7,
                }}
              />
              {exporting === 3 && (
                <div
                  data-export-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  ⏳ Export...
                </div>
              )}
            </div>

            {/* Slide 5 - CTA */}
            <div
              ref={(el) => { slidesRef.current[4] = el; }}
              onClick={() => exportSlide(4, selectedArtist.name)}
              style={{
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                minWidth: SLIDE_WIDTH,
                background: '#0a0c0f',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#00E5CC',
                  fontSize: '12px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  zIndex: 100,
                }}
              >
                <span data-export-offset="7">5/5</span>
              </span>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(/images/bands/${selectedArtist.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(180deg, rgba(10,12,15,0.1) 0%, rgba(10,12,15,0.5) 60%, rgba(10,12,15,0.9) 100%)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  height: '100%',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '32px',
                    color: '#f0f0f0',
                    letterSpacing: '3px',
                    marginBottom: '20px',
                  }}
                >
                  VIENS LES VOIR 🤘
                </h2>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#00E5CC',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '15px',
                  }}
                >
                  Tarifs Early Bird
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '6px' }}>
                    📍{' '}
                    {selectedArtist.dayDisplay
                      .replace('VENDREDI', 'Vendredi')
                      .replace('SAMEDI', 'Samedi')
                      .replace('DIMANCHE', 'Dimanche')}
                  </p>
                  <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '6px' }}>
                    🎫 Pass jour :{' '}
                    <span style={{ color: '#E85D04', fontWeight: 700 }}>
                      {selectedArtist.dayPrice}
                    </span>
                  </p>
                  <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '6px' }}>
                    🎫 Pass 3 jours : <span style={{ color: '#E85D04', fontWeight: 700 }}>36€</span>
                  </p>
                  <p style={{ color: '#00E5CC', fontSize: '12px' }}>Camping GRATUIT inclus</p>
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#E85D04',
                    color: 'white',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '18px',
                    letterSpacing: '2px',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    marginBottom: '15px',
                    lineHeight: 1,
                    textAlign: 'center',
                  }}
                >
                  <span data-export-offset="9">→ LIEN EN BIO</span>
                </div>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '16px',
                    color: '#00E5CC',
                    letterSpacing: '2px',
                  }}
                >
                  BARB'N'ROCK 2026
                </p>
                <p style={{ fontSize: '12px', color: '#8b9299', marginTop: '3px' }}>
                  Crèvecœur-le-Grand
                </p>
              </div>
              <img
                src="/images/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '40px',
                  opacity: 0.7,
                }}
              />
              {exporting === 4 && (
                <div
                  data-export-overlay
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  ⏳ Export...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;900&display=swap');
        @keyframes swipe {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
