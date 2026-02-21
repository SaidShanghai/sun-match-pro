import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Package, Loader2, Zap, Sun, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PackageRow {
  id: string;
  name: string;
  profile_type: string;
  power_kwc: number;
  price_ttc: number;
  applicable_aids: string[];
  description: string | null;
  is_active: boolean;
  fabricant: string | null;
  modele: string | null;
  specs: Record<string, unknown> | null;
  created_at: string;
}

const AIDS_OPTIONS = ["SR500", "TATWIR", "GEFF", "PPA"];

const PROFILE_LABELS: Record<string, string> = {
  residential: "Résidentiel",
  commercial: "Commercial",
  industrial: "Industriel",
};

const MULTI_OPTIONS = {
  type_systeme: ["on_grid", "off_grid", "hybride"],
  type_client: ["particulier", "pme", "entreprise", "industrie"],
  communication: ["RS485", "Modbus-TCP", "CAN", "4G", "WiFi", "Ethernet"],
  use_cases: ["peak_shaving", "backup", "off_grid", "autoconsommation", "recharge_ev"],
  secteurs_cibles: ["industrie", "data_center", "hotel", "commerce", "agriculture", "residentiel"],
};

const emptySpecs = {
  // Niveau 1
  capacite_kwh: "",
  capacite_utilisable_kwh: "",
  puissance_decharge_jour_kw: "",
  puissance_decharge_nuit_kw: "",
  puissance_charge_kw: "",
  cycle_vie: "",
  duree_vie_ans: "",
  depth_of_discharge: "",
  type_systeme: [] as string[],
  type_client: [] as string[],
  prix_installation_dh: "",
  // Niveau 2
  efficacite_roundtrip: "",
  temp_min_celsius: "",
  temp_max_celsius: "",
  ip_rating: "",
  largeur_mm: "",
  hauteur_mm: "",
  // Niveau 3
  type_batterie: "",
  type_refroidissement: "",
  communication: [] as string[],
  // Métier
  use_cases: [] as string[],
  puissance_min_site_kw: "",
  conso_min_kwh_mois: "",
  secteurs_cibles: [] as string[],
};

type SpecsForm = typeof emptySpecs;

const emptyForm = {
  name: "",
  fabricant: "",
  modele: "",
  profile_type: "industrial",
  power_kwc: "",
  price_ttc: "",
  applicable_aids: [] as string[],
  description: "",
  is_active: true,
  specs: { ...emptySpecs },
};

// ---- Sub-components ----

const MultiToggle = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() =>
            onChange(
              selected.includes(opt)
                ? selected.filter((s) => s !== opt)
                : [...selected, opt]
            )
          }
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            selected.includes(opt)
              ? "bg-primary/10 text-primary border-primary/30"
              : "border-border text-muted-foreground hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const NumField = ({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="space-y-1.5">
    <Label>
      {label}
      {unit && <span className="text-muted-foreground font-normal ml-1">({unit})</span>}
    </Label>
    <Input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// ---- Main Component ----

