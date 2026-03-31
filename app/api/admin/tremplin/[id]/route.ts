import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function sendRejectionEmail(band: { bandName: string; contactName: string; contactEmail: string }) {
  const r = getResend();
  if (!r) return false;

  try {
    await r.emails.send({
      from: 'Barb\'n\'Rock Festival <noreply@barbnrock-festival.fr>',
      to: band.contactEmail,
      subject: `Tremplin Barb'n'Rock 2026 - ${band.bandName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1f25 0%, #0d0e12 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header img { max-width: 120px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
            .highlight { background: linear-gradient(135deg, #E85D04 0%, #FF7A29 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .code { font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 10px 0; }
            .discount { font-size: 14px; opacity: 0.9; }
            .cta { display: inline-block; background: #E85D04; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            h1 { color: #1a1f25; margin-top: 0; }
            .emoji { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://barbnrock-festival.fr/images/logo.png" alt="Barb'n'Rock Festival">
          </div>
          <div class="content">
            <h1>Salut ${band.contactName} 🤘</h1>
            
            <p>Merci à <strong>${band.bandName}</strong> d'avoir candidaté au Tremplin Barb'n'Rock 2026 !</p>
            
            <p>Après étude de toutes les candidatures, nous avons le regret de vous informer que votre groupe n'a pas été retenu pour la sélection finale cette année.</p>
            
            <p>La décision a été difficile car nous avons reçu de nombreuses candidatures de qualité. Ne vous découragez pas, continuez à jouer et à créer !</p>
            
            <h2 class="emoji">🎸 On veut quand même vous voir !</h2>
            
            <p><strong>Venez nous retrouver lors de la journée Tremplin le 4 avril à partir de 14h</strong> sur le parking du Leclerc à Crèvecœur-le-Grand. L'entrée est gratuite et l'ambiance sera au rendez-vous !</p>
            
            <p>Et parce qu'on aimerait vraiment vous voir au festival en juin, voici un <strong>code promo exclusif</strong> :</p>
            
            <div class="highlight">
              <div class="discount">30% DE RÉDUCTION</div>
              <div class="code">TREMPLIN26</div>
              <div class="discount">sur l'ensemble de la billetterie</div>
            </div>
            
            <p style="text-align: center;">
              <a href="https://www.helloasso.com/associations/acpc/evenements/barb-n-rock-festival-2026" class="cta">
                Réserver mes places
              </a>
            </p>
            
            <p>📅 <strong>Festival :</strong> 26, 27 & 28 juin 2026<br>
            📍 <strong>Lieu :</strong> Crèvecœur-le-Grand (60) - 1h de Paris</p>
            
            <p>On espère vous croiser très vite ! 🤘</p>
            
            <p><em>L'équipe Barb'n'Rock</em></p>
          </div>
          <div class="footer">
            <p>
              <a href="https://barbnrock-festival.fr">Site web</a> · 
              <a href="https://instagram.com/barbnrock">Instagram</a> · 
              <a href="https://facebook.com/barbnrockfestival">Facebook</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Erreur envoi email rejection tremplin:', error);
    return false;
  }
}

// GET /api/admin/tremplin/[id] - Détail d'un groupe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const band = await prisma.tremplinBand.findUnique({
    where: { id },
  });

  if (!band) {
    return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 });
  }

  return NextResponse.json(band);
}

// PATCH /api/admin/tremplin/[id] - Mise à jour d'un groupe
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const currentBand = await prisma.tremplinBand.findUnique({
    where: { id },
  });

  if (!currentBand) {
    return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 });
  }

  const band = await prisma.tremplinBand.update({
    where: { id },
    data: body,
  });

  let emailSent = false;

  if (body.status === 'REJECTED' && currentBand.status !== 'REJECTED' && !currentBand.rejectionEmailSent) {
    emailSent = await sendRejectionEmail({
      bandName: band.bandName,
      contactName: band.contactName,
      contactEmail: band.contactEmail,
    });

    if (emailSent) {
      await prisma.tremplinBand.update({
        where: { id },
        data: { rejectionEmailSent: true },
      });
    }
  }

  return NextResponse.json({ ...band, emailSent });
}

// DELETE /api/admin/tremplin/[id] - Suppression d'un groupe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.tremplinBand.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
