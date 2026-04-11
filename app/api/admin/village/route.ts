import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const stands = await prisma.villageStand.findMany({
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  });

  return NextResponse.json(stands);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, description, logo, website, instagram, facebook, contact, email, phone, isVisible, order, notes } = body;

  if (!name || !category) {
    return NextResponse.json({ error: 'Nom et catégorie requis' }, { status: 400 });
  }

  const stand = await prisma.villageStand.create({
    data: {
      name,
      category,
      description: description || null,
      logo: logo || null,
      website: website || null,
      instagram: instagram || null,
      facebook: facebook || null,
      contact: contact || null,
      email: email || null,
      phone: phone || null,
      isVisible: isVisible ?? true,
      order: order ?? 0,
      notes: notes || null,
    },
  });

  return NextResponse.json(stand);
}
