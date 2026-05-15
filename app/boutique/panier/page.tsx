import { Metadata } from 'next';
import CartPage from '@/components/sections/CartPage';

export const metadata: Metadata = {
  title: "Panier | Boutique Barb'n'Rock Festival",
};

export default function Page() {
  return <CartPage />;
}
