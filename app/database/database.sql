-- =============================================================================
-- SeniorLove — Migration PostgreSQL + Données de test
-- =============================================================================
-- Utilisation :
--   psql -U <utilisateur> -d <base_de_donnees> -f app/database/database.sql
--
-- Comptes de test (mot de passe : password)
--   marie.dupont@test.fr   — utilisatrice standard
--   jean.martin@test.fr    — utilisateur standard
--   francoise.petit@test.fr
--   pierre.bernard@test.fr
--   michele.lefebvre@test.fr
--   robert.dubois@test.fr
--   admin@seniorlove.fr    — administrateur
--
-- Hash bcrypt utilisé (10 rounds, mot de passe : "password") :
--   $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--
-- Pour générer un nouveau hash (12 rounds) :
--   node --input-type=module -e \
--     "import bcrypt from 'bcrypt'; console.log(await bcrypt.hash('MonMotDePasse', 12));"
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Suppression des tables (ordre inverse des dépendances FK)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS message              CASCADE;
DROP TABLE IF EXISTS notification         CASCADE;
DROP TABLE IF EXISTS user_photo           CASCADE;
DROP TABLE IF EXISTS user_affinity        CASCADE;
DROP TABLE IF EXISTS user_interest        CASCADE;
DROP TABLE IF EXISTS user_event           CASCADE;
DROP TABLE IF EXISTS user_contactrequest  CASCADE;
DROP TABLE IF EXISTS user_relationship    CASCADE;
DROP TABLE IF EXISTS comment              CASCADE;
DROP TABLE IF EXISTS event                CASCADE;
DROP TABLE IF EXISTS interest             CASCADE;
DROP TABLE IF EXISTS affinity             CASCADE;
DROP TABLE IF EXISTS "user"               CASCADE;

