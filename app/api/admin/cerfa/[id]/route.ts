import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';

const ASSOCIATION = {
  name: "Association Crépicordienne pour la Promotion de la Culture (ACPC)",
  shortName: "Barb'n'Rock Festival",
  rna: "W601013814",
  address: "Crèvecœur-le-Grand",
  postalCode: "60360",
  city: "Crèvecœur-le-Grand",
  country: "France",
  object: "Organisation d'événements culturels musicaux — diffusion de la culture et promotion des arts",
};

async function generateReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.partner.count({
    where: {
      receiptNumber: {
        startsWith: `RF-${year}-`,
      },
    },
  });
  const number = (count + 1).toString().padStart(4, '0');
  return `RF-${year}-${number}`;
}

function numberToWords(amount: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];

  if (amount === 0) return 'zéro euro';

  const euros = Math.floor(amount);
  const cents = Math.round((amount - euros) * 100);

  const convertGroup = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (t === 7 || t === 9) return tens[t - 1] + '-' + teens[u];
      return tens[t] + (u ? '-' + units[u] : '');
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      const hWord = h === 1 ? 'cent' : units[h] + ' cent';
      return hWord + (r ? ' ' + convertGroup(r) : '');
    }
    if (n < 1000000) {
      const th = Math.floor(n / 1000);
      const r = n % 1000;
      const thWord = th === 1 ? 'mille' : convertGroup(th) + ' mille';
      return thWord + (r ? ' ' + convertGroup(r) : '');
    }
    return n.toString();
  };

  let words = convertGroup(euros) + ' euro' + (euros > 1 ? 's' : '');
  if (cents > 0) {
    words += ' et ' + convertGroup(cents) + ' centime' + (cents > 1 ? 's' : '');
  }
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function generateCerfaHTML(partner: {
  company: string;
  contact: string;
  siret: string | null;
  address: string | null;
  donationAmount: number;
  donationDate: Date;
  receiptNumber: string;
  paymentForm?: string;
}): string {
  const today = new Date();
  const todayFr = today.toLocaleDateString('fr-FR');
  const donationDateFr = partner.donationDate.toLocaleDateString('fr-FR');

  const amountFr = partner.donationAmount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
  const amountInWords = numberToWords(partner.donationAmount);
  const amountRaw = partner.donationAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const paymentForm = partner.paymentForm || 'virement';
  const isVirement = paymentForm === 'virement';
  const isCheque = paymentForm === 'cheque';

  // Parse address for CERFA fields
  const addressParts = partner.address ? partner.address.split(',') : [];
  const streetAddress = addressParts[0]?.trim() || '';
  const cityPart = addressParts[1]?.trim() || '';
  const postalMatch = cityPart.match(/(\d{5})\s*(.*)/);
  const postalCode = postalMatch ? postalMatch[1] : '';
  const cityName = postalMatch ? postalMatch[2].trim() : cityPart;

  const checkbox = (checked: boolean) =>
    `<span style="display:inline-block;width:14px;height:14px;border:1.5px solid #333;border-radius:2px;text-align:center;line-height:12px;font-size:11px;font-weight:bold;margin-right:4px;vertical-align:middle;">${checked ? '✓' : ''}</span>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 9pt;
      line-height: 1.4;
      color: #000;
      padding: 20px 28px;
      background: white;
    }
    .page-title {
      text-align: center;
      margin-bottom: 6px;
    }
    .page-title h1 {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .page-title .subtitle {
      font-size: 9pt;
      color: #333;
      margin-top: 2px;
    }
    .cerfa-ref {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 10px;
      font-size: 8pt;
      color: #555;
    }
    .order-num {
      border: 1px solid #000;
      padding: 4px 12px;
      font-size: 9pt;
      font-weight: bold;
    }
    .section {
      border: 1.5px solid #000;
      margin-bottom: 8px;
    }
    .section-header {
      background: #d0d0d0;
      padding: 4px 8px;
      font-weight: 700;
      font-size: 9pt;
      border-bottom: 1px solid #000;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .section-body {
      padding: 8px;
    }
    .field-line {
      display: flex;
      align-items: baseline;
      margin-bottom: 5px;
      gap: 4px;
    }
    .field-label {
      font-weight: 600;
      white-space: nowrap;
      min-width: 120px;
      font-size: 9pt;
    }
    .field-value {
      border-bottom: 1px solid #555;
      flex: 1;
      padding-bottom: 1px;
      font-size: 9pt;
    }
    .field-row-2col {
      display: flex;
      gap: 16px;
      margin-bottom: 5px;
    }
    .field-row-2col .field-line {
      flex: 1;
      margin-bottom: 0;
    }
    .checkbox-list {
      padding: 6px 8px;
    }
    .checkbox-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 5px;
      gap: 6px;
    }
    .checkbox-item .chk {
      margin-top: 1px;
      flex-shrink: 0;
    }
    .checkbox-item .chk-label {
      font-size: 8.5pt;
      line-height: 1.35;
    }
    .amount-section {
      padding: 8px;
    }
    .amount-line {
      display: flex;
      align-items: baseline;
      margin-bottom: 5px;
      gap: 4px;
    }
    .amount-label {
      flex: 1;
      font-size: 9pt;
    }
    .amount-box {
      border: 1px solid #000;
      padding: 2px 8px;
      min-width: 100px;
      text-align: right;
      font-weight: bold;
      font-size: 10pt;
    }
    .amount-unit {
      font-weight: bold;
      margin-left: 4px;
    }
    .amount-words-line {
      margin: 4px 0 8px 0;
      font-size: 8.5pt;
    }
    .amount-words-value {
      border-bottom: 1px solid #555;
      display: inline-block;
      width: 100%;
      padding-bottom: 1px;
    }
    .payment-form {
      margin-top: 6px;
      font-size: 9pt;
    }
    .payment-form-label {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .payment-checkboxes {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .total-line {
      border-top: 1.5px solid #000;
      margin-top: 8px;
      padding-top: 6px;
    }
    .date-section {
      padding: 8px;
    }
    .date-field {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 5px;
    }
    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
    }
    .sig-area {
      text-align: center;
      min-width: 200px;
    }
    .sig-line {
      border-bottom: 1px solid #333;
      height: 50px;
      margin-bottom: 4px;
    }
    .sig-caption {
      font-size: 8pt;
      color: #555;
    }
    .footnotes {
      margin-top: 10px;
      font-size: 7.5pt;
      color: #555;
      border-top: 1px solid #ccc;
      padding-top: 6px;
    }
    .footnotes p { margin-bottom: 2px; }
  </style>
</head>
<body>

  <div class="cerfa-ref">
    <span>N° Cerfa : <strong>16216*03</strong> &nbsp;|&nbsp; Formulaire 2041-MEC-SD</span>
    <div class="order-num">N° d'ordre du reçu : <strong>${partner.receiptNumber}</strong></div>
  </div>

  <div class="page-title">
    <h1>Reçu des dons et versements effectués par les entreprises</h1>
    <div class="subtitle">au titre de l'article 238 bis du code général des impôts</div>
  </div>

  <div style="height:8px;"></div>

  <!-- SECTION 1: Organisme bénéficiaire -->
  <div class="section">
    <div class="section-header">Organisme bénéficiaire des dons et versements</div>
    <div class="section-body">
      <div class="field-line">
        <span class="field-label">Dénomination :</span>
        <span class="field-value">${ASSOCIATION.name}</span>
      </div>
      <div class="field-row-2col">
        <div class="field-line">
          <span class="field-label">N° RNA <sup>1</sup> :</span>
          <span class="field-value">${ASSOCIATION.rna}</span>
        </div>
      </div>
      <div class="field-line">
        <span class="field-label">Adresse — Rue :</span>
        <span class="field-value">—</span>
      </div>
      <div class="field-row-2col">
        <div class="field-line">
          <span class="field-label">N° :</span>
          <span class="field-value">—</span>
        </div>
        <div class="field-line">
          <span class="field-label">Code postal :</span>
          <span class="field-value">${ASSOCIATION.postalCode}</span>
        </div>
        <div class="field-line">
          <span class="field-label">Commune :</span>
          <span class="field-value">${ASSOCIATION.city}</span>
        </div>
      </div>
      <div class="field-line">
        <span class="field-label">Pays :</span>
        <span class="field-value">France</span>
      </div>
      <div class="field-line">
        <span class="field-label">Objet <sup>2</sup> :</span>
        <span class="field-value">${ASSOCIATION.object}</span>
      </div>
    </div>
    <div class="checkbox-list" style="border-top:1px solid #000;">
      <div style="font-size:8.5pt;font-weight:600;margin-bottom:4px;">Cochez la case qui vous concerne :</div>
      <div class="checkbox-item">
        <span class="chk">${checkbox(true)}</span>
        <span class="chk-label">
          Œuvre ou organisme d'intérêt général ayant un caractère <strong>culturel</strong> ou concourant à la diffusion de la culture
          — Précisément : ${checkbox(true)} <strong>Association loi 1901</strong>
        </span>
      </div>
      <div class="checkbox-item">
        <span class="chk">${checkbox(false)}</span>
        <span class="chk-label">Association cultuelle ou établissement public des cultes reconnus d'Alsace-Moselle</span>
      </div>
      <div class="checkbox-item">
        <span class="chk">${checkbox(false)}</span>
        <span class="chk-label">Fonds de dotation</span>
      </div>
      <div class="checkbox-item">
        <span class="chk">${checkbox(false)}</span>
        <span class="chk-label">Autres (précisez <sup>3</sup>) : ________________________________________________</span>
      </div>
    </div>
  </div>

  <!-- SECTION 2: Entreprise donatrice -->
  <div class="section">
    <div class="section-header">Entreprise donatrice</div>
    <div class="section-body">
      <div class="field-line">
        <span class="field-label">Dénomination :</span>
        <span class="field-value">${partner.company}</span>
      </div>
      <div class="field-row-2col">
        <div class="field-line">
          <span class="field-label">Forme juridique :</span>
          <span class="field-value"></span>
        </div>
        <div class="field-line">
          <span class="field-label">N° SIREN/SIRET :</span>
          <span class="field-value">${partner.siret || ''}</span>
        </div>
      </div>
      <div class="field-line">
        <span class="field-label">Adresse — N° Rue :</span>
        <span class="field-value">${streetAddress}</span>
      </div>
      <div class="field-row-2col">
        <div class="field-line">
          <span class="field-label">Code postal :</span>
          <span class="field-value">${postalCode}</span>
        </div>
        <div class="field-line">
          <span class="field-label">Commune :</span>
          <span class="field-value">${cityName}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 3: Dons et versements -->
  <div class="section">
    <div class="section-header">Dons et versements effectués par l'entreprise</div>
    <div class="amount-section">
      <div style="font-size:8.5pt;font-style:italic;margin-bottom:8px;">
        L'organisme bénéficiaire reconnaît avoir reçu, au titre de la réduction d'impôt prévue à l'article 238 bis du CGI,
        des versements pour une valeur totale égale à :
      </div>

      <div class="amount-line">
        <span class="amount-label">Montant total des versements reçus :</span>
        <span class="amount-box">${amountRaw}</span>
        <span class="amount-unit">euros</span>
      </div>

      <div class="amount-words-line">
        Indiquez le total des versements en toutes lettres :
        <div class="amount-words-value">${amountInWords}</div>
      </div>

      <div class="payment-form">
        <div class="payment-form-label">Forme des versements <sup>8</sup> :</div>
        <div class="payment-checkboxes">
          <span>${checkbox(false)} Remise d'espèces</span>
          <span>${checkbox(isCheque)} Chèque</span>
          <span>${checkbox(isVirement)} Virement, prélèvement ou carte bancaire</span>
          <span>${checkbox(false)} Autre</span>
        </div>
      </div>

      <div class="total-line">
        <div class="amount-line">
          <span class="amount-label"><strong>Montant total des dons et versements reçus par l'organisme :</strong></span>
          <span class="amount-box" style="background:#f0f0f0;">${amountRaw}</span>
          <span class="amount-unit">euros</span>
        </div>
        <div class="amount-words-line">
          Indiquez le montant total en toutes lettres :
          <div class="amount-words-value">${amountInWords}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: Date et signature -->
  <div class="section">
    <div class="section-header">Date ou période des dons et versements <sup>9</sup></div>
    <div class="date-section">
      <div class="date-field">
        <span>Date du don :</span>
        <span style="border-bottom:1px solid #555;flex:1;padding-bottom:1px;">${donationDateFr}</span>
      </div>
      <div class="signature-block">
        <div class="sig-area">
          <div class="sig-line"></div>
          <div class="sig-caption">
            Fait à ${ASSOCIATION.city}, le ${todayFr}<br>
            Signature et cachet de l'organisme bénéficiaire
          </div>
        </div>
        <div style="font-size:8pt;color:#555;max-width:220px;text-align:right;">
          <strong>${ASSOCIATION.name}</strong><br>
          N° RNA : ${ASSOCIATION.rna}<br>
          ${ASSOCIATION.postalCode} ${ASSOCIATION.city}<br><br>
          Ce reçu est à conserver par l'entreprise donatrice<br>
          à titre de justificatif fiscal.
        </div>
      </div>
    </div>
  </div>

  <!-- Footnotes -->
  <div class="footnotes">
    <p><sup>1</sup> Pour les associations inscrites d'Alsace-Moselle, numéro d'inscription au registre des associations du Tribunal d'Instance.</p>
    <p><sup>2</sup> Cochez la case qui vous concerne et précisez l'objet si nécessaire.</p>
    <p><sup>3</sup> Collectivités locales, État, GIP, établissements publics, etc.</p>
    <p><sup>8</sup> L'organisme bénéficiaire des versements peut cocher une ou plusieurs cases.</p>
    <p><sup>9</sup> L'organisme bénéficiaire peut établir un reçu unique pour plusieurs dons effectués lors d'une période déterminée.</p>
  </div>

  <div style="margin-top:8px;font-size:7.5pt;color:#888;text-align:center;">
    Réduction d'impôt pour les entreprises (art. 238 bis CGI) : 60% du montant du don dans la limite de 0,5% du CA HT
    (avec possibilité de report sur 5 exercices) — ${amountFr} versé → réduction d'impôt de ${(partner.donationAmount * 0.6).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
  </div>

</body>
</html>`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Read optional paymentForm from body
    let paymentForm = 'virement';
    try {
      const body = await request.json();
      if (body?.paymentForm) paymentForm = body.paymentForm;
    } catch {
      // no body, use default
    }

    const partner = await prisma.partner.findUnique({ where: { id } });

    if (!partner) {
      return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });
    }

    if (!partner.donationAmount) {
      return NextResponse.json({ error: 'Montant du don requis pour le CERFA' }, { status: 400 });
    }

    if (!partner.siret) {
      return NextResponse.json({ error: 'SIRET de l\'entreprise requis pour le CERFA' }, { status: 400 });
    }

    const receiptNumber = partner.receiptNumber || await generateReceiptNumber();
    const donationDate = partner.donationDate || new Date();

    await prisma.partner.update({
      where: { id },
      data: {
        receiptNumber,
        receiptDate: new Date(),
        donationDate,
      },
    });

    const html = generateCerfaHTML({
      company: partner.company,
      contact: partner.contact,
      siret: partner.siret,
      address: partner.address,
      donationAmount: partner.donationAmount,
      donationDate,
      receiptNumber,
      paymentForm,
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
      margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
    });

    await browser.close();

    const slug = partner.company.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cerfa-2041-MEC-SD-${slug}-${receiptNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur génération CERFA:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du CERFA' }, { status: 500 });
  }
}
