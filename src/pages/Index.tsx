import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Leaf, Zap, PiggyBank, ArrowRight, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const advantages = [
  {
    icon: PiggyBank,
    title: "Économies garanties",
    description: "Réduisez votre facture d'électricité jusqu'à 70% grâce à l'autoconsommation solaire.",
  },
  {
    icon: Leaf,
    title: "Impact écologique",
    description: "Produisez une énergie propre et renouvelable, réduisez votre empreinte carbone.",
  },
  {
    icon: Zap,
    title: "Autonomie énergétique",
    description: "Devenez indépendant des fluctuations des prix de l'énergie et des coupures réseau.",
  },
];

const stats = [
  { value: "500+", label: "Installateurs certifiés" },
  { value: "15 000+", label: "Diagnostics réalisés" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "30%", label: "Économies moyennes" },
];

const testimonials = [
  {
    name: "Marie D.",
    location: "Lyon",
    rating: 5,
    text: "Grâce à SolairePro, j'ai trouvé un installateur sérieux en 48h. Mes panneaux sont posés et je fais déjà des économies !",
  },
  {
    name: "Pierre L.",
    location: "Bordeaux",
    rating: 5,
    text: "Le diagnostic m'a permis de comprendre mon potentiel solaire. L'installateur recommandé était parfait.",
  },
  {
    name: "Sophie M.",
    location: "Marseille",
    rating: 5,
    text: "Service rapide et efficace. J'ai pu comparer plusieurs devis et choisir l'offre la plus adaptée.",
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
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-solar-green-light via-background to-solar-blue-light">
        <div className="container relative z-10 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sun className="h-4 w-4 text-solar-warm" />
                Comparez les meilleurs installateurs solaires
              </div>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                Passez au solaire en toute{" "}
                <span className="text-primary">confiance</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Réalisez votre diagnostic solaire personnalisé et recevez des devis
                d'installateurs certifiés, adaptés à votre situation.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="gap-2 text-base px-8" asChild>
                  <Link to="/diagnostic">
                    Lancer mon diagnostic
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base" asChild>
                  <a href="#avantages">En savoir plus</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Stats */}
      <section className="border-b bg-background">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }} className="text-center">
                <div className="text-3xl font-extrabold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="avantages" className="bg-background">
        <div className="container py-20">
          <motion.div {...fadeInUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Pourquoi passer au solaire ?
            </h2>
            <p className="text-muted-foreground">
              Le solaire est l'investissement le plus rentable pour votre maison et la planète.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((adv, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }}>
                <Card className="h-full border-0 bg-muted/50 shadow-none hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <adv.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{adv.title}</h3>
                    <p className="text-muted-foreground">{adv.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30">
        <div className="container py-20">
          <motion.div {...fadeInUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Comment ça marche ?</h2>
            <p className="text-muted-foreground">3 étapes simples pour trouver votre installateur idéal.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Diagnostic", desc: "Répondez à quelques questions sur votre logement et vos besoins." },
              { step: "2", title: "Comparaison", desc: "Recevez une sélection d'installateurs adaptés à votre profil." },
              { step: "3", title: "Devis", desc: "Demandez des devis gratuits et choisissez la meilleure offre." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background">
        <div className="container py-20">
          <motion.div {...fadeInUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ce que disent nos utilisateurs</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.15 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-solar-gold text-solar-gold" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">"{t.text}"</p>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-16 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Prêt à passer au solaire ?
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Lancez votre diagnostic gratuit et recevez des devis personnalisés en quelques minutes.
            </p>
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8" asChild>
              <Link to="/diagnostic">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
