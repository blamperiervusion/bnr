import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Helper pour vérifier l'authentification
async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  
  // Fallback: vérifier le token JWT directement
  const token = await getToken({ req: request });
  return !!token;
}

// GET /api/admin/partners/[id] - Détail d'un partenaire
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  if (!partner) {
    return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });
  }

  return NextResponse.json(partner);
}

// PATCH /api/admin/partners/[id] - Mise à jour d'un partenaire
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Validation des champs autorisés
  const allowedFields = [
    'status', 'tier', 'logo', 'siret', 'address',
    'donationAmount', 'donationDate', 'notes', 'assignedToId'
  ];
  const data: Record<string, unknown> = {};
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === 'donationDate' && body[field]) {
        data[field] = new Date(body[field]);
      } else {
        data[field] = body[field] === '' ? null : body[field];
      }
    }
  }

  try {
    const partner = await prisma.partner.update({
      where: { id },
      data,
    });

    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE /api/admin/partners/[id] - Suppression d'un partenaire
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Vérifier que le partenaire existe
    const existing = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression partenaire:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
