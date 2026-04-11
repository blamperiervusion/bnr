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
}

const categoryKeywords: Record<string, string[]> = {
  '701': ['helloasso', 'billetterie'],
  '662': ['stripe', 'commission'],
  '661': ['frais', 'agios', 'cotisation compte', 'com carte'],
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

function parseDate(dateStr: string): Date | undefined {
  // Try multiple formats
  // DD/MM/YYYY
  let match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }
  
  // DD.MM.YYYY
  match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }
  
  // YYYY-MM-DD
  match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }
  
  return undefined;
}

function parseAmount(amountStr: string): number {
  // Remove spaces and convert comma to dot
  const cleaned = amountStr
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  return Math.abs(parseFloat(cleaned)) || 0;
}

export function parseCSV(content: string): ParseResult {
  const transactions: ParsedTransaction[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length < 2) {
    return { transactions, period: {} };
  }
  
  // Detect delimiter (comma, semicolon, tab)
  const firstLine = lines[0];
  let delimiter = ';';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(',') && !firstLine.includes(';')) delimiter = ',';
  
  // Parse header to find column indices
  const headers = lines[0].split(delimiter).map(h => h.toLowerCase().trim().replace(/"/g, ''));
  
  // Find column indices
  const dateCol = headers.findIndex(h => 
    h.includes('date') && !h.includes('valeur') && !h.includes('value')
  );
  const valueDateCol = headers.findIndex(h => 
    h.includes('valeur') || h.includes('value')
  );
  const labelCol = headers.findIndex(h => 
    h.includes('libelle') || h.includes('libellé') || h.includes('description') || h.includes('label')
  );
  const debitCol = headers.findIndex(h => 
    h.includes('debit') || h.includes('débit') || h.includes('sortie')
  );
  const creditCol = headers.findIndex(h => 
    h.includes('credit') || h.includes('crédit') || h.includes('entrée') || h.includes('entree')
  );
  const amountCol = headers.findIndex(h => 
    h.includes('montant') || h.includes('amount')
  );
  
  // If we can't find columns, try generic approach
  if (dateCol === -1) {
    console.log('Could not detect CSV columns. Headers found:', headers);
    return { transactions, period: {} };
  }
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
    
    const dateStr = cols[dateCol];
    const date = parseDate(dateStr);
    if (!date) continue;
    
    const valueDate = valueDateCol >= 0 ? parseDate(cols[valueDateCol]) : undefined;
    const label = labelCol >= 0 ? cols[labelCol] : cols.slice(1).join(' ');
    
    let amount = 0;
    let type: 'debit' | 'credit' = 'debit';
    
    if (debitCol >= 0 && creditCol >= 0) {
      // Separate debit/credit columns
      const debitAmount = parseAmount(cols[debitCol] || '0');
      const creditAmount = parseAmount(cols[creditCol] || '0');
      
      if (creditAmount > 0) {
        amount = creditAmount;
        type = 'credit';
      } else if (debitAmount > 0) {
        amount = debitAmount;
        type = 'debit';
      }
    } else if (amountCol >= 0) {
      // Single amount column (positive = credit, negative = debit)
      const rawAmount = cols[amountCol].replace(/\s/g, '').replace(',', '.');
      const numAmount = parseFloat(rawAmount) || 0;
      
      amount = Math.abs(numAmount);
      type = numAmount >= 0 ? 'credit' : 'debit';
    }
    
    if (amount > 0 && label) {
      transactions.push({
        date,
        valueDate,
        label,
        amount,
        type,
        suggestedCategory: suggestCategory(label),
      });
    }
  }
  
  // Determine period
  const dates = transactions.map(t => t.date.getTime()).sort((a, b) => a - b);
  const period = {
    start: dates.length > 0 ? new Date(dates[0]) : undefined,
    end: dates.length > 0 ? new Date(dates[dates.length - 1]) : undefined,
  };
  
  return { transactions, period };
}

