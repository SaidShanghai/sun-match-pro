import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, ClipboardCheck, BarChart3, Shield, Zap, ArrowRight, Timer } from "lucide-react";
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
    <div className="relative w-[300px] h-[300px] mx-auto">
      {/* Outer ring */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Button top */}
        <rect x="92" y="2" width="16" height="18" rx="4" className="fill-muted-foreground/60" />
        {/* Small circle connector */}
        <circle cx="100" cy="22" r="6" className="fill-muted-foreground/40" />
        
        {/* Main body */}
        <circle cx="100" cy="110" r="78" className="fill-card stroke-border" strokeWidth="4" />
        <circle cx="100" cy="110" r="70" className="fill-none stroke-primary/20" strokeWidth="2" />
        
        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x1 = 100 + 62 * Math.sin(a);
          const y1 = 110 - 62 * Math.cos(a);
          const x2 = 100 + 68 * Math.sin(a);
          const y2 = 110 - 68 * Math.cos(a);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />
          );
        })}

        {/* Progress arc */}
        <circle
          cx="100" cy="110" r="58"
          className="fill-none stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 360) * 364.4} 364.4`}
          transform="rotate(-90 100 110)"
          style={{ transition: "stroke-dasharray 1s linear" }}
        />

        {/* Needle */}
        <line
          x1="100" y1="110"
          x2={100 + 50 * Math.sin((angle * Math.PI) / 180)}
          y2={110 - 50 * Math.cos((angle * Math.PI) / 180)}
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "all 1s linear" }}
        />

        {/* Center dot */}
        <circle cx="100" cy="110" r="5" className="fill-primary" />
      </svg>

      {/* Text inside */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
        <span className="text-5xl font-black font-display text-foreground mt-8">3:00</span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">minutes</span>
      </div>
    </div>
  );
};

const features = [
  {
    icon: ClipboardCheck,
    emoji: "📋",
    title: "Analyse personnalisée",
    description: "On étudie votre toit, votre orientation, votre conso… Bref, tout ce qui compte pour un projet solaire réussi.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Sun,
    emoji: "☀️",
    title: "Potentiel solaire",
    description: "On calcule combien de kWh votre toiture peut produire chaque année. Spoiler : c'est souvent plus que ce qu'on imagine !",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Économies estimées",
    description: "Combien vous économisez sur votre facture ? Quel retour sur investissement ? On vous dit tout, sans surprise.",
    color: "from-emerald-400 to-green-600",
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Installateurs vérifiés",
    description: "Nos partenaires sont triés sur le volet : certifications, documents légaux, références… Zéro improvisation.",
    color: "from-blue-400 to-indigo-500",
  },
];

const steps = [
  { num: "01", text: "Répondez à quelques questions simples", emoji: "✍️" },
  { num: "02", text: "On analyse votre potentiel solaire", emoji: "🔍" },
  { num: "03", text: "Recevez des devis d'installateurs certifiés", emoji: "📩" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 } as const,
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Diagnostic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 -left-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-10 -right-40 h-80 w-80 rounded-full bg-amber-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-solar-purple/5 blur-3xl" />

        {/* Hero */}
        <section className="container max-w-4xl pt-20 pb-16 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-base font-bold mb-10"
          >
            <Zap className="w-5 h-5" />
            Rapide &amp; gratuit
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, type: "spring" }}
            className="mb-8"
          >
            <StopwatchIcon />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-display mb-8 text-foreground leading-tight"
          >
            Votre diagnostic solaire
            <br />
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              en 3 minutes chrono
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14"
          >
            Découvrez combien vous pouvez économiser grâce au solaire.
            Pas de jargon, pas d'engagement — juste des réponses claires.
          </motion.p>

          {/* Steps timeline */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-8"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={item} className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4 shadow-md">
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-primary">ÉTAPE {s.num}</span>
                    <p className="text-sm font-medium text-foreground">{s.text}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden sm:block w-5 h-5 text-muted-foreground/40 mx-2" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Feature cards */}
        <section className="container max-w-5xl pb-20 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {features.map(({ icon: Icon, emoji, title, description, color }, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-default overflow-hidden"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold font-display mb-2 text-foreground">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-6 py-4">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-muted-foreground">
                Un diagnostic complet et personnalisé, 100% gratuit et sans engagement.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Diagnostic;
