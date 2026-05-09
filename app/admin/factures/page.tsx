import prisma from '@/lib/prisma';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';

export const dynamic = 'force-dynamic';

async function getData() {
  const currentYear = new Date().getFullYear();

  const [freeInvoices, partnerInvoices, partners] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { invoiceDate: 'desc' },
      include: { partner: { select: { id: true, company: true } } },
    }),
    prisma.partner.findMany({
      where: { invoiceNumber: { not: null } },
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
    }),
    prisma.partner.findMany({
      select: {
        id: true,
        company: true,
        contact: true,
        siret: true,
        address: true,
        donationAmount: true,
      },
      orderBy: { company: 'asc' },
    }),
  ]);

  const totalFree = freeInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPartner = partnerInvoices.reduce((s, i) => s + (i.donationAmount || 0), 0);

  const currentYearTotal = [
    ...freeInvoices.filter((i) => new Date(i.invoiceDate).getFullYear() === currentYear),
    ...partnerInvoices.filter(
      (i) => i.invoiceDate && new Date(i.invoiceDate).getFullYear() === currentYear
    ),
  ].reduce((s, i) => s + ('totalAmount' in i ? i.totalAmount : i.donationAmount || 0), 0);

  return { freeInvoices, partnerInvoices, partners, totalFree, totalPartner, currentYearTotal, currentYear };
}

export default async function FacturesPage() {
  const { freeInvoices, partnerInvoices, partners, totalFree, totalPartner, currentYearTotal, currentYear } =
    await getData();

  const totalInvoices = freeInvoices.length + partnerInvoices.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Factures</h1>
        <p className="text-gray-500 text-sm mt-1">
          {totalInvoices} facture(s) émise(s) — gérez les factures partenaires et libres
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-[#222] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Total toutes factures</p>
          <p className="text-2xl font-bold text-white mt-1">
            {(totalFree + totalPartner).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-gray-500 text-xs mt-1">{totalInvoices} document(s)</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Exercice {currentYear}</p>
          <p className="text-2xl font-bold text-[#e53e3e] mt-1">
            {currentYearTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-gray-500 text-xs mt-1">Factures de l&apos;année en cours</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Factures libres</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {freeInvoices.length}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {totalFree.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      {/* Liste */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Toutes les factures</h2>
        <InvoiceList
          freeInvoices={freeInvoices.map((i) => ({
            ...i,
            invoiceDate: i.invoiceDate.toISOString(),
          }))}
          partnerInvoices={partnerInvoices.map((p) => ({
            ...p,
            invoiceNumber: p.invoiceNumber!,
            invoiceDate: p.invoiceDate ? p.invoiceDate.toISOString() : new Date().toISOString(),
          }))}
        />
      </div>

      {/* Formulaire nouvelle facture */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Créer une nouvelle facture</h2>
        <InvoiceForm partners={partners} />
      </div>
    </div>
  );
}
