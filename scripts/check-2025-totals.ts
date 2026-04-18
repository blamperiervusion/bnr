import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get totals by type for 2025
  const totals = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      exerciceYear: 2025,
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  console.log('\n=== TOTAUX EN BASE DE DONNÉES POUR 2025 ===\n');
  
  let totalDebit = 0;
  let totalCredit = 0;
  let countDebit = 0;
  let countCredit = 0;

  for (const item of totals) {
    const sum = Number(item._sum.amount) || 0;
    if (item.type === 'debit') {
      totalDebit = sum;
      countDebit = item._count;
    } else if (item.type === 'credit') {
      totalCredit = sum;
      countCredit = item._count;
    }
    console.log(`${item.type.toUpperCase()}: ${sum.toFixed(2)} € (${item._count} transactions)`);
  }

  console.log('\n--- Résumé ---');
  console.log(`Total des dépenses (débit):  ${totalDebit.toFixed(2)} €`);
  console.log(`Total des recettes (crédit): ${totalCredit.toFixed(2)} €`);
  console.log(`Solde:                       ${(totalCredit - totalDebit).toFixed(2)} €`);
  console.log(`Nombre total de transactions: ${countDebit + countCredit}`);

  // Monthly breakdown
  console.log('\n=== DÉTAIL PAR MOIS ===\n');
  
  const transactions = await prisma.transaction.findMany({
    where: {
      exerciceYear: 2025,
    },
    orderBy: { date: 'asc' },
  });

  const monthlyData: Record<number, { debit: number; credit: number }> = {};
  
  for (const tx of transactions) {
    const month = tx.date.getMonth() + 1;
    if (!monthlyData[month]) {
      monthlyData[month] = { debit: 0, credit: 0 };
    }
    const amount = Number(tx.amount);
    if (tx.type === 'debit') {
      monthlyData[month].debit += amount;
    } else {
      monthlyData[month].credit += amount;
    }
  }

  const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  console.log('Mois        | Dépenses      | Recettes');
  console.log('------------|---------------|---------------');
  
  for (let m = 1; m <= 12; m++) {
    const data = monthlyData[m] || { debit: 0, credit: 0 };
    const monthName = monthNames[m].padEnd(11);
    const debit = data.debit.toFixed(2).padStart(12);
    const credit = data.credit.toFixed(2).padStart(12);
    console.log(`${monthName} | ${debit} € | ${credit} €`);
  }

  await prisma.$disconnect();
}

main();
