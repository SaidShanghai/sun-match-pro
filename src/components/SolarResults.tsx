import { motion } from "framer-motion";
import { Sun, Zap, Ruler, Leaf, BarChart3, AlertTriangle, Calendar, TrendingUp, Receipt } from "lucide-react";
import { calcSolarSavings, getEffectivePricePerKwh, getTarifDetails, getDistributeur } from "@/data/oneeTariffs";

export interface SolarData {
  source: string;
  yearlyProductionKwh: number;
  yearlyIrradiationKwhM2: number;
  optimalInclination: number;
  optimalAzimuth: number;
  peakpowerKwp: number;
  systemLoss: number;
  co2SavedKg: number;
  savingsMad: number;
  sdYearly: number;
  monthlyData?: { month: number; productionKwh: number; irradiationKwhM2: number; sdMonthly: number }[];
  latitude?: number;
  longitude?: number;
  elevation?: number;
  database?: string;
  error?: string;
}

interface SolarResultsProps {
  data: SolarData | null;
  loading: boolean;
  error?: string | null;
  factureMad?: number;
  consoKwh?: number;
  city?: string;
}

const azimuthToDirection = (deg: number): string => {
  const normalized = ((deg + 180) % 360 + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return "Nord";
  if (normalized < 67.5) return "Nord-Est";
  if (normalized < 112.5) return "Est";
  if (normalized < 157.5) return "Sud-Est";
  if (normalized < 202.5) return "Sud";
  if (normalized < 247.5) return "Sud-Ouest";
  if (normalized < 292.5) return "Ouest";
  return "Nord-Ouest";
};

const SolarResults = ({ data, loading, error, factureMad, consoKwh, city }: SolarResultsProps) => {
  if (loading) return null;

  if (error || !data || data.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-warning/30 bg-warning/5 p-6 space-y-3"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <p className="font-semibold text-sm">Données solaires non disponibles</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Les données PVGIS ne sont pas disponibles pour cette localisation. Le diagnostic continue avec vos informations manuelles.
        </p>
      </motion.div>
    );
  }

  const yearlyKwh = data.yearlyProductionKwh;

  // Estimate annual consumption from bill if not provided directly
  // Use effective price to reverse-engineer consumption
  let annualConsoKwh = consoKwh || 0;
  if (!annualConsoKwh && factureMad) {
    // Iterative estimation: find kWh that matches the bill
    let estimatedKwh = factureMad; // start rough
    for (let i = 0; i < 10; i++) {
      const effectivePrice = getEffectivePricePerKwh(estimatedKwh);
      if (effectivePrice <= 0) break;
      estimatedKwh = Math.round(factureMad / effectivePrice);
    }
    annualConsoKwh = estimatedKwh;
  }

  // Calculate real savings using ONEE tranches
  const savings = annualConsoKwh > 0
    ? calcSolarSavings(annualConsoKwh, yearlyKwh)
    : { billBefore: 0, billAfter: 0, savingsMad: Math.round(yearlyKwh * getEffectivePricePerKwh(yearlyKwh || 3000)), savingsPercent: 0 };

  const monthlyConsoKwh = annualConsoKwh / 12;
  const tarifInfo = getTarifDetails(monthlyConsoKwh || 250);
  const distributeur = city ? getDistributeur(city) : "ONEE";

  const cards = [
    {
      icon: Sun,
      label: "Irradiation annuelle",
      value: `${data.yearlyIrradiationKwhM2.toLocaleString("fr-FR")}`,
      unit: "kWh/m²/an",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Zap,
      label: "Production estimée",
      value: `${yearlyKwh.toLocaleString("fr-FR")}`,
      unit: `kWh/an (${data.peakpowerKwp} kWc)`,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: TrendingUp,
      label: "Inclinaison optimale",
      value: `${data.optimalInclination}°`,
      unit: azimuthToDirection(data.optimalAzimuth),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: BarChart3,
      label: "Économies estimées",
      value: `${savings.savingsMad.toLocaleString("fr-FR")}`,
      unit: "MAD/an",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
      extra: savings.savingsPercent > 0 ? `≈ ${savings.savingsPercent}% de votre facture` : undefined,
    },
    {
      icon: Leaf,
      label: "CO₂ évité",
      value: `${data.co2SavedKg.toLocaleString("fr-FR")}`,
      unit: "kg/an",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      icon: Receipt,
      label: "Prix moyen kWh",
      value: `${getEffectivePricePerKwh(annualConsoKwh || 3000).toFixed(2)}`,
      unit: "MAD TTC",
      color: "text-primary",
      bgColor: "bg-primary/10",
      extra: `Mode ${tarifInfo.mode}`,
    },
  ];

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const monthlyData = data.monthlyData || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sun className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-black">Potentiel solaire de votre site</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Source : <span className="font-semibold">PVGIS ({data.database || "SARAH3"})</span>
        {data.latitude && ` · ${data.latitude.toFixed(2)}°N, ${data.longitude?.toFixed(2)}°W`}
        {` · Distributeur : ${distributeur}`}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border p-4 space-y-2"
          >
            <div className={`w-8 h-8 rounded-xl ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black">{card.value}</span>
              <span className="text-xs text-muted-foreground">{card.unit}</span>
            </div>
            {card.extra && (
              <p className="text-[10px] font-medium text-emerald-600">{card.extra}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tariff breakdown */}
      {annualConsoKwh > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold">Détail tarification ONEE — {tarifInfo.mode}</p>
          </div>
          <div className="space-y-1">
            {tarifInfo.tranches.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  {t.to ? `${t.from}–${t.to} kWh` : `> ${t.from} kWh`}
                </span>
                <span className="font-semibold">{t.priceTTC.toFixed(4)} MAD/kWh TTC</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Facture avant solaire</span>
            <span className="font-bold">{savings.billBefore.toLocaleString("fr-FR")} MAD/an</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Facture après solaire</span>
            <span className="font-bold text-emerald-600">{savings.billAfter.toLocaleString("fr-FR")} MAD/an</span>
          </div>
        </motion.div>
      )}

      {/* Monthly production bar chart */}
      {monthlyData.length > 0 && (
        <div className="rounded-2xl bg-muted/50 border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold">Production mensuelle (kWh)</p>
          </div>
          <div className="flex items-end gap-1 h-24">
            {monthlyData.map((m, i) => {
              const maxProd = Math.max(...monthlyData.map(d => d.productionKwh));
              const height = maxProd > 0 ? (m.productionKwh / maxProd) * 100 : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-muted-foreground font-medium">
                    {Math.round(m.productionKwh)}
                  </span>
                  <div
                    className="w-full rounded-t-sm relative overflow-hidden bg-primary/20"
                    style={{ height: `${height}%`, minHeight: 2 }}
                  >
                    <div className="absolute inset-0 bg-primary rounded-t-sm" />
                  </div>
                  <span className="text-[8px] text-muted-foreground">{monthNames[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SolarResults;
