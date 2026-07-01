# DEL-web

Application publique DEL connectée à `DEL-api` pour créer et consulter les engins et demandes.

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
2. Lancer l'application web :

```bash
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Endpoints utilisés

- `GET /api/equipment`
- `GET /api/equipment/:id`
- `POST /api/equipment`
- `GET /api/requests`
- `POST /api/requests`

## Notes de test

- Ouvrir `http://localhost:3000`.
- Déposer un engin via `/deposer-un-engin`.
- Vérifier sa présence dans `/equipment`.
- Ouvrir son détail via `/equipment/:id`.
- Publier une demande via `/demander-des-engins`.

## Visibilité utilisateur du processus DEL

- `/dashboard` explique que les propositions sont préparées par l’équipe DEL après étude des engins disponibles et des demandes.
- `/demander-des-engins` confirme après succès que l’équipe DEL analysera les engins disponibles et fera une proposition.
- `/deposer-un-engin` confirme après succès que l’équipe DEL vérifiera les informations avant placement ou mise en relation.

### Limite actuelle
Aucun espace proposition côté client n’est créé dans cette étape ; le suivi des propositions reste côté `DEL-cms`.

## Information contrats utilisateur

Le dashboard utilisateur contient une section informative “Contrats”. Elle explique qu'après acceptation d'une proposition, l'équipe DEL prépare un contrat numérique avec conditions, durée, prix, responsabilités et modalités de paiement.

Les vrais contrats ne sont pas encore affichés côté utilisateur. La signature électronique et le paiement seront ajoutés dans de prochaines versions.

## Documents liés aux engins et aux demandes

`DEL-web` permet maintenant d'ajouter des documents par URL après deux actions utilisateur :

- après le dépôt d'un engin sur `/deposer-un-engin`, un formulaire facultatif crée un document `entityType=EQUIPMENT`, `entityId=<id engin>`, `status=PENDING` ;
- après la publication d'une demande sur `/demander-des-engins`, un formulaire facultatif crée un document `entityType=REQUEST`, `entityId=<id demande>`, `status=PENDING`.

La page `/equipment/[id]` appelle `GET /api/documents/entity/EQUIPMENT/:id` et affiche les documents disponibles avec titre, type, statut et lien `Voir document`.

### Limites

Le site ne fait pas d'upload réel. L'utilisateur saisit une URL de fichier, par exemple `https://example.com/document.pdf`.

## Information facturation utilisateur

Le dashboard utilisateur affiche une section informative indiquant que les factures et paiements sont actuellement suivis par l'équipe DEL. Les vraies factures, reçus et paiements en ligne ne sont pas encore exposés côté utilisateur.

## Disponibilité publique

La page détail d’un engin affiche uniquement le statut actuel et un message indiquant que l’équipe DEL confirme la disponibilité exacte avant proposition. Le planning complet reste réservé au CMS. Le formulaire `/demander-des-engins` inclut `startDate`, `endDate` et `durationMonths` pour permettre la vérification automatique côté API.

## Onboarding profils DEL

La page `/onboarding` permet de soumettre trois types de profils : propriétaire d’engin, entreprise et technicien/atelier. Après création d’un profil propriétaire ou entreprise, l’utilisateur peut ajouter un document KYC/KYB par URL. Les documents sont créés via le module Documents avec `entityType=OWNER` ou `entityType=COMPANY` et `entityId` égal à l’identifiant du profil créé.

Le dashboard utilisateur rappelle que la vérification d’identité, d’entreprise ou d’atelier est effectuée par l’administration DEL. Limites : pas d’authentification Clerk réelle, pas de paiement et pas d’espace multi-utilisateur complet.

## Authentification web temporaire

DEL-web utilise les routes `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PATCH /api/auth/me` et `POST /api/auth/logout` de DEL-api.

Le token JWT est stocké dans `localStorage` côté client sous `del_token`. Les pages `/login` et `/register` redirigent vers `/dashboard` après succès. Le dashboard appelle `getMe()` et affiche des sections différentes pour `OWNER`, `COMPANY`, `TECHNICIAN`, `INVESTOR` et `ADMIN`.

Les formulaires onboarding, dépôt d’engin et demande d’engins restent utilisables sans compte, mais ils préremplissent et envoient `userId`, `ownerUserId` ou `companyUserId` quand un utilisateur est connecté.

Limite actuelle : cette auth est volontairement simple et pourra être remplacée par Clerk/OAuth/OTP plus tard.

## Dashboard privé DEL-web

Le dashboard `/dashboard` utilise les routes privées DEL-api `/api/me/*` avec le token stocké côté client :

- `/dashboard` : vue générale et compteurs par rôle.
- `/dashboard/equipment` : engins du propriétaire connecté (`ownerUserId`).
- `/dashboard/requests` : demandes de l’entreprise connectée (`companyUserId`).
- `/dashboard/documents` : documents téléversés par l’utilisateur (`uploadedByUserId`).
- `/dashboard/profile` : consultation et modification des champs profil autorisés (`fullName`, `phone`, `country`, `city`, `address`, `avatarUrl`, `preferredLanguage`).

Les formulaires `/deposer-un-engin` et `/demander-des-engins` préremplissent les coordonnées si un utilisateur est connecté et envoient le token afin que l’API rattache automatiquement les données. Les documents ajoutés après un dépôt ou une demande sont liés à l’entité concernée et à l’utilisateur connecté.

### Scénario de validation

