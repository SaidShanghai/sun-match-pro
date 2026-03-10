
## Scénarios de test — Moteur de recommandation

### Tests effectués (10 Mars 2026)

| # | Besoin | Type | Résultat attendu | Statut |
|---|--------|------|-------------------|--------|
| 1 | AIO BOX 350kWh | C&I triphasé | 1× AIO BOX 350kWh (720k) + 2× BCT-110kW-PRO (120k) + 452× PVS 585W (452k) = **1 292 000 DH** | ✅ Logique codée |
| 2 | Onduleur BCT-HP sans batterie | Résidentiel mono | 1× BCT-HP (5k) + 13× PVS 585W (13k) = **18 000 DH** | ✅ Vérifié manuellement |
| 3 | BCT-110kW-PRO sans batterie | C&I triphasé | 1× BCT-110kW-PRO (60k) + 226× PVS 585W (226k) = **286 000 DH** | ✅ Vérifié manuellement |
| 4 | 45 kWh mono avec batterie | Résidentiel mono | SolarBox 220V/18kW 45kWh (270k) + 37× PVS 585W (37k) = **307 000 DH** | ✅ Vérifié manuellement |
| 5 | 45 kWh mono sans batterie | Résidentiel mono | 3× BCT-HP (15k) + 37× PVS 585W (37k) = **52 000 DH** | ✅ Vérifié manuellement |
| 6 | 36 kW triphasé avec batterie | Résidentiel tri | SolarBox 380V/36kW 90kWh (540k) + 74× PVS 585W (74k) = **614 000 DH** | ✅ Vérifié manuellement |
| 7 | 36 kW triphasé sans batterie | Résidentiel tri | ❌ Pas d'onduleur triphasé standalone < 110kW au catalogue | ⚠ Gap catalogue |

### Règles validées
- **Anti-hallucination** : Tous les prix/specs DOIVENT venir de la BDD. Aucun fallback hardcodé. Warnings ⚠ si donnée manquante.
- **Combo onduleur** : AIO BOX 175kWh → 1× BCT-110kW-PRO | AIO BOX 350kWh → 2× BCT-110kW-PRO (via champ `specs.onduleur_combo`)
- **Ratio DC/AC** : 1.2 systématique pour le dimensionnement panneaux
- **Prix non renseignés** : BCT-V-48-200 et BCT-V-48-300 à 0 DH (en attente fournisseur)

### Gaps identifiés
- [ ] Pas d'onduleur triphasé standalone (18-54 kW) au catalogue
- [ ] Prix batteries V-series manquants
- [ ] BOM résidentiel (panneaux) pas encore codé dans le moteur automatique (uniquement C&I)

### À tester ensuite
- [ ] Empilement > 350 kWh (ex: 700 kWh = 2× AIO BOX)
- [ ] Scénario résidentiel onduleur + batteries séparées (quand prix dispo)
- [ ] PDF généré avec BOM C&I complet

## Clarification : WhatsApp API vs lien WhatsApp

### Ce que vous avez actuellement
Le bouton WhatsApp utilise un **lien direct vers WhatsApp Web** (`web.whatsapp.com/send?phone=...`). C'est la méthode standard, gratuite, et ne nécessite aucune clé API. Quand un visiteur clique, il ouvre une conversation WhatsApp avec votre numéro et un message pré-rempli.

### L'API WhatsApp Business (officielle, payante)
L'API WhatsApp Business de Meta permet :
- Envoyer des messages automatiques (confirmations de devis, suivi de commande)
- Chatbots automatisés
- Intégration CRM
- Notifications proactives

**Pour l'obtenir :**
1. Créer un compte sur [Meta Business Suite](https://business.facebook.com)
2. S'inscrire à la **WhatsApp Business Platform** via Meta
3. Passer par un BSP (Business Solution Provider) comme Twilio, MessageBird, ou 360dialog
4. Obtenir une clé API et configurer un webhook

**Coût :** payant par conversation (variable selon le pays).

### Recommandation
Pour un site vitrine avec un simple bouton de contact, **le lien actuel est la bonne solution** — il fonctionne sans frais et sans configuration complexe. L'API Business n'est utile que si vous voulez automatiser les réponses ou envoyer des notifications.

Si le bouton ne s'ouvre pas correctement dans l'aperçu Lovable, c'est une limitation de l'environnement de prévisualisation — il fonctionnera correctement sur votre site publié.

