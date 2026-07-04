# DEL-web-main — Itération 3 Propositions & Contrats

## Objectif
Connecter `DEL-web-main` à `DEL-api` uniquement pour les modules utilisateur Propositions et Contrats, sans modifier `DEL-web`, `DEL-cms` ni `DEL-cms-main`.

## Propositions connectées
- Liste utilisateur via `GET /api/me/proposals`.
- Mapping vers le design via `mapApiProposalToDesign` et `mapApiProposalListToDesign`.
- États loading, erreur, vide et succès côté écran.
- Affichage du statut principal, du `workflowStatus`, de la décision entreprise et des décisions propriétaires.

## Décisions entreprise/propriétaire
- Entreprise : acceptation/refus via `PATCH /api/me/proposals/:id/company-decision`.
- Propriétaire : acceptation/refus via `PATCH /api/me/proposals/:id/owner-decision`.
- Le refus demande un motif avec `prompt` simple.
- Le web ne crée pas de contrat après acceptation : la contractualisation reste côté API/back-office.

## Contrats connectés
- Liste utilisateur via `GET /api/me/contracts`.
- Détail simple affiché à partir de la liste chargée, sans appel détail admin-only.
- Affichage du numéro, titre, entreprise, propriétaires, montant, devise, statut, dates, conditions, modalités de paiement et engins.

## PDF contrat
- Téléchargement via `GET /api/reports/contracts/:id/pdf` lorsque l'endpoint est autorisé.
- Téléchargement blob avec token Bearer et messages d'erreur pour 401, 403, 404 et 500.

## Services créés ou complétés
- `src/services/proposal.service.ts`
- `src/services/contract.service.ts`
- `src/services/report.service.ts`
- `src/services/dashboard.service.ts` pour inclure les compteurs/données simples propositions et contrats dans le dashboard.

## Mappers créés ou complétés
- `src/mappers/proposal.mapper.ts`
- `src/mappers/contract.mapper.ts`

## Endpoints utilisés
- `GET /api/me/proposals`
- `PATCH /api/me/proposals/:id/company-decision`
- `PATCH /api/me/proposals/:id/owner-decision`
- `GET /api/me/contracts`
- `GET /api/reports/contracts/:id/pdf`

## Mocks restants
- Factures, paiements, missions, documents, notifications, messages, maintenance et appels d'offres avancés restent hors périmètre.
- Les dashboards conservent encore des widgets historiques pour ces modules non connectés.

## Limites
- Le détail contrat n'appelle pas `GET /api/contracts/:id` afin d'éviter un endpoint potentiellement admin-only.
- Signature électronique non connectée ; le design affiche “Signature électronique à venir.”
- Les tests de parcours COMPANY/OWNER nécessitent des comptes et données API valides.

## Commandes de test
```bash
cd DEL-api
npm run dev
curl http://localhost:5000/api/health

cd DEL-web-main
npm install
npm run build
npm run dev

git diff -- DEL-web
git diff -- DEL-cms
git diff -- DEL-cms-main
```

## Prochaine itération recommandée
Connecter un module financier ciblé (factures + paiements) après validation fonctionnelle des propositions et contrats, sans brancher missions/documents/notifications dans la même itération.
