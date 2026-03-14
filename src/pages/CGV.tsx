import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import JsonLd from "@/components/seo/JsonLd";
import LegalPageLayout from "@/components/LegalPageLayout";

const sections = [
  { id: "presentation", title: "Présentation" },
  { id: "acceptation", title: "Acceptation des CGV" },
  { id: "description", title: "Description du service" },
  { id: "gratuite", title: "Gratuité du service" },
  { id: "obligations", title: "Obligations de l'utilisateur" },
  { id: "responsabilite", title: "Limitation de responsabilité" },
  { id: "propriete", title: "Propriété intellectuelle" },
  { id: "donnees", title: "Données personnelles" },
  { id: "modification", title: "Modification du service" },
  { id: "droit-applicable", title: "Droit applicable et juridiction" },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://sungpt.ma/cgv",
  name: "Conditions Générales d'Utilisation et de Vente – SOLARBOX",
  description: "CGV de SOLARBOX (AFRICACOM SARL). Conditions d'utilisation du service de diagnostic solaire gratuit sungpt.ma.",
  isPartOf: { "@id": "https://sungpt.ma/#website" },
  inLanguage: "fr-MA",
};

const CGV = () => {
  usePageMeta({
    title: "CGV – SOLARBOX",
    description: "CGV de SOLARBOX (AFRICACOM SARL). Conditions d'utilisation du service de diagnostic solaire gratuit sungpt.ma.",
  });

  return (
    <>
      <JsonLd schema={schema} />
      <LegalPageLayout title="Conditions Générales d'Utilisation et de Vente" icon="scale" lastUpdated="14 mars 2026" sections={sections}>
        <section id="presentation">
          <h2>Article 1 – Présentation</h2>
          <p>Le site sungpt.ma est édité par AFRICACOM SARL, 10 rue Liberté, Casablanca, Maroc (email : privacy@sungpt.ma), exploitant la marque SOLARBOX. Le service propose un diagnostic solaire personnalisé gratuit à destination des particuliers et entreprises au Maroc.</p>
        </section>

        <section id="acceptation">
          <h2>Article 2 – Acceptation des CGV</h2>
          <p>L'utilisation du service SOLARBOX, et notamment l'upload de tout document sur la plateforme, implique l'acceptation pleine et entière des présentes CGV ainsi que de la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link>. Cette acceptation est formalisée par une case à cocher obligatoire avant tout upload.</p>
        </section>

        <section id="description">
          <h2>Article 3 – Description du service</h2>
          <p>SOLARBOX est un service de diagnostic solaire en ligne, entièrement gratuit et sans engagement pour l'utilisateur. Il permet, à partir de l'analyse d'une facture ONEE, de générer une estimation personnalisée de la puissance solaire recommandée, des économies potentielles et du retour sur investissement. Le service ne constitue pas un devis contractuel engageant AFRICACOM SARL sur les résultats estimés.</p>
        </section>

        <section id="gratuite">
          <h2>Article 4 – Gratuité du service</h2>
          <p>Le service SOLARBOX est fourni gratuitement à l'utilisateur. Aucun paiement, abonnement ou engagement financier n'est requis pour accéder au diagnostic.</p>
        </section>

        <section id="obligations">
          <h2>Article 5 – Obligations de l'utilisateur</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul>
            <li>Fournir des informations exactes et sincères lors du diagnostic ;</li>
            <li>Ne pas utiliser le service à des fins frauduleuses, illicites ou contraires aux présentes CGV ;</li>
            <li>Ne pas tenter de compromettre la sécurité ou le fonctionnement de la plateforme.</li>
          </ul>
        </section>

        <section id="responsabilite">
          <h2>Article 6 – Limitation de responsabilité</h2>
          <p>Les résultats du diagnostic SOLARBOX sont fournis à titre indicatif, sur la base des données communiquées par l'utilisateur et des algorithmes de calcul PVGIS. AFRICACOM SARL ne saurait être tenue responsable des décisions prises par l'utilisateur sur la base de ces estimations. Les économies réelles peuvent varier selon les conditions d'installation, l'ensoleillement local et l'évolution des tarifs ONEE.</p>
        </section>

        <section id="propriete">
          <h2>Article 7 – Propriété intellectuelle</h2>
          <p>L'ensemble des contenus du site sungpt.ma (textes, visuels, algorithmes, interface) sont la propriété exclusive d'AFRICACOM SARL et sont protégés par le droit marocain et international. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
        </section>

        <section id="donnees">
          <h2>Article 8 – Données personnelles</h2>
          <p>Le traitement des données personnelles est régi par la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link> disponible à l'adresse sungpt.ma/privacy, qui fait partie intégrante des présentes CGV.</p>
        </section>

        <section id="modification">
          <h2>Article 9 – Modification du service</h2>
          <p>AFRICACOM SARL se réserve le droit de modifier, suspendre ou interrompre le service SOLARBOX à tout moment, sans préavis ni indemnité.</p>
        </section>

        <section id="droit-applicable">
          <h2>Article 10 – Droit applicable et juridiction</h2>
          <p>Les présentes CGV sont soumises au droit marocain. Tout litige sera soumis à la compétence exclusive des juridictions de Casablanca.</p>
        </section>
      </LegalPageLayout>
    </>
  );
};

export default CGV;
