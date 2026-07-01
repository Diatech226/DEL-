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
