import { useRef, useState, useEffect } from "react";
import { FileText, FileCheck, CreditCard, Upload, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocState {
  sent: boolean;
  validated: boolean;
}

interface DocStatus {
  rc: DocState;
  modele_j: DocState;
}

interface DocumentBadgesProps {
  userId: string;
  companyId: string;
  onStatusChange?: (allDone: boolean) => void;
}

const UPLOAD_DOC_CONFIG = [
  { key: "rc" as const, label: "RC", icon: FileText, uploadLabel: "RC non envoyé", sentLabel: "RC envoyé — en attente", validatedLabel: "RC validé" },
  { key: "modele_j" as const, label: "Modèle J", icon: FileCheck, uploadLabel: "Modèle J non envoyé", sentLabel: "Modèle J envoyé — en attente", validatedLabel: "Modèle J validé" },
];

const DEFAULT_STATUS: DocStatus = {
  rc: { sent: false, validated: false },
  modele_j: { sent: false, validated: false },
};

const DocumentBadges = ({ userId, companyId, onStatusChange }: DocumentBadgesProps) => {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocStatus>(DEFAULT_STATUS);
  const [cotisationsAJour, setCotisationsAJour] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [docsRes, profileRes] = await Promise.all([
        supabase
          .from("partner_documents")
          .select("doc_type, validated")
          .eq("company_id", companyId),
        supabase
          .from("partner_profiles")
          .select("cotisations_a_jour")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      const cotis = profileRes.data?.cotisations_a_jour ?? false;
      setCotisationsAJour(cotis);

      if (docsRes.data) {
        const status: DocStatus = { ...DEFAULT_STATUS };
        docsRes.data.forEach((d: any) => {
          if (d.doc_type in status) {
            status[d.doc_type as keyof DocStatus] = { sent: true, validated: !!d.validated };
          }
        });
        setDocs(status);
        onStatusChange?.(status.rc.validated && status.modele_j.validated && cotis);
      }
    };
    fetchData();
  }, [companyId, userId]);

  const handleUpload = async (docType: keyof DocStatus, file: File) => {
    setUploading(docType);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/${docType}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("partner-documents")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("partner_documents")
        .upsert(
          {
            user_id: userId,
            company_id: companyId,
            doc_type: docType,
            file_path: filePath,
            file_name: file.name,
          },
          { onConflict: "company_id,doc_type" }
        );

      if (dbError) throw dbError;

      const newDocs = { ...docs, [docType]: { sent: true, validated: false } };
      setDocs(newDocs);
      onStatusChange?.(newDocs.rc.validated && newDocs.modele_j.validated && cotisationsAJour);
      toast({ title: "Document envoyé", description: file.name });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {UPLOAD_DOC_CONFIG.map(({ key, icon: Icon, uploadLabel, sentLabel, validatedLabel }) => {
        const state = docs[key];
        const isUploading = uploading === key;

        const colorClass = state.validated
          ? "bg-green-500/10 text-green-700 border-green-500/20"
          : state.sent
          ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
          : "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 cursor-pointer";

        const label = state.validated ? validatedLabel : state.sent ? sentLabel : uploadLabel;

        const icon = isUploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : state.validated ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : state.sent ? (
          <Clock className="w-3.5 h-3.5" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        );

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (!state.sent && !isUploading) {
                fileInputRefs.current[key]?.click();
              }
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${colorClass} ${isUploading ? "opacity-70 cursor-wait" : ""}`}
            disabled={isUploading || state.sent}
          >
            {icon}
            {isUploading ? "Envoi..." : label}
            <input
              ref={(el) => { fileInputRefs.current[key] = el; }}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(key, file);
                e.target.value = "";
              }}
            />
          </button>
        );
      })}

      {/* Cotisations - read-only badge, controlled by admin */}
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
          cotisationsAJour
            ? "bg-green-500/10 text-green-700 border-green-500/20"
            : "bg-amber-500/10 text-amber-700 border-amber-500/20"
        }`}
      >
        <CreditCard className="w-3.5 h-3.5" />
        {cotisationsAJour ? "Cotisations à jour" : "Cotisations non vérifiées"}
        {cotisationsAJour ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      </span>
    </div>
  );
};

export default DocumentBadges;
