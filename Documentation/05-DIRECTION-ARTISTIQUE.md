# Rézone — Direction artistique (source de vérité pour le code)

> **Statut :** identité et écrans clés validés par le porteur de projet les 1er et 2 novembre 2026. Ce document remplace toute autre description de l'apparence. Le tableau de travail visuel (privé, claude.ai, artifact « Rézone — Recherche DA ») n'est pas lisible depuis VS Code : tout ce qu'il faut pour coder est ici.
> **Périmètre :** Phase 7 bis, étapes DA.3 à DA.7. **Habillage uniquement** : aucune règle métier, aucun schéma, aucun test de logique modifié.

## 1. Identité

- **Nom :** Rézone (« rézone » en minuscules dans le logotype). Texte courant : « Rézone ».
- **Logotype :** Bricolage Grotesque 800 (axe `opsz` au maximum), minuscules, lettres serrées (`letter-spacing: -0.04em`). Le « o » est remplacé par un **tampon** : disque lime, anneau pointillé, coche. Le tampon est incliné de −12°, plus grand que la hauteur d'x (0,6 em).
- **Icône d'app (« Icône 3 ») :** « r » blanc cassé sur fond forêt, tampon lime avec coche forêt en haut à droite.
- **Assets prêts dans `public/brand/` (tracés vectoriels, aucune police nécessaire) :**

| Fichier | Usage |
|---|---|
| `logo-rezone-cream.svg` | sur fond forêt (en-têtes, intro, connexion verte) |
| `logo-rezone-forest.svg` | sur fond clair ou crème |
| `logo-rezone-ink.svg` | **une couleur** (impression, tampon, fax) : le tampon est évidé |
| `logo-rezone-white.svg` | une couleur blanche sur photo ou fond sombre |
| `icon-rezone.svg`, `icon-192.png`, `icon-512.png` | icône « any » (coins arrondis) |
| `icon-rezone-maskable.svg`, `icon-maskable-512.png` | icône **maskable** : contenu dans la zone de sécurité (cercle de 40 % de la largeur) |
| `apple-touch-icon.png` (180 px) | iOS, plein cadre sans transparence |
| `favicon.svg`, `favicon-32.png` | onglet du navigateur (tampon sans coche, lisible à 16 px) |

- **Règles d'usage :** largeur minimale 80 px (en dessous, utiliser l'icône) ; marge autour = demi-diamètre du tampon ; ne jamais recolorer le tampon hors couple lime/forêt ; ne pas déformer ; **pas de mode sombre** (reporté « bien plus tard »).
- Les SVG ont été générés avec Bricolage Grotesque (licence OFL-1.1) : usage commercial et vectorisation autorisés.

## 2. Couleurs (tokens)

> **Itération 2 (Session 35, `06-DA-ITERATION-2.md`) :** le fond est passé au crème léger. Valeurs en vigueur dans `globals.css` : `--background #fbf6ec`, `--border #e7e0cf`, `--secondary` / `--muted` / `--accent` `#f3eedf`, `--track #e9e2d0`. Les cartes et le QR restent blancs. Le bloc ci-dessous garde les valeurs d'origine pour mémoire.

À reporter dans `src/app/globals.css` (noms shadcn conservés pour ne pas casser les composants `ui/`). **Attention :** dans shadcn, `accent` sert aux survols et sélections discrets. Le lime est donc un token à part, `gain`, et `accent` reste une teinte douce. Vérifier les usages de `accent` avant de changer sa valeur.

