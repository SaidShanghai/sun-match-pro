export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "Quel est le coût d'une installation solaire au Maroc en 2025 ?",
    answer:
      "Le coût moyen varie entre 35 000 et 120 000 dirhams (MAD). Pour une installation de 3 à 4 kWc (maison standard), comptez 45 000 à 65 000 MAD posé. Avec les tarifs ONEE à 1,60 MAD/kWh, le retour sur investissement est de 4 à 6 ans. Les aides AMEE (SR500, TATWIR, GEFF) peuvent réduire le coût initial de 20 à 30%.",
  },
  {
    question: "Combien de temps pour amortir des panneaux solaires au Maroc ?",
    answer:
      "L'amortissement moyen est de 4 à 6 ans au Maroc. Sur une durée de vie de 25 ans, cela représente 19 à 21 ans d'énergie quasi-gratuite. À Marrakech ou Agadir (ensoleillement supérieur à 5,5h/jour), l'amortissement peut descendre à 3,5 ans.",
  },
  {
    question: "Comment fonctionne le diagnostic NOORIA / SunGPT ?",
    answer:
      "Le diagnostic SunGPT fonctionne en 3 étapes : 1) Upload ou photo de votre facture ONEE, 2) L'OCR analyse votre consommation et l'algorithme PVGIS calcule l'ensoleillement de votre région, 3) En moins de 2 minutes vous recevez la puissance optimale en kWc, le coût en dirhams (MAD), le ROI et des installateurs certifiés RGE près de chez vous. Le diagnostic est 100% gratuit.",
  },
  {
    question: "Quelles économies puis-je espérer sur ma facture ONEE ?",
    answer:
      "En moyenne, nos clients réduisent leur facture ONEE de 70%. Une facture de 1 850 dirhams (MAD)/mois peut descendre à 550 dirhams (MAD)/mois après installation. Sur 25 ans, cela représente jusqu'à 390 000 DH d'économies cumulées estimées selon votre profil de consommation.",
  },
  {
    question: "L'autoconsommation est-elle légale au Maroc ?",
    answer:
      "Oui, totalement légale grâce à la Loi 82-21 sur l'autoproduction d'énergie renouvelable. Cette loi encadre le raccordement au réseau ONEE, les démarches auprès de l'AMEE et les conditions d'injection du surplus. L'ANRE (Autorité Nationale de Régulation de l'Énergie) supervise la conformité.",
  },
  {
    question: "Quelle puissance solaire pour une villa marocaine ?",
    answer:
      "Pour une villa consommant 850 kWh/mois, une installation de 3 à 5 kWc est recommandée (8 à 14 panneaux de 400Wc). Le Maroc bénéficie de 3 000 heures d'ensoleillement par an, soit 5 à 6 heures de soleil pic par jour selon la région. SunGPT calcule la puissance exacte selon votre consommation réelle et votre localisation.",
  },
  {
    question: "Puis-je vendre mon surplus d'électricité à l'ONEE ?",
    answer:
      "La vente de surplus à l'ONEE est possible pour les installations de grande puissance (>36 kVA) dans le cadre de la Loi 82-21. Pour les particuliers résidentiels, l'autoconsommation avec batterie LFP est généralement plus rentable que l'injection réseau aux tarifs actuels.",
  },
  {
    question: "Quels sont les meilleurs panneaux solaires disponibles au Maroc ?",
    answer:
      "Les panneaux monocristallins PERC (rendement 20-22%) sont les plus recommandés au Maroc pour leur efficacité sous fort ensoleillement. Les marques Longi, JA Solar et Jinko Solar sont les plus distribuées. NOORIA sélectionne uniquement des panneaux avec garantie performance 25 ans et certifiés IEC.",
  },
  {
    question: "SunGPT est-il gratuit ?",
    answer:
      "Oui, le diagnostic SunGPT est entièrement gratuit et le restera. NOORIA se rémunère exclusivement auprès des installateurs partenaires sous forme de commission sur les projets réalisés. Aucune carte bancaire ni engagement requis pour accéder au diagnostic.",
  },
  {
    question: "Quelle batterie solaire choisir pour le Maroc (LFP vs AGM) ?",
    answer:
      "La batterie LFP (Lithium Fer Phosphate) est fortement recommandée pour le Maroc : 6 000 cycles de charge (vs 500 pour l'AGM), meilleure résistance aux fortes chaleurs, profondeur de décharge de 80-90% et durée de vie de 10 à 15 ans. L'AGM reste une option entrée de gamme mais nécessite un remplacement tous les 3 à 5 ans.",
  },
  {
    question: "NOORIA est-elle certifiée MASEN ?",
    answer:
      "NOORIA travaille en partenariat avec MASEN (Agence Marocaine pour l'Énergie Durable) et les installateurs de notre réseau sont sélectionnés selon les critères de certification RGE et les standards AMEE. Nous respectons la réglementation SR500 et les normes d'installation photovoltaïque en vigueur au Maroc.",
  },
  {
    question: "Comment comparer les installateurs solaires au Maroc ?",
    answer:
      "NOORIA compare automatiquement les installateurs selon 5 critères : certification RGE, note clients (sur 5★), délai d'intervention, nombre d'installations réalisées et garantie proposée. Après votre diagnostic SunGPT, vous recevez 3 devis comparatifs d'installateurs certifiés dans votre région.",
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
