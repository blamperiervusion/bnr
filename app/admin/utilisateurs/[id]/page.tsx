import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserForm from './UserForm';

async function getUser(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    include: {
      partners: {
        select: {
          id: true,
          company: true,
          status: true,
          tier: true,
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export default async function UtilisateurDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/utilisateurs"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">{user.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2">
          <UserForm user={user} />
        </div>

        {/* Sidebar - Partners */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-[#222] rounded-lg p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Partenaires assignés ({user.partners.length})
            </h2>
            
            {user.partners.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun partenaire assigné</p>
            ) : (
              <div className="space-y-2">
                {user.partners.map((partner) => (
                  <Link
                    key={partner.id}
                    href={`/admin/partenaires/${partner.id}`}
                    className="block p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <p className="text-white text-sm font-medium truncate">{partner.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {partner.tier && (
                        <span className="text-gray-500 text-xs">{partner.tier}</span>
                      )}
                      <span className={`text-xs ${
                        partner.status === 'VALIDATED' ? 'text-green-500' :
                        partner.status === 'PENDING' ? 'text-yellow-500' :
                        partner.status === 'CONTACTED' ? 'text-blue-500' :
                        'text-red-500'
                      }`}>
                        {partner.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
