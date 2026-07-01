# DEL-api

API REST Express.js + MongoDB de la plateforme DEL.

## Rôle

DEL-api centralise les données métier : utilisateurs, profils, équipements, demandes, appels d'offres, propositions, contrats, documents, factures, paiements, missions, maintenance, notifications, audit, exports, paramètres et rapports PDF.

## Stack

- Node.js / Express.js
- MongoDB / Mongoose
- JWT pour l'authentification
- Helmet, CORS, Morgan
- PDFKit pour les rapports PDF

## Installation

```bash
npm install
cp .env.example .env
```

## Variables d'environnement

Voir `.env.example` :

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
ADMIN_EMAILS=
```

`MONGODB_URI` est obligatoire en production. En développement, l'API peut démarrer sans MongoDB mais les routes utilisant les modèles ne seront pas exploitables correctement.

## Scripts

```bash
npm run dev
npm run start
npm run seed:admin
npm run seed:settings
```

## Routes principales

- `GET /api/health`
- `/api/auth` : register, login, me, logout placeholder
- `/api/me` : ressources utilisateur connectées
- `/api/equipment`
- `/api/requests`
- `/api/tenders`
- `/api/tender-lots`
- `/api/proposals`
- `/api/contracts`
- `/api/documents`
- `/api/invoices`
- `/api/payments`
- `/api/missions`
- `/api/mission-reports`
- `/api/maintenance`
- `/api/equipment-schedules`
- `/api/notifications`
- `/api/settings`
- `/api/audit-logs`
- `/api/exports`
- `/api/reports`
- `/api/users`, `/api/owner-profiles`, `/api/company-profiles`, `/api/technician-profiles`

## Modules disponibles

| Module | État |
| --- | --- |
| Auth | Présent, JWT, login/register/me |
| Users | Présent CRUD + statut admin |
| Owner/company/technician profiles | Présents, CRUD + validation admin |
| Equipment | Présent, CRUD + statut |
| Requests | Présent, CRUD, matching, création de proposition |
| Tenders / tender lots | Présents, lots et matching partiels |
| Tender submissions | Absent comme modèle dédié ; à formaliser |
| Proposals | Présent, décisions entreprise/propriétaires |
| Contracts | Présent, création depuis proposition |
| Documents | Présent, validation admin |
| Invoices | Présent, création depuis contrat |
| Payments | Présent, paiements manuels |
| Missions / mission reports | Présents |
| Maintenance | Présent |
| Planning | Présent via equipment schedules |
| Notifications | Présent, admin et utilisateur connecté |
| Conversations/messages | Absent comme modèle dédié |
| Scoring | Partiel via matching, pas de modèle scoring dédié |
| Reports PDF | Présent via `/api/reports/*/pdf` |
| Settings | Présent |
| Audit logs | Présent |
| Exports | Présent CSV/JSON |
| Health | Présent |

## Authentification et administration

- Le middleware `requireAuth` protège les routes connectées.
- Le middleware `requireAdmin` protège les routes d'administration.
- Les emails listés dans `ADMIN_EMAILS` peuvent être utilisés pour identifier les administrateurs selon la logique du projet.

## Seeds

```bash
npm run seed:admin
npm run seed:settings
```

Ces scripts initialisent respectivement un administrateur et les paramètres plateforme si les dépendances et MongoDB sont disponibles.

## Structure

```text
server.js
src/config/
src/controllers/
src/middlewares/
src/models/
src/routes/
src/utils/
scripts/
```

## Limites actuelles

- Pas encore de tests automatisés.
- Certaines routes sont publiques alors qu'elles devraient probablement être protégées ou limitées.
- Tender submissions, messages/conversations et scoring n'ont pas encore de modèle métier complet.
- L'audit, les exports et les PDF doivent être durcis pour une production réelle.

## Prochaines améliorations recommandées

1. Ajouter tests API sur health, auth et workflows critiques.
2. Clarifier les permissions par rôle pour chaque route.
3. Finaliser le workflow demande/appel d'offres → matching → proposition → contrat.
4. Ajouter pagination, recherche et filtres normalisés.
5. Renforcer validation Zod, erreurs métier et journalisation.
