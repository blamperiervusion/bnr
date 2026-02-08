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
    answer: 'Le Barb\'n\'Rock Festival se déroule à Crèvecœur-le-Grand, dans l\'Oise (60). À seulement 1h de Paris et 30 min de Beauvais. L\'adresse exacte et le plan d\'accès seront communiqués avec ton billet.',
    category: 'Accès',
  },
  {
    id: 'acces-2',
    question: 'Y a-t-il un parking sur place ?',
    answer: 'Oui, un parking gratuit est mis à disposition des festivaliers. Nous encourageons également le covoiturage pour réduire notre empreinte carbone. Des navettes seront disponibles depuis les gares les plus proches.',
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
    answer: 'Les billets sont disponibles exclusivement sur notre billetterie en ligne. Nous vous recommandons de les acheter à l\'avance car les places sont limitées et les éditions précédentes se sont souvent jouées à guichets fermés !',
    category: 'Billetterie',
  },
  {
    id: 'billetterie-2',
    question: 'Les billets sont-ils remboursables ?',
    answer: 'Les billets ne sont ni remboursables ni échangeables, sauf en cas d\'annulation de l\'événement par l\'organisateur. En cas d\'impossibilité de vous rendre au festival, vous pouvez revendre votre billet via notre plateforme partenaire.',
    category: 'Billetterie',
  },
  {
    id: 'billetterie-3',
    question: 'Y a-t-il des tarifs réduits ?',
    answer: 'Oui ! Nous proposons des tarifs réduits pour les moins de 16 ans (gratuit pour les moins de 10 ans accompagnés). Des pass 3 jours sont également disponibles à prix avantageux.',
    category: 'Billetterie',
  },

  // Camping
  {
    id: 'camping-1',
    question: 'Y a-t-il un camping sur place ?',
    answer: 'Oui, un espace camping est disponible pour les festivaliers souhaitant vivre l\'expérience complète ! L\'accès au camping est inclus dans le pass 3 jours ou disponible en option pour les pass journée.',
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
    answer: 'Plusieurs food trucks et stands de restauration seront présents sur le site avec une offre variée : burgers, pizzas, plats végétariens et vegan, crêpes... De quoi satisfaire tous les appétits !',
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
    answer: 'Le festival fonctionne avec un système de cashless via un bracelet rechargeable. Vous pourrez le créditer à l\'entrée ou directement aux bornes présentes sur le site. Le remboursement du solde non utilisé est possible après le festival.',
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
    answer: 'Les enfants sont les bienvenus ! Les moins de 10 ans entrent gratuitement accompagnés d\'un adulte. Nous recommandons toutefois des protections auditives adaptées compte tenu du volume sonore.',
    category: 'Divers',
  },
];

export function getFAQByCategory(category: string): FAQItem[] {
  return faqItems.filter(item => item.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(faqItems.map(item => item.category))];
}
