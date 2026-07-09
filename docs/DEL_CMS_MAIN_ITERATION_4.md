# DEL-cms-main — Itération 4 Missions & Maintenance + env

## Objectif
Connecter progressivement `DEL-cms-main` à `DEL-api` pour les seuls modules Missions et Maintenance, et harmoniser les fichiers `.env.example` des apps DEL sans modifier l'indépendance des applications.

## Pages connectées
- Vue `Missions` : liste API, recherche locale, états loading/error/empty et détail mission.
- Vue `Maintenance` : liste API, recherche locale, états loading/error/empty et détail ticket maintenance.
- Détail contrat : ajout d'un formulaire léger de création de mission depuis un contrat existant.

## Services créés
- `DEL-cms-main/src/services/mission.service.ts`
- `DEL-cms-main/src/services/maintenance.service.ts`

## Mappers créés
- `DEL-cms-main/src/mappers/mission.mapper.ts`
- `DEL-cms-main/src/mappers/maintenance.mapper.ts`

## Statuts ajoutés
- Missions : `PLANNED`, `IN_TRANSIT`, `ON_SITE`, `PAUSED`, `COMPLETED`, `CANCELLED`, `UNKNOWN`.
- Maintenance : `OPEN`, `DIAGNOSIS`, `QUOTATION_PENDING`, `APPROVED`, `IN_REPAIR`, `COMPLETED`, `CANCELLED`, `REJECTED`, `UNKNOWN`.
- Sévérités : `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.

## Endpoints utilisés
- `GET /api/missions`
- `GET /api/missions/:id`
- `POST /api/contracts/:id/missions`
- `PATCH /api/missions/:id/status`
- `PATCH /api/missions/:id`
- `GET /api/maintenance`
- `GET /api/maintenance/:id`
- `GET /api/maintenance/equipment/:equipmentId`
- `GET /api/maintenance/mission/:missionId`
- `POST /api/maintenance`
- `PATCH /api/maintenance/:id/status`
- `PATCH /api/maintenance/:id`

## Actions disponibles
- Création d'une mission depuis le détail d'un contrat non annulé.
- Consultation de la liste et du détail des missions.
- Changement de statut mission vers transit, site, pause, terminé ou annulé si l'API accepte.
- Consultation de la liste et du détail maintenance.
- Création d'un ticket maintenance depuis le détail mission.
- Changement de statut maintenance vers diagnostic, devis, approuvé, réparation, terminé, annulé ou rejeté.

## Actions non disponibles
- Documents, audit, exports, settings, notifications, messages, scoring, utilisateurs, propriétaires, entreprises, techniciens et PDF avancés ne sont pas connectés dans cette itération.
- La création ticket maintenance depuis détail engin reste une prochaine étape pour éviter une refonte du module engins.

## Fichiers `.env.example` mis à jour
- `DEL-api/.env.example`
- `DEL-web-main/.env.example`
- `DEL-web-main/.env.example`
- `DEL-cms-main/.env.example`
- `DEL-cms-main/.env.example`

## Mocks restants
Les modules hors Missions/Maintenance conservent leurs mocks ou connexions des itérations précédentes. Les vues Documents, Audit, Exports et Settings ne sont pas connectées ici.

## Limites
La validation fonctionnelle complète dépend d'une API lancée avec MongoDB et de données contrats/missions/maintenance cohérentes. Les erreurs API sont affichées à l'administrateur sans masquer les refus métier.

## Commandes de test
- `npm install --prefix DEL-cms-main`
- `npm run build --prefix DEL-cms-main`
- `npm run dev --prefix DEL-api`
- `curl http://localhost:5000/api/health`
- `git diff -- DEL-cms-main`
- `git diff -- DEL-web-main`
- `git diff -- DEL-web-main`

## Prochaine itération recommandée
Ajouter la création de ticket maintenance depuis le détail engin, puis connecter documents contractuels/KYC ou PDF opérationnels dans une itération séparée.
