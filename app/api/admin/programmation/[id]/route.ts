import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const band = await prisma.band.findUnique({
      where: { id },
    });

    if (!band) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(band);
  } catch (error) {
    console.error('Error fetching band:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du groupe' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const band = await prisma.band.update({
      where: { id },
      data: {
        name: data.name,
        day: data.day,
        order: data.order,
        time: data.time,
        endTime: data.endTime,
        description: data.description,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        website: data.website,
        facebook: data.facebook,
        instagram: data.instagram,
        spotify: data.spotify,
        techRiderUrl: data.techRiderUrl,
        contractUrl: data.contractUrl,
        notes: data.notes,
        isVisible: data.isVisible,
        isHeadliner: data.isHeadliner,
      },
    });

    return NextResponse.json(band);
  } catch (error) {
    console.error('Error updating band:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du groupe' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.band.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting band:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du groupe' },
      { status: 500 }
    );
  }
}
