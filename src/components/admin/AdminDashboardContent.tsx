import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, CheckCircle2, XCircle, Clock, ShieldCheck, LogOut,
  Building2, Mail, Phone, MapPin, FileText, FileCheck, CreditCard,
  Package, Truck, Download, Users, LayoutDashboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackagesManager from "@/components/admin/PackagesManager";
import QuoteRequestsManager from "@/components/admin/QuoteRequestsManager";

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
  cotisations_a_jour: boolean;
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
  docs: { rc: boolean; modele_j: boolean };
  docDetails: DocDetail[];
  hasKits: boolean;
  hasTarifs: boolean;
}

const AdminDashboardContent = () => {
  const { isAdmin, loading: adminLoading, user } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partners, setPartners] = useState<PartnerRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading) return;
    if (!user) navigate("/profil");
    else if (!isAdmin) navigate("/profil");
  }, [adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPartners();
  }, [isAdmin]);

  const fetchPartners = async () => {
    setLoadingData(true);
    const { data: profiles, error } = await supabase
      .from("partner_profiles")
      .select("id, user_id, status, created_at, email, setup_complete, cotisations_a_jour")
      .order("created_at", { ascending: false });

    if (error || !profiles) { setLoadingData(false); return; }

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
          cotisations_a_jour: (p as any).cotisations_a_jour ?? false,
          user_email: (p as any).email,
          company: companyRes.data,
          docs: { rc: docTypes.includes("rc"), modele_j: docTypes.includes("modele_j") },
          docDetails: docDetails.filter((d) => d.doc_type !== "cotisations"),
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
    const { error } = await supabase.from("partner_profiles").update({ status: newStatus }).eq("id", profileId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newStatus === "approved" ? "Partenaire approuvé" : "Partenaire refusé" });
      setPartners((prev) => prev.map((p) => (p.id === profileId ? { ...p, status: newStatus } : p)));
    }
    setUpdating(null);
  };

  const handleDownloadDoc = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from("partner-documents").download(filePath);
    if (error || !data) { toast({ title: "Erreur", description: "Impossible de télécharger.", variant: "destructive" }); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a"); a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleCotisations = async (profileId: string, currentValue: boolean) => {
    const newValue = !currentValue;
    const { error } = await supabase.from("partner_profiles").update({ cotisations_a_jour: newValue }).eq("id", profileId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: newValue ? "Cotisations à jour" : "Cotisations non à jour" });
    setPartners((prev) => prev.map((p) => (p.id === profileId ? { ...p, cotisations_a_jour: newValue } : p)));
  };

  const handleValidateDoc = async (docId: string, validated: boolean) => {
    const { error } = await supabase.from("partner_documents").update({ validated }).eq("id", docId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: validated ? "Document validé" : "Document invalidé" });
    setPartners((prev) => prev.map((p) => ({ ...p, docDetails: p.docDetails.map((d) => (d.id === docId ? { ...d, validated } : d)) })));
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (adminLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const isFullyComplete = (p: PartnerRequest) =>
    !!p.company && p.hasKits && p.hasTarifs && p.cotisations_a_jour &&
    p.docDetails.some((d) => d.doc_type === "rc" && d.validated) &&
    p.docDetails.some((d) => d.doc_type === "modele_j" && d.validated);

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
                Administration NOORIA
              </div>
              <h1 className="text-4xl font-bold">Tableau de Bord</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />Déconnexion
              </Button>
            </div>
          </div>

          {/* Onglets principaux */}
          <Tabs defaultValue="packages">
            <TabsList className="grid w-full grid-cols-3 h-11">
              <TabsTrigger value="packages" className="gap-2">
                <Package className="w-4 h-4" />Packages & Prix
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2">
                <FileText className="w-4 h-4" />Demandes de devis
              </TabsTrigger>
              <TabsTrigger value="partners" className="gap-2">
                <Users className="w-4 h-4" />Partenaires
              </TabsTrigger>
            </TabsList>

            {/* Axe 1 — Packages */}
            <TabsContent value="packages" className="mt-6">
              <PackagesManager />
            </TabsContent>

            {/* Axe 2 — Devis */}
            <TabsContent value="quotes" className="mt-6">
              <QuoteRequestsManager />
            </TabsContent>

            {/* Partenaires (existant) */}
            <TabsContent value="partners" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gestion des Partenaires
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Approuvez ou refusez les demandes d'inscription</p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { count: pending.length, label: "En attente", color: "text-amber-500" },
                    { count: approved.length, label: "Approuvés", color: "text-green-500" },
                    { count: credited.length, label: "Crédités", color: "text-blue-500" },
                    { count: rejected.length, label: "Refusés", color: "text-destructive" },
                  ].map((s) => (
                    <Card key={s.label}><CardContent className="py-4 text-center"><div className={`text-3xl font-bold ${s.color}`}>{s.count}</div><p className="text-sm text-muted-foreground">{s.label}</p></CardContent></Card>
                  ))}
                </div>

                {pending.length > 0 && <PartnerSection title="En attente" icon={<Clock className="w-5 h-5 text-amber-500" />} partners={pending} updating={updating} onApprove={(id) => updateStatus(id, "approved")} onReject={(id) => updateStatus(id, "rejected")} onDownloadDoc={handleDownloadDoc} onValidateDoc={handleValidateDoc} onToggleCotisations={handleToggleCotisations} />}
                {approved.length > 0 && <PartnerSection title="Approuvés" icon={<CheckCircle2 className="w-5 h-5 text-green-500" />} partners={approved} updating={updating} onApprove={(id) => updateStatus(id, "approved")} onReject={(id) => updateStatus(id, "rejected")} onDownloadDoc={handleDownloadDoc} onValidateDoc={handleValidateDoc} onToggleCotisations={handleToggleCotisations} />}
                {credited.length > 0 && <PartnerSection title="Crédités" icon={<ShieldCheck className="w-5 h-5 text-blue-500" />} partners={credited} updating={updating} onApprove={(id) => updateStatus(id, "approved")} onReject={(id) => updateStatus(id, "rejected")} onDownloadDoc={handleDownloadDoc} onValidateDoc={handleValidateDoc} onToggleCotisations={handleToggleCotisations} />}
                {rejected.length > 0 && <PartnerSection title="Refusés" icon={<XCircle className="w-5 h-5 text-destructive" />} partners={rejected} updating={updating} onApprove={(id) => updateStatus(id, "approved")} onReject={(id) => updateStatus(id, "rejected")} onDownloadDoc={handleDownloadDoc} onValidateDoc={handleValidateDoc} onToggleCotisations={handleToggleCotisations} />}
                {partners.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">Aucune demande de partenaire.</CardContent></Card>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// ─── Partner Section ─────────────────────────────────────────
const PartnerSection = ({ title, icon, partners, updating, onApprove, onReject, onDownloadDoc, onValidateDoc, onToggleCotisations }: {
  title: string; icon: React.ReactNode; partners: PartnerRequest[]; updating: string | null;
  onApprove: (id: string) => void; onReject: (id: string) => void;
  onDownloadDoc: (fp: string, fn: string) => void;
  onValidateDoc: (id: string, v: boolean) => void;
  onToggleCotisations: (id: string, v: boolean) => void;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">{icon}{title} ({partners.length})</h2>
    {partners.map((p) => (
      <PartnerCard key={p.id} partner={p} updating={updating}
        onApprove={() => onApprove(p.id)} onReject={() => onReject(p.id)}
        onDownloadDoc={onDownloadDoc} onValidateDoc={onValidateDoc} onToggleCotisations={onToggleCotisations} />
    ))}
  </div>
);

const DOC_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  rc: { label: "RC", icon: <FileText className="w-3.5 h-3.5" /> },
  modele_j: { label: "Modèle J", icon: <FileCheck className="w-3.5 h-3.5" /> },
};

const PartnerCard = ({ partner, updating, onApprove, onReject, onDownloadDoc, onValidateDoc, onToggleCotisations }: {
  partner: PartnerRequest; updating: string | null;
  onApprove: () => void; onReject: () => void;
  onDownloadDoc: (fp: string, fn: string) => void;
  onValidateDoc: (id: string, v: boolean) => void;
  onToggleCotisations: (id: string, v: boolean) => void;
}) => {
  const statusBadge: Record<string, React.ReactNode> = {
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
              {partner.company ? <h3 className="font-semibold text-lg">{partner.company.name}</h3> : <h3 className="font-semibold text-lg text-muted-foreground italic">Entreprise non enregistrée</h3>}
              {statusBadge[partner.status]}
            </div>
            {partner.user_email && <p className="text-sm flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{partner.user_email}</p>}
            <p className="text-xs text-muted-foreground">Inscrit le {new Date(partner.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
            {partner.company && (
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="w-3.5 h-3.5" />ICE: {partner.company.ice}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{partner.company.city}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" />{partner.company.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5" />{partner.company.email}</div>
                {partner.company.certifications?.length ? (
                  <div className="sm:col-span-2 flex flex-wrap gap-1 mt-1">
                    {partner.company.certifications.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                  </div>
                ) : null}
              </div>
            )}
            {partner.status === "approved" && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">État du profil</p>
                <div className="flex flex-wrap gap-2">
                  <ValidationBadge done={!!partner.company} label="Entreprise" icon={<Building2 className="w-3 h-3" />} />
                  <ValidationBadge done={partner.hasKits} label="Kits" icon={<Package className="w-3 h-3" />} />
                  <ValidationBadge done={partner.hasTarifs} label="Tarifs" icon={<Truck className="w-3 h-3" />} />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3">Documents</p>
                <div className="space-y-1.5">
                  {(["rc", "modele_j"] as const).map((docType) => {
                    const doc = partner.docDetails.find((d) => d.doc_type === docType);
                    const config = DOC_LABELS[docType];
                    return (
                      <div key={docType} className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${doc?.validated ? "bg-green-500/10 text-green-700 border-green-500/20" : doc ? "bg-blue-500/10 text-blue-700 border-blue-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
                          {config.icon}{config.label}
                          {doc?.validated ? <CheckCircle2 className="w-2.5 h-2.5" /> : doc ? <Clock className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        </span>
                        {doc ? (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => onDownloadDoc(doc.file_path, doc.file_name)}><Download className="w-3 h-3 mr-1" />Télécharger</Button>
                            {!doc.validated ? (
                              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] border-green-500 text-green-600" onClick={() => onValidateDoc(doc.id, true)}><CheckCircle2 className="w-3 h-3 mr-1" />Valider</Button>
                            ) : (
                              <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] border-amber-500 text-amber-600" onClick={() => onValidateDoc(doc.id, false)}><XCircle className="w-3 h-3 mr-1" />Invalider</Button>
                            )}
                          </div>
                        ) : <span className="text-[10px] text-muted-foreground italic">Non envoyé</span>}
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${partner.cotisations_a_jour ? "bg-green-500/10 text-green-700 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
                      <CreditCard className="w-3.5 h-3.5" />Cotisations{partner.cotisations_a_jour ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                    </span>
                    <Button variant="outline" size="sm" className={`h-6 px-2 text-[10px] ${partner.cotisations_a_jour ? "border-amber-500 text-amber-600" : "border-green-500 text-green-600"}`} onClick={() => onToggleCotisations(partner.id, partner.cotisations_a_jour)}>
                      {partner.cotisations_a_jour ? <><XCircle className="w-3 h-3 mr-1" />Non à jour</> : <><CheckCircle2 className="w-3 h-3 mr-1" />À jour</>}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {partner.status !== "approved" && <Button size="sm" onClick={onApprove} disabled={updating === partner.id}>{updating === partner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}Approuver</Button>}
            {partner.status !== "rejected" && <Button size="sm" variant="destructive" onClick={onReject} disabled={updating === partner.id}>{updating === partner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}Refuser</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ValidationBadge = ({ done, label, icon }: { done: boolean; label: string; icon: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${done ? "bg-green-500/10 text-green-700 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>
    {icon}{label}{done ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
  </span>
);

export default AdminDashboardContent;
