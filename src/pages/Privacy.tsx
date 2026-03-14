import { usePageMeta } from "@/hooks/usePageMeta";
import JsonLd from "@/components/seo/JsonLd";
import LegalPageLayout from "@/components/LegalPageLayout";

const sections = [
  { id: "objet", title: "Objet et portée" },
  { id: "responsable", title: "Responsable du traitement" },
  { id: "conformite", title: "Conformité réglementaire" },
  { id: "donnees", title: "Données collectées" },
  { id: "collecte", title: "Modalités de collecte" },
  { id: "finalites", title: "Finalités des traitements" },
  { id: "partage", title: "Partage des données" },
  { id: "hebergement", title: "Hébergement et transferts" },
  { id: "conservation", title: "Durée de conservation" },
  { id: "securite", title: "Sécurité des données" },
  { id: "cookies", title: "Cookies" },
  { id: "droits", title: "Droits des utilisateurs" },
  { id: "modifications", title: "Modifications" },
  { id: "droit-applicable", title: "Droit applicable" },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://sungpt.ma/privacy",
  name: "Politique de Confidentialité – SOLARBOX",
  description: "Politique de confidentialité de SOLARBOX (AFRICACOM SARL). Traitement des données personnelles conformément à la loi marocaine n°09-08.",
  isPartOf: { "@id": "https://sungpt.ma/#website" },
  inLanguage: "fr-MA",
};

const Privacy = () => {
  usePageMeta({
    title: "Politique de Confidentialité – SOLARBOX",
    description: "Politique de confidentialité de SOLARBOX (AFRICACOM SARL). Traitement des données personnelles conformément à la loi marocaine n°09-08.",
  });

  return (
    <>
      <JsonLd schema={schema} />
      <LegalPageLayout title="Politique de Confidentialité" icon="shield" lastUpdated="14 mars 2026" sections={sections}>
        <section id="objet">
          <h2>Article 1 – Objet et portée</h2>
          <p>La présente Politique de Confidentialité définit les conditions dans lesquelles la société AFRICACOM SARL, exploitant la marque SOLARBOX via le site sungpt.ma, collecte, traite, utilise, conserve et protège les données à caractère personnel des utilisateurs. Elle s'applique à l'ensemble des traitements réalisés via le site internet sungpt.ma.</p>
        </section>

        <section id="responsable">
          <h2>Article 2 – Responsable du traitement</h2>
          <p>Le responsable du traitement est :</p>
          <p><strong>AFRICACOM SARL</strong><br />10, rue Liberté, Casablanca, Maroc<br />Email : privacy@sungpt.ma</p>
          <p>AFRICACOM SARL agit en qualité de responsable du traitement au sens de la loi marocaine n°09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, sous le contrôle de la Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel (CNDP).</p>
        </section>

        <section id="conformite">
          <h2>Article 3 – Conformité réglementaire</h2>
          <p>AFRICACOM SARL s'engage à traiter les données personnelles dans le strict respect de la loi marocaine n°09-08, selon les principes de licéité, loyauté, transparence, proportionnalité, limitation des finalités, sécurité et confidentialité.</p>
        </section>

        <section id="donnees">
          <h2>Article 4 – Données collectées</h2>
          <p>Dans le cadre de l'utilisation des services SOLARBOX, les données suivantes sont susceptibles d'être collectées :</p>
          <ul>
            <li>Les données extraites de la facture ONEE uploadée par l'utilisateur (consommation électrique, montants, localisation géographique) ;</li>
            <li>Toute information complémentaire communiquée volontairement par l'utilisateur lors du diagnostic.</li>
          </ul>
          <p>L'image ou le fichier de la facture ONEE n'est pas conservé. Il est traité à la volée par notre système d'analyse puis supprimé immédiatement. Seules les données extraites sont conservées.</p>
        </section>

        <section id="collecte">
          <h2>Article 5 – Modalités de collecte</h2>
          <p>Les données sont collectées directement auprès de l'utilisateur, avec son consentement explicite obtenu via une case à cocher obligatoire validant les présentes CGV et Politique de Confidentialité, préalablement à tout upload de document.</p>
        </section>

        <section id="finalites">
          <h2>Article 6 – Finalités des traitements</h2>
          <p>Les données sont collectées et traitées exclusivement pour :</p>
          <ul>
            <li>La génération du diagnostic solaire personnalisé ;</li>
            <li>La production et la conservation du devis SOLARBOX de l'utilisateur ;</li>
            <li>L'amélioration continue des algorithmes de diagnostic ;</li>
            <li>Le respect des obligations légales et contractuelles.</li>
          </ul>
        </section>

        <section id="partage">
          <h2>Article 7 – Partage des données</h2>
          <p>Les données personnelles des utilisateurs ne sont transmises à aucun tiers, y compris les installateurs partenaires référencés sur la plateforme. Elles demeurent exclusivement au sein des systèmes d'AFRICACOM SARL.</p>
        </section>

        <section id="hebergement">
          <h2>Article 8 – Hébergement et transferts</h2>
          <p>Les données sont hébergées sur l'infrastructure Supabase Cloud, région eu-west-1 (Irlande, Union Européenne), offrant un niveau de protection adéquat reconnu compatible avec les exigences de la loi marocaine n°09-08.</p>
        </section>

        <section id="conservation">
          <h2>Article 9 – Durée de conservation</h2>
          <p>Les données personnelles sont conservées pendant une durée maximale de 12 mois à compter de leur collecte. À l'issue de ce délai, elles sont supprimées automatiquement des systèmes d'AFRICACOM SARL.</p>
        </section>

        <section id="securite">
          <h2>Article 10 – Sécurité des données</h2>
          <p>AFRICACOM SARL met en œuvre les mesures techniques et organisationnelles appropriées pour assurer la sécurité des données, notamment le chiffrement, le contrôle des accès et la surveillance des systèmes.</p>
        </section>

        <section id="cookies">
          <h2>Article 11 – Cookies</h2>
          <p>Le site sungpt.ma utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service. Aucun cookie analytique, publicitaire ou de tracking tiers n'est utilisé.</p>
        </section>

        <section id="droits">
          <h2>Article 12 – Droits des utilisateurs</h2>
          <p>Conformément à la loi n°09-08, l'utilisateur dispose des droits d'accès, de rectification, de suppression et d'opposition. Toute demande doit être adressée à : <strong>privacy@sungpt.ma</strong>. AFRICACOM SARL s'engage à répondre dans un délai de 30 jours.</p>
        </section>

        <section id="modifications">
          <h2>Article 13 – Modifications</h2>
          <p>AFRICACOM SARL se réserve le droit de modifier la présente Politique à tout moment. La version applicable est celle en vigueur au moment de l'utilisation du service.</p>
        </section>

        <section id="droit-applicable">
          <h2>Article 14 – Droit applicable</h2>
          <p>La présente Politique est régie par le droit marocain. Tout litige relève de la compétence exclusive des juridictions marocaines compétentes.</p>
        </section>
      </LegalPageLayout>
    </>
  );
};

export default Privacy;
