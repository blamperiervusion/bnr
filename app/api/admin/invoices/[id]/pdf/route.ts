import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';
import { generateInvoiceHTML, type InvoiceLine } from '@/lib/invoices/pdf';

// POST /api/admin/invoices/[id]/pdf — Générer le PDF d'une facture libre
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });

    const lines: InvoiceLine[] = JSON.parse(invoice.lines);

    const html = generateInvoiceHTML({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      paymentDate: invoice.paymentDate,
      clientName: invoice.clientName,
      clientSiret: invoice.clientSiret,
      clientAddress: invoice.clientAddress,
      clientContact: invoice.clientContact,
      lines,
      totalAmount: invoice.totalAmount,
      notes: invoice.notes,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });
    await browser.close();

    const slug = invoice.clientName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${slug}-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du PDF' }, { status: 500 });
  }
}
