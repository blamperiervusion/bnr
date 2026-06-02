import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import puppeteer from 'puppeteer';
import {
  defaultSacemPaymentData,
  generateSacemPaymentHTML,
  type SacemPaymentRequestData,
  type SacemTvaMode,
} from '@/lib/invoices/sacem';

// POST /api/admin/invoices/sacem/pdf — Demande de paiement / facture Sacem (PDF)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const defaults = defaultSacemPaymentData();

    if (!body.dossierRef || body.dossierRef.includes('XXXXX')) {
      return NextResponse.json(
        { error: 'Référence dossier Sacem requise (MA01-26xxxxx ou MA03-26xxxxx)' },
        { status: 400 }
      );
    }
    if (!body.beneficiary?.siret || body.beneficiary.siret.includes('COMPLÉTER')) {
      return NextResponse.json({ error: 'SIRET du bénéficiaire requis' }, { status: 400 });
    }
    if (!body.bank?.iban || body.bank.iban.includes('XXXX')) {
      return NextResponse.json({ error: 'IBAN requis (RIB complet)' }, { status: 400 });
    }
    if (!body.bank?.bic || body.bank.bic.includes('XXXX')) {
      return NextResponse.json({ error: 'BIC requis' }, { status: 400 });
    }

    const data: SacemPaymentRequestData = {
      dossierRef: body.dossierRef,
      documentNumber: body.documentNumber || defaults.documentNumber,
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
      amount: parseFloat(body.amount) || 1500,
      tvaMode: (body.tvaMode as SacemTvaMode) || 'subvention_non_imposable',
      beneficiary: { ...defaults.beneficiary, ...body.beneficiary },
      bank: { ...defaults.bank, ...body.bank },
      aidSubject: body.aidSubject || defaults.aidSubject,
    };

    const html = generateSacemPaymentHTML(data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    });
    await browser.close();

    const slug = data.dossierRef.replace(/[^a-zA-Z0-9-]/g, '');
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sacem-${slug}-${data.documentNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur génération PDF Sacem:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
