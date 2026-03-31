export interface PostPreset {
  id: string;
  title: string;
  badge: string;
  badgeClass?: 'cyan' | 'gold' | 'orange';
  mainText: string;
  mainClass?: 'price' | 'countdown';
  subText: string;
  descText: string;
  bg: string;
  caption: string;
  footerDate?: string;
  footerButton?: string;
}

export interface PresetCategory {
  id: string;
  title: string;
  icon: string;
  posts: PostPreset[];
}

export const postPresets: PresetCategory[] = [
  {
    id: 'prix',
    title: 'Prix & Billetterie',
    icon: '💰',
    posts: [
      {
        id: 'prix-principal',
        title: 'Prix principal',
        badge: '💰 PRIX',
        mainText: '36€',
        mainClass: 'price',
        subText: 'Pass 3 jours',
        descText: 'Camping GRATUIT • 18 groupes',
        bg: '/images/hero-visual.jpg',
        caption: `36€. C'est tout.

Pass 3 jours complet.
18 groupes sur scène.
Camping GRATUIT inclus.

2 jours de chaos, 1 jour de repos.
26-28 Juin • Crèvecœur-le-Grand

🎫 Lien en bio`,
      },
      {
        id: 'prix-detail',
        title: 'Prix par jour',
        badge: 'TARIFS',
        mainText: '13€',
        mainClass: 'price',
        subText: 'Vendredi',
        descText: '22€ Samedi • 33€ Ven+Sam • 36€ Pass 3j',
        bg: '/images/hero-visual.jpg',
        caption: `Le détail qui tue 👇

🔥 Vendredi (Psykup + Cachemire + ...) : 13€
🔥 Samedi (Loudblast + Shaârghot + ...) : 22€
🔥 Les deux jours de chaos : 33€
🔥 Pass 3 jours complet : 36€

Oui, c'est vraiment ces prix-là.
Oui, le camping est gratuit.
Non, y'a pas d'arnaque.

26-28 Juin • Crèvecœur-le-Grand

🎫 Lien en bio`,
      },
      {
        id: 'very-early-epuise',
        title: 'Very Early Bird épuisés',
        badge: '🔥 SOLD OUT',
        badgeClass: 'cyan',
        mainText: 'VERY EARLY BIRD<br><span class="accent">ÉPUISÉS</span>',
        subText: 'Merci ! 🖤',
        descText: 'Les EARLY BIRD sont ouverts : 36€',
        bg: '/images/hero-visual.jpg',
        caption: `🔥 VERY EARLY BIRD ÉPUISÉS 🔥

Merci ! Vous avez été rapides 💀

Les EARLY BIRD sont ouverts :
• Pass 3 jours : 36€
• Samedi : 22€
• Vendredi : 13€
• Dimanche : 5€

🎫 Lien en bio`,
      },
    ],
  },
  {
    id: 'artistes',
    title: 'Annonces Artistes',
    icon: '🎤',
    posts: [
      {
        id: 'annonce-psykup',
        title: 'Annonce Psykup',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'PSYKUP',
        subText: 'AutrucheCore • Toulouse',
        descText: 'VENDREDI 26 JUIN',
        bg: '/images/bands/psykup.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

PSYKUP rejoint l'affiche !

📍 VENDREDI 26 JUIN

30 ans de carrière et toujours aussi déjantés. Un shaker musical décomplexé où hardcore, jazz, death metal, funk, thrash et pop explosent ensemble.

🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
      {
        id: 'annonce-loudblast',
        title: 'Annonce Loudblast',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'LOUDBLAST',
        subText: 'Death Metal • Lille • Depuis 1985',
        descText: 'SAMEDI 27 JUIN',
        bg: '/images/bands/loudblast.jpg',
        caption: `1985.

Loudblast inventait le death metal français.

40 ans plus tard, les légendes montent sur notre scène.

LOUDBLAST
📍 Samedi 27 Juin
🎫 22€ la journée / 36€ les 3 jours

Tu vas pas rater ça.

→ Lien en bio`,
      },
      {
        id: 'annonce-shaarghot',
        title: 'Annonce Shaârghot',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'SHAÂRGHOT',
        subText: 'Cyber Metal • Paris',
        descText: 'SAMEDI 27 JUIN',
        bg: '/images/bands/shaarghot.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

SHAÂRGHOT rejoint l'affiche !

📍 SAMEDI 27 JUIN

Mi-homme, mi-machine. Cyber metal parisien avec un show visuel hallucinant. Un concert = une expérience totale.

🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
      {
        id: 'annonce-cachemire',
        title: 'Annonce Cachemire',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'CACHEMIRE',
        subText: "Rock'n'Roll • Nantes",
        descText: 'VENDREDI 26 JUIN',
        bg: '/images/bands/cachemire.jpg',
        caption: `Révélés au Hellfest 2025.
Chez nous en 2026. 🔥

CACHEMIRE
Rock'n'roll français survitaminé.
Riffs qui tabassent, textes en français qui percutent.

📍 Vendredi 26 Juin
🎫 13€ la journée / 36€ les 3 jours

→ Lien en bio`,
      },
      {
        id: 'annonce-akiavel',
        title: 'Annonce Akiavel',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'AKIAVEL',
        subText: 'Death Metal Moderne • Sud-Est',
        descText: 'SAMEDI 27 JUIN',
        bg: '/images/bands/akiavel.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

AKIAVEL rejoint l'affiche !

📍 SAMEDI 27 JUIN

Death metal moderne au féminin. Brutalité chirurgicale et présence scénique explosive. La relève du death metal français.

🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
      {
        id: 'annonce-kravboca',
        title: 'Annonce Krav Boca',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'KRAV BOCA',
        subText: 'Punk Rap Mandoline',
        descText: 'SAMEDI 27 JUIN',
        bg: '/images/bands/krav-boca.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

KRAV BOCA rejoint l'affiche !

📍 SAMEDI 27 JUIN

Punk, rap et mandoline. Impossible à catégoriser, impossible à oublier. Énergie contagieuse et textes engagés.

🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
      {
        id: 'annonce-dirtyfonzy',
        title: 'Annonce Dirty Fonzy',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'DIRTY FONZY',
        subText: 'Punk Rock',
        descText: 'SAMEDI 27 JUIN',
        bg: '/images/bands/dirty-fonzy.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

DIRTY FONZY rejoint l'affiche !

📍 SAMEDI 27 JUIN

20 ans de punk rock festif. La garantie d'un bon moment, bière en main et pogo assuré.

🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
      {
        id: 'annonce-mainkind',
        title: 'Annonce Mainkind',
        badge: '🔥 NOUVEAU NOM',
        mainText: 'MAINKIND',
        subText: 'Metal Alternatif',
        descText: 'DIMANCHE 28 JUIN',
        bg: '/images/bands/mainkind.jpg',
        caption: `🔥 NOUVEAU NOM 🔥

MAINKIND rejoint l'affiche !

📍 DIMANCHE 28 JUIN

Metal alternatif moderne. Gros son, mélodies accrocheuses. Le dimanche en douceur (mais pas trop).

🎫 Pass dimanche : 5€
🎫 Pass 3 jours : 36€ (camping inclus)
→ Lien en bio`,
      },
    ],
  },
  {
    id: 'countdown',
    title: 'Countdown',
    icon: '⏱️',
    posts: [
      {
        id: 'countdown-j60',
        title: 'J-60',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-60',
        mainClass: 'countdown',
        subText: 'LE CHAOS APPROCHE',
        descText: '18 groupes • 36€ les 3 jours',
        bg: '/images/hero-visual.jpg',
        caption: `J-60 ⏱️

Dans 60 jours, le chaos commence.

18 GROUPES dont :
Psykup • Loudblast • Shaârghot • Akiavel • Cachemire • Krav Boca • Dirty Fonzy • Mainkind...

26-28 Juin • Crèvecœur-le-Grand
🎫 36€ les 3 jours

Le compte à rebours est lancé.
Et toi, t'as ta place ?

→ Lien en bio`,
      },
      {
        id: 'countdown-j30',
        title: 'J-30',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-30',
        mainClass: 'countdown',
        subText: "PLUS QU'UN MOIS",
        descText: 'Le meilleur week-end de ton été',
        bg: '/images/hero-visual.jpg',
        caption: `J-30 🔥

Plus qu'un mois.

Plus qu'un mois avant 2 jours de chaos et 1 jour de repos.
Plus qu'un mois avant 18 groupes sur scène.
Plus qu'un mois avant le meilleur week-end de ton été.

🎫 36€ les 3 jours • Camping gratuit

→ Lien en bio`,
      },
      {
        id: 'countdown-j15',
        title: 'J-15',
        badge: '⏱️ COUNTDOWN',
        badgeClass: 'cyan',
        mainText: 'J-15',
        mainClass: 'countdown',
        subText: 'DERNIÈRE LIGNE DROITE',
        descText: 'Prépare tes affaires 🎒',
        bg: '/images/hero-visual.jpg',
        caption: `J-15 🔥

Dernière ligne droite !

Dans 2 semaines, on y est.
T'as ton billet ? T'as ta tente ?

🎫 Dernières places : 36€ les 3 jours
🏕️ Camping gratuit

→ Lien en bio`,
      },
    ],
  },
  {
    id: 'urgence',
    title: 'Urgence',
    icon: '🚨',
    posts: [
      {
        id: 'urgence-places',
        title: 'Dernières places',
        badge: '🚨 ALERTE',
        mainText: 'DERNIÈRES<br><span class="accent">PLACES</span>',
        subText: '',
        descText: 'Les Early Bird partent vite',
        bg: '/images/hero-visual.jpg',
        caption: `⚠️ ALERTE ⚠️

Les Very Early Bird sont ÉPUISÉS.
Les Early Bird partent vite.

Pass 3 jours : 36€ → bientôt 42€
Vendredi : 13€ → bientôt 18€
Samedi : 22€ → bientôt 27€

Tu veux économiser ? C'est maintenant.

🎫 Lien en bio`,
      },
      {
        id: 'urgence-final',
        title: 'Billetterie ferme demain',
        badge: '🚨 FINAL',
        mainText: 'DERNIÈRES<br><span class="accent-orange">HEURES</span>',
        subText: 'Billetterie ferme demain soir',
        descText: 'Après = +5€ sur place',
        bg: '/images/hero-visual.jpg',
        caption: `🚨 DERNIÈRES PLACES 🚨

Billetterie ferme DEMAIN SOIR.

Après, faudra venir sur place.
Et ça sera 5€ de plus.

Pass 3 jours : 36€ (demain : 42€)
Pass Samedi : 22€ (demain : 27€)
Pass Vendredi : 13€ (demain : 18€)

C'est maintenant ou jamais.

🎫 Lien en bio`,
      },
    ],
  },
  {
    id: 'benevoles',
    title: 'Bénévoles',
    icon: '🙋',
    posts: [
      {
        id: 'benevoles-appel',
        title: 'Appel aux bénévoles',
        badge: '🙋 BÉNÉVOLES',
        badgeClass: 'cyan',
        mainText: 'REJOINS<br><span class="accent">L\'ÉQUIPE</span>',
        subText: '50+ bénévoles recherchés',
        descText: 'Bars • Accueil • Catering • Merchandising',
        bg: '/images/hero-visual.jpg',
        caption: `🙋 APPEL À BÉNÉVOLES 🙋

On recrute pour l'édition 2026 !

👉 50+ bénévoles recherchés

POSTES DISPONIBLES :
• Bars & restauration
• Accueil & billetterie
• Catering
• Merchandising
• Artistes & loges
• Cashless

EN ÉCHANGE :
• Pass 3 jours offert
• Repas inclus
• T-shirt exclusif
• Camping gratuit
• Ambiance de ouf

Inscris-toi sur barbnrock-festival.fr/benevoles

→ Lien en bio`,
      },
    ],
  },
  {
    id: 'tremplin',
    title: 'Tremplin 2026',
    icon: '🎸',
    posts: [
      {
        id: 'tremplin-lancement',
        title: 'Lancement Tremplin',
        badge: '🎸 TREMPLIN 2026',
        badgeClass: 'cyan',
        mainText: 'TREMPLIN<br><span class="accent">OUVERT</span>',
        subText: 'Inscriptions jusqu\'au 15 mars',
        descText: 'Ta première scène t\'attend',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'INSCRIS-TOI',
        caption: `🎸 TREMPLIN BARB'N'ROCK 2026 🎸

Ton groupe débute ? Tu cherches ta première scène ?
On est là pour te lancer ! 🚀

📅 4 AVRIL 2026
Soirée tremplin à Crèvecœur-le-Grand

🏆 À GAGNER :
• 1er prix : Concert au festival + couverture médiatique
• 2ème & 3ème prix : Entrées festival + merch

✅ CATÉGORIES :
• Samedi : Metal / Punk (compos)
• Dimanche : Rock / Reprises

📍 Priorité aux groupes de l'Oise et environs

⏰ Inscriptions ouvertes jusqu'au 15 mars

→ barbnrock-festival.fr/tremplin`,
      },
      {
        id: 'tremplin-rappel',
        title: 'Rappel Tremplin',
        badge: '⏰ RAPPEL',
        mainText: 'TREMPLIN<br><span class="accent">J-30</span>',
        subText: 'Plus que quelques jours pour s\'inscrire',
        descText: 'Ta première scène t\'attend',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'INSCRIS-TOI',
        caption: `⏰ RAPPEL TREMPLIN ⏰

Tu repousses depuis des semaines ?
C'est maintenant ou jamais !

TREMPLIN BARB'N'ROCK 2026
📅 4 avril • Crèvecœur-le-Grand

🎯 On cherche des groupes amateurs qui débutent
🎯 Priorité aux groupes de l'Oise

⏰ Inscriptions jusqu'au 15 mars
🏆 1er prix : Concert au festival !

C'est ton moment.

→ barbnrock-festival.fr/tremplin`,
      },
      {
        id: 'tremplin-dernieres-heures',
        title: 'Dernières heures',
        badge: '🚨 DERNIER JOUR',
        mainText: 'TREMPLIN<br><span class="accent-orange">DEADLINE</span>',
        subText: 'Inscriptions fermées ce soir minuit',
        descText: 'Dernière chance !',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'INSCRIS-TOI',
        caption: `🚨 DERNIER JOUR 🚨

Les inscriptions au tremplin ferment CE SOIR MINUIT !

Tu hésites encore ?
Rappelle-toi pourquoi t'as monté ton groupe.
Pour jouer. Sur scène. Devant du monde.

Ça commence ici.

TREMPLIN BARB'N'ROCK 2026
📅 4 avril • Crèvecœur-le-Grand
🏆 1er prix : Concert au festival !

Dernières heures pour t'inscrire.

→ barbnrock-festival.fr/tremplin`,
      },
      {
        id: 'tremplin-rdv-4-avril',
        title: 'RDV 4 avril - Concerts',
        badge: '📍 RDV LE 4 AVRIL',
        badgeClass: 'gold',
        mainText: 'JOURNÉE<br><span class="accent">TREMPLIN</span>',
        subText: '14h • Parking Leclerc',
        descText: 'Annonce des groupes très bientôt !',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'ENTRÉE GRATUITE',
        caption: `🎸 JOURNÉE TREMPLIN BARB'N'ROCK 2026

📅 4 avril 2026
⏰ 14h00
📍 Parking du Leclerc - Crèvecœur-le-Grand

L'annonce des groupes présélectionnés arrive très bientôt ! 🔥

Entrée gratuite pour le public 🤘
Venez nombreux soutenir la scène locale !

→ barbnrock-festival.fr/tremplin`,
      },
      {
        id: 'tremplin-preselection',
        title: 'Annonce présélectionnés',
        badge: '📣 ANNONCE',
        badgeClass: 'gold',
        mainText: '6 GROUPES<br><span class="accent">SÉLECTIONNÉS</span>',
        subText: 'RDV le 4 avril !',
        descText: 'Late Blossom • Sadraen • MRWL • Antenox • Adore • Rocklines',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'ENTRÉE GRATUITE',
        caption: `📣 TREMPLIN BARB'N'ROCK 2026 📣

Les 6 groupes sélectionnés sont...

🎸 LATE BLOSSOM
🎸 SADRAEN
🎸 MRWL
🎸 ANTENOX
🎸 ADORE
🎸 ROCKLINES

Merci à tous les groupes qui ont candidaté ! 🙏

📅 RDV le 4 avril
⏰ 14h00
📍 Parking du Leclerc - Crèvecœur-le-Grand

Entrée gratuite pour le public 🤘
Venez nombreux soutenir la scène locale !`,
      },
      {
        id: 'tremplin-soiree',
        title: 'Soirée Tremplin',
        badge: '🔥 CE SOIR',
        mainText: 'TREMPLIN<br><span class="accent">CE SOIR</span>',
        subText: 'Entrée gratuite • 19h',
        descText: '6 groupes • 1 gagnant • Le festival 🎯',
        bg: '/images/hero-visual.jpg',
        footerDate: '4 AVRIL 2026',
        footerButton: 'ENTRÉE GRATUITE',
        caption: `🔥 C'EST CE SOIR 🔥

SOIRÉE TREMPLIN BARB'N'ROCK 2026

📍 Crèvecœur-le-Grand
🕖 19h00
🎟️ ENTRÉE GRATUITE

6 groupes amateurs s'affrontent pour une place au festival !

🎸 Metal/Punk + Rock/Reprises
🏆 Le gagnant jouera au Barb'n'Rock 2026

Viens soutenir la scène locale ! 🤘`,
      },
    ],
  },
  {
    id: 'village',
    title: 'Village',
    icon: '🍺',
    posts: [
      {
        id: 'village-food',
        title: 'Food Trucks',
        badge: '🍔 FOOD',
        mainText: 'FOOD<br><span class="accent">TRUCKS</span>',
        subText: 'Burgers • Tacos • Veggie',
        descText: 'De quoi reprendre des forces entre les pogos',
        bg: '/images/hero-visual.jpg',
        caption: `🍔 FOOD TRUCKS 🍔

De quoi reprendre des forces entre les pogos !

• Burgers smashés
• Tacos gourmets
• Options végétariennes
• Et plus encore...

Le tout à prix festival raisonnables.

26-28 Juin • Crèvecœur-le-Grand
🎫 36€ les 3 jours

→ Lien en bio`,
      },
      {
        id: 'village-tattoo',
        title: 'Tatoueurs',
        badge: '🖋️ INK',
        mainText: 'FLASH<br><span class="accent">TATTOO</span>',
        subText: 'Tatoueurs sur place',
        descText: 'Repars avec un souvenir permanent',
        bg: '/images/hero-visual.jpg',
        caption: `🖋️ FLASH TATTOO 🖋️

Des tatoueurs seront présents tout le week-end !

Flash tattoo, designs exclusifs festival.
Repars avec un souvenir permanent.

26-28 Juin • Crèvecœur-le-Grand
🎫 36€ les 3 jours

→ Lien en bio`,
      },
    ],
  },
];

export function getPresetById(id: string): PostPreset | undefined {
  for (const category of postPresets) {
    const preset = category.posts.find((p) => p.id === id);
    if (preset) return preset;
  }
  return undefined;
}

export function getAllPresets(): PostPreset[] {
  return postPresets.flatMap((cat) => cat.posts);
}
