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

## Authentification temporaire JWT

DEL-api expose une base d’authentification simple email/téléphone + mot de passe, destinée à être remplacée plus tard par Clerk, OAuth, OTP ou un JWT avancé.

### Variables d’environnement

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
ADMIN_EMAILS=
```

### Routes auth

- `POST /api/auth/register` : inscription publique pour `OWNER`, `COMPANY`, `INVESTOR`, `TECHNICIAN` uniquement.
- `POST /api/auth/login` : connexion avec `identifier` email ou téléphone.
- `GET /api/auth/me` : utilisateur connecté, protégé par `Authorization: Bearer <token>`.
- `PATCH /api/auth/me` : mise à jour du profil connecté sans changement de rôle/statut.
- `POST /api/auth/logout` : placeholder, le frontend supprime le token localement.

Les réponses utilisateur ne retournent jamais `passwordHash`.

### Seed admin

Définir `ADMIN_EMAILS=admin@del.com,diaexpressofficial@gmail.com`, puis lancer :

```bash
npm run seed:admin
```

Chaque email reçoit un compte `ADMIN` vérifié avec le mot de passe temporaire `changer-moi-123`.

### Routes protégées

Les changements de statut `PATCH .../:id/status` des modules sensibles sont protégés par `requireAdmin` et nécessitent un token admin. Les lectures `GET` restent publiques pour faciliter les tests de cette étape.

### Limites actuelles

Cette implémentation ne gère pas encore refresh tokens, rotation de secret, révocation serveur, OTP, OAuth, paiement, ni politiques avancées. Le logout est côté client car le JWT est stateless.

## Espaces privés utilisateur (`/api/me`)

Les routes suivantes sont protégées par `Authorization: Bearer <token>` :

- `GET /api/me/equipment` : retourne uniquement les engins dont `ownerUserId` correspond à l’utilisateur connecté.
- `GET /api/me/requests` : retourne uniquement les demandes dont `companyUserId` correspond à l’utilisateur connecté.
- `GET /api/me/documents` : retourne les documents téléversés par l’utilisateur via `uploadedByUserId`.
- `GET /api/me/summary` : retourne l’utilisateur courant et les compteurs privés (`equipment`, `requests`, `documents`, `pendingDocuments`, `verifiedDocuments`, `rejectedDocuments`).

Les modèles conservent des liens utilisateur optionnels pour compatibilité avec les anciens enregistrements : `Equipment.ownerUserId`, `EquipmentRequest.companyUserId` et `Document.uploadedByUserId`.

Les créations publiques restent possibles. Si un token est fourni sur `POST /api/equipment`, `POST /api/requests` ou `POST /api/documents`, l’API rattache automatiquement la ressource à l’utilisateur connecté.

### Scénario de test recommandé

1. Créer un compte `OWNER`, se connecter, déposer un engin et ajouter un document.
2. Vérifier `/api/me/equipment` et `/api/me/documents` avec le token OWNER.
3. Créer un compte `COMPANY`, se connecter, publier une demande et ajouter un document.
4. Vérifier `/api/me/requests` et `/api/me/documents` avec le token COMPANY.
5. Confirmer qu’un compte COMPANY ne voit pas les engins privés du OWNER.

### Limites actuelles

Les documents privés sont filtrés au minimum par `uploadedByUserId`. Les propositions, contrats, factures et permissions fines restent informatifs pour cette étape.

## Routes privées utilisateur `/api/me`

Toutes les routes ci-dessous nécessitent `Authorization: Bearer <token>` et ne retournent que les données liées à l’utilisateur connecté. Les administrateurs continuent d’utiliser DEL-cms pour la vision globale.

- `GET /api/me/proposals` : propositions liées aux demandes de l’entreprise ou aux engins du propriétaire.
- `GET /api/me/contracts` : contrats liés aux demandes de l’entreprise ou aux engins du propriétaire.
- `GET /api/me/invoices` : factures des contrats accessibles à l’utilisateur.
- `GET /api/me/payments` : paiements liés aux factures accessibles à l’utilisateur.
- `GET /api/me/missions` : missions liées aux contrats/demandes de l’entreprise ou aux engins du propriétaire.
- `GET /api/me/financial-summary` : résumé financier (facturé/payé/solde pour entreprise, revenus propriétaire pour owner).
- `GET /api/me/operations-summary` : résumé opérationnel selon le rôle.
- `GET /api/me/summary` inclut maintenant les compteurs équipements, demandes, documents, propositions, contrats, factures, paiements, missions et tickets de maintenance quand applicable.

Limites actuelles : lecture seule côté DEL-web ; acceptation de proposition, signature électronique, paiement en ligne, PDF réel, messagerie, GPS temps réel, dividendes et investissement fractionné restent hors périmètre.

## Workflow d’acceptation des propositions

Le modèle `Proposal` conserve `status` (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`) et ajoute `workflowStatus` (`PENDING_COMPANY`, `PENDING_OWNERS`, `READY_FOR_CONTRACT`, `REJECTED_BY_COMPANY`, `REJECTED_BY_OWNER`, `CANCELLED`, `EXPIRED`). Une proposition envoyée démarre avec `status=SENT`, `workflowStatus=PENDING_COMPANY`, `companyDecision.status=PENDING` et des `ownerDecisions[].status=PENDING`.

