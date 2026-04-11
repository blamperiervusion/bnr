import prisma from '@/lib/prisma';

export interface SubventionReport {
  year: number;
  totalPublicFunding: number;
  bySource: {
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

export async function generateSubventionReport(year: number): Promise<SubventionReport> {
  const categories = await prisma.comptaCategory.findMany({
    where: {
      tags: {
        contains: 'public_funding',
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
  const bySource: SubventionReport['bySource'] = [];
  const categoryMap = new Map<string, typeof bySource[0]>();

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

  bySource.push(...categoryMap.values());
  bySource.sort((a, b) => a.code.localeCompare(b.code));

  const totalPublicFunding = bySource.reduce((sum, s) => sum + s.amount, 0);

  return {
    year,
    totalPublicFunding,
    bySource,
    generatedAt: new Date(),
  };
}