```css
:root {
  --background: #ffffff;
  --foreground: #0e1f17;            /* encre */
  --card: #ffffff;
  --card-foreground: #0e1f17;
  --popover: #ffffff;
  --popover-foreground: #0e1f17;
  --primary: #0a5c3a;               /* forêt */
  --primary-foreground: #fff4e6;    /* blanc cassé */
  --secondary: #eef4f0;
  --secondary-foreground: #0e1f17;
  --muted: #eef4f0;
  --muted-foreground: #4a5a52;
  --accent: #eef4f0;
  --accent-foreground: #0e1f17;
  --border: #d5e2da;                /* décoratif seulement (1,3:1) */
  --input: #6b8577;                 /* bordure de champ, 4,0:1 sur blanc */
  --ring: #0a5c3a;
  --radius: 1rem;                   /* 16 px : boutons 16, cartes 20, grosse carte 28 */

  --cream: #fff4e6;                 /* fond de la connexion, texte sur forêt */
  --gain: #c8f25a;                  /* lime : +1, récompense, coche, célébration */
  --gain-foreground: #0a5c3a;       /* forêt sur lime, 6,3:1 */

  /* couleurs de carte : [ton foncé sur blanc, ton clair sur forêt] */
  --hue-1-light: #0a5c3a; --hue-1-dark: #c8f25a;   /* forêt */
  --hue-2-light: #d9421f; --hue-2-dark: #ff8a6b;   /* tomate */
  --hue-3-light: #5b47ff; --hue-3-dark: #b4a9ff;   /* violet */
  --hue-4-light: #b86e00; --hue-4-dark: #ffd23f;   /* soleil */
  --hue-5-light: #0f6fd1; --hue-5-dark: #7cc4ff;   /* ciel */
  --hue-6-light: #d6336c; --hue-6-dark: #ff9cc7;   /* rose */

  --ease-slide: cubic-bezier(.22, .9, .3, 1);
  --ease-pop: cubic-bezier(.2, 1.7, .4, 1);
  --dur-slide: 500ms;
}
```

**Contrastes mesurés (WCAG) :** blanc cassé sur forêt 7,4:1 · lime sur forêt 6,3:1 · forêt sur lime 6,3:1 · texte secondaire sur blanc 7,3:1 · bordure de champ 4,0:1 · chaque ton de couleur de carte ≥ 3:1 sur son fond (usage graphique). `destructive` : conserver la valeur actuelle si elle atteint 4,5:1 sur blanc, sinon `#b42318` (6,6:1).
**Règle :** toute bordure qui délimite un champ ou un bouton utilise `--input`, jamais `--border`. Aucune information portée par la couleur seule.

## 3. Polices

- **Titres, chiffres, boutons :** Bricolage Grotesque (700 et 800), via `next/font/google` en police variable avec l'axe `opsz` (le tracé change selon la taille : c'est celui du logo). Variable CSS `--font-display`.
- **Texte :** Plus Jakarta Sans 400, 600, 800. Variable CSS `--font-sans`.
- Deux familles, graisses limitées, `display: swap`, sous-ensemble `latin`. Vérifier le CLS et Lighthouse.

## 4. Couleur d'une carte de fidélité

- 6 couleurs ci-dessus. **Déterministe, sans changement de schéma :** `index = hash(restaurant.id) % 6` (fonction pure, testée, hors des composants conformément à `.cursorrules`). Le commerçant ne la choisit pas.
- Ton **foncé** pour les traits sur fond blanc (liste), ton **clair** pour les traits sur la grosse carte forêt.

## 5. Composants à créer ou re-thémer

### 5.1 `SegmentedProgress` (remplace la barre `Progress` pour les passages)
- Un trait par passage. Rangées de **10 traits** maximum (palier 20 = deux rangées). **Dernier trait = icône cadeau** (14 px).
- Grosse carte : hauteur 22 px, rayon 7 px, écart 4 px (6 px entre rangées). Plein = ton clair de la couleur, bordure 2 px même ton. Vide = `rgba(255,244,230,.16)` avec bordure `rgba(255,244,230,.34)`. Icône cadeau forêt sur trait plein, blanc cassé sur trait vide.
- Liste (fond blanc) : hauteur 16 à 18 px, rayon 5 à 6 px, écart 3 à 4 px, ton foncé ; vide `#e3ece7`.
- Règle de progression inchangée : compteur cumulatif `13/10 → 13/20`, boucle sur le palier 1 (ADR-009). **Aucune logique dans le composant** : il reçoit `count`, `threshold`, `hue`, `justAdded`.

### 5.2 En-tête de la carte d'un commerce
- **Avec bannière** (champ « couverture » déjà géré, étape 5.3) : bannière 150 px, coins bas arrondis 28 px, pastille de retour 44 px ; **la grosse carte forêt chevauche la bannière de 40 px et ne disparaît jamais**. **Sans bannière** : écran actuel (ligne de retour puis grosse carte). La carte contient : logo 48 px, nom, libellé du palier, gros chiffre (92 px, Bricolage 800, ton clair), « / seuil », traits, message.
- Sous la carte : ligne « Ensuite » (palier suivant), rappel « Dans la même rue : ta carte marche aussi chez N autres commerces Rézone », bouton « Découvrir les voisins » (56 px).

