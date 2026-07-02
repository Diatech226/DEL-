# DEL — Plateforme d'engins industriels

DEL est une plateforme numérique pour le placement, la location, la vente, le suivi, la gestion, la maintenance, la facturation et l'administration d'engins industriels destinés aux mines, au BTP, à la logistique et aux grands chantiers.

Le dépôt contient trois applications indépendantes. Il ne s'agit pas d'un workspace npm : chaque application conserve son propre `package.json`, ses dépendances et ses scripts.

## Architecture

```text
DEL/
├── DEL-api/   # Backend Express.js + MongoDB
├── DEL-web/   # Site public + espace utilisateur Next.js
├── DEL-cms/   # Back-office administrateur Next.js
├── docs/      # Continuité, audit technique et revue produit
├── package.json
├── README.md
└── .gitignore
```

## Rôle des applications

- **DEL-api** : API REST Express.js, persistance MongoDB/Mongoose, authentification JWT, modules métier, exports CSV et génération PDF.
- **DEL-web** : site public, authentification utilisateur, onboarding, dépôt d'engins, demandes d'engins, appels d'offres et tableaux de bord propriétaire/entreprise.
- **DEL-cms** : back-office administrateur pour piloter les équipements, demandes, profils, contrats, documents, factures, paiements, missions, maintenance, planning, paramètres, audit et exports.

## Prérequis

- Node.js récent compatible avec Next.js 15.
- npm.
- MongoDB local ou distant pour utiliser les fonctionnalités persistées de l'API.

## Installation

Depuis la racine :

```bash
npm install
npm run install:all
```

Installation séparée possible :

```bash
npm install --prefix DEL-api
npm install --prefix DEL-web
npm install --prefix DEL-cms
```

## Variables d'environnement

Copier les exemples puis compléter les valeurs locales :

```bash
cp DEL-api/.env.example DEL-api/.env
cp DEL-web/.env.example DEL-web/.env.local
cp DEL-cms/.env.example DEL-cms/.env.local
```

Variables principales :

- `DEL-api/.env.example` : `PORT`, `NODE_ENV`, `MONGODB_URI`, `CORS_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAILS`.
- `DEL-web/.env.example` : `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`.
- `DEL-cms/.env.example` : `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`.

Ne jamais commiter de vrais secrets dans les fichiers `.env`.

## Lancement simultané

```bash
npm run dev
```

Cette commande lance :

- API : <http://localhost:5000/api/health>
- Web : <http://localhost:3000>
- CMS : <http://localhost:3001>

## Lancement séparé

```bash
npm run dev:api
npm run dev:web
npm run dev:cms
```

Les scripts racine appellent les scripts de chaque app avec `--prefix`. Le CMS définit déjà son port avec `next dev -p 3001`, il ne faut donc pas ajouter un second `-p 3001` dans le script racine.

## Commandes de build et de vérification

```bash
npm run build:all
npm run build --prefix DEL-web
npm run build --prefix DEL-cms
```

L'API n'a pas de build. Vérifier son démarrage avec :

```bash
npm run dev --prefix DEL-api
curl http://localhost:5000/api/health
```

## Dépannage Windows EPERM sur `.next`

Si Next.js échoue avec une erreur `EPERM` sur `.next` :

1. arrêter tous les processus `next dev` ;
2. fermer les terminaux ou éditeurs qui verrouillent `.next` ;
3. supprimer le dossier `.next` de l'application concernée ;
4. relancer `npm run dev --prefix DEL-web` ou `npm run dev --prefix DEL-cms`.

## Dépannage Next.js workspace root warning

Chaque app Next possède son propre `next.config.js` avec `outputFileTracingRoot` et `turbopack.root` pointant vers son dossier. Si l'avertissement réapparaît, vérifier qu'aucun second fichier `next.config.*` n'existe dans la même app et que le script est lancé depuis le bon dossier ou via `--prefix`.

## Ordre recommandé de développement

1. Stabiliser API, CMS et builds Next.
2. Harmoniser les états loading/error/empty dans Web et CMS.
3. Finaliser le workflow demande → matching → proposition → contrat → facture → paiement.
4. Professionnaliser documents, PDF, audit, exports et paramètres.
5. Préparer le déploiement Vercel/Render et la configuration production.

## État actuel