Nouveaux champs :
- `companyDecision`: `status`, `decidedByUserId`, `decidedAt`, `rejectionReason`, `notes`.
- `ownerDecisions[]`: `ownerUserId`, `ownerName`, `equipmentIds`, `status`, `decidedAt`, `rejectionReason`, `notes`.

Routes :
- `PATCH /api/me/proposals/:id/company-decision` : décision entreprise authentifiée.
- `PATCH /api/me/proposals/:id/owner-decision` : décision propriétaire authentifié.
- `PATCH /api/proposals/:id/company-decision` : décision entreprise forcée par admin.
- `PATCH /api/proposals/:id/owner-decisions/:index` : décision propriétaire forcée par admin.

La création de contrat via `POST /api/proposals/:id/contracts` exige maintenant `workflowStatus=READY_FOR_CONTRACT` ou `status=ACCEPTED`. En cas de refus, les réservations planning `RESERVED` liées à la proposition passent `CANCELLED` lorsque le module planning est disponible, et les engins encore `RESERVED` sont remis `AVAILABLE` si aucun autre contrat/proposition actif ne les bloque.

Scénarios à valider : entreprise accepte puis propriétaires acceptent => `READY_FOR_CONTRACT`/`ACCEPTED`; entreprise refuse => `REJECTED_BY_COMPANY`; propriétaire refuse => `REJECTED_BY_OWNER`; un autre compte ne doit pas pouvoir décider hors périmètre.

## Notifications internes

DEL-api persiste les notifications internes dans `src/models/Notification.js`. Une notification cible un `recipientUserId` ou un destinataire `SYSTEM`, possède un rôle destinataire, un type métier, une entité liée, une priorité (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) et un état lu/non lu.

Routes disponibles :
- `POST /api/notifications` : création manuelle admin.
- `GET /api/notifications` : liste admin avec `count` et `unreadCount`.
- `GET /api/notifications/:id` : détail admin.
- `DELETE /api/notifications/:id` : suppression admin.
- `GET /api/me/notifications` : notifications de l’utilisateur connecté.
- `PATCH /api/me/notifications/:id/read` : marquer une notification personnelle comme lue.
- `PATCH /api/me/notifications/read-all` : marquer toutes ses notifications comme lues.

Événements couverts : création et décisions de proposition, création de contrat, création/statut de facture, création/statut de paiement, vérification/rejet document, statut engin et statut demande. Les notifications restent internes : aucun email, SMS, WhatsApp, push, WebSocket, Firebase ou cron n’est déclenché.

Scénario de test conseillé : lancer DEL-api, DEL-web et DEL-cms ; créer un OWNER avec un engin ; passer l’engin disponible depuis le CMS ; vérifier `/dashboard/notifications` ; créer une COMPANY, une demande, une proposition, accepter côté COMPANY puis OWNER, créer contrat/facture/paiement et vérifier les notifications utilisateur et `/notifications` côté CMS.

## Appels d’offres multi-lots

DEL distingue désormais les demandes simples (`EquipmentRequest`) et les appels d’offres complexes (`Tender`). Un `TenderLot` représente un lot spécifique rattaché à un appel d’offres. Une `Proposal` peut donc être liée soit à `requestId`, soit à `tenderId` / `tenderLotId`.

Routes principales : `POST /api/tenders`, `GET /api/tenders`, `GET /api/tenders/:id/lots`, `POST /api/tenders/:id/lots`, `GET /api/tender-lots/:id/matches`, `POST /api/tender-lots/:id/proposals`, `GET /api/me/tenders`, `GET /api/me/tender-lots`.

