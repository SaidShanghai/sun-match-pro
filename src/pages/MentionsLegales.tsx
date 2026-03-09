
const MentionsLegales = () => {
  return (
    <>
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>

          <div className="prose prose-sm max-w-none space-y-8 text-foreground/80">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Éditeur du site</h2>
              <p>
                Le site <strong>sungpt.ma</strong> est édité par <strong>SOLARBOX</strong>, plateforme de mise en relation entre particuliers/entreprises et installateurs solaires certifiés au Maroc.
              </p>
              <p>Siège social : Casablanca, Maroc</p>
              <p>Email de contact : contact@sungpt.ma</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Hébergement</h2>
              <p>
                Le site est hébergé par <strong>Lovable Cloud</strong> (infrastructure européenne sécurisée).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Protection des données personnelles</h2>
              <p>
                Conformément à la <strong>loi marocaine n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, SOLARBOX s'engage à protéger la vie privée de ses utilisateurs.
              </p>
              <h3 className="text-lg font-medium text-foreground mt-4">Données collectées</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nom, prénom, email, téléphone (formulaire de devis)</li>
                <li>Données de consommation énergétique (diagnostic solaire)</li>
                <li>Localisation géographique (ville, adresse du projet)</li>
                <li>Cookies techniques et analytiques</li>
              </ul>
              <h3 className="text-lg font-medium text-foreground mt-4">Finalité du traitement</h3>
              <p>
                Les données sont collectées uniquement pour fournir un diagnostic solaire personnalisé et mettre en relation les utilisateurs avec des installateurs certifiés. Aucune donnée n'est vendue à des tiers.
              </p>
              <h3 className="text-lg font-medium text-foreground mt-4">Droits des utilisateurs</h3>
              <p>
                Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à <strong>contact@sungpt.ma</strong>.
              </p>
              <p>
                Autorité de contrôle : <strong>CNDP</strong> (Commission Nationale de contrôle de la protection des Données à caractère Personnel) — <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.cndp.ma</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
              <p>
                Le site utilise des cookies essentiels au fonctionnement et des cookies analytiques pour améliorer l'expérience utilisateur. Vous pouvez accepter ou refuser les cookies non essentiels via la bannière affichée lors de votre première visite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu du site (textes, images, logos, marques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable de NOORIA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Limitation de responsabilité</h2>
              <p>
                NOORIA agit en tant que plateforme de mise en relation. Les devis, installations et prestations sont réalisés par les installateurs partenaires, qui sont seuls responsables de la qualité de leurs services. NOORIA ne saurait être tenue responsable des dommages directs ou indirects liés à l'utilisation du site ou aux prestations des installateurs.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default MentionsLegales;
