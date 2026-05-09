export const ASSOCIATION = {
  name: "Association Crépicordienne pour la Promotion de la Culture (ACPC)",
  shortName: "Barb'n'Rock Festival",
  rna: "W601013814",
  address: "Crèvecœur-le-Grand",
  postalCode: "60360",
  city: "Crèvecœur-le-Grand",
  email: "barbnrock.festival@gmail.com",
  website: "barnrock-festival.fr",
};

export interface InvoiceLine {
  description: string;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  paymentDate?: Date | null;
  clientName: string;
  clientSiret?: string | null;
  clientAddress?: string | null;
  clientContact?: string | null;
  lines: InvoiceLine[];
  totalAmount: number;
  notes?: string | null;
}

export function numberToWords(amount: number): string {
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

export function generateInvoiceHTML(data: InvoiceData): string {
  const issueDateFr = data.invoiceDate.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const paymentDateFr = data.paymentDate
    ? data.paymentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const totalFr = data.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const amountInWords = numberToWords(data.totalAmount);

  const linesHtml = data.lines.map((line, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#333;font-size:10pt;">${i + 1}. ${line.description}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#333;font-size:10pt;white-space:nowrap;">
        ${line.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Helvetica','Arial',sans-serif; font-size:11pt; line-height:1.5; color:#1a1a1a; padding:40px; background:white; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:3px solid #e53e3e; }
    .logo { font-size:22pt; font-weight:900; color:#e53e3e; }
    .sub { font-size:9pt; color:#555; margin-top:2px; }
    .assoc-details { margin-top:10px; font-size:8.5pt; color:#666; line-height:1.6; }
    .invoice-meta { text-align:right; }
    .doc-type { font-size:20pt; font-weight:700; color:#1a1a1a; text-transform:uppercase; letter-spacing:2px; }
    .invoice-num { font-size:11pt; color:#e53e3e; font-weight:600; margin-top:4px; }
    .invoice-date { font-size:9pt; color:#666; margin-top:2px; }
    .parties { display:flex; justify-content:space-between; gap:40px; margin:32px 0; }
    .party-block { flex:1; padding:16px; background:#f9f9f9; border-radius:6px; border-left:3px solid #e53e3e; }
    .party-block.client { border-left-color:#333; }
    .party-title { font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:8px; }
    .party-name { font-size:12pt; font-weight:700; color:#1a1a1a; }
    .party-detail { font-size:9pt; color:#555; margin-top:3px; }
    table.lines { width:100%; border-collapse:collapse; margin-bottom:24px; }
    table.lines thead tr { background:#1a1a1a; color:white; }
    table.lines thead th { padding:10px 12px; text-align:left; font-size:9pt; text-transform:uppercase; letter-spacing:0.5px; }
    table.lines thead th:last-child { text-align:right; }
    .totals { display:flex; justify-content:flex-end; margin-top:8px; }
    .totals-box { width:280px; }
    .total-row { display:flex; justify-content:space-between; padding:6px 0; font-size:10pt; border-bottom:1px solid #eee; }
    .total-row.main { background:#e53e3e; color:white; font-weight:700; font-size:12pt; padding:10px 12px; border-radius:4px; border-bottom:none; margin-top:4px; }
    .total-row.tva-note { font-size:8.5pt; color:#888; border-bottom:none; font-style:italic; }
    .amount-words { margin:16px 0; font-size:9.5pt; color:#555; font-style:italic; padding:10px 16px; background:#f5f5f5; border-radius:4px; }
    .payment-info { margin:24px 0; padding:16px; background:#f9f9f9; border-radius:6px; font-size:9.5pt; }
    .payment-info strong { display:block; font-size:9pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:8px; }
    .legal { margin-top:32px; padding:16px; border:1px solid #ddd; border-radius:6px; font-size:8pt; color:#777; line-height:1.7; }
    .legal-title { font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; color:#555; }
    .footer { margin-top:32px; padding-top:16px; border-top:1px solid #eee; font-size:8pt; color:#aaa; text-align:center; }
    .notes-block { margin-top:20px; padding:12px 16px; background:#fff8f0; border:1px solid #e53e3e30; border-radius:6px; font-size:9pt; color:#555; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">${ASSOCIATION.shortName}</div>
      <div class="sub">${ASSOCIATION.name}</div>
      <div class="assoc-details">
        Siège social : ${ASSOCIATION.address}, ${ASSOCIATION.postalCode}<br>
        N° RNA : ${ASSOCIATION.rna}<br>
        ${ASSOCIATION.email}
      </div>
    </div>
    <div class="invoice-meta">
      <div class="doc-type">Facture</div>
      <div class="invoice-num">N° ${data.invoiceNumber}</div>
      <div class="invoice-date">Émise le ${issueDateFr}</div>
      ${paymentDateFr ? `<div class="invoice-date" style="margin-top:4px;">Date de règlement : ${paymentDateFr}</div>` : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party-block">
      <div class="party-title">Émetteur</div>
      <div class="party-name">${ASSOCIATION.shortName}</div>
      <div class="party-detail">${ASSOCIATION.name}</div>
      <div class="party-detail">RNA : ${ASSOCIATION.rna}</div>
      <div class="party-detail">${ASSOCIATION.address}, ${ASSOCIATION.postalCode}</div>
      <div class="party-detail">${ASSOCIATION.email}</div>
    </div>
    <div class="party-block client">
      <div class="party-title">Client</div>
      <div class="party-name">${data.clientName}</div>
      ${data.clientSiret ? `<div class="party-detail">SIRET : ${data.clientSiret}</div>` : ''}
      ${data.clientContact ? `<div class="party-detail">Contact : ${data.clientContact}</div>` : ''}
      ${data.clientAddress ? `<div class="party-detail">${data.clientAddress}</div>` : ''}
    </div>
  </div>

  <table class="lines">
    <thead>
      <tr>
        <th style="width:80%;">Désignation</th>
        <th>Montant</th>
      </tr>
    </thead>
    <tbody>
      ${linesHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="total-row">
        <span>Total HT</span>
        <span>${totalFr}</span>
      </div>
      <div class="total-row tva-note">
        <span>TVA non applicable — art. 293 B CGI</span>
        <span>0,00 €</span>
      </div>
      <div class="total-row main">
        <span>Total TTC</span>
        <span>${totalFr}</span>
      </div>
    </div>
  </div>

  <div class="amount-words">
    Arrêtée la présente facture à la somme de : <strong>${amountInWords}</strong>
  </div>

  <div class="payment-info">
    <strong>Informations de règlement</strong>
    ${paymentDateFr ? `Date de règlement : ${paymentDateFr}<br>` : ''}
    Modalités : Virement bancaire ou chèque à l'ordre de « Barb'n'Rock Festival »<br>
    En cas de retard de paiement : pénalités au taux légal en vigueur + indemnité forfaitaire de 40 € (art. L.441-10 C.Com).
  </div>

  ${data.notes ? `<div class="notes-block"><strong>Notes :</strong> ${data.notes}</div>` : ''}

  <div class="legal">
    <div class="legal-title">Mentions légales</div>
    Association loi 1901 — N° RNA ${ASSOCIATION.rna} — Siège social : ${ASSOCIATION.address}, ${ASSOCIATION.postalCode}<br>
    TVA non applicable en vertu de l'article 293 B du Code Général des Impôts.<br>
    Toute contestation devra être formulée par écrit dans un délai de 8 jours suivant réception de la facture.<br>
    En cas de litige, compétence exclusive du Tribunal de Commerce d'Amiens.
  </div>

  <div class="footer">
    ${ASSOCIATION.name} — ${ASSOCIATION.email} — ${ASSOCIATION.website}
  </div>
</body>
</html>`;
}
