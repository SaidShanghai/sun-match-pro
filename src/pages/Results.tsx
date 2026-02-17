import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Shield, ArrowRight, CheckCircle, Zap, PiggyBank, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockInstallers = [
  {
    id: 1, name: "SunTech Solutions", rating: 4.8, reviews: 127, city: "Paris",
    specialties: ["Résidentiel", "Autoconsommation"], priceRange: "8 000 - 12 000 €",
    certifications: ["RGE", "QualiPV"], yearsExp: 12, emoji: "🔆",
  },
  {
    id: 2, name: "ÉcoSolaire France", rating: 4.6, reviews: 89, city: "Lyon",
    specialties: ["Résidentiel", "Batteries"], priceRange: "9 000 - 14 000 €",
    certifications: ["RGE", "QualiPV", "Qualibat"], yearsExp: 8, emoji: "🌱",
  },
  {
    id: 3, name: "GreenPower Install", rating: 4.9, reviews: 203, city: "Marseille",
    specialties: ["Résidentiel", "Commercial", "Autoconsommation"], priceRange: "7 500 - 11 000 €",
    certifications: ["RGE", "QualiPV"], yearsExp: 15, emoji: "⚡",
  },
  {
    id: 4, name: "Solaris Énergie", rating: 4.5, reviews: 64, city: "Bordeaux",
    specialties: ["Résidentiel", "Autoconsommation", "Batteries"], priceRange: "8 500 - 13 000 €",
    certifications: ["RGE"], yearsExp: 6, emoji: "☀️",
  },
];

const Results = () => {
  const location = useLocation();
  const diagnostic = location.state?.diagnostic;
  const [compareList, setCompareList] = useState<number[]>([]);

  const toggleCompare = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const estimatedPower = diagnostic?.surface?.includes("100") ? "9 kWc" : diagnostic?.surface?.includes("60") ? "6 kWc" : "3 kWc";
  const estimatedSavings = diagnostic?.consumption?.includes("20 000") ? "2 800 €/an" : diagnostic?.consumption?.includes("15 000") ? "2 100 €/an" : "1 200 €/an";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <div className="absolute top-20 -right-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -left-32 h-64 w-64 rounded-full bg-solar-warm/5 blur-3xl" />

        <div className="container py-12 relative z-10">
          {/* Solar profile summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-10 border-0 rounded-3xl shadow-xl overflow-hidden">
              <div className="gradient-fun p-1">
                <CardContent className="bg-card rounded-[calc(1.5rem-4px)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🎉</span>
                    <h1 className="text-2xl font-bold font-display md:text-3xl">Votre profil solaire</h1>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
                      <span className="text-3xl">☀️</span>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">Puissance recommandée</div>
                        <div className="text-2xl font-bold font-display">{estimatedPower}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
                      <span className="text-3xl">💰</span>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">Économies estimées</div>
                        <div className="text-2xl font-bold font-display">{estimatedSavings}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
                      <span className="text-3xl">🧭</span>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">Orientation</div>
                        <div className="text-2xl font-bold font-display">{diagnostic?.orientation || "Sud"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Compare bar */}
          {compareList.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="border-primary/30 bg-primary/5 rounded-2xl">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-sm font-medium">
                    🔄 {compareList.length} installateur(s) sélectionné(s)
                  </span>
                  <Button size="sm" disabled={compareList.length < 2} className="rounded-full">
                    Comparer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Installer list */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔧</span>
            <h2 className="text-xl font-bold font-display">Installateurs recommandés</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {mockInstallers.map((installer, i) => (
              <motion.div
                key={installer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{installer.emoji}</span>
                        <div>
                          <h3 className="text-lg font-bold font-display">{installer.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {installer.city} · {installer.yearsExp} ans
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-solar-gold/10 px-3 py-1">
                        <Star className="h-3.5 w-3.5 fill-solar-gold text-solar-gold" />
                        <span className="text-sm font-bold">{installer.rating}</span>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {installer.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs rounded-full">{s}</Badge>
                      ))}
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      {installer.certifications.map((c) => (
                        <div key={c} className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Shield className="h-3.5 w-3.5" />
                          {c}
                        </div>
                      ))}
                    </div>

                    <div className="mb-5 text-sm">
                      <span className="text-muted-foreground">Prix indicatif : </span>
                      <span className="font-bold">{installer.priceRange}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2 rounded-full" size="sm">
                        Demander un devis <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant={compareList.includes(installer.id) ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => toggleCompare(installer.id)}
                      >
                        {compareList.includes(installer.id) ? <CheckCircle className="h-4 w-4" /> : "Comparer"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
