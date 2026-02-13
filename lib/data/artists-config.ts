/**
 * FICHIER DE CONFIGURATION CENTRALISÉ DES ARTISTES
 * ================================================
 * 
 * Ce fichier est la SOURCE UNIQUE DE VÉRITÉ pour toutes les infos artistes.
 * 
 * À METTRE À JOUR ICI quand on a de nouvelles infos :
 * - Liens YouTube
 * - Descriptions
 * - Réseaux sociaux
 * - Jour de passage
 * 
 * Utilisé par :
 * - lib/data/programme.ts (site web)
 * - communication/templates/*.html (générateurs de posts)
 */

export interface ArtistConfig {
  id: string;
  name: string;
  displayName: string; // Pour l'affichage (peut contenir des accents spéciaux)
  genre: string;
  origin: string; // Ville/région
  day: 'vendredi' | 'samedi' | 'dimanche';
  dayDisplay: string; // "VENDREDI 26 JUIN"
  description: string;
  shortDescription: string; // Version courte pour les posts
  youtubeVideoId: string | null; // ID de la vidéo YouTube (ex: "yn4X-OtYOx0")
  youtubeStartTime: number; // Début de la vidéo en secondes
  imageFile: string; // Nom du fichier image (ex: "shaarghot.jpg")
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
  isHeadliner: boolean;
  isTremplin: boolean;
  isTBA: boolean; // To Be Announced
}

