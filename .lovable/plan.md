

# Comparateur d'Installateurs Solaires

## Concept
Un site moderne et épuré permettant aux particuliers de réaliser un diagnostic solaire personnalisé, puis de comparer et contacter des installateurs adaptés à leur situation.

---

## Pages & Fonctionnalités

### 1. Page d'accueil
- Hero section avec accroche et bouton "Lancer mon diagnostic"
- Section avantages du solaire (économies, écologie, autonomie)
- Témoignages / chiffres clés
- Footer avec mentions légales

### 2. Diagnostic guidé (formulaire multi-étapes)
Un questionnaire en 8 étapes avec barre de progression :
1. Code postal / ville
2. Type de logement (maison, appartement, immeuble)
3. Type de toiture (tuiles, ardoises, bac acier, toit plat)
4. Orientation du toit (sud, est-ouest, etc.)
5. Surface de toiture disponible
6. Consommation électrique annuelle (ou montant facture)
7. Budget envisagé
8. Coordonnées (nom, email, téléphone) pour recevoir les devis

### 3. Page de résultats
- Résumé du profil solaire de l'utilisateur (puissance recommandée, économies estimées)
- Liste d'installateurs correspondants avec :
  - Nom, logo, note moyenne
  - Zone d'intervention
  - Spécialités (résidentiel, commercial, autoconsommation, batteries)
  - Fourchette de prix indicative
- Possibilité de comparer 2 à 3 installateurs côte à côte
- Bouton "Demander un devis" pour chaque installateur

### 4. Fiche installateur
- Informations détaillées (description, certifications RGE/QualiPV, années d'expérience)
- Galerie de réalisations
- Avis clients
- Formulaire de demande de devis pré-rempli avec les données du diagnostic

### 5. Back-office administrateur (protégé par authentification)
- Gestion des installateurs (CRUD : ajouter, modifier, supprimer)
- Consultation des demandes de devis reçues
- Tableau de bord avec statistiques (nombre de diagnostics, demandes envoyées)

---

## Backend (Lovable Cloud / Supabase)
- **Base de données** : tables pour les installateurs, les diagnostics, les demandes de devis, les avis, et les rôles utilisateurs
- **Authentification** : connexion admin pour gérer le back-office
- **Stockage** : logos et photos des installateurs

---

## Design
- Palette : tons verts et bleus sur fond blanc, style moderne et épuré
- Typographie claire et lisible
- Responsive (mobile-first)
- Icônes solaires et illustrations minimalistes

