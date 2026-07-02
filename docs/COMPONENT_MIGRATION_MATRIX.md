# Matrice de migration des composants DEL-web-main

Date : 2026-07-02.

## Règle de migration

Aucun composant de `DEL-web-main` ne doit être copié tel quel. Chaque composant doit être découpé en composants de design system, composants métier et appels de service connectés à l'API.

| Source `DEL-web-main` | Destination cible | Priorité | Action | Dépendances | Risques |
| --- | --- | --- | --- | --- | --- |
| `AccueilPremium.tsx` | `components/marketing/*`, route `/` | Haute | Extraire hero, sections bénéfices, CTA, stats publiques | settings publiques, tokens CSS | Éviter les statistiques mockées |
| `Header.tsx` | `components/layout/Header.jsx` | Haute | Convertir navigation en liens Next | routes, auth | Ne pas garder `activeScreen` |
| `Sidebar.tsx` | `components/layout/DashboardSidebar.jsx` | Haute | Convertir en navigation dashboard par rôle | routes, roles, icons | Gestion permissions incomplète |
| `ListeEngins.tsx` | `components/equipment/EquipmentGrid.jsx`, `EquipmentFilters.jsx` | Haute | Brancher API et pagination | equipment mapper, service | Champs design absents côté API |
| `DetailEngin.tsx` | `components/equipment/EquipmentDetail.jsx` | Haute | Connecter engin, documents, maintenance | equipment/document services | VGP et specs techniques parfois absentes |
| `DeposerEngin.tsx` | `components/equipment/CreateEquipmentForm.jsx` | Haute | Mapper formulaire vers `POST /api/equipment` | equipment mapper | Upload réel à traiter séparément |
| `DemanderEngin.tsx` | `components/tenders/CreateRequestForm.jsx` | Haute | Mapper besoin entreprise vers request API | request mapper | Harmoniser tender/request |
| `AppelsOffres.tsx` | `components/tenders/TenderList.jsx` | Moyenne | Connecter tenders/lots API | request/tender services | Routes publiques à valider |
| `DashboardProprietaire.tsx` | `components/dashboard/OwnerDashboard.jsx` | Haute | Construire KPIs et widgets owner | dashboard store, summaries API | Ne pas dupliquer logique entreprise |
| `DashboardEntreprise.tsx` | `components/dashboard/CompanyDashboard.jsx` | Haute | Construire KPIs et widgets company | dashboard store, summaries API | Données opérationnelles partielles |
| `Propositions.tsx` | `components/proposals/ProposalTable.jsx` | Moyenne | Connecter accept/refuse endpoints | proposal mapper | Actions locales à supprimer |
| `GestionContrats.tsx` | `components/contracts/ContractTable.jsx` | Moyenne | Connecter contrats + signature future | contract mapper | Signature électronique API absente |
| `Factures.tsx` | `components/invoices/InvoiceTable.jsx` | Moyenne | Connecter factures + PDF | invoice mapper | Méthodes paiement incomplètes |
| `SuiviMissions.tsx` | `components/missions/MissionBoard.jsx` | Moyenne | Connecter missions + timeline | mission mapper, workflow | Télémétrie absente |
| `ListeMaintenance.tsx` | `components/missions/MaintenanceList.jsx` | Moyenne | Brancher maintenance | mission/workflow status | Normalisation statut |
| `CalendrierMaintenance.tsx` | `components/missions/MaintenanceCalendar.jsx` | Basse | Garder en phase 2 | calendar endpoint futur | Endpoint calendrier absent |
| `CoffreFort.tsx` | `components/documents/DocumentVault.jsx` | Moyenne | Connecter documents metadata | document service | Upload binaire absent |
| `ProfilUtilisateur.tsx` | `components/profile/ProfileForm.jsx` | Moyenne | Connecter auth/me + profile | profile mapper | Profil consolidé absent |
| `Connexion.tsx` | routes `/login`, `/register` | Haute | Garder logique auth existante, migrer design | auth service | Sécurité token client |
| `AlertPanel.tsx` | `components/dashboard/NotificationPanel.jsx` | Moyenne | Brancher notifications réelles | notification context | Actuellement emails simulés |

## Composants UI à extraire en premier

- `Button`
- `Card`
- `Badge`
- `StatusBadge`
- `MetricCard`
- `DataGrid`
- `Table`
- `Pagination`
- `SearchBar`
- `Filters`
- `Drawer`
- `Modal`
- `Timeline`
- `WorkflowCard`
- `EmptyState`
- `LoadingState`
- `ErrorState`

## Critères de validation par composant

Un composant est migré uniquement si :

1. Il n'utilise plus `INITIAL_*` de `DEL-web-main/src/data.ts`.
2. Il ne dépend plus de `activeScreen`.
3. Il consomme un service ou des props déjà mappées.
4. Il utilise les tokens du design system.
5. Il gère loading, empty et error.
6. Il n'écrit pas de statut en dur.
