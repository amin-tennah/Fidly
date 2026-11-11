# 05b — Spec d'agencement des écrans (Phase 7 bis)

> Complète `05-DIRECTION-ARTISTIQUE.md`. Le 05 donne les tokens et les composants ; ce document dit **où va chaque élément, à quelle taille, dans quel ordre**. Mockups de référence : `Documentation/da-mockups/*.png` (à regarder en premier). En cas de doute entre ce texte et l'image, l'image gagne.

## 0. Règle de travail (à lire avant de coder)

La DA n'est **pas** un changement de couleurs. Pour chaque écran :
1. Regarde le mockup correspondant.
2. Liste ce qui change dans la **structure** (blocs ajoutés, déplacés, retaillés), pas seulement dans les couleurs.
3. Réécris le JSX/markup de l'écran pour obtenir cette structure. Garde les données, les hooks, les actions serveur et les tests tels quels : seul le rendu change.
4. Compare ton rendu à 375 px avec le mockup. Si un bloc du mockup manque, ce n'est pas fini.

Un écran qui garde son ancien agencement avec les nouvelles couleurs est un échec de l'étape, pas une réussite partielle.

## 1. Grammaire commune

- Fond d'écran client : blanc `#FFFFFF`. Fond de page secondaire / zones d'info : `#EEF4F0`.
- Rayons : écran-carte 28 px, carte de liste 20 px, bloc d'info 18 px, bouton 16 px, pastille 999 px.
- Bouton principal : 56 px de haut, fond forêt, texte `#FFF4E6`, Bricolage Grotesque 800 19 px. Bouton secondaire : 56 px, bordure forêt 2 px, fond blanc ou transparent.
- Titres d'écran : Bricolage 800, 28 à 30 px, interligne 1.05, `letter-spacing: -0.02em`.
- Grands chiffres : Bricolage 800, `letter-spacing: -0.04em`.
- Marges latérales : 20 px (24 px sur la connexion).
- Barre d'onglets basse : 72 px, bordure haute 2 px `#E3ECE7`, icône 24 px + libellé 12/800, actif en forêt, inactif `#4A5A52`.
- Un seul élément « héros » par écran, en aplat fort (forêt ou couleur de carte). Le reste est calme.

## 2. Couleur de carte (partout où une carte de fidélité apparaît)

`hue = HUES[hash(restaurant.id) % 6]`, avec `{ light, dark }` (voir tokens du 05).
- Sur fond blanc (liste) : traits, chiffre d'accent et icône cadeau en `light`.
- Sur fond forêt (détail) : traits remplis, gros chiffre et pastille « +1 » en `dark`.
- Plus de trait vert unique : si deux cartes ont la même couleur, c'est normal ; si toutes sont vertes, le hash n'est pas branché.

## 3. Écran « Accueil client » (mockup `ecran-2-accueil.png`)

De haut en bas :
1. **En-tête forêt** (`#0A5C3A`, coins du bas arrondis 28 px, padding 22/20) : logotype « rézone » crème 28 px à gauche (le logo officiel `public/brand/logo-rezone-cream.svg`, pas du texte), avatar rond 44 px lime avec initiale forêt à droite. Dessous : « Salut {prénom} » en Bricolage 30 px, crème. Lien « Se déconnecter » discret, en crème 14/800, aligné à droite de la ligne du logo ou sous l'avatar.
2. **Bloc QR** : carte blanche, rayon 22 px, qui **chevauche le bas de l'en-tête** (marge négative d'environ 40 px). Contenu : QR (taille et marge blanche **inchangées**, fond blanc pur), titre « Montre-le en caisse » en Bricolage 20 px, code de secours en dessous (mono, lisible). Pas de bordure grise épaisse autour.
3. **Lien espace restaurateur** (si gérant) : ligne texte forêt 14/800 avec flèche, ou petite pastille, sous le bloc QR. Pas de soulignement épais.
4. **Titre de section** : « Mes cartes » Bricolage 21 px à gauche, « N commerces » 13/800 forêt à droite.
5. **Cartes de fidélité**, une par commerce, voir ci-dessous.
6. **Barre d'onglets** : Mes cartes / Découvrir / Profil.

