# DEL API

API REST Express, MongoDB et Mongoose pour DEL Dia Equipement et Logistique.

## Installation
```bash
cd dEL/DEL-api
npm install
cp .env.example .env
```

## Variables d'environnement
- `PORT`: port HTTP, par défaut `5000`.
- `MONGODB_URI`: URL MongoDB.
- `CORS_ORIGIN`: origines autorisées séparées par des virgules.

## Lancement
```bash
npm run dev
npm start
```

## Build
Aucun build n'est requis pour cette API Node.js.

## Déploiement recommandé
Déployer sur Render, Railway, Fly.io ou un VPS Node.js avec MongoDB Atlas.
