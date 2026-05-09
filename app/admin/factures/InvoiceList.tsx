'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FreeInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  totalAmount: number;
  paymentMethod: string | null;
  partner: { id: string; company: string } | null;
}

interface PartnerInvoice {
  id: string;
  company: string;
  contact: string;
  invoiceNumber: string;
  invoiceDate: string;
  donationAmount: number | null;
  tier: string | null;
}

interface InvoiceListProps {
  freeInvoices: FreeInvoice[];
  partnerInvoices: PartnerInvoice[];
}

export default function InvoiceList({ freeInvoices, partnerInvoices }: InvoiceListProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadPdf = async (id: string, filename: string) => {
    setDownloading(id);
    try {
      const res = await fetch(`/api/admin/invoices/${id}/pdf`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } finally {
      setDownloading(null);
    }
  };

  const downloadPartnerInvoice = async (partnerId: string, company: string) => {
    setDownloading(`partner-${partnerId}`);
    try {
      const res = await fetch(`/api/admin/invoice/${partnerId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${company.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } finally {
      setDownloading(null);
    }
  };

  const allItems = [
    ...freeInvoices.map((inv) => ({
      key: inv.id,
      type: 'free' as const,
      invoiceNumber: inv.invoiceNumber,
      date: new Date(inv.invoiceDate),
      clientName: inv.clientName,
      amount: inv.totalAmount,
      source: inv.partner ? `Partenaire : ${inv.partner.company}` : 'Facture libre',
      id: inv.id,
      partnerId: null as string | null,
    })),
    ...partnerInvoices.map((p) => ({
      key: `partner-${p.id}`,
      type: 'partner' as const,
      invoiceNumber: p.invoiceNumber!,
      date: p.invoiceDate ? new Date(p.invoiceDate) : new Date(),
      clientName: p.company,
      amount: p.donationAmount || 0,
      source: 'Via fiche partenaire',
      id: p.id,
      partnerId: p.id,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (allItems.length === 0) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
        <p className="text-gray-500">Aucune facture émise pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0a0a0a] border-b border-[#222]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">N° Facture</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Client</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Origine</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Montant</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {allItems.map((item) => (
            <tr key={item.key} className="hover:bg-[#1a1a1a] transition-colors">
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-[#e53e3e] font-semibold">
                  {item.invoiceNumber}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 text-sm">
                {item.date.toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3">
                {item.partnerId ? (
                  <Link
                    href={`/admin/partenaires/${item.partnerId}`}
                    className="text-white hover:text-[#e53e3e] transition-colors font-medium"
                  >
                    {item.clientName}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.clientName}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.type === 'partner'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {item.source}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-white font-semibold">
                {item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </td>
              <td className="px-4 py-3">
                {item.type === 'free' ? (
                  <button
                    onClick={() => downloadPdf(item.id, `facture-${item.invoiceNumber}.pdf`)}
                    disabled={downloading === item.id}
                    className="px-3 py-1.5 text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition-colors disabled:opacity-50"
                  >
                    {downloading === item.id ? '…' : '⬇ PDF'}
                  </button>
                ) : (
                  <button
                    onClick={() => downloadPartnerInvoice(item.id, item.clientName)}
                    disabled={downloading === `partner-${item.id}`}
                    className="px-3 py-1.5 text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition-colors disabled:opacity-50"
                  >
                    {downloading === `partner-${item.id}` ? '…' : '⬇ PDF'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-3 bg-[#0a0a0a] border-t border-[#222] flex justify-between items-center">
        <span className="text-gray-500 text-sm">{allItems.length} facture(s)</span>
        <span className="text-white font-semibold">
          Total :{' '}
          {allItems
            .reduce((sum, i) => sum + i.amount, 0)
            .toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>
    </div>
  );
}
