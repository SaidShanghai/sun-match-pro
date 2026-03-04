export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "Quel est le coût d'une installation solaire au Maroc en 2025 ?",
    answer:
      "En 2025, le coût d'une installation solaire résidentielle au Maroc varie entre 30 000 et 120 000 dirhams (MAD) selon la puissance installée. Pour une maison standard nécessitant 3 à 4 kWc, comptez entre 45 000 et 65 000 dirhams (MAD) installation comprise, incluant les panneaux monocristallins, l'onduleur hybride, le câblage et la main-d'œuvre. Un système de 5 kWc adapté à une villa moyenne coûte environ 55 000 à 75 000 MAD TTC. Les prix ont significativement baissé ces dernières années grâce à l'intensification de la concurrence entre installateurs certifiés et aux programmes d'aide publique. Le programme SR500 de MASEN et les exonérations fiscales via l'AMEE (Agence Marocaine pour l'Efficacité Énergétique) peuvent réduire le coût initial de 20 à 30 %. Le retour sur investissement se situe entre 4 et 6 ans avec les tarifs ONEE actuels de 1,60 MAD/kWh en tranche haute. Un comparatif rapide : 3 kWc coûte environ 35 000 à 50 000 MAD, 5 kWc entre 55 000 et 75 000 MAD, et 10 kWc entre 90 000 et 120 000 MAD.",
  },
  {
    question: "Combien de temps pour amortir des panneaux solaires au Maroc ?",
    answer:
      "Le retour sur investissement d'une installation solaire au Maroc est en moyenne de 4 à 6 ans, l'un des plus rapides au monde grâce à un ensoleillement exceptionnel dépassant 3 000 heures par an et une irradiation solaire de 5 à 6 kWh/m²/jour. Pour une installation de 5 kWc coûtant 60 000 dirhams (MAD), les économies annuelles sur la facture ONEE atteignent 12 000 à 15 000 MAD, soit un amortissement en 4 à 5 ans. Avec les aides SR500 de MASEN et le programme TATWIR, l'amortissement peut descendre à 3 ans seulement. Après cette période, l'électricité produite est essentiellement gratuite pendant 20 à 25 ans, correspondant à la durée de vie garantie des panneaux. Les onduleurs ont une durée de vie de 10 à 15 ans et les batteries LFP (lithium fer phosphate) durent 10 à 15 ans avec plus de 6 000 cycles de charge. Sur la durée de vie totale de l'installation, les économies cumulées peuvent dépasser 300 000 dirhams (MAD) pour un foyer consommant 850 kWh/mois.",
  },
  {
    question: "Comment fonctionne le diagnostic NOORIA / SunGPT ?",
    answer:
      "SunGPT est le moteur d'intelligence artificielle propriétaire de NOORIA qui analyse votre potentiel solaire en moins de 2 minutes. Le processus se déroule en trois étapes simples. Premièrement, vous téléchargez ou photographiez votre facture ONEE : notre technologie OCR (reconnaissance optique de caractères) extrait automatiquement votre consommation mensuelle, votre tranche tarifaire et votre puissance souscrite. Deuxièmement, vous indiquez votre localisation et le type de votre logement : l'algorithme croise ces données avec l'ensoleillement local (données PVGIS et météorologiques), l'orientation estimée de votre toiture et les tarifs ONEE applicables à votre distributeur (ONEE, Lydec, Redal ou Amendis). Troisièmement, SunGPT génère un rapport personnalisé comprenant la puissance solaire recommandée en kWc, les économies prévisionnelles en dirhams (MAD), le retour sur investissement, les aides d'état applicables (SR500, TATWIR, GEFF) et une mise en relation directe avec les installateurs certifiés RGE les plus proches de chez vous. Le diagnostic est 100 % gratuit et sans engagement.",
  },
  {
    question: "Quelles économies puis-je espérer sur ma facture ONEE ?",
    answer:
      "Avec une installation solaire correctement dimensionnée par NOORIA, vous pouvez réduire votre facture ONEE de 50 à 80 % selon votre profil de consommation. Pour un foyer marocain consommant 850 kWh/mois avec une facture d'environ 1 850 dirhams (MAD), une installation de 5 kWc permet de ramener cette facture à environ 550 MAD/mois, soit une économie de 1 300 dirhams par mois. Sur 12 mois, cela représente 15 600 MAD d'économies annuelles. Sur la durée de vie des panneaux (25 ans), les économies cumulées atteignent environ 390 000 dirhams (MAD), un montant considérable qui dépasse largement l'investissement initial. Les économies sont d'autant plus importantes que les tarifs ONEE suivent une tendance haussière : le prix du kWh en tranche haute est passé de 1,20 à 1,60 MAD ces dernières années. L'autoconsommation solaire vous protège contre ces augmentations futures. Le diagnostic SunGPT calcule vos économies exactes en fonction de votre consommation réelle et de votre localisation géographique au Maroc.",
  },
  {
    question: "L'autoconsommation est-elle légale au Maroc ?",
    answer:
      "Oui, l'autoconsommation solaire est parfaitement légale au Maroc et encadrée par un cadre réglementaire solide. La loi 13-09 relative aux énergies renouvelables, amendée par la loi 58-15, puis renforcée par la loi 82-21 sur l'autoproduction d'énergie renouvelable, autorise les particuliers et les entreprises à produire leur propre électricité solaire. Pour les installations résidentielles de puissance inférieure à 20 kWc, aucune autorisation spéciale n'est requise : il suffit d'une simple déclaration auprès de votre distributeur (ONEE, Lydec, Redal ou Amendis). Au-delà de 20 kWc, une autorisation de l'ANRE (Autorité Nationale de Régulation de l'Énergie) est nécessaire. Le raccordement au réseau se fait via un compteur bidirectionnel fourni par l'ONEE, qui mesure à la fois l'énergie consommée depuis le réseau et l'énergie éventuellement injectée. L'AMEE (Agence Marocaine pour l'Efficacité Énergétique) accompagne les particuliers dans leurs démarches administratives et les programmes d'aide financière.",
  },
  {
    question: "Quelle puissance solaire pour une villa marocaine ?",
    answer:
      "Pour une villa marocaine, la puissance solaire recommandée dépend directement de votre consommation électrique mensuelle et de vos équipements. Pour une petite villa ou un appartement consommant 300 à 500 kWh/mois, une installation de 3 kWc (6 à 8 panneaux de 400 Wc) est suffisante, pour un budget d'environ 35 000 à 50 000 dirhams (MAD). Pour une villa moyenne consommant 500 à 800 kWh/mois avec climatisation, un système de 5 à 6 kWc (12 à 15 panneaux) est optimal, coûtant entre 55 000 et 75 000 MAD. Pour une grande villa avec piscine, climatisation centrale et chauffage d'eau sanitaire, consommant 800 à 1 500 kWh/mois, il faut prévoir 8 à 10 kWc (20 à 25 panneaux) pour un investissement de 80 000 à 120 000 MAD. L'ensoleillement au Maroc est exceptionnel avec 5 à 6 heures de soleil pic par jour, ce qui optimise le rendement de chaque panneau. Le diagnostic SunGPT de NOORIA calcule la puissance exacte adaptée à votre profil en analysant votre facture ONEE et votre localisation.",
  },
  {
    question: "Puis-je vendre mon surplus d'électricité à l'ONEE ?",
    answer:
      "Actuellement au Maroc, la revente du surplus d'électricité solaire à l'ONEE n'est pas encore pleinement généralisée pour les particuliers, bien que le cadre réglementaire évolue rapidement grâce à la loi 82-21 sur l'autoproduction d'énergie renouvelable. Le compteur bidirectionnel installé par l'ONEE permet techniquement de mesurer l'énergie injectée sur le réseau, mais les conditions de rachat et les tarifs ne sont pas encore uniformisés sur l'ensemble du territoire. Pour les entreprises et les installations de moyenne et haute tension, des contrats de rachat (PPA — Power Purchase Agreement) existent déjà avec l'ONEE. En attendant la généralisation pour les particuliers, la stratégie recommandée par NOORIA est le dimensionnement en autoconsommation maximale : l'objectif est de produire exactement ce que vous consommez pour minimiser le surplus. L'ajout de batteries de stockage LFP (lithium fer phosphate) permet de stocker le surplus produit en journée pour l'utiliser le soir, atteignant ainsi un taux d'autoconsommation de 80 à 95 %.",
  },
  {
    question: "Quels sont les meilleurs panneaux solaires disponibles au Maroc ?",
    answer:
      "Au Maroc, plusieurs marques de panneaux solaires de premier plan sont disponibles auprès des installateurs certifiés. Longi Green Energy offre un excellent rapport qualité-prix avec sa technologie Hi-MO 6, des panneaux monocristallins de 540 à 580 Wc avec un rendement supérieur à 22 %. Jinko Solar propose les panneaux Tiger Neo N-type, atteignant 22,5 % de rendement, particulièrement adaptés aux climats chauds du Maroc. Canadian Solar est reconnu pour la robustesse de ses modules TOPCon, certifiés pour résister aux températures élevées et au sable. Trina Solar complète le tableau avec sa gamme Vertex, offrant une garantie linéaire de 25 ans et un taux de dégradation annuel inférieur à 0,4 %. Pour le Maroc, il est recommandé de privilégier les panneaux monocristallins bifaciaux de 500 Wc et plus, avec un coefficient de température bas (important pour les villes comme Marrakech ou Agadir où les températures dépassent 45°C en été). NOORIA sélectionne uniquement des installateurs qui utilisent des panneaux Tier 1 certifiés selon les normes IEC 61215 et IEC 61730.",
  },
  {
    question: "SunGPT est-il gratuit ?",
    answer:
      "Oui, le diagnostic solaire SunGPT de NOORIA est 100 % gratuit, sans engagement et sans obligation d'achat. En seulement 2 minutes, vous obtenez une estimation personnalisée complète comprenant : la puissance solaire recommandée en kWc pour votre logement, le coût estimé de l'installation en dirhams (MAD), les économies prévisionnelles sur votre facture ONEE, le retour sur investissement calculé selon votre consommation réelle, et les aides d'état auxquelles vous êtes éligible (SR500, TATWIR, GEFF, exonérations AMEE). NOORIA se rémunère uniquement auprès des installateurs partenaires certifiés RGE, via une commission de mise en relation. Les particuliers ne paient jamais rien pour utiliser la plateforme SunGPT. Ce modèle économique permet à NOORIA de garantir l'objectivité de ses recommandations : la puissance recommandée est calculée par l'algorithme d'IA indépendamment de tout intérêt commercial. Plus de 500 diagnostics ont déjà été réalisés depuis le lancement de la plateforme, avec un taux de satisfaction de 4,2 étoiles sur 5.",
  },
  {
    question: "Quelle batterie solaire choisir pour le Maroc (LFP vs AGM) ?",
    answer:
      "Pour le climat marocain, les batteries LFP (Lithium Fer Phosphate) sont clairement recommandées par rapport aux batteries AGM (plomb-acide à recombinaison gazeuse). Les batteries LFP supportent des températures élevées jusqu'à 55°C sans dégradation significative, ce qui est crucial dans les régions comme Marrakech, Agadir, Fès ou Oujda où les températures estivales dépassent régulièrement 45°C. Elles offrent plus de 6 000 cycles de charge-décharge (soit 15 à 20 ans d'utilisation quotidienne), contre seulement 300 à 500 cycles pour les batteries AGM qui se dégradent rapidement en climat chaud. Le coût initial des batteries LFP est plus élevé (environ 15 000 à 25 000 dirhams (MAD) pour 5 kWh de stockage), mais le coût par cycle est 10 fois inférieur aux batteries AGM sur la durée de vie. Les marques recommandées par les installateurs partenaires NOORIA sont BYD (Battery-Box HVS), Pylontech (US5000) et Deye pour les onduleurs hybrides avec stockage intégré. Une batterie de 10 kWh est suffisante pour couvrir les besoins nocturnes d'une villa moyenne au Maroc.",
  },
  {
    question: "NOORIA est-elle certifiée MASEN ?",
    answer:
      "NOORIA est une plateforme digitale de diagnostic solaire et de mise en relation, et non un installateur de panneaux solaires. À ce titre, NOORIA ne détient pas directement de certification MASEN (Moroccan Agency for Sustainable Energy) d'installation. En revanche, NOORIA applique un processus rigoureux de sélection de ses installateurs partenaires qui inclut la vérification de leurs certifications professionnelles (QualiPV ou équivalent RGE), de leurs garanties décennales, de leurs assurances responsabilité civile professionnelle et de leurs références clients vérifiées. Chaque installateur intégré au réseau NOORIA doit justifier d'au moins 3 ans d'expérience dans le photovoltaïque et d'un minimum de projets réalisés conformes aux normes ONEE et AMEE. NOORIA travaille en conformité avec les réglementations de l'ANRE (Autorité Nationale de Régulation de l'Énergie) et respecte la loi 09-08 relative à la protection des données personnelles, supervisée par la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel). La plateforme SunGPT est hébergée sur des serveurs sécurisés avec chiffrement des données.",
  },
  {
    question: "Comment comparer les installateurs solaires au Maroc ?",
    answer:
      "Pour comparer efficacement les installateurs solaires au Maroc, plusieurs critères essentiels doivent être vérifiés. Les certifications professionnelles sont primordiales : recherchez les labels QualiPV, RGE (Reconnu Garant de l'Environnement) ou les certifications équivalentes délivrées par l'AMEE. La garantie décennale est obligatoire et protège votre investissement pendant 10 ans contre les défauts de mise en œuvre. Vérifiez également les références clients et le nombre d'installations réalisées : un installateur fiable doit pouvoir fournir des photos de chantiers et des témoignages vérifiables. La qualité du matériel proposé est déterminante : exigez des panneaux Tier 1 (Longi, Jinko, Canadian Solar, Trina Solar) et des onduleurs de marques reconnues (Huawei, SMA, Fronius). Le service après-vente et la maintenance sont souvent négligés mais cruciaux : assurez-vous que l'installateur propose un contrat de maintenance et un suivi de production. NOORIA simplifie cette comparaison en pré-sélectionnant les installateurs certifiés de chaque région du Maroc et en vous fournissant des devis détaillés, comparables et transparents via le diagnostic SunGPT. Plus de 120 installateurs partenaires sont référencés dans 8 régions du Maroc.",
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
