import { motion } from "framer-motion";
import { Sun, Zap, Ruler, PanelTop, Leaf, BarChart3, AlertTriangle } from "lucide-react";

export interface SolarData {
  maxSunshineHoursPerYear: number;
  maxArrayAreaMeters2: number;
  maxArrayPanelsCount: number;
  totalRoofAreaMeters2: number;
  panelCapacityWatts: number;
  carbonOffsetFactorKgPerMwh: number;
  roofSegmentCount: number;
  imageryQuality?: string;
  bestConfig?: { panelsCount: number; yearlyEnergyDcKwh: number } | null;
  recommendedConfig?: { panelsCount: number; yearlyEnergyDcKwh: number } | null;
  roofSegments?: { pitchDegrees: number; azimuthDegrees: number; areaMeters2: number; sunshineHoursPerYear: number }[];
  error?: string;
}

interface SolarResultsProps {
  data: SolarData | null;
  loading: boolean;
  error?: string | null;
  factureMad?: number;
}

const azimuthToDirection = (deg: number): string => {
  if (deg >= 337.5 || deg < 22.5) return "Nord";
  if (deg < 67.5) return "Nord-Est";
  if (deg < 112.5) return "Est";
  if (deg < 157.5) return "Sud-Est";
  if (deg < 202.5) return "Sud";
  if (deg < 247.5) return "Sud-Ouest";
  if (deg < 292.5) return "Ouest";
  return "Nord-Ouest";
};

// Morocco electricity price ~1.2 MAD/kWh average
const ELECTRICITY_PRICE_MAD = 1.2;

const SolarResults = ({ data, loading, error, factureMad }: SolarResultsProps) => {
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
          Google Solar API ne couvre pas encore cette zone. Le diagnostic continue avec vos informations manuelles.
        </p>
      </motion.div>
    );
  }

  const config = data.recommendedConfig || data.bestConfig;
  const yearlyKwh = config?.yearlyEnergyDcKwh || 0;
  const savingsMad = yearlyKwh * ELECTRICITY_PRICE_MAD;
  const annualBill = factureMad || 0;
  const savingsPercent = annualBill > 0 ? Math.min(Math.round((savingsMad / annualBill) * 100), 100) : null;

  const co2Saved = data.carbonOffsetFactorKgPerMwh > 0
    ? Math.round((yearlyKwh / 1000) * data.carbonOffsetFactorKgPerMwh)
    : Math.round(yearlyKwh * 0.5); // fallback: 0.5 kg/kWh for Morocco grid

  const mainSegment = data.roofSegments?.[0];

  const cards = [
    {
      icon: Sun,
      label: "Ensoleillement",
      value: `${Math.round(data.maxSunshineHoursPerYear).toLocaleString("fr-FR")}`,
      unit: "h/an",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Ruler,
      label: "Surface exploitable",
      value: `${Math.round(data.maxArrayAreaMeters2)}`,
      unit: "m²",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: PanelTop,
      label: "Panneaux recommandés",
      value: `${config?.panelsCount || data.maxArrayPanelsCount}`,
      unit: "panneaux",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      label: "Production estimée",
      value: `${Math.round(yearlyKwh).toLocaleString("fr-FR")}`,
      unit: "kWh/an",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: BarChart3,
      label: "Économies estimées",
      value: `${Math.round(savingsMad).toLocaleString("fr-FR")}`,
      unit: "MAD/an",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
      extra: savingsPercent ? `≈ ${savingsPercent}% de votre facture` : undefined,
    },
    {
      icon: Leaf,
      label: "CO₂ évité",
      value: `${co2Saved.toLocaleString("fr-FR")}`,
      unit: "kg/an",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sun className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-black">Potentiel solaire de votre toit</h3>
      </div>

      {data.imageryQuality && (
        <p className="text-xs text-muted-foreground">
          Qualité d'imagerie : <span className="font-semibold">{data.imageryQuality}</span>
        </p>
      )}

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

      {mainSegment && (
        <div className="rounded-2xl bg-muted/50 border border-border p-4 space-y-1">
          <p className="text-xs font-semibold">Orientation principale du toit</p>
          <p className="text-sm">
            <span className="font-bold">{azimuthToDirection(mainSegment.azimuthDegrees)}</span>
            {" · "}Inclinaison {Math.round(mainSegment.pitchDegrees)}°
            {" · "}{Math.round(mainSegment.areaMeters2)} m²
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SolarResults;
