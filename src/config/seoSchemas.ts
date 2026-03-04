import { STATS } from "./stats";
import { faqData, buildFaqSchema } from "@/data/faq";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NOORIA",
  alternateName: "SunGPT",
  url: "https://sungpt.ma",
  logo: "https://sungpt.ma/logo.png",
  description:
    "Première plateforme IA de diagnostic solaire au Maroc. Diagnostic gratuit, devis personnalisé, installateurs certifiés RGE partout au Maroc.",
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    name: "Casablanca, Maroc",
  },
  areaServed: {
    "@type": "Country",
    name: "Maroc",
    sameAs: "https://www.wikidata.org/wiki/Q1028",
  },
  serviceArea: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Agadir",
    "Fès",
    "Tanger",
    "Meknès",
    "Oujda",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(STATS.rating.value),
    reviewCount: "500",
    bestRating: "5",
  },
  sameAs: [
    "https://facebook.com/nooria.ma",
    "https://instagram.com/nooria.ma",
    "https://linkedin.com/company/nooria-ma",
  ],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NOORIA",
  url: "https://sungpt.ma",
  inLanguage: "fr-MA",
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "NOORIA – SunGPT",
  url: "https://sungpt.ma",
  logo: "https://sungpt.ma/logo.png",
  description:
    "Premier diagnostic solaire IA au Maroc. Estimez votre installation photovoltaïque, économies et retour sur investissement en moins de 2 minutes.",
  areaServed: {
    "@type": "Country",
    name: "Morocco",
  },
  serviceType: "Diagnostic solaire IA, Installation panneau solaire",
  currenciesAccepted: "MAD",
  priceRange: "$$",
  telephone: "+212-XXX-XXXXXX",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MA",
    addressRegion: "Casablanca-Settat",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.5731,
    longitude: -7.5898,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(STATS.rating.value),
    reviewCount: "500",
    bestRating: "5",
  },
  sameAs: [
    "https://facebook.com/nooria.ma",
    "https://instagram.com/nooria.ma",
    "https://linkedin.com/company/nooria-ma",
  ],
};

/** FAQ schema built from the single source of truth in faq.ts */
export const homepageFaqSchema = buildFaqSchema(faqData.slice(0, 6));

/** Full FAQ schema for /faq page */
export const fullFaqSchema = buildFaqSchema(faqData);

/** Service schema for /nos-solutions */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SolarBox – Installation Solaire Résidentielle",
  provider: { "@type": "Organization", name: "NOORIA", url: "https://sungpt.ma" },
  areaServed: { "@type": "Country", name: "Maroc" },
  description:
    "Installation solaire complète pour particuliers et entreprises au Maroc. Système avec batterie LFP, onduleur hybride, garantie 10 ans.",
  category: "Énergie renouvelable",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Solutions solaires NOORIA",
  },
};

/** Homepage schemas: Organization + WebSite + LocalBusiness + FAQ (top 6) */
export const defaultSchemas = [
  organizationSchema,
  webSiteSchema,
  localBusinessSchema,
  homepageFaqSchema,
];
