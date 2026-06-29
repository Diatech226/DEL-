# DEL-api

API centrale du projet DEL. Elle expose les données utilisées par `DEL-web` et `DEL-cms`.

## Installation

```bash
npm install
```

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner :

- `PORT=5000`
- `MONGODB_URI=<url MongoDB>`
- `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`

## Lancement

```bash
npm run dev
```

L'API doit être lancée avant les deux applications Next.js.

## Endpoints

- `GET /api/health`
- `POST /api/equipment`, `GET /api/equipment`, `GET /api/equipment/:id`, `PATCH /api/equipment/:id`, `PATCH /api/equipment/:id/status`, `DELETE /api/equipment/:id`
- `POST /api/requests`, `GET /api/requests`, `GET /api/requests/:id`, `PATCH /api/requests/:id`, `PATCH /api/requests/:id/status`, `DELETE /api/requests/:id`
- `POST /api/proposals`, `GET /api/proposals`, `GET /api/proposals/:id`, `PATCH /api/proposals/:id`, `PATCH /api/proposals/:id/status`, `DELETE /api/proposals/:id`

## Réponses JSON

Les listes retournent `{ "success": true, "count": 0, "data": [] }`.
Les détails et mutations retournent `{ "success": true, "data": {} }`.
Les erreurs retournent `{ "success": false, "message": "..." }`.

## Notes de test

1. Lancer MongoDB et `npm run dev`.
2. Vérifier `http://localhost:5000/api/health`.
3. Créer un engin depuis `DEL-web`, puis changer son statut depuis `DEL-cms`.

## Matching admin et propositions

### Nouvelles routes Requests
- `GET /api/requests/:id/matches` récupère une demande, liste les engins `AVAILABLE` de même catégorie et calcule un score sur 100 : catégorie (+40), disponibilité (+20), même pays (+15), même ville (+15), prix mensuel compatible (+10). Les résultats sont triés du meilleur score au plus faible.
- `POST /api/requests/:id/proposals` crée une proposition depuis une demande avec `equipmentIds`, `title`, `finalPrice`, `currency`, `durationMonths` et `conditions`. La demande passe à `PROPOSAL_SENT`, les engins sélectionnés passent à `RESERVED` et la proposition est créée avec le statut `SENT`.

### Routes conservées
- Equipment : `GET /api/equipment`, `GET /api/equipment/:id`, `POST /api/equipment`, `PATCH /api/equipment/:id`, `PATCH /api/equipment/:id/status`, `DELETE /api/equipment/:id`.
- Requests : `GET /api/requests`, `GET /api/requests/:id`, `POST /api/requests`, `PATCH /api/requests/:id`, `PATCH /api/requests/:id/status`, `DELETE /api/requests/:id`, `GET /api/requests/:id/matches`, `POST /api/requests/:id/proposals`.
- Proposals : `GET /api/proposals`, `GET /api/proposals/:id`, `POST /api/proposals`, `PATCH /api/proposals/:id`, `PATCH /api/proposals/:id/status`, `DELETE /api/proposals/:id`.

### Scénario de test complet
1. Lancer `DEL-api` avec `npm install` puis `npm run dev`.
2. Lancer `DEL-web` avec `npm install` puis `npm run dev`.
3. Lancer `DEL-cms` avec `npm install` puis `npm run dev -- -p 3001`.
4. Depuis `DEL-web`, déposer au moins deux engins de même catégorie ; ils sont en `PENDING_REVIEW`.
5. Depuis `DEL-cms/equipment`, passer ces engins en `AVAILABLE`.
6. Depuis `DEL-web/demander-des-engins`, publier une demande avec la même catégorie, le même pays et la même ville.
7. Depuis `DEL-cms/requests`, cliquer sur `Voir matching`, sélectionner un ou plusieurs engins et créer une proposition.
8. Vérifier que la proposition apparaît dans `DEL-cms/proposals`, que la demande est `PROPOSAL_SENT` et que les engins sélectionnés sont `RESERVED`.

### Limites actuelles
- Le matching reste volontairement simple : pas de distance géographique, de disponibilité calendaire ni de conversion devise.
- La réservation est appliquée immédiatement à tous les engins sélectionnés lors de l’envoi de proposition.

## Module Contrats

Le modèle `Contract` représente un contrat numérique simple créé depuis une proposition. Il contient la proposition, la demande, les engins concernés, l'entreprise, les propriétaires, le numéro unique `DEL-CTR-YYYYMMDD-XXXX`, les dates, la durée, le montant, la commission DEL, le montant propriétaire, les conditions, les responsabilités et le statut (`DRAFT`, `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED`, `CANCELLED`).

### Routes contrats

- `POST /api/proposals/:id/contracts` : crée un contrat depuis une proposition `SENT` ou `ACCEPTED`.
- `GET /api/contracts` : liste les contrats.
- `GET /api/contracts/:id` : détail d'un contrat.
- `PATCH /api/contracts/:id` : met à jour les informations contractuelles.
- `PATCH /api/contracts/:id/status` : change le statut du contrat.
- `DELETE /api/contracts/:id` : supprime un contrat.

### Workflow

Après matching, l'admin crée une proposition. Une proposition `SENT` ou `ACCEPTED` peut générer un contrat en `DRAFT`. La création passe la demande en `CONTRACT_PENDING` et les engins en `RESERVED`. Quand le contrat devient `ACTIVE`, la demande passe `ACTIVE` et les engins `PLACED`. Quand le contrat devient `COMPLETED` ou `CANCELLED`, les engins redeviennent `AVAILABLE` et la demande prend le statut correspondant.

### Scénario de test manuel

Démarrer l'API, le site web et le CMS. Créer un engin, le rendre `AVAILABLE`, créer une demande, faire le matching, créer une proposition, accepter ou utiliser une proposition envoyée, créer le contrat depuis `/proposals`, vérifier `/contracts`, passer le contrat `ACTIVE`, puis `COMPLETED`.

### Limites actuelles

Pas de signature électronique réelle, pas de paiement, pas de GPS, pas de financement, pas de dividendes et pas de génération PDF complexe.
