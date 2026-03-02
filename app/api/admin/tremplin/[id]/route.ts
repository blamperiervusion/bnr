import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/tremplin/[id] - Détail d'un groupe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const band = await prisma.tremplinBand.findUnique({
    where: { id },
  });

  if (!band) {
    return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 });
  }

  return NextResponse.json(band);
}

// PATCH /api/admin/tremplin/[id] - Mise à jour d'un groupe
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const band = await prisma.tremplinBand.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(band);
}

// DELETE /api/admin/tremplin/[id] - Suppression d'un groupe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.tremplinBand.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