// Manual entry parser for when users paste transaction data
export function parseManualEntry(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let date: Date | undefined;
    let label = '';
    let amount = 0;
    let type: 'debit' | 'credit' = 'debit';
    
    // Format 1: DD/MM/YYYY or DD.MM.YYYY LABEL [+-]AMOUNT
    const format1 = line.match(/^(\d{2}[.\/]\d{2}[.\/]\d{4})\s+(.+?)\s+([-+]?[\d\s]+[.,]\d{2})$/);
    if (format1) {
      date = parseDate(format1[1]);
      label = format1[2].trim();
      const rawAmount = format1[3].replace(/\s/g, '').replace(',', '.');
      amount = Math.abs(parseFloat(rawAmount));
      type = rawAmount.startsWith('-') ? 'debit' : rawAmount.startsWith('+') ? 'credit' : 'debit';
    }
    
    // Format 2: Credit Agricole bank statement: DD.MM DD.MM Libellé AMOUNT [¨]
    // Also matches with tabs: 07.01 	07.01 Virement... 725,00 ¨
    // Amount format: optional spaces + digits + comma + 2 digits (e.g., "1 234,56" or "725,00")
    if (!date) {
      const format2 = line.match(/^(\d{2}\.\d{2})\s+\d{2}\.\d{2}\s+(.+?)\s+(\d[\d\s]*,\d{2})\s*(¨)?$/);
      if (format2) {
        const day = parseInt(format2[1].split('.')[0]);
        const month = parseInt(format2[1].split('.')[1]) - 1;
        date = new Date(currentYear, month, day);
        label = format2[2].trim();
        amount = parseAmount(format2[3]);
        type = format2[4] === '¨' ? 'credit' : 'debit';
      }
    }
    
    // Format 2b: Credit Agricole with amount on separate line
    // 07.01 	07.01 Virement Stripe
    // HELLOASSO-...
    // 725,00 ¨
    if (!date) {
      const format2b = line.match(/^(\d{2}\.\d{2})\s+\d{2}\.\d{2}\s+(.+)$/);
      if (format2b && !format2b[2].match(/[\d,]+$/)) {
        const day = parseInt(format2b[1].split('.')[0]);
        const month = parseInt(format2b[1].split('.')[1]) - 1;
        date = new Date(currentYear, month, day);
        label = format2b[2].trim();
        
        // Look ahead for amount in next lines
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          const nextLine = lines[j].trim();
          
          // Skip if it's another transaction
          if (/^\d{2}\.\d{2}\s+\d{2}\.\d{2}/.test(nextLine)) break;
          
          // Check for amount line: "725,00 ¨" or "725,00"
          const amountMatch = nextLine.match(/^(\d[\d\s]*,\d{2})\s*(¨)?$/);
          if (amountMatch) {
            amount = parseAmount(amountMatch[1]);
            type = amountMatch[2] === '¨' ? 'credit' : 'debit';
            break;
          }
          
          // Add to label if it's a continuation
          if (nextLine.length > 0 && !nextLine.includes('Total') && !nextLine.includes('solde')) {
            label += ' ' + nextLine;
          }
        }
      }
    }
    
    // Format 3: Credit Agricole card statement: LABEL LOCATION AMOUNT DATE
    // AMAZON PRIME FR 	75PAYLI2469664/ 	6,99	23.12
    if (!date) {
      const format3 = line.match(/^(.+?)\s+([\d,]+)\s*(\d{2}\.\d{2})$/);
      if (format3 && format3[1].length > 3) {
        const dateStr = format3[3];
        const day = parseInt(dateStr.split('.')[0]);
        const month = parseInt(dateStr.split('.')[1]) - 1;
        date = new Date(currentYear, month, day);
        label = format3[1].trim();
        amount = parseAmount(format3[2]);
        type = 'debit'; // Card transactions are usually debits
      }
    }
    
    // Format 4: Simple "LABEL [+-]AMOUNT" 
    if (!date) {
      const format4 = line.match(/^(.+?)\s+([-+][\d\s]+[.,]\d{2})$/);
      if (format4 && format4[1].length > 2) {
        date = new Date(); // Use today
        label = format4[1].trim();
        const rawAmount = format4[2].replace(/\s/g, '').replace(',', '.');
        amount = Math.abs(parseFloat(rawAmount));
        type = rawAmount.startsWith('-') ? 'debit' : 'credit';
      }
    }
    
    if (date && amount > 0 && label.length > 2) {
      // Clean up label
      label = label.replace(/\s+/g, ' ').trim();
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
      
      // Check for debits first
      for (const keyword of debitKeywords) {
        if (lowerLabel.includes(keyword)) {
          type = 'debit';
          break;
        }
      }
      
      // Override with credits if matched
      for (const keyword of creditKeywords) {
        if (lowerLabel.includes(keyword)) {
          type = 'credit';
          break;
        }
      }
      
      transactions.push({
        date,
        label,
        amount,
        type,
        suggestedCategory: suggestCategory(label),
      });
    }
  }
  
  return transactions;
}
