'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { SectionTitle, Button, Card } from '@/components/ui';

interface BandMember {
  name: string;
  instrument: string;
}

const genres = [
  { value: 'samedi-metal-punk', label: 'Samedi 27 juin — Metal / Punk (compos)' },
  { value: 'dimanche-rock-reprises', label: 'Dimanche 28 juin — Rock / Reprises' },
];

const timeline = [
  {
    date: '15 mars 2026',
    title: 'Clôture des inscriptions',
    description: "Dernière limite pour envoyer ta candidature.",
  },
  {
    date: '20 mars 2026',
    title: 'Annonce des 6 présélectionnés',
    description: "3 groupes Metal/Punk (samedi) + 3 groupes Rock/Reprises (dimanche).",
  },
  {
    date: '4 avril 2026',
    title: 'Soirée Tremplin',
    description: "Les 6 finalistes joueront devant le jury et le public.",
  },
  {
    date: 'Juin 2026',
    title: 'Festival Barb\'n\'Rock',
    description: "Le groupe gagnant jouera sur la scène du festival !",
  },
];

const prizes = [
  {
    position: '🥇',
    title: '1er Prix',
    highlight: true,
    items: [
      'Concert au Festival Barb\'n\'Rock 2026',
      'Couverture médiatique locale',
    ],
  },
  {
    position: '🎁',
    title: '2ème & 3ème Prix',
    highlight: false,
    items: [
      'Entrées pour le festival',
      'Visibilité sur nos réseaux sociaux',
      'Lot merchandising Barb\'n\'Rock',
    ],
  },
];

const rules = [
  'Être un groupe amateur qui débute (premières scènes)',
  'Priorité aux groupes proches de Crèvecœur-le-Grand / Oise',
  'Samedi : Metal / Punk avec compositions originales',
  'Dimanche : Rock / Reprises',
  'Être disponible le 4 avril 2026 pour la finale',
  'Être disponible en juin 2026 pour le festival (si gagnant)',
];

