import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Types de formulaires supportés
type FormType = 'partenaire' | 'benevole' | 'contact' | 'cse';

interface BaseFormData {
  type: FormType;
  email: string;
}

interface PartenaireFormData extends BaseFormData {
  type: 'partenaire';
  company: string;
  contact: string;
  phone?: string;
  tier?: string;
  message?: string;
}

interface BenevoleFormData extends BaseFormData {
  type: 'benevole';
  name: string;
  phone?: string;
  age?: string;
  disponibilites: string[];
  missions: string[];
  experience?: string;
  message?: string;
}

interface CSEFormData extends BaseFormData {
  type: 'cse';
  company: string;
  contact: string;
  phone?: string;
  employees: string;
  pack?: string;
  message?: string;
}

interface ContactFormData extends BaseFormData {
  type: 'contact';
  name: string;
  subject?: string;
  message: string;
}

type FormData = PartenaireFormData | BenevoleFormData | CSEFormData | ContactFormData;

// Email de destination selon le type de formulaire
const RECIPIENT_EMAILS: Record<FormType, string> = {
  partenaire: process.env.EMAIL_PARTENAIRES || 'partenaires@barbnrock-festival.fr',
  benevole: process.env.EMAIL_BENEVOLES || 'benevoles@barbnrock-festival.fr',
  cse: process.env.EMAIL_CSE || 'cse@barbnrock-festival.fr',
  contact: process.env.EMAIL_CONTACT || 'contact@barbnrock-festival.fr',
};

// Génère le contenu HTML de l'email selon le type
function generateEmailContent(data: FormData): { subject: string; html: string } {
  switch (data.type) {
    case 'partenaire':
      return {
        subject: `🤝 Nouvelle demande partenariat - ${data.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e53e3e; border-bottom: 2px solid #e53e3e; padding-bottom: 10px;">
              🤝 Nouvelle demande de partenariat
            </h1>
            
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">Informations entreprise</h2>
              <p><strong>Entreprise :</strong> ${data.company}</p>
              <p><strong>Contact :</strong> ${data.contact}</p>
              <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
              ${data.tier ? `<p><strong>Formule souhaitée :</strong> ${data.tier}</p>` : ''}
            </div>
            
            ${data.message ? `
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Message</h3>
                <p style="white-space: pre-wrap;">${data.message}</p>
              </div>
            ` : ''}
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Ce message a été envoyé depuis le formulaire du site barbnrock-festival.fr
            </p>
          </div>
        `,
      };

    case 'benevole':
      return {
        subject: `🙋 Nouvelle candidature bénévole - ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #38a169; border-bottom: 2px solid #38a169; padding-bottom: 10px;">
              🙋 Nouvelle candidature bénévole
            </h1>
            
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">Informations personnelles</h2>
              <p><strong>Nom :</strong> ${data.name}</p>
              <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
              ${data.age ? `<p><strong>Âge :</strong> ${data.age}</p>` : ''}
            </div>
            
            <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #234e52;">Disponibilités</h3>
              <ul>
                ${data.disponibilites.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">Missions souhaitées</h3>
              <ul>
                ${data.missions.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
            
            ${data.experience ? `
              <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2d3748;">Expérience</h3>
                <p style="white-space: pre-wrap;">${data.experience}</p>
              </div>
            ` : ''}
            
            ${data.message ? `
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Message</h3>
                <p style="white-space: pre-wrap;">${data.message}</p>
              </div>
            ` : ''}
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Ce message a été envoyé depuis le formulaire du site barbnrock-festival.fr
            </p>
          </div>
        `,
      };

    case 'cse':
      return {
        subject: `🏢 Nouvelle demande CSE/Groupe - ${data.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3182ce; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">
              🏢 Nouvelle demande CSE/Groupe
            </h1>
            
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">Informations entreprise</h2>
              <p><strong>Entreprise :</strong> ${data.company}</p>
              <p><strong>Contact :</strong> ${data.contact}</p>
              <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
              <p><strong>Nombre de collaborateurs :</strong> ${data.employees}</p>
              ${data.pack ? `<p><strong>Pack souhaité :</strong> ${data.pack}</p>` : ''}
            </div>
            
            ${data.message ? `
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Message</h3>
                <p style="white-space: pre-wrap;">${data.message}</p>
              </div>
            ` : ''}
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Ce message a été envoyé depuis le formulaire du site barbnrock-festival.fr
            </p>
          </div>
        `,
      };

    case 'contact':
    default:
      return {
        subject: `📬 ${data.subject || 'Nouveau message'} - ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6b46c1; border-bottom: 2px solid #6b46c1; padding-bottom: 10px;">
              📬 Nouveau message de contact
            </h1>
            
            <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>De :</strong> ${data.name}</p>
              <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              ${data.subject ? `<p><strong>Sujet :</strong> ${data.subject}</p>` : ''}
            </div>
            
            <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2d3748;">Message</h3>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Ce message a été envoyé depuis le formulaire du site barbnrock-festival.fr
            </p>
          </div>
        `,
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Validation basique
    if (!data.email || !data.type) {
      return NextResponse.json(
        { error: 'Email et type de formulaire requis' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API est configurée
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      );
    }

    const { subject, html } = generateEmailContent(data);
    const recipient = RECIPIENT_EMAILS[data.type];

    // Envoyer l'email
    const { error } = await resend.emails.send({
      from: 'Barb\'n\'Rock Festival <noreply@barbnrock-festival.fr>',
      to: recipient,
      replyTo: data.email,
      subject,
      html,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    // Envoyer un email de confirmation au demandeur
    await resend.emails.send({
      from: 'Barb\'n\'Rock Festival <noreply@barbnrock-festival.fr>',
      to: data.email,
      subject: '✅ Nous avons bien reçu votre message - Barb\'n\'Rock Festival',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e53e3e;">🤘 Merci pour votre message !</h1>
          
          <p>Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
          
          <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Type de demande :</strong> ${data.type}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <p>À très bientôt au festival ! 🎸</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            L'équipe Barb'n'Rock<br>
            <a href="https://barbnrock-festival.fr">barbnrock-festival.fr</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
