# Fidly — Spécifications Produit, UX/UI & Règles Métier

## 1. Philosophie "Zéro Friction"
Le passage en caisse aux heures de pointe (service du midi) est critique. L'intégralité de l'interaction (ouverture + scan + validation) doit prendre **moins de 5 secondes**.

---

## 2. Espace Client (Web Mobile / PWA)

### A. Onboarding & Authentification
- **Accès immédiat :** Pas de téléchargement sur App Store / Play Store. Le client scanne le chevalet en caisse qui ouvre l'URL de la PWA.
- **Connexion rapide :** Google Auth en 1 tap, ou code OTP à 6 chiffres par email (Magic Link et Apple Sign-In écartés, cf. ADR-003).
- **Onboarding minimal :** Saisie d'un prénom ou pseudonyme (`display_name`, cf. Q-010) ; nom de famille non collecté.
- **Bannière PWA :** Proposition d'ajouter Fidly sur l'écran d'accueil du téléphone en 1 clic pour un accès hors-ligne/instantané.

### B. Écran Principal Client (`/`)
1. **Zone Hero (Haut d'écran fixe) :**
   - Affichage du **QR Code unique permanent** du client (encodant son `qr_token` opaque et révocable, cf. ADR-005).
   - Prénom/pseudonyme (`display_name`) et code court de secours à 6 caractères (au cas où l'écran du client est cassé et illisible par la caméra).
2. **Section "Mes Cartes de Fidélité" :**
   - Liste des restaurants où le client a au moins 1 passage.
   - Pour chaque carte :
     - Logo, nom du restaurant, intitulé de la récompense du palier courant (ex. *"1 dessert offert au 10e passage"*).
     - **Barre de progression animée** (ex. `6 / 10`, ou `13 / 10` si cumul au-delà du seuil).
     - **État "Récompense Débloquée" :** Quand le compteur atteint ou dépasse le palier (`>= 10 / 10`), la carte passe en surbrillance verte avec un badge *"Récompense disponible en caisse !"*.
3. **Section "Découvrir le quartier" :**
   - Liste des autres restaurants partenaires de la zone géographique (France — API Adresse + PostGIS, cf. ADR-007) où le client n'est pas encore allé, affichant leur offre de bienvenue/fidélité.
   - Fonctionne via une recherche par adresse ou par la position, avec un curseur de rayon variable entre 100 m et 10 km.

---

## 3. Espace Restaurateur (`/pro`)

### A. Configuration de la fiche restaurant (`/pro/settings`)
Formulaire ultra-court (moins de 5 minutes) :
- Nom de l'enseigne, catégorie (Burger, Pizza, Boulangerie, etc.), adresse, horaires d'ouverture.
- Upload du logo et d'une photo de couverture.
- **Paramétrage des programmes :** peut en paramétrer autant que souhaité dans un ordre défini (terminer le 1er palier passe au 2e, et après le dernier palier la progression boucle sur le 1er — cf. §5 et ADR-009) :
  - Type : Au passage (1 visite = 1 tampon).
  - Seuil requis (ex. `10` passages).
  - Description de la récompense (ex. *"1 Menu Midi offert"*).
  - Image de la récompense.

### B. Interface Caisse / Scanner (`/pro`)
Deux modes d'utilisation selon le matériel du commerçant :
1. **Mode Smartphone Serveur/Gérant :** À privilégier dans un premier temps
   - Bouton principal géant **"Scanner un client"** qui active la caméra arrière dans le navigateur (`@yudiel/react-qr-scanner`, cf. ADR-002).
2. **Mode Tablette Comptoir / Douchette :**
   - Écran laissé ouvert en caisse ou lecture directe par douchette code-barres USB/Bluetooth.

**Flux après le scan du QR client (< 3 secondes) :**
- Ouverture instantanée d'un tiroir (Bottom Sheet) affichant :
  - Prénom/pseudo du client (`display_name`) + progression cumulative sur le palier courant (ex. `4 / 10`, `13 / 10` ou `13 / 20`).
  - **Action principale :** Gros bouton **"Valider +1 passage"** (toujours disponible, même si une récompense est déjà débloquée).
  - **Action récompense (si palier atteint) :** Gros bouton vert **"Valider la récompense (passage au palier suivant)"**.

---

## 4. Règles Métier & Sécurité Anti-Fraude
1. **Scan inversé (Le commerçant scanne le client) :**
   - Le client ne peut jamais s'ajouter des points tout seul en prenant en photo un QR code fixe sur le comptoir. Seul un membre authentifié du restaurant (`owner` ou `staff` dans `restaurant_members`, cf. ADR-006) peut déclencher l'incrémentation.
   - Onboarding restaurateur sur **invitation d'un admin Fidly** uniquement : le restaurateur crée lui-même son compte à partir de l'invitation afin d'empêcher toute usurpation d'enseigne (Q-004).
2. **Règle Anti-Doublon (Cooldown) :**
   - Un même client ne peut être crédité deux fois dans le même restaurant dans un intervalle inférieur à **2 heures** que si le vendeur confirme explicitement l'alerte affichée (autorisé pour tout employé mais tracé via `cooldown_overridden` et `staff_id`, cf. Q-009).
3. **Log d'audit immuable & annulation :**
   - Chaque incrémentation, consommation de récompense ou annulation crée une entrée horodatée dans `scan_logs` (aucune modification ni suppression).
   - Le commerçant dispose d'un onglet dédié aux logs mis à jour en temps réel.
   - En cas de scan erroné, l'annulation crée une écriture compensatoire (`type = reversal` : `owner` = tout, `staff` = ses propres scans < 10 min — Q-012) : la ligne d'origine reste visible mais apparaît **barrée** dans les logs (Q-006, ADR-010).

---

## 5. Règles de progression validées (Q-001, Q-002, Q-005, Q-013 — ADR-009)

- **Compteur cumulatif sur le cycle :** chaque passage incrémente `stamps` (+1 sur le cycle courant) et `lifetime_visits` (+1 à vie), sans plafond.
- **Cumul au-delà du palier (Q-005) :** un client qui n'utilise pas immédiatement sa récompense continue de cumuler (ex. `13 / 10`, récompense du Palier 1 disponible).
- **Consommation d'un palier intermédiaire et chaînage (Q-001) :** à la consommation de la récompense du Palier 1 (seuil `10`), la carte passe au Palier 2 (seuil cumulatif `20`) en conservant son compteur cumulé : l'affichage passe de `13 / 10` à `13 / 20` (la barre s'anime de 100 % vers `13 / 20`, soit 13 passages cumulés sur les 20 nécessaires pour les 2 paliers).
- **Fin de cycle et boucle (Q-002) :** lorsque le **dernier palier** configuré par le restaurateur est consommé (ex. à `20 / 20`, ou `22 / 20` si surplus), le cycle est bouclé : le total du cycle est déduit (`20 - 20 = 0`, ou `22 - 20 = 2`) et la carte repart sur le **Palier 1** (`0 / 10` ou `2 / 10`).
- **Exemple chiffré (2 paliers : Palier 1 à 10 passages « Dessert », Palier 2 à 20 passages « Menu ») :**
  - Passages 1 → 10 : `1/10 … 10/10` sur Palier 1 (récompense « Dessert » débloquée au 10e).
  - Le client fait 3 passages de plus sans réclamer son dessert : `13/10` sur Palier 1.
  - Il réclame son dessert en caisse : passage au Palier 2 ⇒ la jauge affiche **`13/20`** (« Menu »), soit 13 passages cumulés sur les 20 du cycle.
  - Après 7 nouveaux passages (`20/20` sur Palier 2) et consommation du « Menu » : fin du cycle ⇒ retour à **`0/10`** sur Palier 1 (boucle).