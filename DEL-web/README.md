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
