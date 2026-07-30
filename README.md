# Senior Love

Application web de rencontres et de mise en relation dédiée aux seniors. Les utilisateurs peuvent se découvrir, participer à des événements locaux et nouer des contacts.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Template | EJS |
| Base de données | PostgreSQL + Sequelize |
| Style | SCSS → CSS |
| Temps réel | Socket.io (messagerie et notifications) |
| Sessions | express-session + connect-pg-simple (stockage en base) |
| Hash mots de passe | bcrypt |
| Validation | validator.js |
| Téléversement | multer (filtrage MIME, 5 Mo max) |

---

## Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm

---

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd Senior-Love

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.exemple .env
# Éditer .env avec vos valeurs

# 4. Créer la base de données et l'alimenter
psql -U <utilisateur> -d <base_de_donnees> -f app/database/database.sql

# 5. Lancer l'application
npm run dev
```

---

## Variables d'environnement

Fichier `.env` à créer à la racine (voir `.env.exemple`) :

```env
PORT=3000
DB_USER=senior
DB_PASSWORD=senior
DB_HOST=localhost
DB_NAME=senior
SECRET_POUR_EXPRESS_SESSION=<chaine_aleatoire_32_chars_minimum>
```

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur + compilation SCSS en parallèle (développement) |
| `npm run nodemon` | Serveur uniquement avec rechargement auto |
| `npm run sass` | Compilation SCSS uniquement (watch) |
| `npm run start` | Serveur en production (`node index.js`) |

---

## Structure du projet

```
Senior-Love/
├── index.js                  # Point d'entrée Express
├── app/
│   ├── router.js             # Toutes les routes
│   ├── controllers/          # Logique métier par domaine
│   │   ├── authController.js
│   │   ├── accountController.js
│   │   ├── eventController.js
│   │   ├── commentController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   └── mainController.js
│   ├── models/               # Modèles Sequelize
│   ├── views/                # Templates EJS
│   ├── middleware/
│   │   ├── identification.js # Garde de route (connecté / admin)
│   │   ├── addUserData.js    # Injection données utilisateur dans res.locals
│   │   └── handleAlerts.js  # Gestion des messages flash
│   └── database/
│       ├── database.js       # Connexion Sequelize
│       └── database.sql      # Migration + données de test
└── public/
    ├── css/                  # CSS compilé
    ├── scss/                 # Sources SCSS
    ├── js/                   # Scripts client
    └── img/                  # Images statiques
```

---

## Base de données

### Schéma

| Table | Description |
|-------|-------------|
| `user` | Utilisateurs (soft delete via `deletedAt`) |
| `event` | Événements locaux |
| `comment` | Commentaires sur les événements |
| `interest` | Centres d'intérêt (Sport, Cuisine, Danse…) |
| `affinity` | Affinités de personnalité (Calme, Aventurier…) |
| `user_event` | Inscriptions aux événements |
| `user_interest` | Centres d'intérêt par utilisateur |
| `user_affinity` | Affinités par utilisateur |
| `user_relationship` | Contacts acceptés |
| `user_contactrequest` | Demandes de contact en attente |
| `message` | Messages privés entre contacts (messagerie temps réel) |
| `notification` | Notifications (demande reçue / demande acceptée) |
| `user_photo` | Galerie de photos d'un membre |

> Soit **13 tables applicatives**, auxquelles s'ajoute la table `session` créée
> automatiquement par `connect-pg-simple` pour la persistance des sessions.

### Comptes de test

> Mot de passe universel : `password`

| Email | Rôle |
|-------|------|
| marie.dupont@test.fr | Utilisateur |
| jean.martin@test.fr | Utilisateur |
| francoise.petit@test.fr | Utilisateur |
| pierre.bernard@test.fr | Utilisateur |
| michele.lefebvre@test.fr | Utilisateur |
| robert.dubois@test.fr | Utilisateur |
| admin@seniorlove.fr | Administrateur |

---

## Fonctionnalités

- **Authentification** — inscription, connexion, déconnexion
- **Compte** — modification des informations, mot de passe, email, suppression du compte
- **Rencontres** — liste des membres, profils, envoi et gestion des demandes de contact
- **Événements** — liste, détail, participation, commentaires (ajout / modification / suppression)
- **FAQ & Assistance** — pages d'aide
- **Administration** — gestion des utilisateurs, événements, commentaires, centres d'intérêt et affinités

---

## Routes principales

| Méthode | Route | Accès |
|---------|-------|-------|
| GET | `/` | Public |
| GET/POST | `/inscription` | Non connecté |
| GET/POST | `/connexion` | Non connecté |
| GET | `/rencontre` | Connecté |
| GET | `/evenement` | Connecté |
| GET | `/compte` | Connecté |
| GET | `/messages` | Connecté |
| GET | `/messages/:contactId` | Connecté |
| GET | `/admin` | Admin |
| GET | `/faq` | Public |
| GET | `/assistance` | Public |
