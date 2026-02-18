import nooriaLogo from "@/assets/nooria-logo.jpg";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={nooriaLogo} alt="NOORIA" className="h-10 w-auto object-contain" />
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
