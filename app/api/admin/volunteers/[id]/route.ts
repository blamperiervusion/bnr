import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/volunteers/[id] - Détail d'un bénévole
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
  });

  if (!volunteer) {
    return NextResponse.json({ error: 'Bénévole non trouvé' }, { status: 404 });
  }

  return NextResponse.json(volunteer);
}

// PATCH /api/admin/volunteers/[id] - Mise à jour d'un bénévole
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

  // Validation des champs autorisés
  const allowedFields = ['status', 'team', 'notes'];
  const data: Record<string, unknown> = {};
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field] === '' ? null : body[field];
    }
  }

  try {
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data,
    });

    return NextResponse.json(volunteer);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE /api/admin/volunteers/[id] - Suppression d'un bénévole
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.volunteer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
