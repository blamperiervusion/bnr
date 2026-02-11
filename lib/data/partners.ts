export interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  category: 'chaos' | 'headbanger' | 'moshpit' | 'supporter' | 'media' | 'institutional';
  description?: string;
}

export interface PartnershipTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  realCost: string;
  color: string;
  benefits: string[];
}

export const partners: Partner[] = [
  // Ces partenaires sont des exemples/placeholders
  // Ajoutez vos vrais partenaires ici
];

export const partnerCategories: Record<Partner['category'], { name: string; color: string }> = {
  chaos: { name: 'Mécènes CHAOS', color: '#E85D04' },
  headbanger: { name: 'Partenaires HEADBANGER', color: '#00E5CC' },
  moshpit: { name: 'Partenaires MOSH PIT', color: '#FFD700' },
  supporter: { name: 'Supporters', color: '#C0C0C0' },
  media: { name: 'Partenaires Média', color: '#ec4899' },
  institutional: { name: 'Partenaires Institutionnels', color: '#3b82f6' },
};

export function getPartnersByCategory(category: Partner['category']): Partner[] {
  return partners.filter(partner => partner.category === category);
}

export const partnershipTiers: PartnershipTier[] = [
  {
    id: 'chaos',
    name: 'Pack CHAOS',
    subtitle: 'Mécène principal',
    price: 'À partir de 2 000€',
    realCost: 'Coût réel : 800€',
    color: '#E85D04',
    benefits: [
      'Logo sur tous les supports de communication',
      '11 pass 3 jours OU 18 pass Samedi OU 27 pass Vendredi',
      'Visite exclusive des backstages',
      'Accès espace VIP',
      'Mention vocale sur scène',
      'Post dédié sur les réseaux sociaux',
      'Rencontre avec les artistes',
    ],
  },
  {
    id: 'headbanger',
    name: 'Pack HEADBANGER',
    subtitle: 'VIP Soirée',
    price: '1 000€',
    realCost: 'Coût réel : 400€',
    color: '#00E5CC',
    benefits: [
      'Logo sur le site web + réseaux sociaux',
      '5 pass 3 jours OU 9 pass Samedi OU 13 pass Vendredi',
      'Visite des backstages',
      'Accès espace VIP',
      'Remerciements sur scène',
    ],
  },
  {
    id: 'moshpit',
    name: 'Pack MOSH PIT',
    subtitle: 'Partenaire classique',
    price: '500€',
    realCost: 'Coût réel : 200€',
    color: '#FFD700',
    benefits: [
      'Logo sur le site web',
      '2 pass 3 jours OU 4 pass Samedi OU 6 pass Vendredi',
      'Mention sur les réseaux sociaux',
      'Remerciements officiels',
    ],
  },
  {
    id: 'supporter',
    name: 'Pack SUPPORTER',
    subtitle: 'Petit soutien',
    price: '250€',
    realCost: 'Coût réel : 100€',
    color: '#C0C0C0',
    benefits: [
      'Nom sur le site web (page partenaires)',
      '1 pass 3 jours OU 2 pass Samedi OU 3 pass Vendredi',
      'Remerciements sur les réseaux',
    ],
  },
];
