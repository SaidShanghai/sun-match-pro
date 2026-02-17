import { Sun, ClipboardCheck, BarChart3, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const explanations = [
  {
    icon: ClipboardCheck,
    title: "Qu'est-ce qu'un diagnostic solaire ?",
    description:
      "Un diagnostic solaire est une étude personnalisée qui évalue le potentiel de votre habitation pour l'installation de panneaux photovoltaïques. Il prend en compte votre localisation, votre toiture, votre consommation et votre budget.",
  },
  {
    icon: Sun,
    title: "Comment ça fonctionne ?",
    description:
      "Notre outil analyse plusieurs critères clés : l'ensoleillement de votre région, l'orientation et l'inclinaison de votre toit, la surface disponible et votre consommation électrique actuelle. Ces données permettent d'estimer la production solaire optimale pour votre projet.",
  },
  {
    icon: BarChart3,
    title: "Que contiennent les résultats ?",
    description:
      "À l'issue du diagnostic, vous recevez une estimation de la puissance recommandée, de la production annuelle attendue, des économies réalisables sur votre facture et du retour sur investissement. Vous êtes ensuite mis en relation avec des installateurs certifiés proches de chez vous.",
  },
  {
    icon: Shield,
    title: "Pourquoi nous faire confiance ?",
    description:
      "Nous travaillons exclusivement avec des installateurs vérifiés et certifiés. Chaque partenaire est soumis à un processus de validation rigoureux incluant la vérification de ses documents légaux, de ses certifications et de ses références.",
  },
];

const Diagnostic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <div className="absolute top-20 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -right-32 h-64 w-64 rounded-full bg-solar-purple/5 blur-3xl" />

        <div className="container max-w-3xl py-16 relative z-10">
          <div className="text-center mb-12">
            <span className="text-5xl mb-4 block">☀️</span>
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
              Le Diagnostic Solaire
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Découvrez comment notre diagnostic vous aide à faire le meilleur choix pour votre installation solaire.
            </p>
          </div>

          <div className="space-y-6">
            {explanations.map(({ icon: Icon, title, description }, i) => (
              <Card key={i} className="border-0 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-8 flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display mb-2 text-foreground">{title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Le diagnostic sera bientôt disponible en ligne. En attendant, contactez-nous pour une étude personnalisée.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diagnostic;
