import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import nooriaLogo from "@/assets/nooria-logo.jpg";

const Header = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const NAV_LINKS = useMemo(() => {
    const links = [
      { to: "/", label: "Accueil" },
      ...(isAdmin ? [{ to: "/profil", label: "Tableau de bord" }] : []),
      { to: "/diagnostic", label: "Diagnostic IA" },
      { to: "/nos-solutions", label: "Nos solutions" },
      { to: "/blog", label: "Blog" },
      { to: "/a-propos", label: "À propos" },
      ...(!isAdmin ? [{ to: "/profil", label: "Mon diagnostic" }] : []),
    ];
    return links;
  }, [isAdmin]);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowLogout(false);
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src={nooriaLogo} alt="NOORIA" className="h-10 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</span>
                <Button size="sm" variant="outline" onClick={() => setShowLogout(true)}>
                  Connecté
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <Link to="/profil">Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Déconnexion</DialogTitle>
            <DialogDescription>
              Voulez-vous vous déconnecter de votre compte ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => setShowLogout(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
