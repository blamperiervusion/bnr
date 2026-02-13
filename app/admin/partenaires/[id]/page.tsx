import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PartnerForm from './PartnerForm';

async function getPartner(id: string) {
  return prisma.partner.findUnique({
    where: { id },
  });
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartner(id);

  if (!partner) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/partenaires"
          className="text-gray-400 hover:text-white transition-colors"
        >
          &larr; Retour
        </Link>
        <h1 className="text-3xl font-bold text-white">{partner.company}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-[#222] rounded-lg p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              {partner.logo ? (
                <div className="w-32 h-32 rounded-lg bg-white flex items-center justify-center p-2">
                  <Image
                    src={partner.logo}
                    alt={partner.company}
                    width={120}
                    height={120}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-[#333] flex items-center justify-center text-4xl text-white font-bold">
                  {partner.company.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Contact</label>
                <p className="text-white">{partner.contact}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-white">
                  <a href={`mailto:${partner.email}`} className="hover:text-[#e53e3e]">
                    {partner.email}
                  </a>
                </p>
              </div>
              {partner.phone && (
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p className="text-white">
                    <a href={`tel:${partner.phone}`} className="hover:text-[#e53e3e]">
                      {partner.phone}
                    </a>
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Demande reçue le</label>
                <p className="text-white">
                  {new Date(partner.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Message original */}
            {partner.message && (
              <div className="mt-6">
                <label className="text-sm text-gray-500 block mb-2">Message initial</label>
                <p className="text-gray-300 text-sm whitespace-pre-wrap bg-[#0a0a0a] p-3 rounded-lg">
                  {partner.message}
                </p>
              </div>
            )}

            {/* Reçu fiscal */}
            {partner.receiptNumber && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <label className="text-sm text-green-400 block mb-2">Reçu fiscal émis</label>
                <p className="text-white font-mono">N° {partner.receiptNumber}</p>
                {partner.receiptDate && (
                  <p className="text-gray-400 text-sm">
                    {new Date(partner.receiptDate).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <PartnerForm partner={partner} />
        </div>
      </div>
    </div>
  );
}
