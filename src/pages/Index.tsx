import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import nooriaLogo from "@/assets/nooria-logo.jpg";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  PiggyBank,
  Leaf,
  Zap,
  Shield,
  ArrowRight,
  Star,
  MapPin,
  FileText,
  ChevronLeft,
  TrendingDown,
  Battery,
  MapPinned,
  ChevronDown,
  Home,
  Building2,
  Store,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallbackModal from "@/components/CallbackModal";
import QuotePanel from "@/components/QuotePanel";
import EligibiliteScreen from "@/components/EligibiliteScreen";

const features = [
  {
    icon: MapPin,
    title: "Installateurs Locaux",
    description: "Des professionnels certifiés RGE près de chez vous, vérifiés et notés.",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Installateurs certifiés, garanties décennales et suivi post-installation.",
  },
  {
    icon: PiggyBank,
    title: "Économies Réelles",
    description: "Jusqu'à 70% de réduction sur votre facture d'électricité.",
  },
  {
    icon: Zap,
    title: "Diagnostic Express",
    description: "En 2 minutes, obtenez une estimation personnalisée de votre potentiel.",
  },
];

const heroWords = ["Le solaire,", "Le diagnostic,", "Le soutien,", "Le financement,", "Le chantier,", "Le suivi,"];
const heroWordsEntreprise = ["SR500,", "TATWIR,", "GEFF,", "PPA,", "Le chantier,", "Le suivi,", "Le diagnostic,", "Le soutien,", "Le financement,"];

const HeroRotatingTitle = ({ entreprise = false }: { entreprise?: boolean }) => {
  const [index, setIndex] = useState(0);
  const words = entreprise ? heroWordsEntreprise : heroWords;

  useEffect(() => {
    setIndex(0);
  }, [entreprise]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
      <span className="block h-[1.2em] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-gradient">simplifié</span>
    </h1>
  );
};

