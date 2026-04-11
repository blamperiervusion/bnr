import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const bands = [
  // VENDREDI
  {
    name: 'Cachemire',
    day: 'vendredi',
    order: 1,
    description: 'Cachemire est un groupe de rock français qui, depuis 10 ans, secoue la scène avec un son puissant fait de guitares corrosives, de batteries claquées et de textes caustiques. Leur « fibre cachemirienne » mêle énergie brute et sueur, avec une musique taillée pour faire taper la tête et les talons. Après 4 albums et de nombreux shows, le groupe refuse les zones de confort et continue de réveiller le public.',
    imageUrl: '/images/bands/cachemire.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=PjQw3HI2LJo',
    facebook: 'https://www.facebook.com/cachemiremusic/',
    isHeadliner: true,
  },
  {
    name: 'Psykup',
    day: 'vendredi',
    order: 2,
    description: "Psykup célèbre ses 30 ans d'existence en 2025. Figure mythique du paysage alternatif avec 5 albums, un EP acoustique et deux DVD Live. Hors-modes, hors-normes, la formation dégomme les clichés avec humour, faisant se réunir Primus et Pantera, Strapping Young Lad et Alice In Chains. Machine de guerre live ayant assailli le Hellfest, les Eurockéennes et le Download Festival.",
    imageUrl: '/images/bands/psykup.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Kd5-RQaMp2g',
    website: 'https://www.psykup.net/',
    facebook: 'https://www.facebook.com/psykup',
    instagram: 'https://www.instagram.com/psykupmusic/',
    spotify: 'https://open.spotify.com/artist/2Z1p4Xmc2Mne50blMUd4cH',
    isHeadliner: true,
  },
  {
    name: 'Kami No Ikari',
    day: 'vendredi',
    order: 3,
    description: "Groupe français de deathcore mélodique fondé en 2020, basé à Paris. L'univers de Kami no Ikari (« La colère des dieux ») est fortement influencé par la culture japonaise : esthétique, utilisation du koto et paroles. Leur point de vue est celui d'un être divin démoniaque observant les humains pour juger leurs péchés, puis déchaîner sa colère sur eux.",
    imageUrl: '/images/bands/kami-no-ikari.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=lNGYQ8-bDN8',
    website: 'https://www.kaminoikari.com/',
    facebook: 'https://www.facebook.com/kaminoikari.music',
    instagram: 'https://www.instagram.com/kaminoikari_music/',
    spotify: 'https://open.spotify.com/artist/50w6So1pU1erYm1J3cGxXY',
  },
  {
    name: 'Barabbas',
    day: 'vendredi',
    order: 4,
    description: "Apôtre d'un doom chanté en français, Barabbas prodigue réconfort moral, paix de l'esprit et acouphènes irréversibles aux brebis métalliques égarées qui poussent les portes de leur Église Sonique du Saint Riff Rédempteur.",
    imageUrl: '/images/bands/barabbas.jpg',
    facebook: 'https://www.facebook.com/BarabbasMusic/',
  },
  {
    name: 'Black Hazard',
    day: 'vendredi',
    order: 5,
    description: "Black Hazard est un groupe de heavy rock stoner originaire du Cambrésis dans les Hauts de France. Leur objectif est très clair : envoyer des riffs bien lourds et incisifs accompagnés d'une rythmique à la fois puissante et groovy.",
    imageUrl: '/images/bands/black-hazard.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=52OamIrdesU',
    facebook: 'https://www.facebook.com/BLACKHAZARDBAND/',
  },

  // SAMEDI
  {
    name: 'Shaârghot',
    day: 'samedi',
    order: 1,
    description: "SHAÂRGHOT nous provient tout droit d'une dimension parallèle, cyber-punk et cauchemardesque. Armé de ses « Shadows » il ravage la scène dans une ambiance post apocalyptique délirante. Une des grandes révélations de la scène indus-electro/punk, la créature a fait ses armes auprès des pointures : Little Big, Punish Yourself, Hocico, Ministry, Les Tambours du Bronx, Front 242.",
    imageUrl: '/images/bands/shaarghot.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=yn4X-OtYOx0',
    facebook: 'https://www.facebook.com/shaarghot/',
    instagram: 'https://www.instagram.com/shaarghot/',
    spotify: 'https://open.spotify.com/artist/0wxpqCSmhtwnRXoWPoHAcj',
    isHeadliner: true,
  },
  {
    name: 'Krav Boca',
    day: 'samedi',
    order: 2,
    description: "500 concerts et plus d'une dizaine de tournées à l'étranger ont donné naissance à un spectacle protéiforme, atypique et explosif. Un rituel punk prenant vie sous les mots de rappeurs masqués et d'un trio guitare-batterie-mandoline, éclairé de performances pyrotechniques. Un live inclusif en forme de transe collective où les spectateurs deviennent acteurs. « Vivre libre ou mourir » !",
    imageUrl: '/images/bands/krav-boca.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7iTo2zjZJmo',
    website: 'https://kravboca.com/',
    facebook: 'https://www.facebook.com/kravboca',
    instagram: 'https://www.instagram.com/kravboca',
    spotify: 'https://open.spotify.com/artist/4xFUf1FHVy696Q1JQZMTRj',
    isHeadliner: true,
  },
  {
    name: 'Loudblast',
    day: 'samedi',
    order: 3,
    description: "LOUDBLAST est le pionnier du Death Metal en France et en Europe depuis 1985. 41 ans de carrière pour un groupe de metal extrême qui traverse toutes les évolutions musicales et du business, qui sonne toujours aussi fort, aussi bien. Il est plus féroce que jamais !",
    imageUrl: '/images/bands/loudblast.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=uc6khaqWNV4',
    website: 'https://loudblast-music.com/',
    facebook: 'https://www.facebook.com/Loudblast.official/',
    spotify: 'https://open.spotify.com/artist/1xK59OXxi2TReP0IGvm0K5',
    isHeadliner: true,
  },
  {
    name: 'Akiavel',
    day: 'samedi',
    order: 4,
    description: "Akiavel est un groupe de Death Metal originaire du Sud-Est de la France. Formé en 2018, le groupe s'est rapidement imposé sur la scène Métal grâce à son mélange unique de Melodic Death Metal, Blackened Death Metal et Brutal Death Metal. Mené par une chanteuse au growl surpuissant et à la présence scénique époustouflante, Akiavel a su se créer une place unique dans le monde du métal grâce à son identité musicale et artistique forte. Le groupe se produit sur scène sans relâche depuis sa création, dans des festivals renommés tels que Hellfest et Motocultor Festival.",
    imageUrl: '/images/bands/akiavel.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=oKW9Tt7ZGCg',
    website: 'https://www.akiavel.com/',
    facebook: 'https://www.facebook.com/Akiavel',
    instagram: 'https://www.instagram.com/akiavel/',
    spotify: 'https://open.spotify.com/artist/14M2CyExjuwWrJlJGYvg6T',
  },
  {
    name: 'Dirty Fonzy',
    day: 'samedi',
    order: 5,
    description: 'Groupe français de punk rock mélodique originaire d\'Albi, formé au début des années 2000. Porté par une énergie très punk et des influences comme The Clash, Rancid ou les Ramones, le groupe enchaîne albums et tournées. Leur dernier album "Full Speed Ahead" et le clip "Mindless Game" confirment leur statut de pilier du punk rock français.',
    imageUrl: '/images/bands/dirty-fonzy.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=75ji6wfbVZw',
    website: 'https://linktr.ee/DirtyFonzy',
    facebook: 'https://www.facebook.com/dirtyfonzy/',
    instagram: 'https://www.instagram.com/dirty_fonzy/',
  },
  {
    name: 'Breakout',
    day: 'samedi',
    order: 6,
    description: "BREAKOUT est un groupe parisien formé fin 2009, qui compte parmi les fers de lance européens d'un punk fortement influencé par les scènes américaine et anglaise. Les concerts du groupe se distinguent par un punk rapide et agressif, sans jamais oublier d'y mêler de la mélodie et une bonne dose de chœurs pour faire chanter la fosse, le tout porté par une passion sans faille. BREAKOUT a acquis une reconnaissance internationale bien au-delà des frontières françaises, comme en témoignent ses nombreuses tournées à travers l'Europe et le reste du monde.",
    imageUrl: '/images/bands/breakout.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=0iPry24IYuE',
    facebook: 'https://www.facebook.com/breakoutpunx/',
    instagram: 'https://www.instagram.com/breakout_punk_band/',
  },
  {
    name: 'Tremplin Samedi',
    day: 'samedi',
    order: 7,
    description: "Le groupe gagnant du tremplin Barb'n'Rock 2026 pour le samedi ! Découvert lors de notre soirée tremplin du 4 avril, ce groupe local a conquis le jury et le public.",
    imageUrl: '/images/bands/tremplin.svg',
  },
  {
    name: 'To Be Announced',
    day: 'samedi',
    order: 8,
    description: "Un groupe supplémentaire sera bientôt annoncé pour compléter l'affiche du samedi. Stay tuned !",
    imageUrl: '/images/bands/tba.svg',
    isVisible: false,
  },

  // DIMANCHE
  {
    name: 'Mainkind',
    day: 'dimanche',
    order: 1,
    description: "Mainkind est un groupe rock/hard-rock aux multiples influences : Poison, Ratt, Guns N' Roses, Mötley Crüe, Alice Cooper... Ils s'inspirent notamment des australiens de The Dead Daisies. Leur mission : créer du bon vieux rock dans le style des années 70/80, rassembler des musiciens de talent et passer un bon moment à faire vivre le rock.",
    imageUrl: '/images/bands/mainkind.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=taKbs0ufooE',
    isHeadliner: true,
  },
  {
    name: 'Saint Rock Station',
    day: 'dimanche',
    order: 2,
    description: "Saint Rock Station est composé de deux guitaristes, d'un batteur, d'un bassiste et d'une chanteuse, et fait bouger les foules sur des reprises rock connues de tous. Le groupe mêle différentes générations qui se rassemblent autour d'une passion commune : la musique qui vibre fort. Dans leur répertoire, vous trouverez des classiques du rock et hard rock des années 70 à 2000. Ils sont « On Air » pour vous faire danser et bouger !",
    imageUrl: '/images/bands/saint-rock-station.jpeg',
    website: 'https://saintrockstation.fr/',
  },
  {
    name: 'Howlite',
    day: 'dimanche',
    order: 3,
    description: "Rock alternatif et atmosphérique. Howlite propose un univers sonore planant et intense, parfait pour une journée de repos musical.",
    imageUrl: '/images/bands/tba.svg',
  },
  {
    name: 'Udap',
    day: 'dimanche',
    order: 4,
    description: "Une Dernière Avant de Partir (UDAP) est un groupe de reprises rock/pop rock à l'énergie communicative. Sur scène, le groupe propose un set dynamique et entraînant, porté par un chanteur à la présence scénique affirmée. Habitué des formats multi-plateaux, UDAP s'adapte facilement aux configurations de concert et embarque le public dès les premiers titres.",
    imageUrl: '/images/bands/udap.jpeg',
  },
  {
    name: 'Devon Duxe',
    day: 'dimanche',
    order: 5,
    description: 'Devon Duxe démarre en 2023 après une dizaine d\'années à écumer les scènes. Leur premier album "JUST A SECOND" rencontre un réel succès auprès des radios US underground, suivi du second album "STONY ROAD". Après quatorze scènes en 2025, 2026 marque l\'enregistrement de leur troisième album. Devon Duxe a été qualifié de "groupe rock aux vibes modernes et à l\'énergie brute... un rock qui claque."',
    imageUrl: '/images/bands/devon-duxe.jpeg',
  },
  {
    name: 'Tremplin Dimanche',
    day: 'dimanche',
    order: 6,
    description: "Le groupe gagnant du tremplin Barb'n'Rock 2026 pour le dimanche ! Découvert lors de notre soirée tremplin du 4 avril, ce groupe local a conquis le jury et le public.",
    imageUrl: '/images/bands/tremplin.svg',
  },
];

