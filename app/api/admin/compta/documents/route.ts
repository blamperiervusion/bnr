import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    const transactions = await prisma.transaction.findMany({
      where: { exerciceYear: year },
      include: { category: true },
    });

    // Group by category
    const byCategory: Record<string, { name: string; type: string; total: number; tags: string | null }> = {};
    
    for (const t of transactions) {
      if (!t.category) continue;
      
      const code = t.category.code;
      if (!byCategory[code]) {
        byCategory[code] = {
          name: t.category.name,
          type: t.category.type,
          total: 0,
          tags: t.category.tags,
        };
      }
      byCategory[code].total += Number(t.amount);
    }

    // Calculate totals
    const totalCharges = Object.entries(byCategory)
      .filter(([, v]) => v.type === 'charge')
      .reduce((sum, [, v]) => sum + v.total, 0);

    const totalProduits = Object.entries(byCategory)
      .filter(([, v]) => v.type === 'produit')
      .reduce((sum, [, v]) => sum + v.total, 0);

    // Calculate specific totals
    const publicFunding = Object.entries(byCategory)
      .filter(([, v]) => v.tags?.includes('public_funding'))
      .reduce((sum, [, v]) => sum + v.total, 0);

    const privateFunding = Object.entries(byCategory)
      .filter(([, v]) => v.tags?.includes('private_funding'))
      .reduce((sum, [, v]) => sum + v.total, 0);

    const technicalExpenses = Object.entries(byCategory)
      .filter(([, v]) => v.tags?.includes('technical'))
      .reduce((sum, [, v]) => sum + v.total, 0);

    const artisticExpenses = Object.entries(byCategory)
      .filter(([, v]) => v.tags?.includes('artistic'))
      .reduce((sum, [, v]) => sum + v.total, 0);

    return NextResponse.json({
      byCategory,
      totalCharges,
      totalProduits,
      resultat: totalProduits - totalCharges,
      publicFunding,
      privateFunding,
      technicalExpenses,
      artisticExpenses,
      uncategorizedCount: transactions.filter(t => !t.categoryId).length,
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
