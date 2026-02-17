import { Sun } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NOORIA</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NOORIA. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
