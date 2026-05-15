import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function checkAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return true;
  const token = await getToken({ req: request });
  return !!token;
}

export async function POST(request: NextRequest) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté (JPG, PNG, WebP, GIF)' }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Image trop volumineuse (max 5 Mo)' }, { status: 400 });
  }

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}-${randomId}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`boutique/${filename}`, file, { access: 'public' });
    return NextResponse.json({ url: blob.url });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'boutique');
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/boutique/${filename}` });
}
