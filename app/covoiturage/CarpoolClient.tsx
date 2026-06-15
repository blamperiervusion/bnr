'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { MapOffer } from './CarpoolMap';

const CarpoolMap = dynamic(() => import('./CarpoolMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full rounded-xl flex items-center justify-center text-sm"
      style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
    >
      Chargement de la carte…
    </div>
  ),
});

type Offer = {
  id: string;
  type: 'DRIVER' | 'PASSENGER';
  name: string;
  city: string;
  lat: number | null;
  lng: number | null;
  seats: number | null;
  days: string[];
  message: string | null;
  createdAt: string;
};

const DAY_OPTIONS = [
  { value: 'vendredi', label: 'Vendredi 26' },
  { value: 'samedi', label: 'Samedi 27' },
  { value: 'dimanche', label: 'Dimanche 28' },
];

const DAY_LABELS: Record<string, string> = {
  vendredi: 'Ven. 26',
  samedi: 'Sam. 27',
  dimanche: 'Dim. 28',
};

function Badge({ children, color }: { children: React.ReactNode; color: 'green' | 'blue' | 'gray' }) {
  const colors = {
    green: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
    blue: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
    gray: { bg: 'var(--muted)', text: 'var(--muted-foreground)' },
  };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: colors[color].bg, color: colors[color].text }}
    >
      {children}
    </span>
  );
}

function OfferCard({
  offer,
  highlighted,
  onContact,
  cardRef,
}: {
  offer: Offer;
  highlighted: boolean;
  onContact: (offer: Offer) => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-300"
      style={{
        border: highlighted ? '2px solid var(--accent-red)' : '1px solid var(--border)',
        background: highlighted ? 'rgba(239,68,68,0.05)' : 'var(--muted)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{offer.type === 'DRIVER' ? '🚗' : '🙋'}</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              {offer.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {offer.city}
            </p>
          </div>
        </div>
        <Badge color={offer.type === 'DRIVER' ? 'green' : 'blue'}>
          {offer.type === 'DRIVER' ? 'Conducteur' : 'Passager'}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {offer.days.map(d => (
          <Badge key={d} color="gray">{DAY_LABELS[d] ?? d}</Badge>
        ))}
        {offer.type === 'DRIVER' && offer.seats && (
          <Badge color="green">{offer.seats} place{offer.seats > 1 ? 's' : ''}</Badge>
        )}
      </div>

      {offer.message && (
        <p className="text-xs italic leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          &ldquo;{offer.message}&rdquo;
        </p>
      )}

      <button
        onClick={() => onContact(offer)}
        className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: 'var(--accent-red)', color: '#fff' }}
      >
        Contacter
      </button>
    </div>
  );
}

