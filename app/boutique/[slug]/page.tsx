import { Metadata } from 'next';
import ProductDetailPage from '@/components/sections/ProductDetailPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Boutique — ${slug} | Barb'n'Rock Festival`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
