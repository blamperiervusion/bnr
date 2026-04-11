import { extractText, getDocumentProxy } from 'unpdf';

export interface ParsedTransaction {
  date: Date;
  valueDate?: Date;
  label: string;
  amount: number;
  type: 'debit' | 'credit';
  suggestedCategory?: string;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  period: {
    start?: Date;
    end?: Date;
  };
  accountNumber?: string;
  openingBalance?: number;
  closingBalance?: number;
  debug?: string;
}

const categoryKeywords: Record<string, string[]> = {
  '701': ['helloasso', 'billetterie'],
  '662': ['stripe', 'commission'],
  '661': ['frais', 'agios', 'cotisation compte', 'com carte'],
  '613': ['amazon', 'fnac', 'cdiscount'],
  '741': ['mairie', 'commune'],
  '742': ['departement', 'conseil departemental'],
  '743': ['region', 'conseil regional'],
  '744': ['cnm', 'drac', 'ministere'],
};

function suggestCategory(label: string): string | undefined {
  const lowerLabel = label.toLowerCase();
  for (const [code, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerLabel.includes(kw))) {
      return code;
    }
  }
  return undefined;
}

function parseAmount(amountStr: string): number {
  const cleaned = amountStr.replace(/\s/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export async function parseCreditAgricoleStatement(buffer: Buffer): Promise<ParseResult> {
  const debugInfo: string[] = [];
  let text = '';

  try {
    // Use unpdf to extract text from PDF
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text: extractedText } = await extractText(pdf, { mergePages: true });
    text = extractedText;
    debugInfo.push(`unpdf extracted ${text.length} chars`);
  } catch (err) {
    debugInfo.push(`unpdf error: ${err}`);
    return {
      transactions: [],
      period: {},
      debug: debugInfo.join('\n'),
    };
  }

  debugInfo.push(`Text preview: ${text.substring(0, 300).replace(/\n/g, '\\n')}`);

  const transactions: ParsedTransaction[] = [];
  
  // Split text into lines - unpdf sometimes doesn't preserve line breaks
  // So we also split on transaction patterns (DD.MM DD.MM)
  let processedText = text;
  // Add line breaks before transaction patterns
  processedText = processedText.replace(/(\d{2}\.\d{2})\s+(\d{2}\.\d{2})\s+/g, '\n$1 $2 ');
  // Add line breaks before common section markers
  processedText = processedText.replace(/(Ancien solde|Nouveau solde|Total des opérations)/g, '\n$1');
  
  const lines = processedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let accountNumber: string | undefined;
  let openingBalance: number | undefined;
  let closingBalance: number | undefined;
  let periodEnd: Date | undefined;
  let isCardStatement = false;

  // Detect statement type and parse header
  for (const line of lines) {
    if (line.includes('Relevé carte business') || line.includes('carte Business')) {
      isCardStatement = true;
    }

    // Account number - look for 11-digit number after "n°"
    if (line.includes('n°')) {
      const match = line.match(/n°\s*(\d{11})/);
      if (match) accountNumber = match[1];
    }

    // Period end date - multiple formats
    if (line.includes('au ') || line.includes("arrêté") || line.includes('porteur au')) {
      // Try DD.MM.YYYY format
      let dateMatch = line.match(/au\s+(\d{2})\.(\d{2})\.(\d{4})/);
      if (dateMatch) {
        periodEnd = new Date(
          parseInt(dateMatch[3]),
          parseInt(dateMatch[2]) - 1,
          parseInt(dateMatch[1])
        );
      }

      // Try "31 Janvier 2025" format
      if (!periodEnd) {
        const months: Record<string, number> = {
          'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
          'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
        };
        dateMatch = line.match(/(\d{1,2})\s+(Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre)\s+(\d{4})/i);
        if (dateMatch) {
          periodEnd = new Date(
            parseInt(dateMatch[3]),
            months[dateMatch[2].toLowerCase()],
            parseInt(dateMatch[1])
          );
        }
      }
    }

    // Opening balance - format: "Ancien solde créditeur au DD.MM.YYYY X XXX,XX"
    if (line.includes('Ancien solde')) {
      // Extract the amount at the end, after any date
      const amountMatch = line.match(/\d{4}\s+([\d\s]+,\d{2})/);
      if (amountMatch) {
        openingBalance = parseAmount(amountMatch[1]);
      }
    }

    // Closing balance - format: "Nouveau solde créditeur au DD.MM.YYYY X XXX,XX"  
    if (line.includes('Nouveau solde')) {
      const amountMatch = line.match(/\d{4}\s+([\d\s]+,\d{2})/);
      if (amountMatch) {
        closingBalance = parseAmount(amountMatch[1]);
      }
    }
  }

  // Try to extract period end from full text if not found in lines
  if (!periodEnd) {
    // Try "au DD.MM.YYYY" anywhere in text
    const dateMatch = text.match(/au\s+(\d{2})\.(\d{2})\.(\d{4})/);
    if (dateMatch) {
      periodEnd = new Date(
        parseInt(dateMatch[3]),
        parseInt(dateMatch[2]) - 1,
        parseInt(dateMatch[1])
      );
    }
  }
  
  const year = periodEnd?.getFullYear() || new Date().getFullYear();
  debugInfo.push(`Year: ${year}, isCardStatement: ${isCardStatement}`);

  if (isCardStatement) {
    // Parse card statement format - multiple patterns
    // The text might have merged amount and date: "6,9923.12" means "6,99" amount on "23.12"
    
    // Try to find transactions in the full text
    // Pattern: Label followed by amount,date merged (e.g., "AMAZON PRIME FR 75PAYLI2469664/ 6,9923.12")
    const cardTxPattern = /([A-Z][A-Z0-9\s\/\-\.]+?)\s+(\d{1,3}(?:\s\d{3})*,\d{2})(\d{2}\.\d{2})/g;
    let match;
    
    while ((match = cardTxPattern.exec(text)) !== null) {
      const label = match[1].trim();
      const amount = parseAmount(match[2]);
      const dateStr = match[3];
      const [day, month] = dateStr.split('.');
      const date = new Date(year, parseInt(month) - 1, parseInt(day));
      
      // Skip if looks like header or total
      if (label.includes('TOTAL') || label.includes('Commerce') || 
          label.includes('Carte 5137') || label.length < 3) continue;
      
      if (amount > 0) {
        transactions.push({
          date,
          label,
          amount,
          type: 'debit',
          suggestedCategory: suggestCategory(label),
        });
      }
    }
    
    debugInfo.push(`Card statement: found ${transactions.length} transactions`);
  } else {
    // Parse regular bank statement format
    // Format: DD.MM DD.MM Libellé MONTANT [¨]
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip header/footer lines
      if (line.includes('Date') && line.includes('opé')) continue;
      if (line.includes('Libellé des opérations')) continue;
      if (line.includes('Total des opérations')) continue;
      if (line.includes('Ancien solde') || line.includes('Nouveau solde')) continue;
      if (line.includes('CREDIT AGRICOLE') || line.includes('CAISSE REGIONALE')) continue;

      // Match transaction: DD.MM DD.MM ...
      const txMatch = line.match(/^(\d{2}\.\d{2})\s+(\d{2}\.\d{2})\s+(.+)/);
      if (txMatch) {
        const dateStr = txMatch[1];
        const valueDateStr = txMatch[2];
        let rest = txMatch[3];

        let label = '';
        let amount = 0;
        let isCredit = false;

        // Check if amount is in current line (with or without ¨ for credit)
        // Amount format: space-separated digits, comma, 2 decimal digits
        // Credit marker is ¨ after the amount
        // We need to find the LAST occurrence since labels can contain numbers
        
        // Match amount at end: captures number with decimal
        // Handles both simple (725,00) and thousands-separated (4 028,47) formats
        // The amount must NOT be preceded by a slash (to avoid dates like 31/12/24)
        const amountPattern = /(?:^|\s)(\d{1,3}(?:\s\d{3})*,\d{2})\s*(¨)?$/;
        const amountInLine = rest.match(amountPattern);
        
        if (amountInLine) {
          amount = parseAmount(amountInLine[1]);
          isCredit = amountInLine[2] === '¨';
          // Get everything before the matched pattern as the label
          label = rest.substring(0, rest.length - amountInLine[0].length).trim();
        } else {
          // Amount might be on following lines
          label = rest;

          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const nextLine = lines[j];

            // Stop if we hit another transaction
            if (/^\d{2}\.\d{2}\s+\d{2}\.\d{2}/.test(nextLine)) break;

            // Check for amount
            const nextAmount = nextLine.match(/^(\d[\d\s]*,\d{2})\s*(¨)?$/);
            if (nextAmount) {
              amount = parseAmount(nextAmount[1]);
              isCredit = nextAmount[2] === '¨';
              break;
            }

            // Add to label if it's additional description
            if (!nextLine.includes('Total') &&
                !nextLine.includes('solde') &&
                !nextLine.includes('CREDIT AGRICOLE')) {
              label += ' ' + nextLine;
            }
          }
        }

        label = label.replace(/\s+/g, ' ').trim();

        // Detect transaction type from keywords (more reliable than ¨ symbol)
        const lowerLabel = label.toLowerCase();
        
        // Keywords indicating credits (incoming money)
        const creditKeywords = [
          'remise carte', 'remise cheque', 'remise chèque',
          'helloasso', 'stripe',
          'subvention', 'aide',
          'virement recu', 'virement reçu',
          'avoir', 'remboursement'
        ];
        
        // Keywords indicating debits (outgoing money)
        const debitKeywords = [
          'prlv', 'prelevement', 'prélèvement',
          'depenses carte', 'dépenses carte',
          'vir inst vers', 'virement vers',
          'com carte', 'commission',
          'frais', 'agios',
          'cheque', 'chèque',
          'retrait', 'retrait dab',
          'achat carte', 'paiement carte',
          'cotisation', 'abonnement',
          'echeance', 'échéance',
          'facture'
        ];
        
        // Check for debits first (more specific patterns)
        isCredit = true; // default to credit
        for (const keyword of debitKeywords) {
          if (lowerLabel.includes(keyword)) {
            isCredit = false;
            break;
          }
        }
        
        // Override with credit keywords if present
        for (const keyword of creditKeywords) {
          if (lowerLabel.includes(keyword)) {
            isCredit = true;
            break;
          }
        }

        if (amount > 0) {
          const [day, month] = dateStr.split('.');
          const date = new Date(year, parseInt(month) - 1, parseInt(day));
          const [vDay, vMonth] = valueDateStr.split('.');
          const valueDate = new Date(year, parseInt(vMonth) - 1, parseInt(vDay));

          // Avoid duplicates
          const isDupe = transactions.some(t =>
            t.date.getTime() === date.getTime() &&
            Math.abs(t.amount - amount) < 0.01 &&
            t.type === (isCredit ? 'credit' : 'debit')
          );

          if (!isDupe) {
            transactions.push({
              date,
              valueDate,
              label,
              amount,
              type: isCredit ? 'credit' : 'debit',
              suggestedCategory: suggestCategory(label),
            });
          }
        }
      }
    }
  }

  debugInfo.push(`Found ${transactions.length} transactions`);

  return {
    transactions,
    period: {
      start: periodEnd ? new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1) : undefined,
      end: periodEnd,
    },
    accountNumber,
    openingBalance,
    closingBalance,
    debug: debugInfo.join('\n'),
  };
}

export function formatTransactionsForImport(
  result: ParseResult,
  exerciceYear: number,
  sourceFile: string
) {
  return result.transactions.map(t => ({
    date: t.date,
    valueDate: t.valueDate,
    label: t.label,
    amount: t.amount,
    type: t.type,
    suggestedCategoryCode: t.suggestedCategory,
    exerciceYear,
    sourceFile,
  }));
}
