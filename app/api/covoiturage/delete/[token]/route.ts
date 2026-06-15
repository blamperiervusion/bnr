import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/covoiturage/delete/[token] — suppression via token (lien email)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const offer = await prisma.carpoolOffer.findUnique({
      where: { deleteToken: token },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    await prisma.carpoolOffer.delete({ where: { deleteToken: token } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
