import { Link } from "react-router-dom";
import SolarboxLogo from "@/components/SolarboxLogo";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <SolarboxLogo size="sm" />
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/mentions-legales" className="hover:text-foreground transition-colors">Mentions Légales</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/cgv" className="hover:text-foreground transition-colors">CGV</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Politique de Confidentialité</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SOLARBOX. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
