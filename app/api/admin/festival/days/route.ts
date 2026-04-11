import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const days = await prisma.festivalDay.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(days);
  } catch (error) {
    console.error('Error fetching festival days:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const day = await prisma.festivalDay.create({
      data: {
        slug: data.slug,
        name: data.name,
        date: new Date(data.date),
        openingTime: data.openingTime,
        closingTime: data.closingTime || null,
        isVisible: data.isVisible ?? true,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json(day);
  } catch (error) {
    console.error('Error creating festival day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
