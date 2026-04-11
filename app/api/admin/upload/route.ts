import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const uploadConfig: Record<string, { folder: string; allowedTypes: string[]; maxSize: number }> = {
  'volunteer-photo': { folder: 'volunteers', allowedTypes: IMAGE_TYPES, maxSize: 2 * 1024 * 1024 },
  'partner-logo': { folder: 'partners', allowedTypes: IMAGE_TYPES, maxSize: 2 * 1024 * 1024 },
  'village-logo': { folder: 'village', allowedTypes: IMAGE_TYPES, maxSize: 2 * 1024 * 1024 },
  'band-image': { folder: 'bands', allowedTypes: IMAGE_TYPES, maxSize: 2 * 1024 * 1024 },
  'band-techrider': { folder: 'bands/techriders', allowedTypes: DOCUMENT_TYPES, maxSize: 10 * 1024 * 1024 },
  'band-contract': { folder: 'bands/contracts', allowedTypes: DOCUMENT_TYPES, maxSize: 10 * 1024 * 1024 },
  'compta-releve': { folder: 'compta/releves', allowedTypes: DOCUMENT_TYPES, maxSize: 10 * 1024 * 1024 },
};

// POST /api/admin/upload - Upload de fichiers (admin)
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

    // Récupérer la configuration pour ce type
    const config = uploadConfig[type] || { 
      folder: 'uploads', 
      allowedTypes: IMAGE_TYPES, 
      maxSize: 2 * 1024 * 1024 
    };

    // Validation du type de fichier
    if (!config.allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    // Validation de la taille
    if (file.size > config.maxSize) {
      const maxMB = config.maxSize / 1024 / 1024;
      return NextResponse.json({ error: `Fichier trop volumineux (max ${maxMB}MB)` }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const folder = config.folder;
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
