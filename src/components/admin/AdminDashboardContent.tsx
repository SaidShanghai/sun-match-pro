import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Loader2, ShieldCheck, LogOut, Building2, Mail, Phone, MapPin,
  FileText, Package, Users, Plus, Trash2, Edit, X, CheckCircle2,
  Star, Clock, BarChart3, AlertCircle, Pause, Ban, Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackagesManager from "@/components/admin/PackagesManager";
import QuoteRequestsManager from "@/components/admin/QuoteRequestsManager";
import BlogManager from "@/components/admin/BlogManager";

const moroccoRegions: Record<string, string[]> = {
  "Casablanca-Settat": ["Casablanca", "Mohammedia", "Settat", "Berrechid", "El Jadida", "Benslimane", "Médiouna"],
  "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Témara", "Skhirate", "Khémisset"],
  "Marrakech-Safi": ["Marrakech", "Safi", "Essaouira", "El Kelâa des Sraghna", "Youssoufia", "Chichaoua"],
  "Fès-Meknès": ["Fès", "Meknès", "Taza", "Ifrane", "Sefrou", "Moulay Yacoub"],
  "Tanger-Tétouan-Al Hoceïma": ["Tanger", "Tétouan", "Al Hoceïma", "Larache", "Chefchaouen", "Ouezzane"],
  "Souss-Massa": ["Agadir", "Inezgane", "Tiznit", "Taroudant", "Chtouka Aït Baha", "Tata"],
  "Oriental": ["Oujda", "Nador", "Berkane", "Taourirt", "Jerada", "Driouch"],
  "Béni Mellal-Khénifra": ["Béni Mellal", "Khouribga", "Khénifra", "Fquih Ben Salah", "Azilal"],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Tinghir", "Zagora", "Midelt"],
  "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa-Zag"],
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour", "Tarfaya", "Es-Semara"],
  "Dakhla-Oued Ed-Dahab": ["Dakhla", "Aousserd"],
};

const allCities = Object.values(moroccoRegions).flat();

interface CompanyRow {
  id: string;
  name: string;
  ice: string;
  city: string;
  phone: string;
  email: string;
  certifications: string[] | null;
  service_areas: string[] | null;
  created_at: string;
  projects_assigned: number;
  projects_completed: number;
  projects_in_progress: number;
  quality_score: number | null;
  avg_execution_days: number | null;
  operational_status: string;
  status_changed_at: string | null;
  admin_notes: string | null;
}

