import { useState, useRef, useEffect, useCallback } from "react";
import { useDiagnosticPersistence } from "@/hooks/useDiagnosticPersistence";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";
import JsonLd from "@/components/seo/JsonLd";
import { diagnosticSchema } from "@/config/seoSchemas";
import nooriaLogo from "@/assets/nooria-logo.jpg";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Zap, Shield, ArrowRight, Star, MapPin, FileText, Lock,
  ChevronLeft, TrendingDown, Battery, MapPinned, ChevronDown,
  Home, Building2, Store, Warehouse,
} from "lucide-react";
import FactureUpload from "@/components/FactureUpload";
import QuotePanel from "@/components/QuotePanel";
import EligibiliteScreen from "@/components/EligibiliteScreen";
import GoogleMapPicker from "@/components/GoogleMapPicker";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import SolarResults, { type SolarData } from "@/components/SolarResults";
import type { PIC, PICM, PICA, PICE, PICF, OcrFactureData } from "@/types/pic";

type Screen =
  | "landing"
  | "type"
  | "form"
  | "informations"
  | "site"
  | "eligibilite"
  | "analyse"
  | "solutions"
  | "merci";

import { villesMaroc } from "@/data/moroccanCities";

const projetSuggestions = [
  "Usine textile, 380V, 3 shifts/jour, financement via programme TATWIR souhaité",
  "Hôtel 4 étoiles, 120 chambres, besoin eau chaude sanitaire + climatisation centrale",
  "Entrepôt logistique, pic de conso 08h–18h, objectif réduction facture ONEE 60%",
  "Bâtiment industriel de 2 000 m², consommation électrique élevée en journée",
];

const getUsages = (type: string | null) => {
  if (type === "Maison") return [
    { icon: "❄️", label: "Climatisation" }, { icon: "🔥", label: "Chauffage" },
    { icon: "🚿", label: "Chauffe-eau" }, { icon: "🚗", label: "Véhicule élec." },
    { icon: "🏊", label: "Piscine" }, { icon: "🍳", label: "Cuisine élec." },
    { icon: "🧺", label: "Lave-linge" }, { icon: "💻", label: "Informatique" },
    { icon: "🧊", label: "Frigo/Congél." },
  ];
  if (type === "Appartement") return [
    { icon: "❄️", label: "Climatisation" }, { icon: "🔥", label: "Chauffage" },
    { icon: "🚿", label: "Chauffe-eau" }, { icon: "🚗", label: "Véhicule élec." },
    { icon: "🍳", label: "Cuisine élec." }, { icon: "🧺", label: "Lave-linge" },
    { icon: "💻", label: "Informatique" }, { icon: "🧊", label: "Frigo/Congél." },
  ];
  if (type === "Entreprise") return [
    { icon: "❄️", label: "Climatisation" }, { icon: "🔥", label: "Chauffage" },
    { icon: "🚿", label: "Chauffe-eau" }, { icon: "🚗", label: "Véhicule élec." },
    { icon: "🍳", label: "Cuisine élec." }, { icon: "💻", label: "Informatique" },
    { icon: "🧊", label: "Frigo/Congél." }, { icon: "❄️", label: "Chambre froide" },
    { icon: "💨", label: "Compresseur air" }, { icon: "💡", label: "Éclairage indus." },
    { icon: "⚙️", label: "Machines-outils" },
  ];
  return [
    { icon: "❄️", label: "Climatisation" }, { icon: "🔥", label: "Chauffage" },
    { icon: "🚿", label: "Chauffe-eau" }, { icon: "🚗", label: "Véhicule élec." },
    { icon: "🏊", label: "Piscine" }, { icon: "🍳", label: "Cuisine élec." },
    { icon: "🧺", label: "Lave-linge" }, { icon: "💻", label: "Informatique" },
    { icon: "🧊", label: "Frigo/Congél." }, { icon: "❄️", label: "Chambre froide" },
    { icon: "💨", label: "Compresseur air" },
  ];
};

const surfaces = [
  { m2: "22 m²", pan: "8 pan.", label: "M1" },
  { m2: "44 m²", pan: "16 pan.", label: "M2" },
  { m2: "66 m²", pan: "24 pan.", label: "M3/T1" },
  { m2: "132 m²", pan: "48 pan.", label: "T2" },
  { m2: "198 m²", pan: "72 pan.", label: "T3" },
  { m2: "264 m²", pan: "96 pan.", label: "T4" },
  { m2: "330 m²", pan: "120 pan.", label: "T5" },
  { m2: "396 m²", pan: "144 pan.", label: "T5+" },
];

