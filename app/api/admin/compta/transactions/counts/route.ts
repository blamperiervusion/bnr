import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    const [total, uncategorized, credits, debits] = await Promise.all([
      prisma.transaction.count({
        where: { exerciceYear: year },
      }),
      prisma.transaction.count({
        where: { exerciceYear: year, categoryId: null },
      }),
      prisma.transaction.count({
        where: { exerciceYear: year, type: 'credit' },
      }),
      prisma.transaction.count({
        where: { exerciceYear: year, type: 'debit' },
      }),
    ]);

    return NextResponse.json({
      total,
      uncategorized,
      credits,
      debits,
    });
  } catch (error) {
    console.error('Error fetching transaction counts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des compteurs' },
      { status: 500 }
    );
  }
}