export default function TremplinPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    bandName: '',
    genre: '',
    city: '',
    formationYear: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    bio: '',
    youtubeLink: '',
    spotifyLink: '',
    bandcampLink: '',
    facebookLink: '',
    instagramLink: '',
    otherLink: '',
    photoUrl: '',
    demoUrl: '',
    motivation: '',
  });

  const [members, setMembers] = useState<BandMember[]>([
    { name: '', instrument: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<'photo' | 'demo' | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddMember = () => {
    setMembers([...members, { name: '', instrument: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (index: number, field: keyof BandMember, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'demo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPhoto = type === 'photo';
    const allowedTypes = isPhoto 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      alert(isPhoto 
        ? 'Seules les images JPG, PNG, GIF ou WebP sont acceptées.'
        : 'Seuls les fichiers MP3, WAV, OGG ou PDF sont acceptés.'
      );
      return;
    }

    const maxSize = isPhoto ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Le fichier est trop volumineux (max ${isPhoto ? '5MB' : '20MB'}).`);
      return;
    }

    setIsUploading(type);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          [isPhoto ? 'photoUrl' : 'demoUrl']: data.url,
        }));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'upload.');
      }
    } catch {
      alert('Erreur de connexion. Réessaie plus tard.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validation des membres
    const validMembers = members.filter(m => m.name && m.instrument);
    if (validMembers.length === 0) {
      setSubmitStatus('error');
      setErrorMessage('Ajoute au moins un membre du groupe.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/tremplin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          members: JSON.stringify(validMembers),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          bandName: '',
          genre: '',
          city: '',
          formationYear: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          bio: '',
          youtubeLink: '',
          spotifyLink: '',
          bandcampLink: '',
          facebookLink: '',
          instagramLink: '',
          otherLink: '',
          photoUrl: '',
          demoUrl: '',
          motivation: '',
        });
        setMembers([{ name: '', instrument: '' }]);
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        setErrorMessage(error.error || 'Une erreur est survenue.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Erreur de connexion. Réessaie plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-red)]/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[var(--accent-red)] uppercase tracking-widest mb-4">
              Concours musical
            </p>
            <h1 className="font-display text-6xl md:text-8xl tracking-tight text-[var(--foreground)]">
              TREMPLIN 2026
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] mt-6 max-w-2xl mx-auto">
              Tu fais partie d&apos;un groupe amateur qui cherche sa première scène ?
              On veut t&apos;aider à te lancer ! Gagne ta place sur la scène du Barb&apos;n&apos;Rock Festival.
            </p>
            <p className="text-sm text-[var(--accent-red)] mt-3">
              Priorité aux groupes de l&apos;Oise et environs 🎯
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-[var(--accent-red)]/20 border border-[var(--accent-red)]/50 px-6 py-3 rounded-lg">
                <span className="text-[var(--accent-red)] font-bold">📅 4 avril 2026</span>
              </div>
              <div className="bg-[var(--muted)]/50 border border-[var(--border)] px-6 py-3 rounded-lg">
                <span className="text-[var(--foreground)]">📍 Crèvecœur-le-Grand</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Les dates clés">
            Calendrier
          </SectionTitle>

          <div className="mt-12 space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.date}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-[var(--accent-red)] font-bold text-sm">
                    {item.date}
                  </span>
                </div>
                <div className="w-4 h-4 rounded-full bg-[var(--accent-red)] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle subtitle="Ce que vous pouvez gagner">
            Les Prix
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full ${prize.highlight ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/5' : ''}`}>
                  <div className="text-center mb-4">
                    <span className="text-5xl">{prize.position}</span>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mt-2">
                      {prize.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {prize.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--muted-foreground)]">
                        <span className="text-[var(--accent-red)]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-16 px-4 bg-[var(--muted)]/20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-6 text-center">
              📋 Conditions de participation
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--muted-foreground)]">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[var(--accent-red)]">✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-4" id="inscription">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Inscris ton groupe">
            🎸 Formulaire d&apos;inscription
          </SectionTitle>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="mt-12 space-y-8"
          >
            {/* Infos du groupe */}
            <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                🎵 Informations du groupe
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Nom du groupe *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bandName}
                    onChange={(e) => setFormData({ ...formData, bandName: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Catégorie / Jour de passage *
                  </label>
                  <select
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  >
                    <option value="">Sélectionner...</option>
                    {genres.map((genre) => (
                      <option key={genre.value} value={genre.value}>{genre.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Ville / Région *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Beauvais (60)"
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Année de formation
                  </label>
                  <input
                    type="number"
                    min="1950"
                    max="2026"
                    value={formData.formationYear}
                    onChange={(e) => setFormData({ ...formData, formationYear: e.target.value })}
                    placeholder="Ex: 2020"
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Membres du groupe */}
            <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                👥 Membres du groupe *
              </h3>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Nom / Pseudo"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Instrument"
                      value={member.instrument}
                      onChange={(e) => handleMemberChange(index, 'instrument', e.target.value)}
                      className="flex-1 px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMember}
                className="mt-4 px-4 py-2 border border-dashed border-[var(--border)] rounded-lg text-[var(--muted-foreground)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors"
              >
                + Ajouter un membre
              </button>
            </div>

            {/* Contact */}
            <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                📞 Contact principal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full md:w-1/2 px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Biographie du groupe *
              </label>
              <textarea
                required
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Présentez votre groupe, votre histoire, vos influences..."
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Liens */}
            <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                🔗 Liens vers votre musique
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Au moins un lien est obligatoire pour que nous puissions écouter votre musique.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    🎬 YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    🎧 Spotify
                  </label>
                  <input
                    type="url"
                    value={formData.spotifyLink}
                    onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
                    placeholder="https://open.spotify.com/..."
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    💿 Bandcamp
                  </label>
                  <input
                    type="url"
                    value={formData.bandcampLink}
                    onChange={(e) => setFormData({ ...formData, bandcampLink: e.target.value })}
                    placeholder="https://votregroupe.bandcamp.com"
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    🔗 Autre lien
                  </label>
                  <input
                    type="url"
                    value={formData.otherLink}
                    onChange={(e) => setFormData({ ...formData, otherLink: e.target.value })}
                    placeholder="SoundCloud, Deezer, site web..."
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    📘 Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.facebookLink}
                    onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    📷 Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagramLink}
                    onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Photo & Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  📸 Photo du groupe
                </label>
                <div className="flex items-center gap-4">
                  {formData.photoUrl ? (
                    <div className="relative">
                      <Image
                        src={formData.photoUrl}
                        alt="Photo du groupe"
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[var(--accent-red)]"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-[var(--muted)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
                      <span className="text-2xl text-[var(--muted-foreground)]">📷</span>
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading === 'photo'}
                      className="px-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:border-[var(--accent-red)] transition-colors disabled:opacity-50"
                    >
                      {isUploading === 'photo' ? '⏳ Upload...' : 'Ajouter'}
                    </button>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      JPG, PNG, GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  🎵 Fichier démo (optionnel)
                </label>
                <div className="flex items-center gap-4">
                  {formData.demoUrl ? (
                    <div className="flex items-center gap-2 bg-[var(--accent-red)]/20 border border-[var(--accent-red)] px-4 py-2 rounded-lg">
                      <span>🎵</span>
                      <span className="text-sm text-[var(--foreground)]">Fichier uploadé</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, demoUrl: '' })}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={demoInputRef}
                        type="file"
                        accept="audio/mpeg,audio/wav,audio/mp3,audio/ogg,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'demo')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => demoInputRef.current?.click()}
                        disabled={isUploading === 'demo'}
                        className="px-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:border-[var(--accent-red)] transition-colors disabled:opacity-50"
                      >
                        {isUploading === 'demo' ? '⏳ Upload...' : 'Ajouter un fichier'}
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  MP3, WAV ou PDF (press kit). Max 20MB.
                </p>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                💬 Pourquoi participer au tremplin ?
              </label>
              <textarea
                rows={3}
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Qu'est-ce qui vous motive à participer ?"
                className="w-full px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:border-[var(--accent-red)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center"
              >
                ✅ Inscription reçue ! Nous vous recontacterons prochainement.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-center"
              >
                ❌ {errorMessage || 'Une erreur est survenue. Réessaie ou contacte-nous par email.'}
              </motion.div>
            )}

            {/* Submit */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isUploading !== null}
              >
                {isSubmitting ? '⏳ Envoi en cours...' : '🎸 Inscrire mon groupe'}
              </Button>
            </div>
          </motion.form>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-8">
            Questions ? Écris-nous à{' '}
            <a href="mailto:barbnrock.festival@gmail.com" className="text-[var(--accent-red)] hover:underline">
              barbnrock.festival@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
