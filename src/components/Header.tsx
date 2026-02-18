import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import nooriaLogo from "@/assets/nooria-logo.jpg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={nooriaLogo} alt="NOORIA" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/diagnostic" className="text-sm font-medium hover:text-primary transition-colors">
              Diagnostic
            </Link>
            <Link to="/profil" className="text-sm font-medium hover:text-primary transition-colors">
              Mon profil
            </Link>
          </nav>
          <Button asChild size="sm">
            <Link to="/diagnostic">Mon diagnostic</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
