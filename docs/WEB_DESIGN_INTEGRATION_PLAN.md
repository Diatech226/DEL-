# Plan d'intégration du nouveau design web DEL

Date d'analyse : 2026-07-02.

## 1. Résumé du nouveau design

Le dossier `DEL-web-main` contient un prototype Vite/React TypeScript centré sur une expérience premium de marketplace B2B d'engins : accueil marketing, catalogue, détail engin, dépôt, demande, appels d'offres, dashboards propriétaire/entreprise, propositions, contrats, factures, missions, maintenance, documents et profil.

Qualité visuelle : élevée. Le design apporte une direction graphique plus premium que l'interface actuelle : cartes denses, dashboard riche, sidebar métier, interactions avec `motion`, icônes `lucide-react`, graphiques `recharts`, typographie Inter/JetBrains Mono et états visuels complets pour maintenance, conformité VGP, finance et opérations.

Point important : ce n'est pas une application Next.js. C'est une SPA Vite avec routage simulé en état React (`activeScreen`) et données mockées en mémoire. Il ne faut donc pas copier directement `src/App.tsx` dans `DEL-web`; il faut extraire les composants/sections utiles, les adapter au routing App Router de Next.js 15 et remplacer les mocks par `DEL-web/src/lib/api.js`.

### Framework et dépendances détectés

- Framework : Vite 6 + React 19 + TypeScript.
- Routing : aucun routeur réel; navigation interne via `activeScreen`.
- Styling : Tailwind CSS 4 via `@tailwindcss/vite`, `@import "tailwindcss"`, thème CSS local.
- UI/animation : `lucide-react`, `motion`.
- Graphiques : `recharts`.
- Dépendances non nécessaires à l'intégration web cible à auditer : `@google/genai`, `express`, `dotenv` dans le prototype.

### Pages/écrans détectés

- Accueil Premium
- Connexion / Inscription
- Dashboard Propriétaire
- Dashboard Entreprise
- Liste des Engins
- Détail de l'Engin
- Déposer un Engin
- Demander des Engins
- Appels d'Offres
- Propositions
- Gestion des Contrats
- Factures
- Suivi des Missions
- Liste Maintenance
- Calendrier Maintenance
- Coffre-fort Documents
- Profil Utilisateur
- Panneau d'alertes maintenance/email simulé

## 2. Structure de `DEL-web-main`

```text
DEL-web-main/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts
│   ├── data.ts
│   ├── context/LanguageContext.tsx
│   └── components/
│       ├── AccueilPremium.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── ListeEngins.tsx
│       ├── DetailEngin.tsx
│       ├── DeposerEngin.tsx
│       ├── DemanderEngin.tsx
│       ├── AppelsOffres.tsx
│       ├── DashboardProprietaire.tsx
│       ├── DashboardEntreprise.tsx
│       ├── Propositions.tsx
│       ├── GestionContrats.tsx
│       ├── Factures.tsx
│       ├── SuiviMissions.tsx
│       ├── ListeMaintenance.tsx
│       ├── CalendrierMaintenance.tsx
│       ├── CoffreFort.tsx
│       ├── ProfilUtilisateur.tsx
│       ├── Connexion.tsx
│       └── AlertPanel.tsx
└── README.md / metadata.json / .env.example
```

### Fichiers importants

- `src/App.tsx` : orchestration complète du prototype, état global mocké, navigation simulée, handlers de création/acceptation/signature simulés.
- `src/data.ts` : source principale des données mockées.
- `src/types.ts` : types métier du prototype.
- `src/index.css` : Tailwind 4, polices Google, thème et scrollbar.
- `src/context/LanguageContext.tsx` : internationalisation locale partielle FR/EN utilisée notamment dans le catalogue.

### Design system local

Le design n'a pas de vraie librairie UI séparée. Les composants embarquent directement beaucoup de classes Tailwind. Les patterns réutilisables à extraire sont : cartes KPI, badges de statut, tables financières, cartes équipement, panneaux d'alerte, layout dashboard, sidebar, hero premium, formulaires sectionnés.

## 3. Comparaison avec `DEL-web`

### État actuel de `DEL-web`

