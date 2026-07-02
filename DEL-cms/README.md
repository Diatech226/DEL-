# DEL-cms

Back-office administrateur Next.js de DEL.

## Rôle

DEL-cms permet aux administrateurs de suivre et piloter les opérations : équipements, demandes, propositions, contrats, documents, factures, paiements, missions, maintenance, planning, utilisateurs, profils, appels d'offres, notifications, paramètres, audit et exports.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- DEL-api via `src/lib/api.js`

## Installation

```bash
npm install
cp .env.example .env.local
```

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=DEL
```

## Scripts

```bash
npm run dev
npm run build
npm run start
```

Le dev server écoute sur <http://localhost:3001>. Le script est `next dev -p 3001`; ne pas ajouter un deuxième `-p 3001` depuis la racine.

## Pages admin disponibles

- `/` dashboard
- `/login`
- `/equipment`, `/equipment/[id]`
- `/requests`, `/requests/[id]`
- `/proposals`
- `/contracts`, `/contracts/[id]`
- `/documents`, `/documents/[id]`
- `/invoices`, `/invoices/[id]`
- `/payments`
- `/missions`, `/missions/[id]`
- `/maintenance`, `/maintenance/[id]`
- `/planning`
- `/users`
- `/owners`, `/owners/[id]`
- `/companies`, `/companies/[id]`
- `/technicians`, `/technicians/[id]`
- `/tenders`, `/tenders/[id]`
- `/tender-lots`, `/tender-lots/[id]`
- `/tender-submissions`
- `/scoring`
- `/notifications`
- `/messages`
- `/settings`
- `/audit`, `/audit/[id]`
- `/exports`

## Auth admin

`AdminGuard` protège l'interface côté client avec un token local. Les routes sensibles doivent rester protégées côté API par `requireAdmin`.

## Dépannage EPERM

Sur Windows, si `.next` est verrouillé : arrêter Next, supprimer `.next`, vérifier qu'aucun terminal ne pointe dans le dossier, puis relancer `npm run dev`.

## Limites actuelles

- Certaines pages comme messages, scoring et tender submissions sont encore des pages légères ou placeholders.
- Les permissions et erreurs API doivent être affichées de façon plus explicite.
- La navigation admin doit être priorisée par workflow métier.

## Prochaines améliorations recommandées

1. Stabiliser toutes les pages contre les erreurs API.
2. Refonte dashboard avec KPIs opérationnels.
3. Ajouter filtres, recherche, pagination et actions en masse.
4. Finaliser tender submissions, scoring et messages.
5. Préparer les paramètres de production et les rôles avancés.

## Workflow central dans le CMS

Le CMS utilise le workflow demande → matching → proposition → contrat → facture → mission. La page détail demande s'appuie sur `GET /api/requests/:id/matches` pour sélectionner les engins et `POST /api/requests/:id/proposals` pour créer une proposition. Les pages propositions/contrats exposent les actions admin de décision forcée, création contrat, facture et mission lorsque les routes API sont disponibles. Les erreurs API sont affichées avec des messages lisibles afin d'éviter les pages blanches.

## UI/UX refondue — console d’administration premium

Cette itération améliore l’expérience CMS pour un pilotage industriel plus crédible :

- dashboard admin refondu avec vue générale, alertes opérationnelles, raccourcis rapides et activité récente ;
- sidebar responsive réorganisée par groupes : Tableau de bord, Opérations, Commercial, Finance, Documents, Utilisateurs et Administration ;
- page centrale `workflows` ajoutée pour suivre l’avancement des demandes jusqu’à proposition, contrat, facture et mission ;
- composants UI locaux ajoutés dans `src/components/ui` : `Button`, `Card`, `Badge`, `StatCard`, `DataTable`, `EmptyState`, `LoadingState`, `ErrorState`, `PageHeader`, `StatusBadge`, `ConfirmModal`, `FormSection` ;
- mapping local des statuts dans `src/lib/status.js` pour conserver une lecture cohérente des états métier.

Limites restantes : plusieurs listes et détails existants restent fonctionnels avec leur structure historique. La prochaine passe doit migrer progressivement chaque page vers `DataTable`, `PageHeader`, `StatusBadge` et les états homogènes.
