# DEL

DEL est une plateforme numérique pour le placement, la location, la vente et la gestion d’engins industriels destinés aux mines, au BTP, à la logistique et aux grands chantiers.

## Structure du projet

```text
DEL/
├── DEL-api
├── DEL-web
└── DEL-cms
```

Chaque application est autonome : aucun workspace obligatoire, aucun package partagé et aucune dépendance locale entre applications.

## Applications

- **DEL-api** : API Express.js connectée à MongoDB, exposant les ressources équipements, demandes, propositions et maintenance.
- **DEL-web** : site public et espace utilisateur.
- **DEL-cms** : back-office administrateur.

## Ports

| Application | Port | URL locale |
| --- | --- | --- |
| DEL-api | 5000 | http://localhost:5000 |
| DEL-web | 3000 | http://localhost:3000 |
| DEL-cms | 3001 | http://localhost:3001 |

## Variables d’environnement

Copier les fichiers `.env.example` de chaque application vers `.env` puis adapter les valeurs si nécessaire.

- `DEL-api/.env.example`
- `DEL-web/.env.example`
- `DEL-cms/.env.example`

## Lancer les applications

### API

```bash
cd DEL-api
npm install
npm run dev
```

### WEB

```bash
cd DEL-web
npm install
npm run dev
```

### CMS

```bash
cd DEL-cms
npm install
npm run dev -- -p 3001
```

## Vérifications locales

- API : http://localhost:5000/api/health
- Web : http://localhost:3000
- CMS : http://localhost:3001

## Déploiement recommandé

- **DEL-web** : Vercel.
- **DEL-cms** : Vercel.
- **DEL-api** : Render.
- **MongoDB** : MongoDB Atlas.