const Diagnostic = () => {
  usePageMeta({
    title: "Diagnostic Solaire Gratuit – Résultat en 2 min | SOLARBOX",
    description: "Analysez votre facture ONEE et obtenez un diagnostic solaire personnalisé gratuit en 2 minutes grâce à SOLARBOX.",
  });
  const { save, load, clear } = useDiagnosticPersistence();
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [objectif, setObjectif] = useState<"facture" | "autonomie" | null>(null);
  const [typeBatiment, setTypeBatiment] = useState<"Industriel" | "Tertiaire" | null>(null);
  const [conso, setConso] = useState("");
  const [facture, setFacture] = useState("");
  const [puissanceSouscrite, setPuissanceSouscrite] = useState("");
  const [typeAbonnement, setTypeAbonnement] = useState<"Basse Tension" | "Moyenne Tension" | "Haute Tension" | null>(null);
  const [ville, setVille] = useState("");
  const [villeOpen, setVilleOpen] = useState(false);
  const [villeSearch, setVilleSearch] = useState("");
  const villeRef = useRef<HTMLDivElement>(null);
  const [panelAccess, setPanelAccess] = useState<string[]>([]);
  const [selectedSurface, setSelectedSurface] = useState<string | null>(null);
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [adresseProjet, setAdresseProjet] = useState("");
  const [villeProjet, setVilleProjet] = useState("");
  const [roofLat, setRoofLat] = useState<number | null>(null);
  const [roofLng, setRoofLng] = useState<number | null>(null);
  const [villeProjetOpen, setVilleProjetOpen] = useState(false);
  const [villeProjetSearch, setVilleProjetSearch] = useState("");
  const villeProjetRef = useRef<HTMLDivElement>(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [pvExistante, setPvExistante] = useState<"Oui" | "Non" | null>(null);
  const [extensionInstall, setExtensionInstall] = useState<"Oui" | "Non" | null>(null);
  const [subventionRecue, setSubventionRecue] = useState<"Oui" | "Non" | null>(null);
  const [eligDecl, setEligDecl] = useState<Record<string, "Oui" | "Non" | null>>({
    d1: null, d2: null, d3: null, d4: null, d5: null, d6: null,
  });
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [contactNom, setContactNom] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [solarLoading, setSolarLoading] = useState(false);
  const [solarError, setSolarError] = useState<string | null>(null);
  const [ocrRawData, setOcrRawData] = useState<OcrFactureData | null>(null);
  const { toast } = useToast();
  const [projetPlaceholderIndex, setProjetPlaceholderIndex] = useState(0);
  const [projetPlaceholderVisible, setProjetPlaceholderVisible] = useState(true);
  const restoredRef = useRef(false);

  // ── Restore draft on mount ──
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = load();
    if (!draft) return;

    setScreen(draft.screen as Screen);
    setSelectedType(draft.selectedType);
    setObjectif(draft.objectif as any);
    setTypeBatiment(draft.typeBatiment as any);
    setConso(draft.conso);
    setFacture(draft.facture);
    setPuissanceSouscrite(draft.puissanceSouscrite);
    setTypeAbonnement(draft.typeAbonnement as any);
    setVille(draft.ville);
    setPanelAccess(draft.panelAccess);
    setSelectedSurface(draft.selectedSurface);
    setSelectedUsages(draft.selectedUsages);
    setDescriptionProjet(draft.descriptionProjet);
    setAdresseProjet(draft.adresseProjet);
    setVilleProjet(draft.villeProjet);
    setRoofLat(draft.roofLat);
    setRoofLng(draft.roofLng);
    setDateDebut(draft.dateDebut);
    setDateFin(draft.dateFin);
    setPvExistante(draft.pvExistante as any);
    setExtensionInstall(draft.extensionInstall as any);
    setSubventionRecue(draft.subventionRecue as any);
    setEligDecl(draft.eligDecl as any);

    toast({ title: "Diagnostic en cours retrouvé", description: "Vos réponses ont été restaurées." });
  }, []);

  // ── Auto-save on every meaningful state change ──
  useEffect(() => {
    if (!restoredRef.current) return;
    save({
      screen, selectedType, objectif, typeBatiment, conso, facture,
      puissanceSouscrite, typeAbonnement, ville, panelAccess,
      selectedSurface, selectedUsages, descriptionProjet, adresseProjet,
      villeProjet, roofLat, roofLng, dateDebut, dateFin,
      pvExistante, extensionInstall, subventionRecue, eligDecl,
    });
  }, [screen, selectedType, objectif, typeBatiment, conso, facture,
    puissanceSouscrite, typeAbonnement, ville, panelAccess,
    selectedSurface, selectedUsages, descriptionProjet, adresseProjet,
    villeProjet, roofLat, roofLng, dateDebut, dateFin,
    pvExistante, extensionInstall, subventionRecue, eligDecl]);

  // ── Clear draft on successful submission ──
  const handleQuoteSuccess = useCallback((id: string, name: string, email: string) => {
    clear();
    setQuoteRef(id);
    setContactNom(name);
    setContactEmail(email);
    setScreen("merci");
  }, [clear]);

  /** Build the current PIC object from all state */
  const buildPic = (): PIC | null => {
    const segment = selectedType as PIC["segment"] | null;
    if (!segment) return null;

    const base = {
      objectif,
      consommation_annuelle_kwh: conso ? Number(conso.replace(/\s/g, "")) : null,
      facture_annuelle_mad: facture ? Number(facture.replace(/\s/g, "")) : null,
      ville: ville || villeProjet || null,
      gps: roofLat && roofLng ? { lat: roofLat, lng: roofLng } : null,
      usages: selectedUsages,
      acces_panneaux: panelAccess,
      surface: selectedSurface,
      ocr_brut: ocrRawData,
      distributeur: ocrRawData?.distributeur ?? null,
      type_abonnement: typeAbonnement ?? ocrRawData?.type_abonnement ?? null,
      puissance_souscrite_kva: puissanceSouscrite ? Number(puissanceSouscrite) : ocrRawData?.puissance_souscrite_kva ?? null,
      tranche_tarifaire: ocrRawData?.tranche_tarifaire ?? null,
    };

    if (segment === "Entreprise") {
      return {
        ...base,
        segment: "Entreprise",
        type_batiment: typeBatiment,
        description_projet: descriptionProjet || null,
        adresse_projet: adresseProjet || null,
        ville_projet: villeProjet || null,
        date_debut: dateDebut || null,
        date_fin: dateFin || null,
        pv_existante: pvExistante,
        extension_install: extensionInstall,
        subvention_recue: subventionRecue,
        elig_decl: Object.values(eligDecl).some(v => v !== null) ? eligDecl : null,
      } as PICE;
    }

    return { ...base, segment } as PICM | PICA | PICF;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProjetPlaceholderVisible(false);
      setTimeout(() => {
        setProjetPlaceholderIndex(prev => (prev + 1) % projetSuggestions.length);
        setProjetPlaceholderVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (villeRef.current && !villeRef.current.contains(e.target as Node)) {
        setVilleOpen(false);
        setVilleSearch("");
      }
      if (villeProjetRef.current && !villeProjetRef.current.contains(e.target as Node)) {
        setVilleProjetOpen(false);
        setVilleProjetSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredVilles = villesMaroc.filter(v => v.toLowerCase().includes(villeSearch.toLowerCase()));
  const filteredVillesProjet = villesMaroc.filter(v => v.toLowerCase().includes(villeProjetSearch.toLowerCase()));

  const goBack = () => {
    const map: Record<Screen, Screen> = {
      landing: "landing",
      type: "landing",
      form: "type",
      informations: "form",
      site: selectedType === "Entreprise" ? "informations" : "form",
      eligibilite: "site",
      analyse: "eligibilite",
      solutions: "analyse",
      merci: "solutions",
    };
    setScreen(map[screen] ?? "landing");
  };

  const steps = selectedType === "Entreprise"
    ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"]
    : ["Profil", "Site", "Analyse", "Solutions", "Contact"];

  const getStepIndex = (): number => {
    if (selectedType === "Entreprise") {
      return { form: 0, informations: 1, site: 2, eligibilite: 3, analyse: 4, solutions: 5, merci: 6 }[screen] ?? -1;
    }
    return { form: 0, site: 1, analyse: 2, solutions: 3, merci: 4 }[screen] ?? -1;
  };

  const isInForm = !["landing", "type"].includes(screen);

  const Stepper = () => {
    if (!isInForm) return null;
    const activeIndex = getStepIndex();
    return (
      <div className="flex items-center justify-between px-2 py-3 border-b border-border/50">
        {steps.map((step, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={step} className="flex flex-col items-center gap-0.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                {isDone ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] ${isActive || isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <JsonLd schema={diagnosticSchema} />

      {screen === "landing" ? (
        /* ── Landing page ── */
        <main className="flex-1 flex items-center justify-center pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Diagnostic solaire gratuit</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  Votre diagnostic<br />
                  <span className="text-gradient">en 3 minutes</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                  Particulier ou entreprise, obtenez une analyse solaire sur mesure et des installateurs certifiés près de chez vous.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 py-4 border-y border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold">15K+</div>
                  <div className="text-sm text-muted-foreground">Diagnostics</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">30+</div>
                  <div className="text-sm text-muted-foreground">Installateurs</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="text-3xl font-bold">4.9</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
              </div>

              <button
                onClick={() => setScreen("type")}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground h-16 px-10 rounded-2xl text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Lancer l'analyse solaire <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-sm text-muted-foreground">Gratuit • Sans engagement • Résultat instantané</p>
            </motion.div>
          </div>
        </main>
      ) : (
        /* ── Multi-step form ── */
        <main className="flex-1 flex flex-col pt-16">
          {/* Top bar with back + stepper */}
          <div className="sticky top-16 z-30 bg-background border-b border-border">
            <div className="container mx-auto px-4 max-w-2xl">
              <div className="flex items-center gap-3 py-3">
                <button onClick={goBack} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center justify-between">
                  {isInForm && steps.map((step, i) => {
                    const activeIndex = getStepIndex();
                    const isDone = i < activeIndex;
                    const isActive = i === activeIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-0.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span className={`text-[10px] ${isActive || isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                      </div>
                    );
                  })}
                  {screen === "type" && (
                    <span className="text-sm font-medium text-muted-foreground">Choisissez votre profil</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-4 max-w-2xl py-8">
            <AnimatePresence mode="wait">

              {/* ── TYPE ── */}
              {screen === "type" && (
                <motion.div key="type" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black">Vous êtes…</h2>
                    <p className="text-muted-foreground mt-1">Sélectionnez votre profil pour un diagnostic personnalisé</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Home, label: "Maison", desc: "Résidentiel individuel" },
                      { icon: Building2, label: "Appartement", desc: "Copropriété / immeuble" },
                      { icon: Store, label: "Entreprise", desc: "PME, industrie, tertiaire" },
                      { icon: Warehouse, label: "Ferme", desc: "Agriculture / irrigation" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <button
                        key={label}
                        onClick={() => { setSelectedType(label); setScreen("form"); }}
                        className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.97]"
                      >
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">{label}</p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── FORM (Étape 1 : Profil énergie) ── */}
              {screen === "form" && (
                <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black">Votre profil énergie</h2>
                    <p className="text-muted-foreground text-sm mt-1">Quelques informations sur votre consommation</p>
                  </div>

                  {/* Objectif */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Objectif principal</label>
                    <div className="flex gap-3">
                      <button onClick={() => setObjectif("facture")} className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${objectif === "facture" ? "bg-primary border-primary" : "border-border hover:border-primary/50"}`}>
                        <TrendingDown className="w-6 h-6 shrink-0" />
                        <span className="flex flex-col items-start leading-tight">
                          <span>Réduire la facture</span>
                          <span className="text-[10px] font-normal opacity-75">Sans stockage d'énergie</span>
                        </span>
                      </button>
                      <button onClick={() => setObjectif("autonomie")} className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${objectif === "autonomie" ? "bg-primary border-primary" : "border-border hover:border-primary/50"}`}>
                        <Battery className="w-6 h-6 shrink-0" />
                        <span className="flex flex-col items-start leading-tight">
                          <span>Autonomie totale</span>
                          <span className="text-[10px] font-normal opacity-75">Avec stockage d'énergie</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Facture upload with AI OCR */}
                  {(
                    <FactureUpload
                      onDataExtracted={(ocrData) => {
                        // Store raw OCR data for PIC
                        setOcrRawData(ocrData as OcrFactureData);
                        // Auto-fill form fields from OCR
                        if (ocrData.montant_ttc) {
                          // Estimate annual from period
                          const days = ocrData.periode_jours || 30;
                          const annualAmount = Math.round((ocrData.montant_ttc / days) * 365);
                          setFacture(annualAmount.toLocaleString("fr-FR"));
                        }
                        if (ocrData.consommation_kwh) {
                          const days = ocrData.periode_jours || 30;
                          const annualKwh = Math.round((ocrData.consommation_kwh / days) * 365);
                          setConso(annualKwh.toLocaleString("fr-FR"));
                        }
                        if (ocrData.ville) {
                          // Try to match with our city list
                          const match = villesMaroc.find(v => 
                            v.toLowerCase() === ocrData.ville!.toLowerCase() ||
                            v.toLowerCase().includes(ocrData.ville!.toLowerCase()) ||
                            ocrData.ville!.toLowerCase().includes(v.toLowerCase())
                          );
                          if (match) setVille(match);
                        }
                        if (ocrData.puissance_souscrite_kva) {
                          setPuissanceSouscrite(String(ocrData.puissance_souscrite_kva));
                        }
                        if (ocrData.type_abonnement) {
                          const mapped = ocrData.type_abonnement as typeof typeAbonnement;
                          if (["Basse Tension", "Moyenne Tension", "Haute Tension"].includes(ocrData.type_abonnement)) {
                            setTypeAbonnement(mapped);
                          }
                        }
                      }}
                    />
                  )}

                  {selectedType === "Entreprise" ? (
                    <>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold">Type de bâtiment</label>
                        <div className="flex gap-3">
                          {(["Industriel", "Tertiaire"] as const).map(opt => (
                            <button key={opt} onClick={() => setTypeBatiment(opt)} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${typeBatiment === opt ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Consommation annuelle (kWh)</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                          <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input type="text" inputMode="numeric" value={conso} onChange={(e) => { const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, ""); setConso(raw ? Number(raw).toLocaleString("fr-FR") : ""); }} placeholder="Ex : 480 000" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Facture annuelle (MAD)</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input type="text" inputMode="numeric" value={facture} onChange={(e) => { const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, ""); setFacture(raw ? Number(raw).toLocaleString("fr-FR") : ""); }} placeholder="Ex : 180 000" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Puissance souscrite (kVA)</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                          <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input type="number" value={puissanceSouscrite} onChange={e => setPuissanceSouscrite(e.target.value)} placeholder="Ex : 160" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Type d'abonnement</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl">
                          <select value={typeAbonnement ?? ""} onChange={e => setTypeAbonnement(e.target.value as any)} className="bg-background outline-none w-full text-sm appearance-none cursor-pointer">
                            <option value="" disabled>Choisir...</option>
                            <option value="Basse Tension">Basse Tension (≤ 1 kV)</option>
                            <option value="Moyenne Tension">Moyenne Tension (1–50 kV)</option>
                            <option value="Haute Tension">Haute Tension (&gt; 50 kV)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Facture annuelle (MAD)</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input type="text" inputMode="numeric" value={facture} onChange={(e) => { const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, ""); setFacture(raw ? Number(raw).toLocaleString("fr-FR") : ""); }} placeholder="Ex : 9 600" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Consommation annuelle (kWh)</label>
                        <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl focus-within:border-primary transition-colors">
                          <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input type="text" inputMode="numeric" value={conso} onChange={(e) => { const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, ""); setConso(raw ? Number(raw).toLocaleString("fr-FR") : ""); }} placeholder="Ex : 350" className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2" ref={villeRef}>
                        <label className="text-sm font-semibold">Ville</label>
                        <div className="relative">
                          <div className="flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl cursor-pointer" onClick={() => setVilleOpen(v => !v)}>
                            <MapPinned className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className={`text-sm flex-1 ${ville ? "" : "text-muted-foreground"}`}>{ville || "Sélectionnez une ville"}</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          </div>
                          {villeOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-xl bg-background shadow-lg z-10 max-h-48 overflow-y-auto">
                              <div className="px-3 pt-2 pb-1 sticky top-0 bg-background">
                                <input type="text" value={villeSearch} onChange={e => setVilleSearch(e.target.value)} placeholder="Rechercher..." className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background outline-none" autoFocus />
                              </div>
                              {filteredVilles.map(v => (
                                <button key={v} onClick={() => { setVille(v); setVilleOpen(false); setVilleSearch(""); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/5 transition-colors ${v === ville ? "text-primary font-semibold" : "text-foreground"}`}>{v}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Google Maps Picker */}
                      {ville && (
                        <GoogleMapPicker
                          city={ville}
                          onLocationSelect={(lat, lng) => { setRoofLat(lat); setRoofLng(lng); }}
                        />
                      )}
                    </>
                  )}

                  <button
                    onClick={() => {
                      const valid = selectedType === "Entreprise"
                        ? !!(typeBatiment && conso.trim() && facture.trim() && puissanceSouscrite.trim() && typeAbonnement)
                        : !!(objectif && (facture.trim() || conso.trim()));
                      if (valid) setScreen(selectedType === "Entreprise" ? "informations" : "site");
                    }}
                    className={`w-full rounded-2xl h-14 font-semibold text-base flex items-center justify-center gap-2 transition-colors ${
                      (selectedType === "Entreprise" ? !!(typeBatiment && conso.trim() && facture.trim() && puissanceSouscrite.trim() && typeAbonnement) : !!(objectif && (facture.trim() || conso.trim())))
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── INFORMATIONS (Entreprise seulement) ── */}
              {screen === "informations" && (
                <motion.div key="informations" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black">Informations projet</h2>
                    <p className="text-muted-foreground text-sm mt-1">Détaillez votre projet pour un diagnostic précis</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Description du projet</label>
                    <div className="relative">
                      <textarea value={descriptionProjet} onChange={(e) => setDescriptionProjet(e.target.value)} rows={3} className="w-full text-sm bg-transparent outline-none border-2 border-border rounded-xl px-4 py-3 text-foreground resize-none focus:border-primary transition-colors relative z-10" />
                      {!descriptionProjet && (
                        <span className="absolute top-3 left-4 right-4 text-sm text-muted-foreground pointer-events-none leading-relaxed z-0" style={{ opacity: projetPlaceholderVisible ? 1 : 0, transition: "opacity 0.4s ease" }}>
                          {projetSuggestions[projetPlaceholderIndex]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Adresse du projet</label>
                    <AddressAutocomplete
                      value={adresseProjet}
                      onChange={setAdresseProjet}
                      placeholder="N°, Rue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Ville</label>
                    <div ref={villeProjetRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setVilleProjetOpen(o => !o)}
                        className="w-full flex items-center gap-2 px-4 py-3 border-2 border-border rounded-xl transition-colors text-sm text-left"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className={villeProjet ? "text-foreground" : "text-muted-foreground"}>{villeProjet || "Sélectionner une ville"}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                      </button>
                      {villeProjetOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-hidden flex flex-col">
                          <div className="p-2 border-b border-border">
                            <input
                              autoFocus
                              type="text"
                              value={villeProjetSearch}
                              onChange={(e) => setVilleProjetSearch(e.target.value)}
                              placeholder="Rechercher..."
                              className="w-full text-sm bg-transparent outline-none px-2 py-1"
                            />
                          </div>
                          <div className="overflow-y-auto">
                            {filteredVillesProjet.map(v => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => { setVilleProjet(v); setVilleProjetOpen(false); setVilleProjetSearch(""); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${villeProjet === v ? "text-primary font-medium" : ""}`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Google Maps Picker for Entreprise */}
                  {villeProjet && (
                    <GoogleMapPicker
                      city={villeProjet}
                      onLocationSelect={(lat, lng) => { setRoofLat(lat); setRoofLng(lng); }}
                    />
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Accès panneaux</label>
                    <div className="flex gap-3">
                      {[{ value: "sol", label: "Sol" }, { value: "toit", label: "Toit" }].map(opt => (
                        <button key={opt.value} onClick={() => setPanelAccess(prev => prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value])} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${panelAccess.includes(opt.value) ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Surface disponible</label>
                    <div className="grid grid-cols-4 gap-2">
                      {surfaces.map(s => (
                        <button key={s.label} onClick={() => setSelectedSurface(s.label)} className={`flex flex-col items-center p-2.5 rounded-xl border-2 text-center transition-colors ${selectedSurface === s.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                          <span className="text-xs font-bold">{s.m2}</span>
                          <span className="text-[10px] text-muted-foreground">{s.pan}</span>
                          <span className="text-[10px] font-medium text-primary">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Date de début</label>
                      <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="w-full text-sm bg-transparent outline-none border-2 border-border rounded-xl px-4 py-3 text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Date de fin</label>
                      <input type="date" value={dateFin} min={dateDebut || undefined} onChange={(e) => setDateFin(e.target.value)} className="w-full text-sm bg-transparent outline-none border-2 border-border rounded-xl px-4 py-3 text-foreground" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const valid = descriptionProjet.trim() && adresseProjet.trim() && villeProjet && panelAccess.length > 0 && selectedSurface && dateDebut && dateFin && dateFin >= dateDebut;
                      if (valid) setScreen("site");
                    }}
                    className={`w-full rounded-2xl h-14 font-semibold text-base flex items-center justify-center gap-2 transition-colors ${descriptionProjet.trim() && adresseProjet.trim() && villeProjet && panelAccess.length > 0 && selectedSurface && dateDebut && dateFin && dateFin >= dateDebut ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── SITE ── */}
              {screen === "site" && (
                <motion.div key="site" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black">Votre site</h2>
                    <p className="text-muted-foreground text-sm mt-1">Informations sur l'emplacement des panneaux</p>
                  </div>

                  {selectedType !== "Entreprise" && (
                    <>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold">Accès panneaux</label>
                        <div className="flex gap-3">
                          {[{ value: "toit", label: "Toit" }, { value: "sol", label: "Sol" }, { value: "terrasse", label: "Terrasse" }].map(opt => (
                            <button key={opt.value} onClick={() => setPanelAccess(prev => prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value])} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${panelAccess.includes(opt.value) ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}`}>{opt.label}</button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold">Surface disponible</label>
                        <div className="grid grid-cols-4 gap-2">
                          {surfaces.map(s => (
                            <button key={s.label} onClick={() => setSelectedSurface(s.label)} className={`flex flex-col items-center p-2.5 rounded-xl border-2 text-center transition-colors ${selectedSurface === s.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                              <span className="text-xs font-bold">{s.m2}</span>
                              <span className="text-[10px] text-muted-foreground">{s.pan}</span>
                              <span className="text-[10px] font-medium text-primary">{s.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Usages spécifiques</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getUsages(selectedType).map((u) => {
                        const isSelected = selectedUsages.includes(u.label);
                        return (
                          <button key={u.label} onClick={() => setSelectedUsages(prev => isSelected ? prev.filter(x => x !== u.label) : [...prev, u.label])} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                            <span className="text-xl">{u.icon}</span>
                            <span className={`text-[11px] leading-tight text-center ${isSelected ? "text-primary font-medium" : "text-muted-foreground"}`}>{u.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedType === "Entreprise" && (
                    <div className="space-y-4">
                      {([
                        { label: "Installation PV existante", value: pvExistante, set: setPvExistante },
                        { label: "Extension d'une installation ?", value: extensionInstall, set: setExtensionInstall },
                        { label: "Subvention déjà reçue ?", value: subventionRecue, set: setSubventionRecue },
                      ] as { label: string; value: "Oui" | "Non" | null; set: (v: "Oui" | "Non") => void }[]).map(({ label, value, set }) => (
                        <div key={label} className="space-y-2">
                          <label className="text-sm font-semibold">{label}</label>
                          <div className="flex gap-3">
                            {(["Oui", "Non"] as const).map(opt => (
                              <button key={opt} onClick={() => set(opt)} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${value === opt ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const siteValid = selectedUsages.length > 0 && (selectedType === "Entreprise" ? (panelAccess.length > 0 && selectedSurface && pvExistante !== null && extensionInstall !== null && subventionRecue !== null) : (panelAccess.length > 0 && selectedSurface));
                      if (!siteValid) return;
                      if (selectedType === "Entreprise") {
                        setScreen("eligibilite");
                      } else {
                        setScreen("analyse");
                        setSolarLoading(true);
                        setSolarError(null);
                        setSolarData(null);
                        const lat = roofLat || 33.5731;
                        const lng = roofLng || -7.5898;
                        const surfaceM2 = selectedSurface ? parseInt(surfaces.find(s => s.label === selectedSurface)?.m2 || "22") : 22;
                        const estimatedKwp = Math.max(1, Math.round((surfaceM2 / 2) * 0.5));
                        supabase.functions.invoke("get-solar-data", { body: { lat, lng, peakpower: estimatedKwp } })
                          .then(({ data, error: fnErr }) => {
                            if (fnErr || data?.error === "no_coverage" || data?.error) {
                              setSolarError(data?.message || "Données non disponibles");
                              setSolarData(null);
                            } else {
                              setSolarData(data);
                            }
                            setSolarLoading(false);
                            setTimeout(() => setScreen("solutions"), 2000);
                          })
                          .catch(() => {
                            setSolarError("Erreur lors de l'appel Solar API");
                            setSolarLoading(false);
                            setTimeout(() => setScreen("solutions"), 2000);
                          });
                      }
                    }}
                    className={`w-full rounded-2xl h-14 font-semibold text-base flex items-center justify-center gap-2 transition-colors ${
                      selectedUsages.length > 0 && (selectedType === "Entreprise" ? (panelAccess.length > 0 && selectedSurface && pvExistante !== null && extensionInstall !== null && subventionRecue !== null) : (panelAccess.length > 0 && selectedSurface))
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {selectedType === "Entreprise" ? "Continuer" : "Analyser"} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

               {screen === "eligibilite" && (
                <motion.div key="eligibilite" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black">Éligibilité</h2>
                    <p className="text-muted-foreground text-sm mt-1">Vérification de l'éligibilité aux programmes d'aides de l'État</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Déclarations d'éligibilité</p>
                    {[
                      { id: "d1", text: "Le projet n'a pas encore commencé" },
                      { id: "d2", text: "L'installation solaire photovoltaïque est nouvelle (GreenField)" },
                      { id: "d3", text: "L'installation est sur toiture (ou shelter) et connectée au réseau" },
                      { id: "d4", text: "La capacité installée est inférieure à 3 MW", anyOk: true },
                      { id: "d5", text: "Le bénéficiaire n'a reçu et ne recevra pas d'autres incitations financières autres que les revenus générés par les crédits carbone issus de son projet solaire" },
                      { id: "d6", text: "Le bénéficiaire déclare être le propriétaire de l'installation solaire et confirme son engagement à transférer les réductions d'émissions associées au projet, dans le cadre d'un programme de valorisation carbone." },
                    ].map(d => (
                      <div key={d.id} className="rounded-2xl border border-border p-4 space-y-3">
                        <p className="text-sm text-foreground leading-relaxed font-medium">{d.text}</p>
                        <div className="flex gap-3">
                          {(["Oui", "Non"] as const).map(opt => (
                            <button
                              key={opt}
                              onClick={() => setEligDecl(prev => ({ ...prev, [d.id]: opt }))}
                              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                                eligDecl[d.id] === opt
                                  ? (opt === "Oui" || d.anyOk)
                                    ? "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : "border-border text-foreground hover:border-primary/50"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const canContinue = ["d1","d2","d3","d5","d6"].every(id => eligDecl[id] === "Oui") && eligDecl["d4"] !== null;
                    return (
                      <button
                        onClick={() => {
                          if (!canContinue) return;
                          setScreen("analyse");
                          setSolarLoading(true);
                          setSolarError(null);
                          setSolarData(null);
                          const lat = roofLat || 33.5731;
                          const lng = roofLng || -7.5898;
                          // Estimate peakpower from surface for Maison (rough: 1 panel = 400W, 2m²)
                          const surfaceM2 = selectedSurface ? parseInt(surfaces.find(s => s.label === selectedSurface)?.m2 || "22") : 22;
                          const estimatedKwp = Math.max(1, Math.round((surfaceM2 / 2) * 0.4));
                          supabase.functions.invoke("get-solar-data", { body: { lat, lng, peakpower: estimatedKwp } })
                            .then(({ data, error: fnErr }) => {
                              if (fnErr || data?.error === "no_coverage" || data?.error) {
                                setSolarError(data?.message || "Données non disponibles");
                                setSolarData(null);
                              } else {
                                setSolarData(data);
                              }
                              setSolarLoading(false);
                              setTimeout(() => setScreen("solutions"), 2000);
                            })
                            .catch(() => {
                              setSolarError("Erreur lors de l'appel PVGIS");
                              setSolarLoading(false);
                              setTimeout(() => setScreen("solutions"), 2000);
                            });
                        }}
                        disabled={!canContinue}
                        className={`w-full rounded-2xl h-14 font-semibold text-base flex items-center justify-center gap-2 transition-colors ${canContinue ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                      >
                        Analyser mon projet <ArrowRight className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </motion.div>
              )}

              {/* ── ANALYSE ── */}
              {screen === "analyse" && (
                <motion.div key="analyse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
                  <motion.div
                    animate={{ opacity: [1, 0.1, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="select-none"
                  >
                    <span className="font-black text-4xl tracking-tight">
                      <span className="text-foreground">SOLAR</span>
                      <span className="text-[hsl(24,95%,53%)]">BOX</span>
                    </span>
                  </motion.div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-bold">Analyse en cours…</p>
                    <p className="text-muted-foreground">
                      {solarLoading ? "Interrogation de PVGIS…" : "Préparation de vos résultats…"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── SOLUTIONS ── */}
              {screen === "solutions" && (
                <motion.div key="solutions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                  {/* Solar API Results */}
                  <SolarResults
                    data={solarData}
                    loading={solarLoading}
                    error={solarError}
                    factureMad={facture ? Number(facture.replace(/\s/g, "")) : undefined}
                    consoKwh={conso ? Number(conso.replace(/\s/g, "")) : undefined}
                    city={ville || villeProjet || undefined}
                  />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Solutions recommandées</h2>
                      <p className="text-sm text-muted-foreground">Basé sur votre {selectedType?.toLowerCase() || "logement"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {["Solution optimale identifiée", "Installateurs certifiés sélectionnés", "Aides d'état applicables détectées"].map((item) => (
                      <div key={item} className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-primary">✓</span>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                        <Lock className="w-8 h-8 text-primary shrink-0" strokeWidth={2.5} />
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-2 text-center">
                    <p className="font-bold text-lg">Analyse terminée !</p>
                    <p className="text-sm text-muted-foreground">Vos solutions personnalisées ont été préparées.<br />Nos experts vous contactent sous 24h.</p>
                  </div>

                  <button onClick={() => setQuoteOpen(true)} className="w-full bg-primary text-primary-foreground rounded-2xl h-14 font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                    Demander un devis <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── MERCI ── */}
              {screen === "merci" && (
                <motion.div key="merci" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex flex-col items-center text-center gap-6 py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }} className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-4xl">✅</span>
                  </motion.div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black">Demande reçue !</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Prochaine étape : vérification technique et estimation préliminaire.<br />
                      Un expert SOLARBOX vous contacte sous <span className="font-semibold text-foreground">24h</span> (WhatsApp ou appel).
                    </p>
                    {quoteRef && (
                      <div className="inline-flex items-center gap-2 bg-muted rounded-xl px-4 py-2 mt-2">
                        <span className="text-sm text-muted-foreground font-medium">Référence :</span>
                        <span className="text-sm font-bold font-mono">#{quoteRef.slice(0, 12).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full max-w-md space-y-3">
                    <button onClick={() => { setScreen("landing"); setQuoteRef(null); }} className="w-full border-2 border-border rounded-2xl py-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                      Retour à l'accueil
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      )}

      

      <QuotePanel
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        diagnosticData={{
          housing_type: selectedType || undefined,
          objectif: objectif || undefined,
          roof_type: typeBatiment || undefined,
          roof_orientation: panelAccess.length > 0 ? panelAccess.join(", ") : undefined,
          roof_surface: selectedSurface || undefined,
          annual_consumption: conso ? `${conso} kWh` : undefined,
          budget: facture ? `${facture} DH/mois` : undefined,
          
          type_abonnement: typeAbonnement || undefined,
          puissance_souscrite: puissanceSouscrite ? `${puissanceSouscrite} kVA` : undefined,
          selected_usages: selectedUsages.length > 0 ? selectedUsages : undefined,
          description_projet: descriptionProjet || undefined,
          adresse_projet: adresseProjet || undefined,
          ville_projet: villeProjet || ville || undefined,
          date_debut: dateDebut || undefined,
          date_fin: dateFin || undefined,
          pv_existante: pvExistante || undefined,
          extension_install: extensionInstall || undefined,
          subvention_recue: subventionRecue || undefined,
          elig_decl: Object.values(eligDecl).some(v => v !== null) ? eligDecl : undefined,
          gps_lat: roofLat ?? undefined,
          gps_lng: roofLng ?? undefined,
        }}
        pic={buildPic()}
        onSuccess={(id, clientName, clientEmail) => {
          setQuoteOpen(false);
          handleQuoteSuccess(id, clientName, clientEmail);
        }}
      />
    </div>
  );
};

export default Diagnostic;
