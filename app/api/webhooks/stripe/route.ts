import { NextRequest, NextResponse } from 'next/server';
import getStripe from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { createPrintifyOrder } from '@/lib/printify';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret non configuré' }, { status: 500 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      console.error('Order not found for session:', session.id);
      return NextResponse.json({ received: true });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        stripePaymentId: session.payment_intent as string,
      },
    });

    const printifyItems = order.items.filter(
      (item) => item.product.type === 'PRINTIFY' &&
        item.product.printifyProductId &&
        item.variant.printifyVariantId
    );

    if (printifyItems.length > 0) {
      try {
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

        await prisma.order.update({
          where: { id: order.id },
          data: {
            printifyOrderId: printifyOrder.id,
            status: 'PROCESSING',
          },
        });
      } catch (err) {
        console.error('Printify order creation failed:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
