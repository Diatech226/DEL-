# DEL-cms

Back-office DEL connecté à `DEL-api` pour administrer les engins, demandes et propositions.

## Installation

```bash
npm install
```

## Variables d'environnement

Créer `.env.local` si nécessaire :

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Ordre de lancement

1. Lancer `DEL-api` sur le port `5000`.
2. Lancer le CMS sur le port `3001` :

```bash
npm run dev -- -p 3001
```

## Endpoints utilisés

- `GET /api/equipment`
- `PATCH /api/equipment/:id/status`
- `GET /api/requests`
- `PATCH /api/requests/:id/status`
- `GET /api/proposals`
- `POST /api/proposals`
- `PATCH /api/proposals/:id/status`

## Notes de test

- Ouvrir `http://localhost:3001` et vérifier les statistiques.
- Aller dans `/equipment` et changer un statut d'engin.
- Aller dans `/requests` et changer un statut de demande.
- Aller dans `/proposals`, créer une proposition puis changer son statut.

## Module matching admin

- La liste `/requests` affiche un bouton `Voir matching` vers `/requests/[id]`.
- La page `/requests/[id]` affiche le détail de la demande, les engins compatibles classés par score, une sélection multiple et un formulaire de création de proposition.
- La page `/proposals` affiche le titre, l’entreprise, les propriétaires, le nombre d’engins, le prix final, la durée, le statut et les conditions, avec actions `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`.

### Client API ajouté
- `getRequestById(id)` appelle `GET /api/requests/:id`.
- `getRequestMatches(id)` appelle `GET /api/requests/:id/matches`.
- `createProposalFromRequest(requestId, payload)` appelle `POST /api/requests/:id/proposals`.

### Test fonctionnel
Suivre le scénario complet décrit dans `DEL-api/README.md` : validation des engins, publication d’une demande, matching, création de proposition, puis vérification dans `/proposals`, `/requests` et `/equipment`.

### Limites actuelles
Le CMS ne gère pas encore une négociation détaillée ni une édition avancée de la proposition générée depuis le matching.

## Module Contrats CMS

Le CMS expose une page `/contracts` listant les contrats numériques simples et une page `/contracts/[id]` pour le détail. Les contrats sont créés depuis `/proposals` pour les propositions `SENT` ou `ACCEPTED` avec dates, durée, modalités de paiement, commission DEL, conditions et responsabilités.

Le dashboard affiche désormais le total contrats, les contrats actifs, en attente de signature et terminés. Les actions de statut disponibles sont `DRAFT`, `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED` et `CANCELLED`.

### Workflow et test

1. Créer ou identifier une proposition `SENT`/`ACCEPTED`.
2. Cliquer sur “Créer contrat” dans `/proposals`.
3. Remplir le formulaire inline et valider.
4. Ouvrir `/contracts`, vérifier la ligne créée et consulter le détail.
5. Passer le contrat en `ACTIVE`, puis `COMPLETED` pour vérifier les transitions côté API.

### Limites actuelles

Le CMS affiche un contrat numérique simple uniquement. La signature électronique, le paiement et les PDF complexes ne sont pas encore implémentés.
