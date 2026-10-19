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

- **Phase en cours :** Phase 0 — Cadrage & levée des risques
- **Dernière session :** Session 0 (2026-10-19)
- **Prochaine action :** Répondre aux questions ouvertes Q-001 → Q-010, puis spike scanner (étape 0.2)
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
- [ ] Validation des ADR « Proposé » par le porteur de projet

**Prochaine étape** : Phase 0 — réponses aux questions ouvertes + spike scanner sur appareils réels.

---

## 🏛️ Registre des décisions d'architecture (ADR)

### Index
| ID | Titre | Statut | Date |
|---|---|---|---|
| ADR-001 | Stack de base Next.js + Supabase confirmée | ✅ Accepté | 2026-10-19 |
| ADR-002 | Scanner : `@yudiel/react-qr-scanner` plutôt que `html5-qrcode` | 💭 Proposé (spike 0.2) | 2026-10-19 |
| ADR-003 | Connexion email par code OTP plutôt que Magic Link | 💭 Proposé | 2026-10-19 |
| ADR-004 | Logique de scan atomique dans une fonction PostgreSQL (RPC) | 💭 Proposé | 2026-10-19 |
| ADR-005 | Le QR encode un `qr_token` opaque, pas le `user_id` | 💭 Proposé | 2026-10-19 |
| ADR-006 | Rôles via table `restaurant_members` (multi-staff) | 💭 Proposé | 2026-10-19 |
| ADR-007 | Géolocalisation : PostGIS + API Adresse (BAN) | 💭 Proposé | 2026-10-19 |
| ADR-008 | `.cursorrules` source unique, importé par `AGENTS.md` | ✅ Accepté | 2026-10-19 |

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
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé — à confirmer par le spike de l'étape 0.2 · **Phase :** 0
- **Contexte :** budget < 3 s scan + validation, iOS Safari et Android Chrome.
- **Options envisagées :** 1. `html5-qrcode` — ✅ populaire ❌ peu maintenu, API impérative, UI imposée. 2. `@yudiel/react-qr-scanner` — ✅ composant React, basé sur l'API `BarcodeDetector` + polyfill WASM (ZXing) ❌ dépend du polyfill sur iOS. 3. `BarcodeDetector` natif + `zxing-wasm` maison — ✅ contrôle total ❌ plus de code à maintenir.
- **Décision :** Option 2 par défaut, Option 3 en repli si latence insuffisante.
- **Pourquoi :** maintenance active et intégration React propre.
- **Conséquences :** mesurer le temps "ouverture caméra → décodage" sur 3 appareils réels.
- **Réversibilité :** facile (encapsulé dans `features/scanner`).

### ADR-003 — Connexion email par code OTP plutôt que Magic Link
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé · **Phase :** 3
- **Contexte :** sur iOS, une PWA installée et Safari ne partagent pas leur session : un Magic Link ouvert depuis l'app Mail connecte Safari, pas la PWA.
- **Options envisagées :** 1. Magic Link — ✅ 1 clic ❌ casse le flux en PWA installée. 2. Code OTP à 6 chiffres — ✅ fonctionne dans tout contexte ❌ saisie de 6 chiffres. 3. Les deux — ❌ complexité UX.
- **Décision :** OTP email + Google OAuth. Apple OAuth reporté (compte développeur Apple payant).
- **Pourquoi :** fiabilité en contexte PWA = Zéro Friction réel.
- **Conséquences :** SMTP personnalisé nécessaire (le SMTP Supabase par défaut est très limité en débit).
- **Réversibilité :** facile.

### ADR-004 — Logique de scan atomique dans une fonction PostgreSQL (RPC)
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé · **Phase :** 6
- **Contexte :** vérif rôle + cooldown + incrément + log doivent être cohérents même en cas de double-tap ou de 2 scans simultanés.
- **Options envisagées :** 1. Enchaîner les requêtes dans la Server Action — ❌ conditions de course, 4 allers-retours réseau. 2. Fonction PL/pgSQL appelée par la Server Action — ✅ transaction, `FOR UPDATE`, 1 aller-retour ❌ logique en SQL à tester (pgTAP).
- **Décision :** Option 2, avec clé d'idempotence `UNIQUE` et heure serveur `now()`.
- **Pourquoi :** seule option garantissant l'anti-doublon et la performance.
- **Réversibilité :** moyenne.

