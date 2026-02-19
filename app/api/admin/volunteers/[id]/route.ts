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

async function sendValidationEmail(volunteer: { name: string; email: string }) {
  const r = getResend();
  if (!r) return;

  await r.emails.send({
    from: "Barb'n'Rock Festival <noreply@barbnrock-festival.fr>",
    to: volunteer.email,
    subject: '🎉 Ta candidature bénévole est validée ! - Barb\'n\'Rock 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #38a169;">🎉 Félicitations ${volunteer.name} !</h1>
        
        <p style="font-size: 16px;">Ta candidature pour devenir <strong>bénévole au Barb'n'Rock 2026</strong> a été <span style="color: #38a169; font-weight: bold;">validée</span> !</p>
        
        <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38a169;">
          <h3 style="margin-top: 0; color: #234e52;">📋 Prochaines étapes</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Tu recevras bientôt un email avec ton <strong>affectation d'équipe</strong></li>
            <li>Une réunion de briefing sera organisée avant le festival</li>
            <li>Tu recevras toutes les infos pratiques par email</li>
          </ul>
        </div>
        
        <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📅 Dates du festival</h3>
          <p style="margin: 0;"><strong>26, 27 et 28 juin 2026</strong><br>Crèvecœur-le-Grand (60)</p>
        </div>
        
        <p>Des questions ? Réponds directement à cet email ou écris-nous à <a href="mailto:barbnrock.festival@gmail.com">barbnrock.festival@gmail.com</a></p>
        
        <p style="margin-top: 30px;">À très bientôt ! 🤘</p>
        
        <p style="color: #666; font-size: 14px;">
          L'équipe Barb'n'Rock<br>
          <a href="https://barbnrock-festival.fr">barbnrock-festival.fr</a>
        </p>
      </div>
    `,
  });
}

async function sendTeamAssignmentEmail(volunteer: { name: string; email: string; team: string }) {
  const r = getResend();
  if (!r) return;

  await r.emails.send({
    from: "Barb'n'Rock Festival <noreply@barbnrock-festival.fr>",
    to: volunteer.email,
    subject: '📋 Ton affectation bénévole - Barb\'n\'Rock 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00E5CC;">📋 Ton affectation est prête !</h1>
        
        <p style="font-size: 16px;">Salut ${volunteer.name} !</p>
        
        <p>Ton équipe pour le <strong>Barb'n'Rock 2026</strong> a été définie :</p>
        
        <div style="background: linear-gradient(135deg, #00E5CC20, #E85D0420); padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Tu fais partie de l'équipe</p>
          <h2 style="margin: 10px 0; color: #E85D04; font-size: 32px;">${volunteer.team}</h2>
        </div>
        
        <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">ℹ️ Informations importantes</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Tu recevras les détails de tes shifts avant le festival</li>
            <li>Une réunion de briefing sera organisée pour ton équipe</li>
            <li>N'oublie pas de prévoir des vêtements confortables !</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">🎁 Rappel : tes avantages</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Pass 3 jours offert</li>
            <li>Repas inclus pendant tes shifts</li>
            <li>T-shirt bénévole exclusif</li>
            <li>Accès au camping bénévoles</li>
          </ul>
        </div>
        
        <p>Des questions sur ton affectation ? Réponds directement à cet email !</p>
        
        <p style="margin-top: 30px;">On a hâte de te voir ! 🤘</p>
        
        <p style="color: #666; font-size: 14px;">
          L'équipe Barb'n'Rock<br>
          <a href="https://barbnrock-festival.fr">barbnrock-festival.fr</a>
        </p>
      </div>
    `,
  });
}

// GET /api/admin/volunteers/[id] - Détail d'un bénévole
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
  });

  if (!volunteer) {
    return NextResponse.json({ error: 'Bénévole non trouvé' }, { status: 404 });
  }

  return NextResponse.json(volunteer);
}

// PATCH /api/admin/volunteers/[id] - Mise à jour d'un bénévole
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

  // Récupérer l'état actuel du bénévole
  const currentVolunteer = await prisma.volunteer.findUnique({
    where: { id },
  });

  if (!currentVolunteer) {
    return NextResponse.json({ error: 'Bénévole non trouvé' }, { status: 404 });
  }

  // Validation des champs autorisés
  const allowedFields = ['status', 'team', 'notes'];
  const data: Record<string, unknown> = {};
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field] === '' ? null : body[field];
    }
  }

  try {
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data,
    });

    // Envoyer un email si le statut passe à VALIDATED
    if (body.status === 'VALIDATED' && currentVolunteer.status !== 'VALIDATED') {
      try {
        await sendValidationEmail({ name: volunteer.name, email: volunteer.email });
      } catch (emailError) {
        console.error('Erreur envoi email validation:', emailError);
      }
    }

    // Envoyer un email si une équipe est affectée (et que le bénévole est validé)
    // Ou si resendAssignment est true (renvoi manuel)
    const shouldSendAssignmentEmail = volunteer.status === 'VALIDATED' && volunteer.team && (
      (body.team && body.team !== currentVolunteer.team) || body.resendAssignment
    );
    
    if (shouldSendAssignmentEmail) {
      try {
        await sendTeamAssignmentEmail({ 
          name: volunteer.name, 
          email: volunteer.email, 
          team: volunteer.team!
        });
      } catch (emailError) {
        console.error('Erreur envoi email affectation:', emailError);
      }
    }

    return NextResponse.json(volunteer);
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE /api/admin/volunteers/[id] - Suppression d'un bénévole
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.volunteer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
