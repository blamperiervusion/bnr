import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/admin/upload - Upload d'images (admin)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    // Validation de la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 2MB)' }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const folder = type === 'volunteer-photo' ? 'volunteers' : 'partners';
    const filename = `${timestamp}.${extension}`;

    // Si BLOB_READ_WRITE_TOKEN est configuré, utiliser Vercel Blob (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${filename}`, file, {
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    }

    // Sinon, stocker localement (développement)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // Créer le dossier s'il n'existe pas
    await mkdir(uploadDir, { recursive: true });

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Retourner l'URL relative
    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
