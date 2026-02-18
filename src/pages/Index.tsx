import { useState, useRef, useEffect } from "react";
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
  const [phoneScreen, setPhoneScreen] = useState<"intro" | "type" | "form" | "informations" | "site" | "eligibilite" | "analyse" | "solutions">("intro");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [objectif, setObjectif] = useState<"facture" | "autonomie" | null>(null);
  const [tension, setTension] = useState<"220" | "380" | null>(null);
  const [conso, setConso] = useState("");
  const [facture, setFacture] = useState("");
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
              <div className="relative mx-auto w-[300px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col h-[580px]">
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-24 h-4 bg-muted rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-1 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {phoneScreen !== "intro" && (
                        <button onClick={() => setPhoneScreen(phoneScreen === "solutions" ? "analyse" : phoneScreen === "analyse" ? "eligibilite" : phoneScreen === "eligibilite" ? "site" : phoneScreen === "site" ? (selectedType === "Entreprise" ? "informations" : "form") : phoneScreen === "informations" ? "form" : phoneScreen === "form" ? "type" : "intro")} className="p-0.5">
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

                  <div className="flex-1 overflow-y-auto min-h-0">
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
                        className="px-4 py-3 flex flex-col gap-3 overflow-y-auto flex-1"
                      >
                        {/* Stepper */}
                        <div className="flex items-center justify-between px-1">
                          {(selectedType === "Entreprise" ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"] : ["Profil", "Site", "Analyse", "Solutions", "Contact"]).map((step, i) => {
                            const isActive = i === 0;
                            const isDone = false;
                            return (
                              <div key={step} className="flex flex-col items-center gap-0.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                  {i + 1}
                                </div>
                                <span className={`text-[8px] ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Form title */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                          <h4 className="text-sm font-bold">Votre profil énergie</h4>
                        </div>

                        {/* Objectif principal */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Objectif principal</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setObjectif("facture")}
                              className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-medium border transition-colors ${objectif === "facture" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <TrendingDown className="w-3 h-3" /> Réduire la facture
                            </button>
                            <button
                              onClick={() => setObjectif("autonomie")}
                              className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-medium border transition-colors ${objectif === "autonomie" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <Battery className="w-3 h-3" /> Autonomie totale
                            </button>
                          </div>
                        </div>

                        {/* Tension réseau */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Tension réseau</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setTension("220")}
                              className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-medium border transition-colors ${tension === "220" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <Zap className="w-3 h-3" /> 220V
                            </button>
                            <button
                              onClick={() => setTension("380")}
                              className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-medium border transition-colors ${tension === "380" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              <Zap className="w-3 h-3" /> 380V
                            </button>
                          </div>
                        </div>

                        {/* Consommation */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Consommation mensuelle (kWh/mois)</label>
                          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl">
                            <Zap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              value={conso}
                              onChange={(e) => setConso(e.target.value)}
                              placeholder="Ex: 480"
                              className="text-[10px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Facture + Ville */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-foreground">Facture (MAD)</label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl">
                              <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <input
                                type="text"
                                value={facture}
                                onChange={(e) => setFacture(e.target.value)}
                                placeholder="Ex: 800"
                                className="text-[10px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-foreground">Ville</label>
                            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl">
                              <MapPinned className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <select
                                value={ville}
                                onChange={(e) => setVille(e.target.value)}
                                className="text-[10px] bg-transparent outline-none w-full text-foreground appearance-none cursor-pointer"
                              >
                                {["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "El Jadida", "Nador", "Béni Mellal", "Mohammedia"].map((v) => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => conso.trim() && setPhoneScreen(selectedType === "Entreprise" ? "informations" : "site")}
                          disabled={!conso.trim()}
                          className={`w-full rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 transition-colors ${conso.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                        >
                          Continuer <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : phoneScreen === "informations" ? (
                      <motion.div
                        key="informations"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3 overflow-y-auto flex-1"
                      >
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
                        <div className="flex items-center gap-1.5 pt-1">
                          <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                          <h4 className="text-sm font-bold">Informations</h4>
                        </div>

                        {/* Type de bâtiment */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Type de bâtiment</label>
                          <div className="flex gap-2">
                            {(["Industriel", "Tertiaire"] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => setBatimentType(type)}
                                className={`flex-1 py-2 rounded-full text-[10px] font-medium border transition-colors ${batimentType === type ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary/50"}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Secteur d'activité */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Secteur d'activité</label>
                          <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <select
                              value={secteurActivite}
                              onChange={(e) => setSecteurActivite(e.target.value)}
                              className="text-[10px] bg-transparent outline-none w-full text-foreground appearance-none cursor-pointer"
                            >
                              <option value="">Choisir un secteur...</option>
                              {["Agroalimentaire", "BTP & Construction", "Chimie & Pharma", "Commerce & Distribution", "Éducation", "Énergie", "Finance & Banque", "Hôtellerie & Tourisme", "Industrie Textile", "Logistique & Transport", "Métallurgie & Sidérurgie", "Plasturgie", "Santé & Médical", "Services & Conseil", "Télécommunications"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                          </div>
                        </div>

                        {/* Description du projet */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Information sur le projet</label>
                          <div className="relative">
                            <textarea
                              value={descriptionProjet}
                              onChange={(e) => setDescriptionProjet(e.target.value)}
                              rows={2}
                              className="w-full text-[10px] bg-transparent outline-none border border-border rounded-xl px-3 py-2 text-foreground resize-none relative z-10"
                            />
                            {!descriptionProjet && (
                              <span
                                className="absolute top-2 left-3 right-3 text-[10px] text-muted-foreground pointer-events-none leading-relaxed transition-opacity duration-400 z-0"
                                style={{ opacity: projetPlaceholderVisible ? 1 : 0, transition: "opacity 0.4s ease" }}
                              >
                                {projetSuggestions[projetPlaceholderIndex]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Adresse */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Adresse complète du projet</label>
                          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              value={adresseProjet}
                              onChange={(e) => setAdresseProjet(e.target.value)}
                              placeholder="N°, Rue, Ville..."
                              className="text-[10px] bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>

                        {/* Dates */}
                        {(() => {
                          const dateError = dateDebut && dateFin && dateFin < dateDebut;
                          return (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-semibold text-foreground">Date de début</label>
                                  <input
                                    type="date"
                                    value={dateDebut}
                                    onChange={(e) => setDateDebut(e.target.value)}
                                    className="w-full text-[10px] bg-transparent outline-none border border-border rounded-xl px-2 py-2 text-foreground"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className={`text-[10px] font-semibold ${dateError ? "text-destructive" : "text-foreground"}`}>Date de fin</label>
                                  <input
                                    type="date"
                                    value={dateFin}
                                    min={dateDebut || undefined}
                                    onChange={(e) => setDateFin(e.target.value)}
                                    className={`w-full text-[10px] bg-transparent outline-none border rounded-xl px-2 py-2 text-foreground ${dateError ? "border-destructive" : "border-border"}`}
                                  />
                                </div>
                              </div>
                              {dateError && (
                                <p className="text-[9px] text-destructive -mt-1">La date de fin doit être après la date de début.</p>
                              )}

                              {/* CTA */}
                              <button
                                onClick={() => !dateError && setPhoneScreen("site")}
                                disabled={!!dateError}
                                className={`w-full rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 transition-colors ${dateError ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                              >
                                Continuer <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          );
                        })()}
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

                        {/* Accès Panneaux */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Accès Panneaux</label>
                          <div className="flex gap-2">
                            {([
                              { value: "toit", label: "Toit" },
                              { value: "sol", label: "Sol" },
                            ] as const).map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setPanelAccess(prev => prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value])}
                                className={`flex-1 py-2 rounded-full text-[10px] font-medium border transition-colors ${panelAccess.includes(opt.value) ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Surface disponible */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Surface disponible (m²)</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { m2: "22 m²", pan: "8 pan.", label: "M1" },
                              { m2: "44 m²", pan: "16 pan.", label: "M2" },
                              { m2: "66 m²", pan: "24 pan.", label: "M3 / T1" },
                              { m2: "132 m²", pan: "48 pan.", label: "T2" },
                              { m2: "198 m²", pan: "72 pan.", label: "T3" },
                              { m2: "264 m²", pan: "96 pan.", label: "T4" },
                              { m2: "330 m²", pan: "120 pan.", label: "T5" },
                              { m2: "396 m²", pan: "144 pan.", label: "T5+" },
                            ].map((s) => (
                              <button
                                key={s.label}
                                onClick={() => setSelectedSurface(s.label)}
                                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-colors ${selectedSurface === s.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                              >
                                <span className="text-[10px] font-bold text-foreground">{s.m2}</span>
                                <span className="text-[8px] text-muted-foreground">{s.pan}</span>
                                <span className="text-[8px] font-medium text-primary">{s.label}</span>
                              </button>
                            ))}
                          </div>
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

                        {/* CTA Analyser */}
                        {(() => {
                          const siteValid = panelAccess.length > 0 && selectedSurface && selectedUsages.length > 0;
                          return (
                            <button
                              onClick={() => {
                                if (!siteValid) return;
                                if (selectedType === "Entreprise") {
                                  setPhoneScreen("eligibilite");
                                } else {
                                  setPhoneScreen("analyse");
                                  setAnalyseProgress(0);
                                  const labels = [
                                    "Analyse de la consommation...",
                                    "Calcul de l'ensoleillement...",
                                    "Optimisation de la couverture...",
                                    "Dimensionnement des panneaux...",
                                    "Estimation des économies...",
                                    "Finalisation du rapport...",
                                  ];
                                  let p = 0;
                                  const startTime = Date.now();
                                  const totalDuration = 8000;
                                  const interval = setInterval(() => {
                                    const elapsed = Date.now() - startTime;
                                    p = Math.min((elapsed / totalDuration) * 100, 100);
                                    if (p >= 100) {
                                      clearInterval(interval);
                                      setTimeout(() => setPhoneScreen("solutions"), 600);
                                    }
                                    setAnalyseProgress(Math.round(p));
                                    setAnalyseLabel(labels[Math.min(Math.floor(p / 18), labels.length - 1)]);
                                  }, 50);
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
                      /* Eligibilité screen */
                      <motion.div
                        key="eligibilite"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3 overflow-y-auto flex-1"
                      >
                        {/* Stepper */}
                        <div className="flex items-center justify-between px-1">
                          {["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"].map((step, i) => {
                            const isDone = i <= 2;
                            const isActive = i === 3;
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

                        {/* Title */}
                        <div className="pt-1">
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Vous êtes à</p>
                          <div className="overflow-visible whitespace-nowrap">
                            <span className="font-black text-foreground" style={{ fontSize: "28px", lineHeight: 1.1 }}>deux clics</span>
                          </div>
                          <div className="overflow-visible whitespace-nowrap">
                            <span className="font-black text-foreground" style={{ fontSize: "18px", lineHeight: 1.2 }}>d'une aide d'état</span>
                          </div>
                        </div>

                        {/* Label */}
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground -mt-1">Mécanismes de financement couverts</p>

                        {/* 4 boxes */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: "SR500", desc: "Bonus carbone via Africa Climate Solutions", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
                            { name: "Tatwir", desc: "Maroc PME — Croissance Verte", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
                            { name: "GEFF", desc: "BERD via banques partenaires", bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-200 dark:border-sky-800" },
                            { name: "PPA", desc: "Tiers-investisseur, zéro CAPEX", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
                          ].map((item) => (
                            <div key={item.name} className={`rounded-xl border p-2.5 ${item.bg} ${item.border}`}>
                              <p className="text-[11px] font-bold text-foreground">{item.name}</p>
                              <p className="text-[8.5px] text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => {
                            setPhoneScreen("analyse");
                            setAnalyseProgress(0);
                            const labels = [
                              "Analyse de la consommation...",
                              "Calcul de l'ensoleillement...",
                              "Optimisation de la couverture...",
                              "Dimensionnement des panneaux...",
                              "Estimation des économies...",
                              "Finalisation du rapport...",
                            ];
                            let p = 0;
                            const startTime = Date.now();
                            const totalDuration = 8000;
                            const interval = setInterval(() => {
                              const elapsed = Date.now() - startTime;
                              p = Math.min((elapsed / totalDuration) * 100, 100);
                              if (p >= 100) {
                                clearInterval(interval);
                                setTimeout(() => setPhoneScreen("solutions"), 600);
                              }
                              setAnalyseProgress(Math.round(p));
                              setAnalyseLabel(labels[Math.min(Math.floor(p / 18), labels.length - 1)]);
                            }, 50);
                          }}
                          className="w-full rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Analyser mon projet <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : phoneScreen === "analyse" ? (
                      /* Analyse screen */
                      <motion.div
                        key="analyse"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3 flex-1"
                      >
                        {/* Stepper - Analyse active */}
                        <div className="flex items-center justify-between px-1">
                          {(selectedType === "Entreprise" ? ["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"] : ["Profil", "Site", "Analyse", "Solutions", "Contact"]).map((step, i) => {
                            const isDone = selectedType === "Entreprise" ? i <= 3 : i <= 1;
                            const isActive = selectedType === "Entreprise" ? i === 4 : i === 2;
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

                        {/* Analyse animation */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center relative">
                          <motion.div
                            animate={{
                              x: [-80, 80],
                              y: [-100, 100],
                            }}
                            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 z-0"
                          >
                            <div className="w-12 h-12 -ml-6 -mt-6 bg-primary/20 rounded-full flex items-center justify-center" style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}>
                              <Sun className="w-7 h-7 text-primary" />
                            </div>
                          </motion.div>
                          <div className="z-10 mt-auto w-full space-y-2">
                            <div>
                              <h4 className="text-sm font-bold">Analyse en cours…</h4>
                              <p className="text-[10px] text-muted-foreground mt-1">{analyseLabel}</p>
                            </div>
                            <div className="w-full space-y-1">
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  animate={{ width: `${analyseProgress}%` }}
                                  transition={{ duration: 0.4 }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-foreground">{analyseProgress}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
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

                        <button className="w-full bg-primary text-primary-foreground rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
                          Demander un devis <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
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
                <Button asChild size="lg" className="bg-transparent border border-background/60 text-background hover:bg-background/15 hover:text-background h-14 px-8 text-base">
                  <Link to="/diagnostic">
                    En savoir plus
                  </Link>
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
    </div>
  );
};

export default Index;
