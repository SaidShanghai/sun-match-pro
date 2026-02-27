import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "nooria_diagnostic_draft";

export interface DiagnosticDraft {
  screen: string;
  selectedType: string | null;
  objectif: string | null;
  typeBatiment: string | null;
  conso: string;
  facture: string;
  puissanceSouscrite: string;
  typeAbonnement: string | null;
  ville: string;
  panelAccess: string[];
  selectedSurface: string | null;
  selectedUsages: string[];
  descriptionProjet: string;
  adresseProjet: string;
  villeProjet: string;
  roofLat: number | null;
  roofLng: number | null;
  dateDebut: string;
  dateFin: string;
  pvExistante: string | null;
  extensionInstall: string | null;
  subventionRecue: string | null;
  eligDecl: Record<string, string | null>;
  savedAt: number;
}

/** Save diagnostic state to localStorage (debounced) */
export function useDiagnosticPersistence() {
  const save = useCallback((draft: Omit<DiagnosticDraft, "savedAt">) => {
    try {
      // Don't save if still on landing/type or already submitted
      if (draft.screen === "landing" || draft.screen === "type" || draft.screen === "merci") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
    } catch {
      // localStorage full or unavailable — silent fail
    }
  }, []);

  const load = useCallback((): DiagnosticDraft | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const draft: DiagnosticDraft = JSON.parse(raw);
      // Expire after 24h
      if (Date.now() - draft.savedAt > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return draft;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { save, load, clear };
}
