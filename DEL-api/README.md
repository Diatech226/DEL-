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

## Module Documents et vérification des dossiers

Le modèle `Document` permet de rattacher une URL de document à un dossier métier sans stockage cloud réel. Champs principaux : `title`, `type`, `entityType` (`EQUIPMENT`, `COMPANY`, `OWNER`, `REQUEST`, `CONTRACT`), `entityId`, `ownerName`, `uploadedBy`, `fileUrl`, `fileName`, `mimeType`, `notes`, `status` (`PENDING`, `VERIFIED`, `REJECTED`), `rejectionReason`, `verifiedAt`, `createdAt`, `updatedAt`.

Types recommandés : documents engin (`VEHICLE_REGISTRATION`, `PURCHASE_INVOICE`, `INSURANCE`, `TECHNICAL_REPORT`, `MAINTENANCE_HISTORY`, `PHOTO`, `VIDEO`, `OWNERSHIP_PROOF`, `OTHER`), entreprise (`RCCM`, `IFU`, `BUSINESS_LICENSE`, `ID_CARD`, `TAX_DOCUMENT`, `CONTRACT_PROOF`, `OTHER`) et contrat (`SIGNED_CONTRACT`, `PAYMENT_PROOF`, `DELIVERY_REPORT`, `MISSION_REPORT`, `OTHER`).

### Routes documents

- `POST /api/documents` : crée un document. Champs obligatoires : `title`, `type`, `entityType`, `entityId`, `fileUrl`.
- `GET /api/documents` : liste tous les documents.
- `GET /api/documents/:id` : détail d'un document.
- `GET /api/documents/entity/:entityType/:entityId` : documents rattachés à un engin, une demande, une entreprise, un propriétaire ou un contrat.
- `PATCH /api/documents/:id` : mise à jour simple.
- `PATCH /api/documents/:id/status` : validation ou rejet avec `{ "status": "VERIFIED", "rejectionReason": "" }` ou `{ "status": "REJECTED", "rejectionReason": "Document illisible" }`.
- `DELETE /api/documents/:id` : suppression.

### Workflow de vérification

Un propriétaire peut déposer un engin puis ajouter des documents via URL. Une entreprise peut joindre des documents à sa demande. Le CMS liste tous les documents, permet à l'admin de les consulter, de les passer `VERIFIED` ou `REJECTED`, et de renseigner une raison de rejet.

### Scénario de test documents

1. Démarrer `DEL-api`, `DEL-web` et `DEL-cms`.
2. Depuis `DEL-web/deposer-un-engin`, créer un engin puis ajouter un document URL.
3. Ouvrir le détail de l'engin et vérifier que `GET /api/documents/entity/EQUIPMENT/:id` alimente la section documents.
4. Depuis `DEL-cms/documents`, vérifier puis rejeter le document pour tester les deux statuts.
5. Depuis `DEL-web/demander-des-engins`, créer une demande puis ajouter un document `RCCM` ou `IFU`.
6. Depuis `DEL-cms/requests/:id`, vérifier que les documents de demande apparaissent.
7. Depuis `DEL-cms/contracts/:id`, ajouter un document contrat et vérifier sa présence dans `/documents`.

### Limites actuelles documents

Les fichiers ne sont pas téléversés : `fileUrl` pointe vers une URL fournie manuellement. Pas de S3/Cloudinary, signature électronique, paiement, GPS, dividendes, financement ou stockage avancé.

## Facturation et paiements manuels

### Modèles
- `Invoice` : facture liée à un contrat, avec numéro unique `DEL-INV-YYYYMMDD-XXXX`, période, montants, commission DEL, montant propriétaire, conditions de paiement, solde et statut (`DRAFT`, `SENT`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `CANCELLED`).
- `Payment` : paiement manuel lié à une facture, avec numéro unique `DEL-PAY-YYYYMMDD-XXXX`, méthode, référence, URL de preuve et statut (`PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`).

### Routes factures
- `POST /api/contracts/:id/invoices` : créer une facture brouillon depuis un contrat.
- `GET /api/invoices` : lister les factures.
- `GET /api/invoices/:id` : détail facture.
- `PATCH /api/invoices/:id` : modifier une facture.
- `PATCH /api/invoices/:id/status` : changer le statut.
- `DELETE /api/invoices/:id` : supprimer une facture et ses paiements.

### Routes paiements
- `POST /api/payments` : enregistrer un paiement manuel confirmé par défaut.
- `GET /api/payments` : lister les paiements.
- `GET /api/payments/:id` : détail paiement.
- `GET /api/payments/invoice/:invoiceId` : paiements d'une facture.
- `PATCH /api/payments/:id` : modifier un paiement.
- `PATCH /api/payments/:id/status` : changer le statut et recalculer la facture.
- `DELETE /api/payments/:id` : supprimer un paiement et recalculer la facture.

### Workflow
Un contrat créé depuis une proposition peut recevoir une facture. La facture calcule automatiquement taxe, total, commission DEL, montant propriétaire, montant payé et solde. Les paiements confirmés alimentent `amountPaid`; les paiements en attente, rejetés ou annulés ne comptent pas. Le solde ne devient jamais négatif.

### Limites actuelles
Pas de paiement réel en ligne, Mobile Money automatisé, banque, crypto opérationnelle, DiaPay, wallet, dividendes, investissement fractionné ou automatisation bancaire.

## Module planning et disponibilité des engins

