import Link from 'next/link';
import ShippingSettingsForm from './ShippingSettingsForm';

export const dynamic = 'force-dynamic';

export default function BoutiqueParametresPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/boutique" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Produits
        </Link>
        <span className="text-gray-600">/</span>
        <h1 className="text-2xl font-bold text-white">Paramètres boutique</h1>
      </div>

      <div className="max-w-xl space-y-6">
        <ShippingSettingsForm />
      </div>
    </div>
  );
}
