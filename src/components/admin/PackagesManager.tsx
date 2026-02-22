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
import { Plus, Pencil, Trash2, Package, Loader2, Zap, Sun, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PackageRow {
  id: string;
  name: string;
  category: string;
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

const CATEGORY_OPTIONS = [
  { value: "panneaux", label: "🔆 Panneaux solaires" },
  { value: "onduleurs", label: "⚡ Onduleurs (Inverteurs)" },
  { value: "batteries", label: "🔋 Batteries" },
  { value: "solarbox", label: "📦 SolarBox (Onduleur+Batterie)" },
];

const CATEGORY_LABELS: Record<string, string> = {
  panneaux: "🔆 Panneaux solaires",
  onduleurs: "⚡ Onduleurs",
  batteries: "🔋 Batteries",
  solarbox: "📦 SolarBox",
};

const AIDS_OPTIONS = ["SR500", "TATWIR", "GEFF", "PPA"];

const PROFILE_LABELS: Record<string, string> = {
  residential: "Résidentiel",
  commercial: "Commercial",
  industrial: "Industriel",
};

const MULTI_OPTIONS: Record<string, string[]> = {
  type_systeme: ["on_grid", "off_grid", "hybride"],
  type_client: ["particulier", "pme", "entreprise", "industrie"],
  communication: ["RS485", "Modbus-TCP", "CAN", "4G", "WiFi", "Ethernet"],
  use_cases: ["peak_shaving", "backup", "off_grid", "autoconsommation", "recharge_ev"],
  secteurs_cibles: ["industrie", "data_center", "hotel", "commerce", "agriculture", "residentiel"],
  type_cellule: ["monocristallin", "polycristallin", "bifacial", "PERC", "TOPCon", "HJT"],
  type_onduleur: ["string", "micro", "hybride", "central"],
  phases: ["monophasé", "triphasé"],
};

type SpecsForm = Record<string, string | string[]>;

const emptyForm = {
  name: "",
  fabricant: "",
  modele: "",
  category: "panneaux",
  profile_type: "residential",
  power_kwc: "",
  price_ttc: "",
  applicable_aids: [] as string[],
  description: "",
  is_active: true,
  specs: {} as SpecsForm,
};

// ---- Helpers ----
const specStr = (specs: SpecsForm, key: string): string => {
  const v = specs[key];
  return typeof v === "string" ? v : "";
};
const specArr = (specs: SpecsForm, key: string): string[] => {
  const v = specs[key];
  return Array.isArray(v) ? v : [];
};

// ---- Sub-components ----

const MultiToggle = ({
  label, options, selected, onChange, highlighted,
}: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; highlighted?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className={highlighted ? "text-red-600 font-semibold" : ""}>
      {label}
      {highlighted && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
    </Label>
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button key={opt} type="button"
          onClick={() => onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])}
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            selected.includes(opt)
              ? highlighted ? "bg-red-500/10 text-red-700 border-red-500/30" : "bg-primary/10 text-primary border-primary/30"
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
  label, unit, value, onChange, placeholder, highlighted,
}: {
  label: string; unit?: string; value: string; onChange: (v: string) => void; placeholder?: string; highlighted?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className={highlighted ? "text-red-600 font-semibold" : ""}>
      {label}
      {unit && <span className="text-muted-foreground font-normal ml-1">({unit})</span>}
      {highlighted && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
    </Label>
    <Input type="number" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className={highlighted ? "border-red-400 bg-red-50/50 text-red-900" : ""} />
  </div>
);

const TextField = ({
  label, value, onChange, placeholder, highlighted,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; highlighted?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className={highlighted ? "text-red-600 font-semibold" : ""}>
      {label}
      {highlighted && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
    </Label>
    <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      className={highlighted ? "border-red-400 bg-red-50/50 text-red-900" : ""} />
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
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const h = (key: string) => ocrFields.has(key); // shorthand for highlighted

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("packages").select("*").order("category").order("power_kwc");
    if (!error) setPackages((data as PackageRow[]) || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOcrFields(new Set());
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
      const s = d.specs || {};

      // Track OCR-filled fields
      const filled = new Set<string>();
      const topKeys = ["name", "fabricant", "modele", "category", "profile_type", "power_kwc", "price_ttc", "description"];
      topKeys.forEach((k) => { if (d[k]) filled.add(k); });
      Object.keys(s).forEach((k) => {
        const v = s[k];
        if (Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== "") {
          filled.add(`specs.${k}`);
        }
      });
      setOcrFields(filled);

      // Merge specs
      const mergedSpecs: SpecsForm = { ...form.specs };
      Object.keys(s).forEach((k) => {
        const v = s[k];
        if (Array.isArray(v) && v.length > 0) mergedSpecs[k] = v;
        else if (v !== null && v !== undefined && v !== "") mergedSpecs[k] = String(v);
      });

      setForm((f) => ({
        ...f,
        name: d.name || f.name,
        fabricant: d.fabricant || f.fabricant,
        modele: d.modele || f.modele,
        category: d.category || f.category,
        profile_type: d.profile_type || f.profile_type,
        power_kwc: d.power_kwc ? String(d.power_kwc) : f.power_kwc,
        price_ttc: d.price_ttc ? String(d.price_ttc) : f.price_ttc,
        description: d.description || f.description,
        specs: mergedSpecs,
      }));

      toast({ title: "Brochure analysée ✓", description: "Vérifiez et complétez les champs pré-remplis." });
    } catch {
      toast({ title: "Erreur", description: "Échec de l'analyse de la brochure.", variant: "destructive" });
    } finally {
      setOcrLoading(false);
    }
  };

  const openEdit = (pkg: PackageRow) => {
    setEditingId(pkg.id);
    setOcrFields(new Set());
    const raw = (pkg.specs || {}) as Record<string, unknown>;
    const specs: SpecsForm = {};
    Object.keys(raw).forEach((k) => {
      const v = raw[k];
      if (Array.isArray(v)) specs[k] = v.map(String);
      else if (v !== null && v !== undefined) specs[k] = String(v);
    });
    setForm({
      name: pkg.name,
      fabricant: pkg.fabricant || "",
      modele: pkg.modele || "",
      category: pkg.category || "panneaux",
      profile_type: pkg.profile_type,
      power_kwc: String(pkg.power_kwc),
      price_ttc: String(pkg.price_ttc),
      applicable_aids: pkg.applicable_aids || [],
      description: pkg.description || "",
      is_active: pkg.is_active,
      specs,
    });
    setDialogOpen(true);
  };

  const setSpec = (key: string, value: string | string[]) =>
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));

  const handleSave = async () => {
    if (!form.name || !form.price_ttc) {
      toast({ title: "Champs requis", description: "Nom et prix de base sont obligatoires.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const rawSpecs = form.specs;
    const specs: Record<string, unknown> = {};
    Object.keys(rawSpecs).forEach((k) => {
      const v = rawSpecs[k];
      if (Array.isArray(v)) { if (v.length > 0) specs[k] = v; }
      else if (v !== "" && v !== undefined) specs[k] = isNaN(Number(v)) ? v : Number(v);
    });

    const payload = {
      name: form.name.trim(),
      fabricant: form.fabricant.trim() || null,
      modele: form.modele.trim() || null,
      category: form.category,
      profile_type: form.profile_type,
      power_kwc: parseFloat(form.power_kwc) || 0,
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
      applicable_aids: f.applicable_aids.includes(aid) ? f.applicable_aids.filter((a) => a !== aid) : [...f.applicable_aids, aid],
    }));

  const grouped = packages.reduce<Record<string, PackageRow[]>>((acc, p) => {
    const key = p.category || "panneaux";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  // ---- Category-specific technical tabs ----
  const renderTechTabs = () => {
    const cat = form.category;

    if (cat === "panneaux") {
      return (
        <>
          <TabsContent value="tech1" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">☀️ Caractéristiques panneau</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Puissance crête" unit="Wc" value={specStr(form.specs, "puissance_wc")} onChange={(v) => setSpec("puissance_wc", v)} placeholder="550" highlighted={h("specs.puissance_wc")} />
              <NumField label="Rendement" unit="%" value={specStr(form.specs, "rendement")} onChange={(v) => setSpec("rendement", v)} placeholder="22.5" highlighted={h("specs.rendement")} />
              <NumField label="Voc" unit="V" value={specStr(form.specs, "voc")} onChange={(v) => setSpec("voc", v)} placeholder="49.5" highlighted={h("specs.voc")} />
              <NumField label="Isc" unit="A" value={specStr(form.specs, "isc")} onChange={(v) => setSpec("isc", v)} placeholder="14.2" highlighted={h("specs.isc")} />
              <NumField label="Vmp" unit="V" value={specStr(form.specs, "vmp")} onChange={(v) => setSpec("vmp", v)} placeholder="41.7" highlighted={h("specs.vmp")} />
              <NumField label="Imp" unit="A" value={specStr(form.specs, "imp")} onChange={(v) => setSpec("imp", v)} placeholder="13.2" highlighted={h("specs.imp")} />
            </div>
            <MultiToggle label="Type de cellule" options={MULTI_OPTIONS.type_cellule} selected={specArr(form.specs, "type_cellule")} onChange={(v) => setSpec("type_cellule", v)} highlighted={h("specs.type_cellule")} />
          </TabsContent>
          <TabsContent value="tech2" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">📐 Dimensions & Résistance</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Longueur" unit="mm" value={specStr(form.specs, "longueur_mm")} onChange={(v) => setSpec("longueur_mm", v)} placeholder="2278" highlighted={h("specs.longueur_mm")} />
              <NumField label="Largeur" unit="mm" value={specStr(form.specs, "largeur_mm")} onChange={(v) => setSpec("largeur_mm", v)} placeholder="1134" highlighted={h("specs.largeur_mm")} />
              <NumField label="Épaisseur" unit="mm" value={specStr(form.specs, "epaisseur_mm")} onChange={(v) => setSpec("epaisseur_mm", v)} placeholder="30" highlighted={h("specs.epaisseur_mm")} />
              <NumField label="Poids" unit="kg" value={specStr(form.specs, "poids_kg")} onChange={(v) => setSpec("poids_kg", v)} placeholder="27.5" highlighted={h("specs.poids_kg")} />
              <NumField label="Nb cellules" unit="" value={specStr(form.specs, "nb_cellules")} onChange={(v) => setSpec("nb_cellules", v)} placeholder="144" highlighted={h("specs.nb_cellules")} />
              <NumField label="Garantie" unit="ans" value={specStr(form.specs, "garantie_ans")} onChange={(v) => setSpec("garantie_ans", v)} placeholder="25" highlighted={h("specs.garantie_ans")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Coeff. temp. Pmax" unit="%/°C" value={specStr(form.specs, "coeff_temp_pmax")} onChange={(v) => setSpec("coeff_temp_pmax", v)} placeholder="-0.34" highlighted={h("specs.coeff_temp_pmax")} />
              <NumField label="Coeff. temp. Voc" unit="%/°C" value={specStr(form.specs, "coeff_temp_voc")} onChange={(v) => setSpec("coeff_temp_voc", v)} placeholder="-0.25" highlighted={h("specs.coeff_temp_voc")} />
              <NumField label="Temp. min fonct." unit="°C" value={specStr(form.specs, "temp_min_celsius")} onChange={(v) => setSpec("temp_min_celsius", v)} placeholder="-40" highlighted={h("specs.temp_min_celsius")} />
              <NumField label="Temp. max fonct." unit="°C" value={specStr(form.specs, "temp_max_celsius")} onChange={(v) => setSpec("temp_max_celsius", v)} placeholder="85" highlighted={h("specs.temp_max_celsius")} />
            </div>
            <TextField label="IP Rating" value={specStr(form.specs, "ip_rating")} onChange={(v) => setSpec("ip_rating", v)} placeholder="IP68" highlighted={h("specs.ip_rating")} />
          </TabsContent>
        </>
      );
    }

    if (cat === "onduleurs") {
      return (
        <>
          <TabsContent value="tech1" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">⚡ Caractéristiques onduleur</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Puissance nominale" unit="kW" value={specStr(form.specs, "puissance_nominale_kw")} onChange={(v) => setSpec("puissance_nominale_kw", v)} placeholder="10" highlighted={h("specs.puissance_nominale_kw")} />
              <NumField label="Puissance max" unit="kW" value={specStr(form.specs, "puissance_max_kw")} onChange={(v) => setSpec("puissance_max_kw", v)} placeholder="12" highlighted={h("specs.puissance_max_kw")} />
              <NumField label="Nb MPPT" unit="" value={specStr(form.specs, "nb_mppt")} onChange={(v) => setSpec("nb_mppt", v)} placeholder="2" highlighted={h("specs.nb_mppt")} />
              <NumField label="Nb entrées string" unit="" value={specStr(form.specs, "nb_strings")} onChange={(v) => setSpec("nb_strings", v)} placeholder="4" highlighted={h("specs.nb_strings")} />
              <NumField label="Efficacité max" unit="%" value={specStr(form.specs, "efficacite_max")} onChange={(v) => setSpec("efficacite_max", v)} placeholder="98.6" highlighted={h("specs.efficacite_max")} />
              <NumField label="Tension DC max" unit="V" value={specStr(form.specs, "tension_dc_max")} onChange={(v) => setSpec("tension_dc_max", v)} placeholder="1100" highlighted={h("specs.tension_dc_max")} />
            </div>
            <MultiToggle label="Type d'onduleur" options={MULTI_OPTIONS.type_onduleur} selected={specArr(form.specs, "type_onduleur")} onChange={(v) => setSpec("type_onduleur", v)} highlighted={h("specs.type_onduleur")} />
            <MultiToggle label="Phases" options={MULTI_OPTIONS.phases} selected={specArr(form.specs, "phases")} onChange={(v) => setSpec("phases", v)} highlighted={h("specs.phases")} />
          </TabsContent>
          <TabsContent value="tech2" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">📐 Dimensions & Connectique</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Largeur" unit="mm" value={specStr(form.specs, "largeur_mm")} onChange={(v) => setSpec("largeur_mm", v)} placeholder="505" highlighted={h("specs.largeur_mm")} />
              <NumField label="Hauteur" unit="mm" value={specStr(form.specs, "hauteur_mm")} onChange={(v) => setSpec("hauteur_mm", v)} placeholder="470" highlighted={h("specs.hauteur_mm")} />
              <NumField label="Poids" unit="kg" value={specStr(form.specs, "poids_kg")} onChange={(v) => setSpec("poids_kg", v)} placeholder="16" highlighted={h("specs.poids_kg")} />
              <NumField label="Garantie" unit="ans" value={specStr(form.specs, "garantie_ans")} onChange={(v) => setSpec("garantie_ans", v)} placeholder="10" highlighted={h("specs.garantie_ans")} />
            </div>
            <TextField label="IP Rating" value={specStr(form.specs, "ip_rating")} onChange={(v) => setSpec("ip_rating", v)} placeholder="IP65" highlighted={h("specs.ip_rating")} />
            <MultiToggle label="Communication" options={MULTI_OPTIONS.communication} selected={specArr(form.specs, "communication")} onChange={(v) => setSpec("communication", v)} highlighted={h("specs.communication")} />
          </TabsContent>
        </>
      );
    }

    if (cat === "batteries") {
      return (
        <>
          <TabsContent value="tech1" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">🔋 Énergie & Puissance</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Capacité totale" unit="kWh" value={specStr(form.specs, "capacite_kwh")} onChange={(v) => setSpec("capacite_kwh", v)} placeholder="350" highlighted={h("specs.capacite_kwh")} />
              <NumField label="Capacité utilisable" unit="kWh" value={specStr(form.specs, "capacite_utilisable_kwh")} onChange={(v) => setSpec("capacite_utilisable_kwh", v)} placeholder="332.5" highlighted={h("specs.capacite_utilisable_kwh")} />
              <NumField label="Puissance décharge jour" unit="kW" value={specStr(form.specs, "puissance_decharge_jour_kw")} onChange={(v) => setSpec("puissance_decharge_jour_kw", v)} placeholder="430" highlighted={h("specs.puissance_decharge_jour_kw")} />
              <NumField label="Puissance décharge nuit" unit="kW" value={specStr(form.specs, "puissance_decharge_nuit_kw")} onChange={(v) => setSpec("puissance_decharge_nuit_kw", v)} placeholder="210" highlighted={h("specs.puissance_decharge_nuit_kw")} />
              <NumField label="Puissance charge" unit="kW" value={specStr(form.specs, "puissance_charge_kw")} onChange={(v) => setSpec("puissance_charge_kw", v)} placeholder="160" highlighted={h("specs.puissance_charge_kw")} />
              <NumField label="Depth of Discharge" unit="%" value={specStr(form.specs, "depth_of_discharge")} onChange={(v) => setSpec("depth_of_discharge", v)} placeholder="95" highlighted={h("specs.depth_of_discharge")} />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">⏳ Durée de vie</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Cycles de vie" unit="cycles" value={specStr(form.specs, "cycle_vie")} onChange={(v) => setSpec("cycle_vie", v)} placeholder="6600" highlighted={h("specs.cycle_vie")} />
              <NumField label="Durée de vie" unit="ans" value={specStr(form.specs, "duree_vie_ans")} onChange={(v) => setSpec("duree_vie_ans", v)} placeholder="10" highlighted={h("specs.duree_vie_ans")} />
            </div>
            <div className="space-y-1.5">
              <Label className={h("specs.type_batterie") ? "text-red-600 font-semibold" : ""}>
                Type de batterie
                {h("specs.type_batterie") && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
              </Label>
              <Select value={specStr(form.specs, "type_batterie")} onValueChange={(v) => setSpec("type_batterie", v)}>
                <SelectTrigger className={h("specs.type_batterie") ? "border-red-400 bg-red-50/50 text-red-900" : ""}><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LFP">LFP (LiFePO4)</SelectItem>
                  <SelectItem value="NMC">NMC</SelectItem>
                  <SelectItem value="NCA">NCA</SelectItem>
                  <SelectItem value="Lead-Acid">Plomb-acide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="tech2" className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">📊 Performances & Dimensions</p>
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Efficacité round-trip" unit="%" value={specStr(form.specs, "efficacite_roundtrip")} onChange={(v) => setSpec("efficacite_roundtrip", v)} placeholder="98.5" highlighted={h("specs.efficacite_roundtrip")} />
              <TextField label="IP Rating" value={specStr(form.specs, "ip_rating")} onChange={(v) => setSpec("ip_rating", v)} placeholder="IP55" highlighted={h("specs.ip_rating")} />
              <NumField label="Temp. min" unit="°C" value={specStr(form.specs, "temp_min_celsius")} onChange={(v) => setSpec("temp_min_celsius", v)} placeholder="-30" highlighted={h("specs.temp_min_celsius")} />
              <NumField label="Temp. max" unit="°C" value={specStr(form.specs, "temp_max_celsius")} onChange={(v) => setSpec("temp_max_celsius", v)} placeholder="50" highlighted={h("specs.temp_max_celsius")} />
              <NumField label="Largeur" unit="mm" value={specStr(form.specs, "largeur_mm")} onChange={(v) => setSpec("largeur_mm", v)} placeholder="2660" highlighted={h("specs.largeur_mm")} />
              <NumField label="Hauteur" unit="mm" value={specStr(form.specs, "hauteur_mm")} onChange={(v) => setSpec("hauteur_mm", v)} placeholder="2160" highlighted={h("specs.hauteur_mm")} />
            </div>
            <div className="space-y-1.5">
              <Label className={h("specs.type_refroidissement") ? "text-red-600 font-semibold" : ""}>
                Refroidissement
                {h("specs.type_refroidissement") && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
              </Label>
              <Select value={specStr(form.specs, "type_refroidissement")} onValueChange={(v) => setSpec("type_refroidissement", v)}>
                <SelectTrigger className={h("specs.type_refroidissement") ? "border-red-400 bg-red-50/50 text-red-900" : ""}><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="forced_air">Air forcé</SelectItem>
                  <SelectItem value="natural_convection">Convection naturelle</SelectItem>
                  <SelectItem value="liquid">Liquide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <MultiToggle label="Communication" options={MULTI_OPTIONS.communication} selected={specArr(form.specs, "communication")} onChange={(v) => setSpec("communication", v)} highlighted={h("specs.communication")} />
          </TabsContent>
        </>
      );
    }

    // solarbox = onduleur + batterie combined
    return (
      <>
        <TabsContent value="tech1" className="space-y-4 pt-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">⚡ Onduleur intégré</p>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Puissance onduleur" unit="kW" value={specStr(form.specs, "puissance_nominale_kw")} onChange={(v) => setSpec("puissance_nominale_kw", v)} placeholder="10" highlighted={h("specs.puissance_nominale_kw")} />
            <NumField label="Nb MPPT" unit="" value={specStr(form.specs, "nb_mppt")} onChange={(v) => setSpec("nb_mppt", v)} placeholder="2" highlighted={h("specs.nb_mppt")} />
          </div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide pt-2">🔋 Batterie intégrée</p>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Capacité" unit="kWh" value={specStr(form.specs, "capacite_kwh")} onChange={(v) => setSpec("capacite_kwh", v)} placeholder="10" highlighted={h("specs.capacite_kwh")} />
            <NumField label="Cycles de vie" unit="cycles" value={specStr(form.specs, "cycle_vie")} onChange={(v) => setSpec("cycle_vie", v)} placeholder="6000" highlighted={h("specs.cycle_vie")} />
            <NumField label="DoD" unit="%" value={specStr(form.specs, "depth_of_discharge")} onChange={(v) => setSpec("depth_of_discharge", v)} placeholder="90" highlighted={h("specs.depth_of_discharge")} />
            <NumField label="Durée de vie" unit="ans" value={specStr(form.specs, "duree_vie_ans")} onChange={(v) => setSpec("duree_vie_ans", v)} placeholder="10" highlighted={h("specs.duree_vie_ans")} />
          </div>
          <div className="space-y-1.5">
            <Label className={h("specs.type_batterie") ? "text-red-600 font-semibold" : ""}>
              Type de batterie
              {h("specs.type_batterie") && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
            </Label>
            <Select value={specStr(form.specs, "type_batterie")} onValueChange={(v) => setSpec("type_batterie", v)}>
              <SelectTrigger className={h("specs.type_batterie") ? "border-red-400 bg-red-50/50 text-red-900" : ""}><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LFP">LFP (LiFePO4)</SelectItem>
                <SelectItem value="NMC">NMC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        <TabsContent value="tech2" className="space-y-4 pt-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">📐 Dimensions & Connectique</p>
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Largeur" unit="mm" value={specStr(form.specs, "largeur_mm")} onChange={(v) => setSpec("largeur_mm", v)} highlighted={h("specs.largeur_mm")} />
            <NumField label="Hauteur" unit="mm" value={specStr(form.specs, "hauteur_mm")} onChange={(v) => setSpec("hauteur_mm", v)} highlighted={h("specs.hauteur_mm")} />
            <NumField label="Poids" unit="kg" value={specStr(form.specs, "poids_kg")} onChange={(v) => setSpec("poids_kg", v)} highlighted={h("specs.poids_kg")} />
            <NumField label="Garantie" unit="ans" value={specStr(form.specs, "garantie_ans")} onChange={(v) => setSpec("garantie_ans", v)} highlighted={h("specs.garantie_ans")} />
          </div>
          <TextField label="IP Rating" value={specStr(form.specs, "ip_rating")} onChange={(v) => setSpec("ip_rating", v)} placeholder="IP65" highlighted={h("specs.ip_rating")} />
          <MultiToggle label="Communication" options={MULTI_OPTIONS.communication} selected={specArr(form.specs, "communication")} onChange={(v) => setSpec("communication", v)} highlighted={h("specs.communication")} />
        </TabsContent>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Catalogue Produits
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez vos offres solaires & stockage par famille
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
        Object.entries(grouped).map(([category, pkgs]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {CATEGORY_LABELS[category] || category}
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
                            {pkg.fabricant && <Badge variant="outline" className="text-[10px]">{pkg.fabricant}</Badge>}
                            <Badge variant="secondary" className="text-[10px]">{PROFILE_LABELS[pkg.profile_type] || pkg.profile_type}</Badge>
                            {!pkg.is_active && <Badge variant="outline" className="text-[10px]">Inactif</Badge>}
                          </div>
                          {pkg.modele && <p className="text-xs text-muted-foreground">{pkg.modele}</p>}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {s.capacite_kwh && <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-primary" />{String(s.capacite_kwh)} kWh</span>}
                            {s.puissance_wc && <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-primary" />{String(s.puissance_wc)} Wc</span>}
                            {s.puissance_nominale_kw && <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-primary" />{String(s.puissance_nominale_kw)} kW</span>}
                            <span className="font-semibold text-foreground">{pkg.price_ttc.toLocaleString("fr-MA")} MAD</span>
                          </div>
                          {pkg.applicable_aids && pkg.applicable_aids.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {pkg.applicable_aids.map((aid) => <Badge key={aid} variant="secondary" className="text-[10px]">{aid}</Badge>)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(pkg)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(pkg.id)}><Trash2 className="w-4 h-4" /></Button>
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

          {/* Step 1: Famille produit (always visible at top) */}
          <div className="space-y-1.5 mt-2">
            <Label className={h("category") ? "text-red-600 font-semibold" : ""}>
              Famille produit *
              {h("category") && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
            </Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v, specs: {} }))}>
              <SelectTrigger className={h("category") ? "border-red-400 bg-red-50/50 text-red-900" : ""}><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Brochure upload */}
          <div className="my-3">
            <label htmlFor="brochure-upload"
              className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors ${
                ocrLoading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}>
              {ocrLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span className="text-sm text-primary font-medium">Analyse de la brochure en cours…</span></>
              ) : (
                <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Importer une brochure</span> (optionnel – JPG, PNG, PDF)</span></>
              )}
              <input id="brochure-upload" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" disabled={ocrLoading}
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleBrochureUpload(file); e.target.value = ""; }} />
            </label>
          </div>

          {ocrFields.size > 0 && (
            <p className="text-xs text-red-500 flex items-center gap-1 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
              Les champs en rouge ont été pré-remplis par l'IA depuis la brochure
            </p>
          )}

          {/* Step 3: Tabs (Général + Tech adaptatif) */}
          <Tabs defaultValue="general">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="tech1">Technique</TabsTrigger>
              <TabsTrigger value="tech2">Détails</TabsTrigger>
            </TabsList>

            {/* ── GÉNÉRAL ── */}
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Fabricant" value={form.fabricant} onChange={(v) => setForm((f) => ({ ...f, fabricant: v }))} placeholder="Ex: Blue Carbon" highlighted={h("fabricant")} />
                <TextField label="Modèle" value={form.modele} onChange={(v) => setForm((f) => ({ ...f, modele: v }))} placeholder="Ex: 350kWh Cabinet" highlighted={h("modele")} />
              </div>
              <TextField label="Nom commercial *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Ex: Pack Stockage 350kWh" highlighted={h("name")} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={h("profile_type") ? "text-red-600 font-semibold" : ""}>
                    Profil cible *
                    {h("profile_type") && <span className="ml-1 text-[10px] font-normal text-red-500">● IA</span>}
                  </Label>
                  <Select value={form.profile_type} onValueChange={(v) => setForm((f) => ({ ...f, profile_type: v }))}>
                    <SelectTrigger className={h("profile_type") ? "border-red-400 bg-red-50/50 text-red-900" : ""}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Résidentiel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industriel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <NumField label="Prix de base" unit="MAD" value={form.price_ttc} onChange={(v) => setForm((f) => ({ ...f, price_ttc: v }))} placeholder="Ex: 850000" highlighted={h("price_ttc")} />
              </div>
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
              <TextField label="Notes internes" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="Conditions, remarques..." highlighted={h("description")} />
              <div className="flex items-center justify-between">
                <Label>Produit actif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
              </div>
            </TabsContent>

            {/* ── TECHNIQUE (category-specific) ── */}
            {renderTechTabs()}
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
