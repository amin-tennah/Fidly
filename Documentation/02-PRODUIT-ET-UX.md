# Fidly — Spécifications Produit, UX/UI & Règles Métier

## 1. Philosophie "Zéro Friction"
Le passage en caisse aux heures de pointe (service du midi) est critique. L'intégralité de l'interaction (ouverture + scan + validation) doit prendre **moins de 5 secondes**.

---

## 2. Espace Client (Web Mobile / PWA)

### A. Onboarding & Authentification
- **Accès immédiat :** Pas de téléchargement sur App Store / Play Store. Le client scanne le chevalet en caisse qui ouvre l'URL de la PWA.
- **Connexion rapide :** Google Auth / Apple Auth en 1 tap, ou Magic Link / OTP par email.
- **Bannière PWA :** Proposition d'ajouter Fidly sur l'écran d'accueil du téléphone en 1 clic pour un accès hors-ligne/instantané.

### B. Écran Principal Client (`/`)
1. **Zone Hero (Haut d'écran fixe) :**
   - Affichage du **QR Code unique permanent** du client (encodant son `user_id` ou `qr_token`).
   - Prénom et code court de secours à 6 caractères (au cas où l'écran du client est cassé et illisible par la caméra).
2. **Section "Mes Cartes de Fidélité" :**
   - Liste des restaurants où le client a au moins 1 passage.
   - Pour chaque carte :
     - Logo, nom du restaurant, intitulé de la récompense (ex. *"1 dessert offert au 10e passage"*).
     - **Barre de progression animée** (ex. `6 / 10`).
     - **État "Récompense Débloquée" :** Quand le compteur atteint le palier (`10 / 10`), la carte passe en surbrillance verte avec un badge *"Récompense disponible en caisse !"*.
3. **Section "Découvrir le quartier" :**
   - Liste des autres restaurants partenaires de la zone géographique où le client n'est pas encore allé, affichant leur offre de bienvenue/fidélité.
   -doit fonctionner via soit une recherche par adresse soit par la position, et on doit pouvoir selectionner un affichage des restaurants partenaire à une certaine distance (curseur variable entre 100m et 10km par exemple)

---

## 3. Espace Restaurateur (`/pro`)

### A. Configuration de la fiche restaurant (`/pro/settings`)
Formulaire ultra-court (moins de 5 minutes) :
- Nom de l'enseigne, catégorie (Burger, Pizza, Boulangerie, etc.), adresse, horaires d'ouveture
- Upload du logo et d'une photo de couverture.
- **Paramétrage du programme :** peut en paramétrer autant que souhaiter dans un ordre qu'il peut défnir (terminer le premier objectif débloque le deuxième ect)
  - Type : Au passage (1 visite = 1 tampon).
  - Seuil requis (ex. `10` passages).
  - Description de la récompense (ex. *"1 Menu Midi offert"*).
  - Image de la récompense

### B. Interface Caisse / Scanner (`/pro`)
 Deux modes d'utilisation selon le matériel du commerçant :
1. **Mode Smartphone Serveur/Gérant :** A privilégier dans un premier temps
   - Bouton principal géant **"Scanner un client"** qui active la caméra arrière dans le navigateur (`html5-qrcode`).
2. **Mode Tablette Comptoir / Douchette :**
   - Écran laissé ouvert en caisse ou lecture directe par douchette code-barres USB/Bluetooth.

**Flux après le scan du QR client (< 3 secondes) :**
- Ouverture instantanée d'un tiroir (Bottom Sheet) affichant :
  - Prénom du client + Nombre de points actuels chez ce restaurateur (ex. `4 / 10`).
  - **Action principale :** Gros bouton **"Valider +1 passage"**.
  - **Action récompense (si palier atteint) :** Gros bouton vert **"Valider et déduire la récompense (-10 points)"**.

---

## 4. Règles Métier & Sécurité Anti-Fraude
1. **Scan inversé (Le commerçant scanne le client) :**
   - Le client ne peut jamais s'ajouter des points tout seul en prenant en photo un QR code fixe sur le comptoir. Seul un compte avec le rôle `merchant` authentifié peut déclencher l'incrémentation.
2. **Règle Anti-Doublon (Cooldown) :**
   - Un même client  peut  être crédité deux fois dans le même restaurant dans un intervalle inférieur à **2 heures** uniquement si le vendeur valide (une alerte est afficher pour le prévenir de la situation), évitant les doubles scans accidentels ou la fraude d'un employé complaisant.
3. **Log d'audit immuable :**
   - Chaque incrémentation ou consommation de récompense crée une entrée horodatée dans `scan_logs`.
   - le commenrçant à un onglet dédier au logs qui est mis a jours a chaque scan.