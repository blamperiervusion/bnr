import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/volunteers - Liste des bénévoles
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const team = searchParams.get('team');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (team) where.team = team;

  const volunteers = await prisma.volunteer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(volunteers);
}
