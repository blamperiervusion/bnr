import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// GET /api/admin/covoiturage — liste toutes les annonces
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const offers = await prisma.carpoolOffer.findMany({
      where: status ? { status: status as 'PENDING' | 'VISIBLE' | 'HIDDEN' } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(offers);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
