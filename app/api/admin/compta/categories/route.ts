import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.comptaCategory.findMany({
      orderBy: [
        { type: 'asc' },
        { code: 'asc' },
      ],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json({
      categories: categories.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        type: c.type,
        parentCode: c.parentCode,
        tags: c.tags,
        transactionCount: c._count.transactions,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}
