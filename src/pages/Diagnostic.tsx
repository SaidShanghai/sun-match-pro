import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, ClipboardCheck, BarChart3, Shield, Zap, ArrowRight, Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StopwatchIcon = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s + 1) % 180);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const angle = (seconds / 180) * 360;

  return (
    <div className="relative w-[180px] h-[180px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <rect x="92" y="2" width="16" height="18" rx="4" className="fill-muted-foreground/60" />
        <circle cx="100" cy="22" r="6" className="fill-muted-foreground/40" />
        <circle cx="100" cy="110" r="78" className="fill-card stroke-border" strokeWidth="4" />
        <circle cx="100" cy="110" r="70" className="fill-none stroke-primary/20" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x1 = 100 + 62 * Math.sin(a);
          const y1 = 110 - 62 * Math.cos(a);
          const x2 = 100 + 68 * Math.sin(a);
          const y2 = 110 - 68 * Math.cos(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />;
        })}
        <circle
          cx="100" cy="110" r="58"
          className="fill-none stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 360) * 364.4} 364.4`}
          transform="rotate(-90 100 110)"
          style={{ transition: "stroke-dasharray 1s linear" }}
        />
        <line
          x1="100" y1="110"
          x2={100 + 50 * Math.sin((angle * Math.PI) / 180)}
          y2={110 - 50 * Math.cos((angle * Math.PI) / 180)}
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "all 1s linear" }}
        />
        <circle cx="100" cy="110" r="5" className="fill-primary" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
        <span className="text-4xl font-black font-display text-foreground mt-8">3:00</span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">minutes</span>
      </div>
    </div>
  );
};

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
          <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-center overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 overflow-visible"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Gratuit • Sans engagement • Résultat instantané</span>
              </div>

              <h1 className="font-black leading-[1.1] overflow-visible whitespace-nowrap">
                <span className="block" style={{ fontSize: "60px" }}>Vous êtes à</span>
                <span className="block text-gradient" style={{ fontSize: "112px" }}>3 minutes</span>
                <span className="block" style={{ fontSize: "60px" }}>de grosses</span>
                <span className="block text-gradient" style={{ fontSize: "105px" }}>économies !</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Notre diagnostic solaire analyse votre situation et vous connecte
                avec les meilleurs installateurs certifiés près de chez vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group h-14 px-8 text-base">
                  <Link to="/diagnostic">
                    Lancer mon diagnostic
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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

            {/* Stopwatch visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex flex-col items-center justify-center"
            >
              <StopwatchIcon />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-lg font-semibold text-muted-foreground"
              >
                C'est le temps qu'il faut ⏱️
              </motion.p>
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

      <Footer />
    </div>
  );
};

export default Diagnostic;
