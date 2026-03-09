import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Shield, Brain, Users, CheckCircle, ArrowRight, Zap, Lock, Award, Newspaper } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import AnimatedCounter from "@/components/AnimatedCounter";
import { STATS } from "@/config/stats";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

import { aboutSchema } from "@/config/seoSchemas";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const PARTNERS = [
  { name: "MASEN", desc: "Agence Marocaine pour l'Énergie Durable" },
  { name: "ONEE", desc: "Office National de l'Électricité et de l'Eau Potable" },
  { name: "AMEE", desc: "Agence Marocaine pour l'Efficacité Énergétique" },
  { name: "ANRE", desc: "Autorité Nationale de Régulation de l'Énergie" },
];

const TRUST_POINTS = [
  {
    icon: Lock,
    title: "Données sécurisées",
    desc: "Vos données sont chiffrées et hébergées sur des serveurs sécurisés. Aucune donnée n'est partagée avec des tiers sans votre consentement.",
  },
  {
    icon: Shield,
    title: "Conformité CNDP",
    desc: "SOLARBOX respecte la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.",
  },
  {
    icon: Zap,
    title: "Diagnostic 100% gratuit",
    desc: "Le diagnostic SOLARBOX est et restera toujours gratuit pour les particuliers. SOLARBOX se rémunère uniquement auprès des installateurs partenaires.",
  },
];

export default function About() {
  usePageMeta({
    title: "À Propos de SOLARBOX – Experts Solaire au Maroc | sungpt.ma",
    description: "SOLARBOX est la première plateforme dédiée au solaire au Maroc. Notre mission : rendre l'énergie solaire accessible à chaque Marocain.",
  });

  return (
    <>
      <JsonLd schema={aboutSchema} />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sun className="w-4 h-4" />
            À propos de SOLARBOX
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            NOORIA – Pionniers du <span className="text-primary">diagnostic solaire IA</span> au Maroc
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Fondée à Casablanca, nous aidons les Marocains à passer au solaire avec des données fiables, une technologie de pointe et un réseau d'installateurs certifiés.
          </p>
        </motion.div>
      </section>

      {/* Notre mission */}
      <section className="py-20 px-4">
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Notre mission</h2>
              <div className="w-16 h-1 bg-primary rounded-full" />
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Le Maroc bénéficie de l'un des meilleurs ensoleillements au monde — plus de <strong className="text-foreground">3 000 heures par an</strong>. Pourtant, l'énergie solaire reste sous-exploitée chez les particuliers, freinée par le manque d'information, la complexité des démarches et la difficulté à trouver un installateur fiable.
              </p>
              <p>
                <strong className="text-foreground">NOORIA</strong> a été créée pour lever ces barrières. Notre plateforme combine intelligence artificielle et expertise terrain pour permettre à chaque Marocain d'évaluer son potentiel solaire, comprendre les aides disponibles (SR500, TATWIR, GEFF) et se connecter aux meilleurs installateurs certifiés de sa région.
              </p>
              <p>
                Notre ambition : faire du Maroc un leader de l'autoconsommation solaire en Afrique, en démocratisant l'accès à une énergie propre, économique et souveraine.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chiffres clés */}
      <section className="py-20 px-4 bg-muted/50">
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Chiffres clés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, stat: STATS.diagnostics },
              { icon: Award, stat: STATS.installateurs },
              { icon: Sun, stat: STATS.rating },
              { icon: Zap, stat: STATS.savings },
            ].map(({ icon: Icon, stat }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card border border-border rounded-2xl"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={"decimals" in stat ? stat.decimals : 0}
                  className="text-3xl font-bold text-foreground"
                />
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Notre technologie */}
      <section className="py-20 px-4">
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Notre technologie</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">SunGPT</strong> est le moteur d'intelligence artificielle propriétaire au cœur de NOORIA. Il combine trois technologies : l'OCR (reconnaissance optique de caractères) pour analyser automatiquement votre facture ONEE, un algorithme de dimensionnement solaire alimenté par les données d'ensoleillement PVGIS, et un système de matching intelligent avec les installateurs certifiés RGE.
                </p>
                <p>
                  En moins de 2 minutes, SunGPT génère un diagnostic personnalisé incluant la puissance optimale en kWc, les économies prévisionnelles en dirhams (MAD), le retour sur investissement et les aides d'état applicables (SR500, TATWIR, GEFF, exonérations AMEE).
                </p>
                <p>
                  Notre algorithme s'améliore continuellement grâce aux retours terrain de nos installateurs partenaires et aux données de production réelles des installations déjà en service.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-primary/20 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-20 h-20 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Partenaires & certifications */}
      <section className="py-20 px-4 bg-muted/50">
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Nos partenaires & certifications</h2>
          <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
            NOORIA collabore avec les institutions de référence du secteur énergétique marocain.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="p-6 bg-card border border-border rounded-2xl flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{partner.name.charAt(0)}</span>
                </div>
                <div className="font-semibold text-foreground">{partner.name}</div>
                <div className="text-xs text-muted-foreground text-center leading-snug">{partner.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pourquoi nous faire confiance */}
      <section className="py-20 px-4">
        <motion.div {...fadeUp} className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Pourquoi nous faire confiance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="p-6 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Presse */}
      <section className="py-20 px-4 bg-muted/50">
        <motion.div {...fadeUp} className="container mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            Presse
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed">
            NOORIA est en cours de référencement dans les médias spécialisés.
            <br />
            Vous êtes journaliste ?{" "}
            <a href="mailto:presse@sungpt.ma" className="text-primary font-medium hover:underline">
              Contactez-nous&nbsp;: presse@sungpt.ma
            </a>
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div {...fadeUp} className="container mx-auto max-w-3xl">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-amber-500 p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Prêt à découvrir votre potentiel solaire ?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-lg mx-auto">
              En 2 minutes, SunGPT analyse votre profil et vous recommande la solution idéale.
            </p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold h-14 px-8">
              <Link to="/diagnostic">
                Lancer mon diagnostic gratuit <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </>
  );
}
