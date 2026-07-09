# DEL — MVP plateforme engins industriels

DEL est une plateforme de mise en relation, gestion documentaire et suivi opérationnel pour propriétaires d’engins, entreprises minières/BTP et administrateurs DEL.

## Statut MVP

Le MVP vendable se concentre sur un parcours stable : dépôt d’engin, demande entreprise, matching administré, proposition DEL, acceptation/refus entreprise, acceptation/refus propriétaire, contrat simple, facture simple, mission simple, documents, PDF essentiels, dashboards Web/CMS et paramètres CMS.

## Applications actives

Les applications lancées par les scripts npm racine sont désormais :

- `DEL-api` — API Express/MongoDB sur `http://localhost:5000`.
- `DEL-web-main` — application Web Main Vite/React sur `http://localhost:5173`.
- `DEL-cms-main` — application CMS Main Vite/React sur `http://localhost:5174`.

Les dossiers `DEL-web` et `DEL-cms` restent présents dans le dépôt uniquement comme anciennes versions historiques. Ils ne sont plus utilisés par les scripts npm racine.

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

## Installation et lancement local

Toutes les commandes principales se lancent depuis la racine du dépôt :

```bash
npm install
npm run install:all
npm run dev
```

Commande optionnelle pour charger les données de démonstration après configuration de l’API et de MongoDB :

```bash
npm run seed:demo --prefix DEL-api
```

Commandes utiles :

```bash
npm run build:all
npm run lint:all
npm run dev:api
npm run dev:web
npm run dev:cms
```

## Scripts npm racine

- `npm run dev` lance simultanément `DEL-api`, `DEL-web-main` et `DEL-cms-main`.
- `npm run dev:api` lance uniquement `DEL-api`.
- `npm run dev:web` lance uniquement `DEL-web-main`.
- `npm run dev:cms` lance uniquement `DEL-cms-main`.
- `npm run install:all` installe les dépendances de `DEL-api`, `DEL-web-main` et `DEL-cms-main`.
- `npm run build:all` build `DEL-web-main` puis `DEL-cms-main`.
- `npm run lint:all` vérifie `DEL-web-main` puis `DEL-cms-main`.

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

## URLs locales et ports

- API : `http://localhost:5000` — healthcheck `http://localhost:5000/api/health`.
- Web Main : `http://localhost:5173`.
- CMS Main : `http://localhost:5174`.

Ces ports sont ceux déclarés dans les applications actives : `DEL-api` utilise `PORT=5000` par défaut, `DEL-web-main` utilise le port Vite par défaut `5173`, et `DEL-cms-main` déclare `vite --port 5174`.

## Variables d’environnement

Copier le `.env.example` de chaque application active vers un `.env` local dans le même dossier :

```bash
cp DEL-api/.env.example DEL-api/.env
cp DEL-web-main/.env.example DEL-web-main/.env
cp DEL-cms-main/.env.example DEL-cms-main/.env
```

Les frontends actifs utilisent l’API locale via :

```env
VITE_API_URL=http://localhost:5000
```

Ne jamais versionner de secrets réels. Ne pas modifier les anciens `.env` locaux.

## CORS local

Pour le développement local, `DEL-api` doit autoriser les origines des applications actives dans `CORS_ORIGINS`, notamment :

```text
http://localhost:5173,http://localhost:5174
```

## Documentation MVP

- Périmètre officiel : `docs/MVP_SCOPE.md`
- Scénario de démonstration : `docs/DEMO_SCENARIO.md`
- Présentation commerciale : `docs/MVP_PRESENTATION.md`
- Continuité des prochaines itérations : `docs/NEXT_ITERATIONS_CONTEXT.md`

## Note légale MVP

DEL MVP ne promet pas de rendement, dividende, financement, investissement fractionné, paiement réel automatisé ou signature électronique qualifiée. Ces sujets sont des évolutions futures à valider juridiquement et techniquement.
