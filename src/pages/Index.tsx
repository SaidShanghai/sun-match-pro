import { useState, useRef, useEffect } from "react";
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

const HeroRotatingTitle = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
      <span className="block h-[1.2em] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={heroWords[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0"
          >
            {heroWords[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-gradient">simplifié</span>
    </h1>
  );
};

const Index = () => {
  const [phoneScreen, setPhoneScreen] = useState<"intro" | "type" | "form" | "site" | "analyse">("intro");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [objectif, setObjectif] = useState<"facture" | "autonomie" | null>(null);
  const [tension, setTension] = useState<"220" | "380" | null>(null);
  const [conso, setConso] = useState("");
  const [facture, setFacture] = useState("");
  const [ville, setVille] = useState("Casablanca");
  const [villeOpen, setVilleOpen] = useState(false);
  const [villeSearch, setVilleSearch] = useState("");
  const [roofAccess, setRoofAccess] = useState<"oui" | "non" | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<string | null>(null);
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);
  const [analyseProgress, setAnalyseProgress] = useState(0);
  const [analyseLabel, setAnalyseLabel] = useState("");
  const villeRef = useRef<HTMLDivElement>(null);

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
                <span className="text-sm font-medium">100+ installateurs certifiés au Maroc</span>
              </div>

              <HeroRotatingTitle />

              <p className="text-xl text-muted-foreground max-w-lg">
                NOORIA connecte particuliers et installateurs certifiés.
                Diagnostic gratuit, devis personnalisés, installation garantie.
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
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Installateurs</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="text-3xl font-bold">4.9</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
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
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {phoneScreen !== "intro" && (
                        <button onClick={() => setPhoneScreen(phoneScreen === "analyse" ? "site" : phoneScreen === "site" ? "form" : phoneScreen === "form" ? "type" : "intro")} className="p-0.5">
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                      )}
                      <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                        <Sun className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-bold">NOOR<span style={{ color: "hsl(24 95% 53%)" }}>IA</span></span>
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
                            <span className="text-[10px] leading-snug">Catalogue complet 220V & 380V adapté au Maroc</span>
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
                          className="w-full bg-primary text-primary-foreground rounded-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 mt-1 hover:bg-primary/90 transition-colors"
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
                              className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.97]"
                            >
                              <Icon className="w-6 h-6 text-muted-foreground" />
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
                          {["Profil", "Site", "Analyse", "Solutions", "Contact"].map((step, i) => {
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
                          onClick={() => setPhoneScreen("site")}
                          className="w-full bg-primary text-primary-foreground rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                        >
                          Continuer <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
                          {["Profil", "Site", "Analyse", "Solutions", "Contact"].map((step, i) => {
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
                          <h4 className="text-sm font-bold">Votre site</h4>
                        </div>

                        {/* Accès au toit */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-foreground">Accès au toit</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setRoofAccess("oui")}
                              className={`flex-1 py-2 rounded-full text-[10px] font-medium border transition-colors ${roofAccess === "oui" ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              Oui
                            </button>
                            <button
                              onClick={() => setRoofAccess("non")}
                              className={`flex-1 py-2 rounded-full text-[10px] font-medium border transition-colors ${roofAccess === "non" ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
                            >
                              Non
                            </button>
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
                            const interval = setInterval(() => {
                              p += Math.random() * 15 + 5;
                              if (p >= 100) { p = 100; clearInterval(interval); }
                              setAnalyseProgress(Math.round(p));
                              setAnalyseLabel(labels[Math.min(Math.floor(p / 18), labels.length - 1)]);
                            }, 600);
                          }}
                          className="w-full bg-primary text-primary-foreground rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                        >
                          Analyser <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : (
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
                          {["Profil", "Site", "Analyse", "Solutions", "Contact"].map((step, i) => {
                            const isDone = i <= 1;
                            const isActive = i === 2;
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

                        {/* Analyse animation - sun random movement full screen */}
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

      {/* Sun Installer Finder */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Sun Installer Finder</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trouvez la solution solaire idéale pour votre projet en quelques clics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="w-full max-w-[380px] rounded-[2.5rem] border-2 border-border bg-background shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-28 h-5 bg-muted rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                    <Sun className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold">SUN_GPT</span>
                </div>
                <span className="text-[11px] text-muted-foreground">SunStone Finance</span>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-8 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <Sun className="w-9 h-9 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">SUN_GPT</h3>
                  <p className="text-sm text-muted-foreground">par SunStone Finance</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analysez votre consommation, découvrez<br />la solution solaire optimale
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-background border border-border/80 rounded-2xl text-left shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm leading-snug">Dimensionnement intelligent basé sur votre consommation</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background border border-border/80 rounded-2xl text-left shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm leading-snug">Catalogue complet 220V & 380V adapté au Maroc</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background border border-border/80 rounded-2xl text-left shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Sun className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm leading-snug">Devis personnalisé en quelques minutes</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full h-14 text-base rounded-full mt-2 shadow-lg"
                >
                  <Link to="/diagnostic">
                    Lancer l'analyse solaire <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground">
                  Gratuit • Sans engagement • Résultat instantané
                </p>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center py-3">
                <div className="w-28 h-1 bg-foreground/15 rounded-full" />
              </div>
            </div>
          </motion.div>
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
                <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 h-14 px-8 text-base">
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
                <div className="text-3xl font-bold">500+</div>
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
