import prisma from '@/lib/prisma';

export interface MecenatReport {
  year: number;
  totalMecenat: number;
  byType: {
    code: string;
    name: string;
    amount: number;
    transactions: {
      date: Date;
      label: string;
      amount: number;
    }[];
  }[];
  generatedAt: Date;
}

export interface RecuFiscal {
  numero: string;
  date: Date;
  donateur: {
    nom: string;
    adresse?: string;
  };
  montant: number;
  dateVersement: Date;
  nature: 'numeraire' | 'nature';
  modePaiement: string;
}

export async function generateMecenatReport(year: number): Promise<MecenatReport> {
  const categories = await prisma.comptaCategory.findMany({
    where: {
      tags: {
        contains: 'private_funding',
      },
    },
  });

  const categoryIds = categories.map(c => c.id);

  const transactions = await prisma.transaction.findMany({
    where: {
      exerciceYear: year,
      categoryId: {
        in: categoryIds,
      },
    },
    include: {
      category: true,
    },
    orderBy: { date: 'asc' },
  });

  // Group by category
  const byType: MecenatReport['byType'] = [];
  const categoryMap = new Map<string, typeof byType[0]>();

  for (const t of transactions) {
    if (!t.category) continue;

    const code = t.category.code;
    if (!categoryMap.has(code)) {
      categoryMap.set(code, {
        code,
        name: t.category.name,
        amount: 0,
        transactions: [],
      });
    }

    const source = categoryMap.get(code)!;
    source.amount += Number(t.amount);
    source.transactions.push({
      date: t.date,
      label: t.label,
      amount: Number(t.amount),
    });
  }

  byType.push(...categoryMap.values());
  byType.sort((a, b) => a.code.localeCompare(b.code));

  const totalMecenat = byType.reduce((sum, s) => sum + s.amount, 0);

  return {
    year,
    totalMecenat,
    byType,
    generatedAt: new Date(),
  };
}

export function generateRecuFiscalHTML(recu: RecuFiscal, association: {
  nom: string;
  adresse: string;
  siret?: string;
  objet: string;
}): string {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Reçu fiscal n°${recu.numero}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .subtitle { font-size: 14px; color: #666; }
    .box { border: 2px solid #333; padding: 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; margin: 10px 0; }
    .label { font-weight: bold; }
    .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #666; }
    .signature { margin-top: 40px; text-align: right; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">REÇU AU TITRE DES DONS</div>
    <div class="subtitle">à certaines œuvres d'intérêt général</div>
    <div class="subtitle">(Articles 200, 238 bis et 885-0 V bis A du code général des impôts)</div>
    <div class="subtitle">Reçu n° ${recu.numero}</div>
  </div>

  <div class="box">
    <div class="label">Bénéficiaire des versements :</div>
    <p><strong>${association.nom}</strong></p>
    <p>${association.adresse}</p>
    ${association.siret ? `<p>SIRET : ${association.siret}</p>` : ''}
    <p>Objet : ${association.objet}</p>
  </div>

  <div class="box">
    <div class="label">Donateur :</div>
    <p><strong>${recu.donateur.nom}</strong></p>
    ${recu.donateur.adresse ? `<p>${recu.donateur.adresse}</p>` : ''}
  </div>

  <div class="box">
    <p>L'association reconnait avoir reçu au titre des dons et versements ouvrant droit à réduction d'impôt :</p>
    
    <div class="amount">${formatCurrency(recu.montant)}</div>
    
    <div class="row">
      <span>Date du versement :</span>
      <span>${formatDate(recu.dateVersement)}</span>
    </div>
    <div class="row">
      <span>Nature du don :</span>
      <span>${recu.nature === 'numeraire' ? 'Numéraire' : 'Nature'}</span>
    </div>
    <div class="row">
      <span>Mode de versement :</span>
      <span>${recu.modePaiement}</span>
    </div>
  </div>

  <p>Le bénéficiaire certifie sur l'honneur que les dons et versements qu'il reçoit ouvrent droit à la réduction d'impôt prévue à l'article 200 du code général des impôts.</p>

  <div class="signature">
    <p>Fait à ________________, le ${formatDate(recu.date)}</p>
    <p style="margin-top: 60px;">Signature et cachet de l'organisme</p>
  </div>

  <div class="footer">
    <p>Ce reçu est destiné à être produit à l'appui de votre déclaration de revenus.</p>
  </div>
</body>
</html>
  `.trim();
}
