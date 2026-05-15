import Link from 'next/link';
import ProductForm from '../ProductForm';

export default function NouveauProduitPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/boutique" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Produits
        </Link>
        <span className="text-gray-600">/</span>
        <h1 className="text-2xl font-bold text-white">Nouveau produit</h1>
      </div>

      <ProductForm />
    </div>
  );
}
