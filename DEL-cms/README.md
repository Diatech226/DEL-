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

## Authentification CMS admin

DEL-cms possède une page `/login` qui appelle `POST /api/auth/login`. Après connexion, le CMS vérifie que `user.role === 'ADMIN'`; sinon le token est supprimé et l’accès est refusé.

Le token admin est stocké côté client sous `del_cms_token` et ajouté aux appels PATCH de changement de statut via `Authorization: Bearer <token>`. `AdminGuard` protège les pages principales et affiche un message clair en cas de session expirée ou d’accès refusé.

Pour créer un admin dans DEL-api :

```bash
ADMIN_EMAILS=diaexpressofficial@gmail.com npm run seed:admin
```

Mot de passe temporaire : `changer-moi-123`.

Limite actuelle : le logout supprime simplement le token local car le JWT est stateless.

## Administration des décisions de proposition

La page propositions affiche `status`, `workflowStatus`, la décision entreprise et le résumé des décisions propriétaires. L’admin peut forcer une décision entreprise avec `PATCH /api/proposals/:id/company-decision` et une décision propriétaire avec `PATCH /api/proposals/:id/owner-decisions/:index`, notamment lorsque `ownerUserId` est absent.

Le bouton “Créer contrat” n’est affiché que si la proposition est `READY_FOR_CONTRACT` ou `ACCEPTED`; sinon l’interface indique que les validations entreprise/propriétaire sont attendues. Après création depuis une demande, le message attendu est : “Proposition envoyée. En attente d’acceptation par l’entreprise et les propriétaires.”

## Notifications admin

DEL-cms ajoute `/notifications` pour consulter toutes les notifications internes DEL-api, créer une notification manuelle et supprimer une notification. Le client API fournit `getNotificationList()`, `createNotificationManual(payload)` et `deleteNotification(id)` avec le token admin.

Le dashboard admin affiche les statistiques : total notifications, non lues, priorité HIGH, priorité CRITICAL et notifications système. La sidebar contient le lien “Notifications”. Les notifications sont uniquement internes en base de données : aucun email, SMS, WhatsApp, push, WebSocket, Firebase ou cron n’est encore implémenté.

## Appels d’offres multi-lots

DEL-cms ajoute `/tenders` pour piloter les appels d’offres, `/tenders/[id]` pour consulter les détails et lots, et `/tender-lots/[id]` pour lancer le matching par lot et créer une proposition manuelle.

Routes API utilisées : `GET /api/tenders`, `PATCH /api/tenders/:id/status`, `GET /api/tenders/:id/lots`, `GET /api/tender-lots/:id/matches`, `POST /api/tender-lots/:id/proposals`.

Scénario de validation : créer un appel d’offres multi-lots dans DEL-web, vérifier sa présence dans `/tenders`, ouvrir le détail, consulter le matching d’un lot, sélectionner des engins compatibles, créer une proposition et vérifier `/proposals`.

Limites actuelles : logique CMS manuelle, pas d’enchères temps réel, pas de scoring IA avancé, pas de signature électronique ni paiement en ligne.

## Téléchargement des rapports PDF

DEL-cms expose des boutons **Télécharger PDF** sur les listes et détails d’engins, propositions, contrats, factures, missions, maintenance et appels d’offres. Les téléchargements utilisent `downloadReport(path, filename)` dans `src/lib/api.js`, qui envoie le token admin avec `Authorization: Bearer` et déclenche un téléchargement blob côté navigateur.

PDF disponibles depuis l’administration : fiche engin, proposition, contrat, facture, rapport de mission, rapport maintenance et appel d’offres. Les documents sont générés par DEL-api via `/api/reports/...`.

Limites actuelles : ces PDF sont des documents numériques simples et ne remplacent pas une signature électronique officielle. Aucun QR code, stockage cloud, cache ou envoi email automatique n’est encore implémenté.

Scénario de test : lancer DEL-api puis DEL-cms sur le port 3001, se connecter admin, ouvrir chaque liste/détail concerné et vérifier que le bouton télécharge un PDF lisible avec un nom de fichier DEL cohérent.

