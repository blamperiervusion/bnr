'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  date: string;
  label: string;
  amount: string;
  type: 'debit' | 'credit';
  exerciceYear: number;
}

interface ParsedLine {
  label: string;
  amount: number;
  date: Date;
  isValid: boolean;
  isCredit?: boolean;
}

export default function DetailTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailText, setDetailText] = useState('');
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepOriginal, setKeepOriginal] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/admin/compta/transactions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTransaction(data);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseDetailText = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const currentYear = transaction?.exerciceYear || new Date().getFullYear();
    const parsed: ParsedLine[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let label = '';
      let amount = 0;
      let date = new Date();
      let isValid = false;
      let isCredit = false;

      // Format relevé bancaire CA: DD.MM DD.MM Libellé AMOUNT [¨]
      // 07.01 07.01 Virement Stripe... 725,00 ¨
      // ou sur plusieurs lignes
      const bankFormat = line.match(/^(\d{2}\.\d{2})\s+\d{2}\.\d{2}\s+(.+)/);
      if (bankFormat) {
        const [day, month] = bankFormat[1].split('.');
        date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        let rest = bankFormat[2];
        
        // Check if amount is on the same line
        const amountInLine = rest.match(/(\d[\d\s]*,\d{2})\s*(¨)?$/);
        if (amountInLine) {
          amount = parseFloat(amountInLine[1].replace(/\s/g, '').replace(',', '.'));
          isCredit = amountInLine[2] === '¨';
          label = rest.replace(amountInLine[0], '').trim();
          isValid = amount > 0 && label.length > 2;
        } else {
          // Amount is on following lines
          label = rest.trim();
          
          // Look ahead for amount
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const nextLine = lines[j].trim();
            
            // Stop if we hit another transaction
            if (/^\d{2}\.\d{2}\s+\d{2}\.\d{2}/.test(nextLine)) break;
            
            // Check for amount line (must start with a digit and contain comma + 2 decimals)
            const amountMatch = nextLine.match(/^(\d[\d\s]*,\d{2})\s*(¨)?$/);
            if (amountMatch) {
              amount = parseFloat(amountMatch[1].replace(/\s/g, '').replace(',', '.'));
              isCredit = amountMatch[2] === '¨';
              isValid = amount > 0 && label.length > 2;
              break;
            }
            
            // Add to label if it's a continuation
            if (nextLine.length > 0 && !nextLine.match(/^[\d\s,]+$/)) {
              label += ' ' + nextLine;
            }
          }
        }
        
        // Detect credits from label keywords
        if (!isCredit) {
          const lowerLabel = label.toLowerCase();
          if (lowerLabel.includes('remise') || 
              lowerLabel.includes('avoir') || 
              lowerLabel.includes('remboursement') ||
              lowerLabel.includes('virement') && lowerLabel.includes('reçu')) {
            isCredit = true;
          }
        }
      }

      // Format carte CA: COMMERCE LIEU MONTANT DATE
      // AMAZON PRIME FR 75PAYLI2469664/ 6,99 23.12
      if (!isValid) {
        const cardFormat = line.match(/^(.+?)\s+([\d,]+)\s*(\d{2}\.\d{2})$/);
        if (cardFormat) {
          label = cardFormat[1].trim();
          amount = parseFloat(cardFormat[2].replace(',', '.'));
          const [day, month] = cardFormat[3].split('.');
          date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
          isValid = amount > 0 && label.length > 2;
        }
      }

      // Format simple: LABEL AMOUNT
      if (!isValid) {
        const simpleFormat = line.match(/^(.+?)\s+([\d\s,]+)$/);
        if (simpleFormat && !line.match(/^\d{2}\.\d{2}/)) {
          label = simpleFormat[1].trim();
          amount = parseFloat(simpleFormat[2].replace(/\s/g, '').replace(',', '.'));
          date = transaction?.date ? new Date(transaction.date) : new Date();
          isValid = amount > 0 && label.length > 2;
        }
      }

      // Format avec date: DD/MM LABEL AMOUNT ou DD.MM LABEL AMOUNT
      if (!isValid) {
        const dateFormat = line.match(/^(\d{2}[.\/]\d{2})\s+(.+?)\s+([\d\s,]+)$/);
        if (dateFormat) {
          const [day, month] = dateFormat[1].split(/[.\/]/);
          date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
          label = dateFormat[2].trim();
          amount = parseFloat(dateFormat[3].replace(/\s/g, '').replace(',', '.'));
          isValid = amount > 0 && label.length > 2;
        }
      }

      if (isValid) {
        // Clean up label
        label = label.replace(/\s+/g, ' ').trim();
        parsed.push({ label, amount, date, isValid, isCredit });
      }
    }

    setParsedLines(parsed);
  };

  useEffect(() => {
    if (detailText) {
      parseDetailText(detailText);
    } else {
      setParsedLines([]);
    }
  }, [detailText, transaction]);

  const totalParsed = parsedLines.reduce((sum, l) => sum + (l.isValid ? l.amount : 0), 0);
  const originalAmount = transaction ? parseFloat(transaction.amount) : 0;
  const difference = Math.abs(totalParsed - originalAmount);
  const isBalanced = difference < 0.01;

  const handleSubmit = async () => {
    if (parsedLines.filter(l => l.isValid).length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Create new transactions
      for (const line of parsedLines.filter(l => l.isValid)) {
        const type = line.isCredit ? 'credit' : 'debit';
        await fetch('/api/admin/compta/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: line.date,
            label: line.label,
            amount: line.amount,
            type,
            exerciceYear: transaction?.exerciceYear || new Date().getFullYear(),
            notes: `Détail de: ${transaction?.label}`,
          }),
        });
      }

      // Delete or mark original transaction
      if (!keepOriginal) {
        await fetch(`/api/admin/compta/transactions/${id}`, {
          method: 'DELETE',
        });
      }

      router.push('/admin/compta/transactions');
    } catch (error) {
      console.error('Error creating transactions:', error);
      alert('Erreur lors de la création des transactions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR');

  if (loading) {
    return <div className="p-6 text-gray-400">Chargement...</div>;
  }

  if (!transaction) {
    return <div className="p-6 text-red-400">Transaction non trouvée</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta/transactions"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour aux transactions
        </Link>
        <h1 className="text-3xl font-bold text-white">📝 Détailler une transaction</h1>
        <p className="text-gray-400 mt-1">Éclater une ligne agrégée en plusieurs transactions</p>
      </div>

      {/* Transaction originale */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Transaction à détailler</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Date</p>
            <p className="text-white">{formatDate(new Date(transaction.date))}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Libellé</p>
            <p className="text-white">{transaction.label}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Montant</p>
            <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(parseFloat(transaction.amount))}
            </p>
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Coller le détail</h2>
        <p className="text-gray-400 text-sm mb-4">
          Copiez les lignes depuis votre relevé carte et collez-les ci-dessous.
        </p>
        <textarea
          value={detailText}
          onChange={(e) => setDetailText(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white font-mono text-sm focus:border-[#e53e3e] focus:outline-none"
          placeholder={`Format relevé carte Crédit Agricole :
AMAZON PRIME FR 75PAYLI2469664/ 6,99 23.12
SPOTIFY 9,99 15.12
NETFLIX 13,49 01.12

Ou format simple :
Amazon Prime 6,99
Spotify 9,99`}
        />
      </div>

      {/* Prévisualisation */}
      {parsedLines.length > 0 && (
        <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Prévisualisation ({parsedLines.filter(l => l.isValid).length} lignes)
          </h2>
          
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left p-2 text-gray-400 text-sm">Date</th>
                <th className="text-left p-2 text-gray-400 text-sm">Libellé</th>
                <th className="text-right p-2 text-gray-400 text-sm">Montant</th>
                <th className="p-2 text-gray-400 text-sm w-10"></th>
              </tr>
            </thead>
            <tbody>
              {parsedLines.map((line, i) => (
                <tr key={i} className={`border-b border-[#222] ${!line.isValid ? 'opacity-50' : ''}`}>
                  <td className="p-2 text-gray-300">{formatDate(line.date)}</td>
                  <td className="p-2 text-white">
                    {line.label || '(non reconnu)'}
                    {line.isCredit && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                        crédit
                      </span>
                    )}
                  </td>
                  <td className={`p-2 text-right font-mono ${line.isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {line.amount > 0 ? `${line.isCredit ? '+' : '-'}${formatCurrency(line.amount)}` : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {line.isValid ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-yellow-400">⚠</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#444]">
                <td colSpan={2} className="p-2 text-gray-400 font-bold">Total</td>
                <td className="p-2 text-right text-white font-bold font-mono">
                  {formatCurrency(totalParsed)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* Comparaison */}
          <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={isBalanced ? 'text-green-400' : 'text-yellow-400'}>
                  {isBalanced ? '✓ Les montants correspondent' : '⚠ Différence détectée'}
                </p>
                {!isBalanced && (
                  <p className="text-sm text-gray-400">
                    Original: {formatCurrency(originalAmount)} | Détail: {formatCurrency(totalParsed)} | 
                    Différence: {formatCurrency(difference)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Options et actions */}
      {parsedLines.filter(l => l.isValid).length > 0 && (
        <div className="bg-[#111] border border-[#222] rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={keepOriginal}
                onChange={(e) => setKeepOriginal(e.target.checked)}
                className="rounded border-[#444] bg-[#222]"
              />
              Conserver la transaction originale (ne pas la supprimer)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '⏳ Création...' : `✓ Créer ${parsedLines.filter(l => l.isValid).length} transactions`}
            </button>
            <Link
              href="/admin/compta/transactions"
              className="px-6 py-3 bg-[#222] text-gray-300 rounded-lg hover:bg-[#333] transition-colors"
            >
              Annuler
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
