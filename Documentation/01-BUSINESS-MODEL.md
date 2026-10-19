# Fidly — Business Model & Stratégie Go-To-Market

## 1. Vision & Proposition de Valeur
**Fidly** est un portefeuille de fidélité web (PWA) hyper-local conçu autour du concept "Zéro Friction".
- **Pour le client :** Un seul QR code personnel pour tous les restaurants de son quartier/zone. Aucune carte papier à garder, aucune application lourde à télécharger en caisse, et une visibilité immédiate sur ses jauges de points.
- **Pour le restaurateur :** Un programme de fidélité digitalisé en 5 minutes, une validation en caisse en moins de 3 secondes, une augmentation de la fréquence de visite des habitués et un partage de visibilité avec les commerces voisins.

## 2. Modèle de Revenus (B2B SaaS)
1. **Abonnement Mensuel Restaurateur (Flux principal) :**
   - **Tarif cible :**  29 € à 49 € HT / mois par établissement (sans engagement, a terme quand on touchera plusieurs centaines de restaurants).
   - **Offre d'amorçage :** 3 premier mois 100 % gratuit pour prouver le retour sur investissement avec des statistiques concrètes (nombre de clients inscrits, nombre de retours générés).
2. **Mise en avant locale (Flux secondaire à moyen terme) :**
   - Option payante pour apparaître en tête de l'onglet "Découvrir le quartier" ou envoyer une notification d'offre ponctuelle (ex. heures creuses).
   - *Note : Exclusion de la publicité display tierce (AdSense, bannières) qui dégrade la rapidité en caisse et rapporte un CPM négligeable.*

## 3. Stratégie de Lancement (Contourner le problème de la poule et de l'œuf)
- **Ciblage Hyper-Local (Micro-zone fermée) :**
  - Ne pas lancer à l'échelle d'une ville entière. Cibler une seule rue commerçante, un pôle de restauration étudiant ou une zone de bureaux (4 à 6 restaurants indépendants proches).
- **Onboarding "Clé en main" :**
  - Le restaurateur n'a rien à imprimer : fournir le chevalet de comptoir plastifié (avec QR code d'inscription rapide pour les clients) et l'autocollant vitrine "Partenaire Fidly".
- **Indépendance financière des points (Multi-comptes cloisonnés) :**
  - 1 QR code unique par client, scanner par le restaurateur, incrémente le compteur vers la récompense pour le client en direct (animation visuel)

## 4. Prévisionnel des Coûts Cloud (Infrastructure Scalable)

### Phase 1 : Test
- Contexte : 1 à 5 restaurants, environ 500 utilisateurs
- Domaine : 1 € / mois
- Frontend & API (Vercel) : 0 € / mois
- Base de données & Auth (Supabase) : 0 € / mois
- Stockage images : 0 € / mois
- Total mensuel : 1 € / mois

### Phase 2 : Production
- Contexte : 10 à 30 restaurants, environ 5 000 utilisateurs
- Domaine : 1 € / mois
- Frontend & API (Vercel) : 0 à 20 € / mois
- Base de données & Auth (Supabase) : 25 € / mois
- Stockage images : 0 à 5 € / mois
- Total mensuel : 26 à 51 € / mois

### Phase 3 : Scale
- Contexte : 100+ restaurants, environ 50 000 utilisateurs
- Domaine : 1 € / mois
- Frontend & API (Vercel) : 20 € / mois
- Base de données & Auth (Supabase) : 50 à 100 € / mois
- Stockage images : 10 € / mois
- Total mensuel : 81 à 131 € / mois