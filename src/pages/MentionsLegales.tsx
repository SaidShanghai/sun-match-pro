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
  { id: "responsabilite", title: "Limitation de responsabilité" },
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
          <p>Le site internet sungpt.ma (ci-après « le Site ») est édité par :</p>
          <p>
            <strong>AFRICACOM SARL</strong><br />
            Forme juridique : Société à Responsabilité Limitée (SARL) de droit marocain<br />
            Marque commerciale exploitée : <strong>SOLARBOX</strong><br />
            Siège social : 10, rue Liberté, Casablanca, Maroc<br />
            Email de contact : privacy@sungpt.ma<br />
            Registre du commerce : Casablanca
          </p>
          <p>SOLARBOX est une marque commerciale d'AFRICACOM SARL dédiée au diagnostic solaire et à la mise en relation entre particuliers/entreprises et installateurs photovoltaïques certifiés au Maroc. La plateforme propose un service de diagnostic gratuit permettant d'évaluer le potentiel d'installation solaire à partir de l'analyse de la consommation électrique de l'utilisateur.</p>
        </section>

        <section id="directeur">
          <h2>Directeur de la publication</h2>
          <p>Le directeur de la publication du Site est AFRICACOM SARL, représentée par son gérant en exercice.</p>
          <p>Conformément aux dispositions légales en vigueur, le directeur de la publication est responsable du contenu éditorial publié sur le Site. Toute demande relative au contenu du Site peut être adressée à l'adresse email : privacy@sungpt.ma.</p>
        </section>

        <section id="hebergement">
          <h2>Hébergement</h2>
          <p>Le Site et ses données sont hébergés par :</p>
          <p>
            <strong>Supabase Inc.</strong><br />
            Infrastructure : Amazon Web Services (AWS)<br />
            Région de déploiement : eu-west-1 (Irlande, Union Européenne)<br />
            Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://supabase.com</a>
          </p>
          <p>L'infrastructure d'hébergement bénéficie des certifications et mesures de sécurité suivantes :</p>
          <ul>
            <li>Certification SOC 2 Type II attestant du respect des normes de sécurité, disponibilité, intégrité et confidentialité ;</li>
            <li>Chiffrement des données au repos (AES-256) et en transit (TLS 1.2+) ;</li>
            <li>Sauvegardes automatiques quotidiennes avec rétention configurable ;</li>
            <li>Plan de reprise d'activité (PRA) et haute disponibilité de l'infrastructure.</li>
          </ul>
          <p>L'hébergement au sein de l'Union Européenne garantit un niveau de protection des données conforme aux standards internationaux et compatible avec les exigences de la loi marocaine n°09-08 relative à la protection des données personnelles.</p>
        </section>

        <section id="propriete">
          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble des contenus publiés sur le Site sungpt.ma sont la propriété exclusive d'AFRICACOM SARL et sont protégés par les dispositions du droit marocain et des conventions internationales relatives à la propriété intellectuelle, et notamment la loi n°2-00 relative aux droits d'auteur et droits voisins. Sont notamment protégés :</p>
          <ul>
            <li>Les textes, rédactionnels, articles et contenus éditoriaux ;</li>
            <li>Les images, photographies, illustrations et éléments graphiques ;</li>
            <li>L'interface utilisateur, le design, l'architecture et l'ergonomie du Site ;</li>
            <li>Les algorithmes de calcul, les modèles statistiques et les bases de données ;</li>
            <li>Les logotypes, marques et dénominations commerciales, y compris le nom « SOLARBOX » ;</li>
            <li>Le code source et les développements logiciels propriétaires.</li>
          </ul>
          <p>Toute reproduction ou représentation, totale ou partielle, du Site ou de l'un de ses éléments, par quelque procédé que ce soit, sans l'autorisation écrite préalable d'AFRICACOM SARL, est strictement interdite et constitue une contrefaçon sanctionnée par les articles 575 et suivants du Code pénal marocain.</p>
          <p>L'Utilisateur s'interdit notamment de reproduire, copier, modifier, adapter, distribuer, afficher, transmettre ou exploiter de quelque manière que ce soit les contenus du Site à des fins commerciales ou non commerciales, sans autorisation écrite préalable.</p>
        </section>

        <section id="donnees">
          <h2>Données personnelles</h2>
          <p>Le traitement des données personnelles des utilisateurs du Site est effectué par AFRICACOM SARL en qualité de responsable du traitement, conformément à la loi marocaine n°09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à son décret d'application n°2-09-165 du 21 mai 2009.</p>
          <p>Les modalités de collecte, les finalités des traitements, les durées de conservation, les mesures de sécurité et les droits des utilisateurs sont décrits de manière exhaustive dans la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link>, accessible à l'adresse : sungpt.ma/privacy.</p>
          <p>Conformément aux articles 7, 8 et 9 de la loi n°09-08, les utilisateurs disposent d'un droit d'accès, de rectification, de suppression et d'opposition sur leurs données personnelles. Pour exercer ces droits, il convient d'adresser une demande par email à : <strong>privacy@sungpt.ma</strong>.</p>
          <p>L'autorité de contrôle compétente en matière de protection des données personnelles au Maroc est :</p>
          <p>
            <strong>CNDP</strong> – Commission Nationale de contrôle de la protection des Données à caractère Personnel<br />
            Angle Boulevard Annakhil et Avenue Imam Malik, Hay Riad, Rabat, Maroc<br />
            Site web : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.cndp.ma</a>
          </p>
        </section>

        <section id="cookies">
          <h2>Cookies</h2>
          <p>Le Site utilise exclusivement des cookies techniques strictement nécessaires au fonctionnement du service. Ces cookies permettent :</p>
          <ul>
            <li>La gestion de la session de navigation et l'authentification sécurisée de l'utilisateur ;</li>
            <li>La sauvegarde temporaire de la progression du diagnostic solaire en cours ;</li>
            <li>La mémorisation des préférences de consentement relatives à la bannière cookies.</li>
          </ul>
          <p><strong>Aucun cookie analytique, publicitaire, de tracking ou de profilage n'est déposé sur le terminal de l'utilisateur.</strong> Le Site ne recourt à aucun outil de mesure d'audience tiers (Google Analytics, Facebook Pixel, etc.) ni à aucune technologie de suivi comportemental.</p>
          <p>Les cookies techniques étant strictement nécessaires au fonctionnement du service, ils ne requièrent pas le consentement préalable de l'utilisateur conformément aux recommandations de la CNDP. L'utilisateur conserve néanmoins la possibilité de configurer son navigateur pour refuser tout ou partie des cookies, étant informé que cette action pourrait affecter certaines fonctionnalités du Site.</p>
        </section>

        <section id="responsabilite">
          <h2>Limitation de responsabilité</h2>
          <p>AFRICACOM SARL agit en qualité de plateforme de diagnostic et de mise en relation. À ce titre :</p>
          <ul>
            <li>Les résultats du diagnostic solaire sont fournis à titre purement indicatif et informatif. Ils ne constituent en aucun cas un devis contractuel, un engagement de résultat ou un conseil en investissement ;</li>
            <li>Les devis, installations et prestations sont réalisés par les installateurs partenaires référencés sur la plateforme, qui sont des professionnels indépendants seuls responsables de la qualité, de la conformité et des délais de leurs services ;</li>
            <li>AFRICACOM SARL ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du Site, des résultats du diagnostic, des prestations des installateurs partenaires ou de l'indisponibilité temporaire du Service.</li>
          </ul>
          <p>AFRICACOM SARL s'efforce de maintenir le Site accessible 24 heures sur 24 et 7 jours sur 7, mais ne peut garantir une disponibilité permanente et ininterrompue. L'accès au Site peut être suspendu sans préavis pour des raisons de maintenance, de mise à jour technique ou de force majeure, sans que cela puisse donner lieu à une quelconque compensation.</p>
          <p>Les liens hypertextes présents sur le Site, renvoyant vers des sites internet tiers, sont fournis à titre informatif. AFRICACOM SARL n'exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu ou à leur politique de protection des données.</p>
        </section>

        <section id="droit-applicable">
          <h2>Droit applicable</h2>
          <p>Le présent Site, ses contenus et les présentes Mentions Légales sont soumis au droit marocain, et notamment aux dispositions du Dahir des Obligations et Contrats (DOC), de la loi n°09-08 relative à la protection des données personnelles, de la loi n°2-00 relative aux droits d'auteur et droits voisins, et de la loi n°31-08 édictant des mesures de protection du consommateur.</p>
          <p>Tout litige relatif à l'utilisation du Site, à l'interprétation ou à l'exécution des présentes Mentions Légales relève de la compétence exclusive des juridictions de Casablanca, Maroc, nonobstant pluralité de défendeurs ou appel en garantie.</p>
          <p>Préalablement à toute action judiciaire, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours à compter de la notification du différend par l'une des parties à l'autre, par lettre recommandée avec accusé de réception ou par email à l'adresse privacy@sungpt.ma.</p>
        </section>

      </LegalPageLayout>
    </>
  );
};

export default MentionsLegales;
