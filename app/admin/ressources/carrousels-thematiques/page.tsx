'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

// Dimensions Instagram portrait (1080x1350 = ratio 4:5)
const SLIDE_WIDTH = 324;  // Export: 324 * (1080/324) = 1080
const SLIDE_HEIGHT = 405; // Export: 405 * (1080/324) = 1350

type CarrouselType = 'village' | 'animations' | 'acces' | 'bestof';

interface SlideContent {
  number: string;
  title?: string;
  titleColor?: string;
  emoji?: string;
  content: React.ReactNode;
  centered?: boolean;
}

export default function CarrouselsThematiquesPage() {
  const [activeCarrousel, setActiveCarrousel] = useState<CarrouselType>('village');
  const [exporting, setExporting] = useState<number | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const exportSlide = useCallback(async (slideIndex: number, carrouselName: string) => {
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
      link.download = `barbnrock-carrousel-${carrouselName}-slide-${slideIndex + 1}.png`;
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
    const slides = carrouselData[activeCarrousel];
    for (let i = 0; i < slides.length; i++) {
      await exportSlide(i, activeCarrousel);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setExportingAll(false);
  };

  // Données des carrousels
  const carrouselData: Record<CarrouselType, SlideContent[]> = {
    village: [
      {
        number: '1/5',
        emoji: '🍺',
        content: (
          <>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>🍺</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                color: '#E85D04',
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              LE VILLAGE
              <br />
              DU CHAOS
            </div>
            <p style={{ fontSize: '14px', color: '#f0f0f0', textAlign: 'center', marginTop: '15px' }}>
              Entre deux concerts,
              <br />
              y'a de quoi faire.
            </p>
            <p style={{ color: '#8b9299', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              → Swipe pour découvrir
            </p>
          </>
        ),
        centered: true,
      },
      {
        number: '2/5',
        title: 'FOOD TRUCKS 🍔',
        titleColor: '#E85D04',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '15px' }}>
              On a pensé à ton estomac.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🍔 Burgers', '🍕 Pizza artisanale', '🌱 Options vegan', '🍟 Frites maison', '🌮 Tacos'].map(
                (item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '13px',
                      color: '#f0f0f0',
                    }}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              Prix accessibles • Produits locaux privilégiés
            </div>
          </>
        ),
      },
      {
        number: '3/5',
        title: 'BAR & CRAFT BEER 🍺',
        titleColor: '#00E5CC',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '15px' }}>Bières belges.</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🍺 Bières craft locales', '🍷 Vin', '🥤 Softs & jus', '☕ Café'].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              Paiement cashless • Recharge sur place
            </div>
          </>
        ),
      },
      {
        number: '4/5',
        title: 'STANDS & EXPOS ⚒️',
        titleColor: '#FFD700',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0', marginBottom: '15px' }}>
              Le paradis des metalleux.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                '📀 Vinyles & CDs',
                '👕 Merch groupes',
                '🖋️ Tattoo & piercing',
                '⚒️ Artisanat metal',
                '🎨 Expo photo',
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </>
        ),
      },
      {
        number: '5/5',
        content: (
          <>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                color: '#E85D04',
                letterSpacing: '2px',
                marginBottom: '20px',
              }}
            >
              TOUT ÇA
              <br />
              <span style={{ color: '#00E5CC' }}>INCLUS</span>
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '64px',
                color: '#00E5CC',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              36€
            </div>
            <div style={{ fontSize: '14px', color: '#8b9299', textAlign: 'center' }}>
              Pass 3 jours • Camping gratuit
            </div>
            <div
              style={{
                display: 'inline-block',
                background: '#E85D04',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '16px',
                letterSpacing: '2px',
                padding: '12px 25px',
                borderRadius: '30px',
                marginTop: '30px',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              <span data-export-offset="9">→ LIEN EN BIO</span>
            </div>
            <div
              style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '11px',
                color: '#8b9299',
              }}
            >
              26-28 Juin 2026 • Crèvecœur-le-Grand
            </div>
          </>
        ),
        centered: true,
      },
    ],
    animations: [
      {
        number: '1/5',
        content: (
          <>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>🎸</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '32px',
                color: '#E85D04',
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              PAS QUE
              <br />
              DES CONCERTS
            </div>
            <p style={{ fontSize: '14px', color: '#f0f0f0', textAlign: 'center', marginTop: '15px' }}>
              Le Barb'n'Rock, c'est aussi
              <br />
              des animations déjantées.
            </p>
            <p style={{ color: '#8b9299', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              → Swipe
            </p>
          </>
        ),
        centered: true,
      },
      {
        number: '2/5',
        title: 'BARBE CONTEST 🧔',
        titleColor: '#E85D04',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0' }}>
              <strong>Dimanche 14h</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#f0f0f0', margin: '15px 0' }}>
              Montre ta plus belle barbe.
              <br />
              Jury impitoyable.
              <br />
              Lots à gagner.
            </p>
            <p style={{ color: '#00E5CC', fontWeight: 600, marginBottom: '10px' }}>Catégories :</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🥇 Plus longue', '🥈 Plus originale', '🥉 Plus soignée'].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </>
        ),
      },
      {
        number: '3/5',
        title: 'AIR GUITAR 🎸',
        titleColor: '#00E5CC',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0' }}>
              <strong>Samedi 20h</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#f0f0f0', margin: '15px 0' }}>
              Lâche-toi comme si t'avais une vraie gratte.
            </p>
            <p style={{ color: '#00E5CC', fontWeight: 600, marginBottom: '10px' }}>Critères :</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['⚡ Technique', '🔥 Énergie', '🎭 Show'].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              Inscription sur place • Gratuit
            </div>
          </>
        ),
      },
      {
        number: '4/5',
        title: 'ET AUSSI... 🎵',
        titleColor: '#FFD700',
        content: (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { icon: '🎵', text: 'Blind Test Metal', time: 'Samedi 17h' },
                { icon: '💀', text: 'Wall of Death Workshop', time: 'Samedi 15h' },
                { icon: '🎰', text: 'Tombola', time: 'Lots exclusifs' },
                { icon: '📸', text: 'Photobooth', time: 'Déguisements fournis' },
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  {item.icon}{' '}
                  <span>
                    <strong>{item.text}</strong> - {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ),
      },
      {
        number: '5/5',
        content: (
          <>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                color: '#E85D04',
                letterSpacing: '2px',
              }}
            >
              T'ATTENDS QUOI ?
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '64px',
                color: '#00E5CC',
                textAlign: 'center',
                lineHeight: 1,
                marginTop: '20px',
              }}
            >
              36€
            </div>
            <div style={{ fontSize: '14px', color: '#8b9299', textAlign: 'center' }}>
              Pass 3 jours • Camping gratuit
            </div>
            <div
              style={{
                display: 'inline-block',
                background: '#E85D04',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '16px',
                letterSpacing: '2px',
                padding: '12px 25px',
                borderRadius: '30px',
                marginTop: '30px',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              <span data-export-offset="9">→ LIEN EN BIO</span>
            </div>
            <div
              style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '11px',
                color: '#8b9299',
              }}
            >
              26-28 Juin 2026 • Crèvecœur-le-Grand
            </div>
          </>
        ),
        centered: true,
      },
    ],
    acces: [
      {
        number: '1/5',
        content: (
          <>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>📍</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '32px',
                color: '#E85D04',
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              COMMENT
              <br />
              VENIR ?
            </div>
            <p style={{ fontSize: '14px', color: '#f0f0f0', textAlign: 'center', marginTop: '15px' }}>
              Crèvecœur-le-Grand
              <br />
              Oise (60)
            </p>
            <p style={{ color: '#8b9299', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              → Swipe pour les infos
            </p>
          </>
        ),
        centered: true,
      },
      {
        number: '2/5',
        title: 'EN VOITURE 🚗',
        titleColor: '#E85D04',
        content: (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { label: 'Depuis Paris :', value: '1h15' },
                { label: 'Depuis Beauvais :', value: '30 min' },
                { label: 'Depuis Amiens :', value: '45 min' },
                { label: 'Depuis Lille :', value: '1h30' },
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  📍 <strong>{item.label}</strong> {item.value}
                </li>
              ))}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              🅿️ Parking GRATUIT sur site
              <br />
              GPS : Crèvecœur-le-Grand, 60360
            </div>
          </>
        ),
      },
      {
        number: '3/5',
        title: 'EN TRAIN 🚆',
        titleColor: '#00E5CC',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0' }}>
              <strong>Gare de Beauvais</strong> (30km)
            </p>
            <p style={{ fontSize: '14px', color: '#f0f0f0', margin: '15px 0' }}>
              Depuis Paris Nord : ~1h15
            </p>
            <p style={{ color: '#00E5CC', fontWeight: 600, marginBottom: '10px' }}>
              Navettes prévues :
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🚌 Vendredi 16h', '🚌 Samedi 12h', '🚌 Retour dimanche 20h'].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px',
                    color: '#f0f0f0',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              Infos navettes : voir site web
            </div>
          </>
        ),
      },
      {
        number: '4/5',
        title: 'COVOITURAGE 🚙',
        titleColor: '#FFD700',
        content: (
          <>
            <p style={{ fontSize: '14px', color: '#f0f0f0' }}>
              <strong>Groupe Facebook</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#f0f0f0', margin: '15px 0' }}>
              Rejoins le groupe "Covoit Barb'n'Rock 2026" pour :
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🤝 Proposer des places', '🔍 Chercher un trajet', '💰 Partager les frais'].map(
                (item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '13px',
                      color: '#f0f0f0',
                    }}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
            <div
              style={{
                background: 'rgba(0, 229, 204, 0.1)',
                borderLeft: '3px solid #00E5CC',
                padding: '12px',
                marginTop: '15px',
                fontSize: '12px',
                color: '#00E5CC',
              }}
            >
              Économique • Écologique • Convivial
            </div>
          </>
        ),
      },
      {
        number: '5/5',
        title: 'CAMPING 🏕️',
        titleColor: '#E85D04',
        content: (
          <>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '48px',
                color: '#00E5CC',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              GRATUIT
            </div>
            <div style={{ fontSize: '14px', color: '#8b9299', textAlign: 'center', marginBottom: '20px' }}>
              Inclus avec ton pass
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['🚿 Douches', '🚽 Sanitaires', '💧 Points d\'eau', '🔌 Recharge téléphone'].map(
                (item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '13px',
                      color: '#f0f0f0',
                    }}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#E85D04',
                  color: 'white',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '16px',
                  letterSpacing: '2px',
                  padding: '12px 25px',
                  borderRadius: '30px',
                  lineHeight: 1,
                  textAlign: 'center',
                }}
              >
                <span data-export-offset="9">→ LIEN EN BIO</span>
              </div>
            </div>
          </>
        ),
      },
    ],
    bestof: [
      {
        number: '1/5',
        content: (
          <>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>📷</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                color: '#E85D04',
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              BEST-OF
              <br />
              <span style={{ color: '#00E5CC' }}>2026</span>
            </div>
            <p style={{ fontSize: '14px', color: '#f0f0f0', textAlign: 'center', marginTop: '15px' }}>
              3 jours de chaos.
              <br />
              En images.
            </p>
            <p style={{ color: '#8b9299', marginTop: '20px', fontSize: '13px', textAlign: 'center' }}>
              → Swipe
            </p>
          </>
        ),
        centered: true,
      },
      {
        number: '2/5',
        title: 'VENDREDI 🔥',
        titleColor: '#E85D04',
        content: (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: '#8b9299' }}>[Photo à insérer]</p>
          </div>
        ),
      },
      {
        number: '3/5',
        title: 'SAMEDI 🔥',
        titleColor: '#00E5CC',
        content: (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: '#8b9299' }}>[Photo à insérer]</p>
          </div>
        ),
      },
      {
        number: '4/5',
        title: 'DIMANCHE 🔥',
        titleColor: '#FFD700',
        content: (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: '#8b9299' }}>[Photo à insérer]</p>
          </div>
        ),
      },
      {
        number: '5/5',
        content: (
          <>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '48px',
                color: '#E85D04',
                letterSpacing: '2px',
              }}
            >
              MERCI 🖤
            </div>
            <p style={{ fontSize: '14px', color: '#f0f0f0', textAlign: 'center', marginTop: '20px' }}>
              [X] festivaliers
              <br />
              18 groupes
              <br />3 jours inoubliables
            </p>
            <div
              style={{
                marginTop: '30px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '24px',
                color: '#00E5CC',
                letterSpacing: '3px',
              }}
            >
              ON SE RETROUVE EN 2027 ?
            </div>
          </>
        ),
        centered: true,
      },
    ],
  };

  const navItems: { id: CarrouselType; label: string; emoji: string }[] = [
    { id: 'village', label: 'Village', emoji: '🍺' },
    { id: 'animations', label: 'Animations', emoji: '🎸' },
    { id: 'acces', label: 'Comment venir', emoji: '🚗' },
    { id: 'bestof', label: 'Best-of', emoji: '📷' },
  ];

  const currentSlides = carrouselData[activeCarrousel];

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
          📸 CARROUSELS THÉMATIQUES
        </h1>
        <p style={{ color: '#00E5CC', fontSize: '14px' }}>Format Instagram 1080×1350 (portrait)</p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCarrousel(item.id)}
            style={{
              padding: '12px 25px',
              background: activeCarrousel === item.id ? '#00E5CC' : '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '30px',
              color: activeCarrousel === item.id ? 'black' : '#ccc',
              fontSize: '14px',
              fontWeight: activeCarrousel === item.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {/* Export button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={exportAllSlides}
          disabled={exportingAll}
          style={{
            padding: '14px 30px',
            background: exportingAll ? '#666' : 'linear-gradient(135deg, #E85D04, #ff7b2e)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: exportingAll ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {exportingAll ? '⏳ Export en cours...' : '📦 Exporter tout le carrousel'}
        </button>
      </div>

      {/* Slides */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '20px 0',
          justifyContent: 'center',
        }}
      >
        {currentSlides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => { slidesRef.current[index] = el; }}
            onClick={() => exportSlide(index, activeCarrousel)}
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
                lineHeight: '12px',
                height: '22px',
                boxSizing: 'border-box',
              }}
            >
              <span data-export-offset="7">{slide.number}</span>
            </span>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/images/hero-visual.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5,
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
                  'linear-gradient(180deg, rgba(10,12,15,0.2) 0%, rgba(10,12,15,0.6) 50%, rgba(10,12,15,0.95) 100%)',
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
                ...(slide.centered
                  ? { justifyContent: 'center', alignItems: 'center', textAlign: 'center' }
                  : {}),
              }}
            >
              {!slide.centered && (
                <img
                  src="/images/logo.png"
                  alt=""
                  style={{ width: '40px', marginBottom: '15px' }}
                />
              )}
              {slide.title && (
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '28px',
                    color: slide.titleColor || '#E85D04',
                    letterSpacing: '2px',
                    marginBottom: '15px',
                  }}
                >
                  {slide.title}
                </div>
              )}
              {slide.content}
            </div>
            {exporting === index && (
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
                  zIndex: 200,
                }}
              >
                ⏳ Export...
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;900&display=swap');
      `}</style>
    </div>
  );
}
