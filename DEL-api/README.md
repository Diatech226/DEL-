# DEL-api

API Express.js autonome pour DEL, connectée à MongoDB via Mongoose.

## Installation

```bash
npm install
cp .env.example .env
```

## Variables d’environnement

- `PORT=5000`
- `NODE_ENV=development`
- `MONGODB_URI=` URL MongoDB locale ou Atlas.
- `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`

## Commandes

```bash
npm run dev
npm start
```

## Développement local

Lancer MongoDB, renseigner `MONGODB_URI`, puis démarrer l’API avec `npm run dev`.
La route santé est disponible sur `GET /api/health`.

## Build

Aucun build n’est nécessaire pour cette API Node.js. Utiliser `npm start` en production.

## Déploiement recommandé

Déployer sur Render avec MongoDB Atlas.