- Structure attendue présente : `DEL-api`, `DEL-web`, `DEL-cms`, `package.json`, `README.md`, `.gitignore`.
- Aucun workspace ou package partagé n'a été créé.
- Les builds `DEL-web` et `DEL-cms` passent dans l'environnement d'audit.
- L'installation `DEL-api` a été bloquée par une erreur registry npm `403 Forbidden` sur `jsonwebtoken`; le démarrage API n'a donc pas pu être validé dans cet environnement sans dépendances installées.
- Les documents détaillés sont disponibles dans `docs/NEXT_ITERATIONS_CONTEXT.md`, `docs/TECHNICAL_AUDIT.md` et `docs/PRODUCT_REVIEW.md`.

## Déploiement production

Les trois applications restent indépendantes : ne pas créer de workspace npm et ne pas créer de package partagé. DEL-web et DEL-cms sont prévus pour Vercel ; DEL-api est prévu pour Render, Railway ou Fly.io avec MongoDB Atlas.

### Variables de production à renseigner

API (`DEL-api`) :

- `PORT=5000`
- `NODE_ENV=production`
- `MONGODB_URI` : URI MongoDB Atlas.
- `CORS_ORIGINS` : domaines autorisés séparés par virgule, par exemple `https://URL-DEL-WEB.vercel.app,https://URL-DEL-CMS.vercel.app`.
- `JWT_SECRET` : secret long, unique et obligatoire en production.
- `JWT_EXPIRES_IN=7d`
- `ADMIN_EMAILS` : emails admin séparés par virgule.
- `APP_URL` : URL Vercel de DEL-web.
- `CMS_URL` : URL Vercel de DEL-cms.
- `API_URL` : URL publique de DEL-api.

Web (`DEL-web`) :

- `NEXT_PUBLIC_API_URL` : URL publique de DEL-api.
- `NEXT_PUBLIC_APP_NAME=DEL`

CMS (`DEL-cms`) :

- `NEXT_PUBLIC_API_URL` : URL publique de DEL-api.
- `NEXT_PUBLIC_APP_NAME=DEL`
- `NEXT_PUBLIC_WEB_URL` : URL publique de DEL-web.

### Déploiement DEL-web sur Vercel

1. Importer le dépôt dans Vercel.
2. Configurer **Root Directory** sur `DEL-web`.
3. Configurer **Build Command** sur `npm run build`.
4. Laisser l'output en détection automatique Next.js.
5. Renseigner au minimum `NEXT_PUBLIC_API_URL` dans les variables Vercel.
6. Déployer, puis vérifier que le site appelle bien l'API de production.

### Déploiement DEL-cms sur Vercel

1. Importer le même dépôt dans un projet Vercel séparé.
2. Configurer **Root Directory** sur `DEL-cms`.
3. Configurer **Build Command** sur `npm run build`.
4. Laisser l'output en détection automatique Next.js.
5. Renseigner `NEXT_PUBLIC_API_URL` et `NEXT_PUBLIC_WEB_URL` dans les variables Vercel.
6. Déployer, puis tester la connexion admin.

### Déploiement DEL-api sur Render, Railway ou Fly.io

Configuration recommandée :

- **Root Directory** : `DEL-api`
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Healthcheck** : `GET /api/health`
- **Variables obligatoires** : `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, `ADMIN_EMAILS`.

Un fichier `render.yaml` est fourni à la racine pour Render. Il déclare un service web Node.js avec `rootDir: DEL-api`, `buildCommand: npm install` et `startCommand: npm start`. Les secrets restent à renseigner dans Render et ne doivent pas être commités.

### Seed production admin et settings

Avant de se connecter au CMS en production :

1. Renseigner `ADMIN_EMAILS` côté API avec un ou plusieurs emails séparés par virgule.
2. Lancer le seed admin depuis le service API ou depuis un shell connecté à l'environnement production :

```bash
npm run seed:admin
```

Le seed crée ou met à jour les utilisateurs admin avec le mot de passe temporaire `changer-moi-123`.

3. Lancer le seed des paramètres plateforme :

```bash
npm run seed:settings
```

4. Se connecter au CMS avec un email présent dans `ADMIN_EMAILS`.
5. Changer le mot de passe temporaire après connexion si la fonctionnalité est disponible.

### Commandes de build et vérification production

Depuis la racine du dépôt :

```bash
npm run build:all
```

Depuis `DEL-api` :

```bash
npm start
```

Pour vérifier l'API après déploiement :

```bash
curl https://URL-DEL-API.onrender.com/api/health
```

Consulter aussi `docs/DEPLOYMENT_CHECKLIST.md` avant mise en production.
