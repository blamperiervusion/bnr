export interface Band {
  id: string;
  name: string;
  order: number;
  time?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    spotify?: string;
  };
}

export interface DayProgramme {
  day: string;
  date: string;
  slug: string;
  openingTime: string;
  bands: Band[];
}

export const programme: DayProgramme[] = [
  {
    day: 'Vendredi',
    date: '26 Juin 2026',
    slug: 'vendredi',
    openingTime: '18h00',
    bands: [
      {
        id: 'ven-1',
        name: 'Cachemire',
        order: 1,
        description: 'Cachemire est un groupe de rock français qui, depuis 10 ans, secoue la scène avec un son puissant fait de guitares corrosives, de batteries claquées et de textes caustiques. Leur « fibre cachemirienne » mêle énergie brute et sueur, avec une musique taillée pour faire taper la tête et les talons. Après 4 albums et de nombreux shows, le groupe refuse les zones de confort et continue de réveiller le public.',
        imageUrl: '/images/bands/cachemire.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=PjQw3HI2LJo',
      },
      {
        id: 'ven-2',
        name: 'Psykup',
        order: 2,
        description: 'Psykup célèbre ses 30 ans d\'existence en 2025. Figure mythique du paysage alternatif avec 5 albums, un EP acoustique et deux DVD Live. Hors-modes, hors-normes, la formation dégomme les clichés avec humour, faisant se réunir Primus et Pantera, Strapping Young Lad et Alice In Chains. Machine de guerre live ayant assailli le Hellfest, les Eurockéennes et le Download Festival.',
        imageUrl: '/images/bands/psykup.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=Kd5-RQaMp2g',
        socialLinks: {
          website: 'https://www.psykup.net/',
          facebook: 'https://www.facebook.com/psykup',
          instagram: 'https://www.instagram.com/psykupmusic/',
          spotify: 'https://open.spotify.com/artist/2Z1p4Xmc2Mne50blMUd4cH',
        },
      },
      {
        id: 'ven-3',
        name: 'Kami No Ikari',
        order: 3,
        description: 'Groupe français de deathcore mélodique fondé en 2020, basé à Paris. L\'univers de Kami no Ikari (« La colère des dieux ») est fortement influencé par la culture japonaise : esthétique, utilisation du koto et paroles. Leur point de vue est celui d\'un être divin démoniaque observant les humains pour juger leurs péchés, puis déchaîner sa colère sur eux.',
        imageUrl: '/images/bands/kami-no-ikari.jpg',
      },
      {
        id: 'ven-4',
        name: 'Barabbas',
        order: 4,
        description: 'Quintette parisien de doom metal traditionnel fondé en 2007, Barabbas s\'inspire des classiques comme Cathedral, Witchfinder General et Saint Vitus. Avec leurs paroles en français et leur mythologie autour de "l\'Église du Saint Riff Rédempteur", ils délivrent un son lourd et hypnotique. Leur dernier album "La Mort Appelle Tous Les Vivants" (2023) confirme leur statut de référence du doom français.',
        imageUrl: '/images/bands/barabbas.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=6jTbEDdEtBU',
      },
      {
        id: 'ven-5',
        name: 'Black Hazard',
        order: 5,
        description: 'Quatuor de heavy stoner rock originaire du Cambrésis (Hauts-de-France), formé en 2021. Tom, Antoine, Ludo et Julien proposent des riffs lourds et incisifs accompagnés d\'une rythmique puissante et groovy. Leur premier album "Burning Paradise" (2023) confirme leur potentiel dans la scène stoner française.',
        imageUrl: '/images/bands/black-hazard.jpg',
      },
    ],
  },
  {
    day: 'Samedi',
    date: '27 Juin 2026',
    slug: 'samedi',
    openingTime: '13h00',
    bands: [
      {
        id: 'sam-1',
        name: 'Shaârghot',
        order: 1,
        description: 'SHAÂRGHOT nous provient tout droit d\'une dimension parallèle, cyber-punk et cauchemardesque. Armé de ses « Shadows » il ravage la scène dans une ambiance post apocalyptique délirante. Une des grandes révélations de la scène indus-electro/punk, la créature a fait ses armes auprès des pointures : Little Big, Punish Yourself, Hocico, Ministry, Les Tambours du Bronx, Front 242.',
        imageUrl: '/images/bands/shaarghot.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=6cDw0K1p9Ws',
        socialLinks: {
          facebook: 'https://www.facebook.com/shaarghot/',
          instagram: 'https://www.instagram.com/shaarghot/',
          spotify: 'https://open.spotify.com/artist/0wxpqCSmhtwnRXoWPoHAcj',
        },
      },
      {
        id: 'sam-2',
        name: 'Krav Boca',
        order: 2,
        description: '500 concerts et plus d\'une dizaine de tournées à l\'étranger ont donné naissance à un spectacle protéiforme, atypique et explosif. Un rituel punk prenant vie sous les mots de rappeurs masqués et d\'un trio guitare-batterie-mandoline, éclairé de performances pyrotechniques. Un live inclusif en forme de transe collective où les spectateurs deviennent acteurs. « Vivre libre ou mourir » !',
        imageUrl: '/images/bands/krav-boca.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=7iTo2zjZJmo',
        socialLinks: {
          website: 'https://kravboca.com/',
          facebook: 'https://www.facebook.com/kravboca',
          instagram: 'https://www.instagram.com/kravboca',
          spotify: 'https://open.spotify.com/artist/4xFUf1FHVy696Q1JQZMTRj',
        },
      },
      {
        id: 'sam-3',
        name: 'Loudblast',
        order: 3,
        description: 'LOUDBLAST est le pionnier du Death Metal en France et en Europe depuis 1985. 41 ans de carrière pour un groupe de metal extrême qui traverse toutes les évolutions musicales et du business, qui sonne toujours aussi fort, aussi bien. Il est plus féroce que jamais !',
        imageUrl: '/images/bands/loudblast.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=QkT9UyX1BYE',
        socialLinks: {
          website: 'https://loudblast-music.com/',
          facebook: 'https://www.facebook.com/Loudblast.official/',
          spotify: 'https://open.spotify.com/artist/1xK59OXxi2TReP0IGvm0K5',
        },
      },
      {
        id: 'sam-4',
        name: 'Akiavel',
        order: 4,
        description: 'Death metal moderne et sans compromis du Sud-Est de la France. Formé en 2018 et mené par la charismatique Auré, Akiavel combine brutalité, groove et mélodies sombres. Leur album "InVictus" (2025) confirme leur statut d\'incontournables de la scène française.',
        imageUrl: '/images/bands/akiavel.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=oKW9Tt7ZGCg',
        socialLinks: {
          website: 'https://www.akiavel.com/',
          facebook: 'https://www.facebook.com/Akiavel',
          instagram: 'https://www.instagram.com/akiavel/',
          spotify: 'https://open.spotify.com/artist/14M2CyExjuwWrJlJGYvg6T',
        },
      },
      {
        id: 'sam-5',
        name: 'Dirty Fonzy',
        order: 5,
        description: 'Groupe français de punk rock mélodique originaire d\'Albi, formé au début des années 2000. Porté par une énergie très punk et des influences comme The Clash, Rancid ou les Ramones, le groupe enchaîne albums et tournées. Leur dernier album "Full Speed Ahead" et le clip "Mindless Game" confirment leur statut de pilier du punk rock français.',
        imageUrl: '/images/bands/dirty-fonzy.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=H3a5cTeU_Ts',
      },
      {
        id: 'sam-6',
        name: 'Breakout',
        order: 6,
        description: 'Rock/metal énergique et engagé. Breakout délivre un son puissant et mélodique, parfait pour mettre le feu à la scène.',
        imageUrl: '/images/bands/breakout.jpg',
      },
      {
        id: 'sam-7',
        name: 'Vainqueur Tremplin',
        order: 7,
        description: 'Le groupe gagnant du tremplin Barb\'n\'Rock 2026 ! Découvert lors de notre soirée tremplin du 4 avril, ce groupe local a conquis le jury et le public.',
        imageUrl: '/images/bands/tremplin.jpg',
      },
    ],
  },
  {
    day: 'Dimanche',
    date: '28 Juin 2026',
    slug: 'dimanche',
    openingTime: '14h00',
    bands: [
      {
        id: 'dim-1',
        name: 'Howlite',
        order: 1,
        description: 'Rock alternatif et atmosphérique. Howlite propose un univers sonore planant et intense, parfait pour une journée de repos musical.',
        imageUrl: '/images/bands/howlite.jpg',
      },
      {
        id: 'dim-2',
        name: 'Udap',
        order: 2,
        description: 'Rock indépendant aux influences variées. Udap mélange les genres pour créer un son unique et accessible.',
        imageUrl: '/images/bands/udap.jpg',
      },
      {
        id: 'dim-3',
        name: 'Devon Duxe',
        order: 3,
        description: 'Rock/pop moderne et mélodique. Devon Duxe séduit par ses compositions accrocheuses et son énergie positive.',
        imageUrl: '/images/bands/devon-duxe.jpg',
      },
      {
        id: 'dim-4',
        name: 'Saint Rock Station',
        order: 4,
        description: 'Quintet rock d\'Amiens mené par la chanteuse Cindy, formée au Conservatoire. Avec François (batterie), Claire (guitare), Stéphane (basse) et Nico (guitare), le groupe propose un répertoire rock/hard-rock couvrant des années 70 aux 2000, transportant le public dans un univers 100% rock.',
        imageUrl: '/images/bands/saint-rock-station.jpg',
        socialLinks: {
          website: 'https://saintrockstation.fr/',
        },
      },
      {
        id: 'dim-5',
        name: 'Mainkind',
        order: 5,
        description: 'Tête d\'affiche du dimanche ! Groupe de hard rock formé en 2006 par Tony Treynel, reformé en 2016 avec une nouvelle équipe. S\'inspirant des classiques (Poison, Guns N\' Roses, Mötley Crüe, Alice Cooper), Mainkind délivre un hard rock authentique et fédérateur. Leur album "Fool\'s Game" (2024) sur M&O Music confirme leur potentiel explosif.',
        imageUrl: '/images/bands/mainkind.jpg',
      },
    ],
  },
];

export function getProgrammeByDay(slug: string): DayProgramme | undefined {
  return programme.find(day => day.slug === slug);
}
