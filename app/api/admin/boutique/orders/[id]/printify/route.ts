import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createPrintifyOrder } from '@/lib/printify';

async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  const token = await getToken({ req: request });
  return !!token;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, variant: true } },
    },
  });

  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
  if (order.printifyOrderId) {
    return NextResponse.json({ error: 'Cette commande a déjà été envoyée à Printify' }, { status: 400 });
  }

  const printifyItems = order.items.filter(
    (item) =>
      item.product.type === 'PRINTIFY' &&
      item.product.printifyProductId &&
      item.variant.printifyVariantId
  );

  if (printifyItems.length === 0) {
    return NextResponse.json({ error: 'Aucun article Printify dans cette commande' }, { status: 400 });
  }

  const shippingAddress = JSON.parse(order.shippingAddress);
  const nameParts = order.customerName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || firstName;

  const printifyOrder = await createPrintifyOrder({
    external_id: order.orderNumber,
    label: `BNR Order ${order.orderNumber}`,
    line_items: printifyItems.map((item) => ({
      product_id: item.product.printifyProductId!,
      variant_id: parseInt(item.variant.printifyVariantId!),
      quantity: item.quantity,
    })),
    shipping_method: 1,
    address_to: {
      first_name: firstName,
      last_name: lastName,
      email: order.customerEmail,
      phone: order.customerPhone || undefined,
      country: shippingAddress.country || 'FR',
      address1: shippingAddress.line1,
      address2: shippingAddress.line2 || undefined,
      city: shippingAddress.city,
      zip: shippingAddress.zip,
    },
  });

  const updated = await prisma.order.update({
    where: { id },
    data: {
      printifyOrderId: printifyOrder.id,
      status: 'PROCESSING',
    },
    include: {
      items: { include: { product: true, variant: true } },
    },
  });

  return NextResponse.json(updated);
}
