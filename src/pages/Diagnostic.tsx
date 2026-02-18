
import { motion } from "framer-motion";
import { Sun, ClipboardCheck, BarChart3, Shield, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const features = [
  {
    icon: ClipboardCheck,
    title: "Analyse personnalisée",
    description: "On étudie votre toit, votre orientation, votre conso… Bref, tout ce qui compte pour un projet solaire réussi.",
  },
  {
    icon: Sun,
    title: "Potentiel solaire",
    description: "On calcule combien de kWh votre toiture peut produire chaque année. C'est souvent plus que ce qu'on imagine !",
  },
  {
    icon: BarChart3,
    title: "Économies estimées",
    description: "Combien vous économisez sur votre facture ? Quel retour sur investissement ? On vous dit tout, sans surprise.",
  },
  {
    icon: Shield,
    title: "Installateurs vérifiés",
    description: "Nos partenaires sont triés sur le volet : certifications, documents légaux, références… Zéro improvisation.",
  },
];

const Diagnostic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero — same layout as Index */}
      <section className="relative min-h-[90vh] flex items-center overflow-visible pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

        <div className="max-w-[1600px] w-full mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[7fr_3fr] gap-12 items-center overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 overflow-visible"
            >

              <h1 className="font-black leading-[1.1] overflow-visible whitespace-nowrap">
                <span className="block" style={{ fontSize: "60px", marginLeft: "2cm" }}>Vous êtes à</span>
                <span className="block text-gradient" style={{ fontSize: "112px" }}>3 minutes</span>
                <span className="block text-center" style={{ fontSize: "100px" }}>de grosses</span>
                <span className="block text-gradient" style={{ fontSize: "160px" }}>économies<span className="relative inline-block"> !
                  <svg className="absolute left-1/2 -translate-x-1/2 w-[202px] h-[202px] text-primary rotate-[20deg]" style={{ top: "-5cm" }} viewBox="0 0 110 125" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="55" cy="68" r="43" strokeWidth="3" />
                    <circle cx="55" cy="68" r="48" strokeWidth="1" opacity="0.15" />
                    <line x1="55" y1="25" x2="55" y2="12" strokeWidth="5" />
                    <line x1="47" y1="12" x2="63" y2="12" strokeWidth="3" />
                    <line x1="82" y1="35" x2="90" y2="27" strokeWidth="3" />
                    <line x1="90" y1="27" x2="94" y2="31" strokeWidth="3" />
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180);
                      return <line key={i} x1={55 + 37 * Math.cos(angle)} y1={68 + 37 * Math.sin(angle)} x2={55 + 41 * Math.cos(angle)} y2={68 + 41 * Math.sin(angle)} strokeWidth={i % 3 === 0 ? 3.5 : 1.5} />;
                    })}
                    <circle cx="55" cy="52" r="9" strokeWidth="1.5" />
                    <line x1="55" y1="52" x2="55" y2="45" strokeWidth="1" className="origin-[55px_52px] animate-spin" style={{ animationDuration: "3s" }} />
                    <circle cx="55" cy="84" r="9" strokeWidth="1.5" />
                    <line x1="55" y1="84" x2="55" y2="77" strokeWidth="1" className="origin-[55px_84px] animate-spin" style={{ animationDuration: "6s" }} />
                    <circle cx="55" cy="68" r="5" fill="currentColor" />
                    <line x1="55" y1="68" x2="55" y2="45" strokeWidth="2.5" opacity="0.4" />
                    <line x1="55" y1="68" x2="55" y2="32" strokeWidth="1.5" className="origin-[55px_68px] animate-spin" style={{ animationDuration: "4s" }} stroke="hsl(var(--primary))" />
                  </svg>
                </span></span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl text-right ml-auto">
                Particulier ou entreprise, nous vous accompagnons de A à Z : diagnostic sur mesure, dimensionnement, installation par des <strong>partenaires certifiés</strong>.
                <br />Pour les professionnels : montage des dossiers <strong>SR500</strong> et <strong>TATWIR</strong> – Croissance Verte, avec appui financement et conformité technique.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg" className="group h-14 px-8 text-base">
                  <Link to="/diagnostic">
                    Lancer mon diagnostic
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground font-medium">Gratuit • Sans engagement • Résultat instantané</span>
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

          </div>
        </div>
      </section>

      {/* Features — same card grid as Index */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un diagnostic complet en quelques étapes simples.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — same as Index */}
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
                Prêt à réduire votre facture ?
              </h2>
              <p className="text-xl text-background/70 max-w-lg">
                Rejoignez des milliers de personnes qui ont fait le choix du solaire
                avec NOORIA.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base">
                <Link to="/diagnostic">
                  <Sun className="w-5 h-5 mr-2" />
                  Diagnostic gratuit
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-6 bg-background/5 rounded-2xl">
                <Zap className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">3 min</div>
                <div className="text-background/70">Temps du diagnostic</div>
              </div>
              <div className="p-6 bg-background/5 rounded-2xl">
                <Sun className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">100%</div>
                <div className="text-background/70">Gratuit</div>
              </div>
              <div className="p-6 bg-background/5 rounded-2xl">
                <BarChart3 className="w-10 h-10 mb-4" />
                <div className="text-3xl font-bold">70%</div>
                <div className="text-background/70">Économies possibles</div>
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

      {/* App Download Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-5xl mx-auto"
          >
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl font-bold">
                Téléchargez l'app <span className="text-gradient">NOORIA</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Suivez votre diagnostic, vos économies et votre installation directement depuis votre smartphone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Apple App Store */}
                <a
                  href="#"
                  className="flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-70">Télécharger sur</div>
                    <div className="text-base font-semibold leading-tight">App Store</div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.18 23.76c.37.2.8.19 1.2-.03l12.7-7.34-2.75-2.75-11.15 10.12zM.47 1.6C.18 1.97 0 2.5 0 3.14v17.72c0 .64.18 1.17.47 1.54l.08.08 9.92-9.92v-.23L.55 1.52.47 1.6zM19.84 10.56l-2.61-1.51-3.07 3.07 3.07 3.07 2.63-1.52c.75-.43.75-1.14-.02-1.11zM4.38.27L17.08 7.6l-2.75 2.75L3.18.23c.4-.22.83-.2 1.2.04z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-70">Disponible sur</div>
                    <div className="text-base font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-52 h-96 bg-foreground rounded-[2.5rem] border-4 border-foreground shadow-2xl flex flex-col overflow-hidden relative">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-b-2xl z-10" />
                {/* Screen */}
                <div className="flex-1 bg-background m-2 mt-6 rounded-[2rem] p-4 flex flex-col gap-3">
                  <div className="text-xs font-bold text-primary">NOORIA</div>
                  <div className="h-2 bg-primary/20 rounded-full w-3/4" />
                  <div className="h-2 bg-muted rounded-full w-1/2" />
                  <div className="mt-2 p-3 bg-primary/10 rounded-xl">
                    <div className="text-xs font-semibold mb-1">Économies estimées</div>
                    <div className="text-xl font-black text-primary">2 400 DH/an</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-[9px] text-muted-foreground">Production</div>
                      <div className="text-xs font-bold">4.2 kWc</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-[9px] text-muted-foreground">Rentabilité</div>
                      <div className="text-xs font-bold">5 ans</div>
                    </div>
                  </div>
                  <div className="mt-auto h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-primary-foreground font-bold">Lancer mon diagnostic</span>
                  </div>
                </div>
                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-16 h-1 bg-background/30 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};


export default Diagnostic;
