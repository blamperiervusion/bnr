import { NextRequest, NextResponse } from 'next/server';
import getStripe from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface CartItem {
  variantId: string;
  quantity: number;
}

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `BNR-${year}-${rand}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, customerEmail, customerName, customerPhone, shippingAddress } = body as {
    items: CartItem[];
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      zip: string;
      country: string;
    };
  };

  if (!items?.length || !customerEmail || !customerName || !shippingAddress) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
  }

  const variantIds = items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, isAvailable: true },
    include: { product: true },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json({ error: 'Certains produits sont indisponibles' }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${variant.product.name} — ${variant.name}`,
          images: variant.product.images.length > 0 ? [variant.product.images[0]] : [],
          metadata: {
            variantId: variant.id,
            productId: variant.productId,
          },
        },
        unit_amount: Math.round(Number(variant.price) * 100),
      },
      quantity: item.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return sum + Number(variant.price) * item.quantity;
  }, 0);

  // Frais de port configurables en DB
  const shippingSettings = await prisma.festivalSettings.findMany({
    where: { key: { in: ['boutique_shipping_cost', 'boutique_free_shipping_threshold'] } },
  });
  const settingsMap = Object.fromEntries(shippingSettings.map((s) => [s.key, s.value]));
  const baseShippingCost = parseFloat(settingsMap.boutique_shipping_cost ?? '5.00');
  const freeThreshold = parseFloat(settingsMap.boutique_free_shipping_threshold ?? '0');
  const shippingCost = freeThreshold > 0 && subtotal >= freeThreshold ? 0 : baseShippingCost;

  const total = subtotal + shippingCost;

  const orderNumber = generateOrderNumber();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const shippingLineItems = shippingCost > 0
    ? [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Frais de livraison' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1 as const,
      }]
    : [];

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      ...lineItems,
      ...shippingLineItems,
    ],
    mode: 'payment',
    customer_email: customerEmail,
    success_url: `${baseUrl}/boutique/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/boutique/panier`,
    metadata: {
      orderNumber,
      customerName,
      customerPhone: customerPhone || '',
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(items),
    },
  });

  await prisma.order.create({
    data: {
      orderNumber,
      status: 'PENDING',
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress: JSON.stringify(shippingAddress),
      stripeSessionId: session.id,
      subtotal: new Decimal(subtotal),
      shippingCost: new Decimal(shippingCost),
      total: new Decimal(total),
      items: {
        create: items.map((item) => {
          const variant = variants.find((v) => v.id === item.variantId)!;
          return {
            productId: variant.productId,
            variantId: variant.id,
            quantity: item.quantity,
            unitPrice: variant.price,
            productName: variant.product.name,
            variantName: variant.name,
          };
        }),
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
