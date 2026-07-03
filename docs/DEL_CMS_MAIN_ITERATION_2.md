# DEL-cms-main — Itération 2 Propositions & Contrats

## Objectif
Connecter progressivement le nouveau CMS autonome `DEL-cms-main` à `DEL-api` pour les seuls modules Propositions et Contrats, sans modifier `DEL-cms`, `DEL-web`, `DEL-web-main`, ni créer de workspace ou package partagé.

## Pages connectées
- Onglet `Propositions` du module commercial : liste API, filtres locaux, état loading/error/empty et accès détail.
- Détail proposition : résumé, lien demande/appel d'offres, engins, décision entreprise, décisions propriétaires et actions admin.
- Formulaire de création de contrat depuis une proposition prête (`READY_FOR_CONTRACT`) ou acceptée (`ACCEPTED`).
- Onglet `Contrats` du module commercial : liste API, filtres locaux, état loading/error/empty et accès détail.
- Détail contrat : identification, parties, engins, montants, dates, conditions et actions de statut.

## Services créés
- `DEL-cms-main/src/services/proposal.service.ts`
  - `getProposalList(params?)` → `GET /api/proposals`
  - `getProposalById(id)` → `GET /api/proposals/:id`
  - `updateProposalStatus(id, status)` → `PATCH /api/proposals/:id/status`
  - `updateCompanyDecisionAsAdmin(id, payload)` → `PATCH /api/proposals/:id/company-decision`
  - `updateOwnerDecisionAsAdmin(id, index, payload)` → `PATCH /api/proposals/:id/owner-decisions/:index`
- `DEL-cms-main/src/services/contract.service.ts`
  - `getContractList(params?)` → `GET /api/contracts`
  - `getContractById(id)` → `GET /api/contracts/:id`
  - `createContractFromProposal(proposalId, payload)` → `POST /api/proposals/:id/contracts`
  - `updateContractStatus(id, status)` → `PATCH /api/contracts/:id/status`
  - `updateContract(id, payload)` → `PATCH /api/contracts/:id`

## Mappers créés
- `DEL-cms-main/src/mappers/proposal.mapper.ts` avec `mapApiProposalToAdmin` et `mapApiProposalListToAdmin`.
- `DEL-cms-main/src/mappers/contract.mapper.ts` avec `mapApiContractToAdmin` et `mapApiContractListToAdmin`.

## Statuts ajoutés
- Propositions : `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`, `PENDING_COMPANY`, `PENDING_OWNERS`, `READY_FOR_CONTRACT`, `REJECTED_BY_COMPANY`, `REJECTED_BY_OWNER`, `CONTRACT_CREATED`, `UNKNOWN`.
- Contrats : `DRAFT`, `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `UNKNOWN`.
- Variantes UI : success, warning, danger, info et neutral via `getStatusVariant`.

## Endpoints utilisés et actions disponibles
Les endpoints demandés existent côté `DEL-api` et sont branchés dans le CMS : décisions admin proposition, création contrat depuis proposition, lecture contrats/propositions et changement de statut contrat.

## Actions non disponibles / non connectées
- Signature électronique réelle utilisateur.
- Factures, paiements, missions, maintenance, documents, audit, exports, settings, notifications, messages, scoring et PDF réel ne sont pas connectés dans cette itération.

## Mocks restants
- Les modules hors Propositions/Contrats restent alimentés par les données existantes ou par l'itération 1.
- Le bouton/placeholder PDF existant n'est pas transformé en génération PDF réelle.

## Limites
- Les actions admin utilisent les routes existantes ; si l'API refuse une transition, le message d'erreur DEL-api est affiché.
- La SPA `DEL-cms-main` conserve sa navigation par état React, sans routeur externe.
- Les données absentes sont affichées avec des fallbacks pour éviter les pages blanches.

## Commandes de test
- `npm run build --prefix DEL-cms-main`
- `git diff -- DEL-cms`
- `git diff -- DEL-web`
- `npm run dev --prefix DEL-api` puis `curl http://localhost:5000/api/health` à valider dans un environnement MongoDB disponible.
- `npm run dev --prefix DEL-cms-main` pour validation manuelle du login, dashboard, engins, demandes, propositions et contrats.

## Prochaine itération recommandée
Connecter les factures depuis les contrats, puis paiements manuels, sans élargir aux missions/maintenance avant validation du workflow contrat → facture.
