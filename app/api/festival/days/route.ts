import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const days = await prisma.festivalDay.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      select: {
        slug: true,
        name: true,
        date: true,
        openingTime: true,
        closingTime: true,
      },
    });
    return NextResponse.json(days);
  } catch (error) {
    console.error('Error fetching festival days:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
