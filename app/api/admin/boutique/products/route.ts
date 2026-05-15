import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

  const products = await prisma.product.findMany({
    include: {
      variants: { orderBy: { createdAt: 'asc' } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description, type, images, printifyProductId, isVisible, order, variants } = body;

  if (!name || !slug || !description) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Ce slug est déjà utilisé' }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      type: type || 'LOCAL',
      images: images || [],
      printifyProductId: printifyProductId || null,
      isVisible: isVisible ?? true,
      order: order ?? 0,
      variants: variants?.length
        ? {
            create: variants.map((v: {
              name: string;
              size?: string;
              color?: string;
              price: number;
              stock?: number;
              printifyVariantId?: string;
              sku?: string;
              isAvailable?: boolean;
            }) => ({
              name: v.name,
              size: v.size || null,
              color: v.color || null,
              price: v.price,
              stock: v.stock ?? 0,
              printifyVariantId: v.printifyVariantId || null,
              sku: v.sku || null,
              isAvailable: v.isAvailable ?? true,
            })),
          }
        : undefined,
    },
    include: { variants: true },
  });

  return NextResponse.json(product, { status: 201 });
}
