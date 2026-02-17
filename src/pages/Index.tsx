import { useState } from "react";
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

const Index = () => {
  const [phoneScreen, setPhoneScreen] = useState<"intro" | "form">("intro");
  const [objectif, setObjectif] = useState<"facture" | "autonomie" | null>(null);
  const [tension, setTension] = useState<"220" | "380" | null>(null);


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
                <span className="text-sm font-medium">500+ installateurs certifiés au Maroc</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Le solaire,{" "}
                <span className="text-gradient">simplifié</span>
              </h1>

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
                <div className="w-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-24 h-4 bg-muted rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {phoneScreen === "form" && (
                        <button onClick={() => setPhoneScreen("intro")} className="p-0.5">
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                      )}
                      <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                        <Sun className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-bold">NOOR<span className="text-primary">IA</span></span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">SunStone Finance</span>
                  </div>

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
                          onClick={() => setPhoneScreen("form")}
                          className="w-full bg-primary text-primary-foreground rounded-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 mt-1 hover:bg-primary/90 transition-colors"
                        >
                          Lancer l'analyse solaire <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <p className="text-[9px] text-muted-foreground">
                          Gratuit • Sans engagement • Résultat instantané
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 py-3 flex flex-col gap-3"
                      >
                        {/* Stepper */}
                        <div className="flex items-center justify-between px-1">
                          {["Profil", "Site", "Analyse", "Solutions", "Contact"].map((step, i) => (
                            <div key={step} className="flex flex-col items-center gap-0.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                                {i + 1}
                              </div>
                              <span className={`text-[8px] ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
                            </div>
                          ))}
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
                            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Ex: 480</span>
                          </div>
                        </div>

                        {/* Facture + Ville */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-foreground">Facture (MAD)</label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl">
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">Ex: 800</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-foreground">Ville</label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl">
                              <MapPinned className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-[10px] text-foreground">Casablanca</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          asChild
                          size="sm"
                          className="w-full rounded-full mt-1 text-[11px] h-10"
                        >
                          <Link to="/diagnostic">
                            Continuer <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
