import { ASSOCIATION, numberToWords } from '@/lib/invoices/pdf';

/** Destinataire fixe — mémo financier Sacem Festivals/salles 2026 */
export const SACEM = {
  name: 'Sacem',
  legalName:
    "Société des auteurs, compositeurs et éditeurs de musique (Sacem)",
  address: '225 avenue Charles-de-Gaulle',
  postalCode: '92528',
  city: 'Neuilly-sur-Seine Cedex',
  siret: '775 675 739 03131',
  tva: 'FR 42 775 675 739',
};

export type SacemTvaMode = 'subvention_non_imposable' | 'facture_avec_tva';

export interface SacemPaymentRequestData {
  /** Référence dossier MA01-26xxxxx ou MA03-26xxxxx */
  dossierRef: string;
  documentNumber: string;
  invoiceDate: Date;
  amount: number;
  tvaMode: SacemTvaMode;
  /** Bénéficiaire de la convention (ACPC) */
  beneficiary: {
    legalForm: string;
    siret: string;
    addressLine: string;
    postalCode: string;
    city: string;
    contactName: string;
    phone: string;
    email: string;
  };
  bank: {
    accountHolder: string;
    iban: string;
    bic: string;
    bankName?: string;
  };
  /** Objet de l'aide (libellé convention) */
  aidSubject: string;
}

const TVA_MENTIONS: Record<SacemTvaMode, { title: string; lines: string[] }> = {
  subvention_non_imposable: {
    title: 'Demande de paiement',
    lines: [
      "Nature de l'opération : aide financière accordée par la Sacem dans le cadre de l'Action culturelle — programme Festivals et salles 2026.",
      "Après analyse des conditions d'octroi (mémo financier Sacem 2026), cette subvention constitue une aide sans contrepartie et n'est pas soumise à la TVA.",
      'TVA non applicable — montant total demandé ci-dessous.',
    ],
  },
  facture_avec_tva: {
    title: 'Facture',
    lines: [
      "Nature de l'opération : aide financière Action culturelle — Festivals et salles 2026.",
      'TVA applicable au taux de 20 % (prestation de services rendue au sens du mémo financier Sacem 2026).',
      'Montant total TTC ne dépassant pas le montant alloué par la convention signée.',
    ],
  },
};

