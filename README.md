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

Le `package.json` racine sert uniquement à lancer les applications ensemble ou individuellement depuis la racine du projet avec `concurrently`.

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

Valeurs locales minimales :

- `DEL-api/.env` : `PORT=5000` et une valeur `MONGODB_URI` MongoDB valide pour utiliser les routes qui lisent ou écrivent en base.
- `DEL-web/.env` : `NEXT_PUBLIC_API_URL=http://localhost:5000`
- `DEL-cms/.env` : `NEXT_PUBLIC_API_URL=http://localhost:5000`

En développement, l’API peut démarrer sans `MONGODB_URI` pour exposer `/api/health`, mais les routes métier nécessitent MongoDB.

## Commandes

### Installation racine

```bash
npm install
```

### Installation des apps

```bash
npm run install:all
```

### Lancer tout

```bash
npm run dev
```

### Lancer séparément

```bash
npm run dev:api
npm run dev:web
npm run dev:cms
```

## Lancer les applications depuis leurs dossiers

### API

```bash
cd DEL-api
npm install
npm run dev
```

### Web

```bash
cd DEL-web
npm install
npm run dev
```

### CMS

```bash
cd DEL-cms
npm install
npm run dev
```

## Vérifications locales

- API : http://localhost:5000/api/health
- Web : http://localhost:3000
- CMS : http://localhost:3001

## Dépannage Windows EPERM avec Next.js

Si Windows affiche une erreur `EPERM` sur `DEL-cms/.next/package.json`, `DEL-cms/.next/trace` ou un fichier équivalent :

- arrêter tous les serveurs ;
- fermer les anciens terminaux ;
- fermer VS Code si nécessaire lorsque le dossier `.next` reste verrouillé ;
- relancer PowerShell en administrateur si le verrou persiste ;
- supprimer `DEL-cms/.next` et `DEL-web/.next` manuellement ;
- relancer `npm run dev` ;
- éviter deux processus Next sur le même dossier.

## Déploiement recommandé

- **DEL-web** : Vercel.
- **DEL-cms** : Vercel.
- **DEL-api** : Render.
- **MongoDB** : MongoDB Atlas.
