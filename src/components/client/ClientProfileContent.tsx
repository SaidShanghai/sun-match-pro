import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ClipboardList, FileText, Calendar, LogOut, Sun } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ClientProfileContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
                <Sun className="w-4 h-4" />
                Mon Espace NOORIA
              </div>
              <h1 className="text-3xl font-bold">Mon Profil</h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Info compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-primary" />
                Mes informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">Email :</span> {user?.email}</p>
                <p><span className="font-medium text-foreground">Membre depuis :</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/diagnostic")}>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Nouveau diagnostic</p>
                  <p className="text-xs text-muted-foreground mt-1">Lancer une nouvelle analyse solaire</p>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-60 cursor-not-allowed">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Mes devis</p>
                  <p className="text-xs text-muted-foreground mt-1">Suivi de vos demandes</p>
                </div>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Bientôt</span>
              </CardContent>
            </Card>

            <Card className="opacity-60 cursor-not-allowed">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Mes rendez-vous</p>
                  <p className="text-xs text-muted-foreground mt-1">Gérer vos RDV installateurs</p>
                </div>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Bientôt</span>
              </CardContent>
            </Card>
          </div>

          {/* CTA diagnostic */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-8 text-center space-y-4">
              <Sun className="w-10 h-10 text-primary mx-auto" />
              <div>
                <p className="font-semibold">Prêt à économiser sur vos factures ?</p>
                <p className="text-sm text-muted-foreground mt-1">Lancez votre diagnostic solaire personnalisé en moins de 3 minutes.</p>
              </div>
              <Button onClick={() => navigate("/diagnostic")}>
                Lancer mon diagnostic
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientProfileContent;
