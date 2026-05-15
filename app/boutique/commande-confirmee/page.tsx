import { Metadata } from 'next';
import OrderConfirmedPage from '@/components/sections/OrderConfirmedPage';

export const metadata: Metadata = {
  title: "Commande confirmée | Barb'n'Rock Festival",
};

export default function Page() {
  return <OrderConfirmedPage />;
}
