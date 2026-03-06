import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Battery, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema } from "@/config/seoSchemas";
import { usePageMeta } from "@/hooks/usePageMeta";
import solarboxRooftop from "@/assets/solarbox-rooftop.jpg";
import solarboxInterior from "@/assets/solarbox-interior.jpg";
import solarboxVilla from "@/assets/solarbox-villa.jpg";

const useCases = [
  {
    image: solarboxRooftop,
    alt: "SolarBox installée sur une terrasse marocaine avec panneaux solaires et flux d'énergie bleu",
    title: "Installation résidentielle — Terrasse",
    description:
      "La SolarBox s'intègre parfaitement sur votre terrasse. Les panneaux captent l'énergie solaire et l'acheminent directement vers l'unité de stockage, prête à alimenter votre foyer jour et nuit.",
    highlights: ["Compacte & discrète", "Zéro bruit", "Résistante aux intempéries"],
  },
  {
    image: solarboxInterior,
    alt: "SolarBox intérieure alimentant climatiseur et réfrigérateur via flux d'énergie bleu depuis les panneaux",
    title: "Alimentation domestique — Intérieur",
    description:
      "Depuis les panneaux sur le toit, l'électricité traverse la SolarBox et alimente directement vos équipements : climatisation, réfrigérateur, éclairage — en totale autonomie.",
    highlights: ["Autonomie 24h", "Tous appareils", "Installation murale"],
  },
  {
    image: solarboxVilla,
    alt: "Vue aérienne d'une villa marocaine équipée SolarBox avec circuit électrique visible en bleu",
    title: "Villa & entreprise — Grande capacité",
    description:
      "Pour les villas et les PME, la SolarBox haute puissance couvre l'intégralité des besoins. Le circuit solaire complet est visible : du toit aux batteries, puis vers chaque pièce du bâtiment.",
    highlights: ["Jusqu'à 54 kW", "Triphasé 380V", "Scalable à volonté"],
  },
];

const specs = [
  { icon: Sun, label: "Panneaux", value: "Haute efficacité" },
  { icon: Battery, label: "Batteries LFP", value: "6 000 cycles" },
  { icon: Zap, label: "Puissance", value: "6 à 54 kW" },
  { icon: Shield, label: "Garantie", value: "5 ans minimum" },
];

const NosSolutions = () => {
  usePageMeta({
    title: "SolarBox NOORIA – Installation Solaire Clé en Main au Maroc",
    description: "Système solaire complet avec batterie LFP, onduleur hybride et garantie 10 ans. Installation par des techniciens certifiés RGE au Maroc.",
  });

  return (
    <>
      <JsonLd schema={serviceSchema} />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            La <span className="text-primary">SolarBox</span> — L'énergie solaire
            <br className="hidden md:block" /> clé en main
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Station solaire tout-en-un avec batteries intégrées. Du panneau à la
            prise, l'électricité circule sans interruption dans votre maison.
          </motion.p>
        </div>
      </section>

      {/* Specs bar */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {specs.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-semibold text-sm">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-24">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 md:gap-14 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={uc.image}
                    alt={uc.alt}
                    className="w-full h-auto object-cover aspect-video"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">{uc.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {uc.description}
                </p>
                <ul className="space-y-2">
                  {uc.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">
            Prêt à passer à l'énergie solaire ?
          </h2>
          <p className="text-muted-foreground">
            Faites votre diagnostic gratuit et découvrez la SolarBox adaptée à
            votre consommation et votre budget.
          </p>
          <Link to="/diagnostic">
            <Button size="lg" className="gap-2">
              Lancer mon diagnostic <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </>
  );
};

export default NosSolutions;