1. Lancer DEL-api, DEL-web et DEL-cms.
2. Créer un compte OWNER, déposer un engin, ajouter un document, puis vérifier `/dashboard/equipment` et `/dashboard/documents`.
3. Créer un compte COMPANY, publier une demande, ajouter un document, puis vérifier `/dashboard/requests` et `/dashboard/documents`.
4. Se connecter avec COMPANY et confirmer que les engins du OWNER ne sont pas visibles dans l’espace privé.
5. Modifier la ville ou le téléphone dans `/dashboard/profile` et vérifier le message “Profil mis à jour”.

### Limites actuelles

Pas de paiement en ligne, GPS réel, dividendes, investissement fractionné, messagerie avancée, mobile ou permissions complexes. L’admin reste dans DEL-cms.

## Dashboard privé enrichi

DEL-web consomme désormais les routes privées de DEL-api avec le jeton `Authorization: Bearer <token>` : propositions, contrats, factures, paiements, missions, résumé financier et résumé opérationnel.

Pages ajoutées :

- `/dashboard/proposals` : propositions préparées par DEL.
- `/dashboard/contracts` : contrats gérés par DEL.
- `/dashboard/invoices` : factures et revenus propriétaire.
- `/dashboard/payments` : paiements suivis par DEL.
- `/dashboard/missions` : missions liées aux contrats/engins.

Le dashboard général affiche des cartes financières et opérationnelles selon le rôle OWNER ou COMPANY. Les pages restent en lecture seule : pas d’acceptation en ligne, signature électronique, paiement en ligne, PDF réel, messagerie, GPS temps réel, reversements automatiques, dividendes ou investissement fractionné dans cette étape.

## Propositions : acceptation/refus

Le dashboard utilisateur affiche les propositions avec `status`, `workflowStatus`, `companyDecision` et `ownerDecisions`. Les entreprises peuvent accepter ou refuser via `PATCH /api/me/proposals/:id/company-decision`; les propriétaires peuvent confirmer ou refuser leur disponibilité via `PATCH /api/me/proposals/:id/owner-decision`.

Les cartes `/dashboard` résument les propositions en attente, acceptées et refusées selon le rôle. Limites actuelles : pas de signature électronique, paiement en ligne, notifications email/SMS, messagerie avancée, wallet, dividendes ou GPS réel.

## Notifications utilisateur

DEL-web expose une page `/dashboard/notifications` qui récupère `GET /api/me/notifications`, affiche le nombre de notifications non lues, les badges de type/priorité, les dates, le statut lu/non lu et les actions “Marquer comme lu”, “Tout marquer comme lu” et “Ouvrir” quand `actionUrl` est présent.

Le client API fournit `getMyNotifications()`, `markNotificationAsRead(id)` et `markAllNotificationsAsRead()` avec le token Bearer utilisateur. La navigation du dashboard et la navbar pointent vers cette page. La vue générale affiche une carte “Notifications non lues”. Les limites actuelles restent volontaires : pas de temps réel, push, email, SMS ou WhatsApp.

## Appels d’offres multi-lots

DEL-web expose `/appels-offres/nouveau` pour créer un `Tender` avec plusieurs lots en une seule requête API. Le dashboard entreprise propose `/dashboard/tenders` et `/dashboard/tenders/[id]` pour suivre les appels d’offres et les lots analysés par DEL.

Différence métier : `/demander-des-engins` reste la demande simple, tandis que `/appels-offres/nouveau` couvre les besoins complexes multi-lots. Les propositions liées à un appel d’offres affichent un badge dédié dans `/dashboard/proposals`.

Limites actuelles : suivi manuel DEL, pas d’enchères, pas de soumission publique propriétaire, pas de signature ou paiement en ligne.

## Téléchargement utilisateur des rapports PDF

DEL-web permet aux utilisateurs connectés de télécharger des PDF depuis les espaces privés : `/dashboard/equipment`, `/dashboard/proposals`, `/dashboard/contracts`, `/dashboard/invoices` et `/dashboard/missions`.

Le client `downloadReport(path, filename)` dans `src/lib/api.js` envoie le token utilisateur avec `Authorization: Bearer`, récupère le blob PDF et déclenche le téléchargement. En cas de session expirée, l’interface affiche : “Veuillez vous reconnecter pour télécharger ce document.” En cas d’accès interdit : “Vous n’êtes pas autorisé à télécharger ce document.”

Limites actuelles : les PDF sont générés par DEL-api et restent des documents simples ; ils ne constituent pas une signature électronique officielle. Pas de QR code, stockage cloud, cache PDF ou envoi email automatique.

Scénario de test : se connecter avec un compte OWNER puis télécharger une fiche engin et les documents liés ; se connecter avec un compte COMPANY puis télécharger les propositions, contrats, factures et missions liés.

## Paramètres publics DEL

DEL-web lit `GET /api/settings/public` via `getPublicSettings()` sans token. La page d’accueil utilise les textes publics (`homepageHeroTitle`, `homepageHeroSubtitle`, `homepageCtaText`) et les informations de plateforme avec fallback local si l’API est indisponible.

La Navbar/Footer affichent au minimum le nom de plateforme, le nom légal et les coordonnées publiques. Les pages `/conditions` et `/confidentialite` affichent les textes légaux configurés dans le CMS ou un message indiquant que le texte est à compléter.

Les formulaires publics utilisent les devises activées avec fallback `XOF`, `USD`, `EUR`. Les notices CMS sont affichées sur dépôt d’engin, demande d’engins et appel d’offres. Si les options publiques sont désactivées, le formulaire concerné est bloqué.

Limites actuelles : thème non entièrement dynamique, pages légales simples sans éditeur riche, aucune gestion multi-tenant.

Scénario de test : modifier les paramètres depuis DEL-cms, vérifier l’accueil, `/conditions`, `/confidentialite`, puis désactiver/réactiver le dépôt public pour vérifier le blocage du formulaire.
