# Base de données — `gestion_academique`

Base PostgreSQL 15 du projet. Deux méthodes de démarrage : **Docker** (recommandée) ou **PostgreSQL local**.

## Configuration

| Paramètre | Valeur |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `gestion_academique` |
| User | `admin` |
| Password | `password` |

> ⚠️ Credentials de **dev uniquement**. À remplacer par des variables d'environnement en prod.

---

## Option 1 — Démarrage avec Docker (recommandé)

**Prérequis** : Docker Desktop installé.

```bash
# À la racine du repo
docker compose up -d
```

Le conteneur `sygle-postgres` démarre, crée la BD `gestion_academique` et exécute automatiquement tous les scripts du dossier `database/migrations/` (ordre alphabétique).

**Vérifier** :
```bash
docker compose ps
docker compose logs postgres
```

**Arrêter** :
```bash
docker compose down
```

**Reset complet** (supprime données + volume) :
```bash
docker compose down -v
docker compose up -d
```

---

## Option 2 — PostgreSQL local

**Prérequis** : PostgreSQL 15+ installé et démarré.

```bash
# 1. Créer la BD et l'utilisateur (une seule fois)
psql -U postgres -c "CREATE USER admin WITH PASSWORD 'password';"
psql -U postgres -c "CREATE DATABASE gestion_academique OWNER admin;"

# 2. Appliquer les migrations dans l'ordre
psql -U admin -d gestion_academique -f database/migrations/001_init_schema.sql
```

**Reset local** :
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS gestion_academique;"
psql -U postgres -c "CREATE DATABASE gestion_academique OWNER admin;"
psql -U admin -d gestion_academique -f database/migrations/001_init_schema.sql
```

---

## Schéma — vue d'ensemble

**13 tables** (héritage JOINED pour les utilisateurs) :

- **Utilisateurs** : `utilisateur` (base) → `administrateur`, `enseignant`, `apprenant`
- **Structure académique** : `filiere`, `promotion`, `module`, `enseignant_module`, `suivi_academique`
- **Stages** : `entreprise`, `stage`, `rapport`
- **Soutenances** : `soutenance`, `jury`, `jury_enseignant`

**4 enums** : `role_type`, `statut_stage`, `statut_rapport`, `role_jury`

Voir `migrations/001_init_schema.sql` pour le détail des contraintes, FK et index.

---

## Ajouter une migration

Convention : numérotation incrémentale, description courte en snake_case.

```
database/migrations/
├── 001_init_schema.sql       ← créé ici (T-003)
├── 002_seed_data.sql         ← à venir si besoin
└── 003_add_xxx.sql           ← évolutions futures
```

Les fichiers sont exécutés dans l'ordre alphabétique au premier démarrage Docker. Pour appliquer une migration après coup, la passer manuellement à `psql` (option 2 ci-dessus).

---

## Côté Spring Boot (T-002)

La config `backend/src/main/resources/application.yml` devra pointer sur cette BD avec `ddl-auto: validate` (pour que JPA vérifie que les entités correspondent au schéma SQL sans le modifier).
