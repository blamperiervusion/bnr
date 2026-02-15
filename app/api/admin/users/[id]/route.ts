import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper pour vérifier l'authentification
async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  
  const token = await getToken({ req: request });
  return !!token;
}

// GET /api/admin/users/[id] - Détail d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      partners: {
        select: {
          id: true,
          company: true,
          status: true,
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PATCH /api/admin/users/[id] - Mise à jour d'un utilisateur
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  
  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email;
  if (body.role) data.role = body.role;
  if (body.password) {
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }

  try {
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (body.email) {
      const existingUser = await prisma.adminUser.findFirst({
        where: {
          email: body.email,
          NOT: { id }
        }
      });
      if (existingUser) {
        return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
      }
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Suppression d'un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Vérifier qu'il reste au moins un admin
    const adminCount = await prisma.adminUser.count();
    if (adminCount <= 1) {
      return NextResponse.json({ error: 'Impossible de supprimer le dernier administrateur' }, { status: 400 });
    }

    // Désassigner les partenaires de cet utilisateur
    await prisma.partner.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null }
    });

    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
