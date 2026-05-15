import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULTS = {
  boutique_shipping_cost: '5.00',
  boutique_free_shipping_threshold: '0',
};

export async function GET() {
  const rows = await prisma.festivalSettings.findMany({
    where: { key: { in: Object.keys(DEFAULTS) } },
  });

  const settings: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({
    shippingCost: parseFloat(settings.boutique_shipping_cost),
    freeShippingThreshold: parseFloat(settings.boutique_free_shipping_threshold),
  });
}
