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

## Suivi opérationnel des missions

Le CMS ajoute une entrée `Missions`, un dashboard enrichi et un formulaire de création de mission depuis le détail contrat.

- `/missions` liste les missions, les compteurs opérationnels et les actions de statut.
- `/missions/:id` affiche le détail mission, les engins concernés, les dates, les totaux, les rapports liés et le formulaire d'ajout de rapport.
- `/contracts/:id` permet de créer une mission opérationnelle liée au contrat.

Les statistiques du dashboard sont calculées côté frontend à partir de `GET /api/missions` : total missions, missions planifiées, en transit, sur site, terminées, kilomètres, heures moteur et carburant.

Limites actuelles : suivi manuel uniquement, pas de GPS temps réel, caméra, IoT, application chauffeur, maintenance prédictive, paiement automatique, dividendes ou financement.
