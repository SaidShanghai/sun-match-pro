import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Sun, Battery, Cpu, PanelTop, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Kit {
  id: string;
  name: string;
  power_kwc: number;
  panel_count: number;
  panel_brand: string;
  inverter: string;
  structure: string | null;
  batteries: string | null;
  estimated_production_kwh: number | null;
  price_ttc: number;
  warranty_years: number;
  is_active: boolean;
}

interface KitsSolairesProps {
  userId: string;
  companyId: string;
  onBack: () => void;
}

const emptyKit = {
  name: "",
  power_kwc: "",
  panel_count: "",
  panel_brand: "",
  inverter: "",
  structure: "",
  batteries: "",
  estimated_production_kwh: "",
  price_ttc: "",
  warranty_years: "10",
};

const KitsSolaires = ({ userId, companyId, onBack }: KitsSolairesProps) => {
  const { toast } = useToast();
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyKit);

  const fetchKits = async () => {
    const { data, error } = await supabase
      .from("kits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setKits(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKits();
  }, [userId]);

  const openAdd = () => {
    setEditingKit(null);
    setForm(emptyKit);
    setShowForm(true);
  };

  const openEdit = (kit: Kit) => {
    setEditingKit(kit);
    setForm({
      name: kit.name,
      power_kwc: String(kit.power_kwc),
      panel_count: String(kit.panel_count),
      panel_brand: kit.panel_brand,
      inverter: kit.inverter,
      structure: kit.structure || "",
      batteries: kit.batteries || "",
      estimated_production_kwh: kit.estimated_production_kwh ? String(kit.estimated_production_kwh) : "",
      price_ttc: String(kit.price_ttc),
      warranty_years: String(kit.warranty_years),
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const kitData = {
      user_id: userId,
      company_id: companyId,
      name: form.name.trim(),
      power_kwc: parseFloat(form.power_kwc),
      panel_count: parseInt(form.panel_count),
      panel_brand: form.panel_brand.trim(),
      inverter: form.inverter.trim(),
      structure: form.structure.trim() || null,
      batteries: form.batteries.trim() || null,
      estimated_production_kwh: form.estimated_production_kwh ? parseInt(form.estimated_production_kwh) : null,
      price_ttc: parseFloat(form.price_ttc),
      warranty_years: parseInt(form.warranty_years),
    };

    try {
      if (editingKit) {
        const { error } = await supabase
          .from("kits")
          .update(kitData)
          .eq("id", editingKit.id);
        if (error) throw error;
        toast({ title: "Kit mis à jour" });
      } else {
        const { error } = await supabase.from("kits").insert(kitData);
        if (error) throw error;
        toast({ title: "Kit ajouté" });
      }
      setShowForm(false);
      fetchKits();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("kits").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Kit supprimé" });
      setKits(kits.filter((k) => k.id !== id));
    }
    setDeleteConfirm(null);
  };

  const formValid =
    form.name.trim() &&
    parseFloat(form.power_kwc) > 0 &&
    parseInt(form.panel_count) > 0 &&
    form.panel_brand.trim() &&
    form.inverter.trim() &&
    parseFloat(form.price_ttc) > 0 &&
    parseInt(form.warranty_years) > 0;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Mes Kits Solaires
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Retour
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter un kit
          </Button>
        </div>
      </div>

      {kits.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Sun className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Aucun kit enregistré</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Ajoutez vos kits solaires pour qu'ils apparaissent dans les résultats de diagnostic des clients NOORIA.
            </p>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" /> Ajouter mon premier kit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2.5 font-medium">Nom</th>
                <th className="text-left px-3 py-2.5 font-medium">kWc</th>
                <th className="text-left px-3 py-2.5 font-medium">Panneaux</th>
                <th className="text-left px-3 py-2.5 font-medium">Marque</th>
                <th className="text-left px-3 py-2.5 font-medium">Inverteur</th>
                <th className="text-left px-3 py-2.5 font-medium">Batteries</th>
                <th className="text-left px-3 py-2.5 font-medium">Prod. kWh/an</th>
                <th className="text-right px-3 py-2.5 font-medium">Prix TTC</th>
                <th className="text-center px-3 py-2.5 font-medium">Garantie</th>
                <th className="text-right px-3 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kits.map((kit) => (
                <tr key={kit.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{kit.name}</td>
                  <td className="px-3 py-2.5">{kit.power_kwc}</td>
                  <td className="px-3 py-2.5">{kit.panel_count}</td>
                  <td className="px-3 py-2.5">{kit.panel_brand}</td>
                  <td className="px-3 py-2.5">{kit.inverter}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{kit.batteries || "—"}</td>
                  <td className="px-3 py-2.5">{kit.estimated_production_kwh?.toLocaleString() || "—"}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-primary">{kit.price_ttc.toLocaleString("fr-MA")} MAD</td>
                  <td className="px-3 py-2.5 text-center">{kit.warranty_years} ans</td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(kit)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirm(kit.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {editingKit ? "Modifier le kit" : "Ajouter un kit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du kit *</Label>
              <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Kit Toiture Premium 6kWc" required />
            </div>
            <div className="space-y-2">
              <Label>Puissance (kWc) *</Label>
              <Input type="number" step="0.01" min="0" value={form.power_kwc} onChange={(e) => updateField("power_kwc", e.target.value)} placeholder="6.00" required />
            </div>
            <div className="space-y-2">
              <Label>Nombre de panneaux *</Label>
              <Input type="number" min="1" value={form.panel_count} onChange={(e) => updateField("panel_count", e.target.value)} placeholder="12" required />
            </div>
            <div className="space-y-2">
              <Label>Marque panneaux *</Label>
              <Input value={form.panel_brand} onChange={(e) => updateField("panel_brand", e.target.value)} placeholder="JA Solar, Longi..." required />
            </div>
            <div className="space-y-2">
              <Label>Inverteur *</Label>
              <Input value={form.inverter} onChange={(e) => updateField("inverter", e.target.value)} placeholder="Huawei, SMA..." required />
            </div>
            <div className="space-y-2">
              <Label>Structure</Label>
              <Input value={form.structure} onChange={(e) => updateField("structure", e.target.value)} placeholder="Aluminium, K2..." />
            </div>
            <div className="space-y-2">
              <Label>Batteries</Label>
              <Input value={form.batteries} onChange={(e) => updateField("batteries", e.target.value)} placeholder="BSLBATT 5kWh..." />
            </div>
            <div className="space-y-2">
              <Label>Production estimée (kWh/an)</Label>
              <Input type="number" min="0" value={form.estimated_production_kwh} onChange={(e) => updateField("estimated_production_kwh", e.target.value)} placeholder="9000" />
            </div>
            <div className="space-y-2">
              <Label>Garantie (années) *</Label>
              <Input type="number" min="1" value={form.warranty_years} onChange={(e) => updateField("warranty_years", e.target.value)} placeholder="10" required />
            </div>
            <div className="space-y-2">
              <Label>Prix TTC (MAD) *</Label>
              <Input type="number" step="0.01" min="0" value={form.price_ttc} onChange={(e) => updateField("price_ttc", e.target.value)} placeholder="65000.00" required />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving || !formValid}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingKit ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer ce kit ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitsSolaires;
