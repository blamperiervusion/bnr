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

// GET /api/admin/users - Liste des utilisateurs
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { partners: true }
      }
    }
  });

  return NextResponse.json(users);
}

// POST /api/admin/users - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe sont requis' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'admin',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
