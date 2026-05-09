import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/invoices/[id] — Détail d'une facture libre
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { partner: { select: { id: true, company: true } } },
  });

  if (!invoice) return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
  return NextResponse.json({ invoice });
}

// PATCH /api/admin/invoices/[id] — Modifier une facture libre
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        clientName: body.clientName,
        clientSiret: body.clientSiret ?? null,
        clientAddress: body.clientAddress ?? null,
        clientContact: body.clientContact ?? null,
        clientEmail: body.clientEmail ?? null,
        lines: body.lines ? JSON.stringify(body.lines) : undefined,
        totalAmount: body.totalAmount ? parseFloat(body.totalAmount) : undefined,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        paymentMethod: body.paymentMethod ?? undefined,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json({ invoice: updated });
  } catch (error) {
    console.error('Erreur modification facture:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

// DELETE /api/admin/invoices/[id] — Supprimer une facture libre
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression facture:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
