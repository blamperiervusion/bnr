import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PartnerForm from './PartnerForm';
import FormattedDate from '../../components/FormattedDate';

async function getPartner(id: string) {
  return prisma.partner.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true }
      }
    }
  });
}

async function getAdminUsers() {
  return prisma.adminUser.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [partner, adminUsers] = await Promise.all([
    getPartner(id),
    getAdminUsers()
  ]);

  if (!partner) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/partenaires"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-xl lg:text-3xl font-bold text-white truncate">{partner.company}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-[#111] border border-[#222] rounded-lg p-4 lg:p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              {partner.logo ? (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-white flex items-center justify-center p-2">
                  <Image
                    src={partner.logo}
                    alt={partner.company}
                    width={120}
                    height={120}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-[#333] flex items-center justify-center text-3xl lg:text-4xl text-white font-bold">
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
                <p className="text-white break-all">
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
              {partner.assignedTo && (
                <div>
                  <label className="text-sm text-gray-500">Géré par</label>
                  <p className="text-white">{partner.assignedTo.name}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Demande reçue le</label>
                <p className="text-white">
                  <FormattedDate date={partner.createdAt} format="long" />
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
                    <FormattedDate date={partner.receiptDate} />
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <PartnerForm partner={partner} adminUsers={adminUsers} />
        </div>
      </div>
    </div>
  );
}
