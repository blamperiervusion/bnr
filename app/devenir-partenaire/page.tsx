import { Metadata } from 'next';
import BecomePartnerPage from '@/components/sections/BecomePartnerPage';

export const metadata: Metadata = {
  title: "Devenir Partenaire",
  description: "Devenez partenaire du Barb'n'Rock Festival et associez votre marque à l'événement rock de l'année. Découvrez nos offres de partenariat.",
  openGraph: {
    title: "Devenir Partenaire | Barb'n'Rock Festival 2026",
    description: "Associez votre marque à l'événement rock de l'année. Découvrez nos offres de partenariat.",
  },
  alternates: {
    canonical: '/devenir-partenaire',
  },
};

export default function DevenirPartenaire() {
  return <BecomePartnerPage />;
}
