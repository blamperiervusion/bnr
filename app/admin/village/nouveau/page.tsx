import Link from 'next/link';
import StandForm from '../StandForm';

export default function NewStandPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/village" className="text-gray-400 hover:text-white transition-colors">
          ← Retour au village
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">➕ Nouveau stand</h1>
        <p className="text-gray-400 mt-1">Ajouter un stand au village</p>
      </div>

      <StandForm isNew />
    </div>
  );
}