function ContactModal({
  offer,
  onClose,
}: {
  offer: Offer;
  onClose: () => void;
}) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/covoiturage/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, senderName, senderEmail, message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
              Contacter
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {offer.type === 'DRIVER' ? '🚗 Conducteur' : '🙋 Passager'} · {offer.name} · {offer.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none mt-0.5"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ✕
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Message envoyé !</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {offer.name} recevra votre message et pourra vous répondre directement.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--accent-red)', color: '#fff' }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                     style={{ color: 'var(--muted-foreground)' }}>
                Votre prénom
              </label>
              <input
                type="text"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                required
                placeholder="Ex : Marie"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--muted)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                     style={{ color: 'var(--muted-foreground)' }}>
                Votre email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                required
                placeholder="ex@mail.com"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--muted)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                     style={{ color: 'var(--muted-foreground)' }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={3}
                placeholder="Dites-lui d'où vous partez, à quelle heure…"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{
                  background: 'var(--muted)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
            {status === 'error' && (
              <p className="text-xs" style={{ color: 'var(--accent-red)' }}>
                Une erreur s&apos;est produite. Réessayez.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ background: 'var(--accent-red)', color: '#fff' }}
            >
              {status === 'loading' ? 'Envoi…' : 'Envoyer'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function OfferForm({ onSuccess }: { onSuccess: () => void }) {
  const [type, setType] = useState<'DRIVER' | 'PASSENGER'>('DRIVER');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [seats, setSeats] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function toggleDay(d: string) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!days.length) {
      setErrorMsg('Sélectionnez au moins un jour.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/covoiturage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, city, seats: type === 'DRIVER' ? seats : undefined, days, message, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        onSuccess();
      } else {
        setErrorMsg(data.error ?? 'Erreur inconnue');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Erreur réseau. Réessayez.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-3">🤘</p>
        <p className="font-display text-xl uppercase tracking-wide mb-2" style={{ color: 'var(--accent-red)' }}>
          Annonce soumise !
        </p>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Votre annonce sera publiée après validation par notre équipe.
          Un email de confirmation vous a été envoyé avec un lien pour la supprimer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Type */}
      <div>
        <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Je suis
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['DRIVER', 'PASSENGER'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                border: type === t ? '2px solid var(--accent-red)' : '2px solid var(--border)',
                background: type === t ? 'rgba(239,68,68,0.1)' : 'var(--muted)',
                color: type === t ? 'var(--accent-red)' : 'var(--foreground)',
              }}
            >
              {t === 'DRIVER' ? '🚗 Conducteur' : '🙋 Passager'}
            </button>
          ))}
        </div>
      </div>

      {/* Days */}
      <div>
        <p className="text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Jours concernés
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => toggleDay(d.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                border: days.includes(d.value) ? '2px solid var(--accent-cyan)' : '2px solid var(--border)',
                background: days.includes(d.value) ? 'rgba(0,229,204,0.1)' : 'var(--muted)',
                color: days.includes(d.value) ? 'var(--accent-cyan)' : 'var(--foreground)',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                 style={{ color: 'var(--muted-foreground)' }}>
            Prénom *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Ex : Sébastien"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                 style={{ color: 'var(--muted-foreground)' }}>
            Ville de départ *
          </label>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            placeholder="Ex : Amiens"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        {type === 'DRIVER' && (
          <div>
            <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                   style={{ color: 'var(--muted-foreground)' }}>
              Places disponibles *
            </label>
            <input
              type="number"
              min={1}
              max={8}
              value={seats}
              onChange={e => setSeats(e.target.value)}
              required={type === 'DRIVER'}
              placeholder="1–8"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        )}
        <div className={type === 'DRIVER' ? '' : 'sm:col-span-2'}>
          <label className="text-xs uppercase tracking-wider font-medium block mb-1"
                 style={{ color: 'var(--muted-foreground)' }}>
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Non publié, pour être contacté"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider font-medium block mb-1"
               style={{ color: 'var(--muted-foreground)' }}>
          Message (optionnel)
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={2}
          placeholder="Heure de départ, point de rendez-vous…"
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        />
      </div>

      {errorMsg && (
        <p className="text-xs" style={{ color: 'var(--accent-red)' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-3 rounded-xl text-sm font-display uppercase tracking-widest transition-opacity disabled:opacity-60"
        style={{ background: 'var(--accent-red)', color: '#fff' }}
      >
        {status === 'loading' ? 'Envoi…' : 'Publier mon annonce'}
      </button>

      <div
        className="rounded-xl p-4 flex gap-3"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <span className="text-lg shrink-0">⚠️</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Sécurité.</strong>{' '}
          Le covoiturage, c&apos;est top — mais la mise en relation reste de votre responsabilité.
          Faites confiance à votre instinct, partagez votre trajet avec des proches, et rappelez-vous :
          des éthylotests seront disponibles sur le festival. Alcool et volant, ça ne se mélange pas.
        </p>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
        Votre email ne sera jamais affiché publiquement — nous le communiquerons uniquement
        en cas de mise en relation. Toutes les données seront supprimées après le festival.
      </p>
    </form>
  );
}

export default function CarpoolClient({ initialOffers }: { initialOffers: Offer[] }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [filterDay, setFilterDay] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [contactOffer, setContactOffer] = useState<Offer | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredOffers = offers.filter(o => {
    if (filterDay && !o.days.includes(filterDay)) return false;
    if (filterType && o.type !== filterType) return false;
    return true;
  });

  const mapOffers: MapOffer[] = filteredOffers
    .filter(o => o.lat != null && o.lng != null)
    .map(o => ({ ...o, lat: o.lat!, lng: o.lng! }));

  function handleMarkerClick(id: string) {
    setHighlightedId(id);
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightedId(null), 3000);
  }

  const refreshOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/covoiturage');
      if (res.ok) setOffers(await res.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    refreshOffers();
  }, [refreshOffers]);

  return (
    <>
      {contactOffer && (
        <ContactModal offer={contactOffer} onClose={() => setContactOffer(null)} />
      )}

      {/* Modal formulaire */}
      {showFormModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.75)', zIndex: 9999 }}
          onClick={() => setShowFormModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 my-auto"
            style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
                  Proposer / Chercher
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  Déposez votre annonce, on s&apos;occupe du reste
                </p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-xl leading-none mt-0.5 ml-4"
                style={{ color: 'var(--muted-foreground)' }}
              >
                ✕
              </button>
            </div>
            <OfferForm onSuccess={() => { refreshOffers(); setShowFormModal(false); }} />
          </div>
        </div>
      )}

      {/* Legend + filters + CTA */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500" /> Conducteur
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 ml-2" /> Passager
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-2" /> Festival
        </div>
        <div className="ml-auto flex gap-2 flex-wrap items-center">
          <select
            value={filterDay}
            onChange={e => setFilterDay(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <option value="">Tous les jours</option>
            {DAY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <option value="">Conducteurs & Passagers</option>
            <option value="DRIVER">Conducteurs</option>
            <option value="PASSENGER">Passagers</option>
          </select>
          <button
            onClick={() => setShowFormModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: 'var(--accent-red)', color: '#fff' }}
          >
            + Déposer une annonce
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="w-full rounded-xl overflow-hidden mb-6" style={{ height: 380, border: '1px solid var(--border)' }}>
        <CarpoolMap offers={mapOffers} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Liste pleine largeur */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
            Annonces
          </h2>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {filteredOffers.length} annonce{filteredOffers.length !== 1 ? 's' : ''}
          </span>
        </div>
        {filteredOffers.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
          >
            Aucune annonce pour le moment.{' '}
            <button
              onClick={() => setShowFormModal(true)}
              className="underline"
              style={{ color: 'var(--accent-red)' }}
            >
              Soyez le premier à en proposer une !
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOffers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                highlighted={highlightedId === offer.id}
                onContact={setContactOffer}
                cardRef={el => { cardRefs.current[offer.id] = el; }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