Le matching par lot compare catégorie, statut `AVAILABLE`, pays, ville, prix mensuel et disponibilité planning. La proposition depuis un lot réserve les engins, crée des schedules `RESERVED` si le planning est disponible, puis passe le lot et l’appel d’offres en `PROPOSAL_SENT`.

Limites actuelles : pas d’enchères temps réel, pas de soumission publique propriétaire, pas de scoring IA, pas de signature électronique, pas de paiement en ligne, pas de financement et pas de dividendes.

Scénario de test manuel : lancer DEL-api, DEL-web et DEL-cms, créer depuis DEL-web un appel d’offres avec deux lots, vérifier `/tenders` dans DEL-cms, ouvrir un lot, lancer le matching, sélectionner des engins `AVAILABLE`, créer une proposition et vérifier `/dashboard/tenders` puis `/dashboard/proposals` côté entreprise.

## Rapports PDF DEL

DEL-api génère des PDF simples avec `pdfkit` (dépendance déclarée dans `package.json`). Les routes sont protégées par `requireAuth` et retournent `application/pdf` avec `Content-Disposition: attachment`.

Routes disponibles :
- `GET /api/reports/equipment/:id/pdf`
- `GET /api/reports/proposals/:id/pdf`
- `GET /api/reports/contracts/:id/pdf`
- `GET /api/reports/invoices/:id/pdf`
- `GET /api/reports/missions/:id/pdf`
- `GET /api/reports/maintenance/:id/pdf`
- `GET /api/reports/tenders/:id/pdf`

Sécurité actuelle : les admins peuvent télécharger les rapports. Les engins et appels d’offres vérifient déjà le lien propriétaire/entreprise pour les non-admins ; les autres contrôles métier pourront être renforcés progressivement sans rendre les endpoints publics.

Limites actuelles : pas de signature électronique officielle, pas de QR code, pas de stockage cloud automatique, pas de cache PDF, pas d’envoi email automatique et pas de modèles personnalisables depuis le CMS.

Scénario de test recommandé : lancer l’API, se connecter, télécharger chaque PDF depuis DEL-cms puis vérifier le nom du fichier, l’ouverture du document et la présence des sections principales.

## Paramètres plateforme (PlatformSettings)

DEL-api stocke un document unique `PlatformSettings` avec `key = "default"` dans MongoDB. Il centralise l’identité DEL, les coordonnées, informations légales, devises, préfixes de numérotation, taux par défaut, options métier et textes légaux/publics.

Routes settings :
- `GET /api/settings/public` : lecture publique limitée aux informations utiles au site web.
- `GET /api/settings/admin` : lecture complète, protégée admin.
- `PATCH /api/settings/admin` : mise à jour admin ; `key` n’est pas modifiable.
- `POST /api/settings/reset` : réinitialisation admin vers les valeurs par défaut.

Script :
```bash
npm run seed:settings
```
Il crée le document par défaut s’il n’existe pas et ne l’écrase jamais.

Utilisation actuelle :
- création de contrats : `defaultPlatformCommissionRate` et `contractPrefix` si absents du body ;
- création de factures : `defaultTaxRate`, `defaultPlatformCommissionRate` et `invoicePrefix` si absents du body ;
- paiements : `paymentPrefix` pour la numérotation ;
- rapports PDF : nom légal/plateforme et notices légales simples.

Limites actuelles : pas de multi-tenant, pas de paramètres complexes par pays, pas d’historique détaillé des changements.

Scénario de test manuel : lancer l’API, exécuter `npm run seed:settings`, modifier les paramètres depuis DEL-cms, vérifier `/api/settings/public`, créer contrat/facture sans taux explicite et vérifier les valeurs par défaut.

## Audit Log / Historique des actions

DEL-api persiste les actions importantes dans le modèle `AuditLog` (`src/models/AuditLog.js`). Un log contient l’acteur (`actorUserId`, `actorName`, `actorRole`), l’action, le module, l’entité concernée (`entityType`, `entityId`, `entityLabel`), les valeurs avant/après (`oldValue`, `newValue`), un message, l’IP, le user-agent, la sévérité (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) et `createdAt`.

### Routes audit

Toutes les routes suivantes sont protégées par `requireAdmin` :

- `GET /api/audit-logs` avec filtres `module`, `action`, `actorRole`, `entityType`, `entityId`, `severity`, `dateFrom`, `dateTo`, `limit` (100 derniers logs par défaut, maximum 500).
- `GET /api/audit-logs/:id`.
- `GET /api/audit-logs/entity/:entityType/:entityId`.
- `DELETE /api/audit-logs/:id`.

### Actions et modules loggés

Les actions supportées sont `CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`, `LOGIN`, `LOGOUT`, `REGISTER`, `APPROVE`, `REJECT`, `DOWNLOAD`, `EXPORT`, `PAYMENT_RECORD`, `MESSAGE_SENT`, `NOTIFICATION_SENT`, `SETTINGS_UPDATE` et `SYSTEM`.

Les modules supportés couvrent notamment `AUTH`, `USER`, `OWNER`, `COMPANY`, `TECHNICIAN`, `EQUIPMENT`, `REQUEST`, `TENDER`, `TENDER_LOT`, `PROPOSAL`, `CONTRACT`, `INVOICE`, `PAYMENT`, `DOCUMENT`, `MISSION`, `MISSION_REPORT`, `MAINTENANCE`, `PLANNING`, `REPORT`, `SETTINGS`, `NOTIFICATION`, `MESSAGE` et `SYSTEM`.

L’utilitaire `createAuditLog` ne bloque jamais l’action métier : toute erreur d’audit est seulement journalisée via `console.error`. Les mots de passe ne sont pas stockés dans l’audit.

### Scénario de test recommandé

1. Démarrer l’API avec `npm run dev`.
2. Créer un compte et se connecter pour vérifier `REGISTER` et `LOGIN`.
3. Créer un engin, une demande, une proposition, un contrat, une facture et un paiement.
4. Changer des statuts importants, notamment paiement `CONFIRMED`.
5. Modifier ou réinitialiser les paramètres admin.
6. Consulter `GET /api/audit-logs` et les filtres `module=PAYMENT`, `action=STATUS_CHANGE`, `severity=HIGH`, `entityType=CONTRACT`.

### Limites actuelles

L’export Excel, les alertes automatiques de fraude, l’audit légal avancé, la conservation réglementaire complexe, le diff visuel avancé et la signature cryptographique ne sont pas inclus dans cette étape.

## Exports administratifs

Les exports sont générés par DEL-api et sont disponibles uniquement pour les administrateurs authentifiés avec un token Bearer. Toutes les routes acceptent les filtres `dateFrom`, `dateTo`, `status` et `limit` lorsque cela s’applique.

### Routes disponibles

- `GET /api/exports/equipment?format=csv|json`
- `GET /api/exports/requests?format=csv|json`
- `GET /api/exports/tenders?format=csv|json`
- `GET /api/exports/proposals?format=csv|json`
- `GET /api/exports/contracts?format=csv|json`
- `GET /api/exports/invoices?format=csv|json`
- `GET /api/exports/payments?format=csv|json`
- `GET /api/exports/missions?format=csv|json`
- `GET /api/exports/maintenance?format=csv|json`
- `GET /api/exports/documents?format=csv|json`
- `GET /api/exports/users?format=csv|json`
- `GET /api/exports/audit-logs?format=csv|json`
- `GET /api/exports/full-backup?format=json`

### Formats et sécurité

- `csv` est le format par défaut et inclut un BOM UTF-8 pour une ouverture correcte des accents dans Excel.
- `json` retourne les objets complets lorsque l’export le permet.
- `users` et `full-backup` excluent toujours `passwordHash`.
- Chaque export crée une entrée d’audit `EXPORT` si le module audit est disponible. Le full backup est audité en sévérité `HIGH`.

### Limites actuelles

Le full backup JSON est un export administratif de reporting, de contrôle interne et de sauvegarde manuelle. Ce n’est pas une sauvegarde MongoDB complète et il ne permet pas une restauration automatique de base de données. Les exports sont limités par le paramètre `limit` pour éviter de surcharger l’API.

### Scénario de test manuel

1. Démarrer l’API : `npm install && npm run dev`.
2. Appeler une route sans token admin et vérifier une réponse `401`.
3. Appeler une route avec un utilisateur non admin et vérifier une réponse `403`.
4. Depuis DEL-cms, télécharger Engins CSV/JSON, Contrats CSV, Factures CSV, Paiements CSV, Audit logs JSON et Full backup JSON.
5. Vérifier les noms de fichiers `DEL-<resource>-YYYY-MM-DD.<format>`, l’absence de `passwordHash`, les accents CSV et la création des audits.
