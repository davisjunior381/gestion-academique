# 🎓 Plateforme de Gestion Académique et des Stages

Plateforme web permettant de centraliser la gestion des apprenants, enseignants, stages, rapports de stage et soutenances au sein d'un établissement d'enseignement supérieur.

## 📋 Fonctionnalités

- **Authentification** — Connexion sécurisée avec gestion des rôles (Admin, Enseignant, Apprenant)
- **Gestion des apprenants** — CRUD, affectation filière/promotion, suivi académique
- **Gestion des enseignants** — CRUD, affectation aux modules, encadrement de stages
- **Gestion des stages** — Création, affectation apprenant/encadrant, suivi d'état
- **Rapports de stage** — Dépôt PDF, évaluation, validation/rejet
- **Soutenances** — Planification, composition de jury, évaluation
- **Entreprises partenaires** — Référencement des lieux de stage

## 🏗️ Architecture technique

```
plateforme-gestion-academique/
├── backend/          # Spring Boot 3.x (Java 21)
├── frontend/         # React + Vite
├── docs/             # Documentation (UML, conception, présentation)
└── .github/          # Templates PR & issues
```

| Couche | Technologie |
|--------|-------------|
| Frontend | React, Vite, Axios |
| Backend | Spring Boot 3.x, Java 21, Spring Security (JWT) |
| ORM | Hibernate / JPA |
| Validation | spring-boot-starter-validation |
| Base de données | PostgreSQL |
| Documentation API | Swagger |

## ⚙️ Prérequis

- Java 21 (JDK)
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-org/plateforme-gestion-academique.git
cd plateforme-gestion-academique
```

### 2. Backend

```bash
cd backend
cp src/main/resources/application-example.properties src/main/resources/application.properties
# Modifier application.properties avec vos identifiants PostgreSQL
mvn clean install
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## 🌿 Stratégie de branches

| Branche | Rôle |
|---------|------|
| `main` | Production — code stable uniquement |
| `dev` | Intégration — fusion des features avant main |
| `feature/xxx` | Développement d'une fonctionnalité |
| `fix/xxx` | Correction d'un bug |

Workflow :
1. Créer une branche `feature/nom-fonctionnalite` depuis `develop`
2. Développer et commiter
3. Ouvrir une Pull Request vers `develop`
4. Review par au moins 1 membre de l'équipe
5. Merge après approbation

## 👥 Équipe

| Membre |
|--------|
|Davis |
| Zeineb |
| Manassé |


Projet académique - ESEO 2025-2026
