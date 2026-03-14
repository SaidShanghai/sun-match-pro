import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";

const MentionsLegales = () => {
  usePageMeta({
    title: "Mentions Légales – SOLARBOX",
    description: "Mentions légales du site sungpt.ma édité par AFRICACOM SARL, exploitant la marque SOLARBOX.",
  });

  return (
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Mentions Légales – SOLARBOX</h1>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Éditeur du site</h2>
            <p>
              Raison sociale : <strong>AFRICACOM SARL</strong><br />
              Marque exploitée : <strong>SOLARBOX</strong><br />
              Adresse : 10, rue Liberté, Casablanca, Maroc<br />
              Email : privacy@sungpt.ma<br />
              Registre du commerce : Casablanca
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Directeur de la publication</h2>
            <p>AFRICACOM SARL</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hébergement</h2>
            <p>
              Le site sungpt.ma est hébergé par :<br />
              Supabase Inc. – Infrastructure AWS, région eu-west-1 (Irlande, Union Européenne)<br />
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://supabase.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Propriété intellectuelle</h2>
            <p>L'ensemble des contenus publiés sur sungpt.ma (textes, images, interface, algorithmes, logotypes) sont la propriété exclusive d'AFRICACOM SARL et sont protégés par les dispositions du droit marocain relatif à la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable d'AFRICACOM SARL est strictement interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Données personnelles</h2>
            <p>Le traitement des données personnelles des utilisateurs est effectué conformément à la loi marocaine n°09-08 et est décrit dans la <Link to="/privacy" className="text-primary underline">Politique de Confidentialité</Link> accessible à l'adresse : sungpt.ma/privacy</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
            <p>Le site utilise uniquement des cookies techniques nécessaires au fonctionnement du service. Aucun cookie de tracking ou publicitaire n'est déposé.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Droit applicable</h2>
            <p>Le présent site et ses contenus sont soumis au droit marocain. Tout litige relatif à l'utilisation du site relève de la compétence exclusive des juridictions de Casablanca, Maroc.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MentionsLegales;
