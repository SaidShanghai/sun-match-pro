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
          <p>La présente Politique de Confidentialité (ci-après « la Politique ») a pour objet de définir les conditions dans lesquelles la société AFRICACOM SARL, société à responsabilité limitée de droit marocain, exploitant la marque commerciale SOLARBOX via le site internet sungpt.ma (ci-après « le Site »), collecte, traite, utilise, conserve et protège les données à caractère personnel de ses utilisateurs (ci-après « l'Utilisateur » ou « les Utilisateurs »).</p>
          <p>La présente Politique s'applique à l'ensemble des traitements de données à caractère personnel réalisés dans le cadre de l'utilisation du Site, y compris mais sans s'y limiter :</p>
          <ul>
            <li>La navigation sur le Site et l'accès aux pages d'information ;</li>
            <li>L'utilisation du service de diagnostic solaire en ligne ;</li>
            <li>L'upload et l'analyse automatisée de documents (factures ONEE) ;</li>
            <li>La création et la gestion d'un compte utilisateur ;</li>
            <li>La soumission de demandes de devis ou de rappel ;</li>
            <li>Toute interaction avec les formulaires, outils et fonctionnalités proposés sur le Site.</li>
          </ul>
          <p>En accédant au Site et en utilisant ses services, l'Utilisateur reconnaît avoir pris connaissance de la présente Politique et en accepte les termes sans réserve. Si l'Utilisateur n'accepte pas les conditions décrites ci-après, il est invité à ne pas utiliser le Site ni ses services.</p>
        </section>

        <section id="responsable">
          <h2>Article 2 – Responsable du traitement</h2>
          <p>Le responsable du traitement des données personnelles collectées via le Site est :</p>
          <p>
            <strong>AFRICACOM SARL</strong><br />
            Forme juridique : Société à Responsabilité Limitée (SARL)<br />
            Siège social : 10, rue Liberté, Casablanca, Maroc<br />
            Email du Délégué à la Protection des Données : privacy@sungpt.ma
          </p>
          <p>AFRICACOM SARL agit en qualité de responsable du traitement au sens de l'article 1er de la loi marocaine n°09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel. À ce titre, elle détermine les finalités et les moyens du traitement des données personnelles des Utilisateurs.</p>
          <p>Le traitement des données est effectué sous le contrôle de la Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel (CNDP), autorité indépendante instituée par la loi n°09-08, habilitée à recevoir les déclarations et à exercer un contrôle sur les traitements de données à caractère personnel réalisés sur le territoire marocain.</p>
        </section>

        <section id="conformite">
          <h2>Article 3 – Conformité réglementaire</h2>
          <p>AFRICACOM SARL s'engage à traiter les données personnelles des Utilisateurs dans le strict respect de la législation marocaine en vigueur, et notamment :</p>
          <ul>
            <li><strong>Loi n°09-08</strong> du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel ;</li>
            <li><strong>Décret n°2-09-165</strong> du 21 mai 2009 pris pour l'application de la loi n°09-08 ;</li>
            <li>Les délibérations, recommandations et lignes directrices émises par la CNDP.</li>
          </ul>
          <p>Les traitements de données sont réalisés selon les principes fondamentaux suivants :</p>
          <ul>
            <li><strong>Licéité</strong> : les données sont traitées de manière licite, sur la base du consentement de l'Utilisateur ou d'un intérêt légitime du responsable du traitement ;</li>
            <li><strong>Loyauté et transparence</strong> : les Utilisateurs sont informés de manière claire et accessible des traitements dont leurs données font l'objet ;</li>
            <li><strong>Proportionnalité</strong> : seules les données strictement nécessaires aux finalités déclarées sont collectées ;</li>
            <li><strong>Limitation des finalités</strong> : les données ne sont pas traitées de manière incompatible avec les finalités pour lesquelles elles ont été collectées ;</li>
            <li><strong>Exactitude</strong> : les données sont tenues à jour et les mesures raisonnables sont prises pour les rectifier ou les effacer lorsqu'elles sont inexactes ;</li>
            <li><strong>Sécurité et confidentialité</strong> : les mesures techniques et organisationnelles appropriées sont mises en œuvre pour garantir la protection des données.</li>
          </ul>
        </section>

        <section id="donnees">
          <h2>Article 4 – Données collectées</h2>
          <p>Dans le cadre de l'utilisation des services SOLARBOX, les catégories de données suivantes sont susceptibles d'être collectées et traitées :</p>

          <p><strong>4.1 – Données d'identification</strong></p>
          <ul>
            <li>Nom et prénom de l'Utilisateur ;</li>
            <li>Adresse email ;</li>
            <li>Numéro de téléphone ;</li>
            <li>Ville et adresse du projet solaire.</li>
          </ul>

          <p><strong>4.2 – Données techniques et de consommation</strong></p>
          <ul>
            <li>Données extraites automatiquement de la facture ONEE uploadée par l'Utilisateur : consommation électrique en kWh, montants facturés en MAD, type d'abonnement (Basse Tension, Moyenne Tension, Haute Tension), puissance souscrite en kVA, tranche tarifaire, période de facturation ;</li>
            <li>Type de logement ou de bâtiment (maison, appartement, entreprise, ferme) ;</li>
            <li>Surface de toiture disponible et orientation du toit ;</li>
            <li>Équipements et usages énergétiques déclarés (climatisation, chauffage, chauffe-eau, véhicule électrique, etc.) ;</li>
            <li>Coordonnées GPS du site d'installation (latitude, longitude) obtenues via le service de géolocalisation.</li>
          </ul>

          <p><strong>4.3 – Données de navigation</strong></p>
          <ul>
            <li>Adresse IP ;</li>
            <li>Type et version du navigateur ;</li>
            <li>Pages consultées et durée de la visite ;</li>
            <li>Données générées par les cookies techniques strictement nécessaires.</li>
          </ul>

          <p><strong>4.4 – Précisions importantes</strong></p>
          <p>L'image ou le fichier de la facture ONEE uploadée par l'Utilisateur <strong>n'est pas conservé</strong> sur nos serveurs. Le document est traité à la volée par notre système d'analyse par reconnaissance optique de caractères (OCR), les données pertinentes sont extraites en temps réel, puis le fichier est immédiatement et définitivement supprimé de nos systèmes. Seules les données structurées extraites sont conservées dans le cadre défini par la présente Politique.</p>
        </section>

        <section id="collecte">
          <h2>Article 5 – Modalités de collecte</h2>
          <p>Les données personnelles sont collectées directement auprès de l'Utilisateur, selon les modalités suivantes :</p>
          <ul>
            <li><strong>Formulaires en ligne</strong> : lors du remplissage du diagnostic solaire, de la demande de devis ou de la création d'un compte utilisateur ;</li>
            <li><strong>Upload de documents</strong> : lors du téléversement de la facture ONEE pour analyse automatisée ;</li>
            <li><strong>Géolocalisation</strong> : lors de l'utilisation du sélecteur de carte pour localiser le site d'installation ;</li>
            <li><strong>Navigation</strong> : de manière automatique via les cookies techniques lors de la consultation du Site.</li>
          </ul>
          <p>Le consentement explicite de l'Utilisateur est obtenu via une case à cocher obligatoire, validant les présentes Conditions Générales de Vente (CGV) et la Politique de Confidentialité, préalablement à tout upload de document ou soumission de formulaire contenant des données personnelles. Aucun traitement de données n'est initié sans cette validation préalable.</p>
          <p>L'Utilisateur est libre de ne pas communiquer certaines données, étant toutefois informé que le refus de fournir les données indispensables au fonctionnement du service (consommation électrique, localisation) rendra impossible la génération du diagnostic solaire personnalisé.</p>
        </section>

        <section id="finalites">
          <h2>Article 6 – Finalités des traitements</h2>
          <p>Les données personnelles collectées sont traitées exclusivement pour les finalités suivantes :</p>
          <ul>
            <li><strong>Génération du diagnostic solaire personnalisé</strong> : calcul de la puissance photovoltaïque recommandée, estimation des économies potentielles, projection du retour sur investissement, sur la base des données de consommation et de la localisation géographique de l'Utilisateur ;</li>
            <li><strong>Production et conservation du devis</strong> : établissement d'un devis SOLARBOX détaillé et personnalisé, archivé pour consultation ultérieure par l'Utilisateur ;</li>
            <li><strong>Mise en relation avec les installateurs</strong> : transmission des coordonnées de l'Utilisateur aux installateurs certifiés partenaires, uniquement avec le consentement explicite de l'Utilisateur lors de la demande de devis ;</li>
            <li><strong>Communication avec l'Utilisateur</strong> : réponse aux demandes de renseignements, envoi de rappels liés au diagnostic en cours, notifications relatives à l'avancement du dossier ;</li>
            <li><strong>Amélioration continue du service</strong> : analyse statistique anonymisée des données de consommation pour affiner les algorithmes de diagnostic et améliorer la précision des estimations ;</li>
            <li><strong>Respect des obligations légales</strong> : conservation des données nécessaires au respect des obligations légales, fiscales et contractuelles d'AFRICACOM SARL.</li>
          </ul>
          <p>Les données personnelles ne sont en aucun cas utilisées à des fins de prospection commerciale non sollicitée, de profilage publicitaire ou de revente à des tiers à des fins marketing.</p>
        </section>

        <section id="partage">
          <h2>Article 7 – Partage des données</h2>
          <p>AFRICACOM SARL s'engage à ne pas vendre, louer, céder ou mettre à disposition les données personnelles des Utilisateurs à des tiers, sauf dans les cas limitativement énumérés ci-dessous :</p>
          <ul>
            <li><strong>Installateurs partenaires</strong> : les coordonnées de l'Utilisateur (nom, téléphone, email, ville) peuvent être transmises aux installateurs certifiés référencés sur la plateforme, uniquement lorsque l'Utilisateur en fait la demande explicite via le formulaire de devis. Cette transmission est strictement limitée aux données nécessaires à l'établissement du devis et au suivi du projet ;</li>
            <li><strong>Sous-traitants techniques</strong> : certaines données peuvent être traitées par des prestataires techniques intervenant pour le compte d'AFRICACOM SARL (hébergement, services d'analyse OCR, services de géolocalisation). Ces prestataires sont contractuellement tenus au respect de la confidentialité et de la sécurité des données, et ne peuvent les utiliser à d'autres fins que celles définies par AFRICACOM SARL ;</li>
            <li><strong>Obligations légales</strong> : les données peuvent être communiquées aux autorités judiciaires ou administratives compétentes lorsque la loi l'exige, notamment en réponse à une ordonnance judiciaire ou une réquisition administrative.</li>
          </ul>
          <p>En dehors de ces cas, les données personnelles demeurent exclusivement au sein des systèmes d'information d'AFRICACOM SARL et ne sont accessibles qu'aux personnels dûment habilités, dans la limite de ce qui est strictement nécessaire à l'exercice de leurs fonctions.</p>
        </section>

        <section id="hebergement">
          <h2>Article 8 – Hébergement et transferts</h2>
          <p>Les données personnelles collectées via le Site sont hébergées sur l'infrastructure cloud Supabase, déployée dans la région eu-west-1 (Irlande, Union Européenne). Cette infrastructure bénéficie des certifications de sécurité suivantes :</p>
          <ul>
            <li>SOC 2 Type II ;</li>
            <li>Chiffrement des données au repos (AES-256) et en transit (TLS 1.2+) ;</li>
            <li>Isolation réseau et contrôle d'accès granulaire ;</li>
            <li>Sauvegardes automatiques et plan de reprise d'activité.</li>
          </ul>
          <p>L'hébergement au sein de l'Union Européenne offre un niveau de protection des données personnelles reconnu comme adéquat et compatible avec les exigences de la loi marocaine n°09-08. Aucun transfert de données personnelles n'est effectué vers des pays tiers ne disposant pas d'un niveau de protection adéquat, sauf dans les cas prévus par la loi et sous réserve de la mise en place de garanties appropriées (clauses contractuelles types, consentement explicite de l'Utilisateur).</p>
        </section>

        <section id="conservation">
          <h2>Article 9 – Durée de conservation</h2>
          <p>Les données personnelles sont conservées pendant des durées proportionnées aux finalités pour lesquelles elles ont été collectées :</p>
          <ul>
            <li><strong>Données de diagnostic</strong> (consommation, localisation, résultats) : 12 mois à compter de la date de génération du diagnostic ;</li>
            <li><strong>Données de contact</strong> (nom, email, téléphone) liées à une demande de devis : 12 mois à compter de la soumission de la demande, sauf relation commerciale active justifiant une conservation plus longue ;</li>
            <li><strong>Données de compte utilisateur</strong> : conservées pendant toute la durée d'activité du compte, puis supprimées dans un délai de 30 jours suivant la demande de suppression du compte ;</li>
            <li><strong>Données de navigation et cookies</strong> : durée de la session de navigation pour les cookies de session ; 13 mois maximum pour les cookies persistants ;</li>
            <li><strong>Fichiers uploadés</strong> (factures ONEE) : supprimés immédiatement après extraction des données, sans aucune conservation.</li>
          </ul>
          <p>À l'expiration des durées de conservation indiquées, les données sont supprimées de manière définitive et irréversible des systèmes d'information d'AFRICACOM SARL, ou anonymisées de manière à rendre impossible toute identification de l'Utilisateur concerné.</p>
        </section>

        <section id="securite">
          <h2>Article 10 – Sécurité des données</h2>
          <p>AFRICACOM SARL met en œuvre les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté aux risques présentés par les traitements de données personnelles, conformément aux exigences de l'article 23 de la loi n°09-08. Ces mesures comprennent notamment :</p>
          <ul>
            <li><strong>Chiffrement</strong> : les données sont chiffrées au repos (AES-256) et en transit (protocole TLS 1.2 ou supérieur) pour prévenir tout accès non autorisé ;</li>
            <li><strong>Contrôle des accès</strong> : l'accès aux données est restreint aux seules personnes habilitées, via un système d'authentification forte et de gestion des droits basé sur le principe du moindre privilège ;</li>
            <li><strong>Politique de sécurité des mots de passe</strong> : les mots de passe des comptes utilisateurs sont hachés à l'aide d'algorithmes cryptographiques robustes (bcrypt) et ne sont jamais stockés en clair ;</li>
            <li><strong>Protection des API</strong> : les interfaces de programmation (API) sont protégées par des clés d'authentification, un contrôle de débit (rate limiting) et des politiques de sécurité au niveau des lignes (Row-Level Security) ;</li>
            <li><strong>Surveillance et audit</strong> : les systèmes font l'objet d'une surveillance continue et les journaux d'accès sont conservés pour permettre la détection d'activités anormales ;</li>
            <li><strong>Gestion des incidents</strong> : en cas de violation de données, AFRICACOM SARL s'engage à notifier la CNDP et les Utilisateurs concernés dans les meilleurs délais, conformément aux obligations légales.</li>
          </ul>
        </section>

        <section id="cookies">
          <h2>Article 11 – Cookies</h2>
          <p>Le site sungpt.ma utilise exclusivement des cookies techniques strictement nécessaires au fonctionnement du service. Ces cookies permettent :</p>
          <ul>
            <li>La gestion de la session de navigation et l'authentification de l'Utilisateur ;</li>
            <li>La sauvegarde temporaire de la progression du diagnostic en cours ;</li>
            <li>La mémorisation des préférences de consentement (bannière cookies).</li>
          </ul>
          <p><strong>Aucun cookie analytique, publicitaire, de tracking ou de profilage n'est utilisé sur le Site.</strong> AFRICACOM SARL ne recourt à aucun outil de mesure d'audience tiers (Google Analytics, Facebook Pixel, etc.) susceptible de collecter des données personnelles à des fins publicitaires ou de ciblage comportemental.</p>
          <p>Les cookies techniques étant strictement nécessaires au fonctionnement du service, ils ne requièrent pas le consentement préalable de l'Utilisateur conformément aux recommandations de la CNDP. L'Utilisateur peut néanmoins configurer son navigateur pour refuser l'ensemble des cookies, étant informé que cette action pourrait affecter le fonctionnement normal du Site.</p>
        </section>

        <section id="droits">
          <h2>Article 12 – Droits des utilisateurs</h2>
          <p>Conformément aux articles 7, 8 et 9 de la loi n°09-08, l'Utilisateur dispose des droits suivants sur ses données personnelles :</p>
          <ul>
            <li><strong>Droit d'accès</strong> (article 7) : l'Utilisateur a le droit d'obtenir la confirmation que des données le concernant sont ou ne sont pas traitées, ainsi que la communication de l'ensemble des données le concernant sous une forme accessible ;</li>
            <li><strong>Droit de rectification</strong> (article 8) : l'Utilisateur peut exiger la rectification de ses données personnelles lorsqu'elles sont inexactes, incomplètes, équivoques ou périmées ;</li>
            <li><strong>Droit de suppression</strong> (article 8) : l'Utilisateur peut demander la suppression de ses données personnelles lorsque leur collecte ou leur traitement n'est pas conforme aux dispositions de la loi n°09-08 ;</li>
            <li><strong>Droit d'opposition</strong> (article 9) : l'Utilisateur peut, pour des motifs légitimes, s'opposer au traitement de ses données personnelles. Il peut également s'opposer, sans frais, à ce que ses données soient utilisées à des fins de prospection.</li>
          </ul>
          <p>Pour exercer l'un de ces droits, l'Utilisateur doit adresser sa demande par email à : <strong>privacy@sungpt.ma</strong>, en précisant son identité (nom, prénom, email associé au compte) et la nature de sa demande. AFRICACOM SARL s'engage à accuser réception de la demande dans un délai de 48 heures et à y répondre de manière complète dans un délai maximum de 30 jours calendaires à compter de la réception de la demande.</p>
          <p>En cas de difficulté dans l'exercice de ses droits, l'Utilisateur peut introduire une réclamation auprès de la Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel (CNDP) :</p>
          <p>
            CNDP – Commission Nationale de contrôle de la protection des Données à caractère Personnel<br />
            Angle Boulevard Annakhil et Avenue Imam Malik, Hay Riad, Rabat, Maroc<br />
            Site web : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.cndp.ma</a>
          </p>
        </section>

        <section id="modifications">
          <h2>Article 13 – Modifications</h2>
          <p>AFRICACOM SARL se réserve le droit de modifier la présente Politique de Confidentialité à tout moment, afin de l'adapter aux évolutions législatives, réglementaires, jurisprudentielles ou techniques, ou pour refléter les changements apportés aux traitements de données personnelles.</p>
          <p>En cas de modification substantielle de la présente Politique, AFRICACOM SARL en informera les Utilisateurs par tout moyen approprié (notification sur le Site, email, bannière d'information). La date de dernière mise à jour, indiquée en tête du présent document, sera actualisée en conséquence.</p>
          <p>La version de la Politique applicable est celle en vigueur au moment de l'utilisation du service par l'Utilisateur. La poursuite de l'utilisation du Site après la publication d'une version modifiée de la Politique vaut acceptation des nouvelles conditions.</p>
        </section>

        <section id="droit-applicable">
          <h2>Article 14 – Droit applicable et juridiction compétente</h2>
          <p>La présente Politique de Confidentialité est régie par le droit marocain, et notamment par les dispositions de la loi n°09-08 du 18 février 2009 et ses textes d'application.</p>
          <p>Tout litige relatif à l'interprétation, l'exécution ou la validité de la présente Politique relève de la compétence exclusive des juridictions de Casablanca, Maroc, nonobstant pluralité de défendeurs ou appel en garantie.</p>
          <p>Préalablement à toute action judiciaire, les parties s'engagent à rechercher une solution amiable au litige dans un délai de 30 jours à compter de la notification du différend par l'une des parties à l'autre.</p>
        </section>

      </LegalPageLayout>
    </>
  );
};

export default Privacy;
