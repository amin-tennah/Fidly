# Fidly — Architecture Logicielle & Flux Techniques

## 1. Stack Technique (cf. ADR-001 → ADR-007)
- **Framework Full-Stack :** Next.js (App Router, TypeScript strict)
- **UI & Style :** Tailwind CSS, shadcn/ui
- **Base de données :** PostgreSQL + PostGIS (Supabase)
- **Authentification :** Supabase Auth (Google OAuth + code OTP 6 chiffres par email — cf. ADR-003)
- **Temps Réel :** Supabase Realtime (WebSocket / PostgreSQL Replication)
- **QR Code :**
  - Génération client : `qrcode.react` (encode un `qr_token` opaque et révocable — cf. ADR-005)
  - Scanner caméra : `@yudiel/react-qr-scanner` (par défaut, à confirmer par le spike 0.3 — cf. ADR-002)
- **Géolocalisation :** PostGIS (`geography` + `ST_DWithin`) + API Adresse data.gouv.fr (BAN — cf. ADR-007)
- **Hébergement & CI/CD :** Vercel (région UE alignée sur Supabase, déploiement continu via Git)

## 2. Flux de Validation de Scan (Temps Réel — ADR-004)

### Diagramme de Séquence
```mermaid
sequenceDiagram
    autonumber
    actor Client as Téléphone Client
    actor Pro as Smartphone Restaurateur
    participant Action as Server Action Next.js
    participant DB as Supabase PostgreSQL (RPC)

    Client->>Pro: Affiche le QR code contenant qr_token
    Pro->>Action: lookupCustomer(qr_token, restaurant_id)
    Action->>DB: RPC lookup_customer (vérifie membre + état carte/cooldown)
    DB-->>Pro: Tiroir client (display_name, stamps / threshold, alerte cooldown)
    Pro->>Action: recordVisit(card_id, idempotency_key, force_cooldown)
    rect rgb(240, 240, 240)
        note over DB: Transaction atomique (FOR UPDATE)
        DB->>DB: 1. Vérification appartenance restaurant_members
        DB->>DB: 2. Vérification idempotence & cooldown (now() serveur)
        DB->>DB: 3. Incrémentation loyalty_cards (stamps +1, lifetime_visits +1)
        DB->>DB: 4. Insertion immuable dans scan_logs
    end
    par Retours synchrones et asynchrones
        DB-->>Client: Événement WebSocket (Supabase Realtime) -> Mise à jour jauge (+1)
        Action-->>Pro: ActionResult OK -> Son/vibration + confirmation visuelle
    end
```