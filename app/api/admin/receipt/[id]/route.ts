import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';

// Générer un numéro de reçu unique
async function generateReceiptNumber(): Promise<string> {
  const year = new Date().getFullYear();
  
  // Compter les reçus déjà émis cette année
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

// Template HTML du reçu fiscal
function generateReceiptHTML(partner: {
  company: string;
  contact: string;
  siret: string | null;
  address: string | null;
  donationAmount: number;
  donationDate: Date;
  receiptNumber: string;
}): string {
  const formattedDate = partner.donationDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const formattedAmount = partner.donationAmount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

  // Montant en lettres (simplifié)
  const amountInWords = numberToWords(partner.donationAmount);

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #1a1a1a;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e53e3e;
        }
        .logo {
          font-size: 24pt;
          font-weight: bold;
          color: #e53e3e;
        }
        .logo-sub {
          font-size: 10pt;
          color: #666;
        }
        .receipt-info {
          text-align: right;
        }
        .receipt-number {
          font-size: 14pt;
          font-weight: bold;
          color: #e53e3e;
        }
        .title {
          text-align: center;
          margin: 30px 0;
        }
        .title h1 {
          font-size: 18pt;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .title p {
          font-size: 10pt;
          color: #666;
          margin-top: 5px;
        }
        .section {
          margin: 30px 0;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 8px;
        }
        .section-title {
          font-weight: bold;
          color: #e53e3e;
          margin-bottom: 10px;
          text-transform: uppercase;
          font-size: 10pt;
          letter-spacing: 1px;
        }
        .info-row {
          display: flex;
          margin: 8px 0;
        }
        .info-label {
          width: 150px;
          font-weight: 500;
          color: #666;
        }
        .info-value {
          flex: 1;
        }
        .amount-box {
          background: #e53e3e;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 30px 0;
        }
        .amount {
          font-size: 24pt;
          font-weight: bold;
        }
        .amount-words {
          font-size: 10pt;
          margin-top: 5px;
          font-style: italic;
        }
        .legal {
          font-size: 9pt;
          color: #666;
          margin-top: 40px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .legal-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .signature {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        .signature-block {
          text-align: center;
        }
        .signature-line {
          width: 200px;
          border-bottom: 1px solid #333;
          margin: 40px auto 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 9pt;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Barb'n'Rock Festival</div>
          <div class="logo-sub">Association loi 1901</div>
          <div class="logo-sub" style="margin-top: 10px;">
            Siège social : Crèvecœur-le-Grand, 60360<br>
            N° RNA : W601234567<br>
            Email : barbnrock.festival@gmail.com
          </div>
        </div>
        <div class="receipt-info">
          <div class="receipt-number">${partner.receiptNumber}</div>
          <div style="margin-top: 5px; color: #666; font-size: 10pt;">
            Émis le ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      <div class="title">
        <h1>Reçu au titre des dons</h1>
        <p>Article 200 et 238 bis du Code Général des Impôts</p>
      </div>

      <div class="section">
        <div class="section-title">Bénéficiaire du don</div>
        <div class="info-row">
          <span class="info-label">Association :</span>
          <span class="info-value">Barb'n'Rock Festival</span>
        </div>
        <div class="info-row">
          <span class="info-label">Objet :</span>
          <span class="info-value">Organisation d'événements culturels musicaux</span>
        </div>
        <div class="info-row">
          <span class="info-label">Adresse :</span>
          <span class="info-value">Crèvecœur-le-Grand, 60360</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Donateur</div>
        <div class="info-row">
          <span class="info-label">Entreprise :</span>
          <span class="info-value">${partner.company}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Représentant :</span>
          <span class="info-value">${partner.contact}</span>
        </div>
        ${partner.siret ? `
        <div class="info-row">
          <span class="info-label">SIRET :</span>
          <span class="info-value">${partner.siret}</span>
        </div>
        ` : ''}
        ${partner.address ? `
        <div class="info-row">
          <span class="info-label">Adresse :</span>
          <span class="info-value">${partner.address}</span>
        </div>
        ` : ''}
      </div>

      <div class="amount-box">
        <div class="amount">${formattedAmount}</div>
        <div class="amount-words">${amountInWords}</div>
      </div>

      <div class="section">
        <div class="section-title">Nature du don</div>
        <div class="info-row">
          <span class="info-label">Type :</span>
          <span class="info-value">Don en numéraire</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date du don :</span>
          <span class="info-value">${formattedDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Mode de versement :</span>
          <span class="info-value">Virement bancaire / Chèque</span>
        </div>
      </div>

      <div class="legal">
        <div class="legal-title">Mentions légales obligatoires</div>
        <p>
          L'association Barb'n'Rock Festival certifie sur l'honneur que les dons et versements 
          qu'elle reçoit ouvrent droit à la réduction d'impôt prévue aux articles 200 et 238 bis 
          du Code Général des Impôts.
        </p>
        <p style="margin-top: 10px;">
          <strong>Pour les entreprises (article 238 bis) :</strong> Réduction d'impôt égale à 60% 
          du montant du don, dans la limite de 0,5% du chiffre d'affaires HT (report possible sur 5 ans).
        </p>
        <p style="margin-top: 10px;">
          <strong>Pour les particuliers (article 200) :</strong> Réduction d'impôt égale à 66% 
          du montant du don, dans la limite de 20% du revenu imposable.
        </p>
      </div>

      <div class="signature">
        <div class="signature-block">
          <div class="signature-line"></div>
          <div>Le Président</div>
          <div style="font-size: 10pt; color: #666;">Barb'n'Rock Festival</div>
        </div>
        <div class="signature-block">
          <div style="margin-top: 50px; color: #666; font-size: 10pt;">
            Fait à Crèvecœur-le-Grand<br>
            Le ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      <div class="footer">
        Barb'n'Rock Festival - Association loi 1901 - N° RNA : W601234567<br>
        Ce document est à conserver en tant que justificatif fiscal
      </div>
    </body>
    </html>
  `;
}

// Conversion simplifiée du montant en lettres
function numberToWords(amount: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];

  if (amount === 0) return 'zéro euro';

  let words = '';
  const euros = Math.floor(amount);
  const cents = Math.round((amount - euros) * 100);

  const convertGroup = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (t === 7 || t === 9) {
        return tens[t - 1] + '-' + teens[u];
      }
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

  words = convertGroup(euros) + ' euro' + (euros > 1 ? 's' : '');
  
  if (cents > 0) {
    words += ' et ' + convertGroup(cents) + ' centime' + (cents > 1 ? 's' : '');
  }

  return words.charAt(0).toUpperCase() + words.slice(1);
}

// POST /api/admin/receipt/[id] - Générer le reçu fiscal
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
    // Récupérer le partenaire
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });
    }

    // Vérifications
    if (!partner.donationAmount) {
      return NextResponse.json({ error: 'Montant du don requis' }, { status: 400 });
    }

    // Générer le numéro de reçu si pas déjà existant
    const receiptNumber = partner.receiptNumber || await generateReceiptNumber();
    const donationDate = partner.donationDate || new Date();

    // Mettre à jour le partenaire avec le numéro de reçu
    await prisma.partner.update({
      where: { id },
      data: {
        receiptNumber,
        receiptDate: new Date(),
        donationDate,
      },
    });

    // Générer le HTML
    const html = generateReceiptHTML({
      company: partner.company,
      contact: partner.contact,
      siret: partner.siret,
      address: partner.address,
      donationAmount: partner.donationAmount,
      donationDate: donationDate,
      receiptNumber,
    });

    // Générer le PDF avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    await browser.close();

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recu-fiscal-${partner.company.replace(/\s+/g, '-')}-${receiptNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur génération reçu:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du reçu' }, { status: 500 });
  }
}
