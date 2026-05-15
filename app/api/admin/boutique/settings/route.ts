import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const DEFAULTS: Record<string, string> = {
  boutique_shipping_cost: '5.00',
  boutique_free_shipping_threshold: '0',
};

async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  const token = await getToken({ req: request });
  return !!token;
}

export async function GET(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const rows = await prisma.festivalSettings.findMany({
    where: { key: { in: Object.keys(DEFAULTS) } },
  });

  const settings: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { boutique_shipping_cost, boutique_free_shipping_threshold } = body;

  const updates: { key: string; value: string }[] = [];

  if (boutique_shipping_cost !== undefined) {
    const val = parseFloat(boutique_shipping_cost);
    if (isNaN(val) || val < 0) {
      return NextResponse.json({ error: 'Frais de port invalide' }, { status: 400 });
    }
    updates.push({ key: 'boutique_shipping_cost', value: val.toFixed(2) });
  }

  if (boutique_free_shipping_threshold !== undefined) {
    const val = parseFloat(boutique_free_shipping_threshold);
    if (isNaN(val) || val < 0) {
      return NextResponse.json({ error: 'Seuil de livraison gratuite invalide' }, { status: 400 });
    }
    updates.push({ key: 'boutique_free_shipping_threshold', value: val.toFixed(2) });
  }

  for (const { key, value } of updates) {
    await prisma.festivalSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return NextResponse.json({ success: true });
}
