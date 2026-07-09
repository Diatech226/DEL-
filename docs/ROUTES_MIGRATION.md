# Migration des routes frontend DEL

Date : 2026-07-02.

## Objectif

Remplacer la navigation simulée du prototype `DEL-web-main` par des routes applicatives stables. La route devient la source de vérité, pas `activeScreen`.

## Principes

- Les routes publiques restent accessibles sans authentification.
- Les routes dashboard exigent `AuthGuard` ou protection équivalente.
- Les routes dashboard s'adaptent au rôle utilisateur.
- Les modules futurs apparaissent seulement comme placeholders désactivés.
- Les liens sont centralisés dans `src/constants/routes.ts`.

## Table de migration

| Écran prototype | Route cible | Layout | Auth | Statut migration |
| --- | --- | --- | --- | --- |
| Accueil Premium | `/` | public | Non | Phase 1 |
| Liste des Engins | `/equipment` | public | Non | Phase 1 |
| Détail de l'Engin | `/equipment/[id]` | public | Non | Phase 1 |
| Déposer un Engin | `/deposer-un-engin` | public/auth progressive | Optionnel puis requis submit | Phase 1 |
| Demander des Engins | `/demander-des-engins` | public/auth progressive | Optionnel puis requis submit | Phase 1 |
| Connexion | `/login` | auth | Non | Phase 1 |
| Inscription | `/register` | auth | Non | Phase 1 |
| Onboarding | `/onboarding` | auth | Oui | Phase 2 |
| Dashboard Propriétaire | `/dashboard` | dashboard | Oui | Phase 2 |
| Dashboard Entreprise | `/dashboard` | dashboard | Oui | Phase 2 |
| Parc propriétaire | `/dashboard/equipment` | dashboard | Oui | Phase 2 |
| Demandes | `/dashboard/requests` | dashboard | Oui | Phase 2 |
| Appels d'offres | `/dashboard/tenders` | dashboard | Oui | Phase 2 |
| Détail appel d'offres | `/dashboard/tenders/[id]` | dashboard | Oui | Phase 2 |
| Propositions | `/dashboard/proposals` | dashboard | Oui | Phase 2 |
| Contrats | `/dashboard/contracts` | dashboard | Oui | Phase 2 |
| Factures | `/dashboard/invoices` | dashboard | Oui | Phase 2 |
| Paiements | `/dashboard/payments` | dashboard | Oui | Phase 3 |
| Missions | `/dashboard/missions` | dashboard | Oui | Phase 2 |
| Documents | `/dashboard/documents` | dashboard | Oui | Phase 2 |
| Notifications | `/dashboard/notifications` | dashboard | Oui | Phase 3 |
| Messages | `/dashboard/messages` | dashboard | Oui | Phase 3 |
| Profil | `/dashboard/profile` | dashboard | Oui | Phase 2 |
| Paramètres | `/dashboard/settings` | dashboard | Oui | Phase 3 |
| DEL Invest | `/dashboard/invest` | dashboard | Oui | Placeholder |
| DEL Finance | `/dashboard/finance` | dashboard | Oui | Placeholder |
| DEL GPS | `/dashboard/gps` | dashboard | Oui | Placeholder |
| DEL Fleet | `/dashboard/fleet` | dashboard | Oui | Placeholder |

## Navigation cible

### Public

- Accueil
- Catalogue
- Déposer un engin
- Demander des engins
- Appels d'offres si public activé
- Connexion

### Dashboard propriétaire

- Vue d'ensemble
- Mon parc
- Propositions
- Contrats
- Factures
- Missions
- Maintenance
- Documents
- Profil

### Dashboard entreprise

- Vue d'ensemble
- Mes demandes
- Appels d'offres
- Propositions reçues
- Contrats
- Factures
- Missions
- Documents
- Profil

### Futur

- DEL Invest désactivé
- DEL Finance désactivé
- DEL GPS désactivé
- DEL Fleet désactivé

## Redirections

| Ancien état prototype | Redirection |
| --- | --- |
| `activeScreen = 'Accueil Premium - DEL-web-main'` | `/` |
| `activeScreen = 'Liste des Engins - DEL-web-main'` | `/equipment` |
| `activeScreen = 'Détail de l Engin - DEL-web-main'` | `/equipment/[id]` |
| `activeScreen = 'Dashboard Propriétaire - DEL-web-main'` | `/dashboard` |
| `activeScreen = 'Dashboard Entreprise - DEL-web-main'` | `/dashboard` |
| `activeScreen = 'Factures - DEL-web-main'` | `/dashboard/invoices` |
| `activeScreen = 'Suivi Missions - DEL-web-main'` | `/dashboard/missions` |

## Modèle de fichier `routes.ts`

```ts
export const ROUTES = {
  home: '/',
  equipment: '/equipment',
  equipmentDetail: (id: string) => `/equipment/${id}`,
  createEquipment: '/deposer-un-engin',
  createRequest: '/demander-des-engins',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  dashboardEquipment: '/dashboard/equipment',
  dashboardRequests: '/dashboard/requests',
  dashboardTenders: '/dashboard/tenders',
  dashboardProposals: '/dashboard/proposals',
  dashboardContracts: '/dashboard/contracts',
  dashboardInvoices: '/dashboard/invoices',
  dashboardMissions: '/dashboard/missions',
  dashboardDocuments: '/dashboard/documents',
  dashboardProfile: '/dashboard/profile',
  dashboardSettings: '/dashboard/settings',
  futureInvest: '/dashboard/invest',
  futureFinance: '/dashboard/finance',
  futureGps: '/dashboard/gps',
  futureFleet: '/dashboard/fleet'
} as const;
```

## Critères de fin de migration routing

- Plus aucun composant ne dépend de `activeScreen`.
- Toutes les navigations utilisent `Link` ou `router.push`.
- Les routes dynamiques utilisent des IDs API réels.
- Les pages dashboard sont protégées.
- Les breadcrumbs sont générés depuis `routes.ts`.
- Les modules futurs sont visibles seulement si activés par feature flag.