### Carte de la liste
Carte blanche, bordure 2 px `#D5E2DA`, rayon 20 px, padding 14 px, gap 10 px.
- Ligne 1 : logo du commerce 44 px (rayon 12) · bloc nom (16/800) + récompense (13 px `#4A5A52`) · compteur à droite « 3 / 10 » en Bricolage 22 px (le « / 10 » en 14 px `#4A5A52`).
- Ligne 2 : **SegmentedProgress** (voir 05) : un trait par passage, 16 px de haut, rayon 5, écart 3, rangées de 10, **couleur = `hue.light`**, traits vides `#E1ECE5`, dernier trait = icône cadeau (en `hue.light`, trait plein si atteint).
- Toute la carte est cliquable ; au clic, glissement latéral vers le détail.

## 4. Écran « Carte d'un commerce » (mockup `carte-commerce-avec-banniere.png` et `...-sans-banniere.png`)

Deux variantes, mêmes composants.
- **Avec bannière** : bannière 150 px en haut (coins du bas 28 px, photo de couverture existante), bouton retour rond 44 px crème en haut à gauche sur la bannière. La carte forêt commence **40 px plus haut que le bas de la bannière** (elle la chevauche) avec une ombre douce `0 10px 24px rgba(10,92,58,.22)`.
- **Sans bannière** : lien « ‹ Mes cartes » (44 px de haut, forêt 15/800) puis la carte forêt, marge haute 14 px.
- **Grosse carte forêt** (rayon 28, padding 20, gap 14), de haut en bas : logo 48 px (rayon 14, fond crème) + nom 17/800 + « Palier 1 · menu offert à 10 » 13 px ; **compteur géant** Bricolage 92 px en `hue.dark` suivi de « / 10 » 32 px à 80 % d'opacité ; **SegmentedProgress grand** : traits **22 px de haut**, rayon 7, écart 4, bordure 2 px, remplis en `hue.dark`, vides en transparent avec bordure `rgba(255,244,230,.45)` ; message d'état Bricolage 20 px (« Plus que 2 passages avant ton menu offert »).
- Quand la récompense est atteinte : bandeau `hue.dark` « C'est gagné ! » (22 px) + sous-texte « Montre cet écran en caisse. ».
- Sous la carte : bloc « Ensuite » (bordure 2 px `#D5E2DA`, rayon 18) avec le palier suivant et « N / 20 » en forêt ; bloc info `#EEF4F0` « Dans la même rue » ; bouton principal « Découvrir les voisins » en bas (margin-top auto).
- Après 10 passages : seconde rangée de 10 traits, compteur cumulé 13/20 (ADR-009).
- Animation +1 : voir 05 §5 (trait qui monte, bulle « +1 », confettis `hue.dark` et crème, rebond du chiffre).

## 5. Écran « Connexion » (mockup `ecran-1-connexion.png`, parcours `parcours-*.png`)

Fond crème `#FFF4E6`, padding 56/24/28, gap 22. De haut en bas : logotype forêt 56 px centré ; **bloc forêt de 150 px, rayon 24**, avec 3 pastilles lime (1 Scanne, 2 Cumule, coche Profite) reliées par des traits lime ; titre « Connecte-toi pour retrouver ta carte » 28 px ; bouton Google (blanc, bordure forêt 2 px, 56 px) ; champ email 56 px, rayon 16, bordure **2 px `#6B8577`** ; bouton « Recevoir mon code » forêt ; mention « Pas de mot de passe, pas d'appli à télécharger. » 13 px en bas.
Étape code : même grammaire, glissement latéral 500 ms. Après validation : IntroSplash puis accueil.

## 6. Écran « Caisse » (mockup `ecran-4-caisse.png`)

Fond encre `#0E1F17`. En-tête : « Scanner » 22 px crème + nom du commerce 14 px à droite. Viseur : zone 270 px de haut (marges 20, rayon 22, fond `#1B2F25`), 4 coins lime 7 px épais avec rayon 14, texte d'aide 14/600 crème. En bas, **feuille crème** (coins hauts 28) qui contient le résultat : pastille ronde 72 px (forêt + coche lime) + « Validé » Bricolage 38 px + ligne « Karim · passage 8 sur 10 » ; boutons « Annuler (9 min) » (secondaire) et « Scanner suivant » (principal), 56 px.
États : **Validé** (pastille forêt, coche lime), **Déjà passé** (cadre 2 px encre, icône horloge), **Récompense à remettre** (fond lime, icône cadeau, texte forêt), **QR inconnu** (fond encre, icône croix, texte crème). Toujours icône + texte, jamais la couleur seule. Aucune animation décorative ici.

