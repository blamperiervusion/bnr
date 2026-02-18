import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Allowed PDF files for security
const ALLOWED_FILES: Record<string, string> = {
  'presse/dossier-presse.pdf': 'communication/dossiers/presse/dossier-presse.pdf',
  'partenaires/dossier-partenaires.pdf': 'communication/dossiers/partenaires/dossier-partenaires.pdf',
  'cse-groupes/dossier-cse-groupes.pdf': 'communication/dossiers/cse-groupes/dossier-cse-groupes.pdf',
  'bilan/bilan-2025.pdf': 'communication/dossiers/bilan/bilan-2025.pdf',
};

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get filename from query params
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('file');

  if (!filename) {
    return NextResponse.json({ error: 'No file specified' }, { status: 400 });
  }

  // Check if file is allowed
  const relativePath = ALLOWED_FILES[filename];
  if (!relativePath) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Build full path
  const filePath = path.join(process.cwd(), relativePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
  }

  // Read file
  const fileBuffer = fs.readFileSync(filePath);
  const fileBasename = path.basename(filePath);

  // Return file as download
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileBasename}"`,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
