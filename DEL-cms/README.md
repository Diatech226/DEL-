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

## Administration des documents

Le CMS ajoute un module `/documents` pour consulter, vérifier, rejeter et supprimer les documents déposés par URL. La sidebar contient l'entrée `Documents`.

Fonctions API utilisées :

- `getDocumentList()` pour `GET /api/documents` ;
- `getDocumentById(id)` pour `GET /api/documents/:id` ;
- `getDocumentsByEntity(entityType, entityId)` pour les sections liées ;
- `updateDocumentStatus(id, status, rejectionReason)` pour `PATCH /api/documents/:id/status` ;
- `deleteDocument(id)` pour `DELETE /api/documents/:id`.

### Workflow admin

- `/documents` affiche un tableau complet avec titre, type, entité, propriétaire ou uploader, statut, date, lien document et actions.
- `/documents/[id]` affiche toutes les métadonnées et les actions `VERIFIED`, `REJECTED`, `DELETE`.
- `/requests/[id]` affiche les documents liés à une demande avec boutons vérifier/rejeter.
- `/contracts/[id]` affiche les documents contrat et permet d'ajouter un document de type `SIGNED_CONTRACT`, `PAYMENT_PROOF`, `DELIVERY_REPORT`, `MISSION_REPORT` ou `OTHER`.
- `/equipment/[id]` affiche les informations principales de l'engin, les documents liés et les actions de changement de statut.
- Le dashboard ajoute les statistiques total documents, documents en attente, vérifiés et rejetés.

### Scénario de test documents

Démarrer l'API, le web et le CMS. Déposer un engin dans le web, ajouter un document URL, vérifier sa présence dans `/documents`, le passer `VERIFIED`, puis tester `REJECTED` avec une raison. Publier une demande avec un document entreprise, vérifier la section documents de `/requests/[id]`. Ouvrir un contrat et ajouter un document contrat, puis vérifier son apparition dans `/documents`.

### Limites

Pas d'upload cloud réel ni de signature électronique. Les documents sont des URL saisies manuellement et rattachées aux entités via `entityType` et `entityId`.

## Module facturation CMS

Le CMS ajoute les écrans `/invoices`, `/invoices/[id]` et `/payments` pour suivre les factures et paiements manuels. Le détail contrat contient un formulaire de création de facture. Le dashboard calcule côté frontend les indicateurs financiers : total factures, factures payées/en attente/en retard, total facturé, encaissé, solde restant et commission DEL estimée.

### Scénario de test manuel
1. Créer un contrat actif depuis une proposition.
2. Depuis le détail contrat, créer une facture.
3. Vérifier la facture dans `/invoices`, puis ouvrir son détail.
4. Enregistrer un paiement partiel : la facture passe `PARTIALLY_PAID`.
5. Enregistrer un second paiement : la facture passe `PAID` et le solde vaut 0.
6. Rejeter ou annuler un paiement : la facture est recalculée à partir des paiements `CONFIRMED`.

### Limites
Le CMS ne déclenche aucun paiement réel : il sert uniquement au suivi administratif manuel avec référence et URL de preuve.

## Planning des engins

Le CMS ajoute `/planning` pour consulter les périodes `EquipmentSchedule`, filtrer par type/statut/engin/période, bloquer manuellement un engin et gérer les statuts `ACTIVE`, `CANCELLED`, `COMPLETED`. La fiche engin affiche son planning et un mini-formulaire de vérification de disponibilité. La fiche demande affiche la disponibilité issue du matching et un message dédié quand aucun engin n’est disponible sur la période.

## Administration profils et KYC/KYB

Le CMS ajoute les sections `/users`, `/owners`, `/companies` et `/technicians`. Les listes affichent les profils, leurs badges de rôle/statut et des actions rapides `VERIFIED`, `REJECTED` et `SUSPENDED`.

Les détails `/owners/:id` et `/companies/:id` affichent toutes les informations du profil, les documents liés via le module Documents (`OWNER/:id` ou `COMPANY/:id`) et les actions de vérification/rejet des documents et profils. Le détail `/technicians/:id` affiche les spécialités, zones d’intervention, statut et notes.

Le dashboard calcule côté frontend les statistiques profils : utilisateurs, propriétaires/entreprises/techniciens en attente, profils vérifiés/rejetés et documents KYC/KYB en attente. Limites actuelles : pas de permissions serveur complexes ni d’espace multi-utilisateur complet.
