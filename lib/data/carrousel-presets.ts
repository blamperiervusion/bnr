/**
 * Données pour les carrousels artistes
 * Utilisé par le générateur de carrousels dans l'admin
 */

export interface CarrouselArtistData {
  id: string;
  name: string;
  emoji: string;
  day: string;
  dayDisplay: string;
  dayPrice: string;
  image: string;
  bio: string;
  city: string;
  genre: string;
  since: string;
  albums: string[];
  ytLink: string;
  tip: string;
  reasons: string[];
  quote: string;
}

export const carrouselArtistsData: CarrouselArtistData[] = [
  // ============ VENDREDI 26 JUIN ============
  {
    id: 'psykup',
    name: 'PSYKUP',
    emoji: '🎤',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    dayPrice: '13€',
    image: 'psykup.jpg',
    bio: "30 ans de carrière et toujours aussi déjantés. Psykup mixe hardcore, jazz, death metal et funk dans un shaker décomplexé.",
    city: 'Toulouse',
    genre: 'AutrucheCore',
    since: 'Depuis 1994',
    albums: ['"The Joke Of Tomorrow"', '"Acousticophobia"', '"We Love You All"'],
    ytLink: '🎥 "Psykup - The Joke Of Tomorrow"',
    tip: 'Monte le son. Fort.',
    reasons: [
      '30 ans de scène = show rodé',
      'Énergie contagieuse',
      'Groupe le plus imprévisible',
      'Tu sais jamais ce qui va se passer',
    ],
    quote: '"Le live, tu l\'oublies pas."',
  },
  {
    id: 'cachemire',
    name: 'CACHEMIRE',
    emoji: '🎸',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    dayPrice: '13€',
    image: 'cachemire.jpg',
    bio: "Rock'n'roll français survitaminé venu de Nantes. 10 ans à secouer la scène française avec des guitares corrosives et des textes caustiques.",
    city: 'Nantes',
    genre: "Rock'n'roll français",
    since: 'Depuis 10 ans',
    albums: ['"Que dalle" (2024)', '"Les vivants"', '"Cachemire" (EP)'],
    ytLink: '🎥 YouTube : "Cachemire - Que dalle"',
    tip: 'Le rock français a trouvé sa relève.',
    reasons: [
      'Énergie punk + mélodies rock',
      'Textes en français qui claquent',
      '10 ans de rock français incisif',
      'Le nouveau souffle du rock hexagonal',
    ],
    quote: '"Cachemire, c\'est le rock français qu\'on attendait."',
  },
  {
    id: 'kami-no-ikari',
    name: 'KAMI NO IKARI',
    emoji: '⚔️',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    dayPrice: '13€',
    image: 'kami-no-ikari.jpg',
    bio: "Deathcore mélodique parisien fortement influencé par la culture japonaise. La colère des dieux en musique.",
    city: 'Paris',
    genre: 'Deathcore mélodique',
    since: 'Fondé en 2020',
    albums: ['"Kami no Ikari" (EP)', 'Singles récents'],
    ytLink: '🎥 YouTube : "Kami No Ikari"',
    tip: 'Prépare-toi au wall of death.',
    reasons: [
      'Esthétique japonaise unique',
      'Deathcore technique et mélodique',
      'La colère des dieux en live',
      'Nouveauté qui déchire',
    ],
    quote: '"Kami No Ikari, ça arrache."',
  },
  {
    id: 'barabbas',
    name: 'BARABBAS',
    emoji: '⛪',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    dayPrice: '13€',
    image: 'barabbas.jpg',
    bio: "Apôtre d'un doom chanté en français, Barabbas prodigue réconfort moral et acouphènes irréversibles.",
    city: 'France',
    genre: 'Doom en français',
    since: "L'Église Sonique",
    albums: ['Discographie doom', 'Le Saint Riff Rédempteur'],
    ytLink: '🎥 YouTube : "Barabbas"',
    tip: "L'Église du Riff t'attend.",
    reasons: [
      'Doom en français unique',
      'Textes poétiques et lourds',
      'Son énorme et hypnotique',
      'Expérience quasi-religieuse',
    ],
    quote: '"Barabbas, c\'est une messe en 220V."',
  },
  {
    id: 'black-hazard',
    name: 'BLACK HAZARD',
    emoji: '🔊',
    day: 'vendredi',
    dayDisplay: 'VENDREDI 26 JUIN',
    dayPrice: '13€',
    image: 'black-hazard.jpg',
    bio: "Heavy rock stoner des Hauts-de-France. Riffs lourds et incisifs, groove ravageur.",
    city: 'Cambrésis (Hauts-de-France)',
    genre: 'Heavy Rock Stoner',
    since: 'Révélation locale',
    albums: ['EP "Black Hazard"', 'Singles'],
    ytLink: '🎥 YouTube : "Black Hazard"',
    tip: 'Le stoner des Hauts-de-France.',
    reasons: [
      'Riffs lourds et groovy',
      'Stoner made in France',
      'Énergie brute garantie',
      'Groupe régional qui monte',
    ],
    quote: '"Black Hazard, ça groove sévère."',
  },

  // ============ SAMEDI 27 JUIN ============
  {
    id: 'shaarghot',
    name: 'SHAÂRGHOT',
    emoji: '🤖',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'shaarghot.jpg',
    bio: "Cyber metal parisien. Mi-homme, mi-machine, Shaârghot fusionne metal industriel, électro et visuels cyberpunk dans un show total.",
    city: 'Paris',
    genre: 'Cyber Metal',
    since: 'Projet unique',
    albums: ['"Protocol X"', '"Toxicum"', '"S.E.C.T"'],
    ytLink: '🎥 YouTube : "Shaârghot - Born To Burn"',
    tip: 'Un concert = une expérience visuelle totale.',
    reasons: [
      'Show visuel cyberpunk unique',
      'Fusion metal/électro dévastatrice',
      'Costumes et mise en scène hallucinants',
      'Rien de comparable sur scène',
    ],
    quote: '"Shaârghot, c\'est pas un concert, c\'est un film."',
  },
  {
    id: 'loudblast',
    name: 'LOUDBLAST',
    emoji: '💀',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'loudblast.jpg',
    bio: "Légende du death metal français depuis 1985. 40 ans de brutalité sonore et toujours au sommet. Loudblast, c'est l'histoire du metal extrême en France.",
    city: 'Lille',
    genre: 'Death Metal',
    since: 'Depuis 1985',
    albums: ['"Altering Fates And Destinies" (2021)', '"Burial Ground"', '"Disincarnate"'],
    ytLink: '🎥 YouTube : "Loudblast - Licensed to Thrash"',
    tip: 'Les pères fondateurs du death metal français.',
    reasons: [
      '40 ans de carrière légendaire',
      'Pionniers du death metal français',
      'Puissance sonore intacte',
      "Un morceau d'histoire du metal",
    ],
    quote: '"Loudblast, c\'est le respect."',
  },
  {
    id: 'akiavel',
    name: 'AKIAVEL',
    emoji: '⚔️',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'akiavel.jpg',
    bio: "Death metal moderne au féminin. Akiavel frappe fort avec une brutalité chirurgicale et une présence scénique explosive.",
    city: 'Sud-Est',
    genre: 'Death Metal Moderne',
    since: 'En pleine ascension',
    albums: ['"V" (2024)', '"Blacklist"', '"Hatred Anthem"'],
    ytLink: '🎥 YouTube : "Akiavel - Machiavel"',
    tip: 'La relève du death metal français.',
    reasons: [
      'Puissance et technique au sommet',
      'Frontwoman charismatique',
      'Death metal moderne et efficace',
      'Tournée européenne confirmée',
    ],
    quote: '"Akiavel, ça défonce."',
  },
  {
    id: 'krav-boca',
    name: 'KRAV BOCA',
    emoji: '🎻',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'krav-boca.jpg',
    bio: "Punk, rap et mandoline. Krav Boca mixe les genres avec une énergie contagieuse et des textes engagés qui font mouche.",
    city: 'France',
    genre: 'Punk Rap Mandoline',
    since: '500+ concerts',
    albums: ['EP "Krav Boca"', 'Singles récents'],
    ytLink: '🎥 YouTube : Krav Boca live',
    tip: 'Impossible à catégoriser, impossible à oublier.',
    reasons: [
      'Mélange unique punk/rap/folk',
      'Énergie scénique dingue',
      'Textes engagés et percutants',
      "Le groupe qu'on n'attend pas",
    ],
    quote: '"Krav Boca, tu connais pas mais tu vas kiffer."',
  },
  {
    id: 'dirty-fonzy',
    name: 'DIRTY FONZY',
    emoji: '🍺',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'dirty-fonzy.jpg',
    bio: "Punk rock festif depuis plus de 20 ans. Dirty Fonzy, c'est la garantie d'un bon moment, bière en main et pogo assuré.",
    city: 'Albi',
    genre: 'Punk Rock Mélodique',
    since: 'Depuis 20+ ans',
    albums: ['Discographie punk rock', 'Nombreux lives'],
    ytLink: '🎥 YouTube : Dirty Fonzy live',
    tip: 'La bande-son parfaite pour une bière entre potes.',
    reasons: [
      '20 ans de punk rock festif',
      'Ambiance garantie',
      'Classiques qui font pogotter',
      "Le groupe qu'on revoit toujours avec plaisir",
    ],
    quote: '"Dirty Fonzy = bonne ambiance garantie."',
  },
  {
    id: 'breakout',
    name: 'BREAKOUT',
    emoji: '🔥',
    day: 'samedi',
    dayDisplay: 'SAMEDI 27 JUIN',
    dayPrice: '22€',
    image: 'breakout.jpg',
    bio: "Fer de lance européen du punk depuis 2009. Reconnaissance internationale et tournées mondiales.",
    city: 'Paris',
    genre: 'Punk',
    since: 'Depuis 2009',
    albums: ['Discographie punk', 'Lives internationaux'],
    ytLink: '🎥 YouTube : Breakout live',
    tip: 'Le punk parisien qui a conquis le monde.',
    reasons: [
      'Punk parisien international',
      'Énergie brute du punk',
      'Tournées mondiales',
      'Live explosif',
    ],
    quote: '"Breakout, c\'est le punk pur et dur."',
  },

  // ============ DIMANCHE 28 JUIN ============
  {
    id: 'mainkind',
    name: 'MAINKIND',
    emoji: '🎸',
    day: 'dimanche',
    dayDisplay: 'DIMANCHE 28 JUIN',
    dayPrice: '5€',
    image: 'mainkind.jpg',
    bio: "Rock/Hard-rock aux influences années 70/80. Poison, Ratt, Guns N' Roses. Good vibes garanties.",
    city: 'France',
    genre: 'Rock/Hard-Rock',
    since: 'Nouvelle génération',
    albums: ['Album récent', 'EP'],
    ytLink: '🎥 YouTube : Mainkind',
    tip: 'Le rock accessible qui reste heavy.',
    reasons: [
      'Gros son moderne',
      'Mélodies accrocheuses',
      'Perfect pour découvrir le metal',
      'Dimanche en douceur (mais pas trop)',
    ],
    quote: '"Mainkind, c\'est le bon compromis."',
  },
];

// Helper pour récupérer un artiste par ID
export function getCarrouselArtistById(id: string): CarrouselArtistData | undefined {
  return carrouselArtistsData.find((a) => a.id === id);
}

// Helper pour récupérer les artistes par jour
export function getCarrouselArtistsByDay(day: string): CarrouselArtistData[] {
  return carrouselArtistsData.filter((a) => a.day === day);
}
