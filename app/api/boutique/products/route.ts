import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    include: {
      variants: {
        where: { isAvailable: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(products);
}
