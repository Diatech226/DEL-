# DEL-web

Site public et espace utilisateur Next.js de DEL.

## Rôle

DEL-web sert de vitrine publique et d'espace opérationnel pour les propriétaires d'engins et les entreprises clientes : découverte, inscription, onboarding, dépôt d'engins, demandes, appels d'offres, suivi des propositions, contrats, documents, factures, paiements, missions et notifications.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- API REST DEL-api via `src/lib/api.js`

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

Le dev server écoute sur <http://localhost:3000>.

## Pages publiques

- `/` accueil
- `/equipment` liste d'engins
- `/equipment/[id]` détail engin
- `/deposer-un-engin`
- `/demander-des-engins`
- `/appels-offres/nouveau`
- `/login`
- `/register`
- `/onboarding`
- `/conditions`
- `/confidentialite`

## Dashboard utilisateur

- `/dashboard`
- `/dashboard/equipment`
- `/dashboard/requests`
- `/dashboard/tenders`
- `/dashboard/proposals`
- `/dashboard/contracts`
- `/dashboard/documents`
- `/dashboard/invoices`
- `/dashboard/payments`
- `/dashboard/missions`
- `/dashboard/notifications`
- `/dashboard/messages`
- `/dashboard/profile`

## Dépendance à DEL-api

Les pages client appellent DEL-api via `NEXT_PUBLIC_API_URL`. Sans API disponible, les pages doivent afficher un message d'erreur ou un état vide au lieu de crasher.

## Limites actuelles

- Plusieurs pages sont fonctionnelles mais simples visuellement.
- La messagerie utilisateur est encore un placeholder.
- L'expérience mobile et les formulaires doivent être affinés.
- Les workflows métier doivent être mieux guidés pour les utilisateurs non techniques.

## Prochaines améliorations recommandées

1. Refonte premium de l'accueil et du dashboard.
2. États loading/error/empty homogènes.
3. Onboarding par rôle propriétaire/entreprise.
4. Parcours complet demande → proposition → contrat.
5. Amélioration responsive et accessibilité.

## Workflow central dans les dashboards

Les dashboards entreprise et propriétaire consomment les routes `/api/me/*` pour afficher demandes, propositions, contrats, factures et missions. Les décisions de proposition passent par `PATCH /api/me/proposals/:id/company-decision` pour l'entreprise et `PATCH /api/me/proposals/:id/owner-decision` pour les propriétaires. Les pages doivent toujours afficher loading, erreur, état vide et message de succès après action.
