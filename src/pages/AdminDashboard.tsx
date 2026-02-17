import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock, ShieldCheck, LogOut, Building2, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PartnerRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  user_email?: string;
  company?: {
    name: string;
    ice: string;
    city: string;
    phone: string;
    email: string;
    certifications: string[] | null;
    service_areas: string[] | null;
  } | null;
}

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading, user } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAdmin() as any;

  const [partners, setPartners] = useState<PartnerRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPartners();
  }, [isAdmin]);

  const fetchPartners = async () => {
    setLoadingData(true);
    const { data: profiles, error } = await supabase
      .from("partner_profiles")
      .select("id, user_id, status, created_at")
      .order("created_at", { ascending: false });

    if (error || !profiles) {
      setLoadingData(false);
      return;
    }

    // Fetch companies for each partner
    const enriched: PartnerRequest[] = await Promise.all(
      profiles.map(async (p) => {
        const { data: company } = await supabase
          .from("companies")
          .select("name, ice, city, phone, email, certifications, service_areas")
          .eq("user_id", p.user_id)
          .maybeSingle();

        // Get user email from auth (via edge function or stored)
        return {
          ...p,
          company,
        };
      })
    );

    setPartners(enriched);
    setLoadingData(false);
  };

  const updateStatus = async (profileId: string, newStatus: "approved" | "rejected") => {
    setUpdating(profileId);
    const { error } = await supabase
      .from("partner_profiles")
      .update({ status: newStatus })
      .eq("id", profileId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: newStatus === "approved" ? "Partenaire approuvé" : "Partenaire refusé",
        description: "Le statut a été mis à jour.",
      });
      setPartners((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, status: newStatus } : p))
      );
    }
    setUpdating(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (adminLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pending = partners.filter((p) => p.status === "pending");
  const approved = partners.filter((p) => p.status === "approved");
  const rejected = partners.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Administration
              </div>
              <h1 className="text-4xl font-bold">Gestion des Partenaires</h1>
              <p className="text-muted-foreground">
                Approuvez ou refusez les demandes d'inscription
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-amber-500">{pending.length}</div>
                <p className="text-sm text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-green-500">{approved.length}</div>
                <p className="text-sm text-muted-foreground">Approuvés</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <div className="text-3xl font-bold text-destructive">{rejected.length}</div>
                <p className="text-sm text-muted-foreground">Refusés</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending requests */}
          {pending.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Demandes en attente ({pending.length})
              </h2>
              {pending.map((p) => (
                <PartnerCard
                  key={p.id}
                  partner={p}
                  updating={updating}
                  onApprove={() => updateStatus(p.id, "approved")}
                  onReject={() => updateStatus(p.id, "rejected")}
                />
              ))}
            </div>
          )}

          {/* Approved */}
          {approved.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Partenaires approuvés ({approved.length})
              </h2>
              {approved.map((p) => (
                <PartnerCard
                  key={p.id}
                  partner={p}
                  updating={updating}
                  onApprove={() => updateStatus(p.id, "approved")}
                  onReject={() => updateStatus(p.id, "rejected")}
                />
              ))}
            </div>
          )}

          {/* Rejected */}
          {rejected.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Partenaires refusés ({rejected.length})
              </h2>
              {rejected.map((p) => (
                <PartnerCard
                  key={p.id}
                  partner={p}
                  updating={updating}
                  onApprove={() => updateStatus(p.id, "approved")}
                  onReject={() => updateStatus(p.id, "rejected")}
                />
              ))}
            </div>
          )}

          {partners.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucune demande de partenaire pour le moment.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PartnerCard = ({
  partner,
  updating,
  onApprove,
  onReject,
}: {
  partner: PartnerRequest;
  updating: string | null;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const statusBadge = {
    pending: <Badge variant="outline" className="border-amber-500 text-amber-500">En attente</Badge>,
    approved: <Badge variant="outline" className="border-green-500 text-green-500">Approuvé</Badge>,
    rejected: <Badge variant="destructive">Refusé</Badge>,
  };

  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              {partner.company ? (
                <h3 className="font-semibold text-lg">{partner.company.name}</h3>
              ) : (
                <h3 className="font-semibold text-lg text-muted-foreground italic">Entreprise non enregistrée</h3>
              )}
              {statusBadge[partner.status as keyof typeof statusBadge]}
            </div>

            <p className="text-xs text-muted-foreground">
              Inscrit le {new Date(partner.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            {partner.company && (
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5" />
                  ICE: {partner.company.ice}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {partner.company.city}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {partner.company.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {partner.company.email}
                </div>
                {partner.company.certifications && partner.company.certifications.length > 0 && (
                  <div className="sm:col-span-2 flex flex-wrap gap-1 mt-1">
                    {partner.company.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            {partner.status !== "approved" && (
              <Button
                size="sm"
                onClick={onApprove}
                disabled={updating === partner.id}
              >
                {updating === partner.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                )}
                Approuver
              </Button>
            )}
            {partner.status !== "rejected" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                disabled={updating === partner.id}
              >
                {updating === partner.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                Refuser
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
