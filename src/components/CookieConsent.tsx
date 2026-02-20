import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const CONSENT_KEY = "nooria_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(CONSENT_KEY, "refused");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4"
        >
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Protection de vos données</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Conformément à la loi marocaine 09-08 relative à la protection des données personnelles,
                  nous utilisons des cookies essentiels au fonctionnement du site et des cookies analytiques
                  pour améliorer votre expérience.{" "}
                  <a href="/mentions-legales" className="text-primary underline underline-offset-2">
                    Mentions légales
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={refuse} className="flex-1 sm:flex-none rounded-full text-xs">
                Refuser
              </Button>
              <Button size="sm" onClick={accept} className="flex-1 sm:flex-none rounded-full text-xs">
                Accepter
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
