import Link from 'next/link';
import NewUserForm from './NewUserForm';

export default function NouvelUtilisateurPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/utilisateurs"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Nouvel utilisateur</h1>
      </div>

      <NewUserForm />
    </div>
  );
}
