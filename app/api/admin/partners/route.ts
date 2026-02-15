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

// GET /api/admin/partners - Liste des partenaires
export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const tier = searchParams.get('tier');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (tier) where.tier = tier;

  const partners = await prisma.partner.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(partners);
}

// POST /api/admin/partners - Créer un nouveau partenaire
export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { company, contact, email, phone, tier, message, status, logo, siret, address, donationAmount, donationDate, notes, website } = body;

    if (!company || !contact || !email) {
      return NextResponse.json({ error: 'Entreprise, contact et email sont requis' }, { status: 400 });
    }

    const partner = await prisma.partner.create({
      data: {
        company,
        contact,
        email,
        phone: phone || null,
        tier: tier || null,
        message: message || null,
        status: status || 'VALIDATED', // Par défaut validé quand créé manuellement
        logo: logo || null,
        siret: siret || null,
        address: address || null,
        donationAmount: donationAmount ? parseFloat(donationAmount) : null,
        donationDate: donationDate ? new Date(donationDate) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Erreur création partenaire:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
