import { useState } from "react";
import { Phone, CheckCircle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface CallbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CallbackModal = ({ open, onOpenChange }: CallbackModalProps) => {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const phoneRegex = /^(\+212|0)([ \-]?[0-9]){9}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nom.trim()) { setError("Veuillez entrer votre prénom."); return; }
    if (!phoneRegex.test(telephone.replace(/\s/g, ""))) {
      setError("Numéro invalide (ex : 06 12 34 56 78)");
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setSubmitted(false); setNom(""); setTelephone(""); setError(""); }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-background shadow-2xl flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">Être rappelé</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center px-6 py-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center gap-4"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">C'est noté, {nom.trim()} !</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Un conseiller vous rappelle au<br />
                        <span className="font-semibold text-foreground">{telephone}</span><br />
                        dans les prochaines 24h.
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleClose} className="mt-2">
                      Fermer
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">Vous préférez qu'on vous appelle ?</h2>
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                      Laissez votre numéro — un conseiller NOORIA vous rappelle gratuitement sous 24h.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Votre prénom
                        </label>
                        <Input
                          placeholder="Ex : Youssef"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          maxLength={50}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Numéro de téléphone
                        </label>
                        <Input
                          type="tel"
                          placeholder="Ex : 06 12 34 56 78"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          maxLength={20}
                          className="h-[55px]"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}

                      <Button type="submit" className="w-full h-12 text-base font-semibold group mt-2">
                        Me faire rappeler
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                      Gratuit · Sans engagement · Réponse sous 24h
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CallbackModal;
