# DEL-cms-main — Itération 8 Notifications & Messages

## Objectif
Connecter progressivement `DEL-cms-main` à `DEL-api` pour les modules Notifications et Messages uniquement, sans modifier l’ancien `DEL-cms-main`, l’ancien `DEL-web-main`, ni `DEL-web-main`, et sans workspace/package partagé.

## Notifications connectées
- Vue `Notifications` ajoutée dans la navigation de `DEL-cms-main`.
- Liste chargée depuis `GET /api/notifications` avec token admin via la couche HTTP existante.
- Mapping API robuste avec fallbacks pour destinataire, rôle, titre, message, type, entité liée, priorité et lecture.
- États loading, erreur et vide : « Aucune notification pour le moment. »
- Filtres locaux : rôle destinataire, type, priorité, lu/non lu et date.

## Création notification manuelle
- Formulaire `Créer une notification` sur la vue Notifications.
- Endpoint utilisé : `POST /api/notifications`.
- Payload couvert : `recipientUserId`, `recipientRole`, `recipientName`, `title`, `message`, `type`, `relatedEntityType`, `relatedEntityId`, `actionUrl`, `priority`.
- Valeurs par défaut : `recipientRole=SYSTEM`, `type=SYSTEM`, `relatedEntityType=SYSTEM`, `priority=NORMAL`.

## Suppression notification
- `DEL-api` expose `DELETE /api/notifications/:id` dans `notification.routes.js`.
- Le CMS affiche donc l’action `Supprimer`, demande confirmation navigateur, puis recharge la liste.

## État réel de l’API messages
Inspection de `DEL-api/src` : aucune route dédiée `conversation.routes.js` ou `message.routes.js`, aucun modèle `Conversation` ou `Message`, aucun montage `/api/conversations` ou `/api/messages` dans `src/app.js`.

Endpoints absents :
- `GET /api/conversations`
- `GET /api/conversations/:id`
- `POST /api/conversations/:id/messages`
- `PATCH /api/conversations/:id/status`
- `DELETE /api/conversations/:id`
- `DELETE /api/messages/:id`

## Messages connectés ou placeholder
- Page `Messages` ajoutée dans `DEL-cms-main`.
- Comme l’API conversations/messages est absente, la page affiche un placeholder clair : « Messages à connecter après création API ».
- Aucun mock de messagerie n’a été inventé et aucun workflow utilisateur avancé n’a été connecté.

## Services créés
- `DEL-cms-main/src/services/notification.service.ts`
  - `getNotificationList(params?)`
  - `getNotificationById(id)`
  - `createNotificationManual(payload)`
  - `deleteNotification(id)`
- `DEL-cms-main/src/services/conversation.service.ts`
  - Créé comme façade prête pour l’API attendue, mais non utilisé par l’UI tant que les endpoints sont absents.

## Mappers créés
- `DEL-cms-main/src/mappers/notification.mapper.ts`
- `DEL-cms-main/src/mappers/conversation.mapper.ts`

## Helpers créés
- `DEL-cms-main/src/constants/notification.ts`
- `DEL-cms-main/src/constants/conversation.ts`

## Endpoints utilisés
Notifications :
- `GET /api/notifications`
- `GET /api/notifications/:id`
- `POST /api/notifications`
- `DELETE /api/notifications/:id`

Messages : aucun endpoint utilisé en production UI, car API absente.

## Actions disponibles
- Consulter les notifications admin.
- Filtrer localement les notifications.
- Créer une notification manuelle si l’API accepte le payload.
- Supprimer une notification si l’API accepte l’action.
- Consulter une page placeholder Messages sans crash.

## Mocks restants
- Messages/conversations restent en attente de modèles/routes API.
- Scoring, utilisateurs avancés, propriétaires, entreprises et techniciens ne sont pas connectés dans cette itération.
- Upload réel, signature électronique et paiement réel restent hors périmètre.

## Limites
- Les filtres notifications restent locaux car `GET /api/notifications` ne documente pas de filtres serveur.
- La création/suppression nécessite une session admin valide et MongoDB disponible.
- La messagerie admin nécessite une itération backend dédiée avant connexion UI complète.
- Le résumé dashboard notifications/messages est reporté pour éviter de fragiliser le dashboard existant.

## Commandes de test
```bash
cd DEL-cms-main
npm install
npm run build
npm run dev
```

```bash
cd DEL-api
npm run dev
curl http://localhost:5000/api/health
```

```bash
git diff -- DEL-cms-main
git diff -- DEL-web-main
git diff -- DEL-web-main
```

## Prochaine itération recommandée
Créer côté `DEL-api` les modèles/routes Conversations et Messages, avec permissions admin, puis connecter liste, détail, réponse publique, note interne et changement de statut dans `DEL-cms-main` sans toucher aux modules utilisateurs avancés/scoring.
