import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const stand = await prisma.villageStand.findUnique({
    where: { id },
  });

  if (!stand) {
    return NextResponse.json({ error: 'Stand non trouvé' }, { status: 404 });
  }

  return NextResponse.json(stand);
}

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

  const stand = await prisma.villageStand.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(stand);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.villageStand.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
