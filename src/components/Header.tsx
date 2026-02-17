import { Sun, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-fun transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display">
            Solaire<span className="text-gradient-fun">Pro</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          <Link to="/diagnostic" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Diagnostic
          </Link>
        </nav>
        <Button asChild size="sm" className="rounded-full gap-2 px-5">
          <Link to="/diagnostic">
            <Sparkles className="h-4 w-4" />
            Mon diagnostic
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
