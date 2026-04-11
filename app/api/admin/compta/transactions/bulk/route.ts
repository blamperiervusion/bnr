import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const { ids, exerciceYear, categoryId, type } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs requis' }, { status: 400 });
    }

    // Build update data based on what's provided
    const updateData: Record<string, unknown> = {};
    
    if (exerciceYear !== undefined) {
      updateData.exerciceYear = exerciceYear;
    }
    
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId || null;
    }
    
    if (type !== undefined && (type === 'debit' || type === 'credit')) {
      updateData.type = type;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Aucune modification spécifiée' }, { status: 400 });
    }

    const result = await prisma.transaction.updateMany({
      where: {
        id: { in: ids },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error('Error bulk updating transactions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs requis' }, { status: 400 });
    }

    const result = await prisma.transaction.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
    });
  } catch (error) {
    console.error('Error bulk deleting transactions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
