# SOLARBOX — Scénarios de test du moteur de recommandation

> Ce fichier documente tous les essais de dimensionnement effectués.
> Il sert de référence pour valider et améliorer la logique de recommandation.
> ⚠ Tous les prix et specs proviennent exclusivement de la BDD — aucune valeur inventée.

---

## Règles métier validées

| Règle | Détail |
|-------|--------|
| Anti-hallucination | Tous les prix/specs DOIVENT venir de la BDD. Aucun fallback hardcodé. Warning ⚠ si donnée manquante. |
| Combo onduleur AIO | AIO BOX 175kWh → 1× BCT-110kW-PRO \| AIO BOX 350kWh → 2× BCT-110kW-PRO (via `specs.onduleur_combo`) |
| Ratio DC/AC | 1.2 systématique pour le dimensionnement panneaux |
| Achat séparé | AIO BOX, onduleurs et panneaux sont des achats séparés (pas tout-en-un) |
| SolarBox = tout-en-un | Onduleur + batterie intégrés, seuls les panneaux sont en supplément |

---

## Tests effectués

### 10 Mars 2026

#### Test 1 — C&I : AIO BOX 350kWh (système complet)
- **Besoin** : Stockage 350 kWh, triphasé
- **Config** : 1× AIO BOX 350kWh + 2× BCT-110kW-PRO + 452× PVS 585W
- **Prix BDD** : 720 000 + 120 000 + 452 000 = **1 292 000 DH TTC**
- **Statut** : ✅ Logique codée dans le moteur C&I

#### Test 2 — Résidentiel mono : BCT-HP sans batterie
- **Besoin** : Onduleur seul, monophasé
- **Config** : 1× Onduleur Hybride BCT-HP (6 kW) + 13× PVS 585W
- **Prix BDD** : 5 000 + 13 000 = **18 000 DH TTC**
- **Statut** : ✅ Vérifié manuellement

#### Test 3 — C&I : BCT-110kW-PRO sans batterie
- **Besoin** : Onduleur seul, triphasé
- **Config** : 1× BCT-110kW-PRO (110 kW) + 226× PVS 585W
- **Prix BDD** : 60 000 + 226 000 = **286 000 DH TTC**
- **Statut** : ✅ Vérifié manuellement

#### Test 4 — Résidentiel mono : 45 kWh avec batterie
- **Besoin** : 45 kWh stockage, monophasé
- **Config** : 1× SolarBox 220V/18kW 45kWh + 37× PVS 585W
- **Prix BDD** : 270 000 + 37 000 = **307 000 DH TTC**
- **Statut** : ✅ Vérifié manuellement

#### Test 5 — Résidentiel mono : 45 kWh sans batterie
- **Besoin** : 18 kW monophasé, sans stockage
- **Config** : 3× Onduleur Hybride BCT-HP (mise en parallèle) + 37× PVS 585W
- **Prix BDD** : 15 000 + 37 000 = **52 000 DH TTC**
- **Statut** : ✅ Vérifié manuellement

#### Test 6 — Résidentiel tri : 36 kW avec batterie
- **Besoin** : 36 kW triphasé, avec stockage
- **Config** : 1× SolarBox 380V/36kW 90kWh + 74× PVS 585W
- **Prix BDD** : 540 000 + 74 000 = **614 000 DH TTC**
- **Statut** : ✅ Vérifié manuellement

#### Test 7 — Résidentiel tri : 36 kW sans batterie
- **Besoin** : 36 kW triphasé, sans stockage
- **Résultat** : ❌ Pas d'onduleur triphasé standalone < 110 kW au catalogue
- **Statut** : ⚠ Gap catalogue identifié

---

## Gaps identifiés

| Gap | Impact | Action |
|-----|--------|--------|
| Pas d'onduleur triphasé standalone 18-54 kW | Impossible de proposer une solution tri sans batterie sous 110 kW | À sourcer chez fournisseur |
| Prix BCT-V-48-200 et BCT-V-48-300 = 0 DH | Scénario onduleur + batteries séparées non chiffrable | En attente tarifs fournisseur |
| BOM résidentiel pas codé dans le moteur auto | Seul le C&I génère un BOM complet dans le PDF | À implémenter |

---

## À tester

- [ ] Empilement > 350 kWh (ex: 700 kWh = 2× AIO BOX 350kWh + 4× BCT-110kW-PRO)
- [ ] Résidentiel onduleur + batteries séparées (quand prix dispo)
- [ ] PDF généré avec BOM C&I complet
- [ ] BOM résidentiel SolarBox + panneaux dans le PDF
