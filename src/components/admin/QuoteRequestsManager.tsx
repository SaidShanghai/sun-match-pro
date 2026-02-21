import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, Loader2, Mail, Phone, MapPin, Calendar, ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  city: string | null;
  housing_type: string | null;
  objectif: string | null;
  roof_type: string | null;
  roof_orientation: string | null;
  roof_surface: string | null;
  annual_consumption: string | null;
  budget: string | null;
  project_type: string | null;
  type_abonnement: string | null;
  puissance_souscrite: string | null;
  selected_usages: string[] | null;
  description_projet: string | null;
  adresse_projet: string | null;
  ville_projet: string | null;
  date_debut: string | null;
  date_fin: string | null;
  pv_existante: string | null;
  extension_install: string | null;
  subvention_recue: string | null;
  elig_decl: Record<string, string | null> | null;
  status: string;
  admin_notes: string | null;
  recommended_package_id: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  in_progress: { label: "En cours", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  treated: { label: "Traité", color: "bg-green-500/10 text-green-700 border-green-500/20" },
  lost: { label: "Perdu", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const DIAGNOSTIC_LABELS: Record<string, string> = {
  housing_type: "Type de logement",
  objectif: "Objectif",
  roof_type: "Type de bâtiment (Entreprise)",
  roof_orientation: "Orientation toiture",
  roof_surface: "Surface disponible",
  annual_consumption: "Consommation annuelle",
  budget: "Facture mensuelle",
  project_type: "Type de projet",
  type_abonnement: "Type d'abonnement",
  puissance_souscrite: "Puissance souscrite",
  description_projet: "Description du projet",
  adresse_projet: "Adresse du projet",
  ville_projet: "Ville du projet",
  date_debut: "Date début souhaitée",
  date_fin: "Date fin souhaitée",
  pv_existante: "Installation PV existante",
  extension_install: "Extension installation",
  subvention_recue: "Subvention reçue",
};

const QuoteRequestsManager = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setRequests((data || []) as unknown as QuoteRequest[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast({ title: "Statut mis à jour" });
    }
  };

  const saveNote = async (id: string) => {
    setSavingNote(true);
    const { error } = await supabase.from("quote_requests").update({ admin_notes: noteText }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, admin_notes: noteText } : r)));
      toast({ title: "Note enregistrée" });
      setEditingNote(null);
    }
    setSavingNote(false);
  };

  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  const counts = Object.keys(STATUS_CONFIG).reduce<Record<string, number>>((acc, s) => {
    acc[s] = requests.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Demandes de Devis
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {requests.length} demande{requests.length !== 1 ? "s" : ""} reçue{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Compteurs statut */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`rounded-xl border p-3 text-center transition-all ${
              filterStatus === key ? "ring-2 ring-primary" : "hover:border-primary/30"
            } ${cfg.color}`}
          >
            <div className="text-2xl font-bold">{counts[key] || 0}</div>
            <div className="text-xs font-medium">{cfg.label}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p>Aucune demande{filterStatus !== "all" ? ` avec ce statut` : ""}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.new;
            const isExpanded = expanded === req.id;
            return (
              <Card key={req.id}>
                <CardContent className="py-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{req.client_name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{req.client_email}</span>
                        {req.client_phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{req.client_phone}</span>}
                        {req.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{req.city}</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select value={req.status} onValueChange={(v) => updateStatus(req.id, v)}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([k, c]) => (
                            <SelectItem key={k} value={k}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : req.id)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Données diagnostic */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Données du diagnostic</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {Object.entries(DIAGNOSTIC_LABELS).map(([key, label]) => {
                            const val = req[key as keyof QuoteRequest] as string | null;
                            return val ? (
                              <div key={key} className="text-sm">
                                <span className="text-muted-foreground">{label} :</span>{" "}
                                <span className="font-medium">{val}</span>
                              </div>
                            ) : null;
                          })}
                          {req.selected_usages && req.selected_usages.length > 0 && (
                            <div className="text-sm sm:col-span-2">
                              <span className="text-muted-foreground">Usages :</span>{" "}
                              <span className="font-medium">{req.selected_usages.join(", ")}</span>
                            </div>
                          )}
                          {req.elig_decl && (
                            <div className="text-sm sm:col-span-2">
                              <span className="text-muted-foreground">Éligibilité :</span>{" "}
                              <span className="font-medium">{Object.entries(req.elig_decl).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(" · ")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes admin */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                            <StickyNote className="w-3.5 h-3.5" />Notes internes
                          </p>
                          {editingNote !== req.id && (
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => { setEditingNote(req.id); setNoteText(req.admin_notes || ""); }}>
                              Modifier
                            </Button>
                          )}
                        </div>
                        {editingNote === req.id ? (
                          <div className="space-y-2">
                            <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Notes internes sur ce prospect..." rows={3} className="text-sm" />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => saveNote(req.id)} disabled={savingNote}>
                                {savingNote && <Loader2 className="w-3 h-3 animate-spin mr-1" />}Enregistrer
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>Annuler</Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            {req.admin_notes || "Aucune note."}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuoteRequestsManager;