const AdminDashboardContent = () => {
  const { isAdmin, loading: adminLoading, user } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formIce, setFormIce] = useState("");
  const [formCity, setFormCity] = useState("Casablanca");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCertifications, setFormCertifications] = useState("");
  const [formServiceAreas, setFormServiceAreas] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [formProjectsAssigned, setFormProjectsAssigned] = useState(0);
  const [formProjectsCompleted, setFormProjectsCompleted] = useState(0);
  const [formProjectsInProgress, setFormProjectsInProgress] = useState(0);
  const [formQualityScore, setFormQualityScore] = useState("");
  const [formAvgExecutionDays, setFormAvgExecutionDays] = useState("");
  const [formOperationalStatus, setFormOperationalStatus] = useState("actif");
  const [formAdminNotes, setFormAdminNotes] = useState("");

  useEffect(() => {
    if (adminLoading) return;
    if (!user) navigate("/profil");
    else if (!isAdmin) navigate("/profil");
  }, [adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchCompanies();
  }, [isAdmin]);

  const fetchCompanies = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("companies")
      .select("id, name, ice, city, phone, email, certifications, service_areas, created_at, projects_assigned, projects_completed, projects_in_progress, quality_score, avg_execution_days, operational_status, status_changed_at, admin_notes")
      .order("created_at", { ascending: false });
    if (!error && data) setCompanies(data);
    setLoadingData(false);
  };

  const resetForm = () => {
    setFormName(""); setFormIce(""); setFormCity("Casablanca");
    setFormPhone(""); setFormEmail(""); setFormCertifications("");
    setFormServiceAreas([]); setSelectedRegion(""); setEditingCompany(null);
    setFormProjectsAssigned(0); setFormProjectsCompleted(0); setFormProjectsInProgress(0);
    setFormQualityScore(""); setFormAvgExecutionDays(""); setFormOperationalStatus("actif");
    setFormAdminNotes("");
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (c: CompanyRow) => {
    setEditingCompany(c);
    setFormName(c.name);
    setFormIce(c.ice);
    setFormCity(c.city);
    setFormPhone(c.phone);
    setFormEmail(c.email);
    setFormCertifications((c.certifications || []).join(", "));
    setFormServiceAreas(c.service_areas || []);
    setFormProjectsAssigned(c.projects_assigned);
    setFormProjectsCompleted(c.projects_completed);
    setFormProjectsInProgress(c.projects_in_progress);
    setFormQualityScore(c.quality_score != null ? String(c.quality_score) : "");
    setFormAvgExecutionDays(c.avg_execution_days != null ? String(c.avg_execution_days) : "");
    setFormOperationalStatus(c.operational_status);
    setFormAdminNotes(c.admin_notes || "");
    setShowAddDialog(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const payload: Record<string, any> = {
      name: formName.trim(),
      ice: formIce.trim(),
      city: formCity,
      phone: formPhone.trim(),
      email: formEmail.trim(),
      certifications: formCertifications.split(",").map(c => c.trim()).filter(Boolean),
      service_areas: formServiceAreas,
      projects_assigned: formProjectsAssigned,
      projects_completed: formProjectsCompleted,
      projects_in_progress: formProjectsInProgress,
      quality_score: formQualityScore ? parseFloat(formQualityScore) : null,
      avg_execution_days: formAvgExecutionDays ? parseInt(formAvgExecutionDays) : null,
      operational_status: formOperationalStatus,
      admin_notes: formAdminNotes.trim() || null,
    };
    // Update status_changed_at if status changed
    if (editingCompany && editingCompany.operational_status !== formOperationalStatus) {
      payload.status_changed_at = new Date().toISOString();
    }

    try {
      if (editingCompany) {
        const { error } = await supabase.from("companies").update(payload).eq("id", editingCompany.id);
        if (error) throw error;
        toast({ title: "Partenaire modifié" });
      } else {
        // Admin creates company directly — uses admin's user_id and creates a stub profile
        const { data: profile, error: profileError } = await supabase
          .from("partner_profiles")
          .insert({ user_id: user.id, status: "approved", setup_complete: false, email: formEmail.trim() })
          .select("id")
          .single();
        if (profileError) throw profileError;

        const { error } = await supabase.from("companies").insert({
          ...payload,
          user_id: user.id,
          profile_id: profile.id,
        } as any);
        if (error) throw error;
        toast({ title: "Partenaire ajouté" });
      }
      setShowAddDialog(false);
      resetForm();
      await fetchCompanies();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    setDeleting(id);
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Partenaire supprimé" });
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
    setDeleting(null);
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const formValid = formName.trim() && /^\d{15}$/.test(formIce) && formCity && formPhone.trim() && formEmail.trim();

  if (adminLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

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
            <TabsList className="grid w-full grid-cols-4 h-11">
              <TabsTrigger value="packages" className="gap-2">
                <Package className="w-4 h-4" />Packages
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2">
                <FileText className="w-4 h-4" />Devis
              </TabsTrigger>
              <TabsTrigger value="partners" className="gap-2">
                <Users className="w-4 h-4" />Partenaires
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="w-4 h-4" />Blog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="mt-6">
              <PackagesManager />
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              <QuoteRequestsManager />
            </TabsContent>

            {/* Partenaires — gestion directe */}
            <TabsContent value="partners" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Partenaires installateurs
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {companies.length} partenaire{companies.length !== 1 ? "s" : ""} enregistré{companies.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button onClick={openAddDialog} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un partenaire
                  </Button>
                </div>

                {companies.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Aucun partenaire enregistré. Cliquez sur "Ajouter un partenaire" pour commencer.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {companies.map(c => (
                      <Card key={c.id}>
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg">{c.name}</h3>
                                <Badge variant="secondary" className="text-xs">ICE: {c.ice}</Badge>
                                <StatusBadge status={c.operational_status} />
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{c.city}</div>
                                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{c.phone}</div>
                                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{c.email}</div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-3.5 h-3.5" />
                                  {(c.certifications || []).length > 0 ? c.certifications!.join(", ") : "Aucune certification"}
                                </div>
                              </div>
                              {/* Tracking KPIs */}
                              <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                  <span className="font-semibold">{c.projects_assigned}</span> assigné{c.projects_assigned !== 1 ? "s" : ""}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="font-semibold">{c.projects_in_progress}</span> en cours
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                  <span className="font-semibold">{c.projects_completed}</span> terminé{c.projects_completed !== 1 ? "s" : ""}
                                </div>
                                {c.quality_score != null && (
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                                    <span className="font-semibold">{c.quality_score}</span>/5
                                  </div>
                                )}
                                {c.avg_execution_days != null && (
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="font-semibold">{c.avg_execution_days}</span> jours moy.
                                  </div>
                                )}
                              </div>
                              {(c.service_areas || []).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="text-xs text-muted-foreground font-medium">Zones :</span>
                                  {c.service_areas!.map(zone => (
                                    <Badge key={zone} variant="outline" className="text-xs">{zone}</Badge>
                                  ))}
                                </div>
                              )}
                              {c.admin_notes && (
                                <p className="text-xs text-muted-foreground italic mt-1 bg-muted/50 rounded px-2 py-1">
                                  📝 {c.admin_notes}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" variant="outline" onClick={() => openEditDialog(c)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(c.id)}
                                disabled={deleting === c.id}
                              >
                                {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <BlogManager />
            </TabsContent>
          </Tabs>

          {/* Dialog ajout/modification partenaire */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {editingCompany ? "Modifier le partenaire" : "Ajouter un partenaire"}
                </DialogTitle>
                <DialogDescription>
                  {editingCompany ? "Modifiez les informations du partenaire." : "Remplissez les informations de l'installateur à ajouter."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de l'entreprise *</Label>
                    <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Solar Maroc SARL" required />
                  </div>
                  <div className="space-y-2">
                    <Label>ICE (15 chiffres) *</Label>
                    <Input value={formIce} onChange={e => setFormIce(e.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="001234567000089" required minLength={15} maxLength={15} />
                    {formIce.length > 0 && formIce.length < 15 && (
                      <p className="text-xs text-destructive">{formIce.length}/15 chiffres</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Ville *</Label>
                    <select value={formCity} onChange={e => setFormCity(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                      {allCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+212 6XX XXX XXX" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Email *</Label>
                    <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="contact@solaire.ma" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Certifications (séparées par des virgules)</Label>
                    <Input value={formCertifications} onChange={e => setFormCertifications(e.target.value)} placeholder="RGE, QualiPV, ISO 9001" />
                  </div>
                </div>

                {/* Zones d'intervention */}
                <div className="space-y-2">
                  <Label>Zones d'intervention</Label>
                  <div className="flex gap-2">
                    <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="">-- Région --</option>
                      {Object.keys(moroccoRegions).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select
                      disabled={!selectedRegion}
                      onChange={e => {
                        const val = e.target.value;
                        if (val && !formServiceAreas.includes(val)) setFormServiceAreas([...formServiceAreas, val]);
                        e.target.value = "";
                      }}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                    >
                      <option value="">-- Ville --</option>
                      {selectedRegion && moroccoRegions[selectedRegion]?.map(c => (
                        <option key={c} value={c} disabled={formServiceAreas.includes(c)}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {selectedRegion && (
                    <Button type="button" variant="outline" size="sm" className="text-xs mt-1" onClick={() => {
                      const regionCities = moroccoRegions[selectedRegion] || [];
                      const newAreas = [...new Set([...formServiceAreas, ...regionCities])];
                      setFormServiceAreas(newAreas);
                    }}>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Ajouter toute la région
                    </Button>
                  )}
                  {formServiceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formServiceAreas.map(zone => (
                        <Badge key={zone} variant="secondary" className="text-xs gap-1 pr-1">
                          {zone}
                          <button type="button" onClick={() => setFormServiceAreas(formServiceAreas.filter(z => z !== zone))} className="ml-0.5 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      <button type="button" onClick={() => setFormServiceAreas([])} className="text-xs text-destructive hover:underline ml-1">
                        Tout effacer
                      </button>
                    </div>
                  )}
                </div>

                {/* Suivi opérationnel */}
                <div className="space-y-3 pt-2 border-t">
                  <Label className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Suivi opérationnel</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Projets assignés</Label>
                      <Input type="number" min={0} value={formProjectsAssigned} onChange={e => setFormProjectsAssigned(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">En cours</Label>
                      <Input type="number" min={0} value={formProjectsInProgress} onChange={e => setFormProjectsInProgress(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Terminés</Label>
                      <Input type="number" min={0} value={formProjectsCompleted} onChange={e => setFormProjectsCompleted(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Score qualité (/5)</Label>
                      <Input type="number" min={0} max={5} step={0.1} value={formQualityScore} onChange={e => setFormQualityScore(e.target.value)} placeholder="—" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Délai moyen (jours)</Label>
                      <Input type="number" min={0} value={formAvgExecutionDays} onChange={e => setFormAvgExecutionDays(e.target.value)} placeholder="—" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Statut</Label>
                      <select value={formOperationalStatus} onChange={e => setFormOperationalStatus(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                        <option value="actif">✅ Actif</option>
                        <option value="suspendu">⏸️ Suspendu</option>
                        <option value="en_pause">🔸 En pause</option>
                        <option value="blackliste">🚫 Blacklisté</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Notes internes</Label>
                    <textarea
                      value={formAdminNotes}
                      onChange={e => setFormAdminNotes(e.target.value)}
                      placeholder="Remarques privées sur ce partenaire..."
                      className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Annuler</Button>
                  <Button type="submit" disabled={!formValid || saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {editingCompany ? "Enregistrer" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  actif: { label: "Actif", className: "border-green-500 text-green-600 bg-green-500/10" },
  suspendu: { label: "Suspendu", className: "border-amber-500 text-amber-600 bg-amber-500/10" },
  en_pause: { label: "En pause", className: "border-muted-foreground text-muted-foreground bg-muted" },
  blackliste: { label: "Blacklisté", className: "border-destructive text-destructive bg-destructive/10" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.actif;
  return <Badge variant="outline" className={`text-[10px] ${config.className}`}>{config.label}</Badge>;
};

export default AdminDashboardContent;
