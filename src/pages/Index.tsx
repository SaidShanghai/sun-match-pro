import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Leaf, Zap, PiggyBank, ArrowRight, Star, Sparkles, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const advantages = [
  {
    icon: PiggyBank,
    emoji: "💰",
    title: "Économies folles",
    description: "Jusqu'à 70% de réduction sur votre facture. Votre portefeuille vous dit merci !",
    color: "from-solar-warm/20 to-solar-gold/20",
  },
  {
    icon: Leaf,
    emoji: "🌍",
    title: "Planète heureuse",
    description: "Énergie 100% propre et renouvelable. Chaque panneau compte pour le climat.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Liberté totale",
    description: "Fini les mauvaises surprises sur les prix. Produisez votre propre énergie !",
    color: "from-solar-purple/20 to-solar-pink/20",
  },
];

const stats = [
  { value: "500+", label: "Installateurs", emoji: "🔧" },
  { value: "15k+", label: "Diagnostics", emoji: "📊" },
  { value: "98%", label: "Satisfaits", emoji: "😍" },
  { value: "30%", label: "Économies moy.", emoji: "📉" },
];

const testimonials = [
  {
    name: "Marie D.",
    location: "Lyon 🇫🇷",
    rating: 5,
    text: "En 48h j'avais mon installateur. Mes panneaux sont posés et je fais déjà des économies de ouf !",
    avatar: "🙋‍♀️",
  },
  {
    name: "Pierre L.",
    location: "Bordeaux 🍷",
    rating: 5,
    text: "Le diagnostic m'a ouvert les yeux sur mon potentiel solaire. L'installateur recommandé était au top.",
    avatar: "👨‍💼",
  },
  {
    name: "Sophie M.",
    location: "Marseille ☀️",
    rating: 5,
    text: "J'ai comparé 4 devis en 5 minutes. Le service est vraiment pratique et rapide !",
    avatar: "👩‍🔬",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="relative py-20 md:py-32">
        {/* Fun blobs */}
        <div className="absolute top-10 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-solar-purple/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-solar-warm/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2 text-sm font-medium shadow-sm"
              >
                <span className="text-lg">☀️</span>
                Le comparateur solaire n°1 en France
                <Sparkles className="h-4 w-4 text-solar-gold" />
              </motion.div>

              <h1 className="mb-6 text-5xl font-extrabold tracking-tight font-display md:text-7xl">
                Le solaire,
                <br />
                <span className="text-gradient-fun">c'est maintenant</span>{" "}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block"
                >
                  🚀
                </motion.span>
              </h1>

              <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-xl mx-auto">
                Diagnostic personnalisé en 2 minutes, devis gratuits d'installateurs certifiés. Simple, rapide, efficace.
              </p>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="gap-2 text-base px-8 rounded-full h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                  <Link to="/diagnostic">
                    Lancer mon diagnostic
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full h-14 text-base px-8" asChild>
                  <a href="#comment-ca-marche">
                    Comment ça marche ?
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats – pill shaped */}
      <section className="pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-1 rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">{stat.emoji}</span>
                  <div className="text-2xl font-extrabold font-display text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <motion.div {...fadeInUp} className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-4xl mb-4 block">🌞</span>
            <h2 className="mb-4 text-3xl font-bold font-display md:text-5xl">
              Pourquoi le solaire ?
            </h2>
            <p className="text-muted-foreground text-lg">
              3 bonnes raisons de franchir le pas (et il y en a plein d'autres)
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {advantages.map((adv, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }}>
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group">
                  <CardContent className="p-8">
                    <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform origin-left">
                      {adv.emoji}
                    </span>
                    <h3 className="mb-2 text-xl font-bold font-display">{adv.title}</h3>
                    <p className="text-muted-foreground">{adv.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="py-20">
        <div className="container">
          <motion.div {...fadeInUp} className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold font-display md:text-5xl">
              3 étapes, c'est tout ! ✌️
            </h2>
            <p className="text-muted-foreground text-lg">Du diagnostic aux devis en quelques minutes.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "1", emoji: "📋", title: "Diagnostic", desc: "Répondez à 8 questions simples sur votre logement et vos besoins énergétiques.", color: "bg-primary" },
              { step: "2", emoji: "🔍", title: "Comparaison", desc: "On sélectionne les meilleurs installateurs certifiés près de chez vous.", color: "bg-accent" },
              { step: "3", emoji: "✅", title: "Devis gratuits", desc: "Recevez et comparez des devis personnalisés. Vous choisissez, on gère !", color: "bg-solar-purple" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }} className="relative">
                <div className="text-center">
                  <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} text-3xl shadow-lg`}>
                    {item.emoji}
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Étape {item.step}</div>
                  <h3 className="mb-2 text-xl font-bold font-display">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-muted-foreground/30">
                    <ChevronRight className="h-8 w-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <motion.div {...fadeInUp} className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold font-display md:text-5xl">
              Ils ont adoré 💚
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-solar-gold text-solar-gold" />
                      ))}
                    </div>
                    <p className="mb-5 text-sm leading-relaxed text-foreground">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.avatar}</span>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeInUp}>
            <div className="mx-auto max-w-3xl rounded-3xl gradient-fun p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-8 text-6xl opacity-20 rotate-12">☀️</div>
              <div className="absolute bottom-4 left-8 text-5xl opacity-20 -rotate-12">⚡</div>
              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-bold text-white font-display md:text-4xl">
                  Prêt à passer au solaire ? 🌞
                </h2>
                <p className="mb-8 text-white/80 text-lg">
                  2 minutes de diagnostic, des économies pour des années.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base px-8 rounded-full h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  asChild
                >
                  <Link to="/diagnostic">
                    C'est parti !
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