-- Type énuméré de la table notification (créé par Sequelize à l'origine)
DROP TYPE IF EXISTS enum_notification_type CASCADE;

-- -----------------------------------------------------------------------------
-- Tables de référence
-- -----------------------------------------------------------------------------

-- interest — timestamps: false dans Sequelize, donc pas de colonnes temporelles
CREATE TABLE interest (
  id   SERIAL      PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

-- affinity — paranoid: true → createdAt, updatedAt, deletedAt
CREATE TABLE affinity (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(20) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- Table principale
-- -----------------------------------------------------------------------------

-- user — paranoid: true → deletedAt (soft delete)
-- NB : "user" est un mot réservé PostgreSQL, on le quote
CREATE TABLE "user" (
  id            SERIAL      PRIMARY KEY,
  firstname     VARCHAR(40) NOT NULL,
  lastname      VARCHAR(40) NOT NULL,
  password      VARCHAR     NOT NULL,
  email         VARCHAR(40) NOT NULL UNIQUE,
  phone         VARCHAR(20) NOT NULL UNIQUE,
  city          VARCHAR(58) NOT NULL,
  date_of_birth      DATE,
  gender             VARCHAR(10),
  gender_preference  VARCHAR(10) CHECK (gender_preference IN ('homme', 'femme', 'tous')),
  bio                VARCHAR(255),
  administrator BOOLEAN     NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt"   TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- Événements & commentaires
-- -----------------------------------------------------------------------------

-- event — paranoid: true → deletedAt
CREATE TABLE event (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(70) NOT NULL,
  description TEXT        NOT NULL,
  city        VARCHAR(58) NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  adresse     VARCHAR(70),
  interest_id INTEGER     REFERENCES interest(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ
);

-- comment — paranoid: true → deletedAt
CREATE TABLE comment (
  id          SERIAL       PRIMARY KEY,
  contents    VARCHAR(255) NOT NULL,
  user_id     INTEGER      REFERENCES "user"(id),
  event_id    INTEGER      REFERENCES event(id),
  "createdAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- Tables de jonction (PK composite, pas de timestamps)
-- -----------------------------------------------------------------------------

CREATE TABLE user_event (
  user_id  INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES event(id)  ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);

CREATE TABLE user_interest (
  user_id     INTEGER NOT NULL REFERENCES "user"(id)    ON DELETE CASCADE,
  interest_id INTEGER NOT NULL REFERENCES interest(id)  ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE user_affinity (
  user_id     INTEGER NOT NULL REFERENCES "user"(id)   ON DELETE CASCADE,
  affinity_id INTEGER NOT NULL REFERENCES affinity(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, affinity_id)
);

-- -----------------------------------------------------------------------------
-- Relations entre utilisateurs
-- -----------------------------------------------------------------------------

-- user_relationship — paranoid: true → deletedAt
CREATE TABLE user_relationship (
  id          SERIAL      PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  contact_id  INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ
);

-- user_contactrequest — timestamps: true, pas de paranoid → createdAt + updatedAt uniquement
CREATE TABLE user_contactrequest (
  id           SERIAL      PRIMARY KEY,
  requester_id INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  requestee_id INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Messagerie, notifications et galerie photo
-- (ajoutées lors de la reprise 2026, avec l'intégration de Socket.io)
-- -----------------------------------------------------------------------------

-- message — conversation privée entre deux membres déjà en relation.
-- Le contrôle de la relation est effectué côté serveur avant tout enregistrement.
CREATE TABLE message (
  id           SERIAL      PRIMARY KEY,
  sender_id    INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  recipient_id INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content      TEXT        NOT NULL,
  read         BOOLEAN     DEFAULT false,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- notification — deux types seulement : demande reçue, et demande acceptée
CREATE TYPE enum_notification_type AS ENUM ('contact_request', 'contact_accepted');

CREATE TABLE notification (
  id           SERIAL                 PRIMARY KEY,
  recipient_id INTEGER                NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  sender_id    INTEGER                NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type         enum_notification_type NOT NULL,
  read         BOOLEAN                DEFAULT false,
  "createdAt"  TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

-- user_photo — galerie de photos d'un membre (l'avatar est porté par "user")
CREATE TABLE user_photo (
  id          SERIAL      PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  filename    VARCHAR     NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Données de test
-- =============================================================================

-- ─── Centres d'intérêt ───────────────────────────────────────────────────────
INSERT INTO interest (id, name) VALUES
  (1, 'Sport'),
  (2, 'Musique'),
  (3, 'Cuisine'),
  (4, 'Danse'),
  (5, 'Jardinage'),
  (6, 'Peinture'),
  (7, 'Lecture'),
  (8, 'Voyages');
SELECT setval('interest_id_seq', 8);

-- ─── Affinités ───────────────────────────────────────────────────────────────
INSERT INTO affinity (id, name) VALUES
  (1, 'Calme'),
  (2, 'Aventurier'),
  (3, 'Sociable'),
  (4, 'Créatif'),
  (5, 'Sportif'),
  (6, 'Romantique');
SELECT setval('affinity_id_seq', 6);

-- ─── Utilisateurs de test ────────────────────────────────────────────────────
-- Mot de passe : password
INSERT INTO "user" (id, firstname, lastname, password, email, phone, city, date_of_birth, gender, gender_preference, bio, administrator) VALUES
  (1, 'Marie', 'Dupont',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'marie.dupont@test.fr', '0601020304', 'Paris',
      '1956-03-14', 'femme', 'homme',
      'Passionnée de peinture et de voyages, j''aime rencontrer des gens curieux du monde.',
      false),

  (2, 'Jean', 'Martin',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'jean.martin@test.fr', '0602030405', 'Lyon',
      '1952-07-22', 'homme', 'femme',
      'Retraité, amateur de jazz et de bonne cuisine. Toujours partant pour une randonnée.',
      false),

  (3, 'Françoise', 'Petit',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'francoise.petit@test.fr', '0603040506', 'Bordeaux',
      '1959-11-05', 'femme', 'tous',
      'Jardinière passionnée et danseuse de valse le dimanche.',
      false),

  (4, 'Pierre', 'Bernard',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'pierre.bernard@test.fr', '0604050607', 'Toulouse',
      '1950-02-18', 'homme', 'tous',
      'Ancien professeur de lettres, grand lecteur et amoureux du théâtre.',
      false),

  (5, 'Michèle', 'Lefebvre',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'michele.lefebvre@test.fr', '0605060708', 'Nantes',
      '1957-08-30', 'femme', 'femme',
      'Sportive dans l''âme, je cours trois fois par semaine et adore la natation.',
      false),

  (6, 'Robert', 'Dubois',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'robert.dubois@test.fr', '0606070809', 'Marseille',
      '1948-12-01', 'homme', 'femme',
      'Marin à la retraite, je cuisine des spécialités méditerranéennes.',
      false),

  (7, 'Admin', 'SeniorLove',
      '$2b$12$y4xh4GqMCP0jrwYweY0AYut09xPn.G0Luubc0Hg2b0Ca2Gp8gGvti',
      'admin@seniorlove.fr', '0600000001', 'Paris',
      NULL, NULL, NULL, NULL,
      true);
SELECT setval('user_id_seq', 7);

-- ─── Événements ──────────────────────────────────────────────────────────────
INSERT INTO event (id, name, description, city, date, adresse, interest_id) VALUES
  (1,
   'Randonnée en forêt de Fontainebleau',
   'Balade conviviale de 12 km pour tous niveaux. Dénivelé faible, pique-nique partagé à mi-parcours.',
   'Paris', '2026-06-15 09:00:00+02',
   'Parking de la Croix du Grand Veneur', 1),

  (2,
   'Concert de jazz au Parc de la Tête d''Or',
   'Soirée jazz en plein air avec le quartet de Pierre Morel. Apportez votre plaid et vos encas.',
   'Lyon', '2026-06-28 19:30:00+02',
   'Parc de la Tête d''Or, Grande Prairie', 2),

  (3,
   'Atelier cuisine provençale',
   'Apprenez à préparer une bouillabaisse traditionnelle et des navettes marseillaises avec un chef local.',
   'Marseille', '2026-07-05 10:00:00+02',
   '12 rue de la Paix', 3),

  (4,
   'Soirée danse valse et tango',
   'Soirée dansante pour amateurs de danses de salon. Débutants bienvenus, animée par un professeur certifié.',
   'Bordeaux', '2026-07-12 18:00:00+02',
   'Salle des fêtes de Bordeaux-Mériadeck', 4),

  (5,
   'Exposition peinture : les seniors créent',
   'Vernissage d''une exposition collective organisée par et pour les adhérents passionnés de peinture.',
   'Paris', '2026-07-20 15:00:00+02',
   'Galerie du Marais, 8 rue des Francs-Bourgeois', 6);
SELECT setval('event_id_seq', 5);

-- ─── Inscriptions aux événements ─────────────────────────────────────────────
INSERT INTO user_event (user_id, event_id) VALUES
  (1, 1), (2, 1), (5, 1),   -- Randonnée : Marie, Jean, Michèle
  (2, 2), (4, 2),            -- Jazz       : Jean, Pierre
  (6, 3), (3, 3),            -- Cuisine    : Robert, Françoise
  (3, 4), (1, 4),            -- Danse      : Françoise, Marie
  (1, 5), (4, 5);            -- Peinture   : Marie, Pierre

-- ─── Centres d'intérêt des utilisateurs ──────────────────────────────────────
INSERT INTO user_interest (user_id, interest_id) VALUES
  (1, 6), (1, 8), (1, 4),   -- Marie     : Peinture, Voyages, Danse
  (2, 2), (2, 3), (2, 1),   -- Jean      : Musique, Cuisine, Sport
  (3, 5), (3, 4),            -- Françoise : Jardinage, Danse
  (4, 7), (4, 2),            -- Pierre    : Lecture, Musique
  (5, 1), (5, 3),            -- Michèle   : Sport, Cuisine
  (6, 3), (6, 1);            -- Robert    : Cuisine, Sport

-- ─── Affinités des utilisateurs ──────────────────────────────────────────────
INSERT INTO user_affinity (user_id, affinity_id) VALUES
  (1, 4), (1, 6),            -- Marie     : Créatif, Romantique
  (2, 3), (2, 2),            -- Jean      : Sociable, Aventurier
  (3, 1), (3, 6),            -- Françoise : Calme, Romantique
  (4, 4), (4, 1),            -- Pierre    : Créatif, Calme
  (5, 5), (5, 3),            -- Michèle   : Sportif, Sociable
  (6, 2), (6, 3);            -- Robert    : Aventurier, Sociable

-- ─── Commentaires ────────────────────────────────────────────────────────────
INSERT INTO comment (contents, user_id, event_id) VALUES
  ('Hâte d''y être, j''adore Fontainebleau !',               1, 1),
  ('Je prépare mon pique-nique avec des quiches lorraine.',   2, 1),
  ('Un jazz en plein air, rien de mieux pour l''été.',        2, 2),
  ('J''ai assisté à un concert ici l''an passé, magique !',   4, 2),
  ('La bouillabaisse de Marseille, un rêve !',                6, 3),
  ('Super initiative, j''apprends la recette authentique.',   3, 3),
  ('J''arrive avec mes chaussures de danse !',                3, 4),
  ('Je suis débutante mais très motivée.',                    1, 4);
SELECT setval('comment_id_seq', 8);

-- ─── Demandes de contact (en attente) ────────────────────────────────────────
INSERT INTO user_contactrequest (requester_id, requestee_id) VALUES
  (1, 2),   -- Marie  → Jean
  (3, 4),   -- Françoise → Pierre
  (5, 6),   -- Michèle → Robert
  (2, 5);   -- Jean → Michèle
SELECT setval('user_contactrequest_id_seq', 4);

-- ─── Relations établies (contacts acceptés) ──────────────────────────────────
INSERT INTO user_relationship (user_id, contact_id) VALUES
  (1, 3),   -- Marie est contact de Françoise
  (3, 1),   -- Françoise est contact de Marie
  (2, 6),   -- Jean est contact de Robert
  (6, 2);   -- Robert est contact de Jean
SELECT setval('user_relationship_id_seq', 4);

-- ─── Notifications liées aux demandes en attente ─────────────────────────────
INSERT INTO notification (recipient_id, sender_id, type, read) VALUES
  (2, 1, 'contact_request',  false),   -- Jean    <- Marie
  (4, 3, 'contact_request',  false),   -- Pierre  <- Françoise
  (6, 5, 'contact_request',  false),   -- Robert  <- Michèle
  (5, 2, 'contact_request',  false),   -- Michèle <- Jean
  (1, 3, 'contact_accepted', true);    -- Françoise a accepté Marie
SELECT setval('notification_id_seq', 5);

-- ─── Conversations entre membres déjà en relation ────────────────────────────
-- Marie (1) et Françoise (3)
INSERT INTO message (sender_id, recipient_id, content, read) VALUES
  (3, 1, 'Bonjour Marie, ravie que nous soyons en contact !',                 true),
  (1, 3, 'Bonjour Françoise ! Moi aussi. J''ai vu que vous aimiez la danse.', true),
  (3, 1, 'Oui, la valse surtout, tous les dimanches.',                        true),
  (1, 3, 'La soirée danse à Bordeaux vous tente ? Je m''y suis inscrite.',    false),
-- Jean (2) et Robert (6)
  (6, 2, 'Bonjour Jean, partant pour l''atelier cuisine à Marseille ?',       true),
  (2, 6, 'Avec plaisir Robert ! La bouillabaisse, c''est tentant.',           false);
SELECT setval('message_id_seq', 6);

COMMIT;
