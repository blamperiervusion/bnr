export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FAQItem[] = [
  // Accès et transport
  {
    id: 'acces-1',
    question: 'Où se déroule le festival ?',
    answer: 'Le Barb\'n\'Rock Festival se déroule au Stade Municipal de Crèvecœur-le-Grand, dans l\'Oise (60). À seulement 1h de Paris et 30 min de Beauvais.',
    category: 'Accès',
  },
  {
    id: 'acces-2',
    question: 'Y a-t-il un parking sur place ?',
    answer: 'Oui, un parking gratuit est mis à disposition des festivaliers. Attention : il n\'y a pas de navettes. Nous encourageons le covoiturage pour faciliter l\'accès au site.',
    category: 'Accès',
  },
  {
    id: 'acces-3',
    question: 'Le festival est-il accessible aux personnes à mobilité réduite ?',
    answer: 'Absolument ! Le site est aménagé pour accueillir les personnes à mobilité réduite. Des places de parking dédiées, des accès facilités et des emplacements réservés devant les scènes sont prévus. Contactez-nous pour toute demande spécifique.',
    category: 'Accès',
  },

  // Billetterie
  {
    id: 'billetterie-1',
    question: 'Où puis-je acheter mes billets ?',
    answer: 'Les billets sont disponibles sur notre site internet, dans le réseau Ticket Net, et via le Pass Culture. Nous vous recommandons de les acheter à l\'avance car les places sont limitées !',
    category: 'Billetterie',
  },
  {
    id: 'billetterie-2',
    question: 'Les billets sont-ils remboursables ?',
    answer: 'Non, les billets ne sont ni remboursables ni échangeables, sauf en cas d\'annulation de l\'événement par l\'organisateur. Nous ne disposons pas de plateforme de revente partenaire.',
    category: 'Billetterie',
  },
  {
    id: 'billetterie-3',
    question: 'Y a-t-il des tarifs réduits ?',
    answer: 'Oui ! L\'entrée est gratuite pour les moins de 12 ans accompagnés d\'un adulte. Des billets Early Bird à tarif réduit sont également disponibles en début de vente.',
    category: 'Billetterie',
  },

  // Camping
  {
    id: 'camping-1',
    question: 'Y a-t-il un camping sur place ?',
    answer: 'Oui, un espace camping est disponible et gratuit pour tous les festivaliers ! Profitez de l\'expérience complète du festival en plantant votre tente sur place.',
    category: 'Camping',
  },
  {
    id: 'camping-2',
    question: 'Que faut-il apporter au camping ?',
    answer: 'Prévoyez votre tente, sac de couchage, matelas, lampe torche, et de quoi vous protéger du soleil et de la pluie. Des douches et sanitaires sont à disposition. Les barbecues et feux sont interdits pour des raisons de sécurité.',
    category: 'Camping',
  },

  // Restauration
  {
    id: 'resto-1',
    question: 'Y a-t-il de la restauration sur place ?',
    answer: 'Oui ! Food trucks, bar avec une sélection de bières de qualité, et stands variés vous attendent. Découvrez toute l\'offre sur la page "Le Village".',
    category: 'Restauration',
  },
  {
    id: 'resto-2',
    question: 'Puis-je apporter ma propre nourriture ?',
    answer: 'Pour des raisons de sécurité et de soutien aux prestataires du festival, il n\'est pas autorisé d\'apporter de la nourriture sur le site du festival. Les glacières sont toutefois acceptées au camping.',
    category: 'Restauration',
  },
  {
    id: 'resto-3',
    question: 'Comment fonctionne le paiement sur place ?',
    answer: 'Le festival fonctionne en cashless avec un système de jetons. Vous pouvez précommander vos jetons en ligne ou les acheter sur place aux points de vente dédiés.',
    category: 'Restauration',
  },

  // Sécurité
  {
    id: 'secu-1',
    question: 'Quels objets sont interdits sur le site ?',
    answer: 'Sont interdits : bouteilles en verre, objets tranchants ou contondants, substances illicites, feux d\'artifice, drones, animaux (sauf chiens d\'assistance). Une fouille sera effectuée à l\'entrée.',
    category: 'Sécurité',
  },
  {
    id: 'secu-2',
    question: 'Y a-t-il un poste de secours ?',
    answer: 'Oui, une équipe médicale est présente sur le site pendant toute la durée du festival. En cas de problème, n\'hésitez pas à vous adresser aux bénévoles ou au personnel de sécurité.',
    category: 'Sécurité',
  },

  // Divers
  {
    id: 'divers-1',
    question: 'Puis-je entrer et sortir librement du festival ?',
    answer: 'Oui, votre bracelet vous permet d\'entrer et sortir librement pendant les horaires d\'ouverture. Attention cependant, le bracelet est personnel et non transférable.',
    category: 'Divers',
  },
  {
    id: 'divers-2',
    question: 'Les enfants sont-ils acceptés ?',
    answer: 'Les enfants sont les bienvenus ! L\'entrée est gratuite pour les moins de 12 ans accompagnés d\'un adulte. Important : l\'accès est interdit aux enfants de moins de 3 ans sans protection auditive adaptée. Nous recommandons des protections auditives pour tous les enfants compte tenu du volume sonore.',
    category: 'Divers',
  },

  // L'association
  {
    id: 'asso-1',
    question: 'Qui organise le festival ?',
    answer: 'Le festival est co-organisé par l\'ACPC (Association Crépicordienne pour la Promotion de la Culture), créée en 2023, BVFR Charity (l\'association des Bearded Villains France, à l\'origine du concept en 2017) et la commune de Crèvecœur-le-Grand. Le bureau de l\'ACPC est composé de Benjamin Lampérier (Président), Vincent Warnault (Trésorier) et Luc Pouilly (Secrétaire).',
    category: 'L\'association',
  },
  {
    id: 'asso-2',
    question: 'Quelle est l\'histoire du Barb\'n\'Rock ?',
    answer: 'Créé en 2017 par le groupe Bearded Villains France, le Barb\'n\'Rock était à l\'origine un festival 100% caritatif dans un gymnase parisien. Après 3 éditions, la crise sanitaire a stoppé le projet. Il renaît en 2023 à Crèvecœur-le-Grand, grâce à l\'union de BVFR Charity, l\'ACPC et la commune.',
    category: 'L\'association',
  },
  {
    id: 'asso-3',
    question: 'Quels sont les engagements écologiques du festival ?',
    answer: 'Nous agissons sur plusieurs fronts : tri des déchets avec écocups, produits consignés en verre livrés par Le Fourgon en véhicule électrique, réutilisation de nos bâches transformées en merchandising par la maroquinière Raev, et amélioration continue de notre mix énergétique (compteur Enedis, panneaux solaires).',
    category: 'L\'association',
  },
  {
    id: 'asso-4',
    question: 'Comment le festival soutient-il la scène locale ?',
    answer: '50% de notre programmation est composée de groupes des Hauts-de-France. Nous organisons également une soirée tremplin pour faire jouer des groupes émergents sur la grande scène. De plus, Hapiness Radio est présente pour interviewer les artistes et partager l\'ambiance du festival.',
    category: 'L\'association',
  },
  {
    id: 'asso-5',
    question: 'Qu\'est-ce que l\'engagement solidaire du festival ?',
    answer: 'Tous engagés ! Chaque année, tous les stands du village s\'engagent à reverser 10% de leurs ventes à une association caritative soutenue par le Barb\'n\'Rock. La musique nous rapproche, mais l\'entraide aussi !',
    category: 'L\'association',
  },
];

export function getFAQByCategory(category: string): FAQItem[] {
  return faqItems.filter(item => item.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(faqItems.map(item => item.category))];
}
