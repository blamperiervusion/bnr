import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction non trouvée' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.isReconciled !== undefined) updateData.isReconciled = data.isReconciled;
    if (data.exerciceYear !== undefined) updateData.exerciceYear = data.exerciceYear;
    if (data.label !== undefined) updateData.label = data.label;
    if (data.date !== undefined) updateData.date = new Date(data.date);

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
