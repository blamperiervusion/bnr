import { Metadata } from 'next';
import FAQPage from '@/components/sections/FAQPage';
import JsonLd, { createFAQSchema } from '@/components/JsonLd';
import { faqItems } from '@/lib/data/faq';

export const metadata: Metadata = {
  title: "FAQ",
  description: "Toutes les réponses à vos questions sur le Barb'n'Rock Festival : accès, billetterie, camping, restauration, sécurité et plus encore.",
  openGraph: {
    title: "FAQ | Barb'n'Rock Festival 2026",
    description: "Toutes les réponses à vos questions sur le festival : accès, billetterie, camping, restauration et sécurité.",
  },
};

// Préparer les données FAQ pour le schema JSON-LD
const faqSchemaData = faqItems.map(item => ({
  question: item.question,
  answer: item.answer,
}));

export default function FAQ() {
  return (
    <>
      <JsonLd data={createFAQSchema(faqSchemaData)} />
      <FAQPage />
    </>
  );
}
