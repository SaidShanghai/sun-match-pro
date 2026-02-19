import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface EligibiliteScreenProps {
  onContinue: () => void;
}

const declarations = [
  { id: "d1", text: "Le projet n'a pas encore commencé" },
  { id: "d2", text: "L'installation solaire photovoltaïque est nouvelle (GreenField)" },
  { id: "d3", text: "L'installation est sur toiture (ou shelter) et connectée au réseau" },
  { id: "d4", text: "La capacité installée est inférieure à 3 MW" },
  { id: "d5", text: "Le bénéficiaire n'a reçu et ne recevra pas d'autres incitations financières autres que les revenus générés par les crédits carbone issus de son projet solaire" },
  { id: "d6", text: "Le bénéficiaire déclare être le propriétaire de l'installation solaire et confirme son engagement à transférer les émissions réduites dans le cadre du programme SR500" },
];

const EligibiliteScreen = ({ onContinue }: EligibiliteScreenProps) => {
  const [decl, setDecl] = useState<Record<string, "Oui" | "Non" | null>>({
    d1: null, d2: null, d3: null, d4: null, d5: null, d6: null,
  });

  const allDeclOui = declarations.every(d => decl[d.id] === "Oui");
  const canContinue = allDeclOui;

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







      {/* Déclarations SR500 */}
      <div className="space-y-1.5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Déclarations d'éligibilité</p>
        {declarations.map(d => (
          <div key={d.id} className="rounded-xl border border-border p-2 space-y-1.5">
            <p className="text-[9px] text-foreground leading-snug font-medium">{d.text} <span className="text-destructive">*</span></p>
            <div className="flex gap-2">
              {(["Oui", "Non"] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setDecl(prev => ({ ...prev, [d.id]: opt }))}
                  className={`flex-1 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                    decl[d.id] === opt
                      ? opt === "Oui"
                        ? "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-destructive/10 border-destructive/40 text-destructive"
                      : "border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

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
