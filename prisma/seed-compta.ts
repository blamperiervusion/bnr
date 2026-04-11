import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  // Classe 6 - Charges
  { code: '60', name: 'Achats', type: 'charge', parentCode: null, tags: null },
  { code: '601', name: 'Achats bar/restauration', type: 'charge', parentCode: '60', tags: null },
  { code: '602', name: 'Fournitures consommables', type: 'charge', parentCode: '60', tags: null },
  { code: '606', name: 'Merchandising', type: 'charge', parentCode: '60', tags: null },

  { code: '61', name: 'Charges techniques', type: 'charge', parentCode: null, tags: 'technical' },
  { code: '611', name: 'Location matériel son', type: 'charge', parentCode: '61', tags: 'technical' },
  { code: '612', name: 'Location matériel lumière', type: 'charge', parentCode: '61', tags: 'technical' },
  { code: '613', name: 'Location scène/structures', type: 'charge', parentCode: '61', tags: 'technical' },
  { code: '614', name: 'Prestataires techniques', type: 'charge', parentCode: '61', tags: 'technical' },
  { code: '615', name: 'Sécurité', type: 'charge', parentCode: '61', tags: 'technical' },
  { code: '616', name: 'Électricité/Groupes électrogènes', type: 'charge', parentCode: '61', tags: 'technical' },

  { code: '62', name: 'Charges artistiques', type: 'charge', parentCode: null, tags: 'artistic' },
  { code: '621', name: 'Cachets artistes', type: 'charge', parentCode: '62', tags: 'artistic' },
  { code: '622', name: 'Hébergement artistes', type: 'charge', parentCode: '62', tags: 'artistic' },
  { code: '623', name: 'Restauration artistes (catering)', type: 'charge', parentCode: '62', tags: 'artistic' },
  { code: '624', name: 'Transport artistes', type: 'charge', parentCode: '62', tags: 'artistic' },
  { code: '625', name: 'Droits SACEM/SACD', type: 'charge', parentCode: '62', tags: 'artistic' },

  { code: '63', name: 'Communication', type: 'charge', parentCode: null, tags: null },
  { code: '631', name: 'Impression (affiches, flyers)', type: 'charge', parentCode: '63', tags: null },
  { code: '632', name: 'Publicité (Meta Ads, etc.)', type: 'charge', parentCode: '63', tags: null },
  { code: '633', name: 'Signalétique', type: 'charge', parentCode: '63', tags: null },

  { code: '64', name: 'Frais généraux', type: 'charge', parentCode: null, tags: null },
  { code: '641', name: 'Assurances', type: 'charge', parentCode: '64', tags: null },
  { code: '642', name: 'Frais administratifs', type: 'charge', parentCode: '64', tags: null },
  { code: '643', name: 'Licences/Autorisations', type: 'charge', parentCode: '64', tags: null },

  { code: '66', name: 'Charges financières', type: 'charge', parentCode: null, tags: null },
  { code: '661', name: 'Frais bancaires', type: 'charge', parentCode: '66', tags: null },
  { code: '662', name: 'Commissions HelloAsso/Stripe', type: 'charge', parentCode: '66', tags: null },
  { code: '663', name: 'Intérêts emprunts', type: 'charge', parentCode: '66', tags: null },
  { code: '664', name: 'Remboursement emprunt (capital)', type: 'charge', parentCode: '66', tags: null },

  { code: '67', name: 'Charges exceptionnelles', type: 'charge', parentCode: null, tags: null },

  // Classe 7 - Produits
  { code: '70', name: 'Billetterie', type: 'produit', parentCode: null, tags: null },
  { code: '701', name: 'Préventes', type: 'produit', parentCode: '70', tags: null },
  { code: '702', name: 'Ventes sur place', type: 'produit', parentCode: '70', tags: null },
  { code: '703', name: 'Pass 3 jours', type: 'produit', parentCode: '70', tags: null },
  { code: '704', name: 'Pass journée', type: 'produit', parentCode: '70', tags: null },

  { code: '71', name: 'Ventes', type: 'produit', parentCode: null, tags: null },
  { code: '711', name: 'Bar', type: 'produit', parentCode: '71', tags: null },
  { code: '712', name: 'Restauration', type: 'produit', parentCode: '71', tags: null },
  { code: '713', name: 'Merchandising', type: 'produit', parentCode: '71', tags: null },

  { code: '72', name: 'Prestations de services', type: 'produit', parentCode: null, tags: null },
  { code: '721', name: 'Location matériel sono/lumière', type: 'produit', parentCode: '72', tags: null },
  { code: '722', name: 'Prestations techniques (sonorisation, etc.)', type: 'produit', parentCode: '72', tags: null },
  { code: '723', name: 'Autres prestations', type: 'produit', parentCode: '72', tags: null },

  { code: '74', name: 'Subventions publiques', type: 'produit', parentCode: null, tags: 'public_funding' },
  { code: '741', name: 'Subvention Mairie', type: 'produit', parentCode: '74', tags: 'public_funding' },
  { code: '742', name: 'Subvention Département', type: 'produit', parentCode: '74', tags: 'public_funding' },
  { code: '743', name: 'Subvention Région', type: 'produit', parentCode: '74', tags: 'public_funding' },
  { code: '744', name: 'Subvention État (CNM, DRAC...)', type: 'produit', parentCode: '74', tags: 'public_funding' },
  { code: '745', name: 'Autres subventions publiques', type: 'produit', parentCode: '74', tags: 'public_funding' },

  { code: '75', name: 'Mécénat et dons', type: 'produit', parentCode: null, tags: 'private_funding' },
  { code: '751', name: 'Dons particuliers', type: 'produit', parentCode: '75', tags: 'private_funding' },
  { code: '752', name: 'Mécénat entreprises (avec contrepartie)', type: 'produit', parentCode: '75', tags: 'private_funding' },
  { code: '753', name: 'Mécénat entreprises (sans contrepartie)', type: 'produit', parentCode: '75', tags: 'private_funding' },

  { code: '76', name: 'Partenariats', type: 'produit', parentCode: null, tags: null },
  { code: '761', name: 'Sponsors (échange marchandise)', type: 'produit', parentCode: '76', tags: null },
  { code: '762', name: 'Partenaires médias', type: 'produit', parentCode: '76', tags: null },

  { code: '78', name: 'Cotisations', type: 'produit', parentCode: null, tags: null },
  { code: '781', name: 'Adhésions association', type: 'produit', parentCode: '78', tags: null },

  { code: '16', name: 'Emprunts', type: 'produit', parentCode: null, tags: null },
  { code: '164', name: 'Emprunt bancaire (réception)', type: 'produit', parentCode: '16', tags: null },
];

async function main() {
  console.log('🌱 Seeding plan comptable...');

  for (const category of categories) {
    await prisma.comptaCategory.upsert({
      where: { code: category.code },
      update: {
        name: category.name,
        type: category.type,
        parentCode: category.parentCode,
        tags: category.tags,
      },
      create: category,
    });
  }

  console.log(`✅ ${categories.length} catégories comptables créées/mises à jour`);

  // Créer l'exercice en cours
  const currentYear = new Date().getFullYear();
  await prisma.comptaExercice.upsert({
    where: { year: currentYear },
    update: {},
    create: {
      year: currentYear,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      openingBalance: 0,
    },
  });

  console.log(`✅ Exercice ${currentYear} créé`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
