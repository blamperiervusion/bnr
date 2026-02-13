import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/partners - Liste des partenaires
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
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
