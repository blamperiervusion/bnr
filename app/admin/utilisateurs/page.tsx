import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getUsers() {
  return prisma.adminUser.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { partners: true }
      }
    }
  });
}

export default async function UtilisateursPage() {
  const users = await getUsers();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} utilisateur(s)</p>
        </div>
        <Link
          href="/admin/utilisateurs/nouveau"
          className="px-4 py-2 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors text-center"
        >
          + Ajouter
        </Link>
      </div>

      {/* Users list */}
      {users.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucun utilisateur pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/utilisateurs/${user.id}`}
              className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#e53e3e]/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e53e3e] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{user.name}</h3>
                  <p className="text-gray-500 text-sm truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#222] rounded text-xs text-gray-400">
                      {user.role}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {user._count.partners} partenaire(s)
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
