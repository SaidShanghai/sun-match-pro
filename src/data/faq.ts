export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "Quel est le coût d'une installation solaire au Maroc en 2025 ?",
    answer:
      "En 2025, le coût d'une installation solaire résidentielle au Maroc varie entre 30 000 et 90 000 dirhams (MAD) selon la puissance (3 à 10 kWc). Pour un foyer moyen consommant 500 kWh/mois, un kit de 5 kWc coûte environ 55 000 dirhams (MAD) TTC pose incluse. Les prix ont baissé de 15 % en 3 ans grâce à la concurrence et aux aides d'état comme le programme SR500.",
  },
  {
    question: "Combien de temps pour amortir des panneaux solaires au Maroc ?",
    answer:
      "Le retour sur investissement d'une installation solaire au Maroc est en moyenne de 4 à 6 ans, grâce à un ensoleillement exceptionnel (3 000 h/an). Avec les aides SR500 et TATWIR, l'amortissement peut descendre à 3 ans. Après amortissement, l'électricité produite est gratuite pendant 20 à 25 ans (durée de vie des panneaux).",
  },
  {
    question: "Comment fonctionne le diagnostic NOORIA / SunGPT ?",
    answer:
      "SunGPT est l'IA de NOORIA qui analyse votre potentiel solaire en moins de 2 minutes. Vous renseignez votre consommation ONEE, type de logement et localisation. L'algorithme croise ces données avec l'ensoleillement local, les tarifs ONEE et les aides disponibles pour recommander la puissance optimale, estimer vos économies et vous connecter aux installateurs certifiés les plus proches.",
  },
  {
    question: "Quelles économies puis-je espérer sur ma facture ONEE ?",
    answer:
      "Avec une installation solaire correctement dimensionnée, vous pouvez réduire votre facture ONEE de 50 à 80 %. Pour une consommation de 1 500 dirhams (MAD) par mois, l'économie typique est de 900 à 1 200 dirhams (MAD) par mois. Sur 25 ans, cela représente entre 270 000 et 360 000 dirhams (MAD) d'économies cumulées, soit un rendement bien supérieur à un placement bancaire.",
  },
  {
    question: "L'autoconsommation est-elle légale au Maroc ?",
    answer:
      "Oui, l'autoconsommation solaire est parfaitement légale au Maroc depuis la loi 13-09 relative aux énergies renouvelables, amendée par la loi 58-15. Les particuliers et entreprises peuvent installer des panneaux solaires pour leur propre consommation sans autorisation spéciale pour les puissances inférieures à 20 kWc. Au-delà, une déclaration auprès de l'ANRE (Autorité Nationale de Régulation de l'Énergie) est requise.",
  },
  {
    question: "Quelle puissance solaire pour une villa marocaine ?",
    answer:
      "Pour une villa marocaine standard, la puissance recommandée dépend de votre consommation : 3 kWc pour une petite villa (300-500 kWh/mois), 5-6 kWc pour une villa moyenne (500-800 kWh/mois), et 8-10 kWc pour une grande villa avec piscine et climatisation (800-1 500 kWh/mois). Le diagnostic SunGPT calcule la puissance exacte adaptée à votre profil.",
  },
  {
    question: "Puis-je vendre mon surplus d'électricité à l'ONEE ?",
    answer:
      "Actuellement, la revente du surplus solaire à l'ONEE n'est pas encore généralisée pour les particuliers au Maroc. Le cadre réglementaire est en cours d'évolution. En attendant, la stratégie optimale est le dimensionnement en autoconsommation maximale, éventuellement couplé à des batteries de stockage pour utiliser 100 % de votre production.",
  },
  {
    question: "Quels sont les meilleurs panneaux solaires disponibles au Maroc ?",
    answer:
      "Au Maroc, les marques les plus fiables et disponibles sont : Longi (excellent rapport qualité/prix, technologie Hi-MO), Jinko Solar (panneaux Tiger Neo haute performance), Canadian Solar (robustes, certifiés pour climats chauds), et Trina Solar (bonne garantie 25 ans). Privilégiez les panneaux monocristallins bifaciaux de 500W+ pour maximiser la production dans le climat marocain.",
  },
  {
    question: "SunGPT est-il gratuit ?",
    answer:
      "Oui, le diagnostic solaire SunGPT est 100 % gratuit et sans engagement. Vous obtenez en 2 minutes une estimation personnalisée de votre potentiel solaire, des économies réalisables, des aides applicables et un devis détaillé. NOORIA se rémunère uniquement auprès des installateurs partenaires, jamais auprès des particuliers.",
  },
  {
    question: "Quelle batterie solaire choisir pour le Maroc (LFP vs AGM) ?",
    answer:
      "Pour le Maroc, les batteries LFP (Lithium Fer Phosphate) sont recommandées : elles supportent mieux les chaleurs (jusqu'à 55°C), offrent 6 000+ cycles (vs 500 pour AGM) et une durée de vie de 10-15 ans. Les batteries AGM (plomb) sont moins chères à l'achat mais se dégradent vite en climat chaud. Marques recommandées : BYD, Pylontech et Deye pour le lithium.",
  },
  {
    question: "NOORIA est-elle certifiée MASEN ?",
    answer:
      "NOORIA est une plateforme digitale de mise en relation et de diagnostic solaire. Nos installateurs partenaires sont sélectionnés selon des critères stricts : certifications professionnelles, garanties décennales, assurances et références vérifiées. NOORIA vérifie la conformité de chaque partenaire avant intégration sur la plateforme.",
  },
  {
    question: "Comment comparer les installateurs solaires au Maroc ?",
    answer:
      "Pour comparer les installateurs solaires au Maroc, vérifiez : les certifications (QualiPV ou équivalent), la garantie décennale, les références clients, la qualité du matériel proposé et le service après-vente. NOORIA simplifie cette comparaison en pré-sélectionnant les installateurs certifiés et en vous fournissant des devis détaillés et comparables via le diagnostic SunGPT.",
  },
];

/** Build a FAQPage JSON-LD schema from a subset of FAQ items */
export function buildFaqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
