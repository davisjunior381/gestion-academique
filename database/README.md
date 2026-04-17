# Base de données — `gestion_academique`

Base PostgreSQL 15 du projet. Le schéma est généré automatiquement par Hibernate (`ddl-auto=update`) à partir des entités JPA.

## Configuration

| Paramètre | Valeur |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `gestion_academique` |
| User | `postgres` |
| Password | `postgres` |

Ces valeurs correspondent aux defaults de `application.properties`. Surchargeables via variables d'environnement `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

---

## Option 1 — Démarrage avec Docker (recommandé)

**Prérequis** : Docker Desktop installé.

```bash
# A la racine du repo
docker compose up -d
```

Le conteneur `sygle-postgres` démarre et crée la BD `gestion_academique`. Les tables sont ensuite créées automatiquement par Hibernate au lancement du backend.

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
# Créer la BD (une seule fois)
psql -U postgres -c "CREATE DATABASE gestion_academique;"
```

Les tables sont créées automatiquement par Hibernate au démarrage du backend (`ddl-auto=update`).

**Reset local** :
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS gestion_academique;"
psql -U postgres -c "CREATE DATABASE gestion_academique;"
```

---

## Schéma

Le schéma est géré par JPA/Hibernate. Voir les entités dans `backend/src/main/java/com/gestion_academique/backend/entity/`.

**14 entités** (héritage JOINED pour les utilisateurs) :

- **Utilisateurs** : `Utilisateur` (base) -> `Administrateur`, `Enseignant`, `Apprenant`
- **Structure académique** : `Filiere`, `Promotion`, `Module`, `SuiviAcademique`
- **Stages** : `Entreprise`, `Stage`, `RapportStage`
- **Soutenances** : `Soutenance`, `Jury`
- **Autres** : `Role`

**2 enums** : `StatutStage`, `StatutRapport`