DEL-api expose le modèle `EquipmentSchedule` pour représenter une période pendant laquelle un engin est disponible, réservé, contractualisé, en mission, en maintenance, indisponible ou bloqué manuellement. Les champs principaux sont `equipmentId`, `equipmentTitle`, `ownerName`, `type`, `title`, `description`, `startDate`, `endDate`, `relatedEntityType`, `relatedEntityId`, `status`, `createdBy` et `notes`.

### Routes planning

- `POST /api/equipment-schedules` : créer un blocage ou une période manuelle.
- `GET /api/equipment-schedules` : lister les périodes, avec filtres simples par query string.
- `GET /api/equipment-schedules/:id` : détail d’une période.
- `GET /api/equipment-schedules/equipment/:equipmentId` : planning d’un engin.
- `GET /api/equipment-schedules/equipment/:equipmentId/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` : disponibilité d’un engin.
- `POST /api/equipment-schedules/check-availability` : disponibilité de plusieurs engins.
- `PATCH /api/equipment-schedules/:id` : modifier une période.
- `PATCH /api/equipment-schedules/:id/status` : passer une période `ACTIVE`, `CANCELLED` ou `COMPLETED`.
- `DELETE /api/equipment-schedules/:id` : supprimer une période.

### Logique de conflit

Un conflit existe pour un même `equipmentId` si une période `ACTIVE`, non `AVAILABLE`, chevauche la période demandée avec la règle : `startDate <= existingEndDate` et `endDate >= existingStartDate`. Les conflits bloquent les réservations manuelles et les propositions, avec une réponse HTTP `409`.

### Intégrations métier

- Création d’une proposition depuis une demande : vérifie la disponibilité, puis crée des schedules `RESERVED`.
- Création d’un contrat : crée des schedules `CONTRACT`.
- Création d’une mission : crée des schedules `MISSION`.
- Création d’un ticket maintenance : crée un schedule `MAINTENANCE` si une immobilisation est renseignée. Une maintenance peut chevaucher une mission, mais la réponse contient un avertissement.
- Changement de statut : les schedules liés passent `CANCELLED` ou `COMPLETED` selon les statuts des propositions, contrats, missions et tickets maintenance.
- Matching : les engins en conflit sur la période de la demande sont exclus ; les engins disponibles gagnent un bonus de score avec la raison `Disponible sur la période demandée`.

### Scénario de test conseillé

1. Créer un engin et le passer `AVAILABLE`.
2. Bloquer l’engin dans `/api/equipment-schedules` du 10 au 15 juillet.
3. Créer une demande sur cette même période et vérifier que le matching l’exclut.
4. Créer une demande du 20 au 25 juillet et vérifier que l’engin apparaît.
5. Créer une proposition, un contrat, une mission et un ticket maintenance, puis vérifier les schedules `RESERVED`, `CONTRACT`, `MISSION` et `MAINTENANCE`.
6. Passer mission et maintenance à `COMPLETED` et vérifier que les schedules liés passent `COMPLETED`.

### Limites actuelles

Pas de calendrier graphique complexe, pas de drag and drop, pas de GPS temps réel, pas d’optimisation IA et pas d’application mobile chauffeur.

## Profils avancés et KYC/KYB

DEL-api expose désormais une base métier pour les profils `User`, `OwnerProfile`, `CompanyProfile` et `TechnicianProfile`.

### Modèles

- `User` : identité de base, rôle (`OWNER`, `COMPANY`, `INVESTOR`, `TECHNICIAN`, `ADMIN`), type de compte, statut de vérification et coordonnées.
- `OwnerProfile` : informations propriétaire individuel ou société, document d’identité, fiscalité, coordonnées de paiement et compteur d’engins.
- `CompanyProfile` : entreprise minière, BTP, logistique, transport ou autre, contact, références RCCM/IFU/licence, budget et besoins engins.
- `TechnicianProfile` : technicien, atelier ou société partenaire, spécialités, zones d’intervention et tarif horaire.

### Routes profils

- `POST|GET /api/users`, `GET|PATCH|DELETE /api/users/:id`, `PATCH /api/users/:id/status`
- `POST|GET /api/owner-profiles`, `GET|PATCH|DELETE /api/owner-profiles/:id`, `PATCH /api/owner-profiles/:id/status`
- `POST|GET /api/company-profiles`, `GET|PATCH|DELETE /api/company-profiles/:id`, `PATCH /api/company-profiles/:id/status`
- `POST|GET /api/technician-profiles`, `GET|PATCH|DELETE /api/technician-profiles/:id`, `PATCH /api/technician-profiles/:id/status`

Les statuts autorisés sont `PENDING`, `VERIFIED`, `REJECTED` et `SUSPENDED`. Lorsqu’un profil passe à `VERIFIED`, `verifiedAt` est renseigné et `rejectionReason` est vidé. Lorsqu’un profil passe à `REJECTED`, une raison de rejet peut être transmise.

### Documents KYC/KYB

Les fichiers ne sont pas dupliqués dans les profils. Les documents KYC/KYB restent gérés par le module Documents existant :

- `GET /api/documents/entity/OWNER/:ownerProfileId`
- `GET /api/documents/entity/COMPANY/:companyProfileId`

### Scénario de test

1. Créer un `OwnerProfile`, ajouter un document `OWNER`, vérifier le document puis le profil depuis le CMS.
2. Créer un `CompanyProfile`, ajouter un document `COMPANY`, vérifier le document puis le profil depuis le CMS.
3. Créer un `TechnicianProfile`, puis passer le profil à `VERIFIED` depuis le CMS.

### Limites actuelles

L’authentification Clerk réelle, les permissions serveur complexes, le paiement, le scoring financier et l’investissement fractionné ne sont pas encore implémentés.
