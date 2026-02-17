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
  CheckCircle,
  Loader,
  Check,
  TrendingUp,
  Users,
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

const regions = ["Île-de-France", "PACA", "Occitanie", "Nouvelle-Aquitaine", "Auvergne-Rhône-Alpes", "Bretagne"];

const Index = () => {
  const [phoneScreen, setPhoneScreen] = useState<"home" | "analyzing" | "result" | "match">("home");
  const phoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerPhoneAnimation = () => {
    if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
    setPhoneScreen("analyzing");
    phoneTimeoutRef.current = setTimeout(() => {
      setPhoneScreen("result");
      phoneTimeoutRef.current = setTimeout(() => {
        setPhoneScreen("match");
        phoneTimeoutRef.current = setTimeout(() => {
          setPhoneScreen("home");
        }, 3000);
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
    };
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
                <span className="text-sm font-medium">500+ installateurs certifiés en France</span>
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
                  size="lg"
                  className="group h-14 px-8 text-base cursor-pointer"
                  onClick={triggerPhoneAnimation}
                >
                  Lancer mon diagnostic
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <div className="relative mx-auto w-[300px] h-[600px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {phoneScreen === "home" && (
                      <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 space-y-6 absolute inset-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Bonjour 👋</div>
                            <div className="text-lg font-semibold">Mon diagnostic solaire</div>
                          </div>
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Sun className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-muted-foreground text-sm">Entrez votre adresse...</span>
                        </div>
                        <div className="h-32 bg-muted rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <Sun className="w-10 h-10 text-primary mx-auto mb-2" />
                            <span className="text-sm text-muted-foreground">Potentiel solaire</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Type de logement</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-center text-sm font-medium">🏠 Maison</div>
                            <div className="p-3 bg-muted rounded-xl text-center text-sm text-muted-foreground">🏢 Appartement</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {phoneScreen === "analyzing" && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 space-y-6 absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="w-12 h-12 text-primary" />
                        </motion.div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">Analyse en cours...</div>
                          <div className="text-sm text-muted-foreground mt-1">Calcul de votre potentiel solaire</div>
                        </div>
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">Ensoleillement: 1450h/an</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">Surface toiture: 45m²</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {phoneScreen === "result" && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 space-y-5 absolute inset-0"
                      >
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3"
                          >
                            <Check className="w-8 h-8 text-primary-foreground" />
                          </motion.div>
                          <div className="text-lg font-semibold">Excellent potentiel !</div>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-center">
                          <div className="text-sm text-muted-foreground">Économies estimées</div>
                          <div className="text-3xl font-bold text-primary">1 250 €/an</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                            <Sun className="w-4 h-4 text-primary" />
                            <span className="text-xs">Puissance recommandée: 6 kWc</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-xs">Rentabilité: 8 ans</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {phoneScreen === "match" && (
                      <motion.div
                        key="match"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 space-y-5 absolute inset-0"
                      >
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Installateurs disponibles</div>
                          <motion.div
                            className="text-5xl font-bold text-primary mt-1"
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            3
                          </motion.div>
                        </div>
                        {["SolarTech Pro", "GreenEnergy 31", "EcoSolaire"].map((name, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{name}</div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 text-warning fill-warning" />
                                {(4.7 + i * 0.1).toFixed(1)} • Certifié RGE
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

      {/* Regions */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Partout en France</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des installateurs certifiés dans toutes les régions.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {regions.map((region, index) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-card border border-border rounded-full text-lg font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {region}
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
