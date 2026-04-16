-- T-003 : Schéma initial
-- Base : PostgreSQL 15

-- ENUMS
CREATE TYPE role_type AS ENUM ('ADMIN', 'ENSEIGNANT', 'APPRENANT');

CREATE TYPE statut_stage AS ENUM ('EN_COURS', 'TERMINE', 'VALIDE', 'REFUSE');

CREATE TYPE statut_rapport AS ENUM ('DEPOSE', 'EVALUE', 'VALIDE', 'REJETE');

CREATE TYPE role_jury AS ENUM ('PRESIDENT', 'EXAMINATEUR', 'RAPPORTEUR');

-- UTILISATEUR
CREATE TABLE utilisateur (
    id                 BIGSERIAL PRIMARY KEY,
    email              VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe       VARCHAR(255) NOT NULL,
    nom                VARCHAR(100) NOT NULL,
    prenom             VARCHAR(100) NOT NULL,
    role               role_type    NOT NULL,
    actif              BOOLEAN      NOT NULL DEFAULT TRUE,
    date_creation      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FILIERE / PROMOTION
CREATE TABLE filiere (
    id          BIGSERIAL PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE promotion (
    id           BIGSERIAL PRIMARY KEY,
    nom          VARCHAR(100) NOT NULL,
    annee_debut  INT NOT NULL,
    annee_fin    INT NOT NULL,
    filiere_id   BIGINT NOT NULL REFERENCES filiere(id) ON DELETE RESTRICT,
    CONSTRAINT uq_promotion UNIQUE (nom, annee_debut, filiere_id),
    CONSTRAINT ck_annee_promotion CHECK (annee_fin >= annee_debut)
);

-- SOUS-TABLES UTILISATEUR (héritage joined)
CREATE TABLE administrateur (
    id     BIGINT PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    niveau VARCHAR(50)
);

CREATE TABLE enseignant (
    id         BIGINT PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    specialite VARCHAR(100),
    grade      VARCHAR(50)
);

CREATE TABLE apprenant (
    id              BIGINT PRIMARY KEY REFERENCES utilisateur(id) ON DELETE CASCADE,
    numero_etudiant VARCHAR(50) UNIQUE,
    filiere_id      BIGINT REFERENCES filiere(id)   ON DELETE SET NULL,
    promotion_id    BIGINT REFERENCES promotion(id) ON DELETE SET NULL
);

-- MODULE + AFFECTATION ENSEIGNANT ↔ MODULE (M-M)
CREATE TABLE module (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    nom         VARCHAR(100) NOT NULL,
    description TEXT,
    nb_heures   INT
);

CREATE TABLE enseignant_module (
    enseignant_id    BIGINT NOT NULL REFERENCES enseignant(id) ON DELETE CASCADE,
    module_id        BIGINT NOT NULL REFERENCES module(id)     ON DELETE CASCADE,
    date_affectation DATE   NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (enseignant_id, module_id)
);

-- ENTREPRISE
CREATE TABLE entreprise (
    id                BIGSERIAL PRIMARY KEY,
    nom               VARCHAR(200) NOT NULL,
    siret             VARCHAR(20)  UNIQUE,
    adresse           TEXT,
    ville             VARCHAR(100),
    code_postal       VARCHAR(10),
    pays              VARCHAR(100) DEFAULT 'France',
    contact_nom       VARCHAR(100),
    contact_email     VARCHAR(255),
    contact_telephone VARCHAR(20),
    date_creation     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- STAGE
CREATE TABLE stage (
    id              BIGSERIAL PRIMARY KEY,
    titre           VARCHAR(200) NOT NULL,
    objectif        TEXT,
    date_debut      DATE         NOT NULL,
    date_fin        DATE         NOT NULL,
    duree_semaines  INT,
    statut          statut_stage NOT NULL DEFAULT 'EN_COURS',
    apprenant_id    BIGINT REFERENCES apprenant(id)  ON DELETE SET NULL,
    encadrant_id    BIGINT REFERENCES enseignant(id) ON DELETE SET NULL,
    entreprise_id   BIGINT REFERENCES entreprise(id) ON DELETE SET NULL,
    date_creation   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_dates_stage CHECK (date_fin >= date_debut)
);

-- RAPPORT (avec Stage)
CREATE TABLE rapport (
    id              BIGSERIAL PRIMARY KEY,
    stage_id        BIGINT       NOT NULL UNIQUE REFERENCES stage(id) ON DELETE CASCADE,
    chemin_fichier  VARCHAR(500) NOT NULL,
    nom_original    VARCHAR(255),
    taille_octets   BIGINT,
    date_depot      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note            NUMERIC(4,2),
    commentaire     TEXT,
    statut          statut_rapport NOT NULL DEFAULT 'DEPOSE',
    evaluateur_id   BIGINT REFERENCES enseignant(id) ON DELETE SET NULL,
    date_evaluation TIMESTAMP,
    CONSTRAINT ck_note_rapport CHECK (note IS NULL OR (note >= 0 AND note <= 20))
);

-- SOUTENANCE (avec Stage)
-- ---------------------------------------------------------
CREATE TABLE soutenance (
    id             BIGSERIAL PRIMARY KEY,
    stage_id       BIGINT    NOT NULL UNIQUE REFERENCES stage(id) ON DELETE CASCADE,
    date_heure     TIMESTAMP NOT NULL,
    salle          VARCHAR(50),
    duree_minutes  INT       DEFAULT 60,
    note           NUMERIC(4,2),
    commentaire    TEXT,
    CONSTRAINT ck_note_soutenance CHECK (note IS NULL OR (note >= 0 AND note <= 20))
);

-- ---------------------------------------------------------
-- JURY (avec Soutenance) + MEMBRES (Enseignant)
-- ---------------------------------------------------------
CREATE TABLE jury (
    id            BIGSERIAL PRIMARY KEY,
    soutenance_id BIGINT NOT NULL UNIQUE REFERENCES soutenance(id) ON DELETE CASCADE,
    president_id  BIGINT REFERENCES enseignant(id) ON DELETE SET NULL
);

CREATE TABLE jury_enseignant (
    jury_id       BIGINT    NOT NULL REFERENCES jury(id)       ON DELETE CASCADE,
    enseignant_id BIGINT    NOT NULL REFERENCES enseignant(id) ON DELETE CASCADE,
    role_membre   role_jury NOT NULL DEFAULT 'EXAMINATEUR',
    PRIMARY KEY (jury_id, enseignant_id)
);

-- SUIVI ACADÉMIQUE (notes par apprenant / module / semestre)
CREATE TABLE suivi_academique (
    id           BIGSERIAL PRIMARY KEY,
    apprenant_id BIGINT NOT NULL REFERENCES apprenant(id) ON DELETE CASCADE,
    module_id    BIGINT NOT NULL REFERENCES module(id)    ON DELETE CASCADE,
    semestre     INT    NOT NULL,
    annee        INT    NOT NULL,
    note         NUMERIC(4,2),
    appreciation TEXT,
    CONSTRAINT uq_suivi UNIQUE (apprenant_id, module_id, semestre, annee),
    CONSTRAINT ck_semestre CHECK (semestre IN (1, 2)),
    CONSTRAINT ck_note_suivi CHECK (note IS NULL OR (note >= 0 AND note <= 20))
);

-- INDEX
CREATE INDEX idx_utilisateur_role   ON utilisateur(role);
CREATE INDEX idx_stage_apprenant    ON stage(apprenant_id);
CREATE INDEX idx_stage_encadrant    ON stage(encadrant_id);
CREATE INDEX idx_stage_entreprise   ON stage(entreprise_id);
CREATE INDEX idx_stage_statut       ON stage(statut);
CREATE INDEX idx_rapport_statut     ON rapport(statut);
CREATE INDEX idx_apprenant_filiere  ON apprenant(filiere_id);
CREATE INDEX idx_apprenant_promo    ON apprenant(promotion_id);
