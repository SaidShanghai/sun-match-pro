import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import JsonLd from "@/components/seo/JsonLd";
import LegalPageLayout from "@/components/LegalPageLayout";

const sections = [
  { id: "editeur", title: "Éditeur du site" },
  { id: "directeur", title: "Directeur de la publication" },
  { id: "hebergement", title: "Hébergement" },
  { id: "propriete", title: "Propriété intellectuelle" },
  { id: "donnees", title: "Données personnelles" },
  { id: "cookies", title: "Cookies" },
  { id: "droit-applicable", title: "Droit applicable" },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://sungpt.ma/mentions-legales",
  name: "Mentions Légales – SOLARBOX",
  description: "Mentions légales du site sungpt.ma édité par AFRICACOM SARL, exploitant la marque SOLARBOX.",
  isPartOf: { "@id": "https://sungpt.ma/#website" },
  inLanguage: "fr-MA",
};

const MentionsLegales = () => {
  usePageMeta({
    title: "Mentions Légales – SOLARBOX",
    description: "Mentions légales du site sungpt.ma édité par AFRICACOM SARL, exploitant la marque SOLARBOX.",
  });

  return (
    <>
      <JsonLd schema={schema} />
      <LegalPageLayout title="Mentions Légales" icon="file" lastUpdated="14 mars 2026" sections={sections}>
        <section id="editeur">
          <h2>Éditeur du site</h2>
          <p>
            Raison sociale : <strong>AFRICACOM SARL</strong><br />
            Marque exploitée : <strong>SOLARBOX</strong><br />
            Adresse : 10, rue Liberté, Casablanca, Maroc<br />
            Email : privacy@sungpt.ma<br />
            Registre du commerce : Casablanca
          </p>
        </section>

        <section id="directeur">
          <h2>Directeur de la publication</h2>
          <p>AFRICACOM SARL</p>
        </section>

        <section id="hebergement">
          <h2>Hébergement</h2>
          <p>
            Le site sungpt.ma est hébergé par :<br />
            Supabase Inc. – Infrastructure AWS, région eu-west-1 (Irlande, Union Européenne)<br />
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://supabase.com</a>
          </p>
        </section>

        <section id="propriete">
          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble des contenus publiés sur sungpt.ma (textes, images, interface, algorithmes, logotypes) sont la propriété exclusive d'AFRICACOM SARL et sont protégés par les dispositions du droit marocain relatif à la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable d'AFRICACOM SARL est strictement interdite.</p>
        </section>

        <section id="donnees">
          <h2>Données personnelles</h2>
          <p>Le traitement des données personnelles des utilisateurs est effectué conformément à la loi marocaine n°09-08 et est décrit dans la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link> accessible à l'adresse : sungpt.ma/privacy</p>
        </section>

        <section id="cookies">
          <h2>Cookies</h2>
          <p>Le site utilise uniquement des cookies techniques nécessaires au fonctionnement du service. Aucun cookie de tracking ou publicitaire n'est déposé.</p>
        </section>

        <section id="droit-applicable">
          <h2>Droit applicable</h2>
          <p>Le présent site et ses contenus sont soumis au droit marocain. Tout litige relatif à l'utilisation du site relève de la compétence exclusive des juridictions de Casablanca, Maroc.</p>
        </section>
      </LegalPageLayout>
    </>
  );
};

export default MentionsLegales;
