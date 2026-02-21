/**
 * PIC — Package Info Client
 * Structured data objects that aggregate all diagnostic + OCR data per segment.
 *
 * PICM = Maison
 * PICA = Appartement
 * PICE = Entreprise
 * PICF = Ferme
 */

/** Raw OCR data extracted from electricity bill */
export interface OcrFactureData {
  numero_contrat?: string | null;
  numero_compteur?: string | null;
  nom_client?: string | null;
  adresse?: string | null;
  ville?: string | null;
  distributeur?: "ONEE" | "Lydec" | "Redal" | "Amendis" | string | null;
  puissance_souscrite_kva?: number | null;
  type_abonnement?: "Basse Tension" | "Moyenne Tension" | "Haute Tension" | string | null;
  consommation_kwh?: number | null;
  periode_jours?: number | null;
  montant_ht?: number | null;
  montant_tva?: number | null;
  montant_ttc?: number | null;
  tranche_tarifaire?: string | null;
  index_ancien?: number | null;
  index_nouveau?: number | null;
  date_facture?: string | null;
  periode_facturation?: string | null;
}

/** Common fields shared across all PIC types */
interface PicBase {
  segment: "Maison" | "Appartement" | "Entreprise" | "Ferme";
  /** User-chosen objective */
  objectif: "facture" | "autonomie" | null;
  /** Annual consumption in kWh (computed or entered) */
  consommation_annuelle_kwh: number | null;
  /** Annual bill in MAD (computed or entered) */
  facture_annuelle_mad: number | null;
  /** City from form or OCR */
  ville: string | null;
  /** GPS coordinates of roof/site */
  gps: { lat: number; lng: number } | null;
  /** Selected energy usages */
  usages: string[];
  /** Panel access options (toit, sol, terrasse) */
  acces_panneaux: string[];
  /** Selected roof/ground surface label */
  surface: string | null;
  /** Raw OCR data if a bill was scanned */
  ocr_brut: OcrFactureData | null;
  /** OCR-extracted distributor */
  distributeur: string | null;
  /** OCR-extracted subscription type */
  type_abonnement: string | null;
  /** OCR-extracted subscribed power in kVA */
  puissance_souscrite_kva: number | null;
  /** OCR-extracted tariff bracket */
  tranche_tarifaire: string | null;
}

/** PICM — Package Info Client Maison */
export interface PICM extends PicBase {
  segment: "Maison";
}

/** PICA — Package Info Client Appartement */
export interface PICA extends PicBase {
  segment: "Appartement";
}

/** PICE — Package Info Client Entreprise */
export interface PICE extends PicBase {
  segment: "Entreprise";
  type_batiment: "Industriel" | "Tertiaire" | null;
  description_projet: string | null;
  adresse_projet: string | null;
  ville_projet: string | null;
  date_debut: string | null;
  date_fin: string | null;
  pv_existante: "Oui" | "Non" | null;
  extension_install: "Oui" | "Non" | null;
  subvention_recue: "Oui" | "Non" | null;
  elig_decl: Record<string, "Oui" | "Non" | null> | null;
}

/** PICF — Package Info Client Ferme */
export interface PICF extends PicBase {
  segment: "Ferme";
}

/** Union type for all PIC variants */
export type PIC = PICM | PICA | PICE | PICF;

/** Helper to determine PIC type from segment string */
export function getPicSegment(type: string | null): PicBase["segment"] | null {
  if (!type) return null;
  const map: Record<string, PicBase["segment"]> = {
    Maison: "Maison",
    Appartement: "Appartement",
    Entreprise: "Entreprise",
    Ferme: "Ferme",
  };
  return map[type] ?? null;
}
