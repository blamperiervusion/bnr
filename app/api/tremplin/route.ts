import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/tremplin - Inscription d'un groupe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      bandName,
      genre,
      city,
      formationYear,
      contactName,
      contactEmail,
      contactPhone,
      members,
      bio,
      youtubeLink,
      spotifyLink,
      bandcampLink,
      facebookLink,
      instagramLink,
      otherLink,
      photoUrl,
      demoUrl,
      motivation,
    } = body;

    // Validation des champs obligatoires
    if (!bandName || !genre || !city || !contactName || !contactEmail || !contactPhone || !bio) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Vérifier qu'au moins un lien musical est fourni
    if (!youtubeLink && !spotifyLink && !bandcampLink && !otherLink) {
      return NextResponse.json(
        { error: 'Au moins un lien vers votre musique est requis (YouTube, Spotify, Bandcamp ou autre)' },
        { status: 400 }
      );
    }

    // Créer l'inscription
    const band = await prisma.tremplinBand.create({
      data: {
        bandName,
        genre,
        city,
        formationYear: formationYear ? parseInt(formationYear) : null,
        contactName,
        contactEmail,
        contactPhone,
        members: typeof members === 'string' ? members : JSON.stringify(members),
        bio,
        youtubeLink: youtubeLink || null,
        spotifyLink: spotifyLink || null,
        bandcampLink: bandcampLink || null,
        facebookLink: facebookLink || null,
        instagramLink: instagramLink || null,
        otherLink: otherLink || null,
        photoUrl: photoUrl || null,
        demoUrl: demoUrl || null,
        motivation: motivation || null,
      },
    });

    return NextResponse.json({ success: true, id: band.id }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription tremplin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
