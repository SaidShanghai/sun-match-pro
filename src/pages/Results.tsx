import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Star, MapPin, Shield, ArrowRight, CheckCircle, Zap, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock installers for demo
const mockInstallers = [
  {
    id: 1, name: "SunTech Solutions", rating: 4.8, reviews: 127, city: "Paris",
    specialties: ["Résidentiel", "Autoconsommation"], priceRange: "8 000 - 12 000 €",
    certifications: ["RGE", "QualiPV"], yearsExp: 12,
  },
  {
    id: 2, name: "ÉcoSolaire France", rating: 4.6, reviews: 89, city: "Lyon",
    specialties: ["Résidentiel", "Batteries"], priceRange: "9 000 - 14 000 €",
    certifications: ["RGE", "QualiPV", "Qualibat"], yearsExp: 8,
  },
  {
    id: 3, name: "GreenPower Install", rating: 4.9, reviews: 203, city: "Marseille",
    specialties: ["Résidentiel", "Commercial", "Autoconsommation"], priceRange: "7 500 - 11 000 €",
    certifications: ["RGE", "QualiPV"], yearsExp: 15,
  },
  {
    id: 4, name: "Solaris Énergie", rating: 4.5, reviews: 64, city: "Bordeaux",
    specialties: ["Résidentiel", "Autoconsommation", "Batteries"], priceRange: "8 500 - 13 000 €",
    certifications: ["RGE"], yearsExp: 6,
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

  // Simple estimation based on diagnostic
  const estimatedPower = diagnostic?.surface?.includes("100") ? "9 kWc" : diagnostic?.surface?.includes("60") ? "6 kWc" : "3 kWc";
  const estimatedSavings = diagnostic?.consumption?.includes("20 000") ? "2 800 €/an" : diagnostic?.consumption?.includes("15 000") ? "2 100 €/an" : "1 200 €/an";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12">
          {/* Solar profile summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-8 border-0 bg-gradient-to-r from-primary/10 to-accent/10 shadow-lg">
              <CardContent className="p-8">
                <h1 className="mb-6 text-2xl font-bold md:text-3xl">Votre profil solaire</h1>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Sun className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Puissance recommandée</div>
                      <div className="text-xl font-bold">{estimatedPower}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <PiggyBank className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Économies estimées</div>
                      <div className="text-xl font-bold">{estimatedSavings}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Orientation</div>
                      <div className="text-xl font-bold">{diagnostic?.orientation || "Sud"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Compare bar */}
          {compareList.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-sm font-medium">
                    {compareList.length} installateur(s) sélectionné(s) pour comparaison
                  </span>
                  <Button size="sm" disabled={compareList.length < 2}>
                    Comparer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Installer list */}
          <h2 className="mb-6 text-xl font-bold">Installateurs recommandés</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {mockInstallers.map((installer, i) => (
              <motion.div
                key={installer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{installer.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {installer.city}
                          <span>·</span>
                          <span>{installer.yearsExp} ans d'expérience</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-solar-gold text-solar-gold" />
                        <span className="font-semibold">{installer.rating}</span>
                        <span className="text-sm text-muted-foreground">({installer.reviews})</span>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {installer.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                      {installer.certifications.map((c) => (
                        <div key={c} className="flex items-center gap-1 text-xs text-primary">
                          <Shield className="h-3.5 w-3.5" />
                          {c}
                        </div>
                      ))}
                    </div>

                    <div className="mb-4 text-sm">
                      <span className="text-muted-foreground">Fourchette de prix : </span>
                      <span className="font-semibold">{installer.priceRange}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2" size="sm">
                        Demander un devis <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant={compareList.includes(installer.id) ? "default" : "outline"}
                        size="sm"
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
