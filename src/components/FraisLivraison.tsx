import { useState, useEffect } from "react";
import { Loader2, Truck, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeliveryCost {
  id?: string;
  city: string;
  cost: number;
}

interface FraisLivraisonProps {
  userId: string;
  companyId: string;
  companyCity: string;
  serviceAreas: string[];
  onBack: () => void;
  onSaved?: () => void;
}

const FraisLivraison = ({ userId, companyId, companyCity, serviceAreas, onBack, onSaved }: FraisLivraisonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [costs, setCosts] = useState<DeliveryCost[]>([]);

  useEffect(() => {
    const fetchCosts = async () => {
      const { data, error } = await supabase
        .from("delivery_costs")
        .select("*")
        .eq("company_id", companyId);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }

      // Build list: company city + service areas, with existing costs
      const existingMap = new Map((data || []).map((d: any) => [d.city, d]));
      const allCities = [companyCity, ...serviceAreas.filter((c) => c !== companyCity)];
      const unique = [...new Set(allCities)];

      setCosts(
        unique.map((city) => ({
          id: existingMap.get(city)?.id,
          city,
          cost: existingMap.get(city)?.cost ?? 0,
        }))
      );
      setLoading(false);
    };
    fetchCosts();
  }, [companyId, companyCity, serviceAreas]);

  const updateCost = (city: string, value: string) => {
    setSaved(false);
    setCosts((prev) =>
      prev.map((c) => (c.city === city ? { ...c, cost: parseFloat(value) || 0 } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert all costs
      const upsertData = costs.map((c) => ({
        company_id: companyId,
        user_id: userId,
        city: c.city,
        cost: c.cost,
      }));

      for (const item of upsertData) {
        const { error } = await supabase
          .from("delivery_costs")
          .upsert(item, { onConflict: "company_id,city" });
        if (error) throw error;
      }

      setSaved(true);
      onSaved?.();
      toast({ title: "Frais de livraison enregistrés" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
          <Truck className="w-5 h-5 text-primary" />
          Frais de livraison par ville
        </h2>
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Retour
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Définissez le coût de déplacement/livraison pour chaque ville que vous desservez.
            <strong> 0 MAD</strong> = livraison gratuite (ex: votre ville de stock).
          </p>

          <div className="space-y-3">
            {costs.map((item) => (
              <div
                key={item.city}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20"
              >
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 font-medium text-sm">
                  {item.city}
                  {item.city === companyCity && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Siège
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={item.cost}
                    onChange={(e) => updateCost(item.city, e.target.value)}
                    className="w-28 text-right"
                  />
                  <span className="text-sm text-muted-foreground">MAD</span>
                </div>
              </div>
            ))}
          </div>

          {costs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucune zone d'intervention configurée. Ajoutez des villes dans votre profil entreprise.
            </div>
          )}

          {costs.length > 0 && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={saving || saved}
                style={saved ? { backgroundColor: "hsla(24, 95%, 53%, 0.5)", color: "white" } : { backgroundColor: "hsl(24, 95%, 53%)", color: "white" }}
                className={`${saved ? "cursor-not-allowed opacity-100" : "hover:opacity-90"} disabled:opacity-100`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saved ? "Enregistré ✓" : "Enregistrer"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FraisLivraison;
