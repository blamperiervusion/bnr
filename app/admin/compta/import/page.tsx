'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface ImportResult {
  success: boolean;
  created: number;
  skipped: number;
  details?: {
    created: string[];
    skipped: string[];
  } | string;
  period?: {
    start?: string;
    end?: string;
  };
  accountNumber?: string;
  error?: string;
}

type ImportMode = 'file' | 'manual';

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [exerciceYear, setExerciceYear] = useState(new Date().getFullYear());

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (mode === 'file' && !file) return;
    if (mode === 'manual' && !manualText.trim()) return;

    setIsUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('exerciceYear', exerciceYear.toString());
      
      if (mode === 'file' && file) {
        formData.append('file', file);
      } else if (mode === 'manual') {
        formData.append('manualText', manualText);
      }

      const response = await fetch('/api/admin/compta/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        created: 0,
        skipped: 0,
        error: 'Erreur de connexion',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/compta"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la comptabilité
        </Link>
        <h1 className="text-3xl font-bold text-white">📥 Import de transactions</h1>
        <p className="text-gray-400 mt-1">Importer depuis un fichier ou saisie manuelle</p>
      </div>

      <div className="max-w-2xl">
        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('file')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'file'
                ? 'bg-[#e53e3e] text-white'
                : 'bg-[#222] text-gray-400 hover:bg-[#333]'
            }`}
          >
            📄 Fichier (CSV/PDF)
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'manual'
                ? 'bg-[#e53e3e] text-white'
                : 'bg-[#222] text-gray-400 hover:bg-[#333]'
            }`}
          >
            ✏️ Saisie manuelle
          </button>
        </div>
        
        <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Exercice comptable
            </label>
            <select
              value={exerciceYear}
              onChange={(e) => setExerciceYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {mode === 'file' ? (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Relevé bancaire (PDF Crédit Agricole, CSV)
              </label>
              <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {file ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-[#222] px-4 py-2 rounded-lg">
                      <span className="text-2xl">📄</span>
                      <span className="text-white">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={isUploading}
                      className="px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
                    >
                      {isUploading ? '⏳ Import en cours...' : '📥 Importer les transactions'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="text-4xl block mb-2">📄</span>
                    <span>Cliquez pour sélectionner un fichier</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Formats supportés : <strong>PDF Crédit Agricole</strong> (relevés compte et carte business), CSV
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Coller les transactions (une par ligne)
              </label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-[#e53e3e] focus:outline-none font-mono text-sm"
                placeholder={`Collez le contenu de votre relevé PDF ici.

Format Crédit Agricole relevé compte :
07.01 	07.01 Virement Stripe HELLOASSO 	725,00 ¨
15.01 	15.01 Virement Vir vers Rock Hard 	840,00
(le symbole ¨ indique un crédit)

Format simple :
07/01/2025 Virement HelloAsso +725,00
15/01/2025 Location sono -350,00`}
              />
              <button
                type="button"
                onClick={handleImport}
                disabled={isUploading || !manualText.trim()}
                className="mt-4 px-6 py-3 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
              >
                {isUploading ? '⏳ Import en cours...' : '📥 Importer les transactions'}
              </button>
            </div>
          )}
        </div>

        {/* Résultat */}
        {result && (
          <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {result.success ? (
              <>
                <h3 className="text-lg font-bold text-green-400 mb-2">✅ Import réussi</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white">
                    <strong>{result.created}</strong> transactions importées
                  </p>
                  {result.skipped > 0 && (
                    <p className="text-yellow-400">
                      {result.skipped} transactions ignorées (doublons)
                    </p>
                  )}
                  {result.accountNumber && (
                    <p className="text-gray-400">
                      Compte n° {result.accountNumber}
                    </p>
                  )}
                </div>
                <Link
                  href="/admin/compta/transactions"
                  className="inline-block mt-4 px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] transition-colors"
                >
                  Voir les transactions →
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-red-400 mb-2">❌ Erreur</h3>
                <p className="text-white">{result.error}</p>
                {result.details && typeof result.details === 'string' && (
                  <details className="mt-4">
                    <summary className="text-gray-400 cursor-pointer hover:text-white">
                      Détails techniques
                    </summary>
                    <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-gray-500 overflow-auto max-h-40">
                      {result.details}
                    </pre>
                  </details>
                )}
                <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    💡 <strong>Alternative :</strong> Utilisez la saisie manuelle ou{' '}
                    <Link href="/admin/compta/transactions/nouveau" className="underline">
                      ajoutez les transactions une par une
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-[#111] border border-[#222] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">💡 Comment importer vos transactions ?</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-white mb-2">📄 Option recommandée : Import direct PDF</h4>
              <ol className="space-y-2 text-gray-400 text-sm ml-4">
                <li>1. Téléchargez votre relevé PDF depuis votre espace Crédit Agricole</li>
                <li>2. Sélectionnez le fichier dans l&apos;onglet &quot;Fichier (CSV/PDF)&quot;</li>
                <li>3. Cliquez sur &quot;Importer les transactions&quot;</li>
              </ol>
              <p className="text-xs text-green-400 mt-2 ml-4">
                ✓ Compatible avec les relevés de compte et relevés carte business Crédit Agricole
              </p>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">📋 Alternative : Copier-coller</h4>
              <ol className="space-y-2 text-gray-400 text-sm ml-4">
                <li>1. Ouvrez votre relevé PDF dans un lecteur PDF</li>
                <li>2. Sélectionnez et copiez les lignes de transactions</li>
                <li>3. Collez dans l&apos;onglet &quot;Saisie manuelle&quot;</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">📄 Formats reconnus</h4>
              <ul className="space-y-1 text-gray-400 text-sm ml-4">
                <li>• <strong>PDF Crédit Agricole</strong> : Import direct du fichier PDF</li>
                <li>• <strong>Relevé compte</strong> : 07.01 07.01 Virement... 725,00</li>
                <li>• <strong>Relevé carte</strong> : AMAZON PRIME FR 6,99 23.12</li>
                <li>• <strong>CSV</strong> : Export depuis votre espace bancaire en ligne</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">➕ Saisie individuelle</h4>
              <p className="text-gray-400 text-sm">
                Vous pouvez aussi{' '}
                <Link href="/admin/compta/transactions/nouveau" className="text-[#e53e3e] hover:underline">
                  ajouter chaque transaction manuellement
                </Link>
                {' '}avec un formulaire détaillé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
