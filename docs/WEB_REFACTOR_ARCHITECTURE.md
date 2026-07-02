# Architecture cible du frontend DEL

Date : 2026-07-02.

## Objectif

Cette architecture prépare la migration du prototype premium `DEL-web-main` vers une application frontend durable, modulaire et connectée à l'API DEL. Elle évite la copie directe des composants Vite/mockés et impose une séparation claire entre routes, composants métier, design system, mappers API, état applicatif et workflow.

## Principes directeurs

1. **Ne jamais adapter l'API au design dans les pages** : toute transformation passe par `src/mappers`.
2. **Ne jamais écrire de chaînes de statut à la main** : tous les statuts passent par `src/constants/status.ts`.
3. **Ne jamais dupliquer les patterns UI** : tous les composants réutilisables passent par `src/components/ui` ou `src/components/layout`.
4. **Séparer domaine et présentation** : les modules métier consomment des types design normalisés, pas les payloads bruts API.
5. **Conserver un workflow unique** : request → matching → proposal → contract → invoice → mission → maintenance → archive.
6. **Préparer les modules futurs** : DEL Invest, DEL Finance, DEL GPS et DEL Fleet doivent être réservés dans l'arborescence et la navigation sans être activés tant que l'API n'existe pas.

## Arborescence cible

```text
DEL-web/
└── src/
    ├── app/
    │   ├── (public)/
    │   │   ├── page.jsx
    │   │   ├── equipment/
    │   │   ├── deposer-un-engin/
    │   │   └── demander-des-engins/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── onboarding/
    │   ├── dashboard/
    │   │   ├── page.jsx
    │   │   ├── equipment/
    │   │   ├── requests/
    │   │   ├── tenders/
    │   │   ├── proposals/
    │   │   ├── contracts/
    │   │   ├── invoices/
    │   │   ├── missions/
    │   │   ├── documents/
    │   │   ├── profile/
    │   │   └── settings/
    │   └── layout.jsx
    ├── components/
    │   ├── marketing/
    │   ├── dashboard/
    │   ├── equipment/
    │   ├── tenders/
    │   ├── proposals/
    │   ├── contracts/
    │   ├── invoices/
    │   ├── missions/
    │   ├── documents/
    │   ├── profile/
    │   ├── settings/
    │   ├── workflow/
    │   ├── future/
    │   ├── layout/
    │   └── ui/
    ├── contexts/
    │   ├── AuthContext.jsx
    │   ├── NotificationContext.jsx
    │   ├── ThemeContext.jsx
    │   └── LanguageContext.jsx
    ├── stores/
    │   ├── dashboard.store.js
    │   ├── settings.store.js
    │   └── workflow.store.js
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useDashboardData.js
    │   ├── useWorkflow.js
    │   └── usePagination.js
    ├── services/
    │   ├── equipment.service.js
    │   ├── request.service.js
    │   ├── proposal.service.js
    │   ├── contract.service.js
    │   ├── invoice.service.js
    │   ├── mission.service.js
    │   ├── document.service.js
    │   └── notification.service.js
    ├── lib/
    │   ├── api.js
    │   ├── http.js
    │   ├── auth.js
    │   └── formatters.js
    ├── mappers/
    │   ├── equipment.mapper.ts
    │   ├── request.mapper.ts
    │   ├── proposal.mapper.ts
    │   ├── contract.mapper.ts
    │   ├── invoice.mapper.ts
    │   ├── mission.mapper.ts
    │   └── profile.mapper.ts
    ├── constants/
    │   ├── status.ts
    │   ├── routes.ts
    │   ├── roles.ts
    │   └── icons.ts
    ├── types/
    │   ├── api.ts
    │   ├── design.ts
    │   └── workflow.ts
    ├── utils/
    └── styles/
        ├── tokens.css
        ├── themes.css
        └── globals.css
```

## Couche de données

Les pages ne doivent pas appeler `fetch` directement. Le flux cible est :

```text
Page Next.js
  ↓
service métier
  ↓
lib/api ou lib/http
  ↓
payload API brut
  ↓
mapper domaine
  ↓
type design consommé par les composants
```

Exemple : `/equipment` appelle `equipment.service.js`, qui appelle `getEquipmentList`, puis `mapEquipmentListToDesign` avant de rendre `EquipmentGrid`.

## Modèle standard de page

Toutes les pages dashboard doivent exposer le même squelette :

1. Header de page.
2. Description.
3. Actions principales.
4. KPIs.
5. Filtres.
6. Tableau ou grille.
7. Pagination.
8. Drawer de détail.
9. Modal d'action.
10. Historique / timeline.

Ce modèle réduit les écarts entre pages riches et pages simples.

## Workflow engine

Le workflow unique est représenté dans `components/workflow`, `stores/workflow.store.js`, `hooks/useWorkflow.js` et `constants/status.ts`.

```text
REQUEST_CREATED
  → MATCHING_IN_PROGRESS
  → PROPOSAL_SENT
  → READY_FOR_CONTRACT
  → CONTRACT_ACTIVE
  → INVOICE_ISSUED
  → MISSION_ACTIVE
  → MAINTENANCE_REQUIRED
  → ARCHIVED
```

Chaque écran affiche son étape courante avec les mêmes composants : `WorkflowStepper`, `WorkflowCard`, `Timeline` et `StatusBadge`.

## Modules futurs réservés

Les modules futurs ne doivent pas polluer le MVP, mais leur emplacement est réservé :

- `components/future/InvestModulePlaceholder.jsx`
- `components/future/FinanceModulePlaceholder.jsx`
- `components/future/GpsModulePlaceholder.jsx`
- `components/future/FleetModulePlaceholder.jsx`
- entrées désactivées dans `constants/routes.ts`

## Ordre de refactor recommandé

1. Ajouter tokens CSS, statuts et design system minimal.
2. Ajouter les mappers API.
3. Refactorer les pages publiques : home, catalogue, détail engin.
4. Refactorer les formulaires : dépôt engin, demande engin.
5. Refactorer le dashboard avec le modèle standard.
6. Introduire le workflow engine.
7. Activer les drawers, timelines et modules avancés.