`DEL-web` est déjà une application Next.js 15 App Router avec React 19, Tailwind 3, routes publiques et dashboard. Elle contient aussi une couche API prête dans `src/lib/api.js` avec authentification token/localStorage protégée côté client, endpoints `me`, equipment, requests, tenders, proposals, contracts, invoices, payments, missions, documents et rapports PDF.

Routes déjà présentes :

- `/`
- `/equipment`
- `/equipment/[id]`
- `/deposer-un-engin`
- `/demander-des-engins`
- `/appels-offres/nouveau`
- `/login`
- `/register`
- `/onboarding`
- `/dashboard`
- `/dashboard/equipment`
- `/dashboard/requests`
- `/dashboard/tenders`
- `/dashboard/tenders/[id]`
- `/dashboard/proposals`
- `/dashboard/contracts`
- `/dashboard/invoices`
- `/dashboard/payments`
- `/dashboard/missions`
- `/dashboard/documents`
- `/dashboard/notifications`
- `/dashboard/messages`
- `/dashboard/profile`
- pages légales `/conditions`, `/confidentialite`

### Ce qui est meilleur dans `DEL-web-main`

- Direction visuelle plus aboutie pour la homepage, les dashboards et les cartes équipement.
- Dashboard propriétaire plus riche : parc, disponibilité, revenus, alertes maintenance.
- Dashboard entreprise plus opérationnel : engins loués, budget, devis, suivi terrain.
- Écrans métier plus immersifs : suivi mission, conformité VGP, coffre-fort, factures exportables visuellement.
- Composants premium réutilisables : Sidebar, Header, AlertPanel, cartes KPI, badges, panneaux de détail.

### Ce qu'il faut garder dans `DEL-web`

- App Router Next.js et structure de routes existante.
- `src/lib/api.js`, déjà aligné avec `DEL-api`.
- `AuthGuard`, layout dashboard, états `LoadingState`, `ErrorState`, `EmptyState`, composants `Button`, `Card`, `Badge`, `StatusBadge`.
- Pages légales et logique d'authentification actuelle.
- Séparation DEL-api / DEL-web / DEL-cms : aucun workspace ou package partagé à créer.

### Conflits et incompatibilités

- `DEL-web-main` est Vite SPA; `DEL-web` est Next App Router.
- `DEL-web-main` utilise Tailwind 4; `DEL-web` utilise Tailwind 3. Migrer Tailwind dans cette étape serait risqué; mieux vaut adapter les classes compatibles ou migrer Tailwind dans une phase dédiée.
- `motion` est importé depuis `motion/react`; il faudra installer `motion` ou remplacer par transitions CSS.
- `recharts` et `lucide-react` manquent dans `DEL-web`.
- Les composants du prototype sont probablement tous client-side; dans Next, il faudra ajouter `"use client"` seulement aux composants interactifs.
- Les données prototype utilisent des statuts français/minuscules (`available`, `rented`, `En attente`) alors que l'API utilise des enums anglais/majuscules (`AVAILABLE`, `RESERVED`, `PENDING_REVIEW`, etc.).

## 4. Mapping pages → API

