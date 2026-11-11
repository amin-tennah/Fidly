# Rézone — Changelog & Registre des Décisions

> Mémoire du projet. Ce fichier répond à 3 questions : **Qu'est-ce qui a été fait ? Qu'est-ce qui a cassé ? Pourquoi a-t-on choisi ça ?**
> Sa mise à jour est **obligatoire** à la fin de chaque session (cf. `.cursorrules` §14).

---

## 📘 Mode d'emploi (consignes strictes)

### Quand écrire ?
| Événement | Action obligatoire |
|---|---|
| Fin de session / tâche ayant modifié code, config, DB ou dépendances | Nouvelle entrée dans **Journal des sessions** (en haut) |
| Nouvelle dépendance, pattern d'architecture, changement de schéma, changement de stack, dérogation aux règles | Nouvel **ADR** + ligne dans l'index |
| Raccourci volontaire / TODO structurel / contournement temporaire | Ligne dans **Dette technique** |
| Bug non trivial (> 15 min de recherche, ou en production, ou faille sécurité) | Ligne dans le tableau *Bugs* de la session, avec **cause racine** |
| Question métier/technique non tranchée | Ligne dans **Questions ouvertes** |

### Règles d'écriture
1. **Antichronologique** : la session la plus récente est en haut du journal.
2. **Numérotation continue** : `Session N` (jamais réutilisée), `ADR-NNN`, `DT-NNN`, `Q-NNN`.
3. **Le *pourquoi* avant le *quoi*** : un ADR sans alternatives écartées est invalide.
4. **Factuel et court** : puces, pas de prose. Lien vers les fichiers (`src/...`) plutôt que du code collé.
5. **Un ADR n'est jamais supprimé** : s'il est remplacé, passer son statut à `Remplacé par ADR-XXX`.
6. **Bug = cause racine + prévention** : « corrigé » ne suffit pas, on note pourquoi c'est arrivé et quel test l'empêche de revenir.
7. **Lien roadmap** : chaque session référence l'étape de `04-ROADMAP.md` concernée.
8. Le message final de l'IA se termine par : `📝 CHANGELOG mis à jour : Session N — <titre>`.

### Statuts
- Session : ✅ Terminé · 🟡 Partiel · 🔴 Bloqué
- ADR : 💭 Proposé · ✅ Accepté · ⛔ Rejeté · 🔁 Remplacé par ADR-XXX
- Dette : 🔴 Haute · 🟠 Moyenne · 🟢 Basse — ⏳ Ouverte · ✔️ Remboursée

---

## 🧭 État courant (à mettre à jour à chaque session)

- **Phase en cours :** Phases 0 à 7 terminées · jalon M1 validé · Phase 7 bis validée sur téléphone (restent : Lighthouse `/` et temps de scan ; chevalet DA.7 reporté) · Phase 8 : 8.1 à 8.4 faites et validées sur Android (restent : iPhone, mise à jour sur un second déploiement) · `feat/phase-7bis-da` fusionnée dans `main` (Session 37) · prochaine phase : 9
- **Dernière session :** Session 37 (2026-11-11) — Clôture des Phases 7 bis et 8 après les essais sur Android, fusion dans `main`
- **Prochaine action :** lancer les 20 e2e connectés (`E2E_SESSION`), mesurer Lighthouse `/` (≥ 86) et rechronométrer le scan (< 3 s) ; test du cookie modifié (DT-003) ; puis Phase 9 (Découvrir le quartier, DT-009). Plus tard : iPhone (bannière, installation), mise à jour de l'app installée sur un second déploiement, barre de navigation Android sur les onglets pro (Session 33, point 2), chevalet (DA.7)
- **Bloquants :** Aucun

---

## 📒 Journal des sessions

<!-- ============ TEMPLATE SESSION (copier au-dessus de la dernière session) ============
### Session N — [YYYY-MM-DD] — Titre court
**Roadmap :** Phase X — Étape X.Y · **Statut :** ✅ / 🟡 / 🔴 · **Branche :** `feat/...`

**Réalisé**
- feat: ...
- fix: ...

**Fichiers clés**
- `src/...` — rôle en 1 ligne

**Base de données**
- Migration : `supabase/migrations/YYYYMMDDHHMMSS_xxx.sql` — résumé (ou « Aucune »)
- Types régénérés : oui / non concerné

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|

**Décisions** : ADR-XXX (ou « Aucune »)
**Dette introduite / remboursée** : DT-XXX (ou « Aucune »)

**Tests de validation**
- [x] Test réalisé — résultat
- [ ] Test non réalisé — raison

**Prochaine étape** : ...
==================================================================================== -->

### Session 37 — [2026-11-11] — Clôture des Phases 7 bis et 8 après les essais sur Android
**Roadmap :** Phase 7 bis (validation) · Phase 8 (validation) · restes des Phases 0, 3 et 6 · **Statut :** ✅ Terminé (clôture documentaire et fusion ; restes listés ci-dessous) · **Branche :** `feat/phase-7bis-da` → `main`

**Réalisé** (aucun code applicatif modifié)
- Résultats des essais du porteur de projet sur Android (Sessions 33 à 36). Validés : installation par l'invite et animation, guide Android après désinstallation, scan réel (« carte dévoilée », vibration, médaille), mode avion (pastille, heure des cartes, QR, sortie de la page hors-ligne), étapes de connexion par code sans superposition
- Session 33, point 3 (retour par geste chargé deux fois) : **non reproduit**, clos. Point 2 (barre de navigation Android sur les onglets pro) : non revu, reste à surveiller
- Visuel de la bannière (Session 35) : celui de la planche est conservé (carte blanche, bordure sable)
- Roadmap cochée : DA.5 (clos sans maquette des logs, réglages et `/admin`, résultat jugé satisfaisant), tests 7 bis (contrastes AA, scanner lisible, QR inchangé, lint/typecheck/test, retours de personnes), 8.1, Lighthouse PWA installable, mode avion ; Phase 3 (parcours par rôle, session persistante, e2e OTP non applicable) ; Phase 6 (E2E remplacé par les essais manuels)
- DA.7 : chevalet imprimable reporté à plus tard. 0.4 : nom de domaine pas encore acheté (Phase 11)
- `.gitignore` : les présentations `*.pptx` (récapitulatif personnel) sont ignorées
- Fusion de `feat/phase-7bis-da` dans `main`, envoi de `main` sur GitHub

**Base de données** : aucune migration. **Bugs rencontrés** : aucun. **Décisions** : aucun ADR.
**Dette introduite / remboursée** : DT-007 remboursée (essais manuels suffisants) ; DT-010 fermée (limite assumée, ADR-025) ; DT-003 en grande partie remboursée (reste le cookie modifié) ; DT-011 gardée pour le moment ; DT-001, 002, 005, 008, 009 restent prévues comme dans la roadmap.

