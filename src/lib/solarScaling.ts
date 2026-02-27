/**
 * Centralised solar-scaling utilities.
 *
 * PVGIS returns values **per 1 kWp**.  Every consumer (dashboard UI,
 * PDF generator, future API) MUST use these helpers so that displayed
 * metrics always reflect the client's real system size.
 */

const YIELD_FACTOR = 1700; // kWh produced per kWp in Morocco (avg)
const CO2_FACTOR = 0.7;    // kg CO₂ / kWh (Morocco grid)

/* ── Parse the free-text annual_consumption field ─────────────── */
export function parseConsoKwh(raw: string | null | undefined): number {
  if (!raw) return 0;
  const m = raw.match(/(\d[\d\s]*)/);
  return m ? parseInt(m[1].replace(/\s/g, ""), 10) : 0;
}

/* ── Compute needed peak-power (kWc) from annual kWh ─────────── */
export function neededKwc(consoKwh: number, fallback = 0): number {
  return consoKwh > 0 ? Math.ceil(consoKwh / YIELD_FACTOR) : fallback;
}

/* ── Scale raw PVGIS "per-kWp" values to full system size ─────── */
export interface PvgisRaw {
  yearlyProductionKwh?: number;   // kWh per 1 kWp
  yearlyIrradiationKwhM2?: number;
  optimalInclination?: number;
  optimalAzimuth?: number;
  co2SavedKg?: number;            // kg per 1 kWp
  savingsMad?: number;
  monthlyData?: { month: number; productionKwh: number }[];
}

export interface ScaledSolar {
  systemKwc: number;
  production: number;        // kWh/year for full system
  co2Saved: number;          // kg/year  for full system
  coveragePct: number;       // % of annual consumption covered
  irradiation: number;       // unchanged (site metric)
  inclination: number | null;
  azimuth: number | null;
  prodPerKwc: number;        // raw per-kWp value kept for reference
}

export function scaleSolar(
  pvgis: PvgisRaw | null | undefined,
  consoKwh: number,
): ScaledSolar | null {
  if (!pvgis || (!pvgis.yearlyProductionKwh && !pvgis.yearlyIrradiationKwhM2)) {
    return null;
  }

  const kwc = neededKwc(consoKwh, 1);          // fallback 1 kWc if conso unknown
  const prodPerKwp = pvgis.yearlyProductionKwh ?? 0;
  const totalProd = kwc * prodPerKwp;
  const totalCo2 = kwc * (pvgis.co2SavedKg ?? Math.round(prodPerKwp * CO2_FACTOR));
  const coverage = consoKwh > 0 && totalProd > 0
    ? Math.round((totalProd / consoKwh) * 100)
    : 0;

  return {
    systemKwc: kwc,
    production: Math.round(totalProd),
    co2Saved: Math.round(totalCo2),
    coveragePct: coverage,
    irradiation: pvgis.yearlyIrradiationKwhM2 ?? 0,
    inclination: pvgis.optimalInclination ?? null,
    azimuth: pvgis.optimalAzimuth ?? null,
    prodPerKwc: prodPerKwp,
  };
}
