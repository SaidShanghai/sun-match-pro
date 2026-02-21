/**
 * Grille tarifaire ONEE / distributeurs Maroc – Basse Tension résidentiel
 * Source : Redal grille 2024, ONEE tarifs en vigueur
 * Prix HT en DH/kWh — TVA 14% appliquée
 *
 * Mode PROGRESSIF (conso mensuelle ≤ 150 kWh) :
 *   T1 : 0–100 kWh   → 0.8137 HT
 *   T2 : 101–150 kWh  → 0.9676 HT
 *
 * Mode SÉLECTIF (conso mensuelle > 150 kWh) :
 *   T3 : 0–210 kWh    → 0.9676 HT
 *   T4 : 211–310 kWh   → 1.0757 HT
 *   T5 : 311–510 kWh   → 1.2541 HT
 *   T6 : > 510 kWh     → 1.4773 HT
 */

const TVA_RATE = 0.14;

/** Tranches HT en DH/kWh */
const TRANCHES_PROGRESSIVE = [
  { maxKwh: 100, priceHT: 0.8137 },
  { maxKwh: 150, priceHT: 0.9676 },
];

const TRANCHES_SELECTIVE = [
  { maxKwh: 210, priceHT: 0.9676 },
  { maxKwh: 310, priceHT: 1.0757 },
  { maxKwh: 510, priceHT: 1.2541 },
  { maxKwh: Infinity, priceHT: 1.4773 },
];

/**
 * Distributeurs par ville (principaux).
 * Le reste du Maroc → ONEE direct (mêmes tarifs de base).
 */
export type Distributeur = "Lydec" | "Redal" | "Amendis Nord" | "Amendis Tanger" | "ONEE";

const CITY_DISTRIBUTEUR: Record<string, Distributeur> = {
  "Casablanca": "Lydec",
  "Mohammedia": "Lydec",
  "Bouskoura": "Lydec",
  "Médiouna": "Lydec",
  "Ain Harrouda": "Lydec",
  "Tit Mellil": "Lydec",
  "Rabat": "Redal",
  "Salé": "Redal",
  "Témara": "Redal",
  "Skhirat": "Redal",
  "Harhoura": "Redal",
  "Tanger": "Amendis Tanger",
  "Fnideq": "Amendis Nord",
  "M'diq": "Amendis Nord",
  "Tétouan": "Amendis Nord",
  "Martil": "Amendis Nord",
};

export function getDistributeur(city: string): Distributeur {
  return CITY_DISTRIBUTEUR[city] || "ONEE";
}

/**
 * Calcule le coût mensuel d'électricité selon les tranches ONEE.
 * @param monthlyKwh - consommation mensuelle en kWh
 * @returns coût TTC en MAD
 */
export function calcMonthlyBillTTC(monthlyKwh: number): number {
  const tranches = monthlyKwh <= 150 ? TRANCHES_PROGRESSIVE : TRANCHES_SELECTIVE;
  let remaining = monthlyKwh;
  let costHT = 0;
  let prevMax = 0;

  for (const tranche of tranches) {
    const trancheSize = tranche.maxKwh === Infinity
      ? remaining
      : tranche.maxKwh - prevMax;
    const consumed = Math.min(remaining, trancheSize);
    if (consumed <= 0) break;
    costHT += consumed * tranche.priceHT;
    remaining -= consumed;
    prevMax = tranche.maxKwh;
  }

  return Math.round(costHT * (1 + TVA_RATE) * 100) / 100;
}

/**
 * Calcule le coût annuel d'électricité.
 * Prend la consommation annuelle, divise par 12, applique les tranches mensuelles × 12.
 */
export function calcAnnualBillTTC(annualKwh: number): number {
  const monthlyKwh = annualKwh / 12;
  return Math.round(calcMonthlyBillTTC(monthlyKwh) * 12);
}

/**
 * Calcule les économies en MAD quand on soustrait la production solaire.
 * Compare facture AVANT solaire vs facture APRÈS solaire.
 *
 * @param annualConsoKwh - consommation annuelle totale
 * @param annualProductionKwh - production PV annuelle
 * @returns { billBefore, billAfter, savingsMad, savingsPercent }
 */
export function calcSolarSavings(annualConsoKwh: number, annualProductionKwh: number) {
  const billBefore = calcAnnualBillTTC(annualConsoKwh);

  // L'autoconsommation réduit ce qu'on tire du réseau
  const netConsoKwh = Math.max(0, annualConsoKwh - annualProductionKwh);
  const billAfter = calcAnnualBillTTC(netConsoKwh);

  const savingsMad = billBefore - billAfter;
  const savingsPercent = billBefore > 0 ? Math.round((savingsMad / billBefore) * 100) : 0;

  return {
    billBefore,
    billAfter,
    savingsMad,
    savingsPercent,
  };
}

/**
 * Prix moyen effectif du kWh pour une consommation donnée (TTC).
 */
export function getEffectivePricePerKwh(annualKwh: number): number {
  if (annualKwh <= 0) return 0;
  return Math.round((calcAnnualBillTTC(annualKwh) / annualKwh) * 1000) / 1000;
}

/**
 * Renvoie le détail des tranches pour affichage.
 */
export function getTarifDetails(monthlyKwh: number) {
  const isProgressive = monthlyKwh <= 150;
  const tranches = isProgressive ? TRANCHES_PROGRESSIVE : TRANCHES_SELECTIVE;

  return {
    mode: isProgressive ? "Progressif" as const : "Sélectif" as const,
    tranches: tranches.map((t, i) => {
      const prevMax = i === 0 ? 0 : tranches[i - 1].maxKwh;
      return {
        from: prevMax + (i === 0 ? 0 : 1),
        to: t.maxKwh === Infinity ? null : t.maxKwh,
        priceHT: t.priceHT,
        priceTTC: Math.round(t.priceHT * (1 + TVA_RATE) * 10000) / 10000,
      };
    }),
  };
}
