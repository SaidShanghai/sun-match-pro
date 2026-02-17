import { Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sun className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SolairePro</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          <Link to="/diagnostic" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Diagnostic
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link to="/diagnostic">Lancer mon diagnostic</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
