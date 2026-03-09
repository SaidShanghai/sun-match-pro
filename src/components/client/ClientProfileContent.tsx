import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ClipboardList, FileText, Calendar, Sun, Loader2, MapPin, Zap, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type QuoteRequest = {
  id: string;
  created_at: string;
  status: string;
  city: string | null;
  project_type: string | null;
  annual_consumption: string | null;
  objectif: string | null;
  housing_type: string | null;
  adresse_projet: string | null;
  ville_projet: string | null;
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Nouveau", variant: "default" },
  in_progress: { label: "En cours", variant: "secondary" },
  completed: { label: "Traité", variant: "outline" },
  cancelled: { label: "Annulé", variant: "destructive" },
};

const ClientProfileContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [diagnostics, setDiagnostics] = useState<QuoteRequest[]>([]);
  const [loadingDiag, setLoadingDiag] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchDiagnostics = async () => {
      const { data } = await supabase
        .from("quote_requests")
        .select("id, created_at, status, city, project_type, annual_consumption, objectif, housing_type, adresse_projet, ville_projet")
        .eq("client_email", user.email)
        .order("created_at", { ascending: false });
      setDiagnostics(data || []);
      setLoadingDiag(false);
    };
    fetchDiagnostics();
  }, [user?.email]);

  return (
    <>
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
              <Sun className="w-4 h-4" />
              Mon Espace SOLARBOX
            </div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
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

          {/* Mes diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="w-4 h-4 text-primary" />
                Mes diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingDiag ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : diagnostics.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-muted-foreground">Aucun diagnostic pour le moment.</p>
                  <Button size="sm" onClick={() => navigate("/diagnostic")}>
                    Lancer mon premier diagnostic
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {diagnostics.map((d) => {
                    const st = statusLabels[d.status] || statusLabels.new;
                    return (
                      <div key={d.id} className="flex items-start justify-between border rounded-lg p-4 gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            
                            <span className="text-sm font-medium">
                              {d.project_type === "Entreprise" ? "Entreprise" : "Résidentiel"}
                            </span>
                            <Badge variant={st.variant} className="text-[10px]">{st.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            {(d.ville_projet || d.city) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {d.ville_projet || d.city}
                              </span>
                            )}
                            {d.annual_consumption && (
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {d.annual_consumption}
                              </span>
                            )}
                            {d.housing_type && (
                              <span className="flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                {d.housing_type}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(d.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

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
    </>
  );
};

export default ClientProfileContent;
