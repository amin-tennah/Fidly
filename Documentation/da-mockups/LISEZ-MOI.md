# Maquettes de référence (Phase 7 bis)

Captures du canvas de design, à 375 px de large. Elles accompagnent `Documentation/05b-ECRANS-SPEC.md`.

## Ce qui fait foi

| Fichier | Sert pour | Remarque |
|---|---|---|
| `ecran-1-connexion.png`, `parcours-etape-email.png` | Connexion | Version complète avec les 3 pastilles : `ecran-1`. Le parcours montre l'étape email avec le champ à 56 px. |
| `ecran-2-accueil.png` | Accueil client : en-tête forêt, bloc QR blanc, liste des cartes, onglets | **Les traits de la liste sont anciens** (barre pleine verte). Pour les traits et la couleur par carte, suivre `couleurs-par-carte-liste.png`. |
| `carte-commerce-avec-banniere.png`, `carte-commerce-sans-banniere.png` | Détail d'une carte | **Seule référence valable** pour le détail : compteur géant, traits unitaires, cadeau en dernier trait. |
| `couleurs-par-carte-liste.png` | Cartes de la liste | Traits unitaires fins (16 px), une couleur par commerce, cadeau à la fin. Les valeurs hex sont écrites sur l'image. |
| `ecran-4-caisse.png` | Scanner et résultat | |
| `ecran-5-decouvrir.png` | Découvrir | Phase 9. Ne pas implémenter maintenant. |
| `planche-*.png` | Vue d'ensemble | Planches complètes, pour le contexte. |

## Ce qui est périmé (ne pas reproduire)
- L'ancien écran 3 « Carte d'un commerce » à tampons ronds (grille de 5 cercles + barre pleine) a été retiré : il est remplacé par les deux maquettes `carte-commerce-*`.
- La barre de progression pleine de l'accueil : remplacée par les traits unitaires.
- Les textes « Dans la même rue », « Découvrir les voisins » et « Annuler (9 min) » sont dans les maquettes mais n'ont pas de logique derrière : voir la règle « n'invente rien » de la spec.

## Non maquetté
Espace pro (accueil gérant), logs, stats, réglages : appliquer la grammaire de la spec, section 7. Intro animée et glissements : décrits dans `05-DIRECTION-ARTISTIQUE.md` §5 (animations, non capturables en image).