### ADR-005 — Le QR encode un `qr_token` opaque, pas le `user_id`
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé · **Phase :** 2
- **Contexte :** le QR est visible et photographiable ; le `user_id` est une clé interne utilisée partout.
- **Options envisagées :** 1. `user_id` brut — ✅ simple ❌ non révocable, fuite d'identifiant interne. 2. `qr_token` aléatoire dédié + `short_code` 6 caractères — ✅ révocable/régénérable ❌ une colonne et un index de plus. 3. QR dynamique (TOTP) — ✅ anti-capture ❌ casse l'affichage hors-ligne.
- **Décision :** Option 2 (évolutif vers 3 si fraude constatée).
- **Réversibilité :** facile.

### ADR-006 — Rôles via table `restaurant_members` (multi-staff)
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé (dépend de Q-003/Q-004) · **Phase :** 2
- **Contexte :** les specs parlent du rôle `merchant` et de fraude « d'employé complaisant » ⇒ plusieurs comptes par restaurant et traçabilité par employé.
- **Options envisagées :** 1. Colonne `role` sur `profiles` — ❌ un seul restaurant, risque d'auto-promotion si RLS mal faite. 2. Table `restaurant_members(user_id, restaurant_id, role: owner|staff)` — ✅ multi-staff, multi-établissements, un même compte peut être client ET pro.
- **Décision :** Option 2 + table `platform_admins` pour le back-office Fidly.
- **Réversibilité :** difficile une fois en production → décider avant Phase 2.

### ADR-007 — Géolocalisation : PostGIS + API Adresse (BAN)
- **Date :** 2026-10-19 · **Statut :** 💭 Proposé · **Phase :** 9
- **Contexte :** recherche par position ou adresse, rayon 100 m → 10 km.
- **Options envisagées :** 1. Calcul Haversine côté JS — ❌ ne passe pas à l'échelle. 2. PostGIS `geography` + `ST_DWithin` + index GIST — ✅ natif Supabase, performant. Géocodage : API Adresse data.gouv.fr (gratuite, sans clé, France) vs Google/Mapbox (payants).
- **Décision :** PostGIS + BAN (si lancement France uniquement, cf. Q-008).
- **Réversibilité :** moyenne (géocodeur interchangeable derrière une interface).

### ADR-008 — `.cursorrules` source unique, importé par `AGENTS.md`
- **Date :** 2026-10-19 · **Statut :** ✅ Accepté · **Phase :** 0
- **Contexte :** l'utilisateur travaille avec des assistants IA différents (Cursor lit `.cursorrules`, Antigravity lit `AGENTS.md`).
- **Décision :** contenu dans `.cursorrules`, `AGENTS.md` l'importe via `@[...]`.
- **Pourquoi :** éviter deux versions divergentes des règles.
- **Réversibilité :** facile.

---

## 🧾 Dette technique

| ID | Description | Raison du raccourci | Impact | Phase de remboursement | Statut |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## ❓ Questions ouvertes

| ID | Question | Recommandation Lead Tech | Bloque | Statut |
|---|---|---|---|---|
| Q-001 | Chaînage des programmes : après la récompense du palier N, le compteur repart-il à 0 pour le palier N+1, ou est-il cumulatif ? | Remise à 0 (déduction des points du palier, cf. « -10 points ») | Phase 2 | ⏳ |
| Q-002 | Après le dernier palier : boucle sur le 1er programme ou fin ? | Boucle sur le 1er | Phase 2 | ⏳ |
| Q-003 | Un restaurant peut-il avoir plusieurs comptes employés ? | Oui (owner + staff) | Phase 2 | ⏳ |
| Q-004 | Qui crée les comptes restaurateurs ? | Invitation par un admin Fidly (onboarding clé en main) | Phase 3 | ⏳ |
| Q-005 | Un client avec une récompense disponible peut-il continuer à cumuler des passages ? | Oui, plafonné au palier jusqu'à consommation (à valider) | Phase 2 | ⏳ |
| Q-006 | Comment annuler un scan erroné si les logs sont immuables ? | Écriture compensatoire `type = reversal` par l'owner | Phase 6 | ⏳ |
| Q-007 | Apple Sign-In dès le lancement ? (99 $/an compte développeur) | Non, après le pilote | Phase 3 | ⏳ |
| Q-008 | Zone de lancement France uniquement ? | Oui (permet l'API Adresse gratuite) | Phase 9 | ⏳ |
| Q-009 | Le dépassement du cooldown 2 h : tout employé ou owner uniquement ? | Tout employé, mais tracé et visible dans les logs | Phase 6 | ⏳ |
| Q-010 | Prénom obligatoire à l'inscription client ? | Oui (affiché au commerçant), nom de famille non collecté | Phase 3 | ⏳ |

