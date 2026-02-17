import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Package, Zap, ShieldAlert, Lock, ArrowRight, AlertTriangle, Loader2, LogOut, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const Partenaires = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<"none" | "entreprise">("none");
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [entrepriseRegistered, setEntrepriseRegistered] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<"pending" | "approved" | "rejected">("pending");

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [ice, setIce] = useState("");
  const [certifications, setCertifications] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!adminLoading && isAdmin) {
      navigate("/admin");
    }
  }, [adminLoading, isAdmin, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth-partenaires");
    }
  }, [authLoading, user, navigate]);

  // Check partner status and company
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Check approval status
      const { data: profile } = await supabase
        .from("partner_profiles")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.status) {
        setPartnerStatus(profile.status as "pending" | "approved" | "rejected");
      }

      // Check company only if approved
      if (profile?.status === "approved") {
        const { data } = await supabase
          .from("companies")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (data) {
          setEntrepriseRegistered(true);
          setCompanyName(data.name);
          setIce(data.ice);
          setCertifications((data.certifications || []).join(", "));
          setCity(data.city);
          setServiceAreas(data.service_areas || []);
          setPhone(data.phone);
          setCompanyEmail(data.email);
          setOriginalValues({
            companyName: data.name,
            ice: data.ice,
            certifications: (data.certifications || []).join(", "),
            city: data.city,
            serviceAreas: JSON.stringify(data.service_areas || []),
            phone: data.phone,
            companyEmail: data.email,
          });
        }
      }
      setLoadingCompany(false);
    };
    fetchData();
  }, [user]);

  const handleCardClick = (section: "entreprise" | "kits" | "tarifs") => {
    if (section !== "entreprise" && !entrepriseRegistered) {
      setShowLockedDialog(true);
      return;
    }
    if (section === "entreprise") {
      setActiveSection("entreprise");
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      // Get profile
      const { data: profile } = await supabase
        .from("partner_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profil introuvable");

      const companyData = {
        user_id: user.id,
        profile_id: profile.id,
        name: companyName.trim(),
        ice: ice.trim(),
        certifications: certifications.split(",").map((c) => c.trim()).filter(Boolean),
        city,
        service_areas: serviceAreas,
        phone: phone.trim(),
        email: companyEmail.trim(),
      };

      if (entrepriseRegistered) {
        const { error } = await supabase
          .from("companies")
          .update(companyData)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("companies").insert(companyData);
        if (error) throw error;
      }

      setEntrepriseRegistered(true);
      setActiveSection("none");
      toast({ title: "Entreprise enregistrée", description: "Vos informations ont été sauvegardées." });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingCompany) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const formValid = companyName.trim() && /^\d{15}$/.test(ice) && city && phone.trim() && companyEmail.trim();

  const hasChanges = !entrepriseRegistered || (
    companyName !== originalValues.companyName ||
    ice !== originalValues.ice ||
    certifications !== originalValues.certifications ||
    city !== originalValues.city ||
    JSON.stringify(serviceAreas) !== originalValues.serviceAreas ||
    phone !== originalValues.phone ||
    companyEmail !== originalValues.companyEmail
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
                <ShieldAlert className="w-4 h-4" />
                Accès sécurisé partenaires
              </div>
              <h1 className="text-4xl font-bold">Espace Partenaires</h1>
              <p className="text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium ${entrepriseRegistered ? "bg-green-500/10 text-green-600" : "bg-primary text-primary-foreground"}`}>
              {entrepriseRegistered && <CheckCircle2 className="w-3 h-3" />}
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

          {partnerStatus === "pending" ? (
            <Card className="border-2 border-amber-500/30 bg-amber-500/5">
              <CardContent className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold">Inscription en attente de validation</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Votre demande d'inscription a bien été reçue. Un administrateur NOORIA va examiner votre candidature et vous recevrez un email de confirmation une fois approuvé.
                </p>
                <div className="bg-muted/50 rounded-xl p-4 max-w-sm mx-auto">
                  <p className="text-xs text-muted-foreground">Délai de traitement habituel : <strong>24 à 48h</strong></p>
                </div>
              </CardContent>
            </Card>
          ) : partnerStatus === "rejected" ? (
            <Card className="border-2 border-destructive/30 bg-destructive/5">
              <CardContent className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Inscription refusée</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Votre demande d'inscription n'a pas été approuvée. Veuillez contacter l'équipe NOORIA pour plus d'informations.
                </p>
              </CardContent>
            </Card>
          ) : activeSection === "entreprise" ? (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSaveCompany} className="space-y-5">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {entrepriseRegistered ? "Modifier mon entreprise" : "Enregistrer mon entreprise"}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                      <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Solar Maroc SARL" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ice">ICE (Identifiant Commun de l'Entreprise) *</Label>
                      <Input id="ice" value={ice} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 15); setIce(v); }} placeholder="001234567000089" required minLength={15} maxLength={15} pattern="\d{15}" title="L'ICE doit contenir exactement 15 chiffres" />
                      {ice.length > 0 && ice.length < 15 && (
                        <p className="text-xs text-destructive">L'ICE doit contenir exactement 15 chiffres ({ice.length}/15)</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (séparées par des virgules)</Label>
                      <Input id="certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="RGE, QualiPV, ISO 9001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                        required
                      >
                        {allCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Zones d'intervention</Label>
                      <div className="flex gap-2">
                        <select
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">-- Choisir une région --</option>
                          {Object.keys(moroccoRegions).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <select
                          disabled={!selectedRegion}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !serviceAreas.includes(val)) {
                              setServiceAreas([...serviceAreas, val]);
                            }
                            e.target.value = "";
                          }}
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                        >
                          <option value="">-- Choisir une ville --</option>
                          {selectedRegion && moroccoRegions[selectedRegion]?.filter((c) => !serviceAreas.includes(c)).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      {serviceAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {serviceAreas.map((area) => (
                            <span
                              key={area}
                              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {area}
                              <button
                                type="button"
                                onClick={() => setServiceAreas(serviceAreas.filter((a) => a !== area))}
                                className="hover:text-destructive ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6XX XXX XXX" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companyEmail">Email professionnel *</Label>
                      <Input id="companyEmail" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="contact@solarmaroc.ma" required />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setActiveSection("none")}>
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving || !formValid || (entrepriseRegistered && !hasChanges)}
                      className={entrepriseRegistered ? "bg-[hsl(24_95%_53%)] hover:bg-[hsl(24_95%_45%)] text-white" : ""}
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {entrepriseRegistered ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Cards */
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                onClick={() => handleCardClick("entreprise")}
                className="border-2 border-primary/30 hover:border-primary transition-colors cursor-pointer group relative overflow-hidden"
              >
                {entrepriseRegistered && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ATTENTE CERTIFICATION
                    </span>
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLÉTÉ
                    </span>
                  </div>
                )}
                {!entrepriseRegistered && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ÉTAPE 1
                  </div>
                )}
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Mon Entreprise</h3>
                  <p className="text-muted-foreground text-sm">Profil, certifications et zones d'intervention</p>
                </CardContent>
              </Card>

              <Card
                onClick={() => handleCardClick("kits")}
                className={`border-2 transition-colors cursor-pointer group relative overflow-hidden ${entrepriseRegistered ? "border-dashed hover:border-primary/50" : "border-muted opacity-60"}`}
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

              <Card
                onClick={() => handleCardClick("tarifs")}
                className={`border-2 transition-colors cursor-pointer group relative overflow-hidden ${entrepriseRegistered ? "border-dashed hover:border-primary/50" : "border-muted opacity-60"}`}
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
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              🔒 {entrepriseRegistered ? "Votre entreprise est enregistrée. Vous pouvez maintenant gérer vos kits et tarifs." : "Inscription entreprise obligatoire avant d'accéder aux kits et à la tarification."}
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
                <DialogDescription className="mt-1">Inscription entreprise requise</DialogDescription>
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
                setActiveSection("entreprise");
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