### 5.3 `IntroSplash` (intro animée)
- **Quand :** juste après la validation du code, **pendant que l'accueil charge** ; aussi à l'ouverture de l'app avec session existante. Pas à chaque retour sur l'accueil. Fond forêt plein écran, bouton « Passer » (44 px).
- **Durée :** au moins ~1,9 s (le temps que le tampon claque et que son onde s'efface), puis jusqu'à ce que les cartes soient prêtes, plafond ~4 s. Ne jamais retarder le chargement réel. Sortie : glissement vers l'accueil (voir 5.4).
- **Séquence (délais depuis le montage) :** « Bienvenue sur » en fondu (0,2 s, 0,35 s) ; lettres de « rézone » écrites de gauche à droite par balayage (`clip-path`) à 0,30 / 0,42 / 0,54 s ; tampon qui claque à 0,72 s (échelle 2,6 → 1, rotation −35° → −12°, 0,4 s) avec onde lime à 0,95 s ; « n » à 1,05 s, « e » à 1,17 s ; chaque lettre dure 0,26 s.
- L'écran de démarrage natif de la PWA (P8) reste une image fixe : cette intro est un calque de l'app.

### 5.4 Transitions de glissement
- Entrée : l'écran arrive de la droite (`translateX(100%) → 0`) ; l'ancien recule à `translateX(-28%)`. Durée `--dur-slide`, courbe `--ease-slide`. Retour : sens inverse. Écran entrant au-dessus (z-index croissant), ombre portée à gauche, écrans non courants `visibility: hidden` après la transition.
- **S'applique à :** étapes de connexion (email → code → intro → accueil), entrée dans la carte d'un commerce et retour. **Pas de glissement** entre les onglets du bas (Mes cartes, Découvrir, Profil).
- Animations CSS (`transform`, `opacity`) d'abord ; aucune dépendance d'animation sans ADR.

### 5.5 Animation « +1 » (à chaque passage)
- Nouveau trait : `segPop` 0,65 s (échelle verticale 0,15 → 1,4 → 1, luminosité 1,6 → 1). Bulle « +1 » lime qui monte et disparaît (1 s). 8 confettis (4 de la couleur de la carte, 4 blancs cassés) qui partent en étoile (0,85 s). Le chiffre rebondit (`bump`, 0,45 s). À la récompense : vague sur tous les traits pleins (`segWave`, décalage 40 ms par trait) et bandeau « C'est gagné ! » (`winIn`).
- Vibration courte (`navigator.vibrate`) si disponible. Aucune de ces animations sur l'écran de caisse.

```css
@keyframes write{0%{clip-path:inset(-10% 100% -10% -4%);transform:translateY(.08em)}100%{clip-path:inset(-10% -12% -10% -4%);transform:translateY(0)}}
@keyframes thump{0%{transform:scale(2.6) rotate(-35deg);opacity:0}45%{opacity:1}100%{transform:scale(1) rotate(-12deg);opacity:1}}
@keyframes ripple{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.6);opacity:0}}
@keyframes segPop{0%{transform:scaleY(.15) translateY(16px);filter:brightness(1.6)}55%{transform:scaleY(1.4) translateY(-5px);filter:brightness(1.5)}100%{transform:scaleY(1) translateY(0);filter:brightness(1)}}
@keyframes segWave{0%{transform:translateY(0)}40%{transform:translateY(-6px)}100%{transform:translateY(0)}}
@keyframes plusUp{0%{transform:translateY(12px) scale(.6) rotate(6deg);opacity:0}25%{transform:translateY(-6px) scale(1.2) rotate(6deg);opacity:1}100%{transform:translateY(-50px) scale(1) rotate(6deg);opacity:0}}
@keyframes burst{0%{transform:rotate(var(--r)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--r)) translateY(-96px) scale(.4);opacity:0}}
@keyframes winIn{0%{transform:scale(.7);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.22)}100%{transform:scale(1)}}
@keyframes fadeup{0%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:1}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms !important;animation-delay:0s !important;transition-duration:.01ms !important}}
```

## 6. Règles par écran (375 px)

- **Connexion :** fond blanc cassé, logo forêt 48 à 56 px centré, 3 étapes (Scanne · Cumule · Profite) en pastilles lime sur bandeau forêt, titre « Connecte-toi pour retrouver ta carte », bouton Google (contour forêt), champ email (libellé visible, bordure `--input`), bouton principal « Recevoir mon code » 56 px. Étape code : « Entre le code reçu par email », un champ numérique, « Valider », « Renvoyer le code », « Retour ».
- **Accueil client :** en-tête forêt (logo cream, avatar lime avec initiale, « Salut {prénom} »), carte blanche avec le **QR sur fond blanc pur** (taille, marge et correction d'erreur inchangées, cf. P4) et « Montre-le en caisse », puis « Mes cartes » (cartes blanches, bordure 2 px, nom, récompense, `7 / 10`, traits couleur) ; barre du bas 72 px (Mes cartes · Découvrir · Profil), icône + texte, onglet actif forêt.
- **Caisse (scanner) :** zone caméra sombre avec coins lime, feuille basse blanc cassé. Résultats, **toujours icône + texte** : *Validé* (pastille forêt, coche lime), *Déjà passé il y a moins de 2 h* (contour encre, horloge), *Récompense à remettre* (fond lime, cadeau), *QR inconnu : code de secours* (fond encre, croix). Boutons 56 px (≥ 48), « Annuler » avec compte à rebours 10 min, « Scanner suivant ». Aucune animation décorative, aucun vocabulaire de jeu.
- **Découvrir :** titre, puces de catégories, carte avec **marqueurs ronds (pas d'épingle)**, liste de commerces avec distance, récompense et étiquette « Nouveau » (lime) ou « Visité » (forêt).
- **Logs, réglages, admin :** pas de maquette ; appliquer les tokens et composants, puis valider sur téléphone.

## 7. Ton des textes de l'interface

Tutoiement côté client, vouvoiement côté commerçant. Phrases courtes, fonctionnelles, sans vocabulaire de sport. **Les phrases d'accroche marketing (chevalet, affiche, sticker) sont reportées** : ne pas en inventer dans l'app. Exemples validés : « Plus que 2 passages avant ton menu offert », « C'est gagné ! Montre cet écran en caisse. », « Ta carte marche aussi chez 3 autres commerces Rézone ». Pas de monnaie commune entre commerces : ne jamais écrire « cumule partout ».

## 8. Plan d'exécution (une branche `feat/phase-7bis-da`, un commit par étape)

1. **DA.3** Tokens et polices dans `globals.css` et `layout.tsx` ; composants inchangés, vérifier qu'aucun écran ne casse.
2. **DA.4** Re-thémer `ui/` (button, card, input, progress, drawer…) ; créer `SegmentedProgress`, `IntroSplash`, `StepTransition` ; états vide, chargement, erreur dans `shared/`.
3. **DA.6** Appliquer aux écrans existants, dans l'ordre : connexion, accueil client, carte d'un commerce, caisse, découvrir, puis `/pro` (logs, stats, réglages) et `/admin`.
4. **DA.7** Template d'email OTP (logo cream sur forêt), chevalet QR imprimable (A6, QR noir sur blanc pur, une couleur possible avec `logo-rezone-ink.svg`), assets P8 (`theme_color` `#0a5c3a`, `background_color` `#fff4e6`).

**Critères de validation (repris de la roadmap) :** contrastes AA ; boutons de caisse ≥ 48 px ; QR sur blanc pur, taille et marge inchangées ; Lighthouse `/` ≥ 86 ; budget de scan < 3 s inchangé ; `pnpm lint && pnpm typecheck && pnpm test` verts sans modifier un test de logique ; retour de 2 à 3 personnes sur la première impression.

## 9. Points ouverts

- Phrase du sticker de porte : A « Fidélité de quartier » · B « Ici, tu cumules » · C « Membre du réseau local » (non bloquant pour l'app).
- Phrases d'accroche des supports imprimés : reportées.
- Intro : écriture par balayage (validée) ; un tracé « à la main » reste possible plus tard.
- Mode sombre : bien plus tard.
