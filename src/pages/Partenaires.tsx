import { useState } from "react";
import { Building2, Plus, Package, Zap, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Partenaires = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Espace Partenaires</h1>
            <p className="text-muted-foreground text-lg">
              Gérez vos produits, kits solaires et tarifs pour alimenter les diagnostics NOORIA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Kits Solaires</h3>
                <p className="text-muted-foreground text-sm">Ajoutez et gérez vos kits toiture & au sol</p>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Tarification</h3>
                <p className="text-muted-foreground text-sm">Définissez vos prix et promotions</p>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Mon Entreprise</h3>
                <p className="text-muted-foreground text-sm">Profil, certifications et zones d'intervention</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Cette section sera bientôt connectée à une base de données pour gérer vos produits en temps réel.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partenaires;
