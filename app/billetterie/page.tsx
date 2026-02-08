import { Metadata } from 'next';
import BilletteriePage from '@/components/sections/BilletteriePage';
import JsonLd, { ticketingSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "Billetterie",
  description: "Réservez vos places pour le Barb'n'Rock Festival 2026. Pass 1 jour, 2 jours ou 3 jours disponibles. Places limitées !",
  openGraph: {
    title: "Billetterie | Barb'n'Rock Festival 2026",
    description: "Réservez vos places pour le festival. Pass 1 jour, 2 jours ou 3 jours. Places limitées !",
  },
  alternates: {
    canonical: '/billetterie',
  },
};

export default function Billetterie() {
  return (
    <>
      <JsonLd data={ticketingSchema} />
      <BilletteriePage />
    </>
  );
}
