import Link from 'next/link';
import SacemInvoiceForm from './SacemInvoiceForm';

export default function SacemFacturePage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/factures"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Factures
        </Link>
        <h1 className="text-3xl font-bold text-white">Demande de paiement Sacem</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6 max-w-2xl">
        Génère une pièce conforme au mémo financier Festivals/salles 2026 (mentions obligatoires :
        n° dossier, Sacem, bénéficiaire, SIRET, RIB, objet, montant, TVA). À envoyer à{' '}
        <span className="text-white">action.culturelle.regions@sacem.fr</span> avec le RIB en pièce
        jointe, avant le 1<sup>er</sup> décembre 2026.
      </p>
      <SacemInvoiceForm />
    </div>
  );
}
