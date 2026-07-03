# DEL-cms-main — Itération 2 Propositions & Contrats

## Objectif
Connecter progressivement le nouveau CMS autonome `DEL-cms-main` à `DEL-api` pour les seuls modules Propositions et Contrats, sans modifier `DEL-cms`, `DEL-web` ou créer de workspace/package partagé.

## Pages connectées
- Onglet / vue `Propositions` dans `DEL-cms-main` : liste API, filtre local, état loading/error/empty et détail proposition.
- Onglet / vue `Contrats` dans `DEL-cms-main` : liste API, filtre local, état loading/error/empty et détail contrat.

## Services créés
- `DEL-cms-main/src/services/proposal.service.ts`
- `DEL-cms-main/src/services/contract.service.ts`

## Mappers créés
- `DEL-cms-main/src/mappers/proposal.mapper.ts`
- `DEL-cms-main/src/mappers/contract.mapper.ts`

## Statuts ajoutés / complétés
- Propositions : `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`, `PENDING_COMPANY`, `PENDING_OWNERS`, `READY_FOR_CONTRACT`, `REJECTED_BY_COMPANY`, `REJECTED_BY_OWNER`, `CONTRACT_CREATED`, `UNKNOWN`.
- Contrats : `DRAFT`, `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `UNKNOWN`.
- Variantes visuelles : success, warning, danger, info, neutral via `getStatusVariant`.

## Endpoints utilisés
- `GET /api/proposals`
- `GET /api/proposals/:id`
- `PATCH /api/proposals/:id/status`
- `PATCH /api/proposals/:id/company-decision`
- `PATCH /api/proposals/:id/owner-decisions/:index`
- `GET /api/contracts`
- `GET /api/contracts/:id`
- `POST /api/proposals/:id/contracts`
- `PATCH /api/contracts/:id/status`
- `PATCH /api/contracts/:id`

## Actions disponibles
- Décision entreprise administrateur : acceptation/refus via `PATCH /api/proposals/:id/company-decision`.
- Décision propriétaire administrateur : acceptation/refus via `PATCH /api/proposals/:id/owner-decisions/:index`.
- Création de contrat depuis une proposition si `workflowStatus === READY_FOR_CONTRACT` ou `status === ACCEPTED`.
- Changement de statut contrat vers `PENDING_SIGNATURE`, `ACTIVE`, `COMPLETED`, `CANCELLED`.

## Actions non disponibles / non connectées
- Factures, paiements, missions, maintenance, documents, audit, exports, settings, notifications, messages, scoring et PDF restent hors périmètre de cette itération.
- Le bouton PDF historique n'a pas été connecté à l'API ; les factures affichent seulement le placeholder d'itération suivante dans le détail contrat.

## Mocks restants
- Les modules hors Propositions et Contrats conservent leurs données locales ou leur état précédent.
- Les rapports PDF restent simulés localement.

## Limites
- La création contrat envoie le payload du formulaire, mais l'API calcule actuellement le montant/devise depuis la proposition côté backend.
- Les contrôles fonctionnels complets nécessitent MongoDB et des données de propositions prêtes.

## Commandes de test
- `npm install --prefix DEL-cms-main`
- `npm run build --prefix DEL-cms-main`
- `npm run dev --prefix DEL-cms-main`
- `npm run dev --prefix DEL-api`
- `curl http://localhost:5000/api/health`
- `git diff -- DEL-cms`
- `git diff -- DEL-web`

## Prochaine itération recommandée
Connecter les factures après validation du workflow proposition → contrat, puis brancher paiements manuels, documents contractuels et PDF brandés dans des itérations séparées.
