import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();

    // Get current exercice
    const exercice = await prisma.comptaExercice.findUnique({
      where: { year: currentYear },
    });

    // Get transaction stats
    const transactions = await prisma.transaction.findMany({
      where: { exerciceYear: currentYear },
    });

    const totalDebit = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalCredit = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const uncategorized = transactions.filter(t => !t.categoryId).length;

    // Get categories with transaction counts
    const categories = await prisma.comptaCategory.findMany({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { code: 'asc' },
    });

    return NextResponse.json({
      exercice,
      stats: {
        totalTransactions: transactions.length,
        totalDebit,
        totalCredit,
        balance: totalCredit - totalDebit,
        uncategorized,
      },
      categories,
    });
  } catch (error) {
    console.error('Error fetching compta data:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
