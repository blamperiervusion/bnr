import { Hero, BandsGallery, PartnersTeaser, CTASection } from '@/components/sections';
import JsonLd, { festivalSchema } from '@/components/JsonLd';

export default function Home() {
  return (
    <>
      <JsonLd data={festivalSchema} />
      <Hero />
      <BandsGallery />
      <CTASection />
      <PartnersTeaser />
    </>
  );
}
