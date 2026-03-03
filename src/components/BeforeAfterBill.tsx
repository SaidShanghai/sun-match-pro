import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Zap, Sun } from "lucide-react";

export default function BeforeAfterBill() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const beforeItems = [
    { label: "T1 (0–100 kWh)", kwh: 100, price: 92.76 },
    { label: "T2 (101–150 kWh)", kwh: 50, price: 55.15 },
    { label: "T3 (151–300 kWh)", kwh: 150, price: 183.94 },
  ];
  const beforeTotal = 1650;

  const afterItems = [
    { label: "T1 (0–100 kWh)", kwh: 100, price: 92.76 },
    { label: "T2 (résidu)", kwh: 30, price: 33.09 },
  ];
  const afterTotal = 495;

  const saving = beforeTotal - afterTotal;
  const savingPct = Math.round((saving / beforeTotal) * 100);

  return (
    <section className="py-24 bg-muted/20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold mb-4">Avant / Après solaire</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualisez l'impact concret sur votre facture ONEE — simulation pour 300 kWh/mois.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* AVANT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border-2 border-destructive/30 bg-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-destructive" />
              <span className="font-bold text-lg">Avant solaire</span>
            </div>

            <div className="space-y-3 flex-1">
              {beforeItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.price.toFixed(2)} DH</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-4 border-t border-border"
            >
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Facture annuelle</span>
                <span className="text-3xl font-bold text-destructive">{beforeTotal.toLocaleString()} DH</span>
              </div>
            </motion.div>
          </motion.div>

          {/* APRÈS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl border-2 border-primary/30 bg-card p-6 flex flex-col"
          >
            <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              -{savingPct}%
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Sun className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">Avec solaire</span>
            </div>

            <div className="space-y-3 flex-1">
              {afterItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.price.toFixed(2)} DH</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="flex justify-between items-center text-sm text-primary"
              >
                <span>Production solaire couverte</span>
                <span className="font-semibold">~170 kWh/mois</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-6 pt-4 border-t border-border"
            >
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Facture annuelle</span>
                <span className="text-3xl font-bold text-primary">{afterTotal.toLocaleString()} DH</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Savings bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="max-w-4xl mx-auto mt-10"
        >
          <div className="flex items-center justify-center gap-4 p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <TrendingDown className="w-8 h-8 text-primary shrink-0" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{saving.toLocaleString()} DH / an économisés</p>
              <p className="text-sm text-muted-foreground mt-1">
                Soit environ {Math.round(saving / 12).toLocaleString()} DH/mois en moins sur votre facture
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
