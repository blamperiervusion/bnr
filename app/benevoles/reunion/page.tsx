'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// ── Types ──────────────────────────────────────────────────────────────────
type Volunteer = {
  name: string;
  photo: string | null;
  isResp?: boolean;
  role?: string;
};

type Team = {
  id: string;
  label: string;
  emoji: string;
  color: 'red' | 'cyan';
  volunteers: Volunteer[];
  infos: { icon: string; text: string }[];
  resp: string;
};

// ── Volunteer data from DB ─────────────────────────────────────────────────
// Luc Pouilly et Vincent Warnault apparaissent comme resp sur plusieurs équipes
const LUC: Volunteer   = { name: 'Pouilly Luc',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1781174671226-rckewo.jpg', isResp: true };
const VINCENT: Volunteer = { name: 'Warnault Vincent', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1781180065575-cxb2wr.jpg', isResp: true };

const teams: Team[] = [
  {
    id: 'bar',
    label: 'Équipe Bar',
    emoji: '🍺',
    color: 'red',
    resp: 'Hubert',
    infos: [
      { icon: '📦', text: '11 palettes · 3 300 litres' },
      { icon: '🍺', text: 'IPA · Pils · Rouge' },
      { icon: '🍸', text: 'Gin tonic en fût' },
      { icon: '🚚', text: 'Camion froid prévu' },
      { icon: '✅', text: 'Idem organisation 2025' },
    ],
    volunteers: [
      { name: 'Baticle Hubert',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771448769684-lme0ys.jpg', isResp: true },
      { name: 'Patrouiller Gaëlle',  photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771446140027-gj6j3y.jpg' },
      { name: 'Horen Melanie',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771446516503-7u88a1.jpeg' },
      { name: 'Sohier Clément',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771450584505-xf8tzh.jpeg' },
      { name: 'Sohier Julien',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1773052449367-47kya7.jpeg' },
      { name: 'Gendek François',     photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771447026160-1jun8v.png' },
      { name: 'Vitu Lucien',         photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1777125032783-07ntau.jpg' },
      { name: 'Christin Marie-Line', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1778951583639-4owuo3.jpg' },
    ],
  },
  {
    id: 'artistes',
    label: 'Équipe Artistes',
    emoji: '🎸',
    color: 'red',
    resp: 'Vincent',
    infos: [
      { icon: '🍽️', text: '450 repas à préparer' },
      { icon: '🛋️', text: 'Loges à préparer' },
      { icon: '🏡', text: 'Ferme des Verguis' },
      { icon: '📈', text: 'Équipe plus nombreuse que 2025' },
    ],
    volunteers: [
      VINCENT,
      { name: 'MOKRANI Yani',        photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771449270095-70snc4.jpg' },
      { name: 'LAMPERIER Françoise', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1773162870415-c6ifr7.jpg' },
      { name: 'Charlois Jean Marc',  photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771499806209-oo6jjn.jpg' },
      { name: 'Parisot',             photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1778685882458-cuklgp.jpeg' },
      { name: 'Théry Marie',         photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1779304085232-thr8en.jpg' },
      { name: 'Roussel Stéphane',    photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1779304009220-o54fao.jpg' },
    ],
  },
  {
    id: 'accueil',
    label: 'Équipe Accueil',
    emoji: '👋',
    color: 'cyan',
    resp: 'Luc · Aurélie',
    infos: [
      { icon: '⛺', text: "Barnum pour l'accueil camping" },
      { icon: '✅', text: 'Idem organisation 2025' },
    ],
    volunteers: [
      LUC,
      { name: 'Warnault Aurélie',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1774595759641-q9s6s1.jpg', isResp: true },
      { name: 'Sanders Cécile',         photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1772645072338-cdozxa.jpg' },
      { name: 'Souchon Marius',         photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1775742606216-smch3n.jpg' },
      { name: 'Jean Paul Villain',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1774695845415-0g6m6f.jpg' },
      { name: 'Caudron Jean-Sébastien', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1776283749143-eywca1.jpg' },
      { name: 'Ledour Victor',          photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1775384302343-h08yoq.jpeg' },
      { name: 'Isabelle Françoise',     photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1777816706527-so24m1.jpg' },
    ],
  },
  {
    id: 'merch',
    label: "Équipe Merch'",
    emoji: '👕',
    color: 'red',
    resp: 'Luc',
    infos: [
      { icon: '🧥', text: 'Sweat · Casquette · T-shirt ×2 modèles' },
    ],
    volunteers: [
      LUC,
      { name: 'Morel Sylvain',     photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771453457978-khbzfp.jpg' },
      { name: 'Tessier Adélaïde',  photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771518789594-sk8dzq.jpeg' },
      { name: 'Delgado Charlène',  photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1775813632971-8z31a9.jpeg' },
      { name: 'Pouilly Bénédicte', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1779091514848-p91rax.jpg' },
    ],
  },
  {
    id: 'technique',
    label: 'Équipe Technique & Logistique',
    emoji: '🔧',
    color: 'red',
    resp: 'Franck',
    infos: [
      { icon: '⚠️', text: 'Besoin : 6 personnes minimum' },
      { icon: '📅', text: 'Montage dès lundi · Gros rush jeudi/vendredi' },
      { icon: '🌙', text: 'Démontage dimanche nuit' },
      { icon: '🎚️', text: 'Régisseur scène 1 : Jean' },
    ],
    volunteers: [
      { name: 'Mayot Franck',        photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771454012144-ni5166.jpg', isResp: true },
      { name: 'Palain Alain',        photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771446283525-tx2ir8.jpg' },
      { name: 'Bisoullier Valérian', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771485378717-jes07q.jpg' },
      { name: 'Levert Gaétan',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771447841465-dqo70i.jpg' },
      { name: 'Aquilina Julien',     photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771450711917-ppfcf0.png' },
      { name: 'Mathon Doun',         photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771507784784-h3x26s.jpg' },
      { name: 'Jose Ministro',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1776502181616-09yxea.png' },
      { name: 'Druelle Vincent',     photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1772149283125-7y0p1n.jpeg' },
      { name: 'Dranguet David',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1778611397713-aks8oh.jpg' },
      { name: 'Dumont Arthur',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1780843894068-08q6ij.jpeg' },
    ],
  },
  {
    id: 'cashless',
    label: 'Équipe Cashless',
    emoji: '🎟️',
    color: 'cyan',
    resp: 'Luc',
    infos: [
      { icon: '🎟️', text: 'Gestion des tickets cashless' },
    ],
    volunteers: [
      LUC,
      { name: 'Langlet Reynald',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771447688771-wl5n78.jpeg' },
      { name: 'DOURNEL Jérôme',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771448930426-rz88mz.jpg' },
      { name: 'CHAILLOU Axelle',      photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1771695616423-xuqo4s.jpeg' },
      { name: 'CAUSTIER Anne-Sophie', photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1774184485282-x20t1x.jpg' },
      { name: 'Guilhem Cécile',       photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1776502720818-n114v0.jpg' },
      { name: 'Martin Alex',          photo: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/volunteers/1780057416928-bb6jqc.jpg' },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() ?? '').join('');
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ volunteer, size = 'md' }: { volunteer: Volunteer; size?: 'sm' | 'md' | 'lg' }) {
  const [error, setError] = useState(false);
  const dim = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-14 h-14' : 'w-10 h-10';
  const textSize = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-xs';

  return (
    <div className={`relative ${dim} rounded-full overflow-hidden shrink-0`}
         style={{ border: volunteer.isResp ? '2px solid var(--accent-red)' : '2px solid var(--border)' }}>
      {volunteer.photo && !error ? (
        <Image
          src={volunteer.photo}
          alt={volunteer.name}
          fill
          className="object-cover"
          unoptimized
          onError={() => setError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-display font-bold ${textSize}`}
             style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
          {initials(volunteer.name)}
        </div>
      )}
    </div>
  );
}

// ── VolunteerCard ──────────────────────────────────────────────────────────
function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const firstName = volunteer.name.split(' ').pop() ?? volunteer.name;

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="relative">
        <Avatar volunteer={volunteer} size="md" />
        {volunteer.isResp && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'var(--accent-red)', color: '#000', fontSize: 9 }}>
            ★
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium leading-tight" style={{ color: 'var(--foreground)', maxWidth: 80 }}>
          {firstName}
        </p>
        {volunteer.isResp && (
          <p className="text-xs" style={{ color: 'var(--accent-red)', fontSize: 9 }}>Resp'</p>
        )}
        {volunteer.role && (
          <p className="text-xs" style={{ color: 'var(--accent-cyan)', fontSize: 9 }}>{volunteer.role}</p>
        )}
      </div>
    </div>
  );
}

// ── Slides ─────────────────────────────────────────────────────────────────
function SlideCover() {
  const totalVolunteers = teams.reduce((sum, t) => sum + t.volunteers.length, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-6 text-center px-8 py-10">
      <div className="relative w-20 h-20 mb-2">
        <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
      </div>
      <div>
        <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-widest mb-2"
            style={{ color: 'var(--accent-red)' }}>
          Barb&apos;n&apos;Rock 2026
        </h1>
        <p className="font-display text-xl sm:text-2xl uppercase tracking-widest"
           style={{ color: 'var(--foreground)' }}>
          Réunion Bénévoles
        </p>
      </div>
      <div style={{ height: 1, width: 120, background: 'var(--border)' }} />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>26 · 27 · 28 juin 2026</p>
        <p style={{ color: 'var(--muted-foreground)' }}>Stade Municipal · Crèvecœur-le-Grand</p>
      </div>
      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <div className="font-display text-4xl" style={{ color: 'var(--accent-red)' }}>{totalVolunteers}</div>
          <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted-foreground)' }}>bénévoles</div>
        </div>
        <div style={{ width: 1, height: 48, background: 'var(--border)' }} />
        <div className="text-center">
          <div className="font-display text-4xl" style={{ color: 'var(--accent-cyan)' }}>{teams.length}</div>
          <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted-foreground)' }}>équipes</div>
        </div>
        <div style={{ width: 1, height: 48, background: 'var(--border)' }} />
        <div className="text-center">
          <div className="font-display text-4xl" style={{ color: 'var(--foreground)' }}>3</div>
          <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'var(--muted-foreground)' }}>jours</div>
        </div>
      </div>
    </div>
  );
}

function SlideBrief() {
  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest"
            style={{ color: 'var(--accent-red)' }}>
          Le brief
        </h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>

      {/* Main callout */}
      <div className="rounded-2xl p-6 flex items-start gap-4"
           style={{ border: '2px solid var(--accent-red)', background: 'rgba(239,68,68,0.05)' }}>
        <span className="text-4xl shrink-0 mt-1">🤘</span>
        <div>
          <p className="font-display text-xl sm:text-2xl uppercase tracking-wide mb-3"
             style={{ color: 'var(--foreground)' }}>
            On accueille tout le monde avec le sourire
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            L&apos;objectif numéro 1 : <strong style={{ color: 'var(--foreground)' }}>un max de fluidité</strong> sur l&apos;ensemble
            du festival. Chaque bénévole est le premier visage que les festivaliers voient.
            Une bonne énergie, une bonne organisation, et tout roule.
          </p>
        </div>
      </div>

      {/* Key points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { titre: 'Sourire & bonne humeur', detail: 'La première impression, c\'est vous. Accueil chaleureux, disponibilité, et bienveillance.' },
          { titre: 'Fluidité avant tout', detail: 'Files d\'attente, circulation, transitions — chaque équipe veille à ce que ça coule.' },
          { titre: 'Esprit d\'équipe', detail: 'On s\'entraide entre équipes quand c\'est nécessaire. Pas de silo, tout le monde est là pour le même festival.' },
        ].map(c => (
          <div key={c.titre} className="rounded-xl p-4"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <h4 className="font-display text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent-cyan)' }}>
              {c.titre}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{c.detail}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Montage */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="px-4 py-2.5" style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--accent-cyan)' }}>
              Montage · 22–26 juin
            </p>
          </div>
          {[
            { day: 'Lundi 22',    tasks: ['Marquage', 'Bar', 'Catering'] },
            { day: 'Mardi 23',    tasks: ['Bar', 'Loges', 'Début village'] },
            { day: 'Mercredi 24', tasks: ['Scène 2', 'Village'] },
            { day: 'Jeudi 25',    tasks: ['Scène 1 🔥', 'Village', "Merch'", 'Électricité', 'Livraisons'], rush: true },
            { day: 'Vendredi 26', tasks: ['Mise en place', 'Déco'], rush: true },
          ].map((row, i) => (
            <div key={row.day} className="flex items-start gap-3 px-4 py-2.5"
                 style={{
                   background: row.rush ? 'rgba(0,229,204,0.05)' : i % 2 === 0 ? 'var(--background)' : 'var(--muted)',
                   borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                 }}>
              <p className="text-xs font-bold w-24 shrink-0 pt-0.5"
                 style={{ color: row.rush ? 'var(--accent-cyan)' : 'var(--muted-foreground)' }}>
                {row.day}
              </p>
              <div className="flex flex-wrap gap-1">
                {row.tasks.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--border)', color: 'var(--foreground)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Festival */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="px-4 py-2.5" style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--accent-red)' }}>
              Festival · 26–28 juin
            </p>
          </div>
          {[
            { day: 'Vendredi 26', label: 'Portes 18h00', close: 'Fermeture 01h' },
            { day: 'Samedi 27',   label: 'Portes 14h00', close: 'Fermeture 01h' },
            { day: 'Dimanche 28', label: 'Portes 11h00', close: 'Fermeture 21h' },
            { day: 'Dim. nuit',   label: 'Démontage',    close: '' },
          ].map((row, i) => (
            <div key={row.day} className="flex items-center justify-between px-4 py-3"
                 style={{
                   background: i % 2 === 0 ? 'var(--background)' : 'var(--muted)',
                   borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                 }}>
              <p className="text-xs font-bold" style={{ color: i < 3 ? 'var(--accent-red)' : 'var(--muted-foreground)' }}>
                {row.day}
              </p>
              <p className="text-xs" style={{ color: 'var(--foreground)' }}>{row.label}</p>
              {row.close && (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{row.close}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideAvantages() {
  const avantages = [
    {
      emoji: '🎟️',
      titre: 'Accès au festival',
      detail: 'Entrée gratuite sur les jours travaillés. Tu es là, tu profites.',
    },
    {
      emoji: '👕',
      titre: 'T-shirt bénévole',
      detail: 'Un t-shirt exclusif à l\'effigie de l\'édition 2026 — que tu ne trouveras nulle part ailleurs.',
    },
    {
      emoji: '🍽️',
      titre: 'Repas pendant les postes',
      detail: 'Un repas chaud fourni à chaque poste. On ne laisse personne travailler le ventre vide.',
    },
    {
      emoji: '🥤',
      titre: 'Softs à volonté',
      detail: 'Eau, sodas en libre accès pendant toute la durée de tes postes.',
    },
    {
      emoji: '🎫',
      titre: '2 tickets boisson / jour',
      detail: '2 tickets boisson offerts chaque jour de présence pour profiter du bar.',
    },
    {
      emoji: '🤘',
      titre: 'Une expérience unique',
      detail: 'Voir le festival de l\'intérieur, créer des liens, faire partie de l\'aventure Barb\'n\'Rock.',
    },
  ];

  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest"
            style={{ color: 'var(--accent-red)' }}>
          Ce que ça vous apporte
        </h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>

      <div className="rounded-2xl p-5 flex items-start gap-4"
           style={{ border: '2px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.05)' }}>
        <span className="text-3xl shrink-0">💬</span>
        <p className="text-base leading-relaxed italic" style={{ color: 'var(--foreground)' }}>
          Être bénévole au Barb&apos;n&apos;Rock, c&apos;est pas juste donner un coup de main —
          c&apos;est <strong>faire partie du festival</strong>. Chaque édition, on construit quelque chose ensemble,
          et ça, ça n&apos;a pas de prix.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {avantages.map(a => (
          <div key={a.titre} className="rounded-xl p-4 flex flex-col gap-2"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <span className="text-2xl">{a.emoji}</span>
            <h4 className="font-display text-sm uppercase tracking-wide"
                style={{ color: 'var(--foreground)' }}>
              {a.titre}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {a.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTeam({ team }: { team: Team }) {
  const accentColor = team.color === 'red' ? 'var(--accent-red)' : 'var(--accent-cyan)';
  const accentBg   = team.color === 'red' ? 'rgba(239,68,68,0.05)' : 'rgba(0,229,204,0.05)';

  return (
    <div className="flex flex-col px-8 py-6 gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 rounded shrink-0" style={{ background: accentColor }} />
        <div>
          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest"
              style={{ color: accentColor }}>
            {team.label}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Resp&apos; Bénévoles :
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: accentColor, color: '#000' }}>
              {team.resp}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              · {team.volunteers.length} bénévoles
            </span>
          </div>
        </div>
      </div>

      {/* Infos & Trombinoscope */}
      <div className="flex flex-col sm:flex-row gap-5 flex-1">
        {/* Info cards */}
        {team.infos.length > 0 && (
          <div className="flex flex-col gap-2 sm:w-64 shrink-0">
            <p className="text-xs uppercase tracking-widest font-medium"
               style={{ color: 'var(--muted-foreground)' }}>
              Infos équipe
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {team.infos.map((info, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5"
                     style={{
                       background: i % 2 === 0 ? 'var(--background)' : 'var(--muted)',
                       borderBottom: i < team.infos.length - 1 ? '1px solid var(--border)' : 'none',
                     }}>
                  <span className="shrink-0 mt-0.5">{info.icon}</span>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{info.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trombinoscope */}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest font-medium mb-3"
             style={{ color: 'var(--muted-foreground)' }}>
            Trombinoscope
          </p>
          <div className="rounded-xl p-5" style={{ border: '1px solid var(--border)', background: accentBg }}>
            <div className="flex flex-wrap gap-4">
              {team.volunteers.map(v => (
                <VolunteerCard key={v.name} volunteer={v} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideBarrages() {
  return (
    <div className="flex flex-col px-8 py-6 gap-6">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-widest"
            style={{ color: 'var(--accent-cyan)' }}>
          Barrages &amp; Parking
        </h2>
        <div className="mt-1 h-px" style={{ background: 'var(--border)', width: 60 }} />
      </div>

      <div className="rounded-2xl p-6 flex items-center gap-5"
           style={{ border: '1px solid var(--accent-cyan)', background: 'rgba(0,229,204,0.05)' }}>
        <span className="text-5xl shrink-0">🅿️</span>
        <div>
          <p className="font-display text-xl uppercase tracking-wide mb-2"
             style={{ color: 'var(--foreground)' }}>
            Plan communiqué par PAO
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Le plan de circulation, les emplacements de barrages et les zones de parking
            seront fournis par l&apos;équipe PAO. Chaque équipe concernée recevra les détails
            de positionnement avant le festival.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { titre: 'Parkings gratuits', detail: 'Parking visiteurs et camping gratuits — signal clair depuis les axes d\'accès.' },
          { titre: 'Barrages routiers', detail: 'Positionnement défini sur plan PAO — à suivre à la lettre pour la fluidité.' },
          { titre: 'Camping', detail: 'Barnum d\'accueil camping géré par l\'équipe Accueil. Flux séparé des entrées festival.' },
          { titre: 'Accessibilité', detail: 'Voies réservées PMR et artistes — à préserver impérativement.' },
        ].map(c => (
          <div key={c.titre} className="rounded-xl p-4"
               style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
            <h4 className="font-display text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent-red)' }}>
              {c.titre}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{c.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Nav arrow ──────────────────────────────────────────────────────────────
function NavArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all disabled:opacity-20"
      style={{ border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)' }}
    >
      {dir === 'prev' ? '←' : '→'}
    </button>
  );
}

// ── Slide config ───────────────────────────────────────────────────────────
type SlideConfig = { id: string; label: string };

const SLIDES: SlideConfig[] = [
  { id: 'cover',      label: 'Réunion Bénévoles' },
  { id: 'brief',      label: 'Le brief' },
  { id: 'avantages',  label: 'Ce que ça vous apporte' },
  ...teams.map(t => ({ id: t.id, label: t.label })),
  { id: 'barrages',   label: 'Barrages & Parking' },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function BenevosPage() {
  const [slide, setSlide] = useState(0);

  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setSlide(s => Math.min(SLIDES.length - 1, s + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')                    { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const progress = (slide / (SLIDES.length - 1)) * 100;
  const currentTeam = teams.find(t => t.id === SLIDES[slide].id);

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: 'var(--background)', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div className="h-0.5 shrink-0" style={{ background: 'var(--border)' }}>
        <div className="h-full transition-all duration-300"
             style={{ width: `${progress}%`, background: 'var(--accent-red)' }} />
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-2 shrink-0"
           style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative w-7 h-7 shrink-0">
          <Image src="/images/logo.png" alt="Barb'n Rock" fill className="object-contain" />
        </div>
        <span className="font-display text-sm uppercase tracking-wider hidden sm:block"
              style={{ color: 'var(--foreground)' }}>
          Barb&apos;n&apos;Rock 2026
        </span>
        <span className="text-xs hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
          · Réunion Bénévoles
        </span>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5 ml-auto">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSlide(i)}
              title={s.label}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === slide ? 20 : 6,
                height: 6,
                background: i === slide
                  ? 'var(--accent-red)'
                  : i < slide
                    ? 'var(--muted-foreground)'
                    : 'var(--border)',
              }}
            />
          ))}
        </div>
        <span className="text-xs ml-2 tabular-nums shrink-0" style={{ color: 'var(--muted-foreground)' }}>
          {slide + 1} / {SLIDES.length}
        </span>
      </div>

      {/* Slide content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {SLIDES[slide].id === 'cover'     && <SlideCover />}
        {SLIDES[slide].id === 'brief'     && <SlideBrief />}
        {SLIDES[slide].id === 'avantages' && <SlideAvantages />}
        {currentTeam                      && <SlideTeam team={currentTeam} />}
        {SLIDES[slide].id === 'barrages'  && <SlideBarrages />}
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
    </div>
  );
}
