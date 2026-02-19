import { useState } from "react";
import { X, ArrowRight, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface QuotePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installerName?: string;
  onSuccess?: (id: string) => void;
}

const phoneRegex = /^(\+212|0)([ \-]?[0-9]){9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const QuotePanel = ({ open, onOpenChange, installerName, onSuccess }: QuotePanelProps) => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nom.trim() || nom.trim().length < 2) {
      setError("Veuillez entrer votre nom complet.");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError("Adresse email invalide.");
      return;
    }
    if (!phoneRegex.test(telephone.replace(/\s/g, ""))) {
      setError("Numéro invalide (ex : 06 12 34 56 78)");
      return;
    }
    if (!ville.trim()) {
      setError("Veuillez indiquer votre ville.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: dbError } = await supabase.from("quote_requests").insert({
        client_name: nom.trim().slice(0, 100),
        client_email: email.trim().slice(0, 255),
        client_phone: telephone.trim().slice(0, 20),
        city: ville.trim().slice(0, 100),
        status: "new",
      }).select("id").single();

      if (dbError) throw dbError;

      const id = data?.id ?? crypto.randomUUID();
      onOpenChange(false);
      onSuccess?.(id);
    } catch (err: any) {
      console.error("QuotePanel error:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setNom("");
      setEmail("");
      setTelephone("");
      setVille("");
      setError("");
    }, 400);
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
            className="fixed top-0 right-0 h-full w-full max-w-[480px] z-50 bg-background shadow-2xl flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-sm block">Demander un devis</span>
                  {installerName && (
                    <span className="text-xs text-muted-foreground">auprès de {installerName}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center gap-5 mt-8"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Demande envoyée !</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Merci <span className="font-semibold text-foreground">{nom.trim()}</span> !<br />
                        Un conseiller NOORIA vous contactera sous 24h<br />
                        à <span className="font-semibold text-foreground">{email.trim()}</span> ou au{" "}
                        <span className="font-semibold text-foreground">{telephone}</span>.
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleClose} className="mt-2 rounded-full px-8">
                      Fermer
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-1">Vos coordonnées</h2>
                    <p className="text-muted-foreground text-sm mb-7 leading-relaxed">
                      Remplissez ce formulaire et recevez votre devis personnalisé sous 24h — gratuitement et sans engagement.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Nom complet *
                        </label>
                        <Input
                          placeholder="Ex : Youssef El Amrani"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          maxLength={100}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="Ex : youssef@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          maxLength={255}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Téléphone *
                        </label>
                        <Input
                          type="tel"
                          placeholder="Ex : 06 12 34 56 78"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          maxLength={20}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Ville *
                        </label>
                        <Input
                          placeholder="Ex : Casablanca"
                          value={ville}
                          onChange={(e) => setVille(e.target.value)}
                          maxLength={100}
                          className="h-12"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-destructive font-medium">{error}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold group mt-2 rounded-full"
                        disabled={loading}
                      >
                        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
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

export default QuotePanel;
