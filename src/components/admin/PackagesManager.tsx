import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Package, Loader2, Zap, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  name: string;
  profile_type: string;
  power_kwc: number;
  price_ttc: number;
  applicable_aids: string[];
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const AIDS_OPTIONS = ["SR500", "TATWIR", "GEFF", "PPA"];

const PROFILE_LABELS: Record<string, string> = {
  residential: "Résidentiel",
  commercial: "Commercial",
  industrial: "Industriel",
};

const emptyForm = {
  name: "",
  profile_type: "residential",
  power_kwc: "",
  price_ttc: "",
  applicable_aids: [] as string[],
  description: "",
  is_active: true,
};

const PackagesManager = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("profile_type")
      .order("power_kwc");
    if (!error) setPackages(data || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      profile_type: pkg.profile_type,
      power_kwc: String(pkg.power_kwc),
      price_ttc: String(pkg.price_ttc),
      applicable_aids: pkg.applicable_aids || [],
      description: pkg.description || "",
      is_active: pkg.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.power_kwc || !form.price_ttc) {
      toast({ title: "Champs requis", description: "Nom, puissance et prix sont obligatoires.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      profile_type: form.profile_type,
      power_kwc: parseFloat(form.power_kwc),
      price_ttc: parseFloat(form.price_ttc),
      applicable_aids: form.applicable_aids,
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    const { error } = editingId
      ? await supabase.from("packages").update(payload).eq("id", editingId)
      : await supabase.from("packages").insert(payload);

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

  const toggleAid = (aid: string) => {
    setForm((f) => ({
      ...f,
      applicable_aids: f.applicable_aids.includes(aid)
        ? f.applicable_aids.filter((a) => a !== aid)
        : [...f.applicable_aids, aid],
    }));
  };

  const grouped = packages.reduce<Record<string, Package[]>>((acc, p) => {
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
            Catalogue Packages
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez vos offres solaires par profil et puissance
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau package
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
            <p>Aucun package créé.</p>
            <p className="text-sm mt-1">Créez votre premier package solaire.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([profileType, pkgs]) => (
          <div key={profileType} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {PROFILE_LABELS[profileType] || profileType}
            </h3>
            <div className="grid gap-3">
              {pkgs.map((pkg) => (
                <Card key={pkg.id} className={!pkg.is_active ? "opacity-50" : ""}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{pkg.name}</h4>
                          {!pkg.is_active && <Badge variant="outline" className="text-[10px]">Inactif</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            {pkg.power_kwc} kWc
                          </span>
                          <span className="font-semibold text-foreground">
                            {pkg.price_ttc.toLocaleString("fr-MA")} MAD TTC
                          </span>
                        </div>
                        {pkg.applicable_aids && pkg.applicable_aids.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {pkg.applicable_aids.map((aid) => (
                              <Badge key={aid} variant="secondary" className="text-[10px] bg-green-500/10 text-green-700 border-green-500/20">
                                {aid}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
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
              ))}
            </div>
          </div>
        ))
      )}

      {/* Dialog Créer / Modifier */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le package" : "Nouveau package"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nom du package *</Label>
              <Input placeholder="Ex: Pack Résidentiel 6 kWc" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
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
              <div className="space-y-1.5">
                <Label>Puissance (kWc) *</Label>
                <Input type="number" placeholder="Ex: 6" value={form.power_kwc} onChange={(e) => setForm((f) => ({ ...f, power_kwc: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Prix TTC (MAD) *</Label>
              <Input type="number" placeholder="Ex: 45000" value={form.price_ttc} onChange={(e) => setForm((f) => ({ ...f, price_ttc: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Aides d'état applicables</Label>
              <div className="flex gap-2 flex-wrap">
                {AIDS_OPTIONS.map((aid) => (
                  <button
                    key={aid}
                    type="button"
                    onClick={() => toggleAid(aid)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      form.applicable_aids.includes(aid)
                        ? "bg-green-500/10 text-green-700 border-green-500/30"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {aid}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes internes (non visibles clients)</Label>
              <Textarea placeholder="Informations techniques, conditions, remarques..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Package actif</Label>
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingId ? "Enregistrer" : "Créer le package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesManager;