## Module Paramètres CMS

DEL-cms expose une page `/settings` protégée par la session admin. Elle lit `GET /api/settings/admin`, sauvegarde via `PATCH /api/settings/admin` et peut réinitialiser via `POST /api/settings/reset`.

La page permet d’administrer : identité DEL, coordonnées, informations légales, devises, taux de commission/taxe, préfixes facture/contrat/paiement, options métier, textes légaux et textes publics. Le dashboard affiche aussi une carte avec la commission par défaut, la devise par défaut, les modules activés et un lien vers `/settings`.

Limites actuelles : pas d’éditeur riche avancé, pas de permissions fines ni historique détaillé des changements.

Scénario de test : se connecter admin, ouvrir `/settings`, modifier `platformName`, `slogan`, `defaultPlatformCommissionRate`, `defaultCurrency`, `enabledCurrencies`, `homepageHeroTitle` et `termsOfService`, sauvegarder, puis vérifier DEL-web et les créations contrat/facture.

## Audit Log dans DEL-cms

DEL-cms expose une page globale `/audit` réservée aux administrateurs. Elle utilise le token admin stocké côté CMS et les routes `requireAdmin` de DEL-api.

### Fonctions API ajoutées

`src/lib/api.js` expose :

- `getAuditLogs(filters)` ;
- `getAuditLogById(id)` ;
- `getAuditLogsByEntity(entityType, entityId)` ;
- `deleteAuditLog(id)`.

### Page `/audit`

La page affiche les 100 derniers logs par défaut avec les colonnes date, acteur, rôle, action, module, entité, label, message, sévérité et une action de détail. Les filtres simples disponibles sont `module`, `action`, `actorRole`, `entityType`, `severity`, `dateFrom` et `dateTo`.

### Page détail `/audit/[id]`

La page détail affiche l’acteur, le rôle, l’action, le module, l’entité, `oldValue` et `newValue` en JSON lisible, le message, l’adresse IP, le user-agent, la sévérité et la date de création.

### Dashboard

Le dashboard calcule des statistiques simples à partir des audit logs récents : actions aujourd’hui, connexions aujourd’hui, changements de statut, actions critiques/hautes, paiements enregistrés et paramètres modifiés.

### Limites actuelles

Cette étape n’ajoute pas d’export Excel, d’alertes automatiques, de diff visuel avancé ou de fonctionnalités réglementaires complexes. L’historique récent dans les pages détail métier pourra être ajouté ultérieurement si nécessaire.

## Module Exports & sauvegarde

DEL-cms expose une page administrateur `/exports` pour télécharger les données importantes produites par DEL-api.

### Exports disponibles

La page permet de télécharger en CSV ou JSON : engins, demandes simples, appels d’offres, propositions, contrats, factures, paiements, missions, maintenance, documents, utilisateurs et audit logs. Une section séparée permet aussi de télécharger la sauvegarde administrative complète en JSON uniquement.

### Filtres

Les filtres globaux disponibles sont : `dateFrom`, `dateTo`, `status` et `limit`. Ils sont transmis à DEL-api sous forme de query params sur `/api/exports/:resource`.

### Sécurité et limites

Les téléchargements envoient le token admin stocké côté navigateur. DEL-api refuse les requêtes sans token ou sans rôle `ADMIN`. La sauvegarde complète JSON est un export administratif, pas une restauration MongoDB ; elle sert au contrôle interne, au reporting et à la sauvegarde manuelle.

### Scénario de test manuel

1. Démarrer DEL-api : `cd DEL-api && npm install && npm run dev`.
2. Démarrer DEL-cms : `cd DEL-cms && npm install && npm run dev -- -p 3001`.
3. Se connecter comme administrateur, ouvrir `/exports`, puis télécharger Engins CSV/JSON, Contrats CSV, Factures CSV, Paiements CSV, Audit logs JSON et Full backup JSON.
4. Vérifier les téléchargements, les noms de fichiers, l’absence de `passwordHash` dans les exports utilisateurs/full backup et la création des entrées audit.
