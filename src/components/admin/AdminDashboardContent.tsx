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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackagesManager from "@/components/admin/PackagesManager";
import QuoteRequestsManager from "@/components/admin/QuoteRequestsManager";

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
      .select("id, name, ice, city, phone, email, certifications, service_areas, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setCompanies(data);
    setLoadingData(false);
  };

  const resetForm = () => {
    setFormName(""); setFormIce(""); setFormCity("Casablanca");
    setFormPhone(""); setFormEmail(""); setFormCertifications("");
    setFormServiceAreas([]); setSelectedRegion(""); setEditingCompany(null);
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
    setShowAddDialog(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const payload = {
      name: formName.trim(),
      ice: formIce.trim(),
      city: formCity,
      phone: formPhone.trim(),
      email: formEmail.trim(),
      certifications: formCertifications.split(",").map(c => c.trim()).filter(Boolean),
      service_areas: formServiceAreas,
    };

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
        });
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
                              {(c.service_areas || []).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="text-xs text-muted-foreground font-medium">Zones :</span>
                                  {c.service_areas!.map(zone => (
                                    <Badge key={zone} variant="outline" className="text-xs">{zone}</Badge>
                                  ))}
                                </div>
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

export default AdminDashboardContent;
