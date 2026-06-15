'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SupprimerAnnoncePage() {
  const params = useParams();
  const token = params?.token as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'notfound'>('loading');

  useEffect(() => {
    if (!token) return;
    fetch(`/api/covoiturage/delete/${token}`, { method: 'DELETE' })
      .then(async res => {
        if (res.ok) setStatus('success');
        else if (res.status === 404) setStatus('notfound');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <p className="text-3xl mb-4">⏳</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Suppression en cours…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-4xl mb-4">✅</p>
            <h1 className="font-display text-2xl uppercase tracking-wide mb-2" style={{ color: 'var(--foreground)' }}>
              Annonce supprimée
            </h1>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Votre annonce de covoiturage a bien été supprimée.
            </p>
            <Link
              href="/covoiturage"
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent-red)', color: '#fff' }}
            >
              Retour aux annonces
            </Link>
          </>
        )}
        {status === 'notfound' && (
          <>
            <p className="text-4xl mb-4">🤷</p>
            <h1 className="font-display text-2xl uppercase tracking-wide mb-2" style={{ color: 'var(--foreground)' }}>
              Introuvable
            </h1>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Ce lien est invalide ou l&apos;annonce a déjà été supprimée.
            </p>
            <Link
              href="/covoiturage"
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent-red)', color: '#fff' }}
            >
              Retour aux annonces
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-4xl mb-4">❌</p>
            <h1 className="font-display text-2xl uppercase tracking-wide mb-2" style={{ color: 'var(--foreground)' }}>
              Erreur
            </h1>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Une erreur s&apos;est produite. Réessayez ou contactez-nous.
            </p>
            <Link
              href="/covoiturage"
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent-red)', color: '#fff' }}
            >
              Retour aux annonces
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