export const artistsConfig: ArtistConfig[] = [
  // ============ VENDREDI 26 JUIN ============
  {
    id: 'psykup',
    name: 'Psykup',
    displayName: 'PSYKUP',
    genre: 'AutrucheCore',
    origin: 'Toulouse',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    description: 'Psykup célèbre ses 30 ans d\'existence en 2025. Figure mythique du paysage alternatif avec 5 albums, un EP acoustique et deux DVD Live.',
    shortDescription: '30 ans de carrière. Machine de guerre live. Hellfest, Eurockéennes, Download.',
    youtubeVideoId: 'sLZQSPiuTfg',
    youtubeStartTime: 30,
    imageFile: 'psykup.jpg',
    socialLinks: {
      website: 'https://www.psykup.net/',
      facebook: 'https://www.facebook.com/psykup',
      instagram: 'https://www.instagram.com/psykupmusic/',
      spotify: 'https://open.spotify.com/artist/2Z1p4Xmc2Mne50blMUd4cH',
    },
    isHeadliner: true,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'cachemire',
    name: 'Cachemire',
    displayName: 'CACHEMIRE',
    genre: "Rock'n'Roll",
    origin: 'Nantes',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    description: 'Cachemire est un groupe de rock français qui, depuis 10 ans, secoue la scène avec un son puissant fait de guitares corrosives.',
    shortDescription: '10 ans de rock français. Guitares corrosives, textes caustiques.',
    youtubeVideoId: 'oXr2HJpIVJU',
    youtubeStartTime: 10,
    imageFile: 'cachemire.jpg',
    socialLinks: {
      facebook: 'https://www.facebook.com/cachemiremusic/',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'kami-no-ikari',
    name: 'Kami No Ikari',
    displayName: 'KAMI NO IKARI',
    genre: 'Deathcore mélodique',
    origin: 'Paris',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    description: 'Groupe français de deathcore mélodique fondé en 2020, fortement influencé par la culture japonaise.',
    shortDescription: 'Deathcore mélodique. Esthétique japonaise. La colère des dieux.',
    youtubeVideoId: 'lNGYQ8-bDN8',
    youtubeStartTime: 0,
    imageFile: 'kami-no-ikari.jpg',
    socialLinks: {
      website: 'https://www.kaminoikari.com/',
      facebook: 'https://www.facebook.com/kaminoikari.music',
      instagram: 'https://www.instagram.com/kaminoikari_music/',
      spotify: 'https://open.spotify.com/artist/50w6So1pU1erYm1J3cGxXY',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'barabbas',
    name: 'Barabbas',
    displayName: 'BARABBAS',
    genre: 'Doom français',
    origin: 'France',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    description: 'Apôtre d\'un doom chanté en français, Barabbas prodigue réconfort moral et acouphènes irréversibles.',
    shortDescription: 'Doom en français. L\'Église Sonique du Saint Riff Rédempteur.',
    youtubeVideoId: null,
    youtubeStartTime: 0,
    imageFile: 'barabbas.jpg',
    socialLinks: {
      facebook: 'https://www.facebook.com/BarabbasMusic/',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'black-hazard',
    name: 'Black Hazard',
    displayName: 'BLACK HAZARD',
    genre: 'Heavy Rock Stoner',
    origin: 'Cambrésis (Hauts-de-France)',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    description: 'Black Hazard est un groupe de heavy rock stoner originaire du Cambrésis. Riffs lourds et incisifs.',
    shortDescription: 'Heavy rock stoner des Hauts-de-France. Riffs lourds et groovy.',
    youtubeVideoId: '52OamIrdesU',
    youtubeStartTime: 0,
    imageFile: 'black-hazard.jpg',
    socialLinks: {
      facebook: 'https://www.facebook.com/BLACKHAZARDBAND/',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },

  // ============ SAMEDI 27 JUIN ============
  {
    id: 'shaarghot',
    name: 'Shaârghot',
    displayName: 'SHAÂRGHOT',
    genre: 'Cyber Metal',
    origin: 'Paris',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: 'SHAÂRGHOT nous provient tout droit d\'une dimension parallèle, cyber-punk et cauchemardesque.',
    shortDescription: 'Cyber metal parisien. Show visuel hallucinant. Mi-homme, mi-machine.',
    youtubeVideoId: 'yn4X-OtYOx0',
    youtubeStartTime: 20,
    imageFile: 'shaarghot.jpg',
    socialLinks: {
      facebook: 'https://www.facebook.com/shaarghot/',
      instagram: 'https://www.instagram.com/shaarghot/',
      spotify: 'https://open.spotify.com/artist/0wxpqCSmhtwnRXoWPoHAcj',
    },
    isHeadliner: true,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'loudblast',
    name: 'Loudblast',
    displayName: 'LOUDBLAST',
    genre: 'Death Metal',
    origin: 'Lille',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: 'LOUDBLAST est le pionnier du Death Metal en France et en Europe depuis 1985. 41 ans de carrière.',
    shortDescription: 'Pionnier du Death Metal français depuis 1985. Légende vivante.',
    youtubeVideoId: 'uc6khaqWNV4',
    youtubeStartTime: 15,
    imageFile: 'loudblast.jpg',
    socialLinks: {
      website: 'https://loudblast-music.com/',
      facebook: 'https://www.facebook.com/Loudblast.official/',
      spotify: 'https://open.spotify.com/artist/1xK59OXxi2TReP0IGvm0K5',
    },
    isHeadliner: true,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'akiavel',
    name: 'Akiavel',
    displayName: 'AKIAVEL',
    genre: 'Death Metal Moderne',
    origin: 'Sud-Est',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: 'Akiavel est un groupe de Death Metal originaire du Sud-Est. Chanteuse au growl surpuissant.',
    shortDescription: 'Death Metal moderne. Chanteuse au growl surpuissant. Hellfest, Motocultor.',
    youtubeVideoId: 'nqZ_b2Rk8pE',
    youtubeStartTime: 0,
    imageFile: 'akiavel.jpg',
    socialLinks: {
      website: 'https://www.akiavel.com/',
      facebook: 'https://www.facebook.com/Akiavel',
      instagram: 'https://www.instagram.com/akiavel/',
      spotify: 'https://open.spotify.com/artist/14M2CyExjuwWrJlJGYvg6T',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'krav-boca',
    name: 'Krav Boca',
    displayName: 'KRAV BOCA',
    genre: 'Punk Rap Mandoline',
    origin: 'France',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: '500 concerts et plus d\'une dizaine de tournées. Spectacle protéiforme, atypique et explosif.',
    shortDescription: 'Punk + Rap + Mandoline + Pyrotechnie. Live explosif et inclusif.',
    youtubeVideoId: null,
    youtubeStartTime: 0,
    imageFile: 'krav-boca.jpg',
    socialLinks: {
      website: 'https://kravboca.com/',
      facebook: 'https://www.facebook.com/kravboca',
      instagram: 'https://www.instagram.com/kravboca',
      spotify: 'https://open.spotify.com/artist/4xFUf1FHVy696Q1JQZMTRj',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'dirty-fonzy',
    name: 'Dirty Fonzy',
    displayName: 'DIRTY FONZY',
    genre: 'Punk Rock Mélodique',
    origin: 'Albi',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: 'Groupe français de punk rock mélodique. Influences : The Clash, Rancid, Ramones.',
    shortDescription: 'Punk rock mélodique d\'Albi. Pilier du punk rock français.',
    youtubeVideoId: null,
    youtubeStartTime: 0,
    imageFile: 'dirty-fonzy.jpg',
    socialLinks: {
      website: 'https://linktr.ee/DirtyFonzy',
      facebook: 'https://www.facebook.com/dirtyfonzy/',
      instagram: 'https://www.instagram.com/dirty_fonzy/',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },
  {
    id: 'breakout',
    name: 'Breakout',
    displayName: 'BREAKOUT',
    genre: 'Punk',
    origin: 'Paris',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    description: 'BREAKOUT est un groupe parisien formé fin 2009, fer de lance européen du punk.',
    shortDescription: 'Punk parisien. Reconnaissance internationale. Tournées mondiales.',
    youtubeVideoId: '0iPry24IYuE',
    youtubeStartTime: 0,
    imageFile: 'breakout.jpg',
    socialLinks: {
      facebook: 'https://www.facebook.com/breakoutpunx/',
      instagram: 'https://www.instagram.com/breakout_punk_band/',
    },
    isHeadliner: false,
    isTremplin: false,
    isTBA: false,
  },

  // ============ DIMANCHE 28 JUIN ============
  {
    id: 'mainkind',
    name: 'Mainkind',
    displayName: 'MAINKIND',
    genre: 'Rock/Hard-Rock',
    origin: 'France',
    day: 'dimanche',
    dayDisplay: 'DIMANCHE 28 JUIN',
    description: 'Mainkind est un groupe rock/hard-rock aux multiples influences : Poison, Ratt, Guns N\' Roses.',
    shortDescription: 'Rock/Hard-rock années 70/80. Good vibes garanties.',
    youtubeVideoId: null,
    youtubeStartTime: 0,
    imageFile: 'mainkind.jpg',
    socialLinks: {},
    isHeadliner: true,
    isTremplin: false,
    isTBA: false,
  },
];

// ============ HELPER FUNCTIONS ============

export function getArtistById(id: string): ArtistConfig | undefined {
  return artistsConfig.find(a => a.id === id);
}

export function getArtistsByDay(day: 'vendredi' | 'samedi' | 'dimanche'): ArtistConfig[] {
  return artistsConfig.filter(a => a.day === day && !a.isTBA && !a.isTremplin);
}

export function getHeadliners(): ArtistConfig[] {
  return artistsConfig.filter(a => a.isHeadliner);
}

export function getYoutubeUrl(artist: ArtistConfig): string | null {
  if (!artist.youtubeVideoId) return null;
  return `https://www.youtube.com/watch?v=${artist.youtubeVideoId}`;
}

export function getYoutubeEmbedUrl(artist: ArtistConfig): string | null {
  if (!artist.youtubeVideoId) return null;
  return `https://www.youtube.com/embed/${artist.youtubeVideoId}?start=${artist.youtubeStartTime}&autoplay=1&mute=1`;
}

// Export pour les templates de communication
export function getArtistsForTemplates() {
  return artistsConfig
    .filter(a => !a.isTBA && !a.isTremplin)
    .map(a => ({
      id: a.id,
      name: a.displayName,
      genre: `${a.genre} • ${a.origin}`,
      day: a.dayDisplay,
      youtube: a.youtubeVideoId,
      start: a.youtubeStartTime,
      image: `bands/${a.imageFile}`,
    }));
}
