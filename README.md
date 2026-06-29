# DEL

DEL est une plateforme numérique pour le placement, la location, la vente et la gestion d’engins industriels destinés aux mines, au BTP, à la logistique et aux grands chantiers.

## Applications

- **DEL-web** : site public et espace utilisateur. Les propriétaires déposent leurs engins et les entreprises publient leurs besoins.
- **DEL-cms** : back-office administrateur pour valider les engins, suivre les demandes et créer des propositions de matching.
- **DEL-api** : API Express.js connectée à MongoDB, exposant les ressources équipements, demandes et propositions.

## Ports

| Application | Port | URL locale |
| --- | --- | --- |
| DEL-api | 5000 | http://localhost:5000 |
| DEL-web | 3000 | http://localhost:3000 |
| DEL-cms | 3001 | http://localhost:3001 |

## Ordre de lancement recommandé

1. Lancer MongoDB localement ou configurer MongoDB Atlas.
2. Installer et lancer `DEL-api`.
3. Installer et lancer `DEL-web`.
4. Installer et lancer `DEL-cms`.

## Variables nécessaires

- `DEL-api/.env` : `PORT`, `NODE_ENV`, `MONGODB_URI`, `CORS_ORIGINS`.
- `DEL-web/.env` : `NEXT_PUBLIC_API_URL`.
- `DEL-cms/.env` : `NEXT_PUBLIC_API_URL`.

## Commandes rapides

```bash
cd DEL-api && npm install && npm run dev
cd DEL-web && npm install && npm run dev
cd DEL-cms && npm install && npm run dev
```

## Déploiement recommandé

- **DEL-web** : Vercel.
- **DEL-cms** : Vercel.
- **DEL-api** : Render.
- **MongoDB** : MongoDB Atlas.

Chaque application est autonome : aucun workspace obligatoire, aucun package partagé et aucune dépendance locale entre applications.
