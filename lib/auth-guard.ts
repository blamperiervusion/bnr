import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Vérifie qu'une requête API est authentifiée par un JWT NextAuth valide.
 * Retourne une NextResponse 401 si non authentifié, null si OK.
 *
 * Usage dans un Route Handler :
 *   const authError = await requireAdmin(request);
 *   if (authError) return authError;
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
}