async function main() {
  console.log('🎸 Migration des groupes...\n');

  for (const band of bands) {
    const slug = slugify(band.name);
    
    const existing = await prisma.band.findUnique({ where: { slug } });
    
    if (existing) {
      console.log(`⏭️  ${band.name} existe déjà, mise à jour...`);
      await prisma.band.update({
        where: { slug },
        data: {
          name: band.name,
          day: band.day,
          order: band.order,
          description: band.description,
          imageUrl: band.imageUrl,
          videoUrl: band.videoUrl,
          website: band.website,
          facebook: band.facebook,
          instagram: band.instagram,
          spotify: band.spotify,
          isHeadliner: band.isHeadliner ?? false,
          isVisible: band.isVisible ?? true,
        },
      });
    } else {
      console.log(`✅ Création de ${band.name}`);
      await prisma.band.create({
        data: {
          name: band.name,
          slug,
          day: band.day,
          order: band.order,
          description: band.description,
          imageUrl: band.imageUrl,
          videoUrl: band.videoUrl,
          website: band.website,
          facebook: band.facebook,
          instagram: band.instagram,
          spotify: band.spotify,
          isHeadliner: band.isHeadliner ?? false,
          isVisible: band.isVisible ?? true,
        },
      });
    }
  }

  console.log(`\n🎉 ${bands.length} groupes migrés avec succès !`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
