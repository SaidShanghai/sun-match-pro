import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface EligibiliteScreenProps {
  onContinue: () => void;
}

const EligibiliteScreen = ({ onContinue }: EligibiliteScreenProps) => {
  const [consoAnnuelle, setConsoAnnuelle] = useState("");
  const [factureAnnuelle, setFactureAnnuelle] = useState("");
  const [puissanceSouscrite, setPuissanceSouscrite] = useState("");
  const [pvExistante, setPvExistante] = useState<"Oui" | "Non" | null>(null);
  const [extension, setExtension] = useState<"Oui" | "Non" | null>(null);
  const [subvention, setSubvention] = useState<"Oui" | "Non" | null>(null);

  const canContinue = !!(consoAnnuelle && factureAnnuelle && puissanceSouscrite && pvExistante && extension && subvention);

  return (
    <motion.div
      key="eligibilite"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-3 flex flex-col gap-3 overflow-y-auto flex-1"
    >
      {/* Stepper */}
      <div className="flex items-center justify-between px-1">
        {["Profil", "Info", "Site", "Eligib.", "Analyse", "Solut.", "Contact"].map((step, i) => {
          const isDone = i <= 2;
          const isActive = i === 3;
          return (
            <div key={step} className="flex flex-col items-center gap-0.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${isDone ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                {isDone ? "✓" : i + 1}
              </div>
              <span className={`text-[8px] ${isActive || isDone ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step}</span>
            </div>
          );
        })}
      </div>

      {/* Title */}
      <div className="pt-1">
        <h4 className="text-sm font-bold">Éligibilité</h4>
      </div>

      {/* Champs numériques */}
      <div className="space-y-2">
        {[
          { label: "Consommation annuelle (kWh)", value: consoAnnuelle, set: setConsoAnnuelle, placeholder: "Ex : 150 000" },
          { label: "Facture annuelle (MAD)", value: factureAnnuelle, set: setFactureAnnuelle, placeholder: "Ex : 180 000" },
          { label: "Puissance souscrite (kVA)", value: puissanceSouscrite, set: setPuissanceSouscrite, placeholder: "Ex : 160" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label} className="space-y-0.5">
            <label className="text-[9px] font-semibold text-foreground">{label}</label>
            <input
              type="number"
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              className="w-full text-[10px] bg-background border border-border rounded-xl px-2.5 py-1.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        ))}
      </div>

      {/* Oui/Non fields */}
      {([
        { label: "Installation PV existante", value: pvExistante, set: setPvExistante },
        { label: "Extension d'une installation ?", value: extension, set: setExtension },
        { label: "Subvention déjà reçue ?", value: subvention, set: setSubvention },
      ] as { label: string; value: "Oui" | "Non" | null; set: (v: "Oui" | "Non") => void }[]).map(({ label, value, set }) => (
        <div key={label} className="space-y-1">
          <label className="text-[9px] font-semibold text-foreground">{label}</label>
          <div className="flex gap-2">
            {(["Oui", "Non"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => set(opt)}
                className={`flex-1 py-1.5 rounded-full text-[10px] font-medium border transition-colors ${value === opt ? "bg-primary/10 border-primary text-foreground" : "border-border text-foreground hover:border-primary/50"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <button
        onClick={() => { if (canContinue) onContinue(); }}
        disabled={!canContinue}
        className={`w-full rounded-full mt-1 text-[11px] h-10 font-semibold flex items-center justify-center gap-1.5 transition-colors ${canContinue ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
      >
        Analyser mon projet <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default EligibiliteScreen;
