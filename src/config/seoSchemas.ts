import { faqData, buildFaqSchema } from "@/data/faq";

/**
 * Homepage: @graph with Organization + WebSite + WebPage + FAQPage (top 6)
 */
export const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sungpt.ma/#organization",
      name: "NOORIA",
      alternateName: "SunGPT",
      url: "https://sungpt.ma",
      logo: {
        "@type": "ImageObject",
        url: "https://sungpt.ma/logo.png",
        width: 200,
        height: 60,
      },
      description:
        "Première plateforme IA de diagnostic solaire au Maroc. Analysez votre facture ONEE, obtenez un devis personnalisé en 2 minutes et connectez-vous à des installateurs certifiés RGE partout au Maroc.",
      foundingDate: "2024",
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
        "Kénitra",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.2",
        reviewCount: "500",
        bestRating: "5",
        worstRating: "1",
      },
      sameAs: [
        "https://facebook.com/nooria.ma",
        "https://instagram.com/nooria.ma",
        "https://linkedin.com/company/nooria-ma",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["French", "Arabic"],
        areaServed: "MA",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://sungpt.ma/#website",
      url: "https://sungpt.ma",
      name: "NOORIA – Diagnostic Solaire IA Maroc",
      publisher: { "@id": "https://sungpt.ma/#organization" },
      inLanguage: "fr-MA",
    },
    {
      "@type": "WebPage",
      "@id": "https://sungpt.ma/#webpage",
      url: "https://sungpt.ma",
      name: "NOORIA – 1ère IA Solaire du Maroc | Diagnostic Gratuit en 2 min",
      description:
        "Diagnostic solaire IA gratuit en 2 minutes. Économisez jusqu'à 70% sur votre facture ONEE. Installateurs certifiés RGE partout au Maroc.",
      isPartOf: { "@id": "https://sungpt.ma/#website" },
      about: { "@id": "https://sungpt.ma/#organization" },
      inLanguage: "fr-MA",
    },
    {
      "@type": "FAQPage",
      "@id": "https://sungpt.ma/#faq",
      mainEntity: faqData.slice(0, 6).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

/**
 * /faq page: FAQPage with all 12 questions
 */
export const fullFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: "https://sungpt.ma/faq",
  name: "FAQ Solaire Maroc 2025 – 12 Questions Répondues | NOORIA",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/**
 * /nos-solutions: Service schema
 */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SolarBox – Installation Solaire Résidentielle et Professionnelle",
  provider: {
    "@type": "Organization",
    name: "NOORIA",
    url: "https://sungpt.ma",
  },
  areaServed: {
    "@type": "Country",
    name: "Maroc",
  },
  description:
    "Installation solaire complète pour particuliers et entreprises au Maroc. Système avec batterie LFP, onduleur hybride, garantie 10 ans, installateurs certifiés RGE.",
  category: "Énergie renouvelable",
  serviceType: "Installation photovoltaïque",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "MAD",
    lowPrice: "35000",
    highPrice: "120000",
    offerCount: "3",
  },
};

/**
 * /diagnostic: HowTo schema
 */
export const diagnosticSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment obtenir un diagnostic solaire gratuit au Maroc avec NOORIA",
  description:
    "Obtenez un diagnostic solaire personnalisé en 2 minutes grâce à l'IA SunGPT. Analysez votre facture ONEE et recevez une recommandation d'installation en dirhams (MAD).",
  totalTime: "PT2M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "MAD",
    value: "0",
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Uploadez votre facture ONEE",
      text: "Prenez en photo ou téléchargez votre dernière facture ONEE. Notre OCR extrait automatiquement votre consommation en kWh.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "L'IA analyse votre profil",
      text: "SunGPT combine votre consommation réelle avec les données PVGIS d'ensoleillement de votre région au Maroc pour calculer la puissance optimale.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Recevez votre rapport personnalisé",
      text: "En moins de 2 minutes : puissance recommandée en kWc, coût estimé en dirhams (MAD), ROI calculé et mise en relation avec des installateurs certifiés RGE proches de chez vous.",
    },
  ],
};

/**
 * /a-propos: AboutPage schema
 */
export const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://sungpt.ma/a-propos",
  name: "À Propos de NOORIA – Experts Solaire IA au Maroc",
  description:
    "NOORIA est la première plateforme IA dédiée au diagnostic solaire au Maroc. Fondée en 2024, elle connecte les particuliers et entreprises avec des installateurs certifiés RGE.",
  about: {
    "@type": "Organization",
    name: "NOORIA",
    url: "https://sungpt.ma",
    foundingDate: "2024",
    description:
      "Plateforme IA de diagnostic et mise en relation solaire au Maroc",
    knowsAbout: [
      "Énergie solaire photovoltaïque",
      "Loi 82-21 Maroc",
      "ONEE autoconsommation",
      "Batterie LFP",
      "Onduleur hybride",
      "PVGIS",
      "Certification RGE",
      "MASEN",
      "AMEE",
    ],
  },
};

/**
 * Blog article: build dynamically per post
 */
export function buildArticleSchema(post: {
  title: string;
  slug: string;
  meta_description?: string | null;
  content?: string;
  published_at?: string | null;
  cover_image_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description:
      post.meta_description || (post.content?.substring(0, 155) + "…") || "",
    url: `https://sungpt.ma/blog/${post.slug}`,
    datePublished: post.published_at || undefined,
    dateModified: post.published_at || undefined,
    image: post.cover_image_url || "https://sungpt.ma/og-image.png",
    author: {
      "@type": "Organization",
      name: "NOORIA",
      url: "https://sungpt.ma",
    },
    publisher: {
      "@type": "Organization",
      name: "NOORIA",
      logo: { "@type": "ImageObject", url: "https://sungpt.ma/logo.png" },
    },
    mainEntityOfPage: `https://sungpt.ma/blog/${post.slug}`,
    about: { "@type": "Thing", name: "Énergie solaire au Maroc" },
    keywords:
      "panneau solaire Maroc, installation solaire MAD, ONEE autoconsommation, Loi 82-21",
    inLanguage: "fr-MA",
    isPartOf: {
      "@type": "Blog",
      name: "Blog NOORIA – Solaire au Maroc",
      url: "https://sungpt.ma/blog",
    },
  };
}
