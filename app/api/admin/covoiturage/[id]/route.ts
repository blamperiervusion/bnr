import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

// PATCH /api/admin/covoiturage/[id] — mettre à jour le statut ou la position
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, city } = body;

    if (status) {
      if (!['PENDING', 'VISIBLE', 'HIDDEN'].includes(status)) {
        return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
      }
      const offer = await prisma.carpoolOffer.update({ where: { id }, data: { status } });
      return NextResponse.json(offer);
    }

    if (city) {
      let lat: number | null = null;
      let lng: number | null = null;
      try {
        const geoRes = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}&type=municipality&limit=1`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const feature = geoData.features?.[0];
          if (feature) [lng, lat] = feature.geometry.coordinates;
        }
      } catch { /* géocodage optionnel */ }

      const offer = await prisma.carpoolOffer.update({
        where: { id },
        data: { city: city.trim(), lat, lng },
      });
      return NextResponse.json({ ...offer, geocoded: lat !== null });
    }

    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/admin/covoiturage/[id] — supprimer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.carpoolOffer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
