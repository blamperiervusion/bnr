import Link from 'next/link';
import NewPartnerForm from './NewPartnerForm';

export default function NouveauPartenairePage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/partenaires"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-3xl font-bold text-white">Nouveau partenaire</h1>
      </div>

      <NewPartnerForm />
    </div>
  );
}
