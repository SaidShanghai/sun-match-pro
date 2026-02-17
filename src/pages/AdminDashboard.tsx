import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock, ShieldCheck, LogOut, Building2, Mail, Phone, MapPin, FileText, FileCheck, CreditCard, Package, Truck, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DocDetail {
  id: string;
  doc_type: string;
  file_path: string;
  file_name: string;
  validated: boolean;
}

interface PartnerRequest {
  id: string;
  user_id: string;
  status: string;
  setup_complete: boolean;
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
  docs: { rc: boolean; modele_j: boolean; cotisations: boolean };
  docDetails: DocDetail[];
  hasKits: boolean;
  hasTarifs: boolean;
}

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading, user } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partners, setPartners] = useState<PartnerRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading) return;
    console.log("[AdminDashboard] adminLoading:", adminLoading, "isAdmin:", isAdmin, "user:", user?.id);
    if (!user) {
      navigate("/auth-partenaires");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPartners();
  }, [isAdmin]);

  const fetchPartners = async () => {
    setLoadingData(true);
    const { data: profiles, error } = await supabase
      .from("partner_profiles")
      .select("id, user_id, status, created_at, email, setup_complete")
      .order("created_at", { ascending: false });

    if (error || !profiles) {
      setLoadingData(false);
      return;
    }

    const enriched: PartnerRequest[] = await Promise.all(
      profiles.map(async (p) => {
        const [companyRes, docsRes, kitsRes, tarifsRes] = await Promise.all([
          supabase.from("companies").select("name, ice, city, phone, email, certifications, service_areas").eq("user_id", p.user_id).maybeSingle(),
          supabase.from("partner_documents").select("id, doc_type, file_path, file_name, validated").eq("user_id", p.user_id),
          supabase.from("kits").select("id", { count: "exact", head: true }).eq("user_id", p.user_id).eq("is_active", true),
          supabase.from("delivery_costs").select("id", { count: "exact", head: true }).eq("user_id", p.user_id),
        ]);

        const docDetails: DocDetail[] = (docsRes.data || []) as DocDetail[];
        const docTypes = docDetails.map((d) => d.doc_type);

        return {
          ...p,
          setup_complete: (p as any).setup_complete ?? false,
          user_email: (p as any).email,
          company: companyRes.data,
          docs: {
            rc: docTypes.includes("rc"),
            modele_j: docTypes.includes("modele_j"),
            cotisations: docTypes.includes("cotisations"),
          },
          docDetails,
          hasKits: (kitsRes.count ?? 0) > 0,
          hasTarifs: (tarifsRes.count ?? 0) > 0,
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

  const handleDownloadDoc = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("partner-documents")
      .download(filePath);

    if (error || !data) {
      toast({ title: "Erreur", description: "Impossible de télécharger le fichier.", variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleCotisations = async (partnerUserId: string, docDetails: DocDetail[]) => {
    const existingDoc = docDetails.find((d) => d.doc_type === "cotisations");
    if (existingDoc) {
      await handleValidateDoc(existingDoc.id, true);
    } else {
      // Create a cotisations record directly (no file needed)
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", partnerUserId)
        .maybeSingle();

      if (!company) {
        toast({ title: "Erreur", description: "Entreprise introuvable.", variant: "destructive" });
        return;
      }

      const { data: newDoc, error } = await supabase
        .from("partner_documents")
        .insert({
          user_id: partnerUserId,
          company_id: company.id,
          doc_type: "cotisations",
          file_path: "",
          file_name: "cotisations-admin",
          validated: true,
        })
        .select("id, doc_type, file_path, file_name, validated")
        .single();

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Cotisations marquées à jour" });
      setPartners((prev) =>
        prev.map((p) =>
          p.user_id === partnerUserId
            ? { ...p, docDetails: [...p.docDetails, newDoc as DocDetail] }
            : p
        )
      );
    }
  };

  const handleValidateDoc = async (docId: string, validated: boolean) => {
    const { error } = await supabase
      .from("partner_documents")
      .update({ validated })
      .eq("id", docId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: validated ? "Document validé" : "Document invalidé" });
    setPartners((prev) =>
      prev.map((p) => ({
        ...p,
        docDetails: p.docDetails.map((d) => (d.id === docId ? { ...d, validated } : d)),
      }))
    );
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

  const isFullyComplete = (p: PartnerRequest) =>
    !!p.company && p.hasKits && p.hasTarifs &&
    p.docDetails.some((d) => d.doc_type === "rc" && d.validated) &&
    p.docDetails.some((d) => d.doc_type === "modele_j" && d.validated) &&
    p.docDetails.some((d) => d.doc_type === "cotisations" && d.validated);

  const pending = partners.filter((p) => p.status === "pending");
  const credited = partners.filter((p) => p.status === "approved" && isFullyComplete(p));
  const approved = partners.filter((p) => p.status === "approved" && !isFullyComplete(p));
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
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
                <div className="text-3xl font-bold text-blue-500">{credited.length}</div>
                <p className="text-sm text-muted-foreground">Crédités</p>
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
                  onDownloadDoc={handleDownloadDoc}
                   onValidateDoc={handleValidateDoc}
                   onToggleCotisations={handleToggleCotisations}
                />
              ))}
            </div>
          )}

          {/* Approved (incomplete) */}
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
                  onDownloadDoc={handleDownloadDoc}
                   onValidateDoc={handleValidateDoc}
                   onToggleCotisations={handleToggleCotisations}
                />
              ))}
            </div>
          )}

          {/* Credited (fully complete) */}
          {credited.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Partenaires crédités ({credited.length})
              </h2>
              {credited.map((p) => (
                <PartnerCard
                  key={p.id}
                  partner={p}
                  updating={updating}
                  onApprove={() => updateStatus(p.id, "approved")}
                  onReject={() => updateStatus(p.id, "rejected")}
                  onDownloadDoc={handleDownloadDoc}
                   onValidateDoc={handleValidateDoc}
                   onToggleCotisations={handleToggleCotisations}
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
                  onDownloadDoc={handleDownloadDoc}
                   onValidateDoc={handleValidateDoc}
                   onToggleCotisations={handleToggleCotisations}
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

const DOC_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  rc: { label: "RC", icon: <FileText className="w-3.5 h-3.5" /> },
  modele_j: { label: "Modèle J", icon: <FileCheck className="w-3.5 h-3.5" /> },
  cotisations: { label: "Cotisations", icon: <CreditCard className="w-3.5 h-3.5" /> },
};

const PartnerCard = ({
  partner,
  updating,
  onApprove,
  onReject,
  onDownloadDoc,
  onValidateDoc,
  onToggleCotisations,
}: {
  partner: PartnerRequest;
  updating: string | null;
  onApprove: () => void;
  onReject: () => void;
  onDownloadDoc: (filePath: string, fileName: string) => void;
  onValidateDoc: (docId: string, validated: boolean) => void;
  onToggleCotisations: (userId: string, docDetails: DocDetail[]) => void;
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

            {partner.user_email && (
              <p className="text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                {partner.user_email}
              </p>
            )}

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

            {/* Validation indicators */}
            {partner.status === "approved" && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">État du profil</p>
                <div className="flex flex-wrap gap-2">
                  <ValidationBadge done={!!partner.company} label="Entreprise" icon={<Building2 className="w-3 h-3" />} />
                  <ValidationBadge done={partner.hasKits} label="Kits" icon={<Package className="w-3 h-3" />} />
                  <ValidationBadge done={partner.hasTarifs} label="Tarifs" icon={<Truck className="w-3 h-3" />} />
                </div>

                {/* Documents with download/validate */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3">Documents justificatifs</p>
                <div className="space-y-1.5">
                  {(["rc", "modele_j"] as const).map((docType) => {
                    const doc = partner.docDetails.find((d) => d.doc_type === docType);
                    const config = DOC_LABELS[docType];
                    return (
                      <div key={docType} className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${
                          doc?.validated
                            ? "bg-green-500/10 text-green-700 border-green-500/20"
                            : doc
                            ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}>
                          {config.icon}
                          {config.label}
                          {doc?.validated ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : doc ? (
                            <Clock className="w-2.5 h-2.5" />
                          ) : (
                            <XCircle className="w-2.5 h-2.5" />
                          )}
                        </span>
                        {doc && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[10px]"
                              onClick={() => onDownloadDoc(doc.file_path, doc.file_name)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Télécharger
                            </Button>
                            {!doc.validated ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[10px] border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => onValidateDoc(doc.id, true)}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Valider
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[10px] border-amber-500 text-amber-600 hover:bg-amber-50"
                                onClick={() => onValidateDoc(doc.id, false)}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Invalider
                              </Button>
                            )}
                          </div>
                        )}
                        {!doc && (
                          <span className="text-[10px] text-muted-foreground italic">Non envoyé</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Cotisations - admin toggle */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const cotisDoc = partner.docDetails.find((d) => d.doc_type === "cotisations");
                      const isValid = cotisDoc?.validated ?? false;
                      return (
                        <>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${
                            isValid
                              ? "bg-green-500/10 text-green-700 border-green-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}>
                            <CreditCard className="w-3.5 h-3.5" />
                            Cotisations
                            {isValid ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          </span>
                          {isValid ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-[10px] border-amber-500 text-amber-600 hover:bg-amber-50"
                              onClick={() => {
                                if (cotisDoc) onValidateDoc(cotisDoc.id, false);
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Marquer non à jour
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-[10px] border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => onToggleCotisations(partner.user_id, partner.docDetails)}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Marquer à jour
                            </Button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
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

const ValidationBadge = ({ done, label, icon }: { done: boolean; label: string; icon: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${
    done
      ? "bg-green-500/10 text-green-700 border-green-500/20"
      : "bg-red-500/10 text-red-600 border-red-500/20"
  }`}>
    {icon}
    {label}
    {done ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
  </span>
);

export default AdminDashboard;
