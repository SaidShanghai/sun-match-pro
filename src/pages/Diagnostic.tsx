import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Home, Layers, Compass, Ruler, Zap, Wallet, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  { icon: MapPin, emoji: "📍", title: "Localisation", description: "Où habitez-vous ?" },
  { icon: Home, emoji: "🏠", title: "Logement", description: "Quel type de logement ?" },
  { icon: Layers, emoji: "🏗️", title: "Toiture", description: "Quel type de toit ?" },
  { icon: Compass, emoji: "🧭", title: "Orientation", description: "Comment est orienté votre toit ?" },
  { icon: Ruler, emoji: "📐", title: "Surface", description: "Quelle surface disponible ?" },
  { icon: Zap, emoji: "⚡", title: "Consommation", description: "Combien consommez-vous ?" },
  { icon: Wallet, emoji: "💰", title: "Budget", description: "Quel budget avez-vous en tête ?" },
  { icon: User, emoji: "👤", title: "Coordonnées", description: "Pour recevoir vos devis" },
];

const housingTypes = [
  { value: "Maison individuelle", emoji: "🏡" },
  { value: "Appartement", emoji: "🏢" },
  { value: "Immeuble", emoji: "🏘️" },
];
const roofTypes = [
  { value: "Tuiles", emoji: "🧱" },
  { value: "Ardoises", emoji: "🪨" },
  { value: "Bac acier", emoji: "🔩" },
  { value: "Toit plat", emoji: "⬜" },
];
const orientations = [
  { value: "Sud", emoji: "⬇️" },
  { value: "Sud-Est", emoji: "↙️" },
  { value: "Sud-Ouest", emoji: "↘️" },
  { value: "Est", emoji: "⬅️" },
  { value: "Ouest", emoji: "➡️" },
  { value: "Nord", emoji: "⬆️" },
];
const surfaces = ["< 20 m²", "20 - 40 m²", "40 - 60 m²", "60 - 100 m²", "> 100 m²"];
const consumptions = ["< 5 000 kWh", "5 000 - 10 000 kWh", "10 000 - 15 000 kWh", "15 000 - 20 000 kWh", "> 20 000 kWh"];
const budgets = ["< 5 000 €", "5 000 - 10 000 €", "10 000 - 15 000 €", "15 000 - 20 000 €", "> 20 000 €"];

interface DiagnosticData {
  postalCode: string;
  housingType: string;
  roofType: string;
  orientation: string;
  surface: string;
  consumption: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
}

const OptionCard = ({
  label, emoji, selected, onClick,
}: { label: string; emoji?: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border-2 p-5 text-left font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
      selected
        ? "border-primary bg-primary/10 text-foreground shadow-md"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/50"
    }`}
  >
    {emoji && <span className="text-2xl mb-2 block">{emoji}</span>}
    <span className="text-sm">{label}</span>
  </button>
);

const Diagnostic = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DiagnosticData>({
    postalCode: "", housingType: "", roofType: "", orientation: "",
    surface: "", consumption: "", budget: "", name: "", email: "", phone: "",
  });

  const progress = ((step + 1) / steps.length) * 100;

  const updateField = (field: keyof DiagnosticData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canContinue = () => {
    switch (step) {
      case 0: return data.postalCode.length >= 5;
      case 1: return !!data.housingType;
      case 2: return !!data.roofType;
      case 3: return !!data.orientation;
      case 4: return !!data.surface;
      case 5: return !!data.consumption;
      case 6: return !!data.budget;
      case 7: return data.name.length > 0 && data.email.includes("@") && data.phone.length >= 10;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate("/resultats", { state: { diagnostic: data } });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="postal" className="text-base">Votre code postal</Label>
            <Input
              id="postal"
              placeholder="Ex : 75001"
              value={data.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="text-2xl h-16 text-center font-bold rounded-xl tracking-widest"
            />
          </div>
        );
      case 1:
        return (
          <div className="grid gap-4 sm:grid-cols-3">
            {housingTypes.map((t) => (
              <OptionCard key={t.value} label={t.value} emoji={t.emoji} selected={data.housingType === t.value} onClick={() => updateField("housingType", t.value)} />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {roofTypes.map((t) => (
              <OptionCard key={t.value} label={t.value} emoji={t.emoji} selected={data.roofType === t.value} onClick={() => updateField("roofType", t.value)} />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid gap-4 sm:grid-cols-3">
            {orientations.map((o) => (
              <OptionCard key={o.value} label={o.value} emoji={o.emoji} selected={data.orientation === o.value} onClick={() => updateField("orientation", o.value)} />
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {surfaces.map((s) => (
              <OptionCard key={s} label={s} selected={data.surface === s} onClick={() => updateField("surface", s)} />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {consumptions.map((c) => (
              <OptionCard key={c} label={c} selected={data.consumption === c} onClick={() => updateField("consumption", c)} />
            ))}
          </div>
        );
      case 6:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {budgets.map((b) => (
              <OptionCard key={b} label={b} selected={data.budget === b} onClick={() => updateField("budget", b)} />
            ))}
          </div>
        );
      case 7:
        return (
          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-base">Nom complet</Label>
              <Input id="name" placeholder="Jean Dupont" value={data.name} onChange={(e) => updateField("name", e.target.value)} className="h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input id="email" type="email" placeholder="jean@exemple.fr" value={data.email} onChange={(e) => updateField("email", e.target.value)} className="h-12 rounded-xl text-base" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-base">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="06 12 34 56 78" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} className="h-12 rounded-xl text-base" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {/* Fun background blobs */}
        <div className="absolute top-20 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -right-32 h-64 w-64 rounded-full bg-solar-purple/5 blur-3xl" />

        <div className="container max-w-2xl py-12 relative z-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {steps[step].emoji} {steps[step].title}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {step + 1}/{steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-3 rounded-full" />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-0 shadow-xl rounded-3xl">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold font-display mb-1">{steps[step].description}</h2>
                  </div>
                  {renderStep()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              className="rounded-full gap-2 px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {step === steps.length - 1 ? "Voir mes résultats 🎉" : "Suivant"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagnostic;
