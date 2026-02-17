import { Sun } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-fun">
                <Sun className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold font-display">SolairePro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Le comparateur d'installateurs solaires le plus fun de France 🇫🇷☀️
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Liens utiles</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 contact@solairepro.fr</li>
              <li>📞 01 23 45 67 89</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SolairePro · Fait avec ☀️ et 💚
        </div>
      </div>
    </footer>
  );
};

export default Footer;
