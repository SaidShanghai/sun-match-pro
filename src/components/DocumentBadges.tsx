import { useRef, useState, useEffect } from "react";
import { FileText, FileCheck, CreditCard, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocStatus {
  rc: boolean;
  modele_j: boolean;
  cotisations: boolean;
}

interface DocumentBadgesProps {
  userId: string;
  companyId: string;
  onStatusChange?: (allDone: boolean) => void;
}

const DOC_CONFIG = [
  { key: "rc" as const, label: "RC", icon: FileText, uploadLabel: "RC non envoyé", doneLabel: "RC envoyé" },
  { key: "modele_j" as const, label: "Modèle J", icon: FileCheck, uploadLabel: "Modèle J non envoyé", doneLabel: "Modèle J envoyé" },
  { key: "cotisations" as const, label: "Cotisations", icon: CreditCard, uploadLabel: "Cotisations non envoyées", doneLabel: "Cotisations envoyées" },
];

const DocumentBadges = ({ userId, companyId, onStatusChange }: DocumentBadgesProps) => {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocStatus>({ rc: false, modele_j: false, cotisations: false });
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase
        .from("partner_documents")
        .select("doc_type")
        .eq("company_id", companyId);

      if (data) {
        const status: DocStatus = { rc: false, modele_j: false, cotisations: false };
        data.forEach((d: any) => {
          if (d.doc_type in status) {
            status[d.doc_type as keyof DocStatus] = true;
          }
        });
        setDocs(status);
        onStatusChange?.(status.rc && status.modele_j && status.cotisations);
      }
    };
    fetchDocs();
  }, [companyId]);

  const handleUpload = async (docType: keyof DocStatus, file: File) => {
    setUploading(docType);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/${docType}.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("partner-documents")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Upsert document record
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

      const newDocs = { ...docs, [docType]: true };
      setDocs(newDocs);
      onStatusChange?.(newDocs.rc && newDocs.modele_j && newDocs.cotisations);
      toast({ title: "Document téléchargé", description: file.name });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {DOC_CONFIG.map(({ key, icon: Icon, uploadLabel, doneLabel }) => {
        const done = docs[key];
        const isUploading = uploading === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (!done && !isUploading) {
                fileInputRefs.current[key]?.click();
              }
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              done
                ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                : "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
            } ${isUploading ? "opacity-70 cursor-wait" : ""}`}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : done ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {isUploading ? "Envoi..." : done ? doneLabel : uploadLabel}
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
    </div>
  );
};

export default DocumentBadges;
