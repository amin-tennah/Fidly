# Fidly — Architecture Logicielle & Flux Techniques

## 1. Stack Technique (non immuable, peut être modifier si d'autres solutions sont plus adapter au besoin)
- **Framework Full-Stack :** Next.js (App Router, TypeScript)
- **UI & Style :** Tailwind CSS, shadcn/ui
- **Base de données :** PostgreSQL (Supabase)
- **Authentification :** Supabase Auth (Google, Apple, Magic Link)
- **Temps Réel :** Supabase Realtime (WebSocket / PostgreSQL Replication)
- **QR Code :**
  - Génération client : `qrcode.react`
  - Scanner caméra : `html5-qrcode` ou `@yudiel/react-qr-scanner`
- **Hébergement & CI/CD :** Vercel (déploiement continu via Git)

## 2. Flux de Validation de Scan (Temps Réel)

### Diagramme de Séquence
```mermaid
sequenceDiagram
    autonumber
    actor Client as Téléphone Client
    actor Pro as Smartphone Restaurateur
    participant Server as Serveur Next.js / Supabase

    Client->>Pro: Affiche le QR code contenant user_id
    Pro->>Server: Server Action validateScan(user_id)
    rect rgb(240, 240, 240)
        note over Server: Vérifications & Écriture en DB
        Server->>Server: 1. Vérification du rôle restaurateur
        Server->>Server: 2. Vérification du cooldown anti-doublon
        Server->>Server: 3. Incrémentation de loyalty_cards (+1)
        Server->>Server: 4. Insertion du log dans scan_logs
    end
    par Retours synchrones et asynchrones
        Server-->>Client: Événement WebSocket (Supabase Realtime) -> Mise à jour jauge (+1)
        Server-->>Pro: Réponse HTTP OK -> Confirmation visuelle du scan
    end