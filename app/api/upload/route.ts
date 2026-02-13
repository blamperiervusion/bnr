import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/upload - Upload public pour photos de profil bénévoles
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    // Validation du type de fichier (images uniquement)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Seules les images sont autorisées (JPG, PNG, GIF, WebP)' }, { status: 400 });
    }

    // Validation de la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Image trop volumineuse (max 2MB)' }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomId}.${extension}`;

    // Si BLOB_READ_WRITE_TOKEN est configuré, utiliser Vercel Blob (production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`volunteers/${filename}`, file, {
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    }

    // Sinon, stocker localement (développement)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'volunteers');
    
    // Créer le dossier s'il n'existe pas
    await mkdir(uploadDir, { recursive: true });

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Retourner l'URL relative
    return NextResponse.json({ url: `/uploads/volunteers/${filename}` });
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
