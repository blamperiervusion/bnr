type JsonLdProps = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Schema pour le festival (page d'accueil)
export const festivalSchema = {
  '@context': 'https://schema.org',
  '@type': 'Festival',
  name: "Barb'n'Rock Festival 2026",
  description:
    "Festival de musique Punk et Metal. 2 jours de chaos, 1 jour de repos. Du 26 au 28 juin 2026 à Crèvecœur-le-Grand.",
  startDate: '2026-06-26',
  endDate: '2026-06-28',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Crèvecœur-le-Grand',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Crèvecœur-le-Grand',
      addressRegion: 'Oise',
      addressCountry: 'FR',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: "Barb'n'Rock Festival",
    url: 'https://barnrock-festival.fr',
  },
  offers: {
    '@type': 'AggregateOffer',
    url: 'https://barnrock-festival.fr/billetterie',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'EUR',
  },
  image: 'https://barnrock-festival.fr/images/og-image.jpg',
  url: 'https://barnrock-festival.fr',
};

// Schema pour l'organisation
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "Barb'n'Rock Festival",
  url: 'https://barnrock-festival.fr',
  logo: 'https://barnrock-festival.fr/logo.png',
  description:
    "Festival de musique Punk et Metal à Crèvecœur-le-Grand. Bearded Rock Experience.",
  sameAs: [
    'https://www.facebook.com/barbnrockfestival', // À remplacer par l'URL réelle
    'https://www.instagram.com/barbnrockfestival', // À remplacer par l'URL réelle
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'French',
  },
};

// Fonction helper pour créer un schema FAQPage
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Schema pour une page de billetterie
export const ticketingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: "Billetterie - Barb'n'Rock Festival 2026",
  description:
    "Réservez vos places pour le Barb'n'Rock Festival 2026. Pass 1 jour, 2 jours ou 3 jours disponibles.",
  url: 'https://barnrock-festival.fr/billetterie',
  mainEntity: {
    '@type': 'Event',
    name: "Barb'n'Rock Festival 2026",
    startDate: '2026-06-26',
    endDate: '2026-06-28',
    location: {
      '@type': 'Place',
      name: 'Crèvecœur-le-Grand',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Crèvecœur-le-Grand',
        addressRegion: 'Oise',
        addressCountry: 'FR',
      },
    },
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      url: 'https://barnrock-festival.fr/billetterie',
    },
  },
};
