import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Home, Layers, Compass, Ruler, Zap, Wallet, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  { icon: MapPin, title: "Localisation", description: "Où se situe votre logement ?" },
  { icon: Home, title: "Type de logement", description: "Quel est votre type de logement ?" },
  { icon: Layers, title: "Type de toiture", description: "Quel type de toiture avez-vous ?" },
  { icon: Compass, title: "Orientation", description: "Quelle est l'orientation de votre toit ?" },
  { icon: Ruler, title: "Surface", description: "Quelle surface de toiture est disponible ?" },
  { icon: Zap, title: "Consommation", description: "Quelle est votre consommation électrique ?" },
  { icon: Wallet, title: "Budget", description: "Quel budget envisagez-vous ?" },
  { icon: User, title: "Coordonnées", description: "Vos informations pour recevoir les devis" },
];

const housingTypes = ["Maison individuelle", "Appartement", "Immeuble"];
const roofTypes = ["Tuiles", "Ardoises", "Bac acier", "Toit plat"];
const orientations = ["Sud", "Sud-Est", "Sud-Ouest", "Est", "Ouest", "Nord"];
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

const OptionCard = ({ value, label, selected, onClick }: { value: string; label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border-2 p-4 text-left text-sm font-medium transition-all ${
      selected
        ? "border-primary bg-primary/5 text-foreground"
        : "border-border bg-background text-muted-foreground hover:border-primary/40"
    }`}
  >
    {label}
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
  const StepIcon = steps[step].icon;

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
    else {
      // Navigate to results with diagnostic data
      navigate("/resultats", { state: { diagnostic: data } });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="postal">Code postal</Label>
            <Input
              id="postal"
              placeholder="Ex : 75001"
              value={data.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="text-lg"
            />
          </div>
        );
      case 1:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {housingTypes.map((t) => (
              <OptionCard key={t} value={t} label={t} selected={data.housingType === t} onClick={() => updateField("housingType", t)} />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {roofTypes.map((t) => (
              <OptionCard key={t} value={t} label={t} selected={data.roofType === t} onClick={() => updateField("roofType", t)} />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {orientations.map((o) => (
              <OptionCard key={o} value={o} label={o} selected={data.orientation === o} onClick={() => updateField("orientation", o)} />
            ))}
          </div>
        );
      case 4:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {surfaces.map((s) => (
              <OptionCard key={s} value={s} label={s} selected={data.surface === s} onClick={() => updateField("surface", s)} />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {consumptions.map((c) => (
              <OptionCard key={c} value={c} label={c} selected={data.consumption === c} onClick={() => updateField("consumption", c)} />
            ))}
          </div>
        );
      case 6:
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            {budgets.map((b) => (
              <OptionCard key={b} value={b} label={b} selected={data.budget === b} onClick={() => updateField("budget", b)} />
            ))}
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Jean Dupont" value={data.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jean@exemple.fr" value={data.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="06 12 34 56 78" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container max-w-2xl py-12">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Étape {step + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <StepIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{steps[step].title}</h2>
                      <p className="text-sm text-muted-foreground">{steps[step].description}</p>
                    </div>
                  </div>
                  {renderStep()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button onClick={handleNext} disabled={!canContinue()}>
              {step === steps.length - 1 ? "Voir les résultats" : "Suivant"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagnostic;
