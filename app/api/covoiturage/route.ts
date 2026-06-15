import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Barb'n'Rock Festival <noreply@barbnrock-festival.fr>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnrock-festival.fr';

// GET /api/covoiturage — liste des annonces visibles
export async function GET() {
  try {
    const offers = await prisma.carpoolOffer.findMany({
      where: { status: 'VISIBLE' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        name: true,
        city: true,
        lat: true,
        lng: true,
        seats: true,
        days: true,
        message: true,
        createdAt: true,
      },
    });
    return NextResponse.json(offers);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/covoiturage — créer une annonce
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, city, seats, days, message, email } = body;

    if (!type || !name || !city || !days?.length || !email) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }
    if (!['DRIVER', 'PASSENGER'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }
    if (type === 'DRIVER' && (!seats || seats < 1 || seats > 9)) {
      return NextResponse.json({ error: 'Nombre de places invalide' }, { status: 400 });
    }

    // Géocodage via adresse.data.gouv.fr (gratuit, France)
    let lat: number | null = null;
    let lng: number | null = null;
    try {
      const geoRes = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}&type=municipality&limit=1`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const feature = geoData.features?.[0];
        if (feature) {
          [lng, lat] = feature.geometry.coordinates;
        }
      }
    } catch {
      // géocodage optionnel, on continue sans coordonnées
    }

    const offer = await prisma.carpoolOffer.create({
      data: {
        type,
        name: name.trim(),
        city: city.trim(),
        lat,
        lng,
        seats: type === 'DRIVER' ? Number(seats) : null,
        days,
        message: message?.trim() || null,
        email: email.trim().toLowerCase(),
        status: 'PENDING',
      },
    });

    // Email de confirmation avec lien de suppression
    const deleteUrl = `${SITE_URL}/covoiturage/supprimer/${offer.deleteToken}`;
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Barb'n'Rock 2026 — Votre annonce de covoiturage",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
          <h2 style="color: #e53e3e;">Votre annonce a bien été reçue !</h2>
          <p>Merci <strong>${name}</strong>, votre annonce de covoiturage pour Barb'n'Rock 2026 est en attente de validation.</p>
          <p>Elle sera publiée sur le site une fois vérifiée par notre équipe.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 13px; color: #555;">
            Pour supprimer votre annonce à tout moment, cliquez sur ce lien :<br/>
            <a href="${deleteUrl}" style="color: #e53e3e;">${deleteUrl}</a>
          </p>
          <p style="font-size: 12px; color: #888;">Barb'n'Rock Festival · 26-28 juin 2026 · Crèvecœur-le-Grand</p>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error('Resend error (covoiturage confirmation):', emailResult.error);
    }

    return NextResponse.json({ success: true, id: offer.id }, { status: 201 });
  } catch (err) {
    console.error('Erreur création covoiturage:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
