import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const exercices = await prisma.comptaExercice.findMany({
      orderBy: { year: 'desc' },
    });

    // Calculate actual balances from transactions
    const exercicesWithStats = await Promise.all(
      exercices.map(async (ex) => {
        const stats = await prisma.transaction.groupBy({
          by: ['type'],
          where: { exerciceYear: ex.year },
          _sum: { amount: true },
        });

        const credits = stats.find(s => s.type === 'credit')?._sum.amount || new Decimal(0);
        const debits = stats.find(s => s.type === 'debit')?._sum.amount || new Decimal(0);
        const transactionCount = await prisma.transaction.count({
          where: { exerciceYear: ex.year },
        });

        return {
          ...ex,
          openingBalance: ex.openingBalance.toString(),
          closingBalance: ex.closingBalance?.toString() || null,
          calculatedBalance: new Decimal(ex.openingBalance).plus(credits).minus(debits).toString(),
          totalCredits: credits.toString(),
          totalDebits: debits.toString(),
          transactionCount,
        };
      })
    );

    return NextResponse.json(exercicesWithStats);
  } catch (error) {
    console.error('Error fetching exercices:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des exercices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, openingBalance } = body;

    if (!year) {
      return NextResponse.json({ error: 'Année requise' }, { status: 400 });
    }

    const exercice = await prisma.comptaExercice.upsert({
      where: { year },
      update: {
        openingBalance: new Decimal(openingBalance || 0),
      },
      create: {
        year,
        startDate: new Date(year, 0, 1),
        endDate: new Date(year, 11, 31),
        openingBalance: new Decimal(openingBalance || 0),
        isClosed: false,
      },
    });

    return NextResponse.json(exercice);
  } catch (error) {
    console.error('Error creating/updating exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'exercice' },
      { status: 500 }
    );
  }
}
