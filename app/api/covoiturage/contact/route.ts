import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Barb'n'Rock Festival <noreply@barbnrock-festival.fr>";

// POST /api/covoiturage/contact — contact proxy (n'expose pas l'email du propriétaire)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offerId, senderName, senderEmail, message } = body;

    if (!offerId || !senderName || !senderEmail || !message) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const offer = await prisma.carpoolOffer.findFirst({
      where: { id: offerId, status: 'VISIBLE' },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }

    const offerType = offer.type === 'DRIVER' ? 'conducteur' : 'passager';
    const days = offer.days.join(', ');

    await resend.emails.send({
      from: FROM_EMAIL,
      to: offer.email,
      replyTo: senderEmail,
      subject: `Barb'n'Rock 2026 — Message de covoiturage de ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
          <h2 style="color: #e53e3e;">Quelqu'un a vu votre annonce de covoiturage !</h2>
          <p>Bonjour <strong>${offer.name}</strong>,</p>
          <p>
            <strong>${senderName}</strong> a vu votre annonce de covoiturage en tant que
            <strong>${offerType}</strong> depuis <strong>${offer.city}</strong> (${days})
            et souhaite vous contacter.
          </p>
          <div style="background: #f9f9f9; border-left: 3px solid #e53e3e; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-style: italic;">"${message}"</p>
          </div>
          <p>Pour répondre, utilisez directement cet email : <strong>${senderEmail}</strong></p>
          <p style="font-size: 12px; color: #888; margin-top: 24px;">
            Barb'n'Rock Festival · 26-28 juin 2026 · Crèvecœur-le-Grand
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur contact covoiturage:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