const PackagesManager = () => {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [ocrLoading, setOcrLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("profile_type")
      .order("power_kwc");
    if (!error) setPackages((data as PackageRow[]) || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleBrochureUpload = async (file: File) => {
    const MAX_SIZE = 4 * 1024 * 1024;
    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!ALLOWED.includes(file.type)) {
      toast({ title: "Format non supporté", description: "JPG, PNG, WebP ou PDF uniquement.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "Fichier trop volumineux", description: "4 Mo maximum.", variant: "destructive" });
      return;
    }
    setOcrLoading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("ocr-brochure", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      if (error || !data?.success) {
        toast({ title: "Erreur d'analyse", description: data?.message || "Impossible de lire la brochure.", variant: "destructive" });
        return;
      }

      const d = data.data;
      const toStr = (v: unknown) => (v !== undefined && v !== null ? String(v) : "");
      const toArr = (v: unknown) => (Array.isArray(v) ? v : []);
      const s = d.specs || {};

      setForm((f) => ({
        ...f,
        name: d.name || f.name,
        fabricant: d.fabricant || f.fabricant,
        modele: d.modele || f.modele,
        profile_type: d.profile_type || f.profile_type,
        power_kwc: d.power_kwc ? String(d.power_kwc) : f.power_kwc,
        price_ttc: d.price_ttc ? String(d.price_ttc) : f.price_ttc,
        description: d.description || f.description,
        specs: {
          capacite_kwh: toStr(s.capacite_kwh) || f.specs.capacite_kwh,
          capacite_utilisable_kwh: toStr(s.capacite_utilisable_kwh) || f.specs.capacite_utilisable_kwh,
          puissance_decharge_jour_kw: toStr(s.puissance_decharge_jour_kw) || f.specs.puissance_decharge_jour_kw,
          puissance_decharge_nuit_kw: toStr(s.puissance_decharge_nuit_kw) || f.specs.puissance_decharge_nuit_kw,
          puissance_charge_kw: toStr(s.puissance_charge_kw) || f.specs.puissance_charge_kw,
          cycle_vie: toStr(s.cycle_vie) || f.specs.cycle_vie,
          duree_vie_ans: toStr(s.duree_vie_ans) || f.specs.duree_vie_ans,
          depth_of_discharge: toStr(s.depth_of_discharge) || f.specs.depth_of_discharge,
          type_systeme: toArr(s.type_systeme).length > 0 ? toArr(s.type_systeme) : f.specs.type_systeme,
          type_client: toArr(s.type_client).length > 0 ? toArr(s.type_client) : f.specs.type_client,
          prix_installation_dh: toStr(s.prix_installation_dh) || f.specs.prix_installation_dh,
          efficacite_roundtrip: toStr(s.efficacite_roundtrip) || f.specs.efficacite_roundtrip,
          temp_min_celsius: toStr(s.temp_min_celsius) || f.specs.temp_min_celsius,
          temp_max_celsius: toStr(s.temp_max_celsius) || f.specs.temp_max_celsius,
          ip_rating: toStr(s.ip_rating) || f.specs.ip_rating,
          largeur_mm: toStr(s.largeur_mm) || f.specs.largeur_mm,
          hauteur_mm: toStr(s.hauteur_mm) || f.specs.hauteur_mm,
          type_batterie: toStr(s.type_batterie) || f.specs.type_batterie,
          type_refroidissement: toStr(s.type_refroidissement) || f.specs.type_refroidissement,
          communication: toArr(s.communication).length > 0 ? toArr(s.communication) : f.specs.communication,
          use_cases: toArr(s.use_cases).length > 0 ? toArr(s.use_cases) : f.specs.use_cases,
          puissance_min_site_kw: toStr(s.puissance_min_site_kw) || f.specs.puissance_min_site_kw,
          conso_min_kwh_mois: toStr(s.conso_min_kwh_mois) || f.specs.conso_min_kwh_mois,
          secteurs_cibles: toArr(s.secteurs_cibles).length > 0 ? toArr(s.secteurs_cibles) : f.specs.secteurs_cibles,
        },
      }));

      toast({ title: "Brochure analysée ✓", description: "Vérifiez et complétez les champs pré-remplis." });
    } catch (err) {
      toast({ title: "Erreur", description: "Échec de l'analyse de la brochure.", variant: "destructive" });
    } finally {
      setOcrLoading(false);
    }
  };

  const openEdit = (pkg: PackageRow) => {
    setEditingId(pkg.id);
    const s = (pkg.specs || {}) as Record<string, unknown>;
    const toStr = (v: unknown) => (v !== undefined && v !== null ? String(v) : "");
    const toArr = (v: unknown) => (Array.isArray(v) ? v : []);
    setForm({
      name: pkg.name,
      fabricant: pkg.fabricant || "",
      modele: pkg.modele || "",
      profile_type: pkg.profile_type,
      power_kwc: String(pkg.power_kwc),
      price_ttc: String(pkg.price_ttc),
      applicable_aids: pkg.applicable_aids || [],
      description: pkg.description || "",
      is_active: pkg.is_active,
      specs: {
        capacite_kwh: toStr(s.capacite_kwh),
        capacite_utilisable_kwh: toStr(s.capacite_utilisable_kwh),
        puissance_decharge_jour_kw: toStr(s.puissance_decharge_jour_kw),
        puissance_decharge_nuit_kw: toStr(s.puissance_decharge_nuit_kw),
        puissance_charge_kw: toStr(s.puissance_charge_kw),
        cycle_vie: toStr(s.cycle_vie),
        duree_vie_ans: toStr(s.duree_vie_ans),
        depth_of_discharge: toStr(s.depth_of_discharge),
        type_systeme: toArr(s.type_systeme),
        type_client: toArr(s.type_client),
        prix_installation_dh: toStr(s.prix_installation_dh),
        efficacite_roundtrip: toStr(s.efficacite_roundtrip),
        temp_min_celsius: toStr(s.temp_min_celsius),
        temp_max_celsius: toStr(s.temp_max_celsius),
        ip_rating: toStr(s.ip_rating),
        largeur_mm: toStr(s.largeur_mm),
        hauteur_mm: toStr(s.hauteur_mm),
        type_batterie: toStr(s.type_batterie),
        type_refroidissement: toStr(s.type_refroidissement),
        communication: toArr(s.communication),
        use_cases: toArr(s.use_cases),
        puissance_min_site_kw: toStr(s.puissance_min_site_kw),
        conso_min_kwh_mois: toStr(s.conso_min_kwh_mois),
        secteurs_cibles: toArr(s.secteurs_cibles),
      },
    });
    setDialogOpen(true);
  };

  const setSpec = (key: keyof SpecsForm, value: unknown) =>
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));

  const handleSave = async () => {
    if (!form.name || !form.price_ttc) {
      toast({ title: "Champs requis", description: "Nom et prix de base sont obligatoires.", variant: "destructive" });
      return;
    }
    setSaving(true);

    // Build specs object (only non-empty values)
    const rawSpecs = form.specs;
    const specs: Record<string, unknown> = {};
    (Object.keys(rawSpecs) as (keyof SpecsForm)[]).forEach((k) => {
      const v = rawSpecs[k];
      if (Array.isArray(v)) { if (v.length > 0) specs[k] = v; }
      else if (v !== "" && v !== undefined) specs[k] = isNaN(Number(v)) ? v : Number(v);
    });

    const payload = {
      name: form.name.trim(),
      fabricant: form.fabricant.trim() || null,
      modele: form.modele.trim() || null,
      profile_type: form.profile_type,
      power_kwc: parseFloat(form.power_kwc) || (specs.capacite_kwh as number) || 0,
      price_ttc: parseFloat(form.price_ttc),
      applicable_aids: form.applicable_aids,
      description: form.description.trim() || null,
      is_active: form.is_active,
      specs,
    };

    const { error } = editingId
      ? await supabase.from("packages").update({ ...payload, specs: specs as import("@/integrations/supabase/types").Json }).eq("id", editingId)
      : await supabase.from("packages").insert([{ ...payload, specs: specs as import("@/integrations/supabase/types").Json }]);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Package mis à jour" : "Package créé" });
      setDialogOpen(false);
      fetchPackages();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce package ?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Package supprimé" });
      setPackages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleAid = (aid: string) =>
    setForm((f) => ({
      ...f,
      applicable_aids: f.applicable_aids.includes(aid)
        ? f.applicable_aids.filter((a) => a !== aid)
        : [...f.applicable_aids, aid],
    }));

  const grouped = packages.reduce<Record<string, PackageRow[]>>((acc, p) => {
    if (!acc[p.profile_type]) acc[p.profile_type] = [];
    acc[p.profile_type].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Catalogue Produits
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez vos offres solaires & stockage par profil
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Sun className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p>Aucun produit créé.</p>
            <p className="text-sm mt-1">Créez votre premier produit solaire ou stockage.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([profileType, pkgs]) => (
          <div key={profileType} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {PROFILE_LABELS[profileType] || profileType}
            </h3>
            <div className="grid gap-3">
              {pkgs.map((pkg) => {
                const s = (pkg.specs || {}) as Record<string, unknown>;
                return (
                  <Card key={pkg.id} className={!pkg.is_active ? "opacity-50" : ""}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{pkg.name}</h4>
                            {pkg.fabricant && (
                              <Badge variant="outline" className="text-[10px]">{pkg.fabricant}</Badge>
                            )}
                            {!pkg.is_active && (
                              <Badge variant="outline" className="text-[10px]">Inactif</Badge>
                            )}
                          </div>
                          {pkg.modele && (
                            <p className="text-xs text-muted-foreground">{pkg.modele}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {s.capacite_kwh && (
                              <span className="flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                {String(s.capacite_kwh)} kWh
                              </span>
                            )}
                            {s.cycle_vie && (
                              <span>{String(s.cycle_vie)} cycles</span>
                            )}
                            <span className="font-semibold text-foreground">
                              {pkg.price_ttc.toLocaleString("fr-MA")} MAD
                            </span>
                            {s.prix_installation_dh && (
                              <span className="text-xs">
                                + {Number(s.prix_installation_dh).toLocaleString("fr-MA")} installation
                              </span>
                            )}
                          </div>
                          {Array.isArray(s.type_systeme) && s.type_systeme.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {(s.type_systeme as string[]).map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                              ))}
                              {Array.isArray(s.use_cases) && (s.use_cases as string[]).map((u) => (
                                <Badge key={u} variant="secondary" className="text-[10px] bg-accent text-accent-foreground">{u}</Badge>
                              ))}
                            </div>
                          )}
                          {pkg.applicable_aids && pkg.applicable_aids.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {pkg.applicable_aids.map((aid) => (
                                <Badge key={aid} variant="secondary" className="text-[10px]">
                                  {aid}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(pkg.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
          </DialogHeader>

          {/* Brochure upload zone */}
          <div className="mt-2 mb-4">
            <label
              htmlFor="brochure-upload"
              className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                ocrLoading
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {ocrLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-primary font-medium">Analyse de la brochure en cours…</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Importer une brochure</span> pour pré-remplir le formulaire (JPG, PNG, PDF)
                  </span>
                </>
              )}
              <input
                id="brochure-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                disabled={ocrLoading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBrochureUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <Tabs defaultValue="general" className="mt-2">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="niveau1">Technique N1</TabsTrigger>
              <TabsTrigger value="niveau2">Technique N2</TabsTrigger>
              <TabsTrigger value="metier">Métier</TabsTrigger>
            </TabsList>

            {/* ── GÉNÉRAL ── */}
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Fabricant</Label>
                  <Input placeholder="Ex: Blue Carbon" value={form.fabricant} onChange={(e) => setForm((f) => ({ ...f, fabricant: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Modèle</Label>
                  <Input placeholder="Ex: 350kWh C&I Cabinet" value={form.modele} onChange={(e) => setForm((f) => ({ ...f, modele: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Nom commercial *</Label>
                <Input placeholder="Ex: Pack Stockage Industrie 350kWh" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Profil cible *</Label>
                  <Select value={form.profile_type} onValueChange={(v) => setForm((f) => ({ ...f, profile_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Résidentiel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industriel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <NumField label="Prix de base" unit="MAD" value={form.price_ttc} onChange={(v) => setForm((f) => ({ ...f, price_ttc: v }))} placeholder="Ex: 850000" />
              </div>
              <NumField label="Prix installation" unit="MAD" value={form.specs.prix_installation_dh} onChange={(v) => setSpec("prix_installation_dh", v)} placeholder="Ex: 50000" />
              <div className="space-y-1.5">
                <Label>Aides d'état applicables</Label>
                <div className="flex gap-2 flex-wrap">
                  {AIDS_OPTIONS.map((aid) => (
                    <button key={aid} type="button" onClick={() => toggleAid(aid)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${form.applicable_aids.includes(aid) ? "bg-green-500/10 text-green-700 border-green-500/30" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {aid}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes internes</Label>
                <Textarea placeholder="Conditions, remarques..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Produit actif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
              </div>
            </TabsContent>

            {/* ── TECHNIQUE NIVEAU 1 (bloquant) ── */}
            <TabsContent value="niveau1" className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">⚡ Énergie & Puissance</p>
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Capacité totale" unit="kWh" value={form.specs.capacite_kwh} onChange={(v) => setSpec("capacite_kwh", v)} placeholder="350" />
                <NumField label="Capacité utilisable" unit="kWh" value={form.specs.capacite_utilisable_kwh} onChange={(v) => setSpec("capacite_utilisable_kwh", v)} placeholder="332.5" />
                <NumField label="Puissance décharge jour" unit="kW" value={form.specs.puissance_decharge_jour_kw} onChange={(v) => setSpec("puissance_decharge_jour_kw", v)} placeholder="430" />
                <NumField label="Puissance décharge nuit" unit="kW" value={form.specs.puissance_decharge_nuit_kw} onChange={(v) => setSpec("puissance_decharge_nuit_kw", v)} placeholder="210" />
                <NumField label="Puissance charge" unit="kW" value={form.specs.puissance_charge_kw} onChange={(v) => setSpec("puissance_charge_kw", v)} placeholder="160" />
                <NumField label="Depth of Discharge" unit="%" value={form.specs.depth_of_discharge} onChange={(v) => setSpec("depth_of_discharge", v)} placeholder="95" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">🔋 Durée de vie</p>
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Cycles de vie" unit="cycles" value={form.specs.cycle_vie} onChange={(v) => setSpec("cycle_vie", v)} placeholder="6600" />
                <NumField label="Durée de vie" unit="ans" value={form.specs.duree_vie_ans} onChange={(v) => setSpec("duree_vie_ans", v)} placeholder="10" />
              </div>
              <MultiToggle label="Type de système" options={MULTI_OPTIONS.type_systeme} selected={form.specs.type_systeme} onChange={(v) => setSpec("type_systeme", v)} />
              <MultiToggle label="Type de client" options={MULTI_OPTIONS.type_client} selected={form.specs.type_client} onChange={(v) => setSpec("type_client", v)} />
            </TabsContent>

            {/* ── TECHNIQUE NIVEAU 2 & 3 ── */}
            <TabsContent value="niveau2" className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">📊 Performances</p>
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Efficacité round-trip" unit="%" value={form.specs.efficacite_roundtrip} onChange={(v) => setSpec("efficacite_roundtrip", v)} placeholder="98.5" />
                <div className="space-y-1.5">
                  <Label>IP Rating</Label>
                  <Input placeholder="Ex: IP55" value={form.specs.ip_rating} onChange={(e) => setSpec("ip_rating", e.target.value)} />
                </div>
                <NumField label="Temp. min" unit="°C" value={form.specs.temp_min_celsius} onChange={(v) => setSpec("temp_min_celsius", v)} placeholder="-30" />
                <NumField label="Temp. max" unit="°C" value={form.specs.temp_max_celsius} onChange={(v) => setSpec("temp_max_celsius", v)} placeholder="50" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">📐 Dimensions</p>
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Largeur" unit="mm" value={form.specs.largeur_mm} onChange={(v) => setSpec("largeur_mm", v)} placeholder="2660" />
                <NumField label="Hauteur" unit="mm" value={form.specs.hauteur_mm} onChange={(v) => setSpec("hauteur_mm", v)} placeholder="2160" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">🔩 Technologie</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Type de batterie</Label>
                  <Select value={form.specs.type_batterie} onValueChange={(v) => setSpec("type_batterie", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LFP">LFP (LiFePO4)</SelectItem>
                      <SelectItem value="NMC">NMC</SelectItem>
                      <SelectItem value="NCA">NCA</SelectItem>
                      <SelectItem value="Lead-Acid">Plomb-acide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Refroidissement</Label>
                  <Select value={form.specs.type_refroidissement} onValueChange={(v) => setSpec("type_refroidissement", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forced_air">Air forcé</SelectItem>
                      <SelectItem value="natural_convection">Convection naturelle</SelectItem>
                      <SelectItem value="liquid">Liquide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <MultiToggle label="Protocoles de communication" options={MULTI_OPTIONS.communication} selected={form.specs.communication} onChange={(v) => setSpec("communication", v)} />
            </TabsContent>

            {/* ── MÉTIER ── */}
            <TabsContent value="metier" className="space-y-4 pt-4">
              <MultiToggle label="Cas d'usage" options={MULTI_OPTIONS.use_cases} selected={form.specs.use_cases} onChange={(v) => setSpec("use_cases", v)} />
              <MultiToggle label="Secteurs cibles" options={MULTI_OPTIONS.secteurs_cibles} selected={form.specs.secteurs_cibles} onChange={(v) => setSpec("secteurs_cibles", v)} />
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Puissance site min." unit="kW" value={form.specs.puissance_min_site_kw} onChange={(v) => setSpec("puissance_min_site_kw", v)} placeholder="100" />
                <NumField label="Conso. min. site" unit="kWh/mois" value={form.specs.conso_min_kwh_mois} onChange={(v) => setSpec("conso_min_kwh_mois", v)} placeholder="15000" />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingId ? "Enregistrer" : "Créer le produit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesManager;
