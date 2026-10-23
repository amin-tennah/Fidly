# Fidly — Changelog & Registre des Décisions

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

- **Phase en cours :** Phase 5 (Espace restaurateur) — 5.1 → 5.4 ✅ (fusionnées dans `main`) · 5.5 🟡 sur `feat/phase-5-admin` (code prêt ; `db:test` et validation manuelle à faire)
- **Dernière session :** Session 22 (2026-10-23) — Phase 5.5 : back-office `/admin`
- **Prochaine action :** `pnpm db:test`, valider `/admin` à la main (création, invitation, chevalet), fusionner `feat/phase-5-admin` dans `main`, clore la Phase 5, puis Phase 6 (scanner)
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

### Session 22 — [2026-10-23] — Phase 5.5 : back-office `/admin`
**Roadmap :** Phase 5 — Étape 5.5 · **Statut :** 🟡 Partiel (code, lint, typecheck, tests unitaires et build verts ; `pnpm db:test` et validation manuelle à faire) · **Branche :** `feat/phase-5-admin` (créée depuis `main` après fusion de `feat/phase-5-pro-settings`)

**Réalisé**
- feat(5.5): `/admin` — formulaire « Nouveau restaurant » (nom, catégorie, email du gérant) qui crée le restaurant et l'invitation `owner` ; liste des restaurants avec gérants rattachés et invitations en attente (email, date d'expiration) ; « Inviter un gérant » pour une réinvitation ; « Chevalet (PNG) »
- feat: chevalet imprimable en PNG (A6 portrait, 300 dpi) composé dans le navigateur : nom du restaurant (taille ajustée à la largeur), QR de `<NEXT_PUBLIC_APP_URL>/?ref=<slug>` (niveau de correction Q, marge de 4 modules, agrandi d'un facteur entier sans lissage), légende et pied de page ; aucune dépendance ajoutée
- feat: garde `authorizePlatformAdmin` (session, puis ligne dans `platform_admins`, puis Zod) ; slug généré depuis le nom avec suffixe sur conflit ; annulation du restaurant si l'invitation échoue (ADR-018)
- refactor: constantes miroir de `restaurants` (catégories, longueur du nom, fuseau) déplacées dans `src/lib/restaurant-fields.ts`, partagées par `restaurants` et `admin`
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
- [ ] À la main avec un compte admin : créer un restaurant et son invitation, ouvrir `/invitation` avec l'email invité, accepter, atteindre `/pro` ; réinviter ; télécharger le chevalet, le scanner et lire l'URL ; un non-admin est redirigé hors de `/admin` — à faire

**Prochaine étape** : après validation, fusion de `feat/phase-5-admin` dans `main` et clôture de la Phase 5 ; puis Phase 6 (scanner).

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

---

## 🧾 Dette technique

| ID | Description | Raison du raccourci | Impact | Phase de remboursement | Statut |
|---|---|---|---|---|---|
| DT-001 | Suppression du dernier `owner` d'un restaurant : le restaurant reste sans propriétaire (aucun garde-fou) | Cas hors périmètre MVP | 🟠 Restaurant non administrable sans intervention admin | Phase 11 (suppression de compte) | ⏳ Ouverte |
| DT-002 | La suppression de compte n'est pas encore exposée (pas de Server Action ni d'UI) ; seul le comportement base est en place et testé | Livraison prévue en P11 | 🟠 Obligation RGPD à honorer avant le pilote | Phase 11 | ⏳ Ouverte |
| DT-003 | Tests de validation Phase 3 non exécutés : parcours par rôle (client/staff/admin) avec une vraie invitation, session persistante, cookie modifié, Google sur iPhone/Android et PWA, E2E de connexion OTP (Inbucket indisponible avec le projet Cloud) | Aucun contenu `/pro` ni PWA à valider avant les Phases 5 et 8 | 🟠 Régression d'accès non détectée | Phases 5 (rôles `/pro`), 8 (PWA) | ⏳ Ouverte |
| DT-004 | Le logo du restaurant n'est pas affiché sur les cartes (initiale seulement) : aucun upload n'existe avant l'étape 5.3, et `next/image` exige la configuration du domaine Storage | Logos inexistants avant la Phase 5 | 🟢 Cosmétique | Phase 5 (5.3) | ✔️ Remboursée (Session 17) |
| DT-005 | Lighthouse Performance de `/` à 86 sur build de production local (seuil de la roadmap : 90) ; mesure locale, sans CDN ni région Vercel | Écart jugé suffisant à ce stade par le porteur de projet | 🟢 Marge faible vis-à-vis de la contrainte produit n°1 | Phase 11 (11.4) : re-mesure sur Vercel ; analyser le bundle si < 90 | ⏳ Ouverte |
| DT-006 | Test chronomètre de la Phase 5 (un testeur non technique configure fiche + 2 paliers en < 5 min) non réalisé : il demande un vrai testeur | Pas de testeur disponible à ce stade | 🟢 L'ergonomie a été revue après retour du porteur de projet (Session 21) | Pilote (Phase 11.6) | ⏳ Ouverte |

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

