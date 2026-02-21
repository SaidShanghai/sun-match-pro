import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, FileText, Loader2, CheckCircle2, X, Sparkles } from "lucide-react";

interface OcrResult {
  numero_contrat?: string | null;
  numero_compteur?: string | null;
  nom_client?: string | null;
  adresse?: string | null;
  ville?: string | null;
  distributeur?: string | null;
  puissance_souscrite_kva?: number | null;
  type_abonnement?: string | null;
  consommation_kwh?: number | null;
  periode_jours?: number | null;
  montant_ht?: number | null;
  montant_tva?: number | null;
  montant_ttc?: number | null;
  tranche_tarifaire?: string | null;
  index_ancien?: number | null;
  index_nouveau?: number | null;
  date_facture?: string | null;
  periode_facturation?: string | null;
}

interface FactureUploadProps {
  onDataExtracted: (data: OcrResult) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const FactureUpload = ({ onDataExtracted }: FactureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [extractedFields, setExtractedFields] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Format non accepté",
        description: "Formats acceptés : JPG, PNG, WebP ou PDF",
        variant: "destructive",
      });
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5 Mo.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setSuccess(false);
    setExtractedFields([]);
    setFileName(file.name);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call OCR edge function
      const { data, error } = await supabase.functions.invoke("ocr-facture", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Analyse difficile",
          description: data.message || "Essayez avec une photo plus nette.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      if (data?.success && data.data) {
        const ocrData = data.data as OcrResult;
        
        // Track which fields were extracted
        const fields: string[] = [];
        if (ocrData.consommation_kwh) fields.push("Consommation");
        if (ocrData.montant_ttc) fields.push("Montant TTC");
        if (ocrData.ville) fields.push("Ville");
        if (ocrData.distributeur) fields.push("Distributeur");
        if (ocrData.puissance_souscrite_kva) fields.push("Puissance");
        if (ocrData.tranche_tarifaire) fields.push("Tranche");
        if (ocrData.type_abonnement) fields.push("Abonnement");

        setExtractedFields(fields);
        setSuccess(true);
        onDataExtracted(ocrData);

        toast({
          title: "Facture analysée ✓",
          description: `${fields.length} information${fields.length > 1 ? "s" : ""} extraite${fields.length > 1 ? "s" : ""} avec succès.`,
        });
      }
    } catch (err: any) {
      console.error("OCR error:", err);
      toast({
        title: "Erreur d'analyse",
        description: err?.message || "Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setFileName(null);
    setSuccess(false);
    setExtractedFields([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-primary" />
          Photo de votre facture
          <span className="text-xs font-normal text-muted-foreground">(recommandé)</span>
        </label>
        {(preview || fileName) && !uploading && (
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="w-3 h-3" /> Retirer
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <AnimatePresence mode="wait">
        {success && extractedFields.length > 0 ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Facture analysée avec succès</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {extractedFields.map(f => (
                <span key={f} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3" /> {f}
                </span>
              ))}
            </div>
            {preview && (
              <img src={preview} alt="Facture" className="w-full max-h-32 object-contain rounded-xl opacity-60" />
            )}
            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
            >
              Changer de photo
            </button>
          </motion.div>
        ) : uploading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 flex flex-col items-center gap-3"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold">Analyse IA en cours…</p>
              <p className="text-xs text-muted-foreground">Extraction des données de votre facture</p>
            </div>
            {preview && (
              <img src={preview} alt="Facture" className="w-full max-h-24 object-contain rounded-xl opacity-40" />
            )}
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-border hover:border-primary/50 p-5 flex flex-col items-center gap-2 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Photographiez votre facture ONEE</p>
              <p className="text-xs text-muted-foreground">
                L'IA pré-remplira automatiquement vos informations
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">JPG</span>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">PNG</span>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">PDF</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FactureUpload;
