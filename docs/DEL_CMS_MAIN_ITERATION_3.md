# DEL-cms-main — Itération 3 Factures & Paiements

## Objectif
Connecter progressivement le nouveau CMS autonome `DEL-cms-main` à `DEL-api` uniquement pour les modules Factures et Paiements, sans modifier `DEL-cms`, `DEL-web`, `DEL-web-main`, ni créer de workspace ou package partagé.

## Pages connectées
- Vue `Factures` : liste API, filtres locaux, états loading/error/empty et détail facture.
- Vue `Paiements` : liste API, détail paiement et actions statut.
- Détail contrat : ajout d'une action légère de création de facture depuis un contrat existant.

## Services créés
- `DEL-cms-main/src/services/invoice.service.ts`
- `DEL-cms-main/src/services/payment.service.ts`

## Mappers créés
- `DEL-cms-main/src/mappers/invoice.mapper.ts`
- `DEL-cms-main/src/mappers/payment.mapper.ts`

## Statuts ajoutés
- Factures : `DRAFT`, `SENT`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `CANCELLED`, `UNKNOWN`.
- Paiements : `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `UNKNOWN`.
- Variantes : `PAID`/`CONFIRMED` en succès, `SENT`/`PARTIALLY_PAID`/`PENDING`/`DRAFT` en warning, `OVERDUE`/`REJECTED`/`CANCELLED` en danger, `UNKNOWN` en neutral.

## Endpoints utilisés
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `POST /api/contracts/:id/invoices`
- `PATCH /api/invoices/:id/status`
- `PATCH /api/invoices/:id`
- `GET /api/payments`
- `GET /api/payments/:id`
- `GET /api/payments/invoice/:invoiceId`
- `POST /api/payments`
- `PATCH /api/payments/:id/status`
- `PATCH /api/payments/:id`

## Actions disponibles
- Création facture depuis le détail contrat avec titre, sous-total, taxe, échéance, période, notes et statut `DRAFT` ou `SENT`.
- Consultation liste et détail facture.
- Passage d'une facture `DRAFT` en `SENT` et annulation facture si l'API accepte le changement.
- Création d'un paiement manuel depuis une facture.
- Consultation liste et détail paiement.
- Confirmation, rejet et annulation de paiement via endpoint de statut.

## Actions non disponibles
- PDF facture avancé non connecté : un placeholder indique que le téléchargement PDF arrive dans une prochaine itération.
- Aucun recalcul définitif des soldes côté frontend : `amountPaid` et `balanceDue` restent ceux renvoyés par DEL-api.
- Missions, maintenance, documents, audit, exports, settings, notifications, messages et scoring ne sont pas connectés dans cette itération.

## Création facture depuis contrat
Le détail contrat préremplit le formulaire avec le numéro de contrat, le montant du contrat, la période contractuelle et le statut `SENT`. Le paiement n'est pas créé automatiquement.

## Création paiement depuis facture
Le détail facture préremplit le montant avec `balanceDue`, la devise de la facture, la date du jour et la méthode `BANK_TRANSFER`. Le paiement créé garde le statut décidé par l'API, sans confirmation automatique côté frontend.

## Mocks restants
Les modules hors Factures/Paiements conservent leurs données ou comportements existants. Les rapports PDF restent simulés localement.

## Limites
- Si `GET /api/payments/invoice/:invoiceId` échoue, le CMS recharge temporairement tous les paiements et filtre côté frontend.
- La disponibilité fonctionnelle complète dépend de MongoDB et des données métier présentes dans DEL-api.
- Les erreurs API sont affichées à l'admin mais les workflows non ciblés ne sont pas refactorés.

## Commandes de test
- `npm install --prefix DEL-cms-main`
- `npm run build --prefix DEL-cms-main`
- `npm run dev --prefix DEL-api`
- `curl http://localhost:5000/api/health`
- `git diff -- DEL-cms`
- `git diff -- DEL-web`
- `git diff -- DEL-web-main`

## Prochaine itération recommandée
Connecter les documents contractuels/KYC ou finaliser les PDF factures avec branding DEL après validation du flux contrat → facture → paiement confirmé.
