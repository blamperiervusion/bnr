'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'carpool_banner_dismissed_2026';

export default function CarpoolBanner({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const show = !dismissed && !pathname?.startsWith('/covoiturage');
    setVisible(show);
    onVisibilityChange?.(show);
  }, [pathname, onVisibilityChange]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    onVisibilityChange?.(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-center gap-3 px-4 text-xs font-medium"
      style={{
        height: 36,
        background: 'linear-gradient(90deg, #b91c1c, #e53e3e, #b91c1c)',
        color: '#fff',
        zIndex: 60,
      }}
    >
      <span>🚗</span>
      <span>
        L&apos;essence coûte cher —{' '}
        <Link
          href="/covoiturage"
          className="underline underline-offset-2 font-bold hover:no-underline transition-all"
        >
          organisez votre covoiturage pour le festival !
        </Link>
      </span>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  );
}
