import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductForm from '../ProductForm';

export default async function EditProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { createdAt: 'asc' } } },
  });

  if (!product) notFound();

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    type: product.type as 'LOCAL' | 'PRINTIFY',
    images: product.images,
    printifyProductId: product.printifyProductId ?? '',
    isVisible: product.isVisible,
    order: String(product.order),
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      size: v.size ?? '',
      color: v.color ?? '',
      price: String(v.price),
      stock: String(v.stock),
      printifyVariantId: v.printifyVariantId ?? '',
      sku: v.sku ?? '',
      isAvailable: v.isAvailable,
    })),
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/boutique" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Produits
        </Link>
        <span className="text-gray-600">/</span>
        <h1 className="text-2xl font-bold text-white">{product.name}</h1>
        <Link
          href={`/boutique/${product.slug}`}
          target="_blank"
          className="text-xs text-gray-500 hover:text-[#00E5CC] transition-colors ml-2"
        >
          Voir en boutique ↗
        </Link>
      </div>

      <ProductForm initial={initial} />
    </div>
  );
}
