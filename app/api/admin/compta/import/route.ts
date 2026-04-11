import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { parseCSV, parseManualEntry } from '@/lib/compta/parsers/csv-parser';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const manualText = formData.get('manualText') as string | null;
    const exerciceYear = parseInt(formData.get('exerciceYear') as string) || new Date().getFullYear();

    let result: { 
      transactions: Array<{ date: Date; valueDate?: Date; label: string; amount: number; type: 'debit' | 'credit'; suggestedCategory?: string }>; 
      period: { start?: Date; end?: Date }; 
      accountNumber?: string;
      debug?: string;
    };
    let sourceFileName = 'manual';

    if (manualText) {
      // Parse manual text entry
      const transactions = parseManualEntry(manualText);
      result = { transactions, period: {} };
    } else if (file) {
      sourceFileName = file.name;
      const fileName = file.name.toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        // Parse CSV file
        const text = buffer.toString('utf-8');
        result = parseCSV(text);
      } else if (fileName.endsWith('.pdf')) {
        // Try PDF parsing
        try {
          const { parseCreditAgricoleStatement } = await import('@/lib/compta/parsers/credit-agricole');
          result = await parseCreditAgricoleStatement(buffer);
        } catch (err) {
          return NextResponse.json({
            error: 'Le fichier PDF n\'a pas pu être lu',
            details: String(err),
          }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: 'Format de fichier non supporté. Utilisez CSV ou PDF.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Fichier ou texte requis' }, { status: 400 });
    }

    if (result.transactions.length === 0) {
      return NextResponse.json({
        error: 'Aucune transaction trouvée dans le fichier',
        details: result.debug || 'Le format du relevé n\'est peut-être pas reconnu. Essayez la saisie manuelle.',
      }, { status: 400 });
    }

    // Get categories for suggested mapping
    const categories = await prisma.comptaCategory.findMany();
    const categoryMap = new Map(categories.map(c => [c.code, c.id]));

    // Create transactions
    const created: string[] = [];
    const skipped: string[] = [];

    for (const t of result.transactions) {
      // Check for duplicates
      const existing = await prisma.transaction.findFirst({
        where: {
          date: t.date,
          amount: new Decimal(t.amount),
          label: t.label,
          type: t.type,
        },
      });

      if (existing) {
        skipped.push(`${t.date.toLocaleDateString('fr-FR')} - ${t.label}`);
        continue;
      }

      // Get category ID if suggested
      const categoryId = t.suggestedCategory ? categoryMap.get(t.suggestedCategory) : undefined;

      await prisma.transaction.create({
        data: {
          date: t.date,
          valueDate: t.valueDate,
          label: t.label,
          amount: new Decimal(t.amount),
          type: t.type,
          categoryId: categoryId || null,
          sourceFile: sourceFileName,
          exerciceYear,
        },
      });

      created.push(`${t.date.toLocaleDateString('fr-FR')} - ${t.label}`);
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      skipped: skipped.length,
      details: {
        created,
        skipped,
      },
      period: result.period,
      accountNumber: result.accountNumber,
    });
  } catch (error) {
    console.error('Error importing transactions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'import', details: String(error) },
      { status: 500 }
    );
  }
}
