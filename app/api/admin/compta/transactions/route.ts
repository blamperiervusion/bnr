import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const uncategorized = searchParams.get('uncategorized') === 'true';
    const search = searchParams.get('search')?.trim();

    const where: Record<string, unknown> = {
      exerciceYear: year,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type && (type === 'debit' || type === 'credit')) {
      where.type = type;
    }

    if (uncategorized) {
      where.categoryId = null;
    }

    if (search) {
      where.label = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, label, description, amount, type, categoryId, exerciceYear, notes } = body;

    if (!date || !label || !amount || !type) {
      return NextResponse.json(
        { error: 'Date, libellé, montant et type sont requis' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        valueDate: new Date(date),
        label,
        description: description || null,
        amount,
        type,
        categoryId: categoryId || null,
        exerciceYear: exerciceYear || new Date().getFullYear(),
        notes: notes || null,
        sourceFile: 'manual',
        isReconciled: false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
