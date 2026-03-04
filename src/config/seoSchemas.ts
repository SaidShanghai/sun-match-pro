import { STATS } from "./stats";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "NOORIA – SunGPT",
  "url": "https://sungpt.ma",
  "logo": "https://sungpt.ma/logo.png",
  "description":
    "Premier diagnostic solaire IA au Maroc. Estimez votre installation photovoltaïque, économies et retour sur investissement en moins de 2 minutes.",
  "areaServed": {
    "@type": "Country",
    "name": "Morocco",
  },
  "serviceType": "Diagnostic solaire IA, Installation panneau solaire",
  "currenciesAccepted": "MAD",
  "priceRange": "$$",
  "telephone": "+212-XXX-XXXXXX",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MA",
    "addressRegion": "Casablanca-Settat",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.5731,
    "longitude": -7.5898,
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": String(STATS.rating.value),
    "reviewCount": "87",
    "bestRating": "5",
  },
  "sameAs": ["https://solarcompare.ma"],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment fonctionne le diagnostic solaire NOORIA ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En 2 minutes, répondez à quelques questions sur votre logement et votre consommation. Notre IA analyse votre potentiel solaire et vous propose un dimensionnement personnalisé avec les meilleures offres d'installateurs certifiés près de chez vous.",
      },
    },
    {
      "@type": "Question",
      "name": "Quelles sont les aides disponibles pour le solaire au Maroc ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le Maroc propose plusieurs programmes d'aides : SR500 pour les particuliers, TATWIR pour les entreprises industrielles, et le GEFF (Green Economy Financing Facility) pour le financement vert. NOORIA vous guide dans l'éligibilité et les démarches.",
      },
    },
    {
      "@type": "Question",
      "name": "Combien coûte une installation solaire au Maroc ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le coût varie selon la puissance installée. Pour un particulier, comptez entre 30 000 et 80 000 MAD pour un kit de 3 à 6 kWc. Avec les aides d'état, le retour sur investissement est généralement de 4 à 6 ans, avec jusqu'à 70% d'économies sur votre facture.",
      },
    },
    {
      "@type": "Question",
      "name": "Les installateurs NOORIA sont-ils certifiés ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, tous les installateurs partenaires NOORIA sont certifiés et vérifiés. Ils disposent de garanties décennales et d'un suivi post-installation.",
      },
    },
    {
      "@type": "Question",
      "name": "Le diagnostic solaire est-il gratuit ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, le diagnostic solaire NOORIA est 100% gratuit et sans engagement. Vous recevez une estimation personnalisée de votre potentiel solaire, des économies réalisables et un devis sous 24h.",
      },
    },
  ],
};

export const defaultSchemas = [localBusinessSchema, faqSchema];
