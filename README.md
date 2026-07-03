# DEL — MVP plateforme engins industriels

DEL est une plateforme de mise en relation, gestion documentaire et suivi opérationnel pour propriétaires d’engins, entreprises minières/BTP et administrateurs DEL.

## Statut MVP

Le MVP vendable se concentre sur un parcours stable : dépôt d’engin, demande entreprise, matching administré, proposition DEL, acceptation/refus entreprise, acceptation/refus propriétaire, contrat simple, facture simple, mission simple, documents, PDF essentiels, dashboards Web/CMS et paramètres CMS.

## Modules inclus

- Dépôt et validation d’engins.
- Demandes d’engins par entreprise.
- Matching et workflow administrateur.
- Propositions DEL avec décisions entreprise/propriétaire.
- Contrats, factures, missions et maintenance simple.
- Documents et PDF essentiels.
- Dashboard CMS et dashboard Web propriétaire/entreprise.
- Paramètres CMS et mentions légales de base.

## Modules à venir

Paiement réel, GPS réel, vidéo, dividendes, investissement fractionné, IA avancée, application mobile, messagerie temps réel, notifications temps réel, exports avancés et soumissions d’appels d’offres avancées.

## Commandes

```bash
npm install
npm run install:all
cd DEL-api
npm run seed:demo
cd ..
npm run dev
```

Commandes utiles :

```bash
npm run build:all
npm run dev:api
npm run dev:web
npm run dev:cms
```

## Données de démonstration

Le script `DEL-api/scripts/seedDemo.js` crée ou met à jour :

- Admin CMS : `admin@del.demo`
- Propriétaire : `proprietaire@del.demo` — Société Faso Engins
- Entreprise : `entreprise@del.demo` — Mine Houndé Operations
- 3 engins : Camion benne, Pelle hydraulique, Bulldozer
- 1 demande : 2 camions bennes à Houndé pour 6 mois
- 1 document simple et les paramètres légaux MVP

Mot de passe commun de démo : `Demo@DEL2026!`

> Ce mot de passe est réservé aux environnements locaux ou de démonstration. Ne jamais l’utiliser en production.

## URLs locales

- Web : http://localhost:3000
- CMS : http://localhost:3001
- API health : http://localhost:5000/api/health

## Documentation MVP

- Périmètre officiel : `docs/MVP_SCOPE.md`
- Scénario de démonstration : `docs/DEMO_SCENARIO.md`
- Présentation commerciale : `docs/MVP_PRESENTATION.md`

## Note légale MVP

DEL MVP ne promet pas de rendement, dividende, financement, investissement fractionné, paiement réel automatisé ou signature électronique qualifiée. Ces sujets sont des évolutions futures à valider juridiquement et techniquement.


## Lancer DEL-web-main connecté à DEL-api

`DEL-web-main` est le frontend design Vite/React autonome connecté progressivement à `DEL-api`. Il reste indépendant de `DEL-web`, `DEL-cms` et `DEL-api`.

```bash
npm run install:design-web
npm run dev:api
npm run dev:design-web
```

Par défaut, Vite expose `DEL-web-main` sur `http://localhost:5173` et lit `VITE_API_URL` dans `DEL-web-main/.env` :

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DEL
```

Pour le développement local, `DEL-api` doit inclure `http://localhost:5173` dans `CORS_ORIGINS` sans retirer les origines existantes.

## Applications et ports locaux

Le dépôt garde cinq applications indépendantes, sans workspace ni package partagé :

- `DEL-api` — API Express/MongoDB sur `http://localhost:5000`.
- `DEL-web` — ancienne application Web Next sur `http://localhost:3000`.
- `DEL-web-main` — nouveau frontend design Vite sur `http://localhost:5173`.
- `DEL-cms` — ancien CMS Next sur `http://localhost:3001`.
- `DEL-cms-main` — nouveau CMS Vite sur `http://localhost:5174`.

Commandes racine utiles :

```bash
npm run dev:api
npm run dev:web
npm run dev:design-web
npm run dev:cms
npm run dev:main-cms
npm run install:new-frontends
```

Variables d’environnement : copier le `.env.example` de chaque application vers un `.env` local dans le même dossier (`DEL-api/.env`, `DEL-web/.env`, `DEL-web-main/.env`, `DEL-cms/.env`, `DEL-cms-main/.env`) puis adapter uniquement les valeurs locales nécessaires. Ne jamais versionner de secrets réels.

CORS local : `DEL-api` doit autoriser toutes les origines de développement utilisées par les apps locales, notamment `3000`, `3001`, `5173` et `5174` via `CORS_ORIGINS`.
