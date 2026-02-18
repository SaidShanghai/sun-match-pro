import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import nooriaLogo from "@/assets/nooria-logo.jpg";

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/diagnostic", label: "Diagnostic IA" },
  { to: "/profil", label: "Mon profil" },
];

const Header = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getScale = (i: number) => {
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(i - hoveredIndex);
    if (dist === 0) return 1.35;
    if (dist === 1) return 1.15;
    return 1;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={nooriaLogo} alt="NOORIA" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `scale(${getScale(i)})`,
                  transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "inline-block",
                  transformOrigin: "center bottom",
                }}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
