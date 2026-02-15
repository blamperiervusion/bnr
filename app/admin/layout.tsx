'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/benevoles', label: 'Bénévoles', icon: '🙋' },
  { href: '/admin/partenaires', label: 'Partenaires', icon: '🤝' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: '👥' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  // Fermer la sidebar quand on change de page (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Page de login - pas de layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-[#222] z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-[#222] rounded-lg transition-colors"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link href="/admin" className="text-white font-bold">
          Barb&apos;n&apos;Rock Admin
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#e53e3e] flex items-center justify-center text-white font-bold text-sm">
          {session.user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </header>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-[#222] z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <Link href="/admin" className="block">
            <h1 className="text-xl font-bold text-white">
              Barb&apos;n&apos;Rock
            </h1>
            <p className="text-sm text-gray-500">Administration</p>
          </Link>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#e53e3e]/20 text-[#e53e3e] border-r-2 border-[#e53e3e]'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 border-t border-[#222]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e53e3e] flex items-center justify-center text-white font-bold shrink-0">
              {session.user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
