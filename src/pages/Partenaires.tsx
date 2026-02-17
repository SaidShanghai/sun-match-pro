import { useState } from "react";
import { Building2, Package, Zap, ShieldAlert, Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Partenaires = () => {
  const [activeSection, setActiveSection] = useState<"none" | "entreprise" | "kits" | "tarifs">("none");
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [entrepriseRegistered] = useState(false); // sera connecté à la BDD plus tard

  const handleCardClick = (section: "entreprise" | "kits" | "tarifs") => {
    if (section !== "entreprise" && !entrepriseRegistered) {
      setShowLockedDialog(true);
      return;
    }
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
              <ShieldAlert className="w-4 h-4" />
              Accès sécurisé partenaires
            </div>
            <h1 className="text-4xl font-bold">Espace Partenaires</h1>
            <p className="text-muted-foreground text-lg">
              Gérez vos produits, kits solaires et tarifs pour alimenter les diagnostics NOORIA.
            </p>
          </div>

          {/* Étapes */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium ${!entrepriseRegistered ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1. Mon Entreprise
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium ${entrepriseRegistered ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2. Kits Solaires
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full font-medium bg-muted">
              3. Tarification
            </span>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mon Entreprise - toujours accessible */}
            <Card
              onClick={() => handleCardClick("entreprise")}
              className="border-2 border-primary/30 hover:border-primary transition-colors cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                ÉTAPE 1
              </div>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Mon Entreprise</h3>
                <p className="text-muted-foreground text-sm">Profil, certifications et zones d'intervention</p>
              </CardContent>
            </Card>

            {/* Kits Solaires - verrouillé */}
            <Card
              onClick={() => handleCardClick("kits")}
              className={`border-2 transition-colors cursor-pointer group relative overflow-hidden ${
                entrepriseRegistered
                  ? "border-dashed hover:border-primary/50"
                  : "border-muted opacity-60"
              }`}
            >
              {!entrepriseRegistered && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Kits Solaires</h3>
                <p className="text-muted-foreground text-sm">Ajoutez et gérez vos kits toiture & au sol</p>
              </CardContent>
            </Card>

            {/* Tarification - verrouillé */}
            <Card
              onClick={() => handleCardClick("tarifs")}
              className={`border-2 transition-colors cursor-pointer group relative overflow-hidden ${
                entrepriseRegistered
                  ? "border-dashed hover:border-primary/50"
                  : "border-muted opacity-60"
              }`}
            >
              {!entrepriseRegistered && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Tarification</h3>
                <p className="text-muted-foreground text-sm">Définissez vos prix et promotions</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              🔒 Inscription entreprise obligatoire avant d'accéder aux kits et à la tarification.
            </p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Dialog verrouillé */}
      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <DialogTitle>Accès restreint</DialogTitle>
                <DialogDescription className="mt-1">
                  Inscription entreprise requise
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pour accéder aux <strong>Kits Solaires</strong> et à la <strong>Tarification</strong>, 
              vous devez d'abord enregistrer votre entreprise en tant que partenaire NOORIA.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Pourquoi cette étape ?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Vérification de vos certifications professionnelles</li>
                <li>• Validation de vos zones d'intervention</li>
                <li>• Sécurisation de l'accès à la plateforme</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                setShowLockedDialog(false);
                handleCardClick("entreprise");
              }}
              className="w-full"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Enregistrer mon entreprise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Partenaires;
