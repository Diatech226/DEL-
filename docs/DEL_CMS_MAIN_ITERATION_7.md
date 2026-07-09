# DEL-cms-main — Itération 7 Audit & Exports

## Objectif

Connecter progressivement `DEL-cms-main` à `DEL-api` pour les modules administratifs Audit et Exports uniquement, sans modifier l’ancien `DEL-cms-main`, l’ancien `DEL-web-main`, ni créer de workspace/package partagé.

## Pages connectées

- Vue `Audit` du back-office `DEL-cms-main` : liste, filtres, état vide, erreur API et détail d’un log.
- Vue `Exports` du back-office `DEL-cms-main` : cartes d’exports CSV/JSON, filtres globaux et full backup JSON administratif.
- Dashboard `DEL-cms-main` : carte rapide `Audit & Exports` avec liens vers les deux vues.

## Services créés

- `DEL-cms-main/src/services/audit.service.ts`
  - `getAuditLogs(filters?)`
  - `getAuditLogById(id)`
  - `getAuditLogsByEntity(entityType, entityId)`
  - `deleteAuditLog(id)` disponible côté service, non exposé en action destructive dans l’UI.
- `DEL-cms-main/src/services/export.service.ts`
  - `downloadExport(resource, format, filters)` avec téléchargement Blob, header `Authorization: Bearer`, gestion 401/403/500 et `full-backup` forcé en JSON.

## Mapper créé

- `DEL-cms-main/src/mappers/audit.mapper.ts`
  - `mapApiAuditLogToAdmin(apiLog)`
  - `mapApiAuditLogListToAdmin(apiItems)`

Fallbacks appliqués :

- `actorName` : `Système DEL`
- `actorRole` : `SYSTEM`
- `action` : `SYSTEM`
- `module` : `SYSTEM`
- `severity` : `NORMAL`
- `message` : `Action enregistrée`

## Endpoints utilisés

Audit :

- `GET /api/audit-logs`
- `GET /api/audit-logs/:id`
- `GET /api/audit-logs/entity/:entityType/:entityId`
- `DELETE /api/audit-logs/:id` uniquement disponible dans le service.

Exports :

- `GET /api/exports/:resource?format=csv|json`
- `GET /api/exports/full-backup`

## Filtres audit

La liste Audit supporte :

- `module`
- `action`
- `actorRole`
- `entityType`
- `severity`
- `dateFrom`
- `dateTo`
- `limit`

Le service supporte aussi `entityId`, utilisé notamment pour les appels par entité.

## Exports disponibles

Données opérationnelles :

- `equipment`
- `requests`
- `tenders`
- `proposals`
- `contracts`
- `missions`
- `maintenance`

Finance :

- `invoices`
- `payments`

Administration :

- `documents`
- `users`
- `audit-logs`

## Full backup JSON

- Resource : `full-backup`
- Format forcé : JSON uniquement.
- Aucun paramètre `format=csv` n’est envoyé pour cette resource.
- Avertissement affiché : « La sauvegarde complète JSON est un export administratif, pas une restauration MongoDB complète. »

## Actions disponibles

Helpers ajoutés dans `DEL-cms-main/src/constants/status.ts` :

- `getAuditActionLabel(action)`
- `getAuditModuleLabel(module)`
- `getSeverityLabel(severity)`
- `getSeverityVariant(severity)`

Actions couvertes : `CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`, `LOGIN`, `LOGOUT`, `REGISTER`, `APPROVE`, `REJECT`, `DOWNLOAD`, `EXPORT`, `PAYMENT_RECORD`, `MESSAGE_SENT`, `NOTIFICATION_SENT`, `SETTINGS_UPDATE`, `SYSTEM`.

Sévérités couvertes : `LOW`, `NORMAL`, `HIGH`, `CRITICAL`.

## Mocks restants

- Les modules Notifications, Messages, Scoring et Utilisateurs avancés ne sont pas connectés dans cette itération.
- Les données locales historiques restent utilisées comme fallback par les écrans non concernés.
- La suppression d’audit n’est pas exposée dans l’UI afin d’éviter une action destructive sur un journal réglementaire.

## Limites

- Les tests manuels de téléchargement nécessitent une session admin valide, `DEL-api` démarrée et MongoDB disponible.
- La validation visuelle complète navigateur n’a pas été automatisée.
- Le `full-backup` reste un export administratif limité par les paramètres API, pas une sauvegarde/restauration MongoDB.

## Commandes de test

```bash
cd DEL-cms-main
npm install
npm run build
```

```bash
cd DEL-api
npm run dev
curl http://localhost:5000/api/health
```

```bash
git diff -- DEL-cms-main
git diff -- DEL-web-main
```

## Prochaine itération recommandée

Connecter ensuite les modules de professionnalisation restants de façon séparée : Notifications administratives, Messagerie interne ou Scoring, en gardant un périmètre unique par itération et sans connecter les utilisateurs avancés tant que les permissions ne sont pas durcies.
