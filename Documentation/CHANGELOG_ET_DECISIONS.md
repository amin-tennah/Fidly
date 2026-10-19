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

- **Phase en cours :** Phase 0 / Phase 1 — Cadrage terminé (0.1 ✅, 0.2 ✅, 1.1 ✅), prêt pour 0.3 (spike scanner) et Phase 1 (socle technique)
- **Dernière session :** Session 1 (2026-10-19)
- **Prochaine action :** Phase 1 — Étape 1.2 (initialisation Next.js + TS strict + outillage) / Étape 0.3 (spike scanner)
- **Bloquants :** Aucun (toutes les questions Q-001 → Q-013 sont tranchées)

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
| ADR-002 | Scanner : `@yudiel/react-qr-scanner` plutôt que `html5-qrcode` | ✅ Accepté (à confirmer par mesures spike 0.3) | 2026-10-19 |
| ADR-003 | Connexion email par code OTP + Google ; Magic Link et Apple abandonnés | ✅ Accepté | 2026-10-19 |
| ADR-004 | Logique de scan atomique dans une fonction PostgreSQL (RPC) | ✅ Accepté | 2026-10-19 |
| ADR-005 | Le QR encode un `qr_token` opaque, pas le `user_id` | ✅ Accepté | 2026-10-19 |
| ADR-006 | Rôles via table `restaurant_members` (multi-staff) + onboarding pro sur invitation | ✅ Accepté | 2026-10-19 |
| ADR-007 | Géolocalisation : PostGIS + API Adresse (BAN) | ✅ Accepté | 2026-10-19 |
| ADR-008 | `.cursorrules` source unique, importé par `AGENTS.md` | ✅ Accepté | 2026-10-19 |
| ADR-009 | Progression : compteur cumulatif sur le cycle (`13/10 → 13/20`) + boucle sur le Palier 1 | ✅ Accepté | 2026-10-19 |
| ADR-010 | Annulation d'un scan par écriture compensatoire liée (`reverses_log_id`) | ✅ Accepté | 2026-10-19 |

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
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté (Session 1) — mesures du spike 0.3 à consigner ici ; bascule sur l'Option 3 si objectif ≤ 1,3 s non tenu · **Phase :** 0
- **Contexte :** budget < 3 s scan + validation, iOS Safari et Android Chrome.
- **Options envisagées :** 1. `html5-qrcode` — ✅ populaire ❌ peu maintenu, API impérative, UI imposée. 2. `@yudiel/react-qr-scanner` — ✅ composant React, basé sur l'API `BarcodeDetector` + polyfill WASM (ZXing) ❌ dépend du polyfill sur iOS. 3. `BarcodeDetector` natif + `zxing-wasm` maison — ✅ contrôle total ❌ plus de code à maintenir.
- **Décision :** Option 2 par défaut, Option 3 en repli si latence insuffisante.
- **Pourquoi :** maintenance active et intégration React propre.
- **Conséquences :** mesurer le temps "ouverture caméra → décodage" sur 3 appareils réels.
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

---

## 🧾 Dette technique

| ID | Description | Raison du raccourci | Impact | Phase de remboursement | Statut |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

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

