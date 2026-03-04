/**
 * Social proof statistics displayed on the homepage.
 * Update these values as the platform grows, or replace
 * with a Supabase fetch in a future iteration.
 */
export const STATS = {
  diagnostics: { value: 500, suffix: "+", label: "Diagnostics réalisés" },
  installateurs: { value: 120, suffix: "+", label: "Installateurs partenaires" },
  rating: { value: 4.2, suffix: "★", decimals: 1, label: "Note moyenne" },
  savings: { value: 70, suffix: "%", label: "Économies moyennes constatées" },
} as const;
