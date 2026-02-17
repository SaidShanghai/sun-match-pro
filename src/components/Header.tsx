import { Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NOOR<span style={{ color: "hsl(24 95% 53%)" }}>IA</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/diagnostic" className="text-sm font-medium hover:text-primary transition-colors">
              Diagnostic
            </Link>
            <Link to="/partenaires" className="text-sm font-medium hover:text-primary transition-colors">
              Partenaires
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
