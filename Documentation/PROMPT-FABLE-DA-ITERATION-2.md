Tu reprends le projet Rézone (dépôt `Fidly`, branche `feat/phase-7bis-da`, état : fin de la Session 34, HEAD 65d81cb). Ta mission : implémenter les derniers changements de direction artistique **déjà validés** par le porteur de projet, sans rien casser et en respectant toutes les règles du dépôt. Le code et les tests existants sont la référence de comportement ; la DA décrit seulement l'apparence et le mouvement.

## 1. Lis d'abord (dans cet ordre, avant d'écrire une ligne)
1. `.cursorrules` (et `AGENTS.md`), puis `node_modules/next/dist/docs/` pour ce que tu touches (Next 16, App Router, React 19).
2. **`Documentation/06-DA-ITERATION-2.md`** : la spécification complète de la mission (décisions, déroulés, architecture, contraintes, vérification). C'est ton cahier des charges.
3. `Documentation/da-mockups/v2/global.png` : la cible visuelle (10 écrans à 375 px : 1 Connexion, 2 Accueil + bandeau, 3 Accueil installée, 4 Détail avec bannière, 5 Caisse, 6 Intro, 7 Scan D, 8 Médaille, 9 Après installation, 10 Découvrir).
4. `Documentation/da-sources/` : code exact des animations validées (valeurs, keyframes, durées, courbes) : `Recompense.dc.html` (scan **D**), `Recompense2.dc.html` (**médaille**, phone 4), `Installer.dc.html` (bannière et animation après installation), `FondChaud.dc.html` (fond **A**), `Global.dc.html` (vue d'ensemble). Ces fichiers sont des maquettes en positions absolues et styles inline : **reprends les valeurs, pas le markup**. Ils ne s'ouvrent pas seuls dans un navigateur, lis-les.
5. `Documentation/05-DIRECTION-ARTISTIQUE.md`, `05b-ECRANS-SPEC.md`, `CHANGELOG_ET_DECISIONS.md` (surtout Session 34, ADR-024 et ADR-025).
6. Le code concerné : `src/features/pwa/`, `src/features/loyalty/` (`use-just-added`, `use-loyalty-cards-realtime`, `plus-one-burst`, `reward-unlocked-banner`, `segmented-progress`, `constants`), `src/app/(client)/page.tsx`, `src/app/globals.css`.

## 2. Ce qu'il faut livrer
1. **Fond chaleureux (option A)** : changer les tokens de `globals.css` (valeurs dans le doc §1), chasser les couleurs en dur équivalentes, QR toujours sur blanc pur, aligner `background_color` du manifest.
2. **Animation de scan « D · carte dévoilée »** quand le client est scanné (le « +1 » existant reste).
3. **Animation médaille « Récompense disponible »** quand une récompense devient disponible.
4. **Nouvelle bannière d'installation** qui explique l'intérêt (ajoute Rézone aux applis du téléphone : ton QR, tes cartes, les commerces), avec les nouvelles icônes.
5. **Animation « Rézone est sur ton écran d'accueil »** après installation.
6. **Correctif** : 2e rangée de traits (ex. `13/15`) à la même largeur que la 1re.

## 3. Règles non négociables
- `.cursorrules` : fichiers < 150 lignes, fonctions/composants < 40 lignes, un composant exporté par fichier (kebab-case), pas de nombres magiques (constantes de feature), `"use client"` le plus bas possible, pas de `any` / `!` / `@ts-ignore`, types de retour explicites, pas d'import profond entre features, pas de `../../`. UI en français, code et commits en anglais, Conventional Commits.
- **Aucune dépendance nouvelle** (pas de lib d'animation ni de confettis). CSS keyframes, `transform` et `opacity` seulement.
- **Aucun changement** de base de données, de RPC, de `public/sw.js`, de `offline.html` (hors couleur de fond), de `decide-install-banner.ts`, de `install-environment-store.ts`, du temps réel (`router.refresh()` à 200 ms de debounce), du flux d'installation (`beforeinstallprompt`, `markInstalled`, refus mémorisé).
- **Pas d'UI optimiste** pour les points et récompenses : les animations partent quand les nouvelles props serveur arrivent (détection d'augmentation entre deux rendus, comme `use-just-added`).
- Logique pure dans `domain/` + tests Vitest (détection des célébrations : aucun changement, +1, +2 d'un coup, carte nouvelle, récompense nouvellement débloquée, annulation, premier rendu). Les 199 tests existants restent verts.
- `prefers-reduced-motion` : replis décrits dans le doc, pour **chaque** animation.
- Pas d'animation décorative sur l'écran caisse (`/pro`). Les célébrations sont côté client uniquement.
- Une seule overlay à la fois (file d'attente ; si le passage débloque une récompense : D puis médaille). Médaille rejouée **une seule fois** par récompense (mémoire en `sessionStorage` versionnée, en try/catch).
- Animation d'installation : **indépendante de la bannière** (qui se masque dès `appinstalled`), déclenchée sur `appinstalled` uniquement, **jamais sur iOS** (Safari ne détecte pas l'installation, ne l'invente pas).
- Ne promets pas dans les textes ce qui n'existe pas : hors-ligne = QR et code de secours seulement (DT-010).
- Ne touche pas aux secrets (`data.txt`) ni au `.pptx` non suivi. **Ne pousse pas et ne fusionne pas** : commits locaux sur la branche, c'est le porteur qui décide.

## 4. Méthode
1. Commence par un **plan court** : fichiers à créer/modifier (découpe respectant les limites de lignes), noms des hooks/composants/fonctions de domaine, constantes, tests. Signale tout désaccord avec la spec ou toute ambiguïté **avant** de coder, et demande uniquement ce qui change vraiment ton approche. Sinon enchaîne.
2. **Un commit par sujet** (fond ; domaine de détection + tests ; scan D ; médaille ; bannière ; animation d'installation ; correctif des traits ; doc).
3. Mesure avant/après : Lighthouse `/` mobile (≥ 86), taille du JS de la route.
4. Vérifie sur le **build de production** (`pnpm build && pnpm start`), pas en dev. Pour chaque animation, **échantillonne les valeurs calculées** (opacité, transform) à plusieurs instants avec Playwright et prouve qu'elles évoluent (nous avons déjà eu des animations « vertes » mais invisibles : opacité restée à 0, `translate` non joué, intro trop courte). Capture à 375 px et compare à `global.png`. Teste aussi avec `prefers-reduced-motion: reduce`.
5. Fin : `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` (14 OK, 20 ignorés sans session, 0 échec).

## 5. Rapport final attendu
- Ce qui est fait, commit par commit, et ce qui s'écarte de la spec (avec la raison).
- Mesures (Lighthouse, tests, taille).
- **Ce qui n'a pas pu être vérifié** (installation réelle Android, iPhone, vibration, scan réel avec session, temps réel de bout en bout) et ce que le porteur doit essayer sur téléphone.
- Entrée **Session 35** dans `Documentation/CHANGELOG_ET_DECISIONS.md` (+ roadmap DA.5/DA.6 si concerné) et dernière ligne : `📝 CHANGELOG mis à jour : Session 35 — <titre>`.