const Index = () => {
  const [phoneScreen, setPhoneScreen] = useState<"intro" | "type" | "form" | "informations" | "site" | "eligibilite" | "analyse" | "solutions" | "contact" | "merci">("intro");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [objectif, setObjectif] = useState<"facture" | "autonomie" | null>(null);
  const [typeBatiment, setTypeBatiment] = useState<"Industriel" | "Tertiaire" | null>(null);
  const [secteurActiviteProfil, setSecteurActiviteProfil] = useState("");
  const [tension, setTension] = useState<"220" | "380" | null>(null);
  const [conso, setConso] = useState("");
  const [facture, setFacture] = useState("");
  const [puissanceSouscrite, setPuissanceSouscrite] = useState("");
  const [typeAbonnement, setTypeAbonnement] = useState<"Basse Tension" | "Moyenne Tension" | "Haute Tension" | null>(null);
  const [ville, setVille] = useState("Casablanca");
  const [villeOpen, setVilleOpen] = useState(false);
  const [villeSearch, setVilleSearch] = useState("");
  const [panelAccess, setPanelAccess] = useState<string[]>([]);
  const [selectedSurface, setSelectedSurface] = useState<string | null>(null);
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);
  const [analyseProgress, setAnalyseProgress] = useState(0);
  const [analyseLabel, setAnalyseLabel] = useState("");
  const [ctaBlink, setCtaBlink] = useState(false);
  const [entrepriseBlink, setEntrepriseBlink] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [invoiceUploading, setInvoiceUploading] = useState(false);
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const invoiceInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [contactNom, setContactNom] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTel, setContactTel] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  // Rotating placeholder for description
  const projetSuggestions = [
    "Usine textile, 380V, 3 shifts/jour, financement via programme TATWIR souhaité",
    "Hôtel 4 étoiles, 120 chambres, besoin eau chaude sanitaire + climatisation centrale",
    "Entrepôt logistique, pic de conso 08h–18h, objectif réduction facture ONEE 60%",
    "Bâtiment industriel de 2 000 m², consommation électrique élevée en journée",
  ];
  const [projetPlaceholderIndex, setProjetPlaceholderIndex] = useState(0);
  const [projetPlaceholderVisible, setProjetPlaceholderVisible] = useState(true);
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
  // Informations Entreprise
  const [batimentType, setBatimentType] = useState<"Industriel" | "Tertiaire" | null>(null);
  const [secteurActivite, setSecteurActivite] = useState("");
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [adresseProjet, setAdresseProjet] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [pvExistante, setPvExistante] = useState<"Oui" | "Non" | null>(null);
  const [extensionInstall, setExtensionInstall] = useState<"Oui" | "Non" | null>(null);
  const [subventionRecue, setSubventionRecue] = useState<"Oui" | "Non" | null>(null);
  const villeRef = useRef<HTMLDivElement>(null);

  const handleAideCTA = () => {
    setPhoneScreen("intro");
    setSelectedType(null);
    setCtaBlink(true);
    setTimeout(() => {
      setCtaBlink(false);
      setPhoneScreen("type");
      setTimeout(() => {
        setEntrepriseBlink(true);
        setTimeout(() => {
          setEntrepriseBlink(false);
          setSelectedType("Entreprise");
          setPhoneScreen("form");
        }, 3000);
      }, 300);
    }, 2000);
  };

  const villes = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "El Jadida", "Nador", "Béni Mellal", "Mohammedia"];
  const filteredVilles = villes.filter(v => v.toLowerCase().includes(villeSearch.toLowerCase()));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (villeRef.current && !villeRef.current.contains(e.target as Node)) {
        setVilleOpen(false);
        setVilleSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">30+ installateurs certifiés au Maroc</span>
              </div>

              <HeroRotatingTitle entreprise={selectedType === "Entreprise"} />

              <p className="text-xl text-muted-foreground max-w-lg">
                NOORIA connecte particuliers et installateurs certifiés. Diagnostic gratuit, devis personnalisés, installation garantie, programmes d'aides du Royaume.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group h-14 px-8 text-base"
                >
                  <Link to="/diagnostic">
                    Lancer mon diagnostic
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base">
                  <Link to="/diagnostic">
                    Comment ça marche ?
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-border">
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

              <div>
                <button
                  onClick={handleAideCTA}
                  className="flex items-center gap-2 h-14 px-8 text-base font-semibold bg-black text-white rounded-md animate-[pulse_1.5s_ease-in-out_infinite] hover:animate-none hover:scale-105 transition-transform"
                >
                  <span className="w-2 h-2 bg-white rounded-full shrink-0" />
                  Aides d'état SR500, TATWIR
                </button>
              </div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative mx-auto w-[360px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col h-[696px]">
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-24 h-4 bg-muted rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-1 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {phoneScreen !== "intro" && (
                        <button onClick={() => setPhoneScreen(phoneScreen === "merci" ? "solutions" : phoneScreen === "contact" ? "solutions" : phoneScreen === "solutions" ? "analyse" : phoneScreen === "analyse" ? "eligibilite" : phoneScreen === "eligibilite" ? "site" : phoneScreen === "site" ? (selectedType === "Entreprise" ? "informations" : "form") : phoneScreen === "informations" ? "form" : phoneScreen === "form" ? "type" : "intro")} className="p-0.5">
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                      )}
                      <img src={nooriaLogo} alt="NOORIA" className="h-5 w-auto object-contain" />
                      <span className="text-[8px] text-muted-foreground font-normal leading-none">
                          {selectedType && phoneScreen !== "intro" && phoneScreen !== "type"
                            ? (selectedType === "Maison" || selectedType === "Appartement" ? "Particulier" : selectedType === "Ferme" ? "Agriculteur" : selectedType)
                            : ""}
                        </span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">SunStone Finance</span>
                  </div>

                  <div className={`flex-1 min-h-0 relative ${phoneScreen === "analyse" ? "overflow-hidden" : "overflow-y-auto"}`}>
                  <AnimatePresence mode="wait">
                    {phoneScreen === "intro" ? (
                      <motion.div
                        key="intro"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 py-6 flex flex-col items-center text-center gap-4"
                      >
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                          <Sun className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold">SUN_GPT</h3>
                          <p className="text-[10px] text-muted-foreground">par SunStone Finance</p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                            Analysez votre consommation, découvrez<br />la solution solaire optimale
                          </p>
                        </div>

                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2.5 p-3 bg-background border border-border/80 rounded-xl text-left shadow-sm">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                              <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-[10px] leading-snug">Dimensionnement intelligent basé sur votre consommation</span>
                          </div>
                          <div className="flex items-center gap-2.5 p-3 bg-background border border-border/80 rounded-xl text-left shadow-sm">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                              <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-[10px] leading-snug">Matching intelligent avec les installateurs certifiés près de chez vous</span>
                          </div>
                          <div className="flex items-center gap-2.5 p-3 bg-background border border-border/80 rounded-xl text-left shadow-sm">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                              <Sun className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-[10px] leading-snug">Devis personnalisé en quelques minutes</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setPhoneScreen("type")}
                          className={`w-full bg-primary text-primary-foreground rounded-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 mt-1 hover:bg-primary/90 transition-colors ${ctaBlink ? "animate-[pulse_0.4s_ease-in-out_infinite]" : ""}`}
                        >
                          Lancer l'analyse solaire <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <p className="text-[9px] text-muted-foreground">
                          Gratuit • Sans engagement • Résultat instantané
                        </p>
                      </motion.div>
                    ) : phoneScreen === "type" ? (
                      <motion.div
                        key="type"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 py-8 flex flex-col items-center text-center gap-6"
                      >
                        <h3 className="text-sm font-bold">Vous êtes…</h3>
                        <div className="w-full grid grid-cols-2 gap-3">
                          {[
                            { icon: Home, label: "Maison" },
                            { icon: Building2, label: "Appartement" },
                            { icon: Store, label: "Entreprise" },
                            { icon: Warehouse, label: "Ferme" },
                          ].map(({ icon: Icon, label }) => (
                            <button
                              key={label}
                              onClick={() => { setSelectedType(label); setPhoneScreen("form"); }}
                              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all active:scale-[0.97] ${
                                entrepriseBlink && label === "Entreprise"
                                  ? "border-primary bg-primary/10 animate-[pulse_0.5s_ease-in-out_infinite]"
                                  : "border-border bg-card hover:border-primary hover:bg-primary/5"
                              }`}
                            >
                              <Icon className={`w-6 h-6 ${entrepriseBlink && label === "Entreprise" ? "text-primary" : "text-muted-foreground"}`} />
                              <span className="text-xs font-semibold">{label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : phoneScreen === "form" ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col flex-1 overflow-hidden"
                      >
                      <div className="px-4 py-2.5 flex flex-col gap-2 overflow-y-auto flex-1">
                        {/* Stepper */}
                        <div className="flex items-center justify-between px-1">
                          {(selectedType === "Entreprise" ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"] : ["Profil", "Site", "Analyse", "Solutions", "Contact"]).map((step, i) => {
                            const isActive = i === 0;
                            return (
                              <div key={step} className="flex flex-col items-center gap-0.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                  {i + 1}
                                </div>
                                <span className={`text-[7px] ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Form title */}
                        <div className="flex items-center gap-1">
                          <ChevronLeft className="w-3 h-3 text-foreground" />
                          <h4 className="text-[11px] font-bold">Votre profil énergie</h4>
                        </div>

                        {/* Objectif principal */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Objectif principal</label>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setObjectif("facture")}
                              className={`flex-1 flex items-center gap-1 px-2 py-2 rounded-full text-[10px] font-medium border transition-colors ${objectif === "facture" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <TrendingDown className="w-2.5 h-2.5 shrink-0" /> Réduire la facture
                            </button>
                            <button
                              onClick={() => setObjectif("autonomie")}
                              className={`flex-1 flex items-center gap-1 px-2 py-2 rounded-full text-[10px] font-medium border transition-colors ${objectif === "autonomie" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <Battery className="w-2.5 h-2.5 shrink-0" /> Autonomie totale
                            </button>
                          </div>
                        </div>

                        {/* Type de bâtiment */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Type de bâtiment</label>
                          <div className="flex gap-1.5">
                            {(["Industriel", "Tertiaire"] as const).map(opt => (
                              <button
                                key={opt}
                                onClick={() => setTypeBatiment(opt)}
                                className={`flex-1 py-2 rounded-full text-[10px] font-medium border transition-colors ${typeBatiment === opt ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Secteur d'activité */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Secteur d'activité</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-border rounded-xl bg-background">
                            <select
                              className="text-[9px] bg-background outline-none w-full text-foreground appearance-none cursor-pointer"
                              defaultValue=""
                            >
                              <option value="" disabled>Choisir un secteur...</option>
                              {["Agroalimentaire", "BTP & Construction", "Chimie & Pharma", "Commerce & Distribution", "Éducation", "Énergie", "Finance & Banque", "Hôtellerie & Tourisme", "Industrie Textile", "Logistique & Transport", "Métallurgie & Sidérurgie", "Plasturgie", "Santé & Médical", "Services & Conseil", "Télécommunications"].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                          </div>
                        </div>

                        {/* Consommation */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Consommation annuelle (kWh)</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-border rounded-xl">
                            <Zap className="w-3 h-3 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={conso}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                                setConso(raw ? Number(raw).toLocaleString("fr-FR") : "");
                              }}
                              placeholder="Ex : 480 000"
                              className="text-[9px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Facture annuelle */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Facture annuelle (MAD)</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-border rounded-xl">
                            <FileText className="w-3 h-3 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={facture}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                                setFacture(raw ? Number(raw).toLocaleString("fr-FR") : "");
                              }}
                              placeholder="Ex : 180 000"
                              className="text-[9px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Puissance souscrite */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Puissance souscrite (kVA)</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-border rounded-xl">
                            <Zap className="w-3 h-3 text-muted-foreground shrink-0" />
                            <input
                              type="number"
                              value={puissanceSouscrite}
                              onChange={e => setPuissanceSouscrite(e.target.value)}
                              placeholder="Ex : 160"
                              className="text-[9px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Type d'abonnement */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-semibold text-foreground">Type d'abonnement</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 border border-border rounded-xl bg-background">
                            <select
                              value={typeAbonnement ?? ""}
                              onChange={e => setTypeAbonnement(e.target.value as "Basse Tension" | "Moyenne Tension" | "Haute Tension")}
                              className="text-[9px] bg-background outline-none w-full text-foreground appearance-none cursor-pointer"
                            >
                              <option value="" disabled>Choisir...</option>
                              <option value="Basse Tension">Basse Tension (≤ 1 kV)</option>
                              <option value="Moyenne Tension">Moyenne Tension (1–50 kV)</option>
                              <option value="Haute Tension">Haute Tension (&gt; 50 kV)</option>
                            </select>
                            <ChevronDown className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                          </div>
                        </div>

                        </div>
                        {/* CTA — épinglé en bas, hors scroll */}
                        <div className="px-4 pb-2.5 pt-2 shrink-0">
                          <button
                            onClick={() => { const valid = typeBatiment && conso.trim() && facture.trim() && puissanceSouscrite.trim() && typeAbonnement; if (valid) setPhoneScreen(selectedType === "Entreprise" ? "informations" : "site"); }}
                            disabled={!(typeBatiment && conso.trim() && facture.trim() && puissanceSouscrite.trim() && typeAbonnement)}
                            className={`w-full rounded-full text-[10px] h-[36px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${typeBatiment && conso.trim() && facture.trim() && puissanceSouscrite.trim() && typeAbonnement ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                          >
                            Continuer <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ) : phoneScreen === "informations" ? (
                      <motion.div
                        key="informations"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col flex-1 overflow-hidden"
                      >
                      <div className="px-4 py-2 flex flex-col gap-2 overflow-y-auto flex-1">
                        {/* Stepper */}
                        <div className="flex items-center justify-between px-1">
                          {["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"].map((step, i) => {
                            const isDone = i === 0;
                            const isActive = i === 1;
                            return (
                              <div key={step} className="flex flex-col items-center gap-0.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                  {isDone ? "✓" : i + 1}
                                </div>
                                <span className={`text-[8px] ${isActive ? "font-semibold text-foreground" : isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Title */}
                        <div className="flex items-center gap-1">
                          <ChevronLeft className="w-3 h-3 text-foreground" />
                          <h4 className="text-[11px] font-bold">Informations</h4>
                        </div>

                        {/* Description du projet */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-foreground">Information sur le projet</label>
                          <div className="relative">
                            <textarea
                              value={descriptionProjet}
                              onChange={(e) => setDescriptionProjet(e.target.value)}
                              rows={7}
                              className="w-full text-[9px] bg-transparent outline-none border border-border rounded-xl px-2.5 py-1.5 text-foreground resize-none relative z-10"
                            />
                            {!descriptionProjet && (
                              <span
                                className="absolute top-1.5 left-2.5 right-2.5 text-[9px] text-muted-foreground pointer-events-none leading-relaxed z-0"
                                style={{ opacity: projetPlaceholderVisible ? 1 : 0, transition: "opacity 0.4s ease" }}
                              >
                                {projetSuggestions[projetPlaceholderIndex]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Adresse */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-foreground">Adresse complète du projet</label>
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-xl">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              value={adresseProjet}
                              onChange={(e) => setAdresseProjet(e.target.value)}
                              placeholder="N°, Rue, Ville..."
                              className="text-[9px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Accès Panneaux */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-foreground">Accès Panneaux</label>
                          <div className="flex gap-1.5">
                            {([
                              { value: "sol", label: "Sol" },
                              { value: "toit", label: "Toit" },
                            ] as const).map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setPanelAccess(prev => prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value])}
                                className={`flex-1 py-1.5 rounded-full text-[9px] font-medium border transition-colors ${panelAccess.includes(opt.value) ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Surface disponible */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-semibold text-foreground">Surface disponible (m²)</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { m2: "22 m²", pan: "8 pan.", label: "M1" },
                              { m2: "44 m²", pan: "16 pan.", label: "M2" },
                              { m2: "66 m²", pan: "24 pan.", label: "M3/T1" },
                              { m2: "132 m²", pan: "48 pan.", label: "T2" },
                              { m2: "198 m²", pan: "72 pan.", label: "T3" },
                              { m2: "264 m²", pan: "96 pan.", label: "T4" },
                              { m2: "330 m²", pan: "120 pan.", label: "T5" },
                              { m2: "396 m²", pan: "144 pan.", label: "T5+" },
                            ].map((s) => (
                              <button
                                key={s.label}
                                onClick={() => setSelectedSurface(s.label)}
                                className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-colors ${selectedSurface === s.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                              >
                                <span className="text-[9px] font-bold text-foreground">{s.m2}</span>
                                <span className="text-[7px] text-muted-foreground">{s.pan}</span>
                                <span className="text-[7px] font-medium text-primary">{s.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dates */}
                        {(() => {
                          const dateError = dateDebut && dateFin && dateFin < dateDebut;
                          return (
                            <>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-foreground">Date de début</label>
                                  <input
                                    type="date"
                                    value={dateDebut}
                                    onChange={(e) => setDateDebut(e.target.value)}
                                    className="w-full text-[9px] bg-transparent outline-none border border-border rounded-xl px-2 py-1.5 text-foreground"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className={`text-[9px] font-semibold ${dateError ? "text-destructive" : "text-foreground"}`}>Date de fin</label>
                                  <input
                                    type="date"
                                    value={dateFin}
                                    min={dateDebut || undefined}
                                    onChange={(e) => setDateFin(e.target.value)}
                                    className={`w-full text-[9px] bg-transparent outline-none border rounded-xl px-2 py-1.5 text-foreground ${dateError ? "border-destructive" : "border-border"}`}
                                  />
                                </div>
                              </div>
                              {dateError && (
                                <p className="text-[8px] text-destructive -mt-1">La date de fin doit être après la date de début.</p>
                              )}
                            </>
                          );
                        })()}
                        </div>
                        {/* CTA — épinglé en bas, hors scroll */}
                        <div className="px-4 pb-2.5 pt-2 shrink-0">
                          <button
                            onClick={() => setPhoneScreen("site")}
                            className="w-full rounded-full text-[10px] h-[36px] font-semibold flex items-center justify-center gap-1.5 transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Continuer <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ) : phoneScreen === "site" ? (
                      /* Site screen */
                      <motion.div
                        key="site"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3 overflow-y-auto flex-1"
                      >
                        {/* Stepper - Site active */}
                        <div className="flex items-center justify-between px-1">
                          {(selectedType === "Entreprise" ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"] : ["Profil", "Site", "Analyse", "Solutions", "Contact"]).map((step, i) => {
                            const isDone = selectedType === "Entreprise" ? i <= 1 : i === 0;
                            const isActive = selectedType === "Entreprise" ? i === 2 : i === 1;
                            return (
                              <div key={step} className="flex flex-col items-center gap-0.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                  {isDone ? "✓" : i + 1}
                                </div>
                                <span className={`text-[8px] ${isActive ? "font-semibold text-foreground" : isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Title */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                          <h4 className="text-sm font-bold">Votre site</h4>
                        </div>

                        {/* Usages spécifiques */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Usages spécifiques</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(selectedType === "Maison" ? [
                              { icon: "❄️", label: "Climatisation" },
                              { icon: "🔥", label: "Chauffage" },
                              { icon: "🚿", label: "Chauffe-eau" },
                              { icon: "🚗", label: "Véhicule élec." },
                              { icon: "🏊", label: "Piscine" },
                              { icon: "🍳", label: "Cuisine élec." },
                              { icon: "🧺", label: "Lave-linge" },
                              { icon: "💻", label: "Informatique" },
                              { icon: "🧊", label: "Frigo/Congél." },
                            ] : selectedType === "Appartement" ? [
                              { icon: "❄️", label: "Climatisation" },
                              { icon: "🔥", label: "Chauffage" },
                              { icon: "🚿", label: "Chauffe-eau" },
                              { icon: "🚗", label: "Véhicule élec." },
                              { icon: "🍳", label: "Cuisine élec." },
                              { icon: "🧺", label: "Lave-linge" },
                              { icon: "💻", label: "Informatique" },
                              { icon: "🧊", label: "Frigo/Congél." },
                            ] : selectedType === "Entreprise" ? [
                              { icon: "❄️", label: "Climatisation" },
                              { icon: "🔥", label: "Chauffage" },
                              { icon: "🚿", label: "Chauffe-eau" },
                              { icon: "🚗", label: "Véhicule élec." },
                              { icon: "🍳", label: "Cuisine élec." },
                              { icon: "💻", label: "Informatique" },
                              { icon: "🧊", label: "Frigo/Congél." },
                              { icon: "❄️", label: "Chambre froide" },
                              { icon: "💨", label: "Compresseur air" },
                              { icon: "💡", label: "Éclairage indus." },
                              { icon: "⚙️", label: "Machines-outils" },
                            ] : [
                              { icon: "❄️", label: "Climatisation" },
                              { icon: "🔥", label: "Chauffage" },
                              { icon: "🚿", label: "Chauffe-eau" },
                              { icon: "🚗", label: "Véhicule élec." },
                              { icon: "🏊", label: "Piscine" },
                              { icon: "🍳", label: "Cuisine élec." },
                              { icon: "🧺", label: "Lave-linge" },
                              { icon: "💻", label: "Informatique" },
                              { icon: "🧊", label: "Frigo/Congél." },
                              { icon: "❄️", label: "Chambre froide" },
                              { icon: "💨", label: "Compresseur air" },
                              { icon: "💡", label: "Éclairage indus." },
                              { icon: "⚙️", label: "Machines-outils" },
                            ]).map((u) => {
                              const isSelected = selectedUsages.includes(u.label);
                              return (
                                <button
                                  key={u.label}
                                  onClick={() => setSelectedUsages(prev => isSelected ? prev.filter(x => x !== u.label) : [...prev, u.label])}
                                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                                >
                                  <span className="text-xs">{u.icon}</span>
                                  <span className={`text-[7px] leading-tight text-center ${isSelected ? "text-primary font-medium" : "text-muted-foreground"}`}>{u.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Oui/Non fields — Entreprise only */}
                        {selectedType === "Entreprise" && (
                          <div className="space-y-2">
                            {([
                              { label: "Installation PV existante", value: pvExistante, set: setPvExistante },
                              { label: "Extension d'une installation ?", value: extensionInstall, set: setExtensionInstall },
                              { label: "Subvention déjà reçue ?", value: subventionRecue, set: setSubventionRecue },
                            ] as { label: string; value: "Oui" | "Non" | null; set: (v: "Oui" | "Non") => void }[]).map(({ label, value, set }) => (
                              <div key={label} className="space-y-1">
                                <label className="text-[9px] font-semibold text-foreground">{label}</label>
                                <div className="flex gap-2">
                                  {(["Oui", "Non"] as const).map(opt => (
                                    <button
                                      key={opt}
                                      onClick={() => set(opt)}
                                      className={`flex-1 py-1.5 rounded-full text-[10px] font-medium border transition-colors ${value === opt ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CTA Analyser */}
                        {(() => {
                          const siteValid = panelAccess.length > 0 && selectedSurface && selectedUsages.length > 0 &&
                            (selectedType !== "Entreprise" || (pvExistante !== null && extensionInstall !== null && subventionRecue !== null));
                          return (
                            <button
                              onClick={() => {
                                if (!siteValid) return;
                                if (selectedType === "Entreprise") {
                                  setPhoneScreen("eligibilite");
                                } else {
                                  setPhoneScreen("analyse");
                                  setTimeout(() => setPhoneScreen("solutions"), 10000);
                                }
                              }}
                              disabled={!siteValid}
                              className={`w-full rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 transition-colors ${siteValid ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                            >
                              {selectedType === "Entreprise" ? "Continuer" : "Analyser"} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          );
                        })()}
                      </motion.div>
                    ) : phoneScreen === "eligibilite" ? (
                      <EligibiliteScreen
                        key="eligibilite"
                        onContinue={() => {
                          setPhoneScreen("analyse");
                          setTimeout(() => setPhoneScreen("solutions"), 10000);
                        }}
                      />
                    ) : phoneScreen === "analyse" ? (
                      /* Analyse screen */
                      <motion.div
                        key="analyse"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {/* Analyse animation - NOORIA logo clignotant centré */}
                        <motion.img
                          src={nooriaLogo}
                          alt="NOORIA"
                          animate={{ opacity: [1, 0.1, 1] }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                          className="w-44 object-contain select-none"
                        />
                      </motion.div>
                    ) : phoneScreen === "solutions" ? (
                       /* Solutions screen */
                      <motion.div
                        key="solutions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3 flex-1 overflow-y-auto"
                      >
                        {/* Stepper - Solutions active */}
                        <div className="flex items-center justify-between px-1">
                          {(selectedType === "Entreprise" ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"] : ["Profil", "Site", "Analyse", "Solutions", "Contact"]).map((step, i) => {
                            const isDone = selectedType === "Entreprise" ? i <= 4 : i <= 2;
                            const isActive = selectedType === "Entreprise" ? i === 5 : i === 3;
                            return (
                              <div key={step} className="flex flex-col items-center gap-0.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                  {isDone ? "✓" : i + 1}
                                </div>
                                <span className={`text-[8px] ${isActive || isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Sun className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-bold">Solutions recommandées</h4>
                        </div>

                        <p className="text-[9px] text-muted-foreground -mt-1">
                          Basé sur votre consommation et votre {selectedType?.toLowerCase() || "logement"}
                        </p>

                        {/* Results placeholder */}
                        <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sun className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-foreground">Analyse terminée !</p>
                            <p className="text-[9px] text-muted-foreground mt-1 leading-relaxed">
                              Vos solutions personnalisées ont été préparées.<br />
                              Nos experts vous contactent sous 24h.
                            </p>
                          </div>
                          <div className="w-full space-y-2 mt-1">
                            {["Solution optimale identifiée", "Installateurs certifiés sélectionnés", "Aides d'état applicables détectées"].map((item) => (
                              <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                                  <span className="text-[8px] text-primary-foreground font-bold">✓</span>
                                </div>
                                <span className="text-[9px] text-foreground font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button onClick={() => setQuoteOpen(true)} className="w-full bg-primary text-primary-foreground rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
                          Demander un devis <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : phoneScreen === "merci" ? (
                      <motion.div
                        key="merci"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 flex flex-col items-center justify-start px-5 pt-8 text-center gap-4 overflow-y-auto"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                          className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0"
                        >
                          <span className="text-2xl">✅</span>
                        </motion.div>
                        <div className="space-y-2">
                          <h3 className="text-[14px] font-black text-foreground">Demande reçue ✅</h3>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            Prochaine étape :<br />
                            vérification technique et<br />
                            estimation préliminaire.<br />
                            Un expert NOORIA vous contacte<br />
                            sous <span className="font-semibold text-foreground">24h</span> (WhatsApp ou appel).
                          </p>
                          {quoteRef && (
                            <div className="inline-flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5 mt-1">
                              <span className="text-[9px] text-muted-foreground font-medium">Référence :</span>
                              <span className="text-[9px] font-bold text-foreground font-mono">#{quoteRef.slice(0, 8).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className="w-full space-y-2 mt-1">
                          <input
                            ref={invoiceInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !quoteRef) return;
                              setInvoiceUploading(true);
                              try {
                                const ext = file.name.split(".").pop();
                                const filePath = `${quoteRef}.${ext}`;
                                const { error: uploadError } = await supabase.storage
                                  .from("client-invoices")
                                  .upload(filePath, file, { upsert: true });
                                if (uploadError) throw uploadError;

                                // Confirm upload to user immediately
                                setInvoiceUploaded(true);

                                // Try to send email notification (best-effort)
                                supabase.functions.invoke("send-invoice-email", {
                                  body: {
                                    filePath,
                                    fileName: file.name,
                                    quoteRef: quoteRef.slice(0, 8).toUpperCase(),
                                    clientName: contactNom,
                                    clientEmail: contactEmail,
                                  },
                                }).catch(() => {/* silent — file is already uploaded */});

                              } catch (err: any) {
                                toast({ title: "Erreur lors de l'envoi", description: "Veuillez réessayer.", variant: "destructive" });
                              } finally {
                                setInvoiceUploading(false);
                                e.target.value = "";
                              }
                            }}
                          />
                          {invoiceUploaded ? (
                            <div className="w-full rounded-2xl bg-green-50 border border-green-200 px-3 py-3 flex flex-col items-center gap-1 text-center">
                              <span className="text-xl">✅</span>
                              <p className="text-[10px] font-bold text-green-700">Facture envoyée avec succès !</p>
                              <p className="text-[9px] text-green-600/80 leading-relaxed">Nous avons bien reçu votre document.<br />Notre équipe l'analyse avant de vous rappeler.</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => !invoiceUploading && invoiceInputRef.current?.click()}
                              disabled={invoiceUploading}
                              className="w-full rounded-full py-2.5 text-[10px] font-semibold flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {invoiceUploading ? (
                                <>
                                  <svg className="animate-spin w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                  </svg>
                                  Envoi en cours…
                                </>
                              ) : (
                                <><span className="text-[13px] font-bold leading-none">+</span> Téléverser une facture</>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => { setPhoneScreen("intro"); setQuoteRef(null); setInvoiceUploaded(false); }}
                            className="w-full border border-border rounded-full py-2.5 text-[10px] font-semibold text-foreground hover:bg-muted transition-colors"
                          >
                            Retour à l'accueil
                          </button>
                        </div>
                      </motion.div>
                    ) : null}

                  </AnimatePresence>
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center py-2">
                    <div className="w-24 h-1 bg-foreground/15 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Pourquoi NOORIA ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Le comparateur solaire pensé pour simplifier votre transition énergétique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="ride-card text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl lg:text-5xl font-bold">
                Prêt à passer au solaire ?
              </h2>
              <p className="text-xl text-background/70 max-w-lg">
                Rejoignez des milliers de Français qui ont réduit leur facture
                d'énergie grâce à NOORIA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base">
                  <Link to="/diagnostic">
                    <Sun className="w-5 h-5 mr-2" />
                    Diagnostic gratuit
                  </Link>
                </Button>
                <Button
                  size="lg"
                  onClick={() => setCallbackOpen(true)}
                  className="bg-transparent border border-background/60 text-background hover:bg-background/15 hover:text-background h-14 px-8 text-base"
                >
                  En savoir plus
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-6 bg-background/5 rounded-2xl">
                <Leaf className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-background/70">Diagnostics réalisés</div>
              </div>
              <div className="p-6 bg-background/5 rounded-2xl">
                <Sun className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">30+</div>
                <div className="text-background/70">Installateurs certifiés</div>
              </div>
              <div className="p-6 bg-background/5 rounded-2xl">
                <PiggyBank className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">30%</div>
                <div className="text-background/70">Économies moyennes</div>
              </div>
              <div className="p-6 bg-background/5 rounded-2xl">
                <Star className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-background/70">Note moyenne</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <CallbackModal open={callbackOpen} onOpenChange={setCallbackOpen} />
      <QuotePanel open={quoteOpen} onOpenChange={setQuoteOpen} onSuccess={(id) => { setQuoteRef(id); setPhoneScreen("merci"); }} />
    </div>
  );
};

export default Index;