## 7. Écran « Espace pro » (accueil gérant) — pas encore maquetté, appliquer la même grammaire

Cet écran n'a pas de mockup. Ne le laisse pas en l'état : applique ceci.
1. **En-tête** : pastille « Espace Pro · Gérant » (fond lime, texte forêt 13/800), « Se déconnecter » en texte discret à droite. Dessous : avatar/logo du commerce 56 px et nom du commerce en Bricolage 28 px.
2. **Bouton héros « Scanner un client »** : grande carte forêt, rayon 28, hauteur ~150 px, icône de scan 40 px lime au-dessus du libellé « Scanner un client » en Bricolage 24 px crème, ombre douce. C'est l'action principale : c'est le plus grand objet de l'écran.
3. **Recherche par code** : bloc `#EEF4F0` rayon 20, padding 16, avec libellé « Code du client » 14/800, champ 56 px (mono, bordure 2 px `#6B8577`, rayon 16) et bouton « Chercher » 56 px (forêt ; désactivé : fond `#CFE0D6`, texte `#4A5A52`).
4. Marges latérales **20 px partout** : les captures actuelles montrent la carte et le bouton collés au bord droit, à corriger.
5. **Zone vide** : si rien d'autre, ajouter un bloc « Aujourd'hui » (nombre de passages du jour, chiffre en Bricolage 48 px forêt) si la donnée existe déjà ; sinon laisser de l'air, ne rien inventer côté données.
6. Barre d'onglets basse : Scanner / Logs / Stats / Réglages, mêmes règles que le client (72 px, actif forêt).
Logs, Stats, Réglages : mêmes tokens, titres Bricolage 28 px, listes en cartes blanches bordure 2 px `#D5E2DA` rayon 18, boutons 56 px. À montrer à Amine sur téléphone après DA.6.

## 8. Critères de validation par écran (à cocher avant de dire « fini »)

- [ ] Les blocs et leur ordre sont ceux du mockup (pas seulement les couleurs).
- [ ] Les tailles clés sont respectées (compteur 92 px, traits 22/16 px, boutons 56 px, avatar 44 px, logo officiel en SVG).
- [ ] Couleur de carte = hash du commerce, dans la liste et dans le détail.
- [ ] Capture à 375 px de large jointe au message de commit ou à la session, à côté du mockup.
- [ ] Contraste AA, cibles ≥ 48 px, QR inchangé, `prefers-reduced-motion` respecté.

### Suivi de validation (Session 31)

Captures à 375 px à côté des maquettes : `Documentation/da-captures/`. Cochés : structure, tailles clés, couleur par carte, capture jointe, cibles ≥ 48 px et QR inchangé. Contraste mesuré, Lighthouse et scan < 3 s : à valider sur téléphone.

| Écran | Structure | Tailles clés | Couleur par carte | Capture |
|---|---|---|---|---|
| Accueil client | [x] (QR empilé : sa taille est fixe) | [x] | [x] | `accueil-et-liste-compare.png` |
| Carte de la liste | [x] | [x] | [x] | `accueil-et-liste-compare.png` |
| Détail, avec et sans bannière | [x] (sans « Dans la même rue » ni « Découvrir les voisins ») | [x] | [x] | `card-avec-compare.png`, `card-sans-compare.png` |
| Connexion | [x] | [x] | n/a | `login-compare.png` |
| Caisse | [x] (sans « Annuler (9 min) » : pas de compte à rebours) | [x] | n/a | `caisse-compare.png` |
| Espace pro | [x] (sans bloc « Aujourd'hui » : donnée absente) | [x] | n/a | `pro-app.png` |
| Découvrir | non fait (Phase 9) | | | |
| Barre d'onglets client | non faite (pas de route Découvrir ni Profil) | | | |
