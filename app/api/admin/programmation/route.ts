import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const bands = await prisma.band.findMany({
      orderBy: [
        { day: 'asc' },
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(bands);
  } catch (error) {
    console.error('Error fetching bands:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    let slug = slugify(data.name);
    const existingBand = await prisma.band.findUnique({ where: { slug } });
    if (existingBand) {
      slug = `${slug}-${Date.now()}`;
    }

    const band = await prisma.band.create({
      data: {
        name: data.name,
        slug,
        day: data.day,
        order: data.order || 0,
        time: data.time || null,
        endTime: data.endTime || null,
        description: data.description || '',
        imageUrl: data.imageUrl || null,
        videoUrl: data.videoUrl || null,
        website: data.website || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        spotify: data.spotify || null,
        techRiderUrl: data.techRiderUrl || null,
        contractUrl: data.contractUrl || null,
        notes: data.notes || null,
        isVisible: data.isVisible ?? true,
        isHeadliner: data.isHeadliner ?? false,
      },
    });

    return NextResponse.json(band, { status: 201 });
  } catch (error) {
    console.error('Error creating band:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    );
  }
}
