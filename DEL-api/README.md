# DEL-api

API centrale du projet DEL. Elle expose les données utilisées par `DEL-web` et `DEL-cms`.

## Installation

```bash
npm install
```

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner :

- `PORT=5000`
- `MONGODB_URI=<url MongoDB>`
- `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`

## Lancement

```bash
npm run dev
```

L'API doit être lancée avant les deux applications Next.js.

## Endpoints

- `GET /api/health`
- `POST /api/equipment`, `GET /api/equipment`, `GET /api/equipment/:id`, `PATCH /api/equipment/:id`, `PATCH /api/equipment/:id/status`, `DELETE /api/equipment/:id`
- `POST /api/requests`, `GET /api/requests`, `GET /api/requests/:id`, `PATCH /api/requests/:id`, `PATCH /api/requests/:id/status`, `DELETE /api/requests/:id`
- `POST /api/proposals`, `GET /api/proposals`, `GET /api/proposals/:id`, `PATCH /api/proposals/:id`, `PATCH /api/proposals/:id/status`, `DELETE /api/proposals/:id`

## Réponses JSON

Les listes retournent `{ "success": true, "count": 0, "data": [] }`.
Les détails et mutations retournent `{ "success": true, "data": {} }`.
Les erreurs retournent `{ "success": false, "message": "..." }`.

## Notes de test

1. Lancer MongoDB et `npm run dev`.
2. Vérifier `http://localhost:5000/api/health`.
3. Créer un engin depuis `DEL-web`, puis changer son statut depuis `DEL-cms`.
