# DEL

DEL est une plateforme numérique pour le placement, la location, la vente et la gestion d’engins industriels destinés aux mines, au BTP, à la logistique et aux grands chantiers.

## Applications

- **DEL-web** : site public et espace utilisateur. Les propriétaires déposent leurs engins et les entreprises publient leurs besoins.
- **DEL-cms** : back-office administrateur pour valider les engins, suivre les demandes et créer des propositions de matching.
- **DEL-api** : API Express.js connectée à MongoDB, exposant les ressources équipements, demandes et propositions.

## Ports

| Application | Port | URL locale |
| --- | --- | --- |
| DEL-api | 5000 | http://localhost:5000 |
| DEL-web | 3000 | http://localhost:3000 |
| DEL-cms | 3001 | http://localhost:3001 |

## Ordre de lancement recommandé

1. Lancer MongoDB localement ou configurer MongoDB Atlas.
2. Installer et lancer `DEL-api`.
3. Installer et lancer `DEL-web`.
4. Installer et lancer `DEL-cms`.

## Variables nécessaires

- `DEL-api/.env` : `PORT`, `NODE_ENV`, `MONGODB_URI`, `CORS_ORIGINS`.
- `DEL-web/.env` : `NEXT_PUBLIC_API_URL`.
- `DEL-cms/.env` : `NEXT_PUBLIC_API_URL`.

## Commandes rapides

```bash
cd DEL-api && npm install && npm run dev
cd DEL-web && npm install && npm run dev
cd DEL-cms && npm install && npm run dev
```

## Déploiement recommandé

- **DEL-web** : Vercel.
- **DEL-cms** : Vercel.
- **DEL-api** : Render.
- **MongoDB** : MongoDB Atlas.

Chaque application est autonome : aucun workspace obligatoire, aucun package partagé et aucune dépendance locale entre applications.

## Maintenance et réparations

Cette étape ajoute un module de maintenance manuel et structuré sans package partagé entre applications. `DEL-api` expose le modèle `MaintenanceTicket` et les routes `/api/maintenance`. `DEL-cms` ajoute les écrans d'administration `/maintenance`, le détail ticket, la création depuis une fiche engin et les statistiques dashboard. `DEL-web` ajoute uniquement une section informative dans le dashboard utilisateur.

Workflow résumé : un ticket lié à un engin peut passer l'engin en `UNDER_MAINTENANCE`, notamment en gravité `HIGH` ou `CRITICAL` ou pendant les statuts de diagnostic/réparation. À la clôture, l'engin revient `PLACED` si le ticket est lié à une mission active, sinon `AVAILABLE`.

Limites : pas de prédictif, IoT, GPS réel, stock de pièces avancé, paiement automatique ni application technicien séparée.
