import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sun, TrendingDown, ArrowDown } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

export default function BeforeAfterBill() {
  const [tab, setTab] = useState<"before" | "after">("before");

  const beforeData = {
    conso: 850,
    tarif: 1.60,
    total: 1850,
    emoji: "😰",
    title: "Avant",
    desc: (
      <>
        Facture ONEE de <span className="font-bold text-destructive">1,850 MAD/mois</span>. 100% dépendant du réseau, prix en hausse constante.
      </>
    ),
  };

  const afterData = {
    conso: 850,
    consoReseau: 320,
    tarif: 1.10,
    total: 550,
    emoji: "😎",
    title: "Après NOORIA",
    desc: (
      <>
        Facture réduite à <span className="font-bold text-primary">550 MAD/mois</span>. Autoconsommation solaire, retour sur investissement en 4-5 ans.
      </>
    ),
  };

  const savingMonthly = beforeData.total - afterData.total;
  const savingLifetime = savingMonthly * 12 * 25;

  const current = tab === "before" ? beforeData : afterData;

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Votre facture <span className="text-primary">ONEE</span>, avant et après
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Découvrez l'impact réel du solaire sur votre facture d'électricité
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted rounded-full p-1 gap-1">
            <button
              onClick={() => setTab("before")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "before"
                  ? "bg-destructive text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Avant solaire
            </button>
            <button
              onClick={() => setTab("after")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "after"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Après solaire ☀️
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Bill card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-2xl border-2 bg-card shadow-lg overflow-hidden ${
                tab === "before" ? "border-destructive/30" : "border-primary/30"
              }`}
            >
              {/* Red/green top bar */}
              <div className={`h-1.5 ${tab === "before" ? "bg-destructive" : "bg-primary"}`} />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tab === "before" ? "bg-destructive/10" : "bg-primary/10"
                  }`}>
                    {tab === "before" ? (
                      <Zap className="w-5 h-5 text-destructive" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg">Facture ONEE</p>
                    <p className="text-xs text-muted-foreground">Consommation mensuelle moyenne</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consommation réseau</span>
                    <span className="font-semibold">
                      {tab === "before" ? "850 kWh" : "320 kWh"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tarif moyen/kWh</span>
                    <span className="font-semibold">
                      {tab === "before" ? "1.60 MAD" : "1.10 MAD"}
                    </span>
                  </div>
                  {tab === "after" && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Production solaire couverte</span>
                      <span className="font-semibold">~530 kWh</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between items-end">
                  <span className="font-bold">Total TTC</span>
                  <span className={`text-3xl font-bold ${
                    tab === "before" ? "text-destructive" : "text-primary"
                  }`}>
                    {current.total.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Explanation cards */}
          <div className="flex flex-col gap-6">
            {/* Before card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-xl border bg-card p-5 flex gap-4 items-start transition-all ${
                tab === "before" ? "border-destructive/30 shadow-md" : "border-border opacity-60"
              }`}
            >
              <span className="text-2xl mt-0.5">😰</span>
              <div>
                <p className="font-bold mb-1">Avant</p>
                <p className="text-sm text-muted-foreground">
                  Facture ONEE de <span className="font-bold text-destructive">1 850 MAD/mois</span>. 100% dépendant du réseau, prix en hausse constante.
                </p>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* After card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`rounded-xl border bg-card p-5 flex gap-4 items-start transition-all ${
                tab === "after" ? "border-primary/30 shadow-md" : "border-border opacity-60"
              }`}
            >
              <span className="text-2xl mt-0.5">😎</span>
              <div>
                <p className="font-bold mb-1">Après NOORIA</p>
                <p className="text-sm text-muted-foreground">
                  Facture réduite à <span className="font-bold text-primary">550 MAD/mois</span>. Autoconsommation solaire, retour sur investissement en 4-5 ans.
                </p>
              </div>
            </motion.div>

            {/* Lifetime savings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-muted/60 border border-border p-5"
            >
              <p className="text-sm font-medium mb-1">
                📊 Sur 25 ans (durée de vie des panneaux)
              </p>
              <p className="text-3xl font-bold text-primary">
                <AnimatedCounter end={savingLifetime} suffix=" MAD" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                d'économies cumulées estimées
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
