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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { createdAt: 'asc' } } },
  });
  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, type, images, printifyProductId, isVisible, order, variants } = body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  if (slug && slug !== existing.slug) {
    const slugConflict = await prisma.product.findUnique({ where: { slug } });
    if (slugConflict) return NextResponse.json({ error: 'Ce slug est déjà utilisé' }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      type,
      images,
      printifyProductId: printifyProductId || null,
      isVisible,
      order,
    },
  });

  if (variants !== undefined) {
    const incomingIds = variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id);
    await prisma.productVariant.deleteMany({
      where: { productId: id, id: { notIn: incomingIds } },
    });

    for (const v of variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            name: v.name,
            size: v.size || null,
            color: v.color || null,
            price: v.price,
            stock: v.stock ?? 0,
            printifyVariantId: v.printifyVariantId || null,
            sku: v.sku || null,
            isAvailable: v.isAvailable ?? true,
          },
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: id,
            name: v.name,
            size: v.size || null,
            color: v.color || null,
            price: v.price,
            stock: v.stock ?? 0,
            printifyVariantId: v.printifyVariantId || null,
            sku: v.sku || null,
            isAvailable: v.isAvailable ?? true,
          },
        });
      }
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { createdAt: 'asc' } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
