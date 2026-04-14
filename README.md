# Plateforme de Gestion Académique et des Stages

## Structure du projet
├── backend/        → Spring Boot 3 + Spring Security + JWT + JPA
├── frontend/       → React 18 + Vite + Tailwind CSS
├── database/       → Scripts SQL et migrations
└── docs/           → Diagrammes UML, rapport, slides

## Équipe
- Dev A : Auth + Apprenants + Entreprises
- Dev B : Enseignants + Soutenances + Rapports (front)
- Dev C : Stages + Rapports (back) + Architecture + Tests

## Lancer le projet

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Conventions
- Branches : `feature/T-XXX-description`
- Commits : `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- PR obligatoire vers develop avec 1 review minimum
