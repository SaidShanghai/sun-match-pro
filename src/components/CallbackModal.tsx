import { useState } from "react";
import { Phone, CheckCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      setError("Numéro de téléphone invalide (ex: 06 12 34 56 78).");
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setSubmitted(false); setNom(""); setTelephone(""); setError(""); }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
        <div className="relative">
          {/* Header gradient */}
          <div className="bg-gradient-to-br from-primary to-primary/70 px-8 pt-8 pb-10 text-primary-foreground">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Vous préférez qu'on vous appelle ?</h2>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Laissez-nous votre numéro, un de nos conseillers solaires vous rappelle sous 24h — gratuitement et sans engagement.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 bg-background">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center gap-3 py-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">C'est noté, {nom.trim()} !</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Nous vous rappelons au <span className="font-semibold text-foreground">{telephone}</span> dans les prochaines 24 heures.
                  </p>
                  <Button className="mt-2" onClick={handleClose}>Fermer</Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="callback-nom">Votre prénom</Label>
                    <Input
                      id="callback-nom"
                      placeholder="Ex : Youssef"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="callback-tel">Votre numéro de téléphone</Label>
                    <Input
                      id="callback-tel"
                      type="tel"
                      placeholder="Ex : 06 12 34 56 78"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Gratuit · Sans engagement · Réponse sous 24h
                  </div>
                  <Button type="submit" className="w-full h-12 text-base font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    Me faire rappeler
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackModal;
