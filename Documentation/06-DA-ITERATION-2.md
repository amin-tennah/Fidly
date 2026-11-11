# 06 — DA, itération 2 : fond chaleureux, animations, installation

> Document de passage pour l'agent qui code. Source de vérité visuelle : les planches du canvas copiées dans `Documentation/da-sources/` (HTML ouvrable dans un navigateur) et la vue d'ensemble `Documentation/da-mockups/v2/global.png`. Ce document dit **quoi faire, où, et avec quelles limites**. Les planches disent **à quoi ça ressemble et comment ça bouge** (keyframes et durées exactes).
>
> Statut : toutes les décisions ci-dessous sont **validées par le porteur de projet** (2026-11-11). Aucune logique métier ne change.

## 0. Ce qui est décidé

| # | Changement | Décision |
|---|---|---|
| 1 | Fond de l'app | Option **A · Crème léger** (fond à peine teinté, cartes blanches) |
| 2 | Scan d'un client | Animation **D · carte dévoilée** au centre de l'écran. Le « +1 » existant reste. |
| 3 | Récompense atteinte | Animation **médaille**, titre « **Récompense disponible** » |
| 4 | Bannière d'installation | Nouveau visuel qui explique l'intérêt (Rézone s'ajoute aux apps du téléphone : ton QR, tes cartes, les commerces) |
| 5 | Après installation | Animation « Rézone est sur ton écran d'accueil » |
| 6 | Icônes | Nouvelles icônes validées (cartes, commerces = une carte, pas une boussole) |
| 7 | Correctif | 2e rangée de traits d'une carte au-delà de 10 (ex. `13/15`) : largeur des traits identique à la 1re rangée |

Déjà bon, **ne pas toucher** : hors-ligne (pastille, page `offline.html`, ligne « cartes à jour à HH:MM »), logique de `decide-install-banner`, `install-environment-store`.

## 1. Fond chaleureux (globals.css)

Changer uniquement les tokens, pas les composants. Le QR reste sur **blanc pur** (lisibilité du scan) : ne jamais teinter la zone du QR.

| Token | Avant | Après |
|---|---|---|
| `--background` | `#ffffff` | `#FBF6EC` |
| `--card` | `#ffffff` | `#FFFFFF` (inchangé, les cartes se détachent) |
| `--border` | `#d5e2da` | `#E7E0CF` |
| `--secondary`, `--muted`, `--accent` (fonds doux) | `#eef4f0` | `#F3EEDF` |
| `--track` (trait vide) | `#e1ece5` | `#E9E2D0` |

À vérifier : `--input` (`#6b8577`, bordure de champ) **ne change pas** (contraste AA des champs). Contraste du texte secondaire `#4A5A52` sur `#FBF6EC` : 6,8 : 1 (AA ok). Chercher les couleurs vertes codées en dur (`#eef4f0`, `#e1ece5`, `#d5e2da`, `bg-white`) dans `src/` : les remplacer par les tokens ou les laisser si elles doivent rester blanches (QR, caisse).
Le fond `theme_color`/`background_color` du manifest et de `offline.html` : aligner `background_color` sur `#FBF6EC` ; `theme_color` reste vert forêt.

## 2. Animation de scan « D · carte dévoilée »

**Source exacte** : `da-sources/Recompense.dc.html`, bloc `<!-- D · carte dévoilée -->` (≈ lignes 143-165) et keyframes en tête de fichier (`ovl`, `cardIn`, `rollOut`, `rollIn`, `tickPop`, `pieceBurst`, `rays` non utilisé ici).

**Déroulé (≈ 3,4 s)**
1. Voile `rgba(14,31,23,0.62)` apparaît (`ovl 3.4s`, visible entre 9 % et 84 %, `pointer-events: none` : ne bloque pas l'écran).
2. Une carte forêt `#0A5C3A` (rayon 28, marges 37 px) arrive au centre (`cardIn 3.2s` : scale .6 → 1.04 → 1, puis léger recul en sortie).
3. Dedans : pastille de l'initiale du commerce, nom, « Palier 1 · menu offert à N ».
4. Gros compteur : l'ancien chiffre sort vers le haut (`rollOut .3s .85s`), le nouveau entre par le bas (`rollIn .4s .9s`), puis « / N ».
5. Rangée de traits en grand : les traits déjà acquis sont pleins, le nouveau apparaît avec `tickPop`.
6. Phrase : « Plus que X passages avant ton menu offert ».
7. Quelques confettis (`pieceBurst`, 12 pièces) aux couleurs de la carte (`getCardHue(restaurantId)`).
8. Le « +1 » existant (`plus-one-burst.tsx`) **continue de se jouer** sur la carte de la liste. Ne pas le retirer.

Couleurs : fond carte = forêt ; compteur = teinte claire du commerce (`--hue-N-light`) ; traits pleins = teinte du commerce, vides = `rgba(255,244,230,.25)`.

**Architecture** (respecter `.cursorrules`)
- Détection : même principe que `hooks/use-just-added.ts` (augmentation du nombre de passages entre deux `router.refresh()`), mais **au niveau de la liste** pour produire un événement `{ cardId, from, to, restaurantName, hue, threshold }`. Pas d'UI optimiste : l'animation ne part que quand les nouvelles props serveur arrivent.
- Domaine pur testé : `domain/detect-card-celebrations.ts` — entrée `(previous, next)` listes de cartes, sortie liste d'événements `{ kind: 'stamp' | 'reward', ... }`. Cas à tester : aucun changement, +1, +2 d'un coup (une seule animation avec `from → to`), carte nouvelle (premier passage : pas d'animation de compteur mais « +1 » comme aujourd'hui), reward nouvellement débloquée (`progress.isRewardUnlocked` passe de faux à vrai), annulation (compteur qui baisse : aucune célébration), premier rendu (aucune célébration, voir `FIRST_PAINT_GRACE_MS`).
- File d'attente : si plusieurs événements arrivent, les jouer l'un après l'autre (jamais deux overlays superposés). Si une récompense est atteinte au même passage, **jouer d'abord D puis la médaille**.
- Composant overlay en `"use client"`, monté une fois dans l'arbre de l'accueil client (près de `LoyaltyRealtimeSync`), pas dans chaque carte. `aria-live="polite"` sur le texte, `role="status"`.
- Vibration : `navigator.vibrate(30)` comme le tampon actuel (`STAMP_VIBRATION_MS`), protégée.
- Fermeture : automatique à la fin, ou au toucher.
- **`prefers-reduced-motion`** : pas de roulement, pas de confettis ; la carte apparaît en fondu simple (200 ms) et reste ~2 s.
- **Jamais sur l'écran caisse** (`/pro/...`) : cette animation est côté client seulement.
- Seulement `transform` et `opacity` animés (+ `filter` ponctuel pour `tickPop` si mesuré sans coût).
- Constantes (durées, nombre de confettis, délais) dans `features/loyalty/constants.ts`, pas de nombres magiques.

## 3. Animation « Récompense disponible » (médaille)

**Source exacte** : `da-sources/Recompense2.dc.html`, bloc `<!-- 4 · médaille -->` (≈ lignes 162-190) + keyframes `ovlStay`, `spinCoin`, `rays`, `twinkle`, `ribbon`, `pieceBurst`, `fadeup`, `winIn`, `ripple`, `cardIn`.

**Déroulé**
1. Voile `rgba(14,31,23,0.82)` (`ovlStay .4s`), **reste jusqu'au toucher**.
2. Rayons lime en fond qui tournent lentement (`rays`, conic-gradient masqué).
3. Confettis (36 pièces dans la planche ; **réduire à ≤ 24** par économie), aux couleurs de la marque.
4. Médaille lime `#C8F25A` (220 px, anneau forêt) qui tourne comme une pièce (`spinCoin`), rubans qui se déploient (`ribbon`), coche ou tampon de la marque au centre.
5. Étoiles qui scintillent (`twinkle`, 4 SVG).
6. Texte : **« Récompense disponible »** (lime, Bricolage 800 34 px), puis « Menu offert chez {commerce} » (libellé réel de la récompense, `LoyaltyProgramSummary`), puis bouton.
7. Bouton « Le montrer en caisse » : ferme l'overlay et ramène sur l'accueil où le QR est visible (`/`), ou si déjà sur `/`, remonte au QR. Un second bouton/lien « Plus tard » est autorisé (fermer = toucher n'importe où).

**Règles**
- Déclenchée par l'événement `reward` du domaine (§2), une seule fois par récompense. Mémoriser dans `sessionStorage` (clé versionnée, ex. `rezone.reward-seen.v1`) l'id de la carte + palier déjà montré pour ne pas rejouer au rechargement. Si le stockage est indisponible, ne pas rejouer à chaque rendu (garde en mémoire).
- `reward-unlocked-banner.tsx` existant **reste** (état persistant sur la carte).
- Reduced motion : fond, médaille statique, textes en fondu, pas de rotation ni de rayons ni de confettis.
- Accessibilité : `role="dialog"` `aria-modal="true"`, focus sur le bouton, Échap ferme, lecture du titre.

## 4. Bannière d'installation (nouveau visuel)

**Source exacte** : `da-sources/Installer.dc.html`, colonne « PROPOSÉ » (≈ lignes 70-115) ; comparer avec « ACTUEL » (≈ lignes 36-70).
Fichier à modifier : `src/features/pwa/components/install-banner.tsx` (déjà proche de la limite de lignes : **découper** en sous-composants `install-benefits.tsx`, `install-banner-icon.tsx`, etc.).

**Contenu**
- Icône de l'app (`/brand/icon-rezone.svg` ou l'icône déjà dans `public/brand/`) à gauche.
- Titre : **« Ajoute Rézone à tes applis »**.
- Sous-titre : « Ton QR et tes cartes s'ouvrent en un geste, comme une vraie appli. » (le « même sans réseau » est maintenant exact depuis ADR-025 pour le QR/code de secours uniquement : ne pas promettre les cartes hors-ligne, cf. DT-010.)
- Trois repères alignés sur une ligne, **centrés et de même largeur** : « Ton QR », « Tes cartes », « Les commerces ». Icônes en trait arrondi dans un cercle crème (pas de carrés gris) : QR (grille), **carte** (pas de boussole), **carte de commerce/vitrine** pour « Les commerces » (la planche donne les SVG exacts).
- Boutons : « Installer » (primaire) / « Plus tard » (Android) ; iOS : étapes « Partager → Sur l'écran d'accueil » (`IosInstallSteps`) et « J'ai compris ».
- Fond : crème `#FFF4E6` + bordure forêt (cf. planche), plus d'aplat `bg-gain/30`.

**Ne pas changer** : `decide-install-banner.ts` (modes `hidden | prompt | ios-guide`), le mécanisme de refus mémorisé (`rezone.install-dismissed.v1`), l'affichage conditionné à `hasFirstVisit`. Les tests existants doivent rester verts.

## 5. Animation « après installation »

**Source exacte** : `da-sources/Installer.dc.html`, bloc « animation d'installation réussie » (≈ lignes 132-157) + keyframes `ovlIn`, `panelIn`, `iconDrop`, `ripple`, `slotPulse`, `slotOut`, `spark`, `fadeup`.

**Déroulé (≈ 2,6 s)** : voile → panneau (`panelIn`) → l'icône Rézone tombe (`iconDrop`) vers un emplacement d'écran d'accueil qui pulse puis se remplit (`slotPulse`/`slotOut`), onde (`ripple`), étincelles (`spark`), puis texte **« Rézone est sur ton écran d'accueil »** + 3 repères (ton QR, tes cartes, les commerces) + bouton **« Compris »** qui apparaît à ~2,6 s. L'écran reste jusqu'au toucher.

**Déclenchement (point délicat)**
- Événement `appinstalled` (Chromium/Android uniquement). Aujourd'hui `useInstallPrompt()` appelle `markInstalled()` qui **masque la bannière tout de suite** : l'animation doit donc être **un état indépendant** (ex. `useInstallSuccess()` qui écoute `appinstalled` et expose `visible` + `dismiss`) rendu par un composant `install-success-overlay.tsx` monté à côté de `InstallBanner` (pas dans la bannière, qui disparaît).
- Ne pas la déclencher au clic sur « Installer » ni sur `userChoice === 'accepted'` seul : attendre `appinstalled`.
- iOS : **aucune animation** (Safari ne signale pas l'installation). Ne pas inventer de détection.
- Après « Compris » : fermer, ne plus la montrer (même mécanisme que le refus : une clé versionnée en `localStorage`, try/catch).
- Reduced motion : panneau en fondu, icône déjà posée, pas d'étincelles.

## 6. Correctif des traits au-delà de 10

Dans `segmented-progress.tsx` : la 2e rangée (ex. `13/15`) doit utiliser la **même largeur de trait que la 1re** (alignés sur la même grille, rangée incomplète alignée à gauche, pas étirée). Vérifier avec 11, 13, 15, 20 passages. Ajouter un test de la fonction de découpage en rangées si elle est pure.

## 7. Contraintes du dépôt (rappel, non négociables)

- `.cursorrules` : fichiers < 150 lignes, fonctions/composants < 40 lignes, **un composant exporté par fichier** (kebab-case), pas de nombres magiques (constantes de feature), `"use client"` le plus bas possible, pas de `any`/`!`/`@ts-ignore`, types de retour explicites, pas d'import profond entre features, pas de `../../`, texte UI en français, code et commits en anglais, Conventional Commits.
- Lire `node_modules/next/dist/docs/` avant de coder (Next 16).
- **Aucune dépendance nouvelle** (pas de Framer Motion ni de lib de confettis) : CSS keyframes dans `globals.css` (`--animate-*` dans `@theme inline`) ou CSS dédié.
- Animer uniquement `transform` / `opacity`.
- Logique pure dans `domain/` avec tests Vitest (`pnpm test`), aucun test existant ne doit casser (199 à la fin de la Session 34).
- Aucun changement de base de données, de RPC, de service worker (`public/sw.js`), ni de `offline.html` (sauf `background_color`/couleur de fond de la page si le fond change : validation visuelle).
- Le temps réel (`useLoyaltyCardsRealtime` → `router.refresh()`) et le flux d'installation ne doivent pas changer de comportement.
- CHANGELOG obligatoire (`Documentation/CHANGELOG_ET_DECISIONS.md`) : entrée **Session 35** + mise à jour de la roadmap (DA.5/DA.6 selon ce qui est fait). Dernière ligne de la réponse finale : `📝 CHANGELOG mis à jour : Session 35 — <titre>`.

## 8. Vérification (obligatoire, mesurée)

1. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` verts. `pnpm test:e2e` sans session : mêmes résultats qu'avant (14 OK, 20 ignorés).
2. Tester sur le **build de production** (`pnpm build && pnpm start`), pas en dev (pièges de cache Turbopack).
3. Pour chaque animation : **échantillonner des valeurs calculées** (opacité, transform) à plusieurs instants avec Playwright (ex. 0 / 300 / 900 / 2000 ms) et vérifier qu'elles changent. Leçon des bugs passés : une animation peut « réussir » en test et être invisible (opacité 0 qui reste, `translate` non joué, intro trop courte).
4. Captures à 375 px comparées à `da-mockups/v2/global.png` (accueil, bannière, frame D, frame médaille, frame après installation).
5. Reduced motion : émuler `prefers-reduced-motion: reduce`, vérifier les replis.
6. Lighthouse `/` ≥ 86 (mobile) avant/après ; si baisse > 2 points, réduire confettis.
7. Dire explicitement ce qui n'a **pas** pu être vérifié (installation réelle Android, iOS, vibration, passage de scan réel avec session) : ces points restent à essayer sur téléphone.

## 9. À savoir

- Le `Global.dc.html` montre 10 écrans : 1 Connexion, 2 Accueil + bandeau, 3 Accueil installée, 4 Détail avec bannière, 5 Caisse, 6 Intro, 7 Scan D, 8 Médaille, 9 Après installation, 10 Découvrir. Il sert de cible visuelle.
- Les planches sont du HTML de maquette (positions absolues, styles inline) : **on reprend les valeurs** (couleurs, durées, courbes, tailles), **pas le markup tel quel**. Reconstruire avec Tailwind + tokens.
- La note « service worker absent » dans `Installer.dc.html` est **obsolète** (ADR-025, Session 32).
- La note « Plus tard : réapparaît après quelques jours » dans la planche n'est **pas** le comportement actuel (refus mémorisé sans date) : ne rien changer à la logique.
