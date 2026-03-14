import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ArrowUp, Scale, Shield, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  icon: "scale" | "shield" | "file";
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

const iconMap = {
  scale: Scale,
  shield: Shield,
  file: FileText,
};

const LegalPageLayout = ({ title, icon, lastUpdated, sections, children }: LegalPageLayoutProps) => {
  const location = useLocation();
  const [showTop, setShowTop] = useState(false);
  const Icon = iconMap[icon];

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const legalPages = [
    { path: "/mentions-legales", label: "Mentions Légales" },
    { path: "/cgv", label: "CGV" },
    { path: "/privacy", label: "Confidentialité" },
  ];

  return (
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </div>

        {/* Table of contents */}
        <div className="border border-border rounded-xl p-5 mb-10 bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Sommaire</p>
          <ol className="space-y-1.5">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-baseline gap-2"
                >
                  <span className="text-xs font-mono text-muted-foreground/60 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-foreground/80 [&_section]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:mt-0 [&_section]:mb-8 [&_section]:pb-8 [&_section]:border-b [&_section]:border-border/50 [&_section:last-child]:border-b-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          {children}
        </div>

        {/* Cross-links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Documents juridiques</p>
          <div className="flex flex-wrap gap-3">
            {legalPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  location.pathname === page.path
                    ? "bg-primary/10 border-primary text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </main>
  );
};

export default LegalPageLayout;
