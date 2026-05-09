import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const [freeCount, partnerCount] = await Promise.all([
    prisma.invoice.count({
      where: { invoiceNumber: { startsWith: `FA-${year}-` } },
    }),
    prisma.partner.count({
      where: { invoiceNumber: { startsWith: `FA-${year}-` } },
    }),
  ]);
  const total = freeCount + partnerCount;
  const number = (total + 1).toString().padStart(4, '0');
  return `FA-${year}-${number}`;
}

// GET /api/admin/invoices — Liste toutes les factures (libres + partenaires)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;

  // Factures libres
  const freeInvoices = await prisma.invoice.findMany({
    where: year
      ? {
          invoiceDate: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
        }
      : {},
    include: { partner: { select: { id: true, company: true } } },
    orderBy: { invoiceDate: 'desc' },
  });

  // Factures partenaires (celles qui ont un invoiceNumber)
  const partnerInvoices = await prisma.partner.findMany({
    where: {
      invoiceNumber: { not: null },
      ...(year
        ? {
            invoiceDate: {
              gte: new Date(`${year}-01-01`),
              lt: new Date(`${year + 1}-01-01`),
            },
          }
        : {}),
    },
    select: {
      id: true,
      company: true,
      contact: true,
      invoiceNumber: true,
      invoiceDate: true,
      donationAmount: true,
      tier: true,
    },
    orderBy: { invoiceDate: 'desc' },
  });

  return NextResponse.json({ freeInvoices, partnerInvoices });
}

// POST /api/admin/invoices — Créer une nouvelle facture libre
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      clientName,
      clientSiret,
      clientAddress,
      clientContact,
      clientEmail,
      lines,
      totalAmount,
      invoiceDate,
      paymentDate,
      paymentMethod,
      notes,
      partnerId,
    } = body;

    if (!clientName || !lines || !Array.isArray(lines) || lines.length === 0 || !totalAmount) {
      return NextResponse.json(
        { error: 'Champs requis manquants (client, lignes, montant)' },
        { status: 400 }
      );
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
        clientName,
        clientSiret: clientSiret || null,
        clientAddress: clientAddress || null,
        clientContact: clientContact || null,
        clientEmail: clientEmail || null,
        lines: JSON.stringify(lines),
        totalAmount: parseFloat(totalAmount),
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        paymentMethod: paymentMethod || 'virement',
        notes: notes || null,
        partnerId: partnerId || null,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Erreur création facture:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
