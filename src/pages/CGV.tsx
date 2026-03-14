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
          <p>Les présentes Conditions Générales d'Utilisation et de Vente (ci-après « les CGV ») régissent l'accès et l'utilisation du site internet sungpt.ma (ci-après « le Site ») et de l'ensemble des services qui y sont proposés (ci-après « le Service » ou « les Services »).</p>
          <p>Le Site est édité et exploité par :</p>
          <p>
            <strong>AFRICACOM SARL</strong><br />
            Forme juridique : Société à Responsabilité Limitée (SARL)<br />
            Siège social : 10, rue Liberté, Casablanca, Maroc<br />
            Marque commerciale exploitée : <strong>SOLARBOX</strong><br />
            Email de contact : privacy@sungpt.ma
          </p>
          <p>Le Service SOLARBOX propose un diagnostic solaire personnalisé gratuit à destination des particuliers et des entreprises situés au Maroc, leur permettant d'évaluer le potentiel d'installation photovoltaïque de leur bien immobilier à partir de l'analyse de leur consommation électrique.</p>
        </section>

        <section id="acceptation">
          <h2>Article 2 – Acceptation des CGV</h2>
          <p>L'utilisation du Service SOLARBOX, et notamment l'upload de tout document sur la plateforme, implique l'acceptation pleine et entière des présentes CGV ainsi que de la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link>, qui en fait partie intégrante.</p>
          <p>Cette acceptation est formalisée par une case à cocher obligatoire, que l'Utilisateur doit activer avant tout upload de document ou soumission de formulaire contenant des données personnelles. L'Utilisateur reconnaît avoir pris connaissance de l'ensemble des présentes CGV préalablement à cette validation.</p>
          <p>Les présentes CGV sont accessibles à tout moment sur le Site à l'adresse sungpt.ma/cgv. AFRICACOM SARL se réserve le droit de les modifier à tout moment. La version applicable est celle en vigueur à la date d'utilisation du Service par l'Utilisateur. Toute modification substantielle sera portée à la connaissance des Utilisateurs par tout moyen approprié.</p>
          <p>Si l'Utilisateur n'accepte pas les présentes CGV, il est invité à ne pas utiliser le Service et à quitter le Site.</p>
        </section>

        <section id="description">
          <h2>Article 3 – Description du service</h2>
          <p>SOLARBOX est un service de diagnostic solaire en ligne, entièrement gratuit et sans engagement pour l'Utilisateur. Le Service permet, à partir de l'analyse automatisée d'une facture ONEE (Office National de l'Électricité et de l'Eau potable), de générer une estimation personnalisée comprenant :</p>
          <ul>
            <li>La puissance photovoltaïque recommandée (en kWc) adaptée au profil de consommation de l'Utilisateur ;</li>
            <li>L'estimation de la production annuelle d'énergie solaire (en kWh), calculée à partir des données d'ensoleillement PVGIS pour la localisation géographique de l'Utilisateur ;</li>
            <li>Le calcul des économies potentielles sur la facture électrique (en MAD) et le taux d'autoconsommation estimé ;</li>
            <li>La projection du retour sur investissement (ROI) et du délai d'amortissement ;</li>
            <li>Des recommandations d'équipements (panneaux, onduleurs, batteries) adaptés au profil identifié ;</li>
            <li>La mise en relation, à la demande de l'Utilisateur, avec des installateurs photovoltaïques certifiés opérant dans sa région.</li>
          </ul>
          <p><strong>Important</strong> : le Service fournit des estimations à titre indicatif, établies sur la base des données communiquées par l'Utilisateur et des algorithmes de calcul PVGIS (Photovoltaic Geographical Information System). Ces estimations ne constituent en aucun cas un devis contractuel engageant AFRICACOM SARL sur les résultats présentés. Les performances réelles d'une installation photovoltaïque dépendent de nombreux facteurs (qualité de l'installation, conditions météorologiques, ombrage, orientation et inclinaison réelles du toit, évolution des tarifs ONEE) qui ne peuvent être intégralement modélisés par le Service.</p>
        </section>

        <section id="gratuite">
          <h2>Article 4 – Gratuité du service</h2>
          <p>Le Service SOLARBOX est fourni gratuitement à l'Utilisateur. Aucun paiement, abonnement, engagement financier ou contrepartie de quelque nature que ce soit n'est requis pour accéder au diagnostic solaire et aux résultats personnalisés.</p>
          <p>La gratuité du Service s'applique à l'ensemble des fonctionnalités accessibles sur le Site, y compris l'analyse OCR de la facture ONEE, la génération du rapport de diagnostic, la consultation des recommandations et la demande de mise en relation avec un installateur.</p>
          <p>AFRICACOM SARL se réserve le droit de proposer ultérieurement des services complémentaires payants, qui feraient l'objet de conditions tarifaires spécifiques portées à la connaissance de l'Utilisateur préalablement à toute souscription. En aucun cas l'accès aux fonctionnalités gratuites existantes ne sera conditionné à la souscription d'un service payant.</p>
        </section>

        <section id="obligations">
          <h2>Article 5 – Obligations de l'utilisateur</h2>
          <p>En utilisant le Service SOLARBOX, l'Utilisateur s'engage à :</p>
          <ul>
            <li><strong>Exactitude des informations</strong> : fournir des informations exactes, complètes et sincères lors du diagnostic. L'Utilisateur est seul responsable de la véracité des données qu'il communique. AFRICACOM SARL ne saurait être tenue responsable des conséquences résultant de la fourniture d'informations erronées ou incomplètes ;</li>
            <li><strong>Utilisation licite</strong> : ne pas utiliser le Service à des fins frauduleuses, illicites, contraires à l'ordre public, aux bonnes mœurs ou aux présentes CGV ;</li>
            <li><strong>Propriété des documents</strong> : ne téléverser que des documents (factures ONEE) dont il est le titulaire légitime ou pour lesquels il dispose d'une autorisation expresse du titulaire ;</li>
            <li><strong>Sécurité de la plateforme</strong> : ne pas tenter de compromettre la sécurité, l'intégrité ou le fonctionnement normal de la plateforme, notamment par l'introduction de virus, logiciels malveillants, tentatives d'intrusion, attaques par déni de service ou toute autre méthode visant à altérer le fonctionnement du Site ;</li>
            <li><strong>Respect de la propriété intellectuelle</strong> : ne pas reproduire, copier, modifier, distribuer ou exploiter de quelque manière que ce soit les contenus du Site sans l'autorisation écrite préalable d'AFRICACOM SARL ;</li>
            <li><strong>Utilisation personnelle</strong> : utiliser le Service pour ses propres besoins et ne pas revendre, sous-licencier ou mettre à disposition de tiers les résultats du diagnostic à des fins commerciales sans autorisation.</li>
          </ul>
          <p>Tout manquement aux obligations ci-dessus pourra entraîner la suspension ou la résiliation immédiate de l'accès au Service, sans préjudice des dommages-intérêts qui pourraient être réclamés par AFRICACOM SARL.</p>
        </section>

        <section id="responsabilite">
          <h2>Article 6 – Limitation de responsabilité</h2>
          <p>Les résultats du diagnostic SOLARBOX sont fournis à titre purement indicatif et informatif, sur la base des données communiquées par l'Utilisateur et des algorithmes de calcul PVGIS. AFRICACOM SARL décline toute responsabilité quant à :</p>
          <ul>
            <li>L'exactitude, l'exhaustivité ou l'actualité des résultats du diagnostic, qui constituent des estimations et non des engagements contractuels ;</li>
            <li>Les décisions d'investissement prises par l'Utilisateur sur la base des estimations fournies par le Service ;</li>
            <li>Les écarts entre les estimations du diagnostic et les performances réelles d'une installation photovoltaïque, qui dépendent de facteurs indépendants de la volonté d'AFRICACOM SARL (conditions météorologiques, qualité de l'installation, évolution réglementaire et tarifaire) ;</li>
            <li>La qualité, la fiabilité et les délais des prestations réalisées par les installateurs partenaires référencés sur la plateforme, qui sont des professionnels indépendants seuls responsables de leurs engagements contractuels vis-à-vis de l'Utilisateur ;</li>
            <li>Les interruptions, dysfonctionnements ou indisponibilités temporaires du Site, qu'elles soient dues à des opérations de maintenance, des pannes techniques, des cas de force majeure ou des circonstances échappant au contrôle raisonnable d'AFRICACOM SARL.</li>
          </ul>
          <p>En tout état de cause, la responsabilité d'AFRICACOM SARL, si elle devait être engagée, serait limitée aux dommages directs, prévisibles et personnels subis par l'Utilisateur, à l'exclusion de tout dommage indirect (perte de chance, manque à gagner, perte de données, préjudice commercial).</p>
        </section>

        <section id="propriete">
          <h2>Article 7 – Propriété intellectuelle</h2>
          <p>L'ensemble des éléments composant le Site sungpt.ma et le Service SOLARBOX sont la propriété exclusive d'AFRICACOM SARL et sont protégés par les dispositions du droit marocain et des conventions internationales relatives à la propriété intellectuelle. Sont notamment protégés :</p>
          <ul>
            <li>Le nom commercial « SOLARBOX » et les logos associés ;</li>
            <li>L'architecture, le design, l'ergonomie et l'interface graphique du Site ;</li>
            <li>Les textes, illustrations, photographies et contenus éditoriaux ;</li>
            <li>Les algorithmes de calcul, les modèles de données et les bases de données ;</li>
            <li>Le code source, les logiciels et les programmes informatiques développés pour le Service.</li>
          </ul>
          <p>Toute reproduction, représentation, modification, publication, adaptation, distribution ou exploitation de tout ou partie des éléments du Site, par quelque moyen que ce soit, sans l'autorisation écrite préalable d'AFRICACOM SARL, est strictement interdite et constitue une contrefaçon sanctionnée par les articles 575 et suivants du Code pénal marocain et les dispositions de la loi n°2-00 relative aux droits d'auteur et droits voisins.</p>
        </section>

        <section id="donnees">
          <h2>Article 8 – Données personnelles</h2>
          <p>Le traitement des données personnelles des Utilisateurs est régi par la <Link to="/privacy" className="text-primary underline font-medium">Politique de Confidentialité</Link> accessible à l'adresse sungpt.ma/privacy, qui fait partie intégrante des présentes CGV.</p>
          <p>En acceptant les présentes CGV, l'Utilisateur déclare avoir pris connaissance de la Politique de Confidentialité et consentir expressément au traitement de ses données personnelles dans les conditions qui y sont décrites, conformément aux dispositions de la loi marocaine n°09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.</p>
          <p>L'Utilisateur est informé que les données personnelles collectées dans le cadre du Service sont traitées avec les mesures de sécurité appropriées et ne sont conservées que pendant les durées nécessaires aux finalités du traitement, telles que détaillées dans la Politique de Confidentialité.</p>
        </section>

        <section id="modification">
          <h2>Article 9 – Modification et interruption du service</h2>
          <p>AFRICACOM SARL se réserve le droit, à tout moment et sans préavis, de :</p>
          <ul>
            <li>Modifier les caractéristiques, les fonctionnalités ou les conditions d'accès au Service, afin de l'adapter aux évolutions technologiques, réglementaires ou commerciales ;</li>
            <li>Suspendre temporairement l'accès au Service pour des raisons de maintenance, de mise à jour ou d'amélioration technique ;</li>
            <li>Interrompre définitivement tout ou partie du Service.</li>
          </ul>
          <p>Aucune modification, suspension ou interruption du Service ne pourra donner lieu à une quelconque indemnité, compensation ou dommages-intérêts au profit de l'Utilisateur, le Service étant fourni à titre gratuit.</p>
          <p>AFRICACOM SARL s'efforcera, dans la mesure du possible, d'informer les Utilisateurs de toute interruption programmée du Service avec un préavis raisonnable.</p>
        </section>

        <section id="droit-applicable">
          <h2>Article 10 – Droit applicable et juridiction compétente</h2>
          <p>Les présentes CGV sont régies par le droit marocain, et notamment par les dispositions du Dahir des Obligations et Contrats (DOC), la loi n°31-08 édictant des mesures de protection du consommateur et la loi n°09-08 relative à la protection des données personnelles.</p>
          <p>En cas de litige relatif à l'interprétation, l'exécution ou la validité des présentes CGV, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours à compter de la notification du différend. À défaut de résolution amiable, tout litige sera soumis à la compétence exclusive des tribunaux compétents de Casablanca, Maroc, nonobstant pluralité de défendeurs ou appel en garantie.</p>
          <p>Si l'une des clauses des présentes CGV devait être déclarée nulle ou inapplicable par une décision de justice, les autres clauses resteraient en vigueur et conserveraient leur plein effet.</p>
        </section>

      </LegalPageLayout>
    </>
  );
};

export default CGV;