| Page design | Route frontend cible | Données nécessaires | Endpoint DEL-api | Statut | Action |
| ----------- | -------------------- | ------------------- | ---------------- | ------ | ------ |
| Accueil Premium | `/` | settings publiques, stats marketing éventuelles, CTA | `GET /api/settings/public` | prêt partiel | Garder hero/sections; éviter stats fake ou les dériver d'un endpoint stats futur. |
| Liste engins | `/equipment` | liste engins, filtres catégorie/statut/ville/prix | `GET /api/equipment` | prêt | Remplacer `INITIAL_MACHINES` par `getEquipmentList()`, mapper `rentalPricePerDay`, `photos[0]`, `locationText/city`. |
| Détail engin | `/equipment/[id]` | engin, documents liés, maintenance liée, disponibilité | `GET /api/equipment/:id`, `GET /api/documents/entity/equipment/:id`, `GET /api/maintenance/equipment/:equipmentId`, `GET /api/equipment-schedules/equipment/:equipmentId/availability` | prêt partiel | Adapter fiche technique; masquer les champs VGP si absents; ajouter loading/error/empty. |
| Déposer engin | `/deposer-un-engin` | formulaire propriétaire/engin/services/documents | `POST /api/equipment`, `POST /api/documents` | prêt partiel | Mapper formulaire vers modèle Equipment; upload réel absent, documents actuellement URLs. |
| Demande engins | `/demander-des-engins` | besoin entreprise, quantité, dates, options | `POST /api/requests` | prêt | Mapper vers EquipmentRequest (`equipmentCategory`, `quantity`, `workSiteLocation`, `driverRequired`, etc.). |
| Appels d'offres | `/appels-offres/nouveau`, éventuellement `/dashboard/tenders` | tender, lots, budget, conditions | `GET/POST /api/tenders`, `GET/POST /api/tenders/:id/lots` | prêt partiel | Le design liste des AO; `DEL-web` a surtout création et dashboard. Créer une page publique/liste si validé. |
| Login/Register | `/login`, `/register` | email, password, profil | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` | prêt | Ne pas migrer la simulation; conserver flux token existant et améliorer UI. |
| Dashboard | `/dashboard` | résumé utilisateur, finance, opérations, notifications | `GET /api/me/summary`, `/api/me/financial-summary`, `/api/me/operations-summary`, `/api/me/notifications` | prêt | Remplacer widgets actuels progressivement par cartes premium. |
| Propositions | `/dashboard/proposals` | propositions reçues/envoyées, décisions | `GET /api/me/proposals`, `PATCH /api/me/proposals/:id/company-decision`, `PATCH /api/me/proposals/:id/owner-decision` | prêt | Mapper statuts et actions; ne pas générer contrat côté frontend. |
| Contrats | `/dashboard/contracts` | contrats, signature/statut, PDF | `GET /api/me/contracts`, `GET /api/reports/contracts/:id/pdf`; admin `PATCH /api/contracts/:id/status` | prêt partiel | La signature électronique du design est simulée; endpoint utilisateur de signature à documenter. |
| Factures | `/dashboard/invoices` | factures, paiements, PDF | `GET /api/me/invoices`, `GET /api/me/payments`, `GET /api/reports/invoices/:id/pdf` | prêt | Connecter tableaux et totaux; garder export PDF API. |
| Missions | `/dashboard/missions` | missions, statut, rapports | `GET /api/me/missions`, `GET /api/reports/missions/:id/pdf`, `/api/mission-reports` | prêt partiel | Mapper télémétrie design; fuel/currentTask souvent absents ou dans rapports. |
| Documents | `/dashboard/documents` | documents utilisateur/entity, statut, expiration | `GET /api/me/documents`, `POST /api/documents`, `GET /api/documents/entity/:type/:id` | prêt partiel | Upload fichier réel absent; coffre-fort peut démarrer avec URLs/metadata. |
| Profil | `/dashboard/profile` | utilisateur, profils owner/company/technician | `GET/PATCH /api/auth/me`, `/api/owner-profiles`, `/api/company-profiles`, `/api/technician-profiles` | prêt | Adapter `UserProfile` vers User API et profils séparés. |
| Maintenance | `/dashboard/equipment` ou future `/dashboard/maintenance` | tickets, calendrier, alertes | `GET/POST /api/maintenance`, `GET /api/maintenance/equipment/:equipmentId` | prêt partiel | `DEL-web` n'a pas de route maintenance dédiée; créer après validation. |

## 5. Mapping composants

| Composant design | Usage | À migrer ? | Adaptation nécessaire |
| ---------------- | ----- | ---------- | --------------------- |
| `AccueilPremium` | Homepage premium | Oui | Découper en sections Next, remplacer stats fake par settings/stats réelles ou statiques assumées. |
| `Header` | Topbar app/demo | Partiel | Fusionner avec `Navbar`; enlever navigation par `activeScreen`. |
| `Sidebar` | Navigation dashboard | Oui | Mapper vers liens Next `/dashboard/...`; intégrer AuthGuard. |
| `ListeEngins` | Catalogue | Oui | Remplacer props mocks par `getEquipmentList`, mapper champs API, ajouter empty/error/loading. |
| `DetailEngin` | Fiche engin et conformité | Oui | Mapper API, documents, maintenance; éviter impression/export simulés si non branchés. |
| `DeposerEngin` | Formulaire dépôt | Oui | Adapter payload `createEquipment`; validation côté client. |
| `DemanderEngin` | Formulaire demande | Oui | Adapter payload `createEquipmentRequest`. |
| `AppelsOffres` | Liste AO | Oui mais route à définir | Brancher `/api/tenders`; gérer lots/proposals séparément. |
| `DashboardProprietaire` | Dashboard owner | Oui | Alimenter avec `/api/me/*`; recalcul KPI côté frontend. |
| `DashboardEntreprise` | Dashboard company | Oui | Alimenter avec `/api/me/requests`, tenders, missions, financial summary. |
| `Propositions` | Suivi offres | Oui | Actions via endpoints décision; statuts API. |
| `GestionContrats` | Contrats | Oui | Ne pas simuler signature; afficher actions réellement supportées. |
| `Factures` | Factures/export visuel | Oui | Export PDF via `downloadReport`; paiements via `/api/me/payments`. |
| `SuiviMissions` | Missions opérationnelles | Oui partiel | Champs télémétrie absents à masquer ou documenter. |
| `ListeMaintenance` | Tickets maintenance | Oui partiel | Créer route cible si souhaité; mapper tickets API. |
| `CalendrierMaintenance` | Vue calendrier | Partiel | Peut attendre; dépend de schedules/maintenance. |
| `CoffreFort` | Documents | Oui | Remplacer upload local par métadonnées/documents API. |
| `ProfilUtilisateur` | Profil | Oui | Mapper vers auth/me et profils dédiés. |
| `Connexion` | Login/register démo | Non direct | Reprendre seulement style; garder auth réelle existante. |
| `AlertPanel` | Alertes maintenance/email | Partiel | Remplacer emails simulés par notifications API et calculs maintenance. |

## 6. Données mockées à remplacer

Tous les mocks principaux sont dans `DEL-web-main/src/data.ts` et sont typés dans `DEL-web-main/src/types.ts`.

| Mock | Fichier | Structure | Endpoint réel | Champs à mapper |
| ---- | ------- | --------- | ------------- | --------------- |
| `INITIAL_USER` | `src/data.ts` | `UserProfile` | `GET /api/auth/me`, profils `/api/owner-profiles`, `/api/company-profiles` | `fullName` ↔ user name selon modèle, `companyName`, `siret`, `role` ↔ `OWNER/COMPANY/ADMIN`, `phone`, `address`, `rib` probablement profil. |
| `INITIAL_MACHINES` | `src/data.ts` | `Machine[]` | `GET /api/equipment`, `GET /api/me/equipment` | `id` ↔ `_id`, `dailyPrice` ↔ `rentalPricePerDay`, `location` ↔ `locationText/city`, `imageUrl` ↔ `photos[0]`, `hourCounter` ↔ `engineHours`, `status` enum à transformer. |
| `INITIAL_MAINTENANCE_LOGS` | `src/data.ts` | `MaintenanceLog[]` | `GET /api/maintenance`, `GET /api/maintenance/equipment/:equipmentId` | `machineId` ↔ `equipmentId`, `type`, `date`, `cost`, `technician`, `status`; vérifier modèle API pour `remarks/partsReplaced`. |
| `INITIAL_CONTRACTS` | `src/data.ts` | `Contract[]` | `GET /api/me/contracts`, `GET /api/contracts/:id` | `machineName/image`, parties client/owner, dates, total, deposit, status; assurance souvent absente. |
| `INITIAL_TENDERS` | `src/data.ts` | `Tender[]` | `GET /api/tenders`, `GET /api/me/tenders` | `machineType/minWeight/maxBudget` vers Tender/Lot; `clientCompany`, `durationMonths`, `location` ↔ `country/city/siteLocationText`. |
| `INITIAL_PROPOSALS` | `src/data.ts` | `Proposal[]` | `GET /api/me/proposals`, `GET /api/proposals` | `priceOffered`, `duration`, `startDate`, `status`; décisions owner/company dans API. |
| `INITIAL_INVOICES` | `src/data.ts` | `Invoice[]` | `GET /api/me/invoices`, `GET /api/invoices` | `amount`, `date/dueDate`, `status`, `clientCompany`, `engineName`, `paymentMethod`; type à mapper. |
| `INITIAL_DOCUMENTS` | `src/data.ts` | `DocumentFile[]` | `GET /api/me/documents`, `POST /api/documents` | `name`, `category`, `expiryDate`, `status`, `url`; upload réel absent. |
| `INITIAL_MISSIONS` | `src/data.ts` | `Mission[]` | `GET /api/me/missions`, `GET /api/missions` | `contractId`, `machineId`, `driverName`, `location`, `status`; `fuelLevel/currentTask/hourCounter` peuvent manquer. |
| `simulatedEmails` | `src/App.tsx` | alertes email locales | `GET /api/me/notifications` | Remplacer par notifications API; calcul d'alerte maintenance côté backend ou frontend. |

## 7. Fonctions API frontend à créer ou adapter

`DEL-web/src/lib/api.js` contient déjà beaucoup de fonctions nécessaires : `getPublicSettings`, `login`, `register`, `getMe`, `updateMe`, `getMySummary`, `getMyEquipment`, `getMyRequests`, `getMyDocuments`, `getMyProposals`, `getMyContracts`, `getMyInvoices`, `getMyPayments`, `getMyMissions`, `getEquipmentList`, `getEquipmentById`, `createEquipment`, `createEquipmentRequest`, `createTender`, `getMyTenders`, `getMyTenderLots`, `getTenderById`, `getTenderLotsByTender`, `downloadReport`.

Fonctions utiles à ajouter ou vérifier pour l'intégration du design :

- `getTenderList()` → `GET /api/tenders`
- `getTenderLotMatches(id)` → `GET /api/tender-lots/:id/matches`
- `createProposal(payload)` → `POST /api/proposals`
- `createProposalFromTenderLot(id, payload)` → `POST /api/tender-lots/:id/proposals`
- `getMaintenanceTickets()` → `GET /api/maintenance`
- `getMaintenanceByEquipment(equipmentId)` → `GET /api/maintenance/equipment/:equipmentId`
- `createMaintenanceTicket(payload)` → `POST /api/maintenance`
- `getEquipmentAvailability(equipmentId)` → `GET /api/equipment-schedules/equipment/:equipmentId/availability`
- `checkEquipmentAvailability(payload)` → `POST /api/equipment-schedules/check-availability`
- `getMissionReportsByMission(missionId)` → `GET /api/mission-reports/mission/:missionId`
- `getDocumentsByEntity(entityType, entityId)` existe déjà, à utiliser davantage.

## 8. Champs manquants ou à transformer

### Présents dans le design mais absents/peu évidents dans l'API

- `Machine.weight`, `enginePower`, `bucketCapacity`, `fuelType`, `vgpCertDate`, `nextMaintenanceDate` : pas dans le modèle `Equipment` actuel; certains peuvent être documents/maintenance mais pas champs directs.
- `Machine.dailyPrice` se mappe à `rentalPricePerDay`, mais prix mensuel et devise sont plus riches côté API.
- `Machine.location` doit être composé depuis `locationText`, `city`, `country`.
- `Mission.fuelLevel`, `currentTask`, `operatorContact`, `siteSupervisor` : télémétrie/terrain non garantie côté modèle mission.
- `UserProfile.subscription`, `isVip`, `rib` : probablement absents du modèle User et à placer dans profils/settings si nécessaires.
- `Contract.insuranceOption`, `deposit`, `signatureDate` : vérifier modèle; signature utilisateur non exposée en endpoint dédié.
- `Document.size`, `expiryDate`, statut métier `À renouveler` : vérifier modèle Document.

### Présents dans l'API mais absents ou sous-utilisés dans le design

- `Equipment.services` : forSale, forRent, minePlacement, btpPlacement, fullManagement, gpsTracking, cameraTracking, maintenanceIncluded, insuranceIncluded, driverIncluded.
- `Equipment.condition`, `score`, `scoreLabel`, `currency`, `rentalPricePerMonth`, `salePrice`.
- `EquipmentRequest.priceUnit`, options fuel/maintenance/insurance.
- `Tender.projectType`, `paymentTerms`, `specialConditions`, documents.
- Workflows admin, audit logs, exports CSV, payments détaillés.

## 9. Endpoints manquants à documenter

Ne pas créer maintenant; à envisager après validation fonctionnelle :

- `GET /api/public/stats` : statistiques homepage réelles (engins, missions, clients, disponibilité).
- `POST /api/documents/upload` ou stockage fichier réel : le modèle actuel prend surtout des URLs/métadonnées.
- `PATCH /api/me/contracts/:id/sign` : signature électronique côté utilisateur.
- `GET /api/me/maintenance-alerts` : alertes maintenance agrégées pour dashboard propriétaire.
- `GET /api/me/calendar` : calendrier unifié maintenance/missions/disponibilités.
- Endpoints télémétrie mission (`fuelLevel`, position temps réel, tâche courante) si le suivi opérationnel doit être réel.
- Endpoint profil consolidé `GET/PATCH /api/me/profile` agrégeant User + OwnerProfile/CompanyProfile.

## 10. Plan d'intégration étape par étape

### Phase 1 — Préparer `DEL-web`

- Sauvegarder l'existant par commit/branche.
- Installer uniquement les dépendances validées : `lucide-react`, `motion` si animations conservées, `recharts` si graphiques conservés.
- Ne pas migrer Tailwind 3 vers 4 immédiatement; adapter les classes compatibles.
- Créer des adaptateurs de mapping API dans `DEL-web` (ex. `mapEquipmentToDesignCard`) plutôt que modifier l'API pour chaque besoin visuel.
- Définir quels composants deviennent client components.

### Phase 2 — Migrer layout public

- Fusionner `AccueilPremium` avec `/`.
- Adapter `Header` à `Navbar` existante.
- Conserver `Footer` actuel sauf amélioration visuelle validée.

### Phase 3 — Migrer pages publiques

- Catalogue `/equipment`.
- Détail `/equipment/[id]`.
- Déposer un engin `/deposer-un-engin`.
- Demander des engins `/demander-des-engins`.
- Appels d'offres : enrichir `/appels-offres/nouveau` et décider d'une liste publique `/appels-offres` ou dashboard uniquement.

### Phase 4 — Connecter API

- Remplacer tous les imports `INITIAL_*` par fonctions `src/lib/api.js`.
- Ajouter systématiquement loading/error/empty.
- Gérer token uniquement via helpers existants; éviter `localStorage` côté serveur.
- Mapper statuts API vers badges design.

### Phase 5 — Migrer dashboard

- Migrer `Sidebar` puis dashboards owner/company.
- Connecter propositions, contrats, factures, missions, documents, notifications.
- Ajouter maintenance seulement si route validée.

### Phase 6 — Tests

- `npm run build` dans `DEL-web`.
- `npm run dev` pour vérification manuelle.
- Workflow démo : inscription/login, dépôt engin, catalogue, demande, dashboard, PDF.

## 11. Risques

- Casser l'auth si la simulation `Connexion` remplace le flux token existant.
- Casser les routes si la navigation `activeScreen` est copiée au lieu d'utiliser Next App Router.
- Conflit Tailwind 4 vs Tailwind 3.
- Dépendances lourdes/inutiles (`@google/genai`, `express`, `dotenv`) à ne pas importer dans `DEL-web`.
- Composants très client-side : risque d'erreurs hydration si `window/localStorage/Date` sont utilisés dans des server components.
- Statuts et champs non alignés entre mocks et API.
- Images externes Unsplash : config Next Image à vérifier ou remplacer par `<img>`/domaines configurés.
- Données sensibles simulées (RIB, emails) à éviter en prod.
- Build du prototype non vérifié à cause d'un blocage d'installation npm.

## 12. Vérification build de `DEL-web-main`

Commande tentée dans `DEL-web-main` :

```bash
npm install && npm run build
```

Résultat : échec avant build, pendant `npm install`.

Erreur exacte observée :

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/@google%2fgenai
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.
```

Interprétation : le build n'a pas pu être lancé car l'environnement/registre bloque l'installation de `@google/genai`. Cette dépendance ne semble pas nécessaire à l'interface DEL et doit être auditée avant migration.

## 13. Recommandation finale

Recommandation : fusion progressive, pas remplacement complet de `DEL-web`.

Justification :

- `DEL-web` est déjà compatible avec `DEL-api`, utilise Next App Router et dispose de routes/API helpers fonctionnels.
- `DEL-web-main` apporte surtout une meilleure couche visuelle et UX, mais sa navigation, son état et ses données sont des mocks SPA.
- Un remplacement complet risquerait de casser auth, routing, build et intégration API.
- La bonne stratégie est d'extraire les composants visuels les plus qualitatifs, de les convertir progressivement en composants Next, et de les brancher aux endpoints existants avec adaptateurs de champs.