**Tests de validation**
- [x] Essais sur Android par le porteur de projet : voir « Réalisé »
- [ ] iPhone : non testé (pas d'appareil disponible) ; la case « installation iOS Safari » de la Phase 8 reste ouverte
- [ ] Lighthouse de `/` (≥ 86) et temps de scan (< 3 s) après l'itération 2 : pas encore mesurés
- [ ] Les 20 e2e connectés (`E2E_SESSION`) : pas encore lancés
- [ ] Cookie/JWT modifié côté client (Phase 3, DT-003) : pas encore testé
- [ ] Mise à jour de l'app installée sur un second déploiement (Phase 8) : à tester plus tard

**Prochaine étape** : e2e connectés, Lighthouse `/` et temps de scan, puis Phase 9.

### Session 36 — [2026-11-11] — Bannière d'installation : retrait du bouton « Plus tard »
**Roadmap :** Phase 8 — 8.3 · **Statut :** 🟡 Partiel (code et tests automatiques verts ; guide Android à essayer sur téléphone) · **Branche :** `feat/phase-7bis-da`

**Réalisé** : en mode invite (Android/Chrome), la bannière n'a plus que « Installer » ; « Plus tard » est supprimé (`install-banner.tsx`). Le mode guide iOS garde « J'ai compris » (seul moyen de fermer la bannière). `e2e/install.spec.ts` vérifie l'absence du bouton.
**Conséquence à noter** : en mode invite, la bannière ne peut plus être refusée ; `dismiss` n'est plus appelé dans ce mode, donc le refus mémorisé ne se déclenche plus (elle disparaît à l'installation).
**Suite — réinstallation** : le refus n'est plus mémorisé pour toujours. `install-storage.ts` utilise `sessionStorage` (l'ancienne clé `localStorage` est ignorée) : « J'ai compris » (iOS) ne masque la bannière que pour la session de navigateur ; un refus de l'invite native ne se mémorise plus (l'événement Chrome est à usage unique, la bannière revient à la visite suivante). L'état « installé » n'a jamais été persisté : une app désinstallée, rouverte dans le navigateur, revoit la bannière dès que Chrome renvoie `beforeinstallprompt`.
**Suite — essai sur téléphone** : installé puis désinstallé sur Android, Chrome n'a pas renvoyé `beforeinstallprompt` et la bannière ne revenait pas. Ajout d'un mode `android-guide` (`decide-install-banner.ts`, `isAndroidDevice`, `android-install-steps.tsx`) : sur Android sans invite native, la bannière montre les étapes du menu ⋮ de Chrome (« Installer l'appli » / « Ajouter à l'écran d'accueil ») avec « J'ai compris » (fermeture pour la session). L'invite native reste prioritaire quand Chrome la fournit.
**Limite** : Chrome décide quand renvoyer `beforeinstallprompt`. Si l'app est installée mais que la personne ouvre le site dans un onglet Chrome, la page ne peut pas le savoir (pas de `getInstalledRelatedApps` configuré) : le guide Android s'y affiche aussi.
**Fichiers clés** : `src/features/pwa/domain/decide-install-banner.ts` et `detect-platform.ts` (mode `android-guide`), `components/android-install-steps.tsx`, `install-banner.tsx`, `install-storage.ts` (`sessionStorage`), `install-environment-store.ts`, `hooks/use-install-banner.ts` ; `e2e/install.spec.ts`.
**Base de données** : aucune migration. **Bugs rencontrés** : aucun. **Décisions** : aucun ADR, aucune dépendance. **Dette** : aucune nouvelle ligne (limite « app installée ouverte dans un onglet » notée ci-dessus).
**Roadmap** : libellé de 8.3 mis à jour (« fermeture pour la session » au lieu de « refus mémorisé », guide Android ajouté).

**Tests de validation**
- [x] `pnpm lint`, `typecheck`, `test` (221, soit 219 + 2), `build` verts ; `pnpm test:e2e` sans session : 25 réussis, 20 ignorés, 0 échec
- [x] e2e : le premier test de la bannière attendait l'absence de bannière avant l'invite ; le profil Playwright (Pixel 5) est Android, donc le guide s'affiche désormais : test scindé en deux (guide Android sans invite puis « J'ai compris » qui ferme jusqu'au rechargement ; invite native avec « Installer » seul)
- [ ] À essayer sur téléphone : Android après désinstallation (guide visible, étapes justes dans le menu ⋮ de Chrome), Android avec invite native (« Installer » seul), iPhone (« J'ai compris » ne masque que pour la session)

**Prochaine étape** : essai sur téléphone de la bannière (Android désinstallé puis réinstallé, iPhone), puis les essais restants de la Session 35 et la fusion de `feat/phase-7bis-da`.

### Session 35 — [2026-11-11] — DA, itération 2 : fond crème, célébrations de scan et de récompense, installation
**Roadmap :** Phase 7 bis — DA.6 (itération 2) · Phase 8 — 8.3 (nouveau visuel) · **Statut :** 🟡 Partiel (code, tests et mesures en navigateur verts ; rien essayé sur téléphone ni avec une session réelle) · **Branche :** `feat/phase-7bis-da`

Cahier des charges : `Documentation/06-DA-ITERATION-2.md` (décisions validées par le porteur de projet le 2026-11-11). Aucune logique métier, aucune base de données, aucun service worker modifié.

**Réalisé**
- feat(da) (`df56c90`) : fond crème léger (option A). Tokens seulement : `--background #fbf6ec`, `--border #e7e0cf`, fonds doux `#f3eedf`, trait vide `#e9e2d0` ; cartes et QR toujours blancs ; `background_color` du manifest aligné. `--input` inchangé
- feat(loyalty) (`5d1d7a8`) : domaine pur `detect-card-celebrations` (compare deux lectures serveur des cartes : événement `stamp` avec `from`/`to`, événement `reward`), confettis déterministes `confetti-pieces`, constantes des célébrations
- fix(loyalty) (`0f6f245`) : traits au-delà de 10 (`13/15`) : une seule grille calée sur une première rangée pleine, la rangée incomplète garde la même largeur de trait, alignée à gauche
- feat(loyalty) (`a957a79`) : animation de scan « carte dévoilée » puis médaille « Récompense disponible », montées une fois sur l'accueil client (`CardCelebrations`), jouées l'une après l'autre (file d'attente), uniquement quand les nouvelles props serveur arrivent. Le « +1 » existant reste. Médaille mémorisée par carte et palier en `sessionStorage` (`rezone.reward-seen.v1`, repli en mémoire)
- feat(pwa) (`1b77d57`) : bannière d'installation redessinée (icône de l'app, « Ajoute Rézone à tes applis », trois repères avec les icônes validées) ; `decide-install-banner`, le refus mémorisé et le flux d'installation sont inchangés
- feat(pwa) (`88e9e8f`) : animation « Rézone est sur ton écran d'accueil », état indépendant de la bannière (`useInstallSuccess`), déclenchée par `appinstalled` seulement, jamais sur iOS ; fermée une fois pour toutes par « Compris » (`rezone.install-celebrated.v1`)
- test(da) (`46cdbc3`) : page d'aperçu `/login/da-preview` (cartes fictives, 404 sans `DA_PREVIEW=1`) et 10 tests navigateur qui échantillonnent les valeurs peintes pendant les animations ; écran de connexion passé sur le fond crème léger (maquette 1)

**Fichiers clés**
- `src/features/loyalty/domain/detect-card-celebrations.ts`, `confetti-pieces.ts`, `segment-rows.ts` — logique pure testée
- `src/features/loyalty/hooks/use-card-celebrations.ts` (file d'attente), `use-scan-reveal.ts` (horloge, vibration, fermeture au toucher) ; `components/card-celebrations.tsx`, `scan-reveal-overlay.tsx`, `reward-medal-overlay.tsx`, `reward-medal.tsx`, `confetti-burst.tsx` ; `reward-seen-storage.ts`
- `src/features/pwa/components/install-banner.tsx`, `install-benefits.tsx`, `benefit-icon.tsx`, `app-icon.tsx`, `install-success-overlay.tsx`, `home-screen-drop.tsx` ; `hooks/use-install-success.ts`
- `src/app/globals.css` — tokens du fond, keyframes des trois animations (transform et opacité seulement), repli `.reduced-fade`
- `src/lib/prefers-reduced-motion.ts`, `src/lib/use-close-on-escape.ts` — partagés par les deux features
- `e2e/celebrations.spec.ts`, `celebrations-fallbacks.spec.ts`, `install.spec.ts`, `da-preview.ts`

**Base de données** : aucune migration ; types non concernés.

**Bugs rencontrés** : aucun.

**Décisions** (pas de nouvel ADR, aucune dépendance)
- Bannière : le §4 du cahier des charges (fond crème, bordure forêt, icônes dans un cercle) et la planche validée (`Installer.dc.html`, `global.png` : carte blanche, bordure sable, repères séparés par un filet, sans pastille) se contredisent. Textes repris du cahier des charges, visuel repris de la planche. À confirmer par le porteur de projet
- Compteur de l'animation de scan : teinte claire de la carte = token `--hue-N-dark` (le cahier des charges écrit `-light`, mais dans `globals.css` `-light` est le ton foncé sur blanc)
- Phrase de l'animation de scan : `describeCardMessage` existant (« … avant ta récompense »), comme la grosse carte ; « ton menu offert » de la maquette ne s'accorde pas avec tous les libellés
- Animation de scan : elle laisse passer les touchers (`pointer-events: none`) et se ferme au premier toucher, qui atteint aussi l'écran dessous
- Médaille : 24 confettis (36 dans la planche) ; tout toucher la ferme ; « Le montrer en caisse » remonte au QR (la médaille n'existe que sur l'accueil)
- Animation d'installation : fermée par « Compris » ou Échap seulement, pas par un toucher ailleurs (le bouton n'apparaît qu'à 2,6 s : un toucher involontaire l'aurait fermée pour toujours)
- Une carte vue pour la première fois ne joue pas l'animation de scan (pas de chiffre « avant ») ; les célébrations ne sont montées que sur l'accueil, pas sur l'écran d'une carte (qui garde son « +1 »)
- Scan et médaille livrés dans un même commit : la file d'attente les relie, un commit intermédiaire aurait laissé une récompense sans affichage

**Dette introduite / remboursée** : DT-011 (page d'aperçu livrée dans le build). Limite connue : la clé « médaille déjà vue » est par carte et palier ; un second cycle complet du même palier dans la même session de navigateur ne rejoue pas la médaille.

**Tests de validation**
- [x] `pnpm lint`, `typecheck`, `test` (219, soit 199 + 20), `build` verts ; `pnpm test:e2e` sans session : 24 réussis (14 + 10 nouveaux), 20 ignorés, 0 échec
- [x] Sur le build de production, valeurs calculées échantillonnées pendant chaque animation : scan (carte à l'échelle < 1 puis 1, nouveau chiffre opacité 0 puis 1, disparition seule en 3,4 s, fermeture au toucher), médaille (après le scan, pièce à l'échelle < 1 puis 1, titre opacité 0 puis 1, bouton focalisé, Échap, une seule fois par récompense), installation (icône au-dessus puis posée, bouton opacité 0 puis 1, pas de rejeu après « Compris », rien sur la seule acceptation de l'invite)
- [x] `prefers-reduced-motion` : scan en fondu sans roulement ni confettis, parti en ~2,2 s ; installation avec icône déjà posée. Médaille réduite : même code de repli, non mesurée séparément
- [x] Captures à 375 px comparées à `da-mockups/v2/global.png` : bannière, scan D, médaille, après installation, cartes `13/15`, connexion
- [x] Lighthouse mobile sur le build local : `/login` performance 95, accessibilité 100 ; `/login/da-preview` (bannière, cartes, célébrations chargées) 95 et 100
- [ ] Lighthouse de `/` et taille du JS de la route : non mesurés (l'accueil exige une session ; pas de mesure avant/après)
- [ ] Non vérifié, à essayer sur téléphone : scan réel avec session (temps réel de bout en bout, enchaînement scan puis médaille), installation réelle sur Android (`appinstalled`, animation, bannière disparue), iPhone (étapes de la bannière, aucune animation), vibration, fluidité sur un appareil modeste
- [ ] Les 20 e2e connectés (`E2E_SESSION`) : non relancés

**Prochaine étape** : essai sur téléphone des cinq changements, arbitrage du visuel de la bannière, puis fusion de `feat/phase-7bis-da`.

### Session 34 — [2026-11-11] — Phase 8 : bannière d'installation, indicateur hors-ligne, Q-015
**Roadmap :** Phase 8 — 8.3 et 8.4 · **Statut :** 🟡 Partiel (code et tests automatiques verts, pas encore essayé sur téléphone) · **Branche :** `feat/phase-7bis-da`

**Réalisé**
- db (`338feb6`) : Q-015 appliquée, un palier réactivé reprend les cartes que sa désactivation avait avancées quand leurs passages sont inférieurs à son seuil ; les passages ne changent jamais. Migration `20261111100001_reactivated_program_takes_cards_back.sql`, trois cas ajoutés à `loyalty_programs.test.sql`. Appliquée et testée par le porteur de projet (je n'ai pas pu joindre la base depuis cet environnement)
- feat(pwa) 8.3 (`b3ee7a4`) : bannière d'installation sur l'accueil client, affichée dès que le client a une carte (premier passage crédité). Android Chrome : bouton « Installer » (événement `beforeinstallprompt`) ; iPhone et iPad : étapes « Partager » puis « Sur l'écran d'accueil » ; masquée si l'app est installée ou ouverte en plein écran, ou si le client a refusé (refus mémorisé dans `localStorage`, une seule fois). Un refus du message natif compte comme un refus
- feat(pwa) 8.4 (`b3ee7a4`) : pastille « Hors ligne » discrète sur tous les écrans (état du navigateur) ; sur l'accueil, ligne « Hors ligne · cartes à jour à HH:MM » (heure de lecture côté serveur, affichée seulement hors-ligne)
- test : 9 tests unitaires (décision de la bannière, détection iOS), 1 test e2e de la pastille

**Fichiers clés**
- `src/features/pwa/` — nouvelle feature : `domain/decide-install-banner.ts` et `detect-platform.ts` (logique pure), `install-environment-store.ts` (état du navigateur pour `useSyncExternalStore`), `hooks/`, `components/`
- `src/app/layout.tsx` — pastille ; `src/app/(client)/page.tsx` — bannière et heure de lecture

**Base de données** : migration Q-015 ci-dessus ; types non concernés (signature inchangée).

**Bugs rencontrés** : aucun.

**Décisions** : aucune dépendance, pas de nouvel ADR. Choix : « premier passage réussi » = le client a au moins une carte ; l'état « en ligne » vient de `navigator.onLine` (un indice, pas une preuve : un Wi-Fi sans internet se lit « en ligne »), suffisant pour une pastille discrète. L'API `useOffline` de Next est expérimentale et n'a pas été activée.
**Dette introduite / remboursée** : DT-010 reste ouverte (hors-ligne limité au QR) ; l'heure de mise à jour ne couvre que la page déjà chargée, pas un rechargement hors-ligne (la page de secours n'affiche pas les cartes).

**Tests de validation**
- [x] `pnpm lint`, `typecheck`, `test` (199), `build` verts ; e2e sans session : 14 réussis, 20 ignorés, 0 échec
- [ ] Non exécuté : parcours de la bannière dans un navigateur (l'accueil exige une session) ; seule sa logique de décision est testée
- [ ] À faire sur téléphone : Android (installation réelle, bannière disparue ensuite, refus mémorisé), iPhone (étapes lisibles, bannière absente dans l'app installée), pastille en mode avion, heure affichée sur l'accueil hors-ligne
- [ ] Roadmap Phase 8, tests de validation : Lighthouse PWA installable, mode avion et mise à jour d'un second déploiement, toujours à faire

**Prochaine étape** : essai sur téléphone de 8.3 et 8.4, puis validation de la Phase 8.

### Session 33 — [2026-11-11] — Retour du test sur Android : connexion, page hors-ligne, points ouverts
**Roadmap :** Phase 7 bis — DA.6 (finition) et Phase 8 — 8.2 · **Statut :** 🟡 Partiel (2 corrections livrées, 3 points en attente) · **Branche :** `feat/phase-7bis-da`

**Contexte** : première série de tests sur téléphone réel (Android, Galaxy S26 Ultra, build de production par tunnel) des lots 1 à 8 de la Session 32. Parcours 1 à 17 : 14 sans remarque, 3 écarts, plus 4 remarques libres.

**Réalisé**
- fix(pwa) (`12072f6`) : connexion par code, les deux étapes se lisaient l'une sur l'autre pendant le balayage ; l'étape qui part s'efface en 160 ms et celle qui arrive apparaît ensuite (`step-transition.tsx`, jeton `--dur-step-fade`)
- fix(pwa) (`12072f6`) : la page hors-ligne se rechargeait au retour du réseau mais restait sur elle-même ; elle teste maintenant le réseau (`/manifest.webmanifest`) à l'événement `online`, au retour au premier plan et toutes les 3 s, et ne recharge qu'en cas de réponse
- test : `offline.spec.ts` (sortie automatique de la page hors-ligne), `motion.spec.ts` (une seule étape visible)

**Base de données** : aucune migration.

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| Étapes de connexion superposées pendant le balayage | Les deux étapes sont empilées dans la même cellule ; celle qui part ne recule que de 28 % alors que l'autre arrive de 100 % : 500 ms de chevauchement lisible. Mon audit n'avait mesuré que les positions, pas la lisibilité | Fondu des deux étapes | Test de rendu sur l'opacité ; à regarder sur téléphone à chaque changement d'animation |
| Page hors-ligne rechargée mais toujours affichée (retour du mode avion) | `online` se déclenche avant que la connexion transporte des données : le rechargement échoue et le worker resert la page hors-ligne. Playwright ne le reproduit pas (réseau rétabli instantanément) | Sonde réseau avant rechargement | Test e2e de sortie automatique ; vérification réelle en mode avion |

**Points ouverts**
1. **Palier réactivé non repris par les cartes** (Q-015) : `set_loyalty_program_active` déplace les cartes vers le palier actif suivant à la désactivation (Q-013), mais ne fait rien à la réactivation, donc les cartes restent sur le palier B. Le réordonnancement « corrige » en apparence : les seuils restent attachés aux places, donc B reprend le seuil de 10 ; ce n'est pas un vrai retour sur A. Correction = migration + tests pgTAP, après décision du porteur.
2. **Barre de navigation Android sur les onglets pro** : vue une fois, non reproduite au second essai. Hypothèse : hauteur de la fenêtre au moment où la barre du navigateur se replie. À surveiller, aucune modification faite.
3. **Retour par geste de gauche à droite : double chargement** (écran d'accueil) ; le geste de droite à gauche est fluide. Non reproductible sur ordinateur. Hypothèse : le geste du navigateur et notre glissement de retour (`NavDirectionListener`) se jouent tous les deux. Pas de correction à l'aveugle : enregistrement d'écran et contexte (onglet Chrome ou app installée) demandés.
4. **Idée** : animation de récompense plus visible côté client (à planifier avec la DA, hors périmètre des lots 1 à 8).

**Décisions** : aucune dépendance, pas de nouvel ADR. **Dette introduite / remboursée** : aucune.

**Tests de validation**
- [x] `pnpm lint`, `typecheck`, `test` (190) verts ; e2e hors connexion : offline et motion verts
- [x] Android (Galaxy S26 Ultra), parcours 1 à 15 et 17 : conformes sauf points 1 à 3 ci-dessus ; parcours 10 fait en 4G (la 3G n'est pas ciblée)
- [ ] Non revérifié sur téléphone : les deux corrections (à retester : connexion par code, retour du mode avion)
- [ ] Non vérifiés : iPhone (Safari, app installée), les 20 e2e connectés, Lighthouse

**Prochaine étape** : décision Q-015 puis migration ; retest des deux corrections sur Android ; diagnostic du retour par geste ; test iPhone.

### Session 32 — [2026-11-11] — Finition PWA : audit mesuré, socle d'app installée, animations, états, accessibilité et hors-ligne
**Roadmap :** Phase 7 bis — DA.6 (finition) et Phase 8 — 8.2 (service worker) · **Statut :** ✅ Terminé (lots 1 à 8 ; validation sur appareil physique à faire) · **Branche :** `feat/phase-7bis-da`

**Contexte** : mission « zéro friction » en lots validés un par un, chaque changement mesuré sur build de production (Playwright, 375 px). Lot 0 = audit, lots 1 à 8 = corrections. Le lot 9 initialement prévu était cette clôture.

**Réalisé**
- fix(da) (commits `193042d`, `a9b1ef2`, `8526f52`, antérieurs, non consignés jusqu'ici) : lettres de l'intro bloquées à `opacity: 0` ; liseré visible avant le balayage de chaque lettre ; glissement des étapes inerte (propriété animée `translate`, pas `transform`)
- audit mesuré, lot 0 (aucun fichier modifié) : relevés dans le tableau des tests ci-dessous
- feat(da) lot 1 (`0d00ad8`) : `viewport-fit=cover`, balises Apple (`statusBarStyle: "default"`), tokens `--safe-top` / `--safe-bottom` appliqués à tous les bords d'écran ; `overscroll-behavior: none`, pas de surbrillance au toucher, `touch-action: manipulation`, sélection de texte réservée aux champs et au code de secours ; manifest `id` et `scope` ; `playwright.config.ts` lance un build de production sur le port 3100
- feat(da) lot 2 (`b9e0f63`) : glissement vers une carte et retour par les view transitions de React (plus de `transform` sur `<main>`), « ‹ Mes cartes » dépile l'historique, squelette propre au détail d'une carte ; Chromium seulement (voir bugs)
- feat(da) lot 3 (`7533ed3`) : l'intro vit dans le layout racine, couvre le squelette, dure 1,9 s minimum et 4 s au plus, minuteries alignées sur l'animation rendue
- feat(da) lot 4 (`9608678`) : un squelette par écran (onglets pro, connexion, invitation, onboarding, admin), `retry` à la place de `reset` dans les `error.tsx`, 404 en français, `global-error`
- fix(da) lot 5 (`99a9467`) : le faux écran de caméra prend la boîte du viseur (plus de saut de 65 px), tiroir client en segments, erreurs de caméra expliquées en français, rouge d'erreur assombri (`#b42318`)
- fix(da) lot 6 (`421cfdf`) : `prefers-reduced-motion` annule aussi les délais de transition, seuls `transform` et `opacity` sont animés (deux exceptions documentées), cibles de 48 px partout, focus clavier visible
- feat(da) lot 7 (`43ae173`) : écrans pro, admin, invitation et onboarding alignés sur la grammaire des écrans ; composants `Pill`, `ScreenTitle`, `SectionTitle` à la place de copies
- feat(pwa) lot 8 (`ac5fe8d`) : service worker maison `public/sw.js` (79 lignes, aucune dépendance) qui ne met en cache que `/offline.html` et `/_next/static/*` ; page autonome `public/offline.html` qui redessine le QR et le code de secours lus dans `localStorage` ; cache nommé d'après l'identifiant de build (`/sw.js?v=<id>`) et purgé à l'activation ; `sw.js` servi en `no-store` ; `/sw.js` et `/offline.html` exclus du proxy d'auth ; enregistrement en production seulement (ADR-025)
- test(e2e) : `app-shell`, `card-navigation`, `intro-splash`, `loading-and-errors`, `cashier`, `motion`, `touch-targets`, `offline` (3 tests de rendu dans `offline.spec.ts`)

**Fichiers clés (lot 8)**
- `public/sw.js`, `public/offline.html` — le worker et la page hors-ligne
- `src/components/shared/service-worker-registrar.tsx`, `src/lib/offline.ts` — enregistrement (production seulement) et URL versionnée
- `src/features/auth/identity-storage.ts`, `src/features/auth/qr-snapshot.ts`, `src/features/auth/hooks/use-persist-identity.ts` — copie locale du tracé du QR, effacée à la déconnexion
- `next.config.ts` — identifiant de build commun (`generateBuildId` et `NEXT_PUBLIC_BUILD_ID`), en-têtes de `/sw.js` ; `src/proxy.ts` — exclusion du matcher
- `src/lib/offline-assets.test.ts`, `e2e/offline.spec.ts` — garde-fous (clés partagées, aucun script externe, aucun `innerHTML`, cache purgé, repli hors-ligne)

**Base de données** : aucune migration.

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| Lettres de l'intro invisibles ; étapes de connexion sans glissement (commits antérieurs) | Code relu mais rendu jamais regardé : `opacity: 0` jamais levée, `transform` animé alors que Tailwind 4 écrit `translate` | Corrigés dans les 3 commits cités | Toute animation est relevée avec Playwright à plusieurs instants sur build de production |
| Relevé de `top` faux juste après l'injection d'une feuille de style | Lecture faite avant le recalcul des styles | Attente de 200 ms avant lecture | Les tests utilisent `toHaveCSS` (qui réessaie) |
| Après un glissement, un retour arrière plante la page sur WebKit (3 essais sur 3) | Les view transitions de React ne sont pas fiables sur le WebKit de test | Glissement joué sur Chromium seulement, échange instantané ailleurs (4 essais sur 4 sans plantage) | Test de glissement limité à Chromium ; à revérifier sur iPhone réel |
| 3 tests e2e connectés échouaient sur l'écran de connexion quand `E2E_SESSION` est absent | `signedInTest.skip(...)` appelé au niveau du module de `e2e/signed-in.ts` : il ne protège que le premier fichier de test qui l'importe | Fixture automatique `requireSession` qui ignore chaque test sans session | Sans session : 11 réussis, 20 ignorés, 0 échec |

**Décisions** : ADR-025 (service worker maison, page hors-ligne autonome). Aucune dépendance ajoutée. Choix consignés : zoom par pincement conservé (accessibilité), seul le double-tap est neutralisé ; barre de statut iOS en `default` ; `background_color` du manifest laissé crème (document 05) malgré l'intro forêt, écart connu ; `overscroll-behavior: none` supprime le tirer-pour-rafraîchir (les cartes se resynchronisent par Realtime et au retour au premier plan).
**Dette introduite / remboursée** : DT-010 introduite (hors-ligne limité au QR, non vérifié sur appareil). DT-007 toujours ouverte : les parcours connectés exigent une session enregistrée à la main, hors dépôt.

**Tests de validation**
- [x] Lot 8 : `pnpm lint`, `pnpm typecheck`, `pnpm test` (190, dont 6 nouveaux), `pnpm format:check`, `pnpm build` verts
- [x] Lot 8, e2e sans session : 11 réussis (dont 3 de `offline.spec.ts`), 20 ignorés, 0 échec. Hors-ligne simulé par Playwright sur `/login` : titre « Tu es hors ligne », QR redessiné depuis le tracé stocké, code « 7DN WSA » ; sans identité stockée : message « après ta première visite avec du réseau » ; seuls `/offline.html` et des fichiers `/_next/static/` sont en cache ; un cache d'ancien build planté avant l'installation est purgé ; `/sw.js` répond 200 sans redirection, `cache-control: no-store` ; `.next/BUILD_ID` égal à l'identifiant inliné dans le bundle client
- [x] Lots 1 à 7 : relevés détaillés dans les messages de commit (`0d00ad8` à `43ae173`), mesurés sur build de production à 375 px
- [x] Audit initial (lot 0) : `/login` CLS 0, LCP 516 ms ; accueil CLS 0, LCP 1 080 ms ; ouverture à froid : squelette 0,6 à 1,1 s puis intro 1,1 à 2,6 s ; « ‹ Mes cartes » empilait l'historique (2 → 4) ; 404 en anglais ; caisse : squelette de 335 px puis viseur de 270 px ; cibles de 36 px dans réglages, invitation, onboarding, admin ; `--destructive` 4,45:1 sur crème
- [ ] Non exécutés ici : les 20 tests e2e connectés (pas de fichier de session dans cet environnement) ; les 28 réussis annoncés avant le lot 8 l'étaient avec `E2E_SESSION`, à relancer
- [ ] Non vérifiés : appareil physique (encoche, barre de statut iOS, rebond, mode avion réel sur Android et iPhone), caméra réelle, mise à jour du worker sur un second déploiement, Lighthouse

**Prochaine étape** : validation sur téléphone par 2 à 3 personnes, relance de `pnpm test:e2e` avec `E2E_SESSION`, Lighthouse, puis fusion dans `main` ; ensuite 8.3 et 8.4.

### Session 31 — [2026-11-02] — Refonte de la structure des écrans d'après les maquettes
**Roadmap :** Phase 7 bis — DA.6 (reprise) · **Statut :** 🟡 Partiel (mesures sur téléphone à faire) · **Branche :** `feat/phase-7bis-da`

**Contexte** : la Session 30 avait changé couleurs et polices sans refaire l'agencement ; le porteur de projet l'a refusée. Lecture de `05b-ECRANS-SPEC.md` et de `da-mockups/LISEZ-MOI.md`, audit écran par écran, puis un commit par écran.

**Réalisé**
- Accueil client : en-tête forêt (logo SVG officiel, avatar lime 44 px, « Salut » 30 px), bloc QR qui chevauche l'en-tête (QR, taille et marge inchangés), lien pro sous le QR, titre « Mes cartes » + « N commerces »
- Connexion : bloc forêt de 150 px avec 3 disques reliés, formulaire à plat sur fond crème, champ et boutons à 56 px, mention de bas de page
- Cartes de la liste : logo tuile 44 px, nom, récompense, compteur Bricolage 22 px, traits de 16 px ; couleur par carte `HUES[hash(restaurant.id) % 6]` (ton light) ; carte cliquable vers `/cartes/<slug>`
- Détail d'une carte (nouvelle route `/cartes/[slug]`, lecture seule, requête existante + `cover_path`) : bannière optionnelle de 150 px ou lien « ‹ Mes cartes », carte forêt, compteur de 92 px, traits de 22 px (ton dark), « C'est gagné ! », bloc « Ensuite »
- Caisse : fond encre plein écran, viseur de 270 px avec coins lime, feuille crème (« Validé » 38 px, « Annuler », « Scanner suivant »)
- Espace pro : bloc héros « Scanner un client », bloc « Code du client », marges de 20 px (débordement droit corrigé par `min-w-0` sur le champ), barre d'onglets de 72 px

**Fichiers clés** : `src/features/loyalty/components/` (`client-home-header`, `customer-qr-hero`, `loyalty-card-item`, `loyalty-hero-card`, `next-tier-block`, `card-banner-header`), `src/app/(client)/cartes/[slug]/page.tsx`, `src/features/scanner/components/` (`cashier-view`, `scan-start-hero`, `scan-success`, `scanner-screen`), `src/features/auth/components/login-steps-band.tsx`

**Base de données** : aucune migration (lecture de `cover_path`, colonne existante). Aucun hook métier, action serveur ni test fonctionnel modifié ; le texte du message de carte (`describeCardMessage`, test créé en Session 30) a changé.

**Écarts assumés** (sans logique derrière, cf. LISEZ-MOI) : « Dans la même rue », « Découvrir les voisins », « Annuler (9 min) », bloc « Aujourd'hui », barre d'onglets client (pas de route Découvrir ni Profil). QR empilé au-dessus du titre (taille imposée). Message de carte « avant ta récompense » (le libellé du palier n'est pas garanti grammaticalement).

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| Le serveur de dev servait un module périmé | Cache Turbopack d'un serveur déjà lancé | Captures via build de production sur un port à part | Prévisualiser avec `pnpm build` |
| Commande bash rejetée entière | Quote non fermée dans une longue commande | Fichiers écrits avec l'outil Write | Commandes courtes |

**Décisions** : aucune (ADR-024 appliqué). **Dette** : DT-009 mise à jour (la route détail existe ; restent « Découvrir », « Profil », voisins).

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` verts (167 tests), `pnpm build` OK ; captures à 375 px dans `Documentation/da-captures/`
- [ ] Non réalisés : Lighthouse `/login` ≥ 86, scan < 3 s, contraste mesuré, caméra réelle, session connectée (les captures utilisaient une page de prévisualisation temporaire, supprimée), logs, stats, réglages et admin non revus

**Prochaine étape** : valider sur téléphone, mesurer, fusionner dans `main`, puis Phase 8.

### Session 30 — [2026-11-02] — Phase 7 bis : tokens, composants, écrans, email et manifest
**Roadmap :** Phase 7 bis — DA.3, DA.4, DA.6, DA.7 · **Statut :** 🟡 Partiel (mesures Lighthouse et scan non faites) · **Branche :** `feat/phase-7bis-da`

**Réalisé**
- chore(git): changements de la Session 28 commités sur `main` (renommage Rézone), puis commit docs distinct (document 05, `public/brand/`, roadmap, changelog) ; secrets de `data.txt` et le .pptx laissés non suivis
- feat(da) DA.3: tokens de la DA dans `globals.css` (noms shadcn gardés, `accent` devenu teinte douce, `gain` lime, teintes de carte, mouvements) ; polices Bricolage Grotesque (axe `opsz`) et Plus Jakarta Sans via `next/font` ; `getCardHue` (hash FNV-1a, testé) ; usages de `accent` migrés vers `primary`
- feat(da) DA.4: `ui/` re-thémé (boutons ≥ 48 px, bordures `--input`, variante `gain`) ; `SegmentedProgress`, `LoyaltyHeroCard`, `CardBannerHeader`, `PlusOneBurst`, `IntroSplash` + `Wordmark` animé, `StepTransition`, `ErrorState`, `EmptyState`, `BrandLogo`, animations CSS de la section 5.5
- feat(da) DA.6: connexion (étapes glissantes, bandeau Scanne·Cumule·Profite), accueil (en-tête forêt, intro une fois par ouverture, +1 via Realtime), caisse (coins lime, résultats icône + texte, sans animation), onboarding, invitation, `/pro`, `/admin`, pages d'erreur
- feat(da) DA.7: template email OTP (en-tête forêt, code sur lime), `manifest.ts` (couleurs `#0a5c3a` / `#fff4e6`, icônes 192, 512, maskable), icônes d'onglet et Apple

**Fichiers clés**
- `src/app/globals.css` — tokens et keyframes ; `src/app/layout.tsx` — polices et icônes
- `src/features/loyalty/components/` — `segmented-progress`, `loyalty-hero-card`, `intro-splash`, `plus-one-burst` ; `domain/` — `card-hue`, `segment-rows`, `card-message`
- `src/components/shared/` — `step-transition`, `wordmark`, `brand-logo`, `error-state`, `empty-state`

**Base de données** : aucune migration. `restaurantId` ajouté à `LoyaltyCardView` (lecture déjà sélectionnée).

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| Build : « Axes can only be defined for variable fonts » | `weight` fixé avec l'axe `opsz` | `weight` retiré pour Bricolage | `pnpm build` après chaque changement de police |
| Commit refusé par lint-staged | Prettier allonge une fonction au-delà de 40 lignes après `pnpm lint` | Sous-composants extraits | Lancer prettier avant lint |

**Décisions** : ADR-024 appliqué ; aucun nouvel ADR (aucune dépendance ajoutée).
**Dette introduite** : DT-009 (voir registre).

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` verts (167 tests, +11 nouveaux, aucun test de logique modifié) ; `pnpm build` OK ; e2e smoke OK
- [x] Capture de `/login` à 375 px contrôlée
- [ ] Lighthouse `/login` ≥ 86, scan < 3 s, contraste mesuré, retour de 2 à 3 personnes : non réalisés (à faire sur téléphone)

**Écarts à signaler** : les textes du e2e smoke (titre et bouton de connexion) suivent la nouvelle copie ; l'intro sort par glissement du calque vers la gauche (pas d'accueil entrant au-dessus) ; messages de `lib/errors.ts` encore au vouvoiement.

**Prochaine étape** : validation sur téléphone, mesures, fusion, puis Phase 8.

### Session 29 — [2026-11-02] — Direction artistique : identité retenue et document de passage
**Roadmap :** Phase 7 bis (DA.1 et DA.2 terminées, DA.5 partielle) · **Statut :** ✅ Terminé · **Branche :** `main` (fichiers non commités)

**Réalisé**
- docs(da): `Documentation/05-DIRECTION-ARTISTIQUE.md` — source de vérité de l'apparence pour le code : identité, tokens CSS, polices, couleur par carte, composants à créer (`SegmentedProgress`, `IntroSplash`, transitions de glissement), animations, règles par écran, plan DA.3 à DA.7
- chore(brand): `public/brand/` — logotypes SVG tracés (cream, forest, ink une couleur, white), icône d'app (« any » et maskable), `apple-touch-icon.png`, favicon, PNG 192/512/180/32 ; tracés générés à partir de Bricolage Grotesque (licence OFL-1.1)
- docs(roadmap): DA.1 et DA.2 cochées, DA.5 annotée (écrans clés maquettés et validés ; logs, réglages et admin non maquettés)
- Mesure de contraste : les bordures de champ des maquettes (`#8FA79A`, 2,6:1) ne passaient pas 3:1 ; valeur retenue pour le code `--input: #6B8577` (4,0:1)

**Base de données** : aucune migration. **Code applicatif** : aucune modification.

**Bugs rencontrés** : Aucun
**Décisions** : ADR-024
**Dette introduite / remboursée** : Aucune. Rappel : les changements de la Session 28 (renommage) sont toujours non commités sur `main`.

**Tests de validation**
- [x] Rendu des SVG et PNG contrôlé (logos sur 4 fonds, icône maskable dans la zone de sécurité, favicon à 16 et 32 px)
- [ ] Non applicable : aucun code modifié, `pnpm lint/typecheck/test` non relancés

**Prochaine étape** : DA.3 (tokens et polices) sur `feat/phase-7bis-da`.

### Session 28 — [2026-11-01] — Renommage en Rézone et réorganisation de la roadmap
**Roadmap :** Phase 6 (cases cochées) · nouvelle Phase 7 bis · **Statut :** ✅ Terminé · **Branche :** `main` (modifications non commitées)

**Réalisé**
- chore(rename): le projet s'appelle désormais **Rézone** (« Rézone » dans les textes, `RÉZONE` dans le titre de `.cursorrules`) : documentation, `.cursorrules`, `AGENTS.md`, textes de l'interface (titres, en-têtes, bannières, messages d'erreur), template et sujets de l'email de connexion, scripts `supabase/dev`, test E2E, nom du package (`rezone`), clés de stockage (`rezone.identity.v1`, cookie `rezone-active-restaurant`) et domaines fictifs des tests (`rezone.app`, `rezone.internal`)
- **Volontairement conservés** : dossier du projet, dépôt GitHub (`amin-tennah/Fidly`), projets Supabase et Vercel ; `project_id = "Fidly"` dans `supabase/config.toml` (identifiant local du CLI) ; comptes du seed (`*@fidly-dev.local`, mot de passe de dev) car déjà créés dans la base Dev ; sessions antérieures de ce journal (historique) ; adresse `clientfidly@gmail.com` (compte réel)
- docs(roadmap): cases de la Phase 6 cochées après validation du porteur de projet (6.1, 6.2, 6.4, chronométrage de 20 scans, deux téléphones staff, code court de secours) ; reste ouvert : test E2E du parcours complet (DT-007)
- docs(roadmap): ajout de la **Phase 7 bis — direction artistique et design system** entre M1 et la Phase 8 (ADR-023) ; total MVP 39–51 jours

**Base de données** : aucune migration (un commentaire d'en-tête de la migration 2 et du seed mentionne le nouveau nom).

**Bugs rencontrés** : Aucun
**Décisions** : ADR-023
**Dette introduite / remboursée** : Aucune. Effet de bord : les appareils de test perdent la copie locale de l'identité et le choix du restaurant actif (nouvelles clés), rétablis à la prochaine connexion.

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (156) — verts
- [ ] `pnpm build` et test E2E non relancés (changement de textes et de clés uniquement)

**Prochaine étape** : Phase 7 bis, DA.1 (brief de direction artistique).

---

### Session 27 — [2026-11-01] — Retours du jalon M1 : scan bloqué et connexion par code
**Roadmap :** Phase 6 (scanner) et Phase 3 (auth) — correctifs · **Statut :** ✅ Terminé (scan validé par le porteur de projet ; échec d'envoi du code expliqué par le mode test de Resend) · **Branche :** `fix/otp-login-and-scan-lookup` → `main`

**Retours du porteur de projet** : (1) en enchaînant des scans rapides, la recherche du client reste parfois bloquée sur « Recherche du client… » jusqu'à l'actualisation de la page ; (2) la connexion par code à 6 chiffres reçu par email échoue (« La connexion a échoué. Veuillez réessayer. »).

**Réalisé**
- fix(scanner): cause établie par la documentation de Next.js — le navigateur envoie les Server Actions **une par une** : une requête suspendue bloque toutes les suivantes, seule l'actualisation de la page vide la file (la doc déconseille les Server Actions pour lire des données). Les 4 RPC de scan (`lookup_customer`, `record_visit`, `redeem_reward`, `reverse_scan`) sont maintenant appelées **directement depuis le navigateur** (`features/scanner/rpc/`), avec un délai de 6 s qui annule vraiment la requête ; la recherche du client est relancée automatiquement une fois (elle ne modifie rien) ; une écriture relancée à la main réutilise la même clé d'idempotence (ADR-022)
- refactor: Server Actions du scanner supprimées (`lookup-customer`, `record-visit`, `redeem-reward`, `reverse-scan`) ; `to-scan-result` déplacé dans `rpc/` ; `mapScanRpcError` reconnaît les coupures réseau et les annulations (`NETWORK_ERROR`)
- feat(auth): journal serveur des erreurs de connexion par code (`[auth] sendEmailOtp|verifyEmailOtp failed` avec nom, code et statut HTTP, jamais l'email ni le code saisi) — l'action affichait un message générique sans rien consigner
- cause de la connexion par code : le journal serveur montre `AuthRetryableFetchError`, statut 500, sans code ; la requête rejouée directement sur l'API d'authentification répond `500 unexpected_failure — "Error sending magic link email"`. **Comportement attendu** : Resend est en mode test et n'envoie des emails qu'à l'adresse du compte propriétaire, `clientfidly@gmail.com` n'étant pas cette adresse (confirmé par le porteur de projet). Aucune erreur de notre code ; la configuration publique de l'authentification est correcte (email activé, inscriptions ouvertes)
- fix(auth): un 5xx à l'envoi du code affiche désormais « L'envoi du code par email est momentanément indisponible… » (`EMAIL_SEND_FAILED`) au lieu du message générique ; le SDK supprime le code d'erreur sur un 5xx, c'est le statut HTTP qui l'identifie (`mapSendOtpErrorCode`, 2 tests)

**Base de données** : aucune migration.

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| Scan bloqué sur « Recherche du client… » jusqu'à l'actualisation | File d'attente des Server Actions côté navigateur : une requête suspendue bloque les suivantes ; le délai de 10 s ne vidait pas la file | Appels directs aux RPC, requête annulable (`AbortSignal`), relance automatique de la recherche | `scanner-domain.test.ts` (erreurs réseau) ; ne pas utiliser de Server Action pour une lecture interactive |
| « La connexion a échoué » à la connexion par code | Resend en mode test : envoi limité à l'adresse du compte propriétaire ; Supabase répond `500 unexpected_failure` (« Error sending magic link email ») | Aucun défaut à corriger ; message dédié (`EMAIL_SEND_FAILED`) et journal serveur ajoutés ; domaine à vérifier avant le pilote (DT-008) | Test `mapSendOtpErrorCode` ; diagnostic : rejouer `POST /auth/v1/otp` et lire le corps de la réponse |

**Décisions** : ADR-022
**Dette introduite / remboursée** : DT-008 (domaine vérifié dans Resend avant le pilote)

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (156), `pnpm build` — verts
- [x] Enchaîner des scans rapides sur téléphone sans rester bloqué — validé par le porteur de projet (« tout est ok »)
- [x] Connexion par code email — échec expliqué (Resend en mode test : envoi uniquement à l'adresse du compte propriétaire) ; à retester avec cette adresse ou après vérification d'un domaine

**Prochaine étape** : Phase 8 (PWA et hors-ligne), dans une prochaine session.

---

### Session 26 — [2026-11-01] — Clôture de la Phase 7 et jalon M1
**Roadmap :** Phase 7 — validation · Jalon M1 · **Statut :** ✅ Terminé · **Branche :** `feat/phase-7-realtime` → `main`

**Réalisé**
- Validation sur appareils des 5 tests restants de la Phase 7, par le porteur de projet : isolation entre clients (aucun événement d'un autre client), arrière-plan (état correct au retour), journal en direct (un scan d'un autre appareil apparaît seul), absence de fuite de canaux (connexions stables en naviguant), annulation à une ligne et écran de succès de 6 s
- Jalon M1 (démo interne) validé : parcours complet inscription client → configuration du restaurant → scan → +1 en direct → récompense → log
- Fusion de `feat/phase-7-realtime` dans `main` (locale)

**Retours du jalon M1 (traités en Session 27)**
- La connexion par code à 6 chiffres reçu par email échoue (« La connexion a échoué. Veuillez réessayer. ») alors qu'elle fonctionnait
- En enchaînant des scans rapides, la recherche du client reste parfois bloquée sur « Recherche du client… » ; il faut actualiser la page, puis tout refonctionne

**Base de données** : aucune migration.
**Bugs rencontrés** : voir les retours ci-dessus (causes à établir)
**Décisions** : Aucune
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] Tests 1 à 5 de la Phase 7 sur deux appareils — validés par le porteur de projet
- [x] Jalon M1 — validé par le porteur de projet

**Prochaine étape** : correction des deux défauts, puis Phase 8.

---

### Session 25 — [2026-10-29] — Phase 7 : retours d'essai et test sur téléphone via tunnel
**Roadmap :** Phase 7 — validation · **Statut :** ✅ Correctifs terminés (jauge en direct validée par le porteur de projet) ; revalidation du journal en direct et des autres tests de la Phase 7 à faire · **Branche :** `feat/phase-7-realtime`

**Retours du porteur de projet** : la jauge du client ne bouge pas sans rechargement ; la recherche ou le scan reste parfois bloqué sur « Recherche du client » ; le site n'est pas fluide ; une annulation produit deux rectangles dans le journal ; le délai pour annuler un scan est trop court. Le journal en direct fonctionne.

**Réalisé**
- fix(auth): connexion Google sur téléphone via un tunnel — le callback construisait l'adresse de retour à partir de l'origine vue par le serveur (`localhost:3000` derrière un tunnel) ; il utilise maintenant une redirection relative (`src/lib/relative-redirect.ts`) ; `allowedDevOrigins` autorise `*.trycloudflare.com` ; script `pnpm tunnel`
- fix(7.1): **cause réelle de la jauge figée** — l'abonnement Realtime était enregistré avec le rôle `anon` (constaté dans `realtime.subscription` : rôle `anon`, `sub` nul) : le navigateur rejoignait le canal sans présenter la session de l'utilisateur, la RLS cachait toutes les lignes et le canal disait `SUBSCRIBED` sans jamais recevoir d'événement (la jauge n'évoluait qu'à la resynchronisation au retour de l'onglet). `authorizeRealtime` lit la session et la transmet à Realtime (`setAuth`) avant toute jonction (ADR-021) ; le même correctif vaut pour le journal, qui partage `useTableChanges`
- fix(7.1): canaux — `supabase.channel(nom)` renvoie le canal existant s'il porte déjà ce nom et React Strict Mode (dev) monte deux fois chaque effet : chaque abonnement a un nom unique et le premier montage est annulé avant de rejoindre (`openTableChannel`, `useTableChanges`)
- fix: blocage sur « Recherche du client » — `runAction` abandonne après 10 s (`NETWORK_ERROR`, message et nouvel essai possible) ; une écriture relancée réutilise la même clé d'idempotence
- fix(7.3): une annulation = une seule ligne — `list_scan_logs` ne renvoie plus les écritures compensatoires ; la ligne d'origine est barrée avec « Annulé par <prénom> · <date et heure> » (migration 14). L'écriture compensatoire reste en base (ADR-010)
- feat: l'écran de succès du scanner (avec « Annuler ce scan ») reste 6 s au lieu de 2,5 s
- refactor: `src/lib/realtime/` découpé (`authorize-realtime`, `open-table-channel`, `use-table-changes`, `use-resync-on-return`) ; `useLatest` partagé ; un encadré de diagnostic temporaire (état du canal, événements reçus) a servi à localiser le défaut puis a été retiré
- test: `runAction` (3 tests), `authorizeRealtime` (3 tests), schémas et libellés du journal adaptés, `scan_logs_listing.test.sql` à 13 assertions

**Base de données**
- Migration : `20261029100001_scan_logs_single_reversal_line.sql` — appliquée sur le projet Dev (la fonction est recréée avec de nouvelles colonnes, `reversed_by_name` ajoutée)
- Types régénérés : oui

**Points d'attention**
- La lenteur ressentie vient en grande partie du serveur de dev (compilation à la demande, rendu en double) et du tunnel gratuit. À mesurer avec `pnpm build && pnpm start`, puis le tunnel, avant d'optimiser (une action serveur enchaîne aujourd'hui 3 à 4 appels à Supabase : session, appartenance, RPC).
- L'annulation par le staff reste limitée à 10 minutes (Q-012) ; aucun bouton d'annulation n'existe encore dans `/pro/logs`, seulement dans l'écran de succès du scanner.

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| Retour vers `localhost` après Google, sur téléphone via tunnel | Redirection absolue construite depuis l'origine vue par le serveur | Redirection relative | Vérifié en local (`Location: /login?...`) |
| Jauge client figée : `SUBSCRIBED` mais aucun événement | Abonnement enregistré en rôle `anon` : la session n'était pas transmise à Realtime | `authorizeRealtime` avant la jonction | `authorize-realtime.test.ts` ; diagnostic : `select claims_role, claims->>'sub' from realtime.subscription` doit montrer `authenticated` et un `sub` |
| `CLOSED` parasite au chargement (dev) | Canal de même nom réutilisé pendant sa fermeture (Strict Mode) | Nom unique par abonnement, premier montage annulé | Vu dans l'encadré de diagnostic |
| Écran bloqué sur « Recherche du client… » | Appel serveur sans délai maximum | Délai de 10 s dans `runAction` | `run-action.test.ts` |

**Décisions** : ADR-021
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (152), `pnpm build` — verts
- [x] Migration 14 appliquée, types régénérés
- [x] Jauge du client en direct, sur deux appareils (PC client, téléphone pro via tunnel) : la jauge avance seule et la bannière « Récompense disponible » s'anime à 10/10 — validé par le porteur de projet
- [ ] Journal en direct, annulation à une ligne, délai de 6 s de l'écran de succès — à refaire sur deux appareils

**Prochaine étape** : revalider le journal et les tests restants de la Phase 7, fusion dans `main`, puis jalon M1.

---

### Session 24 — [2026-10-26] — Phase 7 : temps réel et journal `/pro/logs`
**Roadmap :** Phase 7 — Étapes 7.1 → 7.4 · **Statut :** 🟡 Partiel (code, migration, tests unitaires et SQL verts ; validation sur deux appareils à faire) · **Branche :** `feat/phase-7-realtime`

**Réalisé**
- db: migration 13 — `loyalty_cards` et `scan_logs` ajoutées à la publication `supabase_realtime` ; RPC `list_scan_logs` (page de journal avec prénoms du client et de l'employé, état « annulé », curseur `(created_at, id)`) — ADR-020
- feat(7.1/7.4): hooks partagés `useTableChanges` (abonnement filtré, `removeChannel` au démontage, relecture à chaque reconnexion du canal) et `useResyncOnReturn` (retour de l'onglet au premier plan, retour du réseau) dans `src/lib/realtime/`
- feat(7.1/7.2): accueil client — `LoyaltyRealtimeSync` rafraîchit la page (un seul rafraîchissement, anti-rebond 200 ms) quand une carte du client change ; la barre existante s'anime (`13/10 → 13/20` inclus) ; bannière « Récompense disponible » animée lorsqu'elle apparaît après coup, sans animation avec `prefers-reduced-motion`
- feat(7.3): `/pro/logs` — liste des logs de tout le restaurant (date et heure en Europe/Paris, prénom du client, type, employé, badge « Délai de 2 h dépassé », ligne annulée barrée avec l'heure de l'annulation), 25 par page avec « Charger plus », nouvelles lignes en tête en direct
- refactor: garde `authorizeRestaurantStaff` déplacé dans la feature `restaurants` (partagé scanner et logs) ; `runAction` déplacé dans `src/lib/run-action.ts`

**Fichiers clés**
- `supabase/migrations/20261025110001_realtime_and_scan_logs_listing.sql`, `supabase/tests/scan_logs_listing.test.sql`
- `src/lib/realtime/`, `src/features/loyalty/hooks/`, `src/features/logs/`, `src/app/pro/logs/page.tsx`

**Base de données**
- Migration : `20261025110001_realtime_and_scan_logs_listing.sql` — appliquée sur le projet Dev
- Types régénérés : oui
- Advisors : 1 avertissement `authenticated_security_definer_function_executable` de plus (`list_scan_logs`), accepté comme les précédents

**Bugs rencontrés** : Aucun
**Décisions** : ADR-020
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (146 dont 8 pour les logs), `pnpm build` — verts
- [x] `supabase/tests/scan_logs_listing.test.sql` : 12 assertions `ok` (publication, tous les logs visibles, prénoms, annulé signalé, curseur, limite, refus employé d'un autre restaurant / client / anonyme)
- [ ] Deux appareils : un scan sur le téléphone pro met la jauge du client à jour en moins d'une seconde sans rechargement — à faire
- [ ] Le client A ne reçoit jamais d'événement concernant le client B (onglet réseau, WebSocket) — à faire
- [ ] App client en arrière-plan pendant le scan : état correct au retour — à faire
- [ ] Journal en direct : un scan sur un second appareil apparaît sur le premier ; une annulation barre la ligne — à faire
- [ ] Pas de fuite de canaux après navigation répétée — à faire

**Prochaine étape** : validation sur appareils, fusion dans `main`, puis jalon M1.

---

### Session 23 — [2026-10-25] — Phase 6 : RPC de scan, Server Actions et écran du scanner
**Roadmap :** Phase 6 — Étapes 6.1 → 6.8 · **Statut :** ✅ Terminé sauf chronométrage de 20 scans et test E2E (validé sur téléphone par le porteur de projet) · **Branche :** `feat/phase-6-scanner` → `main`

**Réalisé**
- db: migration 12 — RPC `lookup_customer`, `record_visit`, `redeem_reward`, `reverse_scan` (ADR-019) ; type composite `scan_result` ; table `private.lookup_failures` (10 recherches ratées par minute et par employé)
- feat: Server Actions `lookupCustomer`, `recordVisit`, `redeemReward`, `reverseScan` (garde « membre du restaurant », Zod, mapping des erreurs des RPC, résultats de RPC validés par Zod)
- feat: écran `/pro` — bouton « Scanner un client » (caméra démarrée au toucher puis conservée entre deux scans, libérée si l'onglet passe en arrière-plan), saisie du code court, tiroir (prénom, `stamps / seuil`, « Valider +1 passage », « Valider la récompense », alerte cooldown avec bouton « Créditer malgré le délai »), état de succès avec « Annuler ce scan », fermeture automatique après 2,5 s
- feat: le restaurant ciblé est toujours le restaurant actif de `/pro` (un owner de A et B qui scanne sur B ne crédite que B ; `key` sur l'écran pour réinitialiser le flux au changement de restaurant)
- feat: machine à états du scan en fonction pure (`scan-flow-reducer`) ; une clé d'idempotence par action et par client, réutilisée à l'identique en cas de nouvel essai
- chore: 3 codes d'erreur ajoutés (`REVERSAL_NOT_ALLOWED`, `NO_ACTIVE_PROGRAM`, `NETWORK_ERROR`)

**Fichiers clés**
- `supabase/migrations/20261025100001_scan_rpcs.sql`, `supabase/tests/scan_rpcs.test.sql`
- `src/features/scanner/` — `actions/`, `domain/` (normalisation, mapping d'erreurs, cooldown, machine à états + tests), `hooks/`, `components/`, `schemas.ts`
- `src/app/pro/page.tsx`

**Base de données**
- Migration : `20261025100001_scan_rpcs.sql` — appliquée sur le projet Dev
- Types régénérés : oui
- Advisors : 4 avertissements `authenticated_security_definer_function_executable` de plus, acceptés comme les précédents (appartenance vérifiée dans la fonction)

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| Ordre des opérations d'une carte ambigu dans une même transaction | `now()` est constant dans une transaction : deux logs auraient le même horodatage | `clock_timestamp()` pour `created_at` des logs et `last_visit_at` | pgTAP « un scan suivi d'un autre n'est pas annulable » |

**Décisions** : ADR-019 · Q-014 (un employé peut scanner son propre compte : oui, tracé dans les logs)
**Dette introduite / remboursée** : DT-007

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (138 dont 29 pour le scanner), `pnpm build` — verts
- [x] `pnpm db:test` : nouvelle suite `scan_rpcs` 31 assertions `ok` (cooldown, idempotence, `13/10 → 13/20`, `22/20 → 2/10`, annulations, isolation A/B, limitation de débit, QR forgé, anonyme)
- [x] À la main sur téléphone (pro) avec un compte client sur PC : caméra, scan, tiroir, code court, alerte cooldown, récompense, annulation — validé par le porteur de projet (« tout fonctionne bien »)
- [ ] Chronométrage de 20 scans — reporté par le porteur de projet ; deux téléphones simultanés — non testé
- [ ] Test E2E Playwright du parcours complet — non fait (DT-007)

**Prochaine étape** : Phase 7 (temps réel et `/pro/logs` avec lignes annulées barrées).

---

### Session 22 — [2026-10-23] — Phase 5.5 : back-office `/admin`
**Roadmap :** Phase 5 — Étape 5.5 · **Statut :** ✅ Terminé (validé par le porteur de projet) · **Branche :** `feat/phase-5-admin` → `main`

**Réalisé**
- feat(5.5): `/admin` — formulaire « Nouveau restaurant » (nom, catégorie, email du gérant) qui crée le restaurant et l'invitation `owner` ; liste des restaurants avec gérants rattachés et invitations en attente (email, date d'expiration) ; « Inviter un gérant » pour une réinvitation ; « Chevalet (PNG) »
- feat: chevalet imprimable en PNG (A6 portrait, 300 dpi) composé dans le navigateur : nom du restaurant (taille ajustée à la largeur), QR de `<NEXT_PUBLIC_APP_URL>/?ref=<slug>` (niveau de correction Q, marge de 4 modules, agrandi d'un facteur entier sans lissage), légende et pied de page ; aucune dépendance ajoutée
- feat: garde `authorizePlatformAdmin` (session, puis ligne dans `platform_admins`, puis Zod) ; slug généré depuis le nom avec suffixe sur conflit ; annulation du restaurant si l'invitation échoue (ADR-018)
- refactor: constantes miroir de `restaurants` (catégories, longueur du nom, fuseau) déplacées dans `src/lib/restaurant-fields.ts`, partagées par `restaurants` et `admin`
- fix: retour d'essai — un admin connecté ne voyait aucun accès à `/admin` depuis l'accueil client (seuls les gérants avaient leur raccourci) : lien « Accéder au back-office Fidly → » affiché aux membres de `platform_admins`
- dev: script `supabase/dev/make_platform_admin.sql` (ajoute ou retire un compte dans `platform_admins` depuis le SQL Editor ; l'application ne peut pas le faire)
- test: 12 tests unitaires (slug, URL du chevalet, ajustement de police, expiration à 14 jours, schémas, date) ; `supabase/tests/admin_backoffice.test.sql` (9 assertions : l'admin crée/invite/lit/supprime, le slug est unique, owner et client refusés)

**Fichiers clés**
- `src/features/admin/` — `actions/` (garde, écritures, actions), `queries/list-admin-restaurants.ts`, `domain/` (`slugify`, `easel`, `format-date` + tests), `utils/render-easel-png.ts`, `components/`
- `src/app/admin/page.tsx`, `supabase/tests/admin_backoffice.test.sql`

**Base de données** : aucune migration (policies existantes).

**Points d'attention**
- `NEXT_PUBLIC_APP_URL` doit valoir l'URL de production avant d'imprimer un chevalet (par défaut `http://localhost:3000`) ; une erreur ici imprime des QR inutilisables.
- Les invitations ne sont pas envoyées par email : l'admin transmet au gérant l'adresse de connexion et l'email à utiliser (rappel affiché à la création).
- Le paramètre `?ref=<slug>` est porté par le QR mais **pas encore exploité** : l'attribution à l'inscription est l'étape 10.1.
- Un restaurant ne peut pas encore être désactivé depuis `/admin` (droits UPDATE retirés, ADR-018).

**Bugs rencontrés** : Aucun
**Décisions** : ADR-018
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (109 dont 13 nouveaux), `pnpm build` — verts
- [x] `pnpm db:test` : 20 + 12 + 12 + 11 + 6 + 19 + 9 assertions `ok` (dont les 9 de `admin_backoffice`)
- [x] À la main avec un compte admin (accès obtenu par `make_platform_admin.sql`) : parcours de `/admin` validé par le porteur de projet (« ça me paraît bien »)

**Prochaine étape** : Phase 6 — scanner et validation de passage (plan et règles métier à valider avant de coder).

---

### Session 21 — [2026-10-23] — Phase 5 : réglages en lecture d'abord (retour d'ergonomie)
**Roadmap :** Phase 5 — ergonomie de `/pro/settings` · **Statut :** 🟡 Partiel (code, lint, typecheck, tests, build verts ; validation visuelle à faire) · **Branche :** `feat/phase-5-pro-settings`

**Constat du porteur de projet** : tout était déplié en permanence, la page était longue et sans vue d'ensemble.

**Réalisé**
- feat: `/pro/settings` s'ouvre en **lecture** — carte d'en-tête (bannière 16:9, logo qui chevauche la bannière, nom, catégorie, adresse), carte « Horaires d'ouverture » (semaine compacte, jour courant mis en évidence, fermeture après minuit indiquée « (lendemain) »), carte « Programmes de fidélité » (paliers actifs avec leur image, nombre de paliers désactivés)
- feat: **modification à la demande** — petit bouton appareil photo sur la bannière et sur le logo (choix, cadrage, envoi) ; crayon à côté du nom/catégorie et de l'adresse (formulaire sur place, un seul ouvert à la fois) ; bouton « Modifier » sur les horaires et sur les programmes qui remplace le résumé par l'éditeur existant, « Terminer » pour revenir
- feat: l'**équipier** voit la même page en lecture seule (sans boutons) ; les actions serveur et la base refusent de toute façon tout autre rôle qu'owner
- refactor: `SectionCard` partagé (titre + bascule Modifier/Terminer) ; éditeurs sans carte ni titre ; l'éditeur des programmes reste ouvert entre deux actions (la section n'est pas remontée, seul l'éditeur est réinitialisé par sa clé)
- feat: `formatDay` / `formatSlot` / `todayDayKey` (jour lu dans le fuseau Europe/Paris, pas celui du serveur ni du navigateur) + 6 tests
- chore: composants remplacés supprimés (`owner-settings`, `restaurant-summary-card`, `image-upload-card`, cartes d'édition)

**Base de données** : aucune migration.
**Bugs rencontrés** : Aucun
**Décisions** : Aucun nouvel ADR (pas de changement d'architecture : composition de composants existants)
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (96 dont 6 nouveaux), `pnpm build` — verts
- [ ] À la main : lecture seule propre à 375 px, bannière et logo (changement, cadrage), nom/catégorie, adresse, horaires, programmes (ajout, glisser-déposer, image), vue équipier sans bouton — à vérifier

**Prochaine étape** : valider le rendu, puis fusion dans `main` et 5.5 (`/admin`).

---

### Session 20 — [2026-10-23] — Phase 5.4 (fin) : image de récompense et feature partagée `media`
**Roadmap :** Phase 5 — Étape 5.4 · **Statut :** ✅ Terminé (validation manuelle de l'image de récompense à faire) · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- refactor: feature `media` (ADR-017) — cadrage, compression, détection du format, chemins, envoi et suppression Storage ; `restaurants` l'utilise sans changement de comportement
- feat(5.4): image de récompense par palier — ajout ou changement avec cadrage 4:3, retrait, miniature dans la liste ; Server Actions `uploadProgramImage` / `removeProgramImage` (owner, champs Zod, taille et format réel, palier vérifié comme appartenant au restaurant, RPC `set_loyalty_program_image`, ancien fichier supprimé, fichier annulé si la RPC échoue)
- feat: l'image de récompense s'affiche sur la carte de fidélité du client
- feat: composant partagé `components/shared/reward-image.tsx`

**Fichiers clés**
- `src/features/media/` — `constants`, `domain/` (+ tests), `utils/compress-image.ts`, `hooks/use-image-upload-flow.ts`, `components/` (cadrage, sélecteur), `actions/` (validation, stockage), `server.ts`, `index.ts`
- `src/features/programs/actions/program-image*.ts`, `hooks/use-program-image.ts`, `components/program-image-field.tsx`

**Base de données** : aucune migration (la RPC existe depuis la migration 11).

**Bugs rencontrés** : Aucun
**Décisions** : ADR-017
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (90), `pnpm build` — verts
- [ ] Image de récompense à la main : ajout avec cadrage, remplacement (ancien fichier supprimé du bucket), retrait, image visible sur la carte client, refus d'un faux `.jpg` — à faire
- [ ] Roadmap 5.4 : « Réordonner ⇒ ordre persistant, aucune position en double » vérifié (écran validé par le porteur de projet) ; « Staff non owner ne peut pas modifier » vérifié en SQL (pgTAP) et par l'UI

**Prochaine étape** : 5.5 — back-office `/admin` sur la branche `feat/phase-5-admin`.

---

### Session 19 — [2026-10-23] — Phase 5.4 (en cours) : programmes de fidélité, base de données et règles
**Roadmap :** Phase 5 — Étape 5.4 · **Statut :** ✅ Terminé (écran validé par le porteur de projet ; image de récompense : voir Session 20) · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- db: migration 10 — plus d'écriture directe sur `loyalty_programs` ; RPC `create_loyalty_program`, `update_loyalty_program`, `set_loyalty_program_active` (basculement des cartes sur le palier actif suivant en conservant `stamps`, boucle sur le premier), `reorder_loyalty_programs` (décalage puis réécriture, seuils conservés sur les places) ; contrôle central `private.assert_program_rules` (5 actifs max, seuils croissants) ; images de récompense limitées au dossier du restaurant
- test: `supabase/tests/loyalty_programs.test.sql` (16 assertions) ; `rls_access_matrix.test.sql` adapté (l'owner modifie un palier via RPC)
- feat: `src/features/programs/` — règles pures (`findRuleViolation`, `suggestNextThreshold`, `previewReorder`), schémas Zod, mapping des erreurs des RPC, constantes ; 4 nouveaux codes d'erreur dans `lib/errors.ts`
- chore: dépendances `@dnd-kit/*` (ADR-016)
- feat (écrit, à valider) : section « Programmes de fidélité » de `/pro/settings` — liste triable par glisser-déposer (souris, tactile, clavier), ajout, édition, désactivation, réactivation ; contrôle local des règles avant l'appel ; remise à l'état serveur par `key` ; accès owner uniquement via `authorizeRestaurantOwner` (entrée serveur `features/restaurants/server.ts`)

**Base de données**
- Migration 10 : `20261023120001_loyalty_program_rpcs.sql` — appliquée ; `pnpm db:test` : 16/16 sur les programmes, 20/20 sur la matrice RLS
- Migration 11 : `20261023130001_program_image_rpc.sql` — appliquée : `update_loyalty_program` ne prend plus que le seuil et le libellé ; nouvelle RPC `set_loyalty_program_image` (chemin dans le dossier du restaurant, ou NULL). Raison : les types générés exigent un chemin d'image non nul pour `update_loyalty_program`, ce qui aurait imposé un cast ; une RPC dédiée est aussi plus sûre (modifier un texte ne peut plus effacer l'image)
- Types régénérés : oui (après la migration 11)
- Advisors : 4 avertissements `authenticated_security_definer_function_executable` de plus (create/update/set_active/reorder), acceptés pour la même raison que les précédents (rôle owner/admin vérifié dans la fonction)

**À savoir pour la Phase 6** : si tous les paliers sont désactivés puis qu'un nouveau est créé, des cartes peuvent encore pointer un palier inactif ; `record_visit` / `redeem_reward` devront résoudre le palier courant comme le fait `computeCardProgress`.

**Décisions** : ADR-016
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (86 tests dont 9 nouveaux) — verts
- [x] Migration 10 : `db:push`, `db:types`, `db:test`, `db:advisors` — OK
- [x] Migration 11 : `db:push`, `db:types`, `db:test` (19/19 programmes, 20/20 matrice, autres suites vertes), `typecheck`, `lint`, `test` (90), `build` — OK
- [ ] Écran des programmes à la main (ajout, refus d'un seuil non croissant, 6ᵉ palier, édition, glisser-déposer souris et doigt, désactivation/réactivation, carte client après désactivation) — à faire

**Prochaine étape** : après application de la migration, actions serveur et écran `/pro/settings` (liste, création, édition, désactivation, glisser-déposer, image de récompense).

---

### Session 18 — [2026-10-23] — Phase 5.3 (suite) : cadrage du logo et de la couverture
**Roadmap :** Phase 5 — Étape 5.3 · **Statut :** 🟡 Partiel (code, lint, typecheck, tests et build verts ; validation manuelle à faire) · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- feat(5.3): écran de cadrage plein écran avant l'envoi — cadre en pointillés (carré pour le logo, 16:9 pour la couverture), image déplaçable, zoom au pincement, à la molette et au curseur, boutons Annuler / Valider le cadrage
- feat: la compression découpe la zone cadrée dans l'image source (arrondi et bornes dans `clampCropArea`, taille de sortie plafonnée à 800 px par `computeOutputSize`), puis ré-encode comme avant ; le serveur est inchangé
- chore: dépendance `react-easy-crop` (ADR-015)

**Fichiers clés**
- `src/features/restaurants/components/image-crop-dialog.tsx`, `zoom-slider.tsx`, `image-upload-card.tsx`
- `src/features/restaurants/hooks/use-image-upload.ts` — flux choisir → cadrer → envoyer
- `src/features/restaurants/domain/crop-geometry.ts` (+ tests), `utils/compress-image.ts`

**Base de données** : aucune migration.

**Bugs rencontrés** : Aucun
**Décisions** : ADR-015
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (77 tests dont 5 nouveaux), `pnpm build` — verts
- [ ] Cadrage d'un logo (carré) et d'une couverture (16:9) sur téléphone : déplacement, pincement, résultat conforme au cadre ; annulation ; photo prise à la verticale (orientation correcte) — à vérifier

**Prochaine étape** : 5.4 — programmes de fidélité.

---

### Session 17 — [2026-10-23] — Phase 5.3 : logo et photo de couverture
**Roadmap :** Phase 5 — Étape 5.3 · **Statut :** 🟡 Partiel (migration 9 appliquée et validée ; reste le recadrage de l'image, demandé au retour d'essai) · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- db: migration 9 — écriture dans le bucket `restaurant-media` réservée à l'**owner** du dossier `<restaurant_id>/` (admin inclus) ; les policies de la migration 5 ouvraient aussi l'écriture au `staff`. Lecture publique inchangée.
- feat(5.3): cartes « Logo » et « Photo de couverture » dans `/pro/settings` (owner) ; compression dans le navigateur (≈ 800 px, WebP, repli JPEG, qualité abaissée jusqu'à passer sous 800 Ko) ; refus explicite d'un fichier non image ou de plus de 5 Mo avant tout traitement
- feat: Server Action `uploadRestaurantImage` — owner, puis champs Zod, taille, et **format réel lu dans les octets** (JPEG, PNG, WebP ; le type MIME déclaré n'est jamais cru) ; nouveau chemin à chaque envoi (pas de cache périmé), ancien fichier supprimé, annulation du fichier si la mise à jour de la colonne échoue
- fix: retour d'essai — le logo n'apparaissait nulle part côté pro : avatar du restaurant dans l'en-tête de `/pro` (owner et staff), couverture dans la vue staff ; composant partagé `components/shared/restaurant-avatar.tsx` (réutilisé par les cartes de fidélité)
- feat: `next/image` configuré pour le seul chemin public `restaurant-media` du projet (`next.config.ts`) ; le logo s'affiche sur les cartes de fidélité du client (**DT-004 remboursée**)

**Fichiers clés**
- `supabase/migrations/20261023110001_storage_owner_only_writes.sql`, `supabase/tests/storage_media.test.sql` (6 assertions, ajouté à `db:test`)
- `src/features/restaurants/` — `actions/` (`upload-restaurant-image`, `parse-image-upload`, `store-restaurant-image`), `domain/` (`detect-image-type`, `media-path` + tests), `utils/compress-image.ts`, `hooks/use-image-upload.ts`, `components/image-upload-card.tsx`
- `src/lib/supabase/media-url.ts` — URL publique d'un média ; `next.config.ts`

**Base de données**
- Migration : `20261023110001_storage_owner_only_writes.sql` — appliquée
- Types régénérés : non concerné (aucune table modifiée)

**Bugs rencontrés** : Aucun

**Décisions** : Aucun nouvel ADR. Choix notés : upload via Server Action plutôt que depuis le navigateur vers Storage (validation du format réel côté serveur) ; plafond de l'image traitée à 800 Ko pour rester sous la limite de 1 Mo des Server Actions (pas de changement de configuration).
**Dette introduite / remboursée** : DT-004 remboursée. Note : la suppression directe dans `storage.objects` est bloquée par Supabase, donc la policy DELETE owner n'est pas testable en pgTAP (elle passe par l'API Storage, exercée par l'action).

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (72 tests dont 5 nouveaux), `pnpm build` — verts
- [x] `pnpm db:push` → `pnpm db:test` (20 + 12 + 12 + 11 + 6 assertions `ok`) → `pnpm db:advisors` (avertissements acceptés uniquement) — OK
- [x] Aperçu à jour (logo et couverture), refus > 5 Mo, logo visible sur la carte client, pas de carte d'upload côté staff — OK par le porteur de projet
- [ ] Remplacement (ancien fichier supprimé du bucket) et refus d'un faux `.jpg` — non vérifiés

**Prochaine étape** : 5.4 — programmes de fidélité.

---

### Session 16 — [2026-10-23] — Phase 5.2 : fiche de l'établissement
**Roadmap :** Phase 5 — Étape 5.2 · **Statut :** ✅ Terminé · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- db: migration 8 — `UPDATE` de `restaurants` limité aux colonnes `name`, `category`, `opening_hours`, `logo_path`, `cover_path` ; RPC `set_restaurant_address` (adresse + `geography` cohérentes, owner ou admin) ; colonne `cover_path` ; CHECK sur `opening_hours` (objet JSON) et la longueur de l'adresse
- feat(5.2): `/pro/settings` pour l'owner : nom + catégorie (react-hook-form + Zod), adresse avec autocomplétion, éditeur d'horaires par jour (jusqu'à 3 créneaux, fermeture après minuit permise, chevauchements refusés) ; le `staff` voit un résumé en lecture seule
- feat: autocomplétion via la Server Action `searchAddresses` (appel serveur à l'API Géoplateforme de l'IGN, réponse validée par Zod, cache 1 h, saisie debouncée à 300 ms, 3 caractères minimum) ; seule une suggestion choisie (donc de vraies coordonnées) peut être enregistrée
- feat: garde `authorizeRestaurantOwner` commune aux actions (session, puis rôle owner, puis Zod)
- fix: retour d'essai — un créneau passant minuit (ex. 22:00–04:30) appartient au jour d'ouverture ; l'écran l'indique (« Ferme le lendemain à … ») et `validateWeek` refuse un chevauchement avec le premier créneau du jour suivant (dimanche → lundi inclus)

**Fichiers clés**
- `supabase/migrations/20261023100001_restaurant_profile_editing.sql`, `supabase/tests/restaurant_profile.test.sql` (11 assertions)
- `src/features/restaurants/` — `domain/` (`opening-hours`, `edit-opening-hours`, `parse-address-suggestions`, tests), `actions/`, `queries/get-restaurant-profile.ts`, `hooks/`, `components/`
- `src/app/pro/settings/page.tsx`

**Base de données**
- Migration : `20261023100001_restaurant_profile_editing.sql` appliquée (`pnpm db:push`)
- Types régénérés : oui

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| `pnpm db:push` sans sortie, bloqué | La CLI attend le mot de passe de la base | Saisie du mot de passe / `SUPABASE_DB_PASSWORD` | Lancer les commandes `db:*` dans le terminal de l'utilisateur |

**Advisors Supabase (acceptés)** : `authenticated_security_definer_function_executable` sur `set_restaurant_address` (appelable par les utilisateurs connectés par conception ; rôle owner/admin vérifié en début de fonction), en plus des deux fonctions d'invitation déjà acceptées.

**Décisions** : Aucun nouvel ADR. Choix notés : API Adresse = Géoplateforme IGN (ADR-007, l'ancien domaine `api-adresse.data.gouv.fr` est abandonné) ; les actions d'administration sur `restaurants` (`is_active`, `subscription_status`, `slug`) passeront par le client service role côté serveur en 5.5, l'UPDATE direct étant retiré aux admins aussi.
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm db:test` : 20 + 12 + 12 + 11 assertions pgTAP `ok` ; `pnpm db:advisors` : seulement les avertissements acceptés
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (67 tests dont 19 nouveaux), `pnpm build` — verts
- [x] Parcours manuel de `/pro/settings` (nom, adresse, horaires et créneaux, vue staff) — OK par le porteur de projet ; l'ambiguïté des créneaux après minuit a conduit au correctif ci-dessus

**Prochaine étape** : 5.3 — upload du logo et de la couverture.

---

### Session 15 — [2026-10-23] — Phase 5.1 : layout `/pro` et navigation basse
**Roadmap :** Phase 5 — Étape 5.1 · **Statut :** ✅ Terminé · **Branche :** `feat/phase-5-pro-settings`

**Réalisé**
- feat(5.1): layout `/pro` avec en-tête (rôle, nom de l'établissement), navigation basse Scanner · Logs · Stats · Réglages (cibles ≥ 56 px, `aria-current`) et sélecteur d'établissement si plusieurs memberships
- feat: établissement actif mémorisé dans un cookie `httpOnly` ; la Server Action `selectActiveRestaurant` vérifie session, appartenance et Zod avant de le poser ; la lecture re-valide toujours le cookie contre les memberships (`resolveActiveMembership`, domain testé)
- feat: pages placeholder `/pro/logs`, `/pro/stats`, `/pro/settings` ; `/pro` devient l'emplacement du scanner (Phase 6)
- Découpage décidé avec le porteur de projet : 5.1 → 5.4 sur cette branche, 5.5 (admin, chevalet en **PNG**, sans dépendance) sur une branche séparée ; colonne `cover_path` ajoutée en 5.3 ; API Adresse à vérifier avant 5.2

**Fichiers clés**
- `src/features/restaurants/` — constantes, `domain/resolve-active-membership.ts` (+ tests), `queries/get-active-membership.ts`, `actions/select-restaurant.ts`, composants de navigation
- `src/app/pro/layout.tsx` — garde + coque de l'espace pro
- `src/components/shared/coming-soon-card.tsx` — placeholder d'écran futur

**Base de données** : aucune migration, types inchangés.

**Constats d'audit pour 5.2 → 5.4 (à corriger par migration)** : UPDATE owner sur `restaurants` non limité par colonne (`subscription_status`, `slug`, `is_active` modifiables) ; policies Storage ouvertes aux `staff` ; DELETE physique de `loyalty_programs` permis par la RLS alors que les FK sont en `RESTRICT`.

**Bugs rencontrés** : Aucun
**Décisions** : Aucun nouvel ADR (le cookie n'est qu'une préférence, jamais une autorisation)
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (52 tests dont 4 nouveaux) — verts
- [x] Invitation → acceptation → `/pro` avec les 4 onglets, en-tête « Gérant », sélecteur avec 2 établissements — OK (captures du porteur de projet)
- [ ] Bascule effective de l'établissement actif et accès d'un simple client à `/pro` — non vérifiés

**Prochaine étape** : 5.2 — fiche de l'établissement.

---

### Session 14 — [2026-10-22] — Phase 4 : QR client et cartes de fidélité
**Roadmap :** Phase 4 — Étapes 4.1 → 4.5 · **Statut :** ✅ Terminé (Lighthouse Performance 86, écart au seuil de 90 accepté : DT-005) · **Branche :** `feat/phase-4-client-cards` → `main`

**Réalisé**
- feat(4.2): `computeCardProgress` (ADR-009) : `stamps / threshold` cumulatif (`13/10`, `13/20`), barre plafonnée, palier suivant avec boucle sur le 1er, bascule sur le palier actif suivant si le palier courant est désactivé (Q-013), `null` sans palier actif
- feat(4.1): `CustomerQrHero` : QR du `qr_token` seul (`qrcode.react`, niveau M, fond blanc, marge de 4 modules, 232 px) + code de secours `ABC DEF`
- feat(4.3/4.4): liste « Mes cartes de fidélité » (récompense du palier, barre, surbrillance verte + « Récompense disponible en caisse ! »), état vide, `loading.tsx` adapté, erreur via `error.tsx` (la requête lève en cas d'erreur base)
- feat(4.5): copie locale de l'identité (`localStorage`, clé `fidly.identity.v1`), effacée à la déconnexion
- perf: `cache()` React sur les lectures de session (suppression des appels Supabase en double entre layout et page)
- fix: `SignOutButton` n'ignore plus le résultat de `signOutUser` (toast d'erreur) ; `memberships` triées par date
- refactor: la page `/` n'est plus qu'un assemblage ; bannières pro extraites dans `ProAccessBanners`
- dev: script `supabase/dev/attach_dev_cards.sql` (scénarios `progress`, `unlocked`, `chained`, `clean`) pour tester avec votre compte

**Fichiers clés**
- `src/features/loyalty/` — `domain/` (progression, code court + tests), `queries/list-my-loyalty-cards.ts`, `components/`
- `src/features/auth/identity-storage.ts`, `hooks/use-persist-identity.ts` — persistance locale
- `src/app/(client)/page.tsx` — assemblage de l'écran
- `supabase/dev/attach_dev_cards.sql` — données de test (jamais une migration)

**Base de données** : aucune migration, types inchangés.

**Bugs rencontrés** : Aucun

**Décisions** : Aucun nouvel ADR (jeton local et format QR : cf. ADR-005/013)
**Dette introduite / remboursée** : DT-004

**Points de vigilance**
- Le QR mesure 29×29 modules (version 1) avec un jeton de 20 caractères majuscules ; en minuscules il passerait à 33×33, en hexadécimal 48 car. à 41×41 (vérifié).
- Le jeton local est un secret d'appareil : il n'y a pas encore de révocation du `qr_token` (ADR-005).
- La partie « lecture » de la copie locale (réaffichage hors-ligne) arrive avec le service worker de la Phase 8 ; seule l'écriture et l'effacement existent.

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (48 tests dont 18 nouveaux sur `computeCardProgress` / `formatShortCode`), `pnpm format:check`, `pnpm build` — verts
- [x] QR d'un jeton de 20 caractères : 29×29 modules (version 1) — vérifié par script
- [x] QR scanné avec succès depuis 3 téléphones différents — OK
- [x] Scénarios du script SQL (`progress`, `unlocked`, `chained`, `clean`) ⇒ affichage correct après rechargement — OK
- [x] Code de secours, `localStorage` (écriture et effacement à la déconnexion), rendu à 375 px — OK
- [x] Lighthouse mobile sous `pnpm dev` : Accessibilité 99, Bonnes pratiques 100, SEO 100 ; FCP 0,9 s, LCP 1,5 s, CLS 0
- [x] Lighthouse Performance : 81 sous `pnpm dev` (TBT 790 ms, bundle non minifié) puis **86 sur build de production local** ; seuil de 90 non atteint, écart **accepté par le porteur de projet** (DT-005, re-mesure sur Vercel en 11.4)

**Prochaine étape** : valider manuellement, commiter et fusionner, puis Phase 5 (espace restaurateur : fiche et programmes).

---

### Session 13 — [2026-10-22] — Clôture de la Phase 3 (validation, commits, merge)
**Roadmap :** Phase 3 — clôture · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth` → `main`

**Réalisé**
- db: migration 7 appliquée sur le projet Dev (`pnpm db:push`), types régénérés (`pnpm db:types`), `pnpm db:test` : 20 + 12 + 12 assertions pgTAP `ok`
- config (Dashboard Supabase, hors dépôt) : provider Google activé, URI de redirection Google Cloud (`…/auth/v1/callback`), templates email « Magic Link » et « Confirm signup » remplacés par le template OTP (`{{ .Token }}`), SMTP d'envoi configuré
- test: E2E Playwright (garde de routes `/`, `/pro`, `/admin`) : 2/2 ; `lint`, `typecheck`, `test` (30), `format:check` verts
- chore: `.agents/` et `skills-lock.json` versionnés (outillage d'agent, décision Session 6) ; `.claude/` (liens symboliques) ignoré

**Base de données**
- Migration : `20261022100001_schema_hardening_audit.sql` appliquée
- Types régénérés : oui

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention |
|---|---|---|---|
| Google : `400 redirect_uri_mismatch` | URI de callback Supabase absente des « URI de redirection autorisés » du client OAuth Google | Ajout de `https://<ref>.supabase.co/auth/v1/callback` dans Google Cloud | Checklist de configuration ci-dessous |
| Email reçu avec un lien, pas un code | Les templates de `supabase/templates` et `config.toml` ne s'appliquent pas au projet Cloud (ADR-011) | Templates collés dans le Dashboard | Toute modification de template/Auth doit être reportée dans le Dashboard |
| « Trop de tentatives » à l'envoi du code | Limite d'envoi du SMTP par défaut de Supabase (~2 emails/h) | SMTP personnalisé | Ne pas multiplier les essais avec des adresses fictives |
| `db push` bloqué sur « Initialising login role… » | Rôle temporaire de la CLI non joignable via le pooler | `SUPABASE_DB_PASSWORD` défini dans le terminal | — |

**Advisors Supabase (acceptés)** : `authenticated_security_definer_function_executable` sur `accept_restaurant_invitation` et `list_my_pending_invitations` (appelables par les utilisateurs connectés par conception ; `auth.uid()` et email vérifié contrôlés en interne) ; `auth_leaked_password_protection` (non applicable : aucun mot de passe).

**Checklist de configuration Supabase/Google (environnement Cloud Dev)**
- Google Cloud : URI de redirection `https://bduimaxjfsojzankmoje.supabase.co/auth/v1/callback`, utilisateurs test ajoutés tant que l'app est en mode Test
- Supabase → URL Configuration : Site URL `http://localhost:3000` + `http://localhost:3000/**` (ajouter l'URL Vercel au déploiement)
- Supabase → Email Templates : « Magic Link » et « Confirm signup » = `supabase/templates/otp.html`
- Supabase → Email : OTP à 6 chiffres, expiration recommandée 600 s

**Décisions** : Aucune nouvelle (ADR-012/013/014 en Session 12)
**Dette introduite / remboursée** : DT-003 (validations Phase 3 reportées)

**Non traité (audit)** : `cache()` sur les requêtes de session, code mort `features/scanner`, résultat de `signOutUser` ignoré, `memberships[0]` non ordonné, policy `loyalty_programs` anon sur restaurants inactifs.

**Tests de validation**
- [x] Connexion Google (navigateur) — OK
- [x] Connexion OTP : email formaté avec le code, code erroné ⇒ message clair, renvoi bloqué 60 s — OK
- [x] E2E : visiteur anonyme redirigé vers `/login` (`/`, `/pro`, `/admin`) — OK
- [ ] Parcours par rôle (client/staff/admin), session persistante, cookie modifié, Google mobile/PWA — reportés (DT-003)

**Prochaine étape** : Phase 4 — Étape 4.1 (QR client, `qrcode.react`, jeton de 20 caractères — ADR-013).

---

### Session 12 — [2026-10-22] — Audit Phase 3 et durcissement du schéma (migration 7)
**Roadmap :** Phase 3 (clôture) · **Statut :** 🟡 Partiel (migration écrite, non appliquée ; tests manuels à faire) · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `pnpm format` sur `src/` (19 fichiers) ; `.agents/`, `.claude/` et `skills-lock.json` ajoutés à `.prettierignore` → `pnpm format:check` passe (CI)
- db: migration 7 `20261022100001_schema_hardening_audit.sql`
  - `qr_token` : 20 caractères base32 majuscules (100 bits), jetons existants régénérés, contrainte CHECK de format (ADR-013)
  - `profiles` : `UPDATE` limité à la colonne `display_name` (`signup_restaurant_id` protégé) (ADR-014)
  - `scan_logs` : colonne `restaurant_id` (rétro-remplie, FK composite `(card_id, restaurant_id)`), `card_id`/`staff_id` nullables en `ON DELETE SET NULL`, trigger d'immutabilité qui n'autorise que l'anonymisation, policy SELECT basée sur `restaurant_id`, index `(restaurant_id, created_at desc)` (ADR-012)
- test: `supabase/tests/schema_hardening.test.sql` (12 assertions), `rls_access_matrix.test.sql` adapté (colonnes protégées, `restaurant_id`), `db:test` l'exécute
- docs: `seed.sql` mis à jour (`restaurant_id` des logs)

**Fichiers clés**
- `supabase/migrations/20261022100001_schema_hardening_audit.sql`
- `supabase/tests/schema_hardening.test.sql`

**Base de données**
- Migration : `20261022100001_schema_hardening_audit.sql` — **écrite mais NON appliquée** (à pousser par le porteur du projet)
- Types régénérés : **non** — à faire après `pnpm db:push` (`scan_logs.card_id`/`staff_id` deviennent nullables, `restaurant_id` ajouté). Le code actuel ne lit pas `scan_logs`, donc `typecheck` passe sans.

**Bugs rencontrés** : Aucun

**Décisions** : ADR-012 (journal anonymisable, RGPD), ADR-013 (format du `qr_token`), ADR-014 (droits de colonne sur `profiles`)
**Dette introduite / remboursée** : DT-001, DT-002 (cf. registre)

**Non traité (audit, hors périmètre de cette session)** : `cache()` sur les requêtes de session, config OTP (`max_frequency`, `otp_expiry`) à aligner dans le Dashboard, code mort `features/scanner`, résultat de `signOutUser` ignoré, `memberships[0]` non ordonné, policy `loyalty_programs` anon sur restaurants inactifs.

**Tests de validation**
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (30 tests), `pnpm format:check` — verts
- [ ] `pnpm db:push` → `pnpm db:types` → `pnpm db:test` (3 fichiers pgTAP) — à exécuter
- [ ] Tests de validation manuels Phase 3 — à exécuter

**Prochaine étape** : appliquer et tester la migration 7, valider la Phase 3 sur appareils réels, commiter.

---

### Session 11 — [2026-10-20 → 2026-10-22] — Phase 3 : authentification & rôles (consignée rétroactivement)
**Roadmap :** Phase 3 — Étapes 3.1 → 3.7 · **Statut :** 🟡 Partiel (code livré, tests de validation non cochés) · **Branche :** `feat/phase-3-auth`

> Entrée rédigée lors de l'audit de la Session 12 : le code avait été écrit sans mise à jour du journal.

**Réalisé**
- feat: clients Supabase (`lib/supabase/server.ts`, `client.ts`, `admin.ts`, `proxy.ts`) et `src/proxy.ts` (rafraîchissement de session via `getClaims()`, redirection optimiste vers `/login?next=…`, default-deny)
- feat: `/login` (Google OAuth PKCE + OTP email 6 chiffres), `/auth/callback`, `/onboarding` (prénom, Q-010), `/invitation`, déconnexion
- feat: gardes de routes serveur : `(client)` (session + prénom), `/pro` (membre de `restaurant_members`), `/admin` (`platform_admins`)
- feat: `lib/server-env.ts` (secrets serveur validés par Zod)
- db: migration 6 `20261020130001_invitation_rpcs_and_first_name.sql` — prénom seul depuis Google, `private.current_verified_email()`, RPC `list_my_pending_invitations` et `accept_restaurant_invitation` (verrou `FOR UPDATE`, usage unique)
- test: `auth-domain.test.ts` (redirections, schémas, mapping d'erreurs), `invitation_acceptance.test.sql` (12 assertions), E2E de garde de routes
- chore: template email OTP FR (`supabase/templates/otp.html`), dépendances `@supabase/ssr` et `@supabase/supabase-js`

**Base de données**
- Migration : `20261020130001_invitation_rpcs_and_first_name.sql` (appliquée sur le projet Dev)
- Types régénérés : oui

**Décisions** : ADR-003 (OTP + Google) et ADR-006 (invitation) mis en œuvre
**Dette introduite / remboursée** : Aucune

**Tests de validation** : voir `04-ROADMAP.md` Phase 3 (aucun coché au 2026-10-22)

**Prochaine étape** : voir Session 12.

---

### Session 10 — [2026-10-22] — Installation du skill `vercel-react-best-practices` (outillage agent)
**Roadmap :** Hors roadmap (outillage agent) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices` — skill installé dans `.agents/skills/vercel-react-best-practices/` (source canonique) + symlink `.claude/skills/vercel-react-best-practices` pour Claude Code

**Fichiers clés**
- `.agents/skills/vercel-react-best-practices/SKILL.md` — skill de bonnes pratiques React/Next.js (provenance : `vercel-labs/agent-skills`)
- `.agents/skills/vercel-react-best-practices/rules/*.md` — une cinquantaine de règles détaillées (async, bundle, rendering, rerender, server, JS) référencées par le skill
- `.agents/skills/vercel-react-best-practices/AGENTS.md`, `README.md` — documentation amont
- `.claude/skills/vercel-react-best-practices` — symlink vers le skill ci-dessus

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : Aucune (pas d'ADR : outil d'agent, pas une dépendance applicative)
**Dette introduite / remboursée** : Aucune

**Points de vigilance**
- Le skill s'exécute avec les permissions complètes de l'agent. Scan tiers : Gen « Safe », Socket 0 alerte, Snyk « Low Risk ». Ne contient que de la documentation (pas de scripts).
- Ses règles de performance React/Next.js peuvent entrer en conflit avec les règles du projet (`.cursorrules`) ; `.cursorrules` prévaut.
- Recouvrement possible avec les skills de design installés en Sessions 7 à 9.
- `.agents/` et `.claude/` restent non suivis par git (cf. Session 6).

**Tests de validation**
- [x] Installation non interactive réussie (1 skill, 0 erreur)
- [ ] Relecture du `SKILL.md` et des règles — non faite dans cette session

**Prochaine étape** : inchangée — Phase 3 — Étape 3.1 (`feat/phase-3-auth`).

---

### Session 9 — [2026-10-22] — Installation du skill `web-design-guidelines` (outillage agent)
**Roadmap :** Hors roadmap (outillage agent) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines` — skill installé dans `.agents/skills/web-design-guidelines/` (source canonique) + symlink `.claude/skills/web-design-guidelines` pour Claude Code

**Fichiers clés**
- `.agents/skills/web-design-guidelines/SKILL.md` — skill de revue des règles de design web (provenance : `vercel-labs/agent-skills`)
- `.claude/skills/web-design-guidelines` — symlink vers le skill ci-dessus

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : Aucune (pas d'ADR : outil d'agent, pas une dépendance applicative)
**Dette introduite / remboursée** : Aucune

**Points de vigilance**
- Le skill s'exécute avec les permissions complètes de l'agent. Scan tiers : Gen « Safe », Socket 0 alerte, Snyk « Low Risk ». Ne contient que `SKILL.md` (pas de scripts).
- Recouvrement possible avec `ui-ux-pro-max` (Session 7) et `frontend-design` (Session 8) : à arbitrer selon le besoin.
- `.agents/` et `.claude/` restent non suivis par git (cf. Session 6).

**Tests de validation**
- [x] Installation non interactive réussie (1 skill, 0 erreur)
- [ ] Relecture du `SKILL.md` — non faite dans cette session

**Prochaine étape** : inchangée — Phase 3 — Étape 3.1 (`feat/phase-3-auth`).

---

### Session 8 — [2026-10-22] — Installation du skill `frontend-design` (outillage agent)
**Roadmap :** Hors roadmap (outillage agent) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `npx skills add https://github.com/anthropics/skills --skill frontend-design` — skill installé dans `.agents/skills/frontend-design/` (source canonique) + symlink `.claude/skills/frontend-design` pour Claude Code

**Fichiers clés**
- `.agents/skills/frontend-design/SKILL.md` — skill de conception d'interfaces frontend (provenance : `anthropics/skills`)
- `.agents/skills/frontend-design/LICENSE.txt` — licence du skill
- `.claude/skills/frontend-design` — symlink vers le skill ci-dessus

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : Aucune (pas d'ADR : outil d'agent, pas une dépendance applicative)
**Dette introduite / remboursée** : Aucune

**Points de vigilance**
- Le skill s'exécute avec les permissions complètes de l'agent. Scan tiers : Gen « Safe », Socket 0 alerte, Snyk « Low Risk ». Ce skill ne contient que de la documentation (pas de scripts).
- Recouvrement possible avec `ui-ux-pro-max` (Session 7) sur les conseils UI : à arbitrer selon le besoin.
- `.agents/` et `.claude/` restent non suivis par git (cf. Session 6).

**Tests de validation**
- [x] Installation non interactive réussie (1 skill, 0 erreur)
- [ ] Relecture du `SKILL.md` — non faite dans cette session

**Prochaine étape** : inchangée — Phase 3 — Étape 3.1 (`feat/phase-3-auth`).

---

### Session 7 — [2026-10-22] — Installation du skill `ui-ux-pro-max` (outillage agent)
**Roadmap :** Hors roadmap (outillage agent) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max` — skill installé dans `.agents/skills/ui-ux-pro-max/` (source canonique) + symlink `.claude/skills/ui-ux-pro-max` pour Claude Code

**Fichiers clés**
- `.agents/skills/ui-ux-pro-max/SKILL.md` — skill de conseils UI/UX (provenance : `nextlevelbuilder/ui-ux-pro-max-skill`)
- `.agents/skills/ui-ux-pro-max/scripts/*.py` — scripts Python (`search.py`, `core.py`, `design_system.py`, `reasoning_contract.py`) exécutés par le skill
- `.agents/skills/ui-ux-pro-max/data/*.csv` — jeux de données (couleurs, typographies, styles, stacks)
- `.claude/skills/ui-ux-pro-max` — symlink vers le skill ci-dessus

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : Aucune (pas d'ADR : outil d'agent, pas une dépendance applicative)
**Dette introduite / remboursée** : Aucune

**Points de vigilance**
- Le skill s'exécute avec les permissions complètes de l'agent et lance des scripts Python. Scan tiers : Gen « Safe », Socket 0 alerte, Snyk « Low Risk ». Relire les scripts avant tout usage.
- `.agents/` et `.claude/` restent non suivis par git (cf. Session 6).

**Tests de validation**
- [x] Installation non interactive réussie (1 skill, 0 erreur)
- [ ] Relecture des scripts Python — non faite dans cette session

**Prochaine étape** : inchangée — Phase 3 — Étape 3.1 (`feat/phase-3-auth`).

---

### Session 6 — [2026-10-22] — Installation du skill `find-skills` (outillage agent)
**Roadmap :** Hors roadmap (outillage agent, aucune étape de Phase) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-3-auth`

**Réalisé**
- chore: `npx skills add https://github.com/vercel-labs/skills --skill find-skills` — skill installé dans `.agents/skills/find-skills/` (source canonique) + symlink `.claude/skills/find-skills` pour Claude Code

**Fichiers clés**
- `.agents/skills/find-skills/SKILL.md` — skill de recherche de skills (provenance : `vercel-labs/skills`)
- `.claude/skills/find-skills` — symlink vers le skill ci-dessus

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : Aucune (pas d'ADR : ajout d'un outil d'agent, pas une dépendance applicative ni un changement de stack)
**Dette introduite / remboursée** : Aucune

**Points de vigilance**
- Le skill s'exécute avec les permissions complètes de l'agent. Scan tiers : Gen « Safe », Socket 0 alerte, Snyk « Med Risk ». À relire avant utilisation (`.agents/skills/find-skills/SKILL.md`).
- `.agents/` et `.claude/` sont non suivis par git : décider s'ils doivent être commités ou ignorés.

**Tests de validation**
- [x] Installation non interactive réussie (1 skill, 0 erreur)
- [ ] Relecture manuelle du `SKILL.md` — non faite dans cette session

**Prochaine étape** : inchangée — Phase 3 — Étape 3.1 (`feat/phase-3-auth`).

---

### Session 5 — [2026-10-20] — Implémentation complète de la Phase 2 (Schéma PostgreSQL, RLS, Storage, Seed & Tests pgTAP) & merge sur `main`
**Roadmap :** Phase 2 — Étapes 2.1 → 2.8 · **Statut :** ✅ Terminé · **Branche :** `main` (après merge de `feat/phase-2-database`)

**Réalisé**
- chore(git): création de la branche `feat/phase-2-database` depuis `main` et restauration de `.env.example` (avec `.env.local` ignoré par Git)
- chore(db): installation de `supabase@^2.121.0`, `supabase init`, liaison au projet Supabase Cloud Dev (`bduimaxjfsojzankmoje`, `eu-central-1`) et configuration des scripts `db:*` dans `package.json`
- db(migrations): rédaction et application des 5 migrations versionnées dans `supabase/migrations/` :
  - `20261020090001_extensions_and_enums.sql` (`pgcrypto`, `postgis`, enums `restaurant_category`, `restaurant_member_role`, `subscription_status`, `scan_log_type`)
  - `20261020090002_core_tables.sql` (8 tables métier, contraintes `CHECK`/`UNIQUE`, index FK + `GIST(location)`, `ENABLE ROW LEVEL SECURITY` immédiat)
  - `20261020090003_auth_profile_trigger.sql` (`generate_short_code()` 6 caractères sans `0/O/1/I/L` + trigger `on_auth_user_created` → `public.profiles`)
  - `20261020090004_rls_helpers_and_policies.sql` (helpers `SECURITY DEFINER` `SET search_path = ''` isolés dans le schéma `private` non exposé par PostgREST, protection des colonnes immuables de `profiles`, immutabilité stricte de `scan_logs`, policies RLS consolidées par rôle/opération)
  - `20261020090005_storage_bucket.sql` (bucket `restaurant-media` 5 MiB + policies lecture publique / écriture membres du restaurant)
- db(seed): création et application de `supabase/seed.sql` (2 restaurants, 3 programmes, 1 owner, 3 clients, cartes `7/10`, `13/10`, `13/20` et logs `visit`, `reward_redeemed`, `reversal`)
- db(types): génération complète de `src/types/database.types.ts` via `pnpm db:types`
- test(db): création et exécution de `supabase/tests/rls_access_matrix.test.sql` (20/20 assertions pgTAP vertes via `pnpm db:test`)

**Fichiers clés**
- `package.json` / `pnpm-workspace.yaml` — dépendance `supabase` et scripts `db:*` (`db:push`, `db:seed`, `db:reset`, `db:types`, `db:test`, `db:advisors`)
- `supabase/migrations/20261020090001_*.sql` → `20261020090005_*.sql` — schéma complet, triggers, RLS et Storage
- `supabase/seed.sql` — jeu de données de développement idempotent
- `supabase/tests/rls_access_matrix.test.sql` — suite de tests pgTAP (20 assertions)
- `src/types/database.types.ts` — types TypeScript générés depuis le schéma distant

**Base de données**
- Migrations appliquées : `20261020090001_extensions_and_enums.sql` à `20261020090005_storage_bucket.sql`
- Types régénérés : oui (`src/types/database.types.ts`, 539 lignes)

**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| `DbConfigConnectTempRoleError: Connection terminated unexpectedly / timed out` sur `aws-1-eu-central-1.pooler.supabase.com:5432` lors de `supabase db push --linked` sur le Wi-Fi initial | Filtrage du protocole PostgreSQL (port TCP 5432) par le pare-feu du réseau Wi-Fi, alors que le flux HTTPS (port 443) passe normalement | Passage en partage de connexion pour les opérations TCP (`db:push`, `db:reset`, `db:test`) et utilisation de `--project-id` (HTTPS 443) pour `db:types` | Garder `--project-id` sur `db:types` ; utiliser `supabase db query --linked -f` pour exécuter les tests pgTAP sans Docker Desktop |
| Alertes `0028` / `0029` (`security_definer_function_executable`) du Security Advisor sur `is_platform_admin`, `is_restaurant_member`, `is_restaurant_owner` et `rls_auto_enable` | Toute fonction `SECURITY DEFINER` placée dans le schéma `public` est exposée par PostgREST sous `/rest/v1/rpc/*` | Déplacement des helpers RLS internes dans un schéma dédié `private` (non exposé dans `api.schemas`) et `REVOKE ALL` sur `public.rls_auto_enable()` | Placer systématiquement les fonctions `SECURITY DEFINER` internes (non appelées par le front) dans le schéma `private` et vérifier `pnpm db:advisors` |

**Décisions** : ADR-011 (Environnement de dev DB : Projet Supabase Cloud « Dev » lié plutôt que Docker Desktop local)
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `supabase db reset --linked` rejoue les 5 migrations + `seed.sql` sans erreur
- [x] `pnpm db:test` : **20 / 20 assertions pgTAP vertes** (`ok 1` → `ok 20`, cas autorisés et refusés de la matrice d'accès)
- [x] `pnpm db:advisors` : **0 erreur et 0 alerte** sur le schéma, les tables, les index et les fonctions RLS
- [x] `pnpm format && pnpm lint && pnpm typecheck && pnpm test` — 100 % vert avec `src/types/database.types.ts`

**Prochaine étape** : Commiter et fusionner `feat/phase-2-database` dans `main`, puis démarrer la **Phase 3 — Authentification & rôles**.

---

### Session 4 — [2026-10-19] — Finalisation de la Phase 1 (shadcn/ui, Playwright, Husky) & merge sur `main`
**Roadmap :** Phase 1 — Étapes 1.3 (fin), 1.4, 1.6 (fin) · **Statut :** ✅ Terminé · **Branche :** `main` (après merge de `feat/phase-1-foundation`)

**Réalisé**
- feat(ui): initialisation `shadcn/ui` (`components.json`) avec Tailwind CSS v4 et design tokens Fidly dans `src/app/globals.css` (`@theme inline`, palette contrastée AA `zinc-950` / `emerald-600`, `prefers-reduced-motion`)
- feat(ui): ajout des composants de base typés strictement dans `src/components/ui/` (`button`, `card`, `drawer`, `input`, `label`, `form`, `sonner`, `skeleton`, `progress`) et intégration sur `src/app/layout.tsx` et `src/app/page.tsx`
- test(e2e): configuration de Playwright (`playwright.config.ts`, viewport mobile `375×667`) et création du smoke test E2E `e2e/smoke.spec.ts` (`pnpm test:e2e`)
- chore(git): configuration de Husky (`.husky/pre-commit`) et `lint-staged` dans `package.json` pour formater et linter automatiquement chaque commit
- chore(git): fusion propre de `feat/phase-1-foundation` dans `main`

**Fichiers clés**
- `components.json` / `src/app/globals.css` — configuration `shadcn/ui` et tokens CSS Tailwind v4
- `src/components/ui/*` — composants UI de base (`button`, `card`, `drawer`, `input`, `label`, `form`, `sonner`, `skeleton`, `progress`)
- `playwright.config.ts` / `e2e/smoke.spec.ts` — configuration E2E mobile-first (`375×667`) et smoke test
- `.husky/pre-commit` / `package.json` — hook pre-commit `pnpm lint-staged`

**Base de données** : Aucune
**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| `Error: Cannot find module 'C:\Program Files\Git\Program Files\nodejs\...\corepack\dist\pnpm.js'` au `git commit` | Le shell MSYS2 (`sh.exe`) de Git for Windows réécrit le chemin `/Program Files/nodejs/...` du shim `pnpm` généré par Corepack | Appel direct `node ./node_modules/lint-staged/bin/lint-staged.js` dans `.husky/pre-commit` | Exécuté et vérifié à chaque `git commit` |
| Échec de l'étape `Install dependencies` (`pnpm install --frozen-lockfile`, code 1) en CI GitHub Actions | `pnpm@12.14.0` exige la clé `allowBuilds: { unrs-resolver: true }` dans `pnpm-workspace.yaml` (au lieu de l'ancienne clé `onlyBuiltDependencies`) et renvoie `ERR_PNPM_IGNORED_BUILDS` | Exécution de `pnpm approve-builds --all` (`allowBuilds` dans `pnpm-workspace.yaml`) + `pnpm/action-setup@v4` dans `.github/workflows/ci.yml` | Tester `pnpm install --frozen-lockfile` localement après tout ajout de dépendance |

**Décisions** : Aucune (application d'ADR-001)
**Dette introduite / remboursée** : Aucune

**Tests de validation**
- [x] `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test` — 100 % vert (0 warning, 4/4 tests unitaires Vitest passés)
- [x] Initialisation Husky (`pnpm prepare`) et exécution de `lint-staged` au commit opérationnelles

**Prochaine étape** : Démarrage de la **Phase 2 — Base de données & sécurité RLS** sur une branche dédiée `feat/phase-2-database` (Étape 2.1 : `supabase init` + migrations SQL).

---

### Session 3 — [2026-10-19] — Validation du Spike Scanner QR (Étape 0.3) & nettoyage
**Roadmap :** Phase 0 — Étape 0.3 · **Statut :** ✅ Terminé · **Branche :** `feat/phase-1-foundation` (après merge de `spike/0.3-qr-scanner`)

**Réalisé**
- feat(scanner): création et test du banc d'essai comparatif (`/spike-scanner`) avec confirmation visuelle, sonore (Web Audio API) et haptique
- test(scanner): validation par le porteur de projet — décodage instantané dès l'entrée du QR dans le champ caméra, excellente réactivité
- chore(scanner): confirmation définitive d'ADR-002 (`@yudiel/react-qr-scanner` + `qrcode.react` conservés), retrait de `html5-qrcode` et du code jetable du banc d'essai
- refactor(scanner): conservation uniquement des briques de production réutilisables en Phase 6 (`YudielQrReader`, `triggerScanFeedback`)

**Fichiers clés**
- `src/features/scanner/components/yudiel-qr-reader.tsx` — lecteur QR basé sur `@yudiel/react-qr-scanner`
- `src/features/scanner/utils/scan-feedback.ts` — feedback sonore (880→1320 Hz) et vibration
- `src/features/scanner/index.ts` — exports publics de la feature `scanner`

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : ADR-002 confirmé définitivement après spike 0.3 (`@yudiel/react-qr-scanner`)
**Dette introduite / remboursée** : Aucune (`html5-qrcode` supprimé de `package.json`)

**Tests de validation**
- [x] Test réel du banc d'essai : décodage instantané et fluide validé par le porteur de projet
- [x] `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test` — 100 % vert après nettoyage

**Prochaine étape** : Finalisation de la Phase 1 sur `feat/phase-1-foundation` (Étape 1.4 `shadcn/ui`, Étape 1.6 `Playwright`, Étape 1.3 `Husky` + `lint-staged`).

---

### Session 2 — [2026-10-19] — Initialisation du socle technique (Phase 1)
**Roadmap :** Phase 1 — Étapes 1.2, 1.3, 1.5, 1.6 (Vitest), 1.7 (CI) · **Statut :** ✅ Terminé · **Branche :** `feat/phase-1-foundation`

**Réalisé**
- feat: initialisation Next.js 16 (App Router) + React 19 + TypeScript 6.0 strict + Tailwind CSS v4 avec `pnpm`
- feat: durcissement `tsconfig.json` (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, alias `@/*`) et headers de sécurité dans `next.config.ts`
- feat: configuration ESLint (`no-explicit-any: error`, `max-lines: 150`, `max-lines-per-function: 40`) + Prettier (`prettier-plugin-tailwindcss`)
- feat: création du socle `src/lib/env.ts` (validation Zod des variables d'environnement), `src/lib/errors.ts` (`ActionResult<T>`, `AppErrorCode`, messages FR) et `src/lib/utils.ts` (`cn()`)
- feat: layout racine FR mobile-first (`src/app/layout.tsx`, `src/app/page.tsx`)
- test: configuration Vitest (`vitest.config.ts`) + 4 tests unitaires dans `src/lib/env-and-errors.test.ts`
- ci: création du workflow GitHub Actions `.github/workflows/ci.yml` (`format:check`, `lint`, `typecheck`, `test`)

**Fichiers clés**
- `package.json` / `pnpm-workspace.yaml` — dépendances et scripts (`lint`, `typecheck`, `test`, `format`)
- `tsconfig.json` / `eslint.config.mjs` / `.prettierrc` — garde-fous TypeScript strict et anti-spaghetti
- `src/lib/env.ts` — validation Zod des variables d'environnement publiques
- `src/lib/errors.ts` — type `ActionResult<T>` et catalogue d'erreurs FR centralisé
- `src/lib/env-and-errors.test.ts` — tests unitaires Vitest
- `src/app/layout.tsx` / `src/app/page.tsx` — squelette mobile-first FR
- `.github/workflows/ci.yml` — pipeline CI GitHub Actions

**Base de données** : Aucune
**Bugs rencontrés**
| Symptôme | Cause racine | Correctif | Prévention (test / règle) |
|---|---|---|---|
| `typescript-eslint does not support TS 7.0` lors de `pnpm lint` | `typescript@latest` résolvait vers TS 7.0.2 alors que `typescript-eslint` supporte TS `~6.0.0` | Épinglage `"typescript": "~6.0.0"` (6.0.3) et `"module": "preserve"` dans `tsconfig.json` | Exécution systématique de `pnpm lint && pnpm typecheck` en CI |

**Décisions** : Aucune (application d'ADR-001)
**Dette introduite** : Aucune

**Tests de validation**
- [x] `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test` — 100 % vert (4/4 tests unitaires passés)
- [x] Vérification du garde-fou ESLint : injection d'un `any` explicite ⇒ échec immédiat de `pnpm lint` (code 1), fichier supprimé
- [x] Validation Zod `parsePublicEnv({})` sans variables requises ⇒ erreur explicite (testée unitairement)
- [ ] Étape 1.4 (composants shadcn/ui) + Playwright E2E (1.6) + connexion Vercel (1.7) à compléter après/avec le spike scanner (0.3)

**Prochaine étape** : Étape 0.3 (spike scanner sur appareils réels) et finalisation des étapes 1.4 / 1.6 (Playwright) / 1.7 (déploiement Vercel).

---

### Session 1 — [2026-10-19] — Arbitrages métier, validation des ADR, dépôt git
**Roadmap :** Phase 0 — Étape 0.2 (+ Phase 1 — Étape 1.1) · **Statut :** ✅ Terminé · **Branche :** `main`

**Réalisé**
- docs: réponses du porteur de projet à Q-001 → Q-013 consignées (tableau *Questions ouvertes*)
- docs: ADR-002 → ADR-007 passés en ✅ Accepté (ADR-002 sous réserve des mesures du spike 0.3)
- docs: ADR-009 (modèle de progression : compteur cumulatif sur le cycle `13/10 → 13/20` + boucle avec report au Palier 1) et ADR-010 (annulation par écriture compensatoire : owner = tout, staff = ses propres scans < 10 min) créés et validés
- docs: `04-ROADMAP.md` aligné (modèle de données, étapes 0.2, 1.1, 3.4, 3.6, 4.2, 4.3, 6.6, 6.8, 7.3, Phase 12), `02-PRODUIT-ET-UX.md` et `03-ARCHITECTURE-TECHNIQUE.md` mis en cohérence
- chore: projet sorti de OneDrive, dépôt git + GitHub (`amin-tennah/Fidly`), ajout de `.gitignore`

**Fichiers clés**
- `Documentation/CHANGELOG_ET_DECISIONS.md` — décisions Q-001 → Q-013, ADR-009/010
- `Documentation/04-ROADMAP.md` — schéma cible mis à jour (`display_name`, `current_program_id`, `lifetime_visits`, `reverses_log_id`)
- `Documentation/02-PRODUIT-ET-UX.md` — §5 « Règles de progression validées » (`13/10 → 13/20 → boucle`)
- `.gitignore` — exclusions Next.js / Supabase / env / tests

**Base de données** : Aucune migration (schéma cible documenté uniquement)
**Bugs rencontrés** : Aucun
**Décisions** : ADR-002 → ADR-007 acceptés · ADR-009, ADR-010 créés et validés
**Dette introduite** : Aucune

**Tests de validation**
- [x] Validation des ADR « Proposé » par le porteur de projet
- [x] Projet hors OneDrive, `git status` propre, remote `origin` configuré
- [x] Confirmation par le porteur de projet de l'exemple chiffré d'ADR-009 (`13/10 → 13/20 → boucle`) et réponses Q-011 → Q-013

**Prochaine étape** : Phase 1 — Socle technique (sur branche dédiée) + Étape 0.3 (spike scanner).

---

### Session 0 — [2026-10-19] — Cadrage, règles et roadmap
**Roadmap :** Phase 0 — Étape 0.1 · **Statut :** ✅ Terminé · **Branche :** — (pas encore de dépôt git)

**Réalisé**
- docs: création de `.cursorrules` (règles anti-dérive) + `AGENTS.md` (import pour Antigravity)
- docs: création de ce fichier (`CHANGELOG_ET_DECISIONS.md`)
- docs: création de `04-ROADMAP.md` (12 phases, tests et vigilances par étape)

**Fichiers clés**
- `.cursorrules` — règles de code absolues (source unique)
- `AGENTS.md` — point d'entrée des règles pour Antigravity
- `Documentation/04-ROADMAP.md` — plan d'implémentation

**Base de données** : Aucune
**Bugs rencontrés** : Aucun
**Décisions** : ADR-001 à ADR-008
**Dette introduite** : Aucune

**Tests de validation**
- [x] Relecture croisée des 3 documents de spécification
- [x] Validation des ADR « Proposé » par le porteur de projet (Session 1)

**Prochaine étape** : Phase 0 — réponses aux questions ouvertes + spike scanner sur appareils réels.

---

## 🏛️ Registre des décisions d'architecture (ADR)

### Index
| ID | Titre | Statut | Date |
|---|---|---|---|
| ADR-001 | Stack de base Next.js + Supabase confirmée | ✅ Accepté | 2026-10-19 |
| ADR-002 | Scanner : `@yudiel/react-qr-scanner` plutôt que `html5-qrcode` | ✅ Accepté (confirmé par spike 0.3) | 2026-10-19 |
| ADR-003 | Connexion email par code OTP + Google ; Magic Link et Apple abandonnés | ✅ Accepté | 2026-10-19 |
| ADR-004 | Logique de scan atomique dans une fonction PostgreSQL (RPC) | ✅ Accepté | 2026-10-19 |
| ADR-005 | Le QR encode un `qr_token` opaque, pas le `user_id` | ✅ Accepté | 2026-10-19 |
| ADR-006 | Rôles via table `restaurant_members` (multi-staff) + onboarding pro sur invitation | ✅ Accepté | 2026-10-19 |
| ADR-007 | Géolocalisation : PostGIS + API Adresse (BAN) | ✅ Accepté | 2026-10-19 |
| ADR-008 | `.cursorrules` source unique, importé par `AGENTS.md` | ✅ Accepté | 2026-10-19 |
| ADR-009 | Progression : compteur cumulatif sur le cycle (`13/10 → 13/20`) + boucle sur le Palier 1 | ✅ Accepté | 2026-10-19 |
| ADR-010 | Annulation d'un scan par écriture compensatoire liée (`reverses_log_id`) | ✅ Accepté | 2026-10-19 |
| ADR-011 | Environnement de dev DB : Projet Supabase Cloud « Dev » lié (`--linked`) sans Docker Desktop | ✅ Accepté | 2026-10-20 |
| ADR-012 | Journal `scan_logs` : traces d'audit anonymisables, conformité RGPD à la suppression de compte | ✅ Accepté | 2026-10-22 |
| ADR-013 | `qr_token` : 20 caractères base32 majuscules (100 bits) pour un QR de version 1 | ✅ Accepté | 2026-10-22 |
| ADR-014 | `profiles` : droits `UPDATE` par colonne (`display_name` seul) | ✅ Accepté | 2026-10-22 |
| ADR-015 | Recadrage d'image : `react-easy-crop` | ✅ Accepté | 2026-10-23 |
| ADR-016 | Programmes de fidélité : écriture par RPC, règles de paliers, `@dnd-kit` | ✅ Accepté | 2026-10-23 |
| ADR-017 | Feature partagée `media` (cadrage, compression, stockage des images) | ✅ Accepté | 2026-10-23 |
| ADR-018 | Back-office : session admin + RLS plutôt que client service role | ✅ Accepté | 2026-10-23 |
| ADR-019 | Scan : RPC par restaurant actif, idempotence rejouable, horodatage `clock_timestamp()` | ✅ Accepté | 2026-10-25 |
| ADR-020 | Temps réel : événement = signal de relecture, journal lu par RPC paginée par curseur | ✅ Accepté | 2026-10-26 |
| ADR-021 | Temps réel : session transmise explicitement à Realtime avant l'abonnement | ✅ Accepté | 2026-10-29 |
| ADR-022 | Scan : RPC appelées directement depuis le navigateur plutôt que par Server Actions | ✅ Accepté | 2026-11-01 |
| ADR-023 | Direction artistique en Phase 7 bis, avant la PWA (P8) | ✅ Accepté | 2026-11-01 |
| ADR-024 | Identité visuelle : vert forêt, logotype « tampon », couleur par carte | ✅ Accepté | 2026-11-02 |
| ADR-025 | Hors-ligne : service worker maison et page autonome plutôt que Serwist | ✅ Accepté | 2026-11-11 |

<!-- ============ TEMPLATE ADR ============
### ADR-NNN — Titre
- **Date :** YYYY-MM-DD · **Statut :** 💭 Proposé · **Phase :** X
- **Contexte :** quel problème, quelles contraintes (perf, coût, sécurité, délai)
- **Options envisagées :**
  1. Option A — ✅ avantages / ❌ inconvénients
  2. Option B — ✅ / ❌
- **Décision :** option retenue
- **Pourquoi :** argument décisif
- **Conséquences :** ce que ça implique (positif et négatif), ce qu'il faudra surveiller
- **Réversibilité :** facile / moyenne / difficile — comment revenir en arrière
======================================= -->

### ADR-001 — Stack de base Next.js + Supabase confirmée
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté · **Phase :** 0
- **Contexte :** PWA mobile, temps réel, auth sociale, budget infra ≈ 0 € en phase test.
- **Options envisagées :** 1. Next.js + Supabase — ✅ SSR, Server Actions, Realtime/Auth/Storage intégrés, free tier ❌ couplage Supabase. 2. Next.js + Firebase — ✅ temps réel mature ❌ NoSQL peu adapté aux agrégats/stats et contraintes relationnelles. 3. Remix/SvelteKit — ✅ légers ❌ écosystème shadcn/Vercel moins direct.
- **Décision :** Option 1, ajouts : Zod, react-hook-form, PostGIS, Vitest, Playwright, pnpm.
- **Pourquoi :** contraintes relationnelles (cooldown, idempotence, immutabilité des logs) mieux garanties par PostgreSQL.
- **Conséquences :** régions Vercel et Supabase à aligner (UE) pour la latence.
- **Réversibilité :** difficile (cœur du projet).

### ADR-002 — Scanner : `@yudiel/react-qr-scanner` plutôt que `html5-qrcode`
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté — confirmé définitivement après le spike 0.3 (Session 3) · **Phase :** 0
- **Contexte :** budget < 3 s scan + validation, iOS Safari et Android Chrome.
- **Options envisagées :** 1. `html5-qrcode` — ✅ populaire ❌ peu maintenu, API impérative, UI imposée. 2. `@yudiel/react-qr-scanner` — ✅ composant React, basé sur l'API `BarcodeDetector` + polyfill WASM (ZXing) ❌ dépend du polyfill sur iOS. 3. `BarcodeDetector` natif + `zxing-wasm` maison — ✅ contrôle total ❌ plus de code à maintenir.
- **Décision :** Option 2 (`@yudiel/react-qr-scanner`) retenue définitivement ; `html5-qrcode` écarté et désinstallé.
- **Pourquoi :** décodage instantané dès l'entrée du QR dans le champ lors du spike 0.3, maintenance active et support natif de la pause/reprise du flux (`paused`) pour garder la caméra « chaude » entre deux clients.
- **Conséquences :** composant encapsulé dans `src/features/scanner/components/yudiel-qr-reader.tsx` et chargé dynamiquement (`ssr: false`).
- **Réversibilité :** facile (encapsulé dans `features/scanner`).

### ADR-003 — Connexion email par code OTP + Google ; Magic Link et Apple abandonnés
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1, cf. Q-007) · **Phase :** 3
- **Contexte :** sur iOS, une PWA installée et Safari ne partagent pas leur session : un Magic Link ouvert depuis l'app Mail connecte Safari, pas la PWA.
- **Options envisagées :** 1. Magic Link — ✅ 1 clic ❌ casse le flux en PWA installée. 2. Code OTP à 6 chiffres — ✅ fonctionne dans tout contexte ❌ saisie de 6 chiffres. 3. Les deux — ❌ complexité UX. 4. Apple Sign-In en plus — ✅ confort iOS ❌ 99 $/an, apport marginal pour une PWA.
- **Décision :** OTP email (6 chiffres) + Google OAuth uniquement. Apple Sign-In **abandonné définitivement** (Q-007), pas seulement reporté.
- **Pourquoi :** fiabilité en contexte PWA = Zéro Friction réel ; le couple OTP + Google couvre 100 % des utilisateurs.
- **Conséquences :** SMTP personnalisé nécessaire (le SMTP Supabase par défaut est très limité en débit).
- **Réversibilité :** facile.

### ADR-004 — Logique de scan atomique dans une fonction PostgreSQL (RPC)
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1) · **Phase :** 6
- **Contexte :** vérif rôle + cooldown + incrément + log doivent être cohérents même en cas de double-tap ou de 2 scans simultanés.
- **Options envisagées :** 1. Enchaîner les requêtes dans la Server Action — ❌ conditions de course, 4 allers-retours réseau. 2. Fonction PL/pgSQL appelée par la Server Action — ✅ transaction, `FOR UPDATE`, 1 aller-retour ❌ logique en SQL à tester (pgTAP).
- **Décision :** Option 2, avec clé d'idempotence `UNIQUE` et heure serveur `now()`. S'applique à `record_visit`, `redeem_reward` et `reverse_scan` (ADR-010).
- **Pourquoi :** seule option garantissant l'anti-doublon et la performance.
- **Réversibilité :** moyenne.

### ADR-005 — Le QR encode un `qr_token` opaque, pas le `user_id`
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1) · **Phase :** 2
- **Contexte :** le QR est visible et photographiable ; le `user_id` est une clé interne utilisée partout.
- **Options envisagées :** 1. `user_id` brut — ✅ simple ❌ non révocable, fuite d'identifiant interne. 2. `qr_token` aléatoire dédié + `short_code` 6 caractères — ✅ révocable/régénérable ❌ une colonne et un index de plus. 3. QR dynamique (TOTP) — ✅ anti-capture ❌ casse l'affichage hors-ligne.
- **Décision :** Option 2 (évolutif vers 3 si fraude constatée).
- **Réversibilité :** facile.

### ADR-006 — Rôles via table `restaurant_members` (multi-staff) + onboarding pro sur invitation
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1, cf. Q-003/Q-004/Q-011) · **Phase :** 2
- **Contexte :** les specs parlent du rôle `merchant` et de fraude « d'employé complaisant » ⇒ plusieurs comptes par restaurant et traçabilité par employé. Il faut empêcher qu'un tiers crée un compte au nom d'un restaurant.
- **Options envisagées :** 1. Colonne `role` sur `profiles` — ❌ un seul restaurant, risque d'auto-promotion si RLS mal faite. 2. Table `restaurant_members(user_id, restaurant_id, role: owner|staff)` — ✅ multi-staff, multi-établissements, un même compte peut être client ET pro. Onboarding : a) inscription pro libre — ❌ usurpation possible ; b) inscription libre + validation manuelle — ❌ friction et file d'attente ; c) invitation émise par un admin Fidly — ✅ contrôle à la source.
- **Décision :** Option 2 + table `platform_admins` pour le back-office Fidly. Onboarding c) : l'admin Fidly crée le restaurant et émet une invitation liée à un email ; le restaurateur crée **lui-même** son compte (OTP/Google) avec cet email et devient `owner`. Invitation à usage unique, à durée limitée (table `restaurant_invitations`). L'UI d'invitation des employés (`staff`) par l'owner est reportée en Post-MVP (Q-011), mais la table `restaurant_members` supporte `owner` et `staff` dès la Phase 2.
- **Réversibilité :** difficile une fois en production → décider avant Phase 2.

### ADR-007 — Géolocalisation : PostGIS + API Adresse (BAN)
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1, lancement France uniquement — Q-008) · **Phase :** 9
- **Contexte :** recherche par position ou adresse, rayon 100 m → 10 km.
- **Options envisagées :** 1. Calcul Haversine côté JS — ❌ ne passe pas à l'échelle. 2. PostGIS `geography` + `ST_DWithin` + index GIST — ✅ natif Supabase, performant. Géocodage : API Adresse data.gouv.fr (gratuite, sans clé, France) vs Google/Mapbox (payants).
- **Décision :** PostGIS + BAN.
- **Réversibilité :** moyenne (géocodeur interchangeable derrière une interface).

### ADR-008 — `.cursorrules` source unique, importé par `AGENTS.md`
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté · **Phase :** 0
- **Contexte :** l'utilisateur travaille avec des assistants IA différents (Cursor lit `.cursorrules`, Antigravity lit `AGENTS.md`).
- **Décision :** contenu dans `.cursorrules`, `AGENTS.md` l'importe via `@[...]`.
- **Pourquoi :** éviter deux versions divergentes des règles.
- **Réversibilité :** facile.

### ADR-009 — Progression : compteur cumulatif sur le cycle (`13/10 → 13/20`) + boucle sur le Palier 1
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1, cf. Q-001/Q-002/Q-005/Q-013) · **Phase :** 2 (schéma), 4 (affichage), 6 (RPC)
- **Contexte :** le porteur de projet veut un compteur **cumulatif sur l'ensemble des paliers du cycle** (ex. Palier 1 à 10, Palier 2 à 20), qui **continue de cumuler** quand une récompense est disponible (`13/10`), passe à `13/20` lors de la consommation de la récompense 1, et **repart en boucle sur le Palier 1** une fois le dernier palier consommé.
- **Options envisagées :**
  1. Remise à 0 à chaque palier (`13/10 → 3/10`) — ❌ ne reflète pas l'affichage cumulatif `13/20` souhaité par le porteur de projet.
  2. Stocker uniquement le total à vie sans état de palier — ❌ ne permet pas de savoir quelles récompenses ont déjà été réclamées quand le client dépasse le seuil (`13/10`).
  3. Compteur de cycle cumulatif `stamps` + palier courant `current_program_id` + compteur à vie `lifetime_visits` — ✅ affiche `13/10` puis `13/20`, gère le cumul sans plafond avant réclamation et la boucle en fin de cycle.
- **Décision :** Option 3. Règles (appliquées en base dans les RPC, reproduites en fonction pure `domain/` pour l'affichage) :
  - Les seuils `threshold` des paliers actifs d'un restaurant sont des **seuils cumulatifs croissants sur le cycle** (ex. Palier 1 : `threshold = 10`, Palier 2 : `threshold = 20` — ou additionnés cumulativement selon l'ordre `position`).
  - Passage : `stamps += 1`, `lifetime_visits += 1`, **aucun plafond**.
  - Récompense disponible ⇔ `stamps >= seuil_cumulatif(palier courant)`.
  - Consommation d'un palier **intermédiaire** (non dernier) : `stamps` **est conservé** (ex. `13`), `current_program_id` passe au palier actif suivant ⇒ l'affichage passe de `13 / 10` à `13 / 20` (la barre s'anime de 100 % vers `13 / 20`).
  - Consommation du **dernier palier** du cycle (ex. à `20 / 20`, ou `22 / 20` si surplus) : le cycle est terminé ⇒ `stamps -= seuil_cumulatif(dernier palier)` (soit `0/10`, ou `2/10` si surplus de 2 passages) et `current_program_id` repart sur le **1er palier** (boucle).
  - Modification d'un seuil par le restaurateur (Q-013) : appliquée immédiatement aux cartes en cours.
- **Pourquoi :** correspond exactement au modèle mental validé par le porteur (`0 → 10` pour la 1re récompense, `10 → 20` avec affichage `13/20` pour la 2e, puis boucle sur le Palier 1).
- **Conséquences :** tests unitaires `computeCardProgress` + pgTAP `redeem_reward` sur : `13/10 → 13/20`, fin de cycle `20/20 → 0/10` (et `22/20 → 2/10`), palier unique, modification de seuil en cours.
- **Réversibilité :** difficile une fois des cartes en production.

### ADR-010 — Annulation d'un scan par écriture compensatoire liée (`reverses_log_id`)
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1, cf. Q-006/Q-012) · **Phase :** 6 (RPC), 7 (affichage)
- **Contexte :** `scan_logs` est immuable (aucun UPDATE/DELETE), mais un scan erroné doit pouvoir être annulé ; le porteur souhaite voir la ligne annulée **barrée** dans les logs, toujours lisible.
- **Options envisagées :** 1. Supprimer/modifier le log — ❌ viole l'immutabilité et l'audit. 2. Colonne mutable `is_cancelled` — ❌ nécessite une policy UPDATE, rompt l'immutabilité. 3. Nouveau log `type = reversal` avec `reverses_log_id` (FK + `UNIQUE`) vers le log annulé, état de la carte restauré dans la même transaction — ✅ audit complet, annulation unique garantie par la base.
- **Décision :** Option 3 via une RPC `reverse_scan(log_id, idempotency_key)` (ADR-004). Droits (Q-012) :
  - **`owner`** : peut annuler toute opération de son restaurant.
  - **`staff`** : peut annuler uniquement **ses propres scans** (`staff_id = auth.uid()`) datant de **moins de 10 minutes** (`now() - created_at < interval '10 minutes'`).
  - Seule la dernière opération non annulée d'une carte peut être annulée (garantit la cohérence de `stamps` et `current_program_id`), et une annulation n'est pas elle-même annulable.
- **Conséquences :** l'UI `/pro/logs` barre toute ligne référencée par un `reversal` et affiche qui a annulé et quand.
- **Réversibilité :** facile (ajout de colonne nullable).

### ADR-011 — Environnement de dev DB : Projet Supabase Cloud « Dev » lié (`--linked`) sans Docker Desktop
- **Date :** 2026-10-20 · **Statut :** ✅ Accepté · **Phase :** 2
- **Contexte :** l'Étape 2.1 propose soit une pile Supabase locale (`supabase start` nécessitant Docker Desktop sous Windows/WSL2, lourd en RAM/disque), soit un projet Supabase Cloud dédié au développement lié via `supabase link`.
- **Options envisagées :**
  1. Pile locale `supabase start` via Docker Desktop — ✅ hors-ligne complet ❌ installation lourde sur le poste Windows, consommation RAM élevée.
  2. Projet Supabase Cloud « Dev » dédié + Supabase CLI en mode `--linked` (`db push --linked`, `db reset --linked`, `test db --linked`, `gen types --linked`) — ✅ zéro empreinte Docker locale, parité exacte avec l'infrastructure Cloud Supabase (Auth, Storage, PostGIS, Advisors), toutes les migrations restent 100 % versionnées dans `supabase/migrations/`.
- **Décision :** Option 2 (Supabase Cloud « Dev » lié via CLI).
- **Pourquoi :** évite l'installation de Docker Desktop tout en conservant l'intégralité du workflow versionné (`migrations/`, `seed.sql`, `tests/` pgTAP, génération de types) via le flag `--linked` de Supabase CLI v2.121.0.
- **Conséquences :** ne jamais lier le poste de dev au futur projet de production pour les commandes destructrices (`db:reset`).
- **Réversibilité :** immédiate (`supabase start` fonctionne sans modification des fichiers SQL si Docker est installé plus tard).

### ADR-012 — Journal `scan_logs` : traces d'audit anonymisables (RGPD)
- **Date :** 2026-10-22 · **Statut :** ✅ Accepté (demande du porteur de projet : le journal est un simple log, il ne doit pas aller contre le RGPD) · **Phase :** 2/3 (schéma), 6 (RPC), 11 (suppression de compte)
- **Contexte :** `scan_logs` est immuable (ADR-004/010) mais ses FK vers `loyalty_cards` (CASCADE) et `profiles` (RESTRICT) rendaient la suppression de compte impossible (employé) ou destructrice pour le journal (client). Le journal doit rester utile (stats, audit du restaurateur) sans conserver de donnée rattachable à une personne supprimée.
- **Options envisagées :**
  1. Supprimer les logs en cascade avec le compte — ✅ simple ❌ fausse les statistiques du restaurateur, casse la chaîne d'annulation (`reverses_log_id`).
  2. Conserver les logs avec l'identifiant du client — ❌ donnée personnelle conservée, contraire à l'effacement RGPD.
  3. Anonymiser : `card_id` et `staff_id` passent à `NULL` (`ON DELETE SET NULL`), le log garde type, delta, programme, restaurant, date — ✅ plus aucun lien avec une personne, stats et audit préservés.
- **Décision :** Option 3. `scan_logs.restaurant_id` est ajouté (not null, FK composite `(card_id, restaurant_id)` → cohérence garantie par la base ; `ON DELETE SET NULL (card_id)` n'annule que la carte). Le trigger d'immutabilité n'accepte que le passage à `NULL` de `card_id`/`staff_id` ; toute autre modification reste refusée.
- **Pourquoi :** respecte l'effacement RGPD sans perdre l'audit ; `restaurant_id` évite une jointure pour `/pro/logs` et `/pro/stats` et permet l'index `(restaurant_id, created_at)`.
- **Conséquences :** un log anonymisé n'est plus visible du client (il n'en a plus) mais reste visible du personnel du restaurant. Les RPC de la Phase 6 doivent renseigner `restaurant_id`. Le nom du client affiché dans les logs doit être lu via la carte (jointure `NULL`-safe).
- **Réversibilité :** moyenne (migration inverse + re-remplissage impossible pour les logs déjà anonymisés).

### ADR-013 — `qr_token` : 20 caractères base32 majuscules
- **Date :** 2026-10-22 · **Statut :** ✅ Accepté · **Phase :** 2 (schéma), 4 (affichage)
- **Contexte :** le jeton initial faisait 48 caractères hexadécimaux, donnant un QR dense (version ≥ 4), plus lent à décoder alors que le scan doit tenir en < 3 s (budget P6). La roadmap vise 16–22 caractères.
- **Options envisagées :**
  1. Hexadécimal 48 car. (192 bits) — ✅ simple ❌ QR dense.
  2. Base64url 22 car. (128 bits) — ✅ compact ❌ mixte majuscules/minuscules → mode octet du QR, moins efficace.
  3. Base32 majuscule 20 car. (100 bits) — ✅ mode alphanumérique du QR : tient en version 1 niveau M (21×21 modules), modules plus gros donc décodage plus rapide ❌ 100 bits au lieu de 128.
- **Décision :** Option 3 ; format imposé par `CHECK (qr_token ~ '^[A-Z2-7]{20}$')`, jetons existants régénérés (aucun QR distribué).
- **Pourquoi :** 100 bits restent infaisables à deviner (2^100) ; le gain de lisibilité et de vitesse sert la contrainte produit n°1. Le rate limiting de la Phase 11 couvre le reste.
- **Conséquences :** le QR doit encoder le jeton seul (pas d'URL préfixée, sinon repassage en mode octet).
- **Réversibilité :** facile (régénération des jetons).

### ADR-014 — `profiles` : droits `UPDATE` par colonne
- **Date :** 2026-10-22 · **Statut :** ✅ Accepté · **Phase :** 3
- **Contexte :** la policy `profiles_update_own` filtre les lignes, pas les colonnes : un client pouvait modifier `signup_restaurant_id` (attribution ROI, Phase 10).
- **Options envisagées :**
  1. Étendre le trigger `protect_profile_columns` — ✅ message explicite ❌ liste noire à maintenir à chaque nouvelle colonne.
  2. `REVOKE UPDATE` puis `GRANT UPDATE (display_name)` — ✅ liste blanche, refus natif `42501`, toute nouvelle colonne est protégée par défaut.
- **Décision :** Option 2 ; le trigger est conservé en défense en profondeur.
- **Conséquences :** toute future colonne éditable par l'utilisateur doit être ajoutée explicitement au `GRANT`.
- **Réversibilité :** immédiate.


### ADR-015 — Recadrage d'image : `react-easy-crop`
- **Date :** 2026-10-23 · **Statut :** ✅ Accepté · **Phase :** 5 (étape 5.3)
- **Contexte :** le gérant doit cadrer son logo et sa couverture (cadre en pointillés, déplacement, zoom) avant l'envoi, depuis un téléphone.
- **Options envisagées :**
  1. Code maison (pointer events + canvas) — ✅ aucune dépendance ❌ zoom à deux doigts, limites de déplacement et clavier à réécrire et à tester sur appareils.
  2. `react-easy-crop` 6.2.4 — ✅ glissement, pincement, molette, clavier ; MIT ; publiée le 2026-10-06 ; peer `react >=16.4` ; une seule dépendance (`normalize-wheel`) ; ~10 Ko gzip ❌ une dépendance de plus.
- **Décision :** Option 2. Seul l'écran de cadrage (chargé à la sélection d'un fichier) l'utilise ; la géométrie (arrondi, bornes, taille de sortie) reste en fonctions pures testées (`domain/crop-geometry.ts`) et le serveur re-valide tout (format réel, taille, owner).
- **Conséquences :** le cadre en pointillés passe par `style.cropAreaStyle` (seule API de la librairie, seul usage de style inline justifié) ; logo carré (affiché rond ou arrondi selon l'écran), couverture 16:9.
- **Réversibilité :** facile (un seul composant à remplacer).


### ADR-016 — Programmes de fidélité : écriture par RPC, règles de paliers, `@dnd-kit`
- **Date :** 2026-10-23 · **Statut :** ✅ Accepté · **Phase :** 5 (étape 5.4)
- **Contexte :** les seuils sont cumulatifs (ADR-009) et l'ordre des paliers est défini ; réordonner, éditer ou retirer un palier touche aux cartes en cours (Q-013), aux logs (FK `RESTRICT`) et à `UNIQUE(restaurant_id, position)`.
- **Règles tranchées avec le porteur de projet :** seuils des paliers actifs **strictement croissants** (refusé sinon) ; **5 paliers actifs maximum** ; désactiver le dernier palier actif reste **permis** (les cartes affichent « programme indisponible » jusqu'à un nouveau palier) ; au réordonnancement les **seuils restent sur les places** (le palier remonté prend le seuil de sa nouvelle place).
- **Options envisagées pour l'écriture :**
  1. Policies INSERT/UPDATE/DELETE directes — ✅ simple ❌ impossible d'imposer les règles inter-lignes, de basculer les cartes, ni de réordonner sans violation transitoire de `UNIQUE`.
  2. RPC uniquement (`create_`, `update_`, `set_…_active`, `reorder_loyalty_programs`), droits DML retirés — ✅ atomique, verrou du restaurant, règles appliquées par la base ❌ plus de SQL à tester.
- **Décision :** Option 2 (migration 10). Pas de suppression physique : désactivation (`is_active = false`).
- **Dépendance :** `@dnd-kit/core` 6.3.1, `sortable` 10.0.0, `utilities` 3.2.2 (MIT, peer React ≥ 16.8). Point de vigilance : dernières publications en décembre 2024 (la nouvelle génération `@dnd-kit/react` est encore en 0.x). Retenue car stable, très utilisée et prévue par la roadmap.
- **Réversibilité :** repli possible par des boutons monter/descendre (même RPC `reorder_loyalty_programs`), sans toucher à la base.


### ADR-017 — Feature partagée `media` (cadrage, compression, stockage des images)
- **Date :** 2026-10-23 · **Statut :** ✅ Accepté · **Phase :** 5 (étape 5.4)
- **Contexte :** logo et couverture (5.3) utilisaient du code d'image rangé dans `restaurants` ; l'image de récompense des paliers (5.4) en a besoin aussi. Un import profond d'une feature dans l'autre est interdit (`.cursorrules` §2), et `programs` dépend déjà de `restaurants`.
- **Options envisagées :**
  1. `programs` importe le code d'image de `restaurants` — ✅ rapide ❌ `restaurants` devient le propriétaire d'un code générique ; risque de dépendance circulaire.
  2. Dupliquer — ❌ interdit (> 5 lignes identiques).
  3. Feature `media` : cadrage (`react-easy-crop`), compression, détection du vrai format, chemins `<restaurant_id>/<kind>-<uuid>.<ext>`, envoi/suppression Storage — ✅ une seule implémentation, dépendances à sens unique (`restaurants` et `programs` → `media`).
- **Décision :** Option 3 (`features/media/`, entrées `index.ts` côté client et `server.ts` côté serveur). Les actions restent dans chaque feature (rôle owner, champs Zod, colonne ou RPC à mettre à jour).
- **Conséquences :** `kind` ∈ `logo` · `cover` · `reward` ; seules `logo` et `cover` sont acceptées par l'action des restaurants (une image de récompense ne peut donc jamais écraser la couverture).
- **Réversibilité :** facile (déplacement de fichiers).


### ADR-018 — Back-office : session admin + RLS plutôt que client service role
- **Date :** 2026-10-23 · **Statut :** ✅ Accepté · **Phase :** 5 (étape 5.5)
- **Contexte :** `/admin` doit créer un restaurant, émettre des invitations et lister restaurants, gérants et invitations. La Session 16 prévoyait le client service role pour les actions d'administration.
- **Options envisagées :**
  1. Client service role (contourne la RLS) — ✅ aucune limite ❌ une erreur de code donne un accès total ; interdit « dans le flux utilisateur standard » (`.cursorrules` §6).
  2. Session de l'admin + policies existantes (`restaurants_insert_admin`, `restaurant_invitations_insert_admin`, lectures admin, `restaurants_delete_admin`) — ✅ la base reste la dernière ligne de défense, aucun secret manipulé ❌ ne permet pas de modifier `is_active`, `subscription_status` ou `slug` (droits UPDATE retirés, migration 8).
- **Décision :** Option 2 pour la 5.5 (testée en pgTAP : un admin peut, un owner et un client ne peuvent pas). Le client service role n'est pas utilisé ; il ne le sera que si une action le exige (désactivation d'un restaurant, abonnement : Phase 11/12), avec un nouvel ADR.
- **Conséquences :** création du restaurant puis de l'invitation en deux écritures ; si la seconde échoue, le restaurant est supprimé (annulation compensatoire, policy DELETE admin). Le slug vient du nom (`slugify`), suffixé `-2`, `-3`… sur conflit d'unicité (code 23505).
- **Réversibilité :** immédiate.

### ADR-019 — Scan : RPC par restaurant actif, idempotence rejouable, horodatage `clock_timestamp()`
- **Date :** 2026-10-25 · **Statut :** ✅ Accepté · **Phase :** 6
- **Contexte :** un scan doit être atomique, sans doublon et sans fuite entre restaurants ; un owner peut gérer plusieurs restaurants et ne scanne que pour celui affiché.
- **Options envisagées :**
  1. Écritures directes depuis les Server Actions — ❌ non atomique, contourne les règles critiques en base.
  2. RPC `SECURITY DEFINER` recevant le restaurant actif, avec verrou de ligne sur la carte — ✅ règles appliquées en base (cooldown 2 h, seuils, droits d'annulation).
- **Décision :** Option 2. Détails : (a) chaque RPC reçoit `p_restaurant_id` et exige l'appartenance à CE restaurant ; (b) une clé d'idempotence déjà vue renvoie l'état courant avec `replayed = true` au lieu d'une erreur, et une clé réutilisée pour une autre carte ou un autre employé est refusée ; (c) la carte est créée par `record_visit` au premier passage, jamais par la simple recherche ; (d) `lookup_customer` ne renvoie aucune ligne pour un client inconnu et compte l'échec (10 par minute et par employé, sinon `rate_limited`) ; (e) les horodatages des logs et de `last_visit_at` utilisent `clock_timestamp()` pour que l'ordre des opérations d'une carte soit strict, même dans une transaction ; (f) `redeem_reward` et `reverse_scan` restaurent exactement l'état via `delta` et `program_id` du log ; seule la dernière opération non annulée d'une carte est annulable.
- **Conséquences :** un employé peut scanner son propre compte (Q-014) : la trace est dans les logs. Le rejeu renvoie l'état actuel de la carte, pas celui du moment du premier appel.
- **Réversibilité :** moyenne (les RPC sont l'API de la caisse).

### ADR-020 — Temps réel : événement = signal de relecture, journal lu par RPC paginée par curseur
- **Date :** 2026-10-26 · **Statut :** ✅ Accepté · **Phase :** 7
- **Contexte :** la jauge du client et le journal du restaurant doivent bouger en direct. Un événement `postgres_changes` ne porte que les colonnes brutes de la ligne (ni palier résolu, ni prénoms), et l'employé ne peut pas lire `profiles` (RLS).
- **Options envisagées :**
  1. Appliquer le contenu de l'événement à l'état local — ❌ duplique la résolution du palier et les noms côté navigateur, risque de divergence.
  2. Traiter l'événement comme un simple signal et relire l'état côté serveur (`router.refresh()` pour la jauge, Server Action pour la tête du journal) — ✅ une seule source de vérité, aucune règle dupliquée, resynchronisation au retour au premier plan et à la reconnexion réutilisant le même chemin.
- **Décision :** Option 2. Le journal est lu par la RPC `list_scan_logs` (membres du restaurant uniquement, prénoms résolus dans la fonction, curseur `(created_at, id)` avec la précision microseconde conservée en chaîne). La tête rafraîchie est fusionnée avec les pages déjà chargées (`mergeHeadEntries`). Abonnements toujours filtrés (`user_id=eq.` / `restaurant_id=eq.`) en plus de la RLS.
- **Conséquences :** un rafraîchissement par rafale d'événements (anti-rebond 200 ms) ; l'animation de la barre repose sur la transition CSS existante. Les événements perdus hors ligne sont rattrapés par la relecture à chaque reconnexion.
- **Réversibilité :** facile.

### ADR-021 — Temps réel : session transmise explicitement à Realtime avant l'abonnement
- **Date :** 2026-10-29 · **Statut :** ✅ Accepté · **Phase :** 7
- **Contexte :** en essai, la jauge du client ne bougeait pas : le canal indiquait `SUBSCRIBED` mais aucun événement n'arrivait. La table `realtime.subscription` montrait l'abonnement en rôle `anon` sans `sub` : le client navigateur rejoignait Realtime sans la session de l'utilisateur, donc la RLS (policies réservées à `authenticated`) masquait toutes les lignes, sans erreur.
- **Options envisagées :**
  1. Se fier au jeton que la bibliothèque transmet toute seule — ❌ constaté en `anon` avec la session stockée dans des cookies.
  2. Lire la session puis appeler `realtime.setAuth(jeton)` avant de rejoindre le canal — ✅ abonnement en rôle `authenticated`, RLS appliquée comme prévu.
  3. Relecture périodique en secours — ❌ masque la panne et alourdit le serveur ; la resynchronisation au retour de l'onglet reste le filet de sécurité (ADR-020).
- **Décision :** Option 2, dans `authorizeRealtime`, appelé par `useTableChanges` avant `openTableChannel`. `getSession` n'est utilisé ici que pour lire le jeton destiné à Realtime ; aucune décision d'autorisation n'en dépend (les policies de la base décident).
- **Conséquences :** sans session lisible, l'abonnement reste anonyme et aucun événement n'arrive (la page reste correcte grâce à la resynchronisation). Diagnostic à retenir : `select claims_role, claims->>'sub' from realtime.subscription;`.
- **Réversibilité :** facile.

### ADR-022 — Scan : RPC appelées directement depuis le navigateur plutôt que par Server Actions
- **Date :** 2026-11-01 · **Statut :** ✅ Accepté · **Phase :** 6 (écart à `.cursorrules` §3, « mutations via Server Actions »)
- **Contexte :** en enchaînant des scans, la recherche du client restait parfois bloquée jusqu'à l'actualisation. Next.js envoie les Server Actions une par une depuis le navigateur : une requête suspendue bloque toutes les suivantes, et un délai côté écran n'annule pas la requête. Chaque action enchaînait aussi 3 à 4 allers-retours vers Supabase (session, appartenance, RPC). La roadmap (Phase 6, vigilance « Région ») prévoyait l'appel direct depuis le navigateur si le budget de 3 s n'était pas tenu.
- **Options envisagées :**
  1. Garder les Server Actions avec un délai côté écran — ❌ la file reste bloquée derrière la requête suspendue.
  2. Route Handler — ✅ pas de file, mais conserve les allers-retours supplémentaires et la règle « Route Handlers réservés aux webhooks ».
  3. Appel direct des RPC `SECURITY DEFINER` depuis le client Supabase du navigateur — ✅ une seule requête, annulable (`AbortSignal`), sans file ; les contrôles sont dans la base (`auth.uid()`, appartenance au restaurant, limite de 10 recherches ratées par minute, idempotence, cooldown) et couverts par `scan_rpcs.test.sql`.
- **Décision :** Option 3 pour `lookup_customer`, `record_visit`, `redeem_reward`, `reverse_scan`. Les entrées restent validées par Zod côté navigateur (confort) et par les contrôles de format de la base (autorité). Le journal `/pro/logs` garde sa Server Action (lecture hors chemin critique).
- **Conséquences :** plus de garde « membre du restaurant » côté serveur pour le scan : la base fait foi (déjà le cas, la garde ne faisait que doubler la RPC). Les erreurs ne passent plus par le journal du serveur. Si un jour un contrôle devait sortir de la base, il faudrait revenir à un Route Handler.
- **Réversibilité :** facile.

### ADR-023 — Direction artistique en Phase 7 bis, avant la PWA (P8)
- **Date :** 2026-11-01 · **Statut :** ✅ Accepté · **Phase :** 7 bis (nouvelle)
- **Contexte :** aucune DA n'existe (tokens provisoires de shadcn). Le produit doit plaire aux clients comme aux restaurateurs. La P8 a besoin d'assets de marque (icônes, splash, `theme_color`) et les P9 et P10 créent de nouveaux écrans.
- **Options envisagées :**
  1. DA en fin de projet (P11) — ❌ refonte de tous les écrans, assets PWA à refaire, risque de régression tardif.
  2. DA en continu, écran par écran — ❌ incohérences, tokens changeants, retouches répétées.
  3. Phase dédiée juste après M1 et avant la P8 — ✅ la logique est stabilisée et testée (M1), les assets de la P8 sont définitifs, les P9 et P10 partent des bons tokens.
- **Décision :** Option 3. Phase 7 bis de 4 à 6 jours : brief, identité, tokens (`globals.css`), composants, maquettes validées avant code, application aux écrans existants, supports (email, chevalet, assets PWA). Habillage uniquement : aucun changement de règle métier ni de schéma.
- **Conséquences :** +4 à 6 jours sur le total MVP (39–51 jours) ; la P8 démarre après la validation de la DA ; les tokens deviennent la source unique de l'apparence.
- **Réversibilité :** facile (la phase peut être raccourcie à un simple re-thème si besoin).

### ADR-024 — Identité visuelle : vert forêt, logotype « tampon », couleur par carte
- **Date :** 2026-11-02 · **Statut :** ✅ Accepté · **Phase :** 7 bis
- **Contexte :** l'ADR-023 prévoit une DA avant la PWA. Il faut une identité visible de loin sur un comptoir, simple, avec une gamification adulte, adaptable à tous les commerces et sans signal communautaire, pour un budget inférieur à 1 000 €.
- **Options envisagées :**
  1. Jaune et noir « panneau de rue » — ❌ risque d'effet promo, nom large sur un petit sticker.
  2. Orange tomate avec tampon — ❌ proche d'enseignes de restauration et de Klook, se fond dans un commerce déjà rouge (le tampon est conservé).
  3. Vert avec épingle de carte — ❌ l'épingle évoque le GPS (le vert est conservé).
  4. Vert forêt `#0A5C3A`, logotype Bricolage Grotesque dont le « o » est un tampon, accent lime `#C8F25A` — ✅ lisible en 1 à 2 couleurs, contrastes AA, distinct des cartes de fidélité bleues ou rouges.
- **Décision :** Option 4. En plus : couleur de carte déduite de l'identifiant du commerce (6 couleurs, 2 tons chacune, sans changement de schéma) ; traits unitaires à la place de la barre de progression ; intro animée pendant le chargement de l'accueil ; glissements latéraux entre les étapes d'un parcours ; lime porté par un token `gain` distinct de `accent` (shadcn) ; pas de mode sombre ; phrases d'accroche des supports reportées. Détail dans `Documentation/05-DIRECTION-ARTISTIQUE.md`.
- **Conséquences :** `globals.css` à réécrire (source unique) ; deux familles de polices via `next/font` ; assets de marque dans `public/brand/` ; trois composants à créer ; aucune règle métier ni schéma modifié.
- **Réversibilité :** facile pour les couleurs et composants (tokens centralisés) ; moyenne pour le logotype une fois les supports imprimés.

### ADR-025 — Hors-ligne : service worker maison et page autonome plutôt que Serwist
- **Date :** 2026-11-11 · **Statut :** ✅ Accepté · **Phase :** 7 bis (lot 8), avance l'étape 8.2 · **Déroge à :** `04-ROADMAP.md` 8.2 (Serwist)
- **Contexte :** le QR client doit rester affichable sans réseau (`.cursorrules` §10). Tout le reste de l'app dépend du serveur (session Supabase, Server Components, Realtime) : mettre des pages en cache servirait des données périmées ou d'un autre compte, et une page de caisse hors-ligne n'a pas de sens. Contraintes : aucune dépendance de plus (§0), aucun cache périmé après un déploiement.
- **Options envisagées :**
  1. Serwist (prévu à la roadmap) — ✅ stratégies de cache toutes faites, précache généré ; ❌ dépendance et plugin de build, configuration à vérifier avec Next 16 (Turbopack), précache du shell que le produit ne veut pas.
  2. Cache complet du shell et des pages en *network-first* — ❌ risque de servir une page d'un autre compte sur un appareil partagé, complexité de l'invalidation des charges RSC.
  3. Worker maison de 79 lignes, deux entrées en cache seulement — ✅ aucune dépendance, surface minimale, tout le reste va au réseau sans passer par le worker ; ❌ pas de page hors-ligne pour les cartes ni les écrans pro.
- **Décision :** option 3. `public/sw.js` met en cache `/offline.html` (à l'installation) et les fichiers hachés `/_next/static/*` (cache d'abord), répond à une navigation en échec réseau par `/offline.html`, et ne s'occupe de rien d'autre. `public/offline.html` est autonome (styles et script en ligne) et lit `localStorage` : identité (`rezone.identity.v1`) et tracé du QR (`rezone.identity-qr.v1`, ajouté car aucune librairie QR n'est disponible dans la page). Versionnement : l'identifiant de build est passé en `?v=` sur l'URL du script, donc chaque déploiement installe un nouveau worker, un cache `rezone-<id>` neuf, et l'activation supprime les anciens. `/sw.js` est servi en `no-cache, no-store, must-revalidate` ; le proxy d'auth l'exclut, ainsi que `/offline.html` ; l'enregistrement se fait en production seulement.
- **Pourquoi :** le besoin produit est un QR affichable, pas une app hors-ligne ; deux entrées en cache l'obtiennent sans risque de donnée périmée ni dépendance.
- **Conséquences :** hors-ligne, seule la page de secours s'affiche (QR et code, bouton « Réessayer », rechargement au retour du réseau) ; la page ne contient aucun `innerHTML` (le tracé est validé par expression régulière puis posé en attribut) ; si une CSP est ajoutée un jour, le script en ligne de `offline.html` devra recevoir un hachage ou un nonce ; le tracé du QR est un jeton équivalent à celui déjà stocké, effacé à la déconnexion. À surveiller : durée de vie de `localStorage` sur iOS quand l'app n'est pas installée (à mesurer sur appareil), mise à jour du worker sur un second déploiement (non testée ici).
- **Réversibilité :** facile : supprimer `public/sw.js`, `public/offline.html` et le registrar ; un worker déjà installé se désinstalle en servant un `sw.js` qui appelle `registration.unregister()`.

---

## 🧾 Dette technique

| ID | Description | Raison du raccourci | Impact | Phase de remboursement | Statut |
|---|---|---|---|---|---|
| DT-001 | Suppression du dernier `owner` d'un restaurant : le restaurant reste sans propriétaire (aucun garde-fou) | Cas hors périmètre MVP | 🟠 Restaurant non administrable sans intervention admin | Phase 11 (suppression de compte) | ⏳ Ouverte |
| DT-002 | La suppression de compte n'est pas encore exposée (pas de Server Action ni d'UI) ; seul le comportement base est en place et testé | Livraison prévue en P11 | 🟠 Obligation RGPD à honorer avant le pilote | Phase 11 | ⏳ Ouverte |
| DT-003 | Tests de validation Phase 3 non exécutés : parcours par rôle (client/staff/admin) avec une vraie invitation, session persistante, cookie modifié, Google sur iPhone/Android et PWA, E2E de connexion OTP (Inbucket indisponible avec le projet Cloud) | Aucun contenu `/pro` ni PWA à valider avant les Phases 5 et 8 | 🟠 Régression d'accès non détectée | Phases 5 (rôles `/pro`), 8 (PWA) | ⏳ Ouverte — en grande partie remboursée (Session 37) : parcours par rôle, session persistante et Google validés à la main ; e2e OTP non applicable ; **reste le test du cookie/JWT modifié** |
| DT-004 | Le logo du restaurant n'est pas affiché sur les cartes (initiale seulement) : aucun upload n'existe avant l'étape 5.3, et `next/image` exige la configuration du domaine Storage | Logos inexistants avant la Phase 5 | 🟢 Cosmétique | Phase 5 (5.3) | ✔️ Remboursée (Session 17) |
| DT-005 | Lighthouse Performance de `/` à 86 sur build de production local (seuil de la roadmap : 90) ; mesure locale, sans CDN ni région Vercel | Écart jugé suffisant à ce stade par le porteur de projet | 🟢 Marge faible vis-à-vis de la contrainte produit n°1 | Phase 11 (11.4) : re-mesure sur Vercel ; analyser le bundle si < 90 | ⏳ Ouverte |
| DT-006 | Test chronomètre de la Phase 5 (un testeur non technique configure fiche + 2 paliers en < 5 min) non réalisé : il demande un vrai testeur | Pas de testeur disponible à ce stade | 🟢 L'ergonomie a été revue après retour du porteur de projet (Session 21) | Pilote (Phase 11.6) | ⏳ Ouverte |
| DT-007 | Aucun test E2E Playwright du scanner : le projet n'a pas de stratégie de comptes de test (connexion par OTP email ou Google) | Décision à prendre (comptes de test, session injectée) avant d'écrire le parcours | 🟠 Parcours critique du scan couvert seulement par pgTAP et tests unitaires | Phase 6 (avant le jalon M1) | ✔️ Remboursée (Session 37) : essais manuels sur appareil réel jugés suffisants par le porteur de projet |
| DT-008 | Resend est en mode test : les emails (codes de connexion à 6 chiffres) ne partent qu'à l'adresse du compte propriétaire, Supabase répond `500 unexpected_failure` pour toute autre adresse | Environnement de développement ; Google reste disponible pour se connecter | 🔴 Aucun client ni gérant d'une autre adresse ne peut se connecter par code | Phase 11 (avant le pilote) : acheter ou utiliser un nom de domaine, le vérifier dans Resend (SPF, DKIM), mettre l'expéditeur sur ce domaine | ⏳ Ouverte |
| DT-009 | Écrans « carte d'un commerce » et « Découvrir » et barre du bas absents de l'app (pas de route) : `LoyaltyHeroCard` et `CardBannerHeader` créés mais non montés ; chevalet QR imprimable (DA.7) non refait | Pas d'invention de routes dans une étape d'habillage | 🟢 Code non utilisé jusqu'à la route | Phase 9 (découverte) ou étape dédiée | ⏳ Ouverte |
| DT-010 | Hors-ligne limité à la page de secours (QR et code) : cartes, caisse et écrans pro ne s'affichent pas sans réseau ; comportement vérifié par Playwright seulement, pas en mode avion sur iPhone ni Android, ni la mise à jour du worker sur un second déploiement | Le besoin produit est le QR (ADR-025) ; pas d'appareil de test ni de second déploiement à ce stade | 🟢 Un client sans réseau voit son QR mais pas ses cartes | Phase 8 (8.4 indicateur hors-ligne et « dernière mise à jour ») | ✔️ Fermée (Session 37) : limite assumée (ADR-025), mode avion validé sur Android |
| DT-011 | Page d'aperçu `/login/da-preview` (cartes fictives, bannière et célébrations) livrée dans le build ; elle répond 404 sans `DA_PREVIEW=1` | L'accueil exige une session : sans elle, aucune animation ne pouvait être mesurée en navigateur (06-DA-ITERATION-2 §8) | 🟢 Un peu de code de test dans l'app, aucune donnée réelle, aucune garde de route modifiée | À retirer ou à garder quand les e2e connectés tourneront (DT-007) | ⏳ Ouverte |

---

## ❓ Questions ouvertes

| ID | Question | Recommandation Lead Tech | Décision du porteur de projet | Bloque | Statut |
|---|---|---|---|---|---|
| Q-001 | Chaînage des programmes : après la récompense du palier N, le compteur repart-il à 0 pour le palier N+1, ou est-il cumulatif ? | Remise à 0 (déduction des points du palier, cf. « -10 points ») | **Cumulatif sur le cycle** : `0→10` = objectif du palier 1, `10→20` = objectif du palier 2 (`13/10 → 13/20`) ⇒ ADR-009 | Phase 2 | ✅ Session 1 |
| Q-002 | Après le dernier palier : boucle sur le 1er programme ou fin ? | Boucle sur le 1er | **Boucle** sur le 1er palier (avec remise à zéro du cycle / report du surplus éventuel) ⇒ ADR-009 | Phase 2 | ✅ Session 1 |
| Q-003 | Un restaurant peut-il avoir plusieurs comptes employés ? | Oui (owner + staff) | **Oui** ⇒ ADR-006 | Phase 2 | ✅ Session 1 |
| Q-004 | Qui crée les comptes restaurateurs ? | Invitation par un admin Fidly (onboarding clé en main) | Le restaurateur crée **lui-même** son compte, sur **invitation** d'un admin Fidly (anti-usurpation) ⇒ ADR-006 | Phase 3 | ✅ Session 1 |
| Q-005 | Un client avec une récompense disponible peut-il continuer à cumuler des passages ? | Oui, plafonné au palier jusqu'à consommation (à valider) | **Oui, sans plafond** (ex. `13/10`) ; à la consommation du Palier 1, la barre s'anime vers `13/20` sur le Palier 2 ⇒ ADR-009 | Phase 2 | ✅ Session 1 |
| Q-006 | Comment annuler un scan erroné si les logs sont immuables ? | Écriture compensatoire `type = reversal` par l'owner | Ligne d'origine **barrée** dans les logs, toujours lisible ⇒ ADR-010 | Phase 6 | ✅ Session 1 |
| Q-007 | Apple Sign-In dès le lancement ? (99 $/an compte développeur) | Non, après le pilote | **Abandonné définitivement** : OTP email + Google suffisent ⇒ ADR-003 | Phase 3 | ✅ Session 1 |
| Q-008 | Zone de lancement France uniquement ? | Oui (permet l'API Adresse gratuite) | **Oui, France uniquement** ⇒ ADR-007 | Phase 9 | ✅ Session 1 |
| Q-009 | Le dépassement du cooldown 2 h : tout employé ou owner uniquement ? | Tout employé, mais tracé et visible dans les logs | **Tout employé**, tracé (`cooldown_overridden`, `staff_id`) et visible dans les logs | Phase 6 | ✅ Session 1 |
| Q-010 | Prénom obligatoire à l'inscription client ? | Oui (affiché au commerçant), nom de famille non collecté | **Oui, prénom ou pseudonyme** (`profiles.display_name`), nom de famille non collecté | Phase 3 | ✅ Session 1 |
| Q-011 | Qui invite les employés (`staff`) d'un restaurant ? | L'owner, depuis `/pro/settings` | **Reporté en Post-MVP (Phase 12)** quand le produit sera abouti (la table `restaurant_members` supporte déjà `owner`/`staff`) | Phase 12 | ✅ Session 1 |
| Q-012 | Annulation d'un scan : qui, quoi, jusqu'à quand ? | Owner : tout ; staff : ses propres scans < 15 min | **Owner = tout ; staff = ses propres scans < 10 min** ⇒ ADR-010 | Phase 6 | ✅ Session 1 |
| Q-013 | Modification d'un seuil en cours : que devient la carte ? | Appliquée immédiatement aux cartes en cours | **Oui, application immédiate** aux cartes en cours ⇒ ADR-009 | Phase 5 | ✅ Session 1 |
| Q-014 | Un employé peut-il créditer son propre compte ? | À trancher | **Oui**, autorisé ; la trace est dans les logs (`staff_id`) | Phase 6 | ✅ Session 23 |
| Q-015 | Un palier désactivé puis réactivé : que deviennent les cartes qui avaient basculé sur le palier suivant ? | Remettre sur le palier réactivé les cartes placées sur un palier plus loin dont les passages sont inférieurs à son seuil (une carte qui a vraiment consommé ce palier a toujours des passages au moins égaux à son seuil, ADR-009) | **Validée par le porteur** telle que proposée (Session 34) | Phase 7 bis | ✅ Session 34 |

