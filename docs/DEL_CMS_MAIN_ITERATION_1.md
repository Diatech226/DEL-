# DEL-cms-main — Itération 1 API

## Objectif
Connecter une première tranche stable du nouveau CMS autonome `DEL-cms-main` à `DEL-api`, sans modifier l’ancien `DEL-cms-main` ni créer de workspace/package partagé.

## Framework détecté
- Vite SPA avec React 19 et TypeScript.
- Routing actuel : navigation locale par état React dans `src/App.tsx`, sans routeur externe.
- Port retenu : `5174` pour éviter le port de l’ancien CMS.

## Pages connectées
- Login admin : authentification réelle via `POST /api/auth/login` puis `GET /api/auth/me`.
- Dashboard : charge les engins et demandes depuis l’API pour les cartes principales existantes.
- Liste des engins : source remplacée par `GET /api/equipment` après connexion admin.
- Liste des demandes : source remplacée par `GET /api/requests` après connexion admin.
- Détail demande : recharge `GET /api/requests/:id` quand un id est sélectionné.
- Matching demande : le design existant conserve la section matching ; la création de proposition utilise maintenant `POST /api/requests/:id/proposals` quand un engin est sélectionné.

## Services créés
- `src/services/auth.service.ts`
- `src/services/dashboard.service.ts`
- `src/services/equipment.service.ts`
- `src/services/request.service.ts`
- `src/services/matching.service.ts`

## Mappers créés
- `src/mappers/equipment.mapper.ts`
- `src/mappers/request.mapper.ts`
- `src/mappers/matching.mapper.ts`

## Status helper créé
- `src/constants/status.ts` avec normalisation, labels français et variantes visuelles.

## Auth admin
- `src/context/AuthContext.tsx` stocke le token uniquement dans `localStorage` côté navigateur.
- `src/components/auth/AdminGuard.tsx` protège les vues connectées.
- `src/components/auth/LoginView.tsx` fournit le formulaire email/mot de passe.
- Seuls les comptes `role === ADMIN` peuvent accéder au CMS.

## Mocks encore utilisés
Les modules non ciblés restent sur les mocks existants : propositions globales, contrats, factures, paiements, missions, maintenance, documents, audit, exports, rapports PDF, paramètres, utilisateurs, propriétaires, entreprises et techniciens.

## Endpoints utilisés
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/equipment`
- `GET /api/equipment/:id`
- `PATCH /api/equipment/:id/status`
- `GET /api/requests`
- `GET /api/requests/:id`
- `PATCH /api/requests/:id/status`
- `GET /api/requests/:id/matches`
- `POST /api/requests/:id/proposals`

## Variables d’environnement
`DEL-cms-main/.env.example` et `.env` :

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DEL CMS
```

Aucun secret frontend n’est ajouté.

## CORS
`DEL-api/.env.example` inclut maintenant `http://localhost:5174` et conserve les origines existantes. Si un `.env` local API existe, ajouter le port du nouveau CMS à `CORS_ORIGINS` sans exposer de secret.

## Commandes de test
- `npm install --prefix DEL-cms-main`
- `npm run build --prefix DEL-cms-main`
- `npm run dev --prefix DEL-cms-main`
- `git diff -- DEL-cms-main`
- `git diff -- DEL-web-main`

## Limites
- Pas de connexion des modules hors périmètre.
- Le matching affiché reste compatible avec le design local ; seuls les endpoints ciblés sont ajoutés.
- Les graphiques avancés du dashboard ne sont pas connectés à des endpoints analytiques dédiés.

## Prochaine itération recommandée
Stabiliser les détails engin/demande avec routes dédiées si nécessaire, brancher un endpoint dashboard agrégé côté API, puis connecter progressivement les propositions sans activer contrats/factures tant que le workflow n’est pas validé.
