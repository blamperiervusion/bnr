'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

// ── Types ──────────────────────────────────────────────────────────────────
type Band = {
  name: string; time: string | null; imageUrl: string; isHeadliner: boolean;
  genre: string; origin: string; description: string; day: string;
  videoUrl?: string; spotify?: string;
};
type Partner = { company: string; tier: string; logo: string };
type Stand   = { name: string; category: string; logo: string; description: string };

// ── Data ───────────────────────────────────────────────────────────────────
const bandsVendredi: Band[] = [
  { day:'vendredi', name:'Cachemire',     time:'22h30', imageUrl:'/images/bands/cachemire.jpg',    isHeadliner:true,  genre:'Rock français',          origin:'Nantes',          description:'Depuis 10 ans, Cachemire secoue la scène avec un son puissant, des guitares corrosives et des textes en français qui vont droit au cœur.',                  videoUrl:'https://www.youtube.com/watch?v=PjQw3HI2LJo' },
  { day:'vendredi', name:'Psykup',        time:'20h00', imageUrl:'/images/bands/psykup.jpg',        isHeadliner:true,  genre:'AutrucheCore',           origin:'Toulouse',        description:'Figure mythique du paysage alternatif — 30 ans d\'existence, 5 albums, un EP acoustique et des milliers de concerts.',                                       videoUrl:'https://www.youtube.com/watch?v=Kd5-RQaMp2g', spotify:'https://open.spotify.com/artist/2Z1p4Xmc2Mne50blMUd4cH' },
  { day:'vendredi', name:'Barabbas',      time:'21h30', imageUrl:'/images/bands/barabbas.jpg',      isHeadliner:false, genre:'Doom metal en français', origin:'Paris / IDF',     description:'Apôtre d\'un doom chanté en français, Barabbas prodigue réconfort moral, paix de l\'esprit et acouphènes irréversibles.' },
  { day:'vendredi', name:'Black Hazard',  time:'19h00', imageUrl:'/images/bands/black-hazard.jpg',  isHeadliner:false, genre:'Heavy stoner rock',      origin:'Cambrésis (HdF)', description:'Heavy rock stoner originaire du Cambrésis.',                                                                                                                  videoUrl:'https://www.youtube.com/watch?v=52OamIrdesU' },
  { day:'vendredi', name:'Kami No Ikari', time:'00h10', imageUrl:'/images/bands/kami-no-ikari.jpg', isHeadliner:false, genre:'Deathcore mélodique',    origin:'Paris',           description:'Groupe de deathcore mélodique fondé en 2020. L\'univers de «La colère des dieux» aux influences japonisantes.',                                            videoUrl:'https://www.youtube.com/watch?v=lNGYQ8-bDN8', spotify:'https://open.spotify.com/artist/50w6So1pU1erYm1J3cGxXY' },
];
const bandsSamedi: Band[] = [
  { day:'samedi', name:'Shaârghot',   time:'23h00', imageUrl:'/images/bands/shaarghot.jpg',  isHeadliner:true,  genre:'Cyber / Indus-electro metal',  origin:'Paris',            description:'Venu d\'une dimension parallèle cyber-punk. Révélation de la scène indus-electro, a tourné avec Little Big, Ministry, Hocico.',                     videoUrl:'https://www.youtube.com/watch?v=yn4X-OtYOx0', spotify:'https://open.spotify.com/artist/0wxpqCSmhtwnRXoWPoHAcj' },
  { day:'samedi', name:'Loudblast',   time:'21h35', imageUrl:'/images/bands/loudblast.jpg',  isHeadliner:true,  genre:'Death / Thrash metal',          origin:'Lille',            description:'Pionnier du Death Metal en France depuis 1985 — 41 ans de carrière, plus féroce que jamais.',                                                       videoUrl:'https://www.youtube.com/watch?v=uc6khaqWNV4', spotify:'https://open.spotify.com/artist/1xK59OXxi2TReP0IGvm0K5' },
  { day:'samedi', name:'Krav Boca',   time:'20h25', imageUrl:'/images/bands/krav-boca.jpg',  isHeadliner:true,  genre:'Punk rap + mandoline + pyro',   origin:'France',           description:'500 concerts, tournées à l\'étranger. Rituel punk avec performances pyrotechniques. « Vivre libre ou mourir ! »',                                    videoUrl:'https://www.youtube.com/watch?v=7iTo2zjZJmo', spotify:'https://open.spotify.com/artist/4xFUf1FHVy696Q1JQZMTRj' },
  { day:'samedi', name:'Breakout',    time:'19h15', imageUrl:'/images/bands/breakout.jpg',   isHeadliner:false, genre:'Punk rock',                     origin:'Paris',            description:'Punk rapide et agressif, mélodie et chœurs. Reconnu à l\'international.',                                                                              videoUrl:'https://www.youtube.com/watch?v=0iPry24IYuE' },
  { day:'samedi', name:'Akiavel',     time:'18h05', imageUrl:'/images/bands/akiavel.jpg',    isHeadliner:false, genre:'Death metal mélodique',         origin:'Sud-Est',          description:'Death metal mélodique/brutal. Une chanteuse dont la voix et la présence scénique marquent les esprits.',                                              videoUrl:'https://www.youtube.com/watch?v=oKW9Tt7ZGCg', spotify:'https://open.spotify.com/artist/14M2CyExjuwWrJlJGYvg6T' },
  { day:'samedi', name:'Dirty Fonzy', time:'16h55', imageUrl:'/images/bands/dirty-fonzy.jpg',isHeadliner:false, genre:'Punk rock mélodique',           origin:'Albi',             description:'Pilier du punk rock français. Dernier album «Full Speed Ahead».',                                                                                      videoUrl:'https://www.youtube.com/watch?v=75ji6wfbVZw' },
  { day:'samedi', name:'Ogarya',      time:'16h00', imageUrl:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/bands/1775504505394.jpeg', isHeadliner:false, genre:'Death metal technique', origin:'Oise (HdF)', description:'Death metal technique originaire de l\'Oise, fondé en 2016.',                                                                         videoUrl:'https://www.youtube.com/watch?v=mlqM5Xz50cI' },
  { day:'samedi', name:'MRWL',        time:'15h05', imageUrl:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/bands/1775504274703.webp', isHeadliner:false, genre:'Rock alternatif',       origin:'Hauts-de-France', description:'Gagnant du tremplin Barb\'n\'Rock 2026. Né en mai 2024, officiellement sorti de l\'ombre un an plus tard.',                           videoUrl:'https://www.youtube.com/watch?v=LJq87CjqjMo' },
];
const bandsDimanche: Band[] = [
  { day:'dimanche', name:'Mainkind',           time:null, imageUrl:'/images/bands/mainkind.jpg',        isHeadliner:true,  genre:'Hard rock 70s/80s',         origin:'—',      description:'Influences Poison, Guns N\'Roses, Mötley Crüe, Alice Cooper. Mission : créer du bon vieux rock.',                                                     videoUrl:'https://www.youtube.com/watch?v=taKbs0ufooE' },
  { day:'dimanche', name:'Saint Rock Station', time:null, imageUrl:'/images/bands/saint-rock-station.jpeg', isHeadliner:false, genre:'Rock covers 70s–2000',  origin:'Amiens', description:'Deux guitaristes, batteur, bassiste et chanteuse. Classiques du rock et hard rock des années 70 à 2000.' },
  { day:'dimanche', name:'Devon Duxe',         time:null, imageUrl:'/images/bands/devon-duxe.jpeg',     isHeadliner:false, genre:'Rock moderne',               origin:'—',      description:'Succès auprès des radios US underground. 3e album en 2026. « Rock aux vibes modernes et à l\'énergie brute. »' },
  { day:'dimanche', name:'Howlite',            time:null, imageUrl:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/bands/1779123892049.jpg',  isHeadliner:false, genre:'Rock alternatif atm.',   origin:'—', description:'Univers sonore planant et intense, rock alternatif atmosphérique.' },
  { day:'dimanche', name:'Udap',               time:null, imageUrl:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/bands/1778613153775.jpg',  isHeadliner:false, genre:'Rock / Pop covers',      origin:'—', description:'Énergie communicative, set dynamique. Habitué des formats multi-plateaux.' },
  { day:'dimanche', name:'ADORE',              time:null, imageUrl:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/bands/1775504756584.webp', isHeadliner:false, genre:'Electro-rock / Alt-rock', origin:'—', description:'Gagnant tremplin. Electro-rock franco-japonais. Tournée de 11 dates au Japon en février 2026.',                                              videoUrl:'https://www.youtube.com/watch?v=tuW4GjFBRpA' },
];

const partners: Partner[] = [
  { company:'Leclerc Crèvecoeur-le-Grand', tier:'chaos',         logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1775375110269.png' },
  { company:'Eurodem',                      tier:'chaos',         logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779303347855.png' },
  { company:'Veolia',                       tier:'headbanger',    logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1775505677973.png' },
  { company:'Nouvelle R – Architecture',    tier:'moshpit',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779133303405.png' },
  { company:'Delmotte Trans Auto',          tier:'moshpit',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1780517658461.jpg' },
  { company:"BO'WC",                        tier:'moshpit',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1780517818193.png' },
  { company:'Salti',                        tier:'moshpit',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779274845906.png' },
  { company:'Crédit Agricole',             tier:'moshpit',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1781189528617.png' },
  { company:'O2 Crèvecoeur',               tier:'supporter',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779275124574.jpeg' },
  { company:'Metio',                        tier:'supporter',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779275040587.png' },
  { company:'Fleur Bleue',                  tier:'supporter',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1775505744572.jpeg' },
  { company:'Happyness Radio',              tier:'media',         logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779274663132.jpeg' },
  { company:'Evasion',                      tier:'media',         logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1779274770372.png' },
  { company:'Agglomération du Beauvaisis',  tier:'institutional', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1778327443752.png' },
  { company:"Département de l'Oise",        tier:'institutional', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1778327721347.png' },
  { company:'Région Hauts-de-France',       tier:'institutional', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1778328085319.jpeg' },
  { company:'SACEM',                        tier:'institutional', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1778328366367.png' },
  { company:'Crèvecoeur-le-Grand',          tier:'institutional', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1778327344381.jpeg' },
  { company:'Juke Bar',                     tier:'technical',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1781189704505.jpg' },
  { company:'Unitech Events',               tier:'technical',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/partners/1781189789565.png' },
];

const stands: Stand[] = [
  { name:'Beer to Burger',         category:'FOOD',          logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776282486917.png',  description:'Burgers & bières' },
  { name:'Fuu Fuu',                category:'FOOD',          logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1778095929716.jpg',  description:'Cuisine japonaise maison' },
  { name:'O van Resto',            category:'FOOD',          logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776281997089.png',  description:'Restauration' },
  { name:'José Martinez',          category:'TATTOO',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776281839289.png',  description:'Tatoueur' },
  { name:"Moog's Ink Tattoo",      category:'TATTOO',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777491842803.jpg',  description:'Tatoueur' },
  { name:'MJA Tattoo',             category:'TATTOO',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776282719769.jpeg', description:'Tatoueur' },
  { name:'Ink Dreamer',            category:'TATTOO',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776282672533.jpeg', description:'Tatoueur' },
  { name:'V du Barbier',           category:'BARBIER',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490197439.jpg',  description:'Barbier' },
  { name:'Nine Hair Beard',        category:'BARBIER',       logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490122089.jpg',  description:'Coiffeuse & Barbière' },
  { name:'Oxmoz Bijoux',           category:'ARTISANAT',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490817488.jpg',  description:'Bijoux Cyberpunk / Steampunk' },
  { name:'Jagers Walks',           category:'ARTISANAT',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490980512.jpg',  description:'Bijoux scandinaves / vikings' },
  { name:'Agnès Delvaux Création', category:'ARTISANAT',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777489897034.jpg',  description:'Artisanat' },
  { name:'Artii Steeve',           category:'ARTISANAT',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777489997308.jpg',  description:'Gravure laser sur bois' },
  { name:'Light Be Recycling',     category:'ARTISANAT',     logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777491543891.jpg',  description:'Instruments recyclés' },
  { name:"J't'aime pas Clothing",  category:'MERCHANDISING', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777489602869.jpg',  description:'Mode alternative' },
  { name:'Créa by Mag',            category:'MERCHANDISING', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777489353880.png',  description:'Créations zéro déchet' },
  { name:"Rockin'Oktopus",         category:'MERCHANDISING', logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777489677032.jpg',  description:'Mode alternative famille' },
  { name:'Pierre de Lune',         category:'DIVERS',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490432320.jpg',  description:'Lithothérapie & Reiki' },
  { name:"Sev'ekilibre",           category:'DIVERS',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490316405.jpg',  description:'Massages & relaxation' },
  { name:'Mystikdreams',           category:'DIVERS',        logo:'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777490684279.jpg',  description:'Numérologie & cartomancie' },
];

const TIER_ORDER  = ['chaos','headbanger','moshpit','supporter','media','institutional','technical'];
const TIER_LABELS: Record<string,string> = {
  chaos:'Mécènes CHAOS', headbanger:'Partenaires HEADBANGER', moshpit:'Partenaires MOSH PIT',
  supporter:'Supporters', media:'Partenaires Médias', institutional:'Partenaires Institutionnels',
  technical:'Partenaires Techniques',
};
const CAT_ORDER  = ['FOOD','TATTOO','BARBIER','ARTISANAT','MERCHANDISING','DIVERS'];
const CAT_LABELS: Record<string,string> = {
  FOOD:'Food trucks', TATTOO:'Tatoueurs', BARBIER:'Barbiers',
  ARTISANAT:'Artisanat', MERCHANDISING:'Mode & Merch', DIVERS:'Bien-être & Divers',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function getYouTubeId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ?? null;
}

// ── Band Modal ─────────────────────────────────────────────────────────────
function BandModal({ band, onClose }: { band: Band; onClose: () => void }) {
  const ytId = band.videoUrl ? getYouTubeId(band.videoUrl) : null;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.85)' }}
         onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-xl overflow-hidden"
           style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
           onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                style={{ background: 'var(--background)', color: 'var(--muted-foreground)' }}>
          ×
        </button>

        {/* Video or photo */}
        {ytId ? (
          <div className="aspect-video">
            <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        ) : (
          <div className="relative w-full h-56 overflow-hidden">
            <Image src={band.imageUrl} alt={band.name} fill className="object-cover" unoptimized />
          </div>
        )}

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wide"
                  style={{ color: band.isHeadliner ? 'var(--accent-red)' : 'var(--foreground)' }}>
                {band.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{band.genre}{band.origin !== '—' ? ` · ${band.origin}` : ''}</p>
            </div>
            {band.time && (
              <span className="text-sm font-bold px-3 py-1 rounded shrink-0"
                    style={{ background: 'var(--accent-red)', color: '#000' }}>
                {band.time}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>
            {band.description}
          </p>
          <div className="flex gap-3">
            {ytId && !band.videoUrl?.includes('autoplay') && (
              <a href={band.videoUrl} target="_blank" rel="noopener noreferrer"
                 className="text-xs px-3 py-1.5 rounded font-medium transition-opacity hover:opacity-80"
                 style={{ background: 'var(--accent-red)', color: '#000' }}>
                YouTube ↗
              </a>
            )}
            {band.spotify && (
              <a href={band.spotify} target="_blank" rel="noopener noreferrer"
                 className="text-xs px-3 py-1.5 rounded font-medium transition-opacity hover:opacity-80"
                 style={{ background: '#1DB954', color: '#000' }}>
                Spotify ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Band Card (clickable) ──────────────────────────────────────────────────
function BandCard({ band, onOpen, size = 'sm' }: { band: Band; onOpen: (b: Band) => void; size?: 'sm' | 'md' | 'lg' }) {
  const hasVideo = !!(band.videoUrl && getYouTubeId(band.videoUrl));
  const imgH = size === 'lg' ? 'h-56' : size === 'md' ? 'h-44' : 'h-40';

  return (
    <button onClick={() => onOpen(band)}
            className={`group relative rounded-lg overflow-hidden text-left transition-transform hover:scale-[1.03] w-full`}
            style={{ border: band.isHeadliner ? '2px solid var(--accent-red)' : '1px solid var(--border)', background: 'var(--muted)' }}>
      <div className={`relative w-full ${imgH} overflow-hidden`}>
        <Image src={band.imageUrl} alt={band.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
        {band.time && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: 'var(--accent-red)', color: '#000' }}>
            {band.time}
          </span>
        )}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
               style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ background: 'var(--accent-red)' }}>
              <svg className="w-4 h-4 ml-0.5" fill="#000" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-2">
        <p className={`font-display uppercase tracking-wide truncate text-xs ${size === 'lg' ? 'text-sm' : ''}`}
           style={{ color: band.isHeadliner ? 'var(--accent-red)' : 'var(--foreground)' }}>
          {band.name}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{band.genre}</p>
      </div>
    </button>
  );
}

// ── Slides ─────────────────────────────────────────────────────────────────
function SlideCover() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-6 text-center px-8">
      <div className="relative w-24 h-24 mb-2">
        <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
      </div>
      <div>
        <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-widest mb-2"
            style={{ color: 'var(--accent-red)' }}>
          Barb&apos;n&apos;Rock
        </h1>
        <p className="font-display text-xl sm:text-3xl uppercase tracking-widest"
           style={{ color: 'var(--foreground)' }}>
          Festival 2026
        </p>
      </div>
      <div style={{ height: 1, width: 120, background: 'var(--border)' }} />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>26 · 27 · 28 juin 2026</p>
        <p style={{ color: 'var(--muted-foreground)' }}>Stade Municipal · Crèvecœur-le-Grand · Oise</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Conférence de presse · 11 juin 2026</p>
      </div>
    </div>
  );
}

function SlideAxes() {
  const axes = [
    { t:'Programmation exigeante', c:'19 groupes · 3 jours · 50 % Hauts-de-France · Têtes d\'affiche nationales et européennes' },
    { t:'Taille humaine & territoire', c:'Co-organisé par l\'ACPC & BVFR Charity, avec l\'appui de la Commune de Crèvecœur-le-Grand · Camping & parking gratuits · Dimanche famille à 5 € · -12 ans gratuits' },
    { t:'Engagements écologiques', c:'Écocups consignées · Bouteilles consignées (Le Fourgon) · 10 % du CA des stands reversé à une association chaque année' },
    { t:'Tremplin & artistes locaux', c:'MRWL & ADORE — 2 groupes régionaux sélectionnés sur scène via le tremplin du 4 avril 2026' },
  ];
  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Axes forts</h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {axes.map(a => (
          <div key={a.t} className="rounded-xl p-5 flex flex-col gap-2"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <h3 className="font-display text-sm uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>{a.t}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{a.c}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5 flex items-center gap-6"
           style={{ border: '1px solid var(--accent-red)', background: 'rgba(0,229,204,0.04)' }}>
        <div className="text-center shrink-0">
          <div className="font-display text-6xl sm:text-7xl" style={{ color: 'var(--accent-red)' }}>3 000</div>
          <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--muted-foreground)' }}>festivaliers attendus</div>
        </div>
        <div style={{ width: 1, height: 56, background: 'var(--border)' }} />
        <div className="flex gap-4 flex-wrap">
          {[['19','Groupes'],['50 %','Artistes HdF']].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-2xl" style={{ color: 'var(--foreground)' }}>{v}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideHeadliners({ onOpen }: { onOpen: (b: Band) => void }) {
  const all = [...bandsVendredi, ...bandsSamedi, ...bandsDimanche].filter(b => b.isHeadliner);
  const byDay: Record<string, Band[]> = { vendredi:[], samedi:[], dimanche:[] };
  all.forEach(b => byDay[b.day]?.push(b));

  return (
    <div className="flex flex-col px-8 py-6 gap-5">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Têtes d&apos;affiche</h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>
      <div className="rounded-xl px-5 py-4" style={{ border: '1px solid var(--accent-red)', background: 'rgba(0,229,204,0.04)' }}>
        <p className="text-base font-medium italic" style={{ color: 'var(--foreground)' }}>
          &ldquo; Cette année, on attend de vrais shows — un niveau scénique et une production énormes sur les trois jours. &rdquo;
        </p>
      </div>
      {(['vendredi','samedi','dimanche'] as const).map(day => (
        <div key={day}>
          <p className="text-xs uppercase tracking-widest mb-2 font-medium"
             style={{ color: 'var(--muted-foreground)' }}>
            {day === 'vendredi' ? 'Vendredi 26 juin' : day === 'samedi' ? 'Samedi 27 juin' : 'Dimanche 28 juin'}
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${byDay[day].length}, minmax(0, 1fr))` }}>
            {byDay[day].map(b => (
              <BandCard key={b.name} band={b} onOpen={onOpen} size="lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SlideDay({ title, openTime, bands, onOpen, callout }: {
  title: string; openTime: string; bands: Band[]; onOpen: (b: Band) => void; callout?: string;
}) {
  const headliners = bands.filter(b => b.isHeadliner);
  const supporting = bands.filter(b => !b.isHeadliner);
  return (
    <div className="flex flex-col px-8 py-6 gap-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded" style={{ background: 'var(--accent-red)' }} />
        <div>
          <h2 className="font-display text-3xl uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>{title}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Ouverture des portes · {openTime}</p>
        </div>
      </div>
      {callout && (
        <div className="rounded-xl px-5 py-3" style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.04)' }}>
          <p className="text-sm font-medium italic" style={{ color: 'var(--foreground)' }}>{callout}</p>
        </div>
      )}
      {headliners.length > 0 && (
        <div className="shrink-0">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Têtes d&apos;affiche</p>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(headliners.length, 3)}, minmax(0, 1fr))` }}>
            {headliners.map(b => <BandCard key={b.name} band={b} onOpen={onOpen} size="lg" />)}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Programmation</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {supporting.map(b => <BandCard key={b.name} band={b} onOpen={onOpen} size="sm" />)}
        </div>
      </div>
    </div>
  );
}

function SlideVillage() {
  const catGroups = CAT_ORDER.map(cat => ({
    cat, label: CAT_LABELS[cat],
    items: stands.filter(s => s.category === cat),
  })).filter(g => g.items.length > 0);

  const animations = ['Concours de barbes (dim. 14h)','Interviews live — Happyness Radio (tout le WE)'];

  return (
    <div className="flex flex-col px-8 py-6 gap-5">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Village du Chaos</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{stands.length} exposants · Ouvert tout le week-end</p>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
        {catGroups.map(({ label, items }) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
            <div className="flex flex-wrap gap-2">
              {items.map(s => (
                <div key={s.name} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                     style={{ border: '1px solid var(--border)', background: 'var(--background)' }}>
                  <div className="relative w-12 h-12 rounded overflow-hidden shrink-0" style={{ background: 'var(--muted)' }}>
                    <Image src={s.logo} alt={s.name} fill className="object-contain p-0.5" unoptimized />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0">
        <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Animations</p>
        <div className="flex flex-wrap gap-2">
          {animations.map(a => (
            <span key={a} className="text-xs px-3 py-1 rounded-full"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)', background: 'var(--muted)' }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideAssociation() {
  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Association soutenue</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>10 % du CA des stands reversé chaque année à une association locale</p>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>

      {/* Main callout */}
      <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
           style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.05)' }}>
        <div className="flex flex-col items-center text-center shrink-0 gap-2">
          <div className="font-display text-5xl sm:text-6xl" style={{ color: 'var(--accent-cyan)' }}>🧚</div>
          <div className="font-display text-2xl sm:text-3xl uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
            Les Fées Sourires
          </div>
        </div>
        <div style={{ width: 1, height: 64, background: 'var(--border)' }} className="hidden sm:block" />
        <div>
          <p className="text-base font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            L&apos;association soutenue par le Barb&apos;n Rock 2026
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Cette année, c&apos;est <strong style={{ color: 'var(--foreground)' }}>Les Fées Sourires</strong> que nous avons choisi de soutenir.
            10 % du chiffre d&apos;affaires des stands du Village du Chaos leur sera reversé à l&apos;issue du festival.
            Un engagement concret pour faire du Barb&apos;n Rock un événement utile au-delà de la musique.
          </p>
        </div>
      </div>

      {/* Context */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { titre: 'Engagement annuel', detail: 'Chaque édition, une association locale ou régionale est choisie et bénéficie directement des recettes du Village.' },
          { titre: '10 % du CA stands', detail: 'Un pourcentage fixe du chiffre d\'affaires de chacun des exposants du Village du Chaos.' },
          { titre: 'Impact local', detail: 'Une façon de lier l\'événement festif à une démarche solidaire ancrée dans le territoire.' },
        ].map(c => (
          <div key={c.titre} className="rounded-xl p-4"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <h4 className="font-display text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent-red)' }}>{c.titre}</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{c.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlidePartenaires() {
  const tierGroups = TIER_ORDER.map(tier => ({
    tier, label: TIER_LABELS[tier],
    items: partners.filter(p => p.tier === tier),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col px-8 py-6 gap-5">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Partenaires</h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>
      <div className="flex flex-col gap-5 flex-1">
        {tierGroups.map(({ label, items }) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
            <div className="flex flex-wrap gap-3">
              {items.map(p => (
                <div key={p.company} className="flex flex-col items-center gap-1 w-32">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden"
                       style={{ border: '1px solid var(--border)', background: 'var(--background)' }}>
                    <Image src={p.logo} alt={p.company} fill className="object-contain p-2" unoptimized />
                  </div>
                  <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted-foreground)' }}>{p.company}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-5 py-4" style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.04)' }}>
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--accent-cyan)' }}>Rejoignez l&apos;aventure · Devenez partenaire</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
          3 000 festivaliers, une communauté engagée, une forte visibilité locale et régionale.
          Le Barb&apos;n Rock est un formidable levier pour <strong>faire rayonner votre entreprise</strong> sur le territoire.
          Nous cherchons à élargir notre réseau — contactez-nous pour construire ensemble un partenariat sur mesure.
        </p>
      </div>
    </div>
  );
}

function SlideBilletterie() {
  const passes = [
    { pass:'Vendredi 26 juin',  prix:'18 €' },
    { pass:'Samedi 27 juin',    prix:'27 €' },
    { pass:'Ven. + Sam.',       prix:'39 €' },
    { pass:'Pass 3 jours',      prix:'42 €' },
    { pass:'Dimanche 28 juin',  prix:'5 €' },
  ];
  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-red)' }}>Billetterie</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>billetterie.barbnrock-festival.fr · HelloAsso · Ticket Net · Pass Culture</p>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Very Early Bird', status:'SOLD OUT', sold: true },
          { label:'Early Bird',      status:'SOLD OUT', sold: true },
          { label:'Tarif Standard',  status:'DISPONIBLE', sold: false },
        ].map(({ label, status, sold }) => (
          <div key={label} className="rounded-xl p-4 text-center"
               style={{
                 border: `1px solid ${sold ? 'rgba(239,68,68,0.3)' : 'var(--accent-red)'}`,
                 background: sold ? 'rgba(239,68,68,0.05)' : 'rgba(0,229,204,0.05)',
               }}>
            <p className="text-xs uppercase tracking-widest mb-1 font-medium"
               style={{ color: sold ? 'rgb(239,68,68)' : 'var(--accent-red)' }}>{label}</p>
            <p className="font-display text-2xl"
               style={{ color: sold ? 'rgb(239,68,68)' : 'var(--accent-red)' }}>{status}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div>
          <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Tarifs standards</p>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {passes.map((p, i) => (
              <div key={p.pass} className="flex justify-between items-center px-4 py-2"
                   style={{ background: i % 2 === 0 ? 'var(--background)' : 'var(--muted)', borderBottom: i < passes.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>{p.pass}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>{p.prix}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Camping · Parking · Réentrée · Enfants -12 ans · GRATUITS</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted-foreground)' }}>Projection</p>
          <div className="rounded-xl p-5 flex-1 flex flex-col justify-center"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <p className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--accent-cyan)' }}>3 000</p>
            <p className="text-sm mt-2" style={{ color: 'var(--foreground)' }}>festivaliers attendus</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>vs 2 200 en 2025 · Sur la base des courbes 2024–2025</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl px-5 py-4 flex items-start gap-3"
           style={{ border: '1px solid var(--accent-red)', background: 'rgba(239,68,68,0.05)' }}>
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>Capacité limitée — Réservez maintenant</p>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--foreground)' }}>
            Si nous atteignons 3 000 festivaliers, nous serons à la limite de notre capacité d&apos;accueil.
            Les deux premières vagues (Very Early Bird &amp; Early Bird) sont déjà Sold Out. <strong>Il faut prendre sa place sans attendre.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Nav arrow ──────────────────────────────────────────────────────────────
function NavArrow({ dir, onClick, disabled }: { dir: 'prev'|'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all disabled:opacity-20"
            style={{ border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)' }}>
      {dir === 'prev' ? '←' : '→'}
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
type SlideConfig = { id: string; label: string };
function SlideDimancheFamily() {
  const highlights = [
    { titre: 'Entrée à 5 €',             detail: 'Pour tous · Enfants de moins de 12 ans gratuits · Camping & parking offerts' },
    { titre: 'Château gonflable',         detail: 'Gratuit pour les enfants pendant toute la journée' },
    { titre: 'Jeux & activités',          detail: 'Jeux en bois, animations tout au long de la journée pour petits et grands' },
    { titre: 'Concours de barbes',        detail: '3 catégories : plus longue, plus originale, mieux taillée — dimanche 14h' },
    { titre: 'Barbiers sur place',        detail: 'V du Barbier & Nine Hair Beard disponibles dans le Village' },
    { titre: 'Interviews live',           detail: 'Happyness Radio en direct depuis le Village du Chaos' },
  ];

  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1 h-10 rounded shrink-0" style={{ background: 'var(--accent-cyan)' }} />
        <div>
          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
            Dimanche Rock en Famille
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            28 juin · Ouverture 14h · La journée détente du festival
          </p>
        </div>
      </div>

      {/* Big price highlight */}
      <div className="rounded-2xl p-6 flex items-center gap-6"
           style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.05)' }}>
        <div className="text-center shrink-0">
          <div className="font-display text-6xl sm:text-7xl" style={{ color: 'var(--accent-cyan)' }}>5€</div>
          <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'var(--muted-foreground)' }}>l&apos;entrée</div>
        </div>
        <div style={{ width: 1, height: 64, background: 'var(--border)' }} />
        <div>
          <p className="text-base font-medium mb-1" style={{ color: 'var(--foreground)' }}>
            Le festival ouvert à toute la famille — accessible à tous
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            5 €, c&apos;est à peine le prix d&apos;un château gonflable. Pour ça, vous avez de la musique live, 
            le château gonflable <em>en plus</em>, des jeux, des animations, et l&apos;ambiance d&apos;un festival. 
            Une journée en famille, sans se ruiner.
          </p>
        </div>
      </div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {highlights.map(h => (
          <div key={h.titre} className="rounded-xl p-4"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <h4 className="font-display text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--foreground)' }}>
              {h.titre}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{h.detail}</p>
          </div>
        ))}
      </div>

      {/* Lineup reminder */}
      <div className="rounded-xl p-4 flex items-center gap-4"
           style={{ border: '1px solid var(--border)', background: 'var(--background)' }}>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Tête d&apos;affiche du dimanche</p>
          <p className="font-display text-xl uppercase tracking-wider" style={{ color: 'var(--accent-red)' }}>Mainkind</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Hard rock 70s/80s · Poison · Guns N&apos;Roses · Mötley Crüe</p>
        </div>
        <div style={{ height: 40, width: 1, background: 'var(--border)' }} />
        <div>
          <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>+ 5 autres groupes</p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Saint Rock Station · Devon Duxe · Howlite · Udap · ADORE</p>
        </div>
      </div>
    </div>
  );
}

const SLIDES: SlideConfig[] = [
  { id:'cover',            label:'Couverture' },
  { id:'axes',             label:'Axes forts' },
  { id:'headliners',       label:'Têtes d\'affiche' },
  { id:'vendredi',         label:'Vendredi 26' },
  { id:'samedi',           label:'Samedi 27' },
  { id:'dimanche',         label:'Dimanche 28' },
  { id:'dimanche-famille', label:'Dimanche en famille' },
  { id:'village',          label:'Village' },
  { id:'association',      label:'Association soutenue' },
  { id:'partenaires',      label:'Partenaires' },
  { id:'billetterie',      label:'Billetterie' },
];

export default function PressePage() {
  const [slide, setSlide] = useState(0);
  const [activeBand, setActiveBand] = useState<Band | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setSlide(s => Math.min(SLIDES.length - 1, s + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeBand) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')                    { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, activeBand]);

  const progress = ((slide) / (SLIDES.length - 1)) * 100;

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: 'var(--background)', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div className="h-0.5 shrink-0" style={{ background: 'var(--border)' }}>
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: 'var(--accent-red)' }} />
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-2 shrink-0"
           style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative w-7 h-7 shrink-0">
          <Image src="/images/logo.png" alt="Barb'n Rock" fill className="object-contain" />
        </div>
        <span className="font-display text-sm uppercase tracking-wider hidden sm:block" style={{ color: 'var(--foreground)' }}>
          Barb&apos;n&apos;Rock 2026
        </span>
        <span className="text-xs hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>· 26–28 juin · Crèvecœur-le-Grand</span>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5 ml-auto">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setSlide(i)} title={s.label}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === slide ? 20 : 6, height: 6,
                      background: i === slide ? 'var(--accent-red)' : i < slide ? 'var(--muted-foreground)' : 'var(--border)',
                    }} />
          ))}
        </div>
        <span className="text-xs ml-2 tabular-nums shrink-0" style={{ color: 'var(--muted-foreground)' }}>
          {slide + 1} / {SLIDES.length}
        </span>
      </div>

      {/* Slide content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {SLIDES[slide].id === 'cover'      && <SlideCover />}
        {SLIDES[slide].id === 'axes'       && <SlideAxes />}
        {SLIDES[slide].id === 'headliners' && <SlideHeadliners onOpen={setActiveBand} />}
        {SLIDES[slide].id === 'vendredi'   && <SlideDay title="Vendredi 26 juin"  openTime="18h00" bands={bandsVendredi}  onOpen={setActiveBand} callout="🎸 Vendredi Rock — À ne pas rater : Cachemire, figure montante du rock français, a rempli La Cigale et vient d'annoncer une date à l'Olympia. Une soirée à saisir avant que les places explosent." />}
        {SLIDES[slide].id === 'samedi'     && <SlideDay title="Samedi 27 juin"    openTime="14h15" bands={bandsSamedi}    onOpen={setActiveBand} callout="🤘 Samedi Punk / Métal — Programmation ultra-costaud : des formations qui assurent de vrais shows de scène, des productions à la hauteur des plus grandes salles." />}
        {SLIDES[slide].id === 'dimanche'         && <SlideDay title="Dimanche 28 juin"  openTime="14h00" bands={bandsDimanche}  onOpen={setActiveBand} />}
        {SLIDES[slide].id === 'dimanche-famille' && <SlideDimancheFamily />}
        {SLIDES[slide].id === 'village'          && <SlideVillage />}
        {SLIDES[slide].id === 'association'       && <SlideAssociation />}
        {SLIDES[slide].id === 'partenaires'&& <SlidePartenaires />}
        {SLIDES[slide].id === 'billetterie'&& <SlideBilletterie />}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0"
           style={{ borderTop: '1px solid var(--border)' }}>
        <NavArrow dir="prev" onClick={prev} disabled={slide === 0} />
        <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
          {SLIDES[slide].label}
        </span>
        <NavArrow dir="next" onClick={next} disabled={slide === SLIDES.length - 1} />
      </div>

      {/* Band modal */}
      {mounted && activeBand && (
        <BandModal band={activeBand} onClose={() => setActiveBand(null)} />
      )}
    </div>
  );
}
