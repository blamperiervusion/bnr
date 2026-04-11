import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const day = await prisma.festivalDay.findUnique({
      where: { id },
    });

    if (!day) {
      return NextResponse.json({ error: 'Journée non trouvée' }, { status: 404 });
    }

    return NextResponse.json(day);
  } catch (error) {
    console.error('Error fetching festival day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.openingTime !== undefined) updateData.openingTime = data.openingTime;
    if (data.closingTime !== undefined) updateData.closingTime = data.closingTime || null;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;
    if (data.order !== undefined) updateData.order = data.order;

    const day = await prisma.festivalDay.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(day);
  } catch (error) {
    console.error('Error updating festival day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.festivalDay.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting festival day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