export function generateSacemPaymentHTML(data: SacemPaymentRequestData): string {
  const meta = TVA_MENTIONS[data.tvaMode];
  const issueDateFr = data.invoiceDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const amountFr = data.amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
  const amountWords = numberToWords(data.amount);
  const tvaLines = meta.lines.map((l) => `<li>${l}</li>`).join('');

  const ht =
    data.tvaMode === 'facture_avec_tva'
      ? Math.round((data.amount / 1.2) * 100) / 100
      : data.amount;
  const tvaAmount =
    data.tvaMode === 'facture_avec_tva' ? data.amount - ht : 0;
  const htFr = ht.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const tvaFr = tvaAmount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Helvetica','Arial',sans-serif; font-size:10.5pt; line-height:1.5; color:#1a1a1a; padding:36px 40px; background:white; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:20px; border-bottom:3px solid #e53e3e; }
    .logo { font-size:20pt; font-weight:900; color:#e53e3e; }
    .sub { font-size:9pt; color:#555; margin-top:2px; }
    .doc-meta { text-align:right; max-width:280px; }
    .doc-type { font-size:16pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#1a1a1a; }
    .doc-num { font-size:10pt; color:#e53e3e; font-weight:600; margin-top:6px; }
    .doc-date { font-size:9pt; color:#666; margin-top:4px; }
    .dossier-ref { margin-top:10px; padding:8px 12px; background:#fff3cd; border:1px solid #ffc107; border-radius:4px; font-size:10pt; font-weight:700; color:#856404; text-align:right; }
    .parties { display:flex; gap:24px; margin:24px 0; }
    .party { flex:1; padding:14px 16px; background:#f9f9f9; border-radius:6px; border-left:3px solid #333; }
    .party.beneficiary { border-left-color:#e53e3e; }
    .party-title { font-size:7.5pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:8px; }
    .party-name { font-size:11pt; font-weight:700; }
    .party-detail { font-size:9pt; color:#555; margin-top:3px; }
    .object-block { margin:20px 0; padding:14px 16px; background:#f0f7ff; border-left:4px solid #1a56db; border-radius:0 6px 6px 0; }
    .object-block strong { font-size:8pt; text-transform:uppercase; letter-spacing:0.5px; color:#1a56db; display:block; margin-bottom:6px; }
    .tva-block { margin:16px 0; padding:12px 16px; border:1px solid #ddd; border-radius:6px; font-size:9pt; color:#444; }
    .tva-block ul { margin:8px 0 0 18px; line-height:1.6; }
    table.amount { width:100%; border-collapse:collapse; margin:20px 0; }
    table.amount td { padding:12px 14px; border:1px solid #ddd; font-size:10pt; }
    table.amount .label { background:#f5f5f5; font-weight:600; width:55%; }
    table.amount .value { text-align:right; font-weight:700; }
    table.amount .total { background:#e53e3e; color:white; font-size:12pt; }
    .amount-words { font-size:9.5pt; color:#555; font-style:italic; padding:10px 14px; background:#f5f5f5; border-radius:4px; margin-bottom:20px; }
    .rib-block { margin:20px 0; padding:16px; background:#e8f5e9; border:2px solid #2e7d32; border-radius:6px; }
    .rib-block .rib-title { font-size:9pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#1b5e20; margin-bottom:10px; }
    .rib-row { display:flex; margin:6px 0; font-size:10pt; }
    .rib-label { font-weight:600; width:120px; color:#333; }
    .rib-value { font-family:'Courier New',monospace; font-weight:700; letter-spacing:0.5px; }
    .reminder { margin-top:24px; padding:12px 16px; font-size:8.5pt; color:#666; background:#fafafa; border-radius:6px; line-height:1.7; }
    .footer { margin-top:28px; padding-top:12px; border-top:1px solid #eee; font-size:8pt; color:#999; text-align:center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">${ASSOCIATION.shortName}</div>
      <div class="sub">${ASSOCIATION.name}</div>
      <div class="sub" style="margin-top:8px;">RNA : ${ASSOCIATION.rna}</div>
    </div>
    <div class="doc-meta">
      <div class="doc-type">${meta.title}</div>
      <div class="doc-num">N° ${data.documentNumber}</div>
      <div class="doc-date">Date d'émission : ${issueDateFr}</div>
      <div class="dossier-ref">Dossier Sacem : ${data.dossierRef}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party beneficiary">
      <div class="party-title">Bénéficiaire de l'aide (émetteur de la pièce)</div>
      <div class="party-name">${data.beneficiary.legalForm}</div>
      <div class="party-detail">${ASSOCIATION.name}</div>
      <div class="party-detail">${data.beneficiary.addressLine}</div>
      <div class="party-detail">${data.beneficiary.postalCode} ${data.beneficiary.city}</div>
      <div class="party-detail">SIRET : ${data.beneficiary.siret}</div>
      <div class="party-detail">Contact : ${data.beneficiary.contactName}</div>
      <div class="party-detail">Tél. : ${data.beneficiary.phone}</div>
      <div class="party-detail">Email : ${data.beneficiary.email}</div>
    </div>
    <div class="party">
      <div class="party-title">Destinataire — Sacem</div>
      <div class="party-name">${SACEM.name}</div>
      <div class="party-detail">${SACEM.legalName}</div>
      <div class="party-detail">${SACEM.address}</div>
      <div class="party-detail">${SACEM.postalCode} ${SACEM.city}</div>
      <div class="party-detail">SIRET : ${SACEM.siret}</div>
      <div class="party-detail">TVA intracom. : ${SACEM.tva}</div>
    </div>
  </div>

  <div class="object-block">
    <strong>Objet de l'aide accordée</strong>
    ${data.aidSubject}
  </div>

  <div class="tva-block">
    <strong>Mentions relatives à la TVA</strong>
    <ul>${tvaLines}</ul>
  </div>

  <table class="amount">
    <tr>
      <td class="label">Désignation</td>
      <td class="value" style="text-align:left;font-weight:400;">Versement de l'aide financière conventionnée — Barb'n'Rock Festival 2026</td>
    </tr>
    ${
      data.tvaMode === 'facture_avec_tva'
        ? `<tr><td class="label">Montant HT</td><td class="value">${htFr}</td></tr>
           <tr><td class="label">TVA 20 %</td><td class="value">${tvaFr}</td></tr>`
        : ''
    }
    <tr>
      <td class="label total">Montant total${data.tvaMode === 'facture_avec_tva' ? ' TTC' : ''} demandé</td>
      <td class="value total">${amountFr}</td>
    </tr>
  </table>

  <div class="amount-words">
    Arrêté le présent document à la somme de : <strong>${amountWords}</strong>
  </div>

  <div class="rib-block">
    <div class="rib-title">Coordonnées bancaires du bénéficiaire (RIB — virement Sacem)</div>
    <div class="rib-row"><span class="rib-label">Titulaire :</span><span class="rib-value">${data.bank.accountHolder}</span></div>
    ${data.bank.bankName ? `<div class="rib-row"><span class="rib-label">Établissement :</span><span>${data.bank.bankName}</span></div>` : ''}
    <div class="rib-row"><span class="rib-label">IBAN :</span><span class="rib-value">${data.bank.iban}</span></div>
    <div class="rib-row"><span class="rib-label">BIC :</span><span class="rib-value">${data.bank.bic}</span></div>
  </div>

  <div class="reminder">
    <strong>Rappel (mémo financier Sacem 2026)</strong><br>
    • Joindre le RIB en pièce jointe de l'email à <em>action.culturelle.regions@sacem.fr</em><br>
    • Indiquer le n° de dossier <strong>${data.dossierRef}</strong> dans l'objet du mail<br>
    • Convention signée électroniquement (Docapost) requise avant traitement<br>
    • Pièce à transmettre avant le <strong>1er décembre 2026</strong>
  </div>

  <div class="footer">
    ${ASSOCIATION.name} — ${ASSOCIATION.email}
  </div>
</body>
</html>`;
}

/** Valeurs par défaut ACPC — compléter SIRET, RIB et n° dossier avant génération */
export function defaultSacemPaymentData(
  overrides: Partial<SacemPaymentRequestData> = {}
): SacemPaymentRequestData {
  return {
    dossierRef: 'MA01-26XXXXX',
    documentNumber: `DP-SACEM-2026-001`,
    invoiceDate: new Date(),
    amount: 1500,
    tvaMode: 'subvention_non_imposable',
    beneficiary: {
      legalForm: 'Association loi 1901',
      siret: 'À COMPLÉTER',
      addressLine: ASSOCIATION.address,
      postalCode: ASSOCIATION.postalCode,
      city: ASSOCIATION.city,
      contactName: 'Benjamin Lampérier',
      phone: 'À COMPLÉTER',
      email: ASSOCIATION.email,
    },
    bank: {
      accountHolder: ASSOCIATION.name,
      iban: 'FR76 XXXX XXXX XXXX XXXX XXXX XXX',
      bic: 'XXXXXXXX',
      bankName: 'À COMPLÉTER',
    },
    aidSubject:
      "Aide financière Action culturelle de la Sacem — programme Festivals et salles 2026, au titre de l'organisation du Barb'n'Rock Festival (26, 27 et 28 juin 2026, Crèvecœur-le-Grand, Oise). Montant alloué par convention : 1 500,00 €.",
    ...overrides,
  };
}
