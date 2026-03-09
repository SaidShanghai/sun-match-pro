import SolarboxLogo from "@/components/SolarboxLogo";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <SolarboxLogo size="sm" />
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SOLARBOX. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
