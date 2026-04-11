import Link from 'next/link';
import BandForm from '../BandForm';

export default function NewBandPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/programmation"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-4"
        >
          ← Retour à la programmation
        </Link>
        <h1 className="text-3xl font-bold text-white">🎸 Nouveau groupe</h1>
        <p className="text-gray-400 mt-1">Ajouter un groupe à la programmation</p>
      </div>

      <BandForm isNew />
    </div>
  );
}
