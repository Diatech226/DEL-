# Gestion des comptes administrateurs

## Variables d’environnement (`DEL-api` uniquement)

`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME`, `ADMIN_PHONE`, `ADMIN_FORCE_PASSWORD_UPDATE` et `ADMIN_RESET_PASSWORD_ON_START` sont chargées uniquement par `DEL-api`. Ne pas les ajouter dans `DEL-web-main` ni `DEL-cms-main`.

`ADMIN_PASSWORD` doit être long, unique et robuste. Il sert uniquement à calculer un hash bcryptjs lors de la création ou d’une réinitialisation explicite.

## Création admin

```bash
cd DEL-api
npm run seed:admin
```

Au démarrage, l’API appelle aussi `ensureAdminAccount()` après la connexion MongoDB pour créer l’admin s’il n’existe pas et corriger son rôle/statut.

## Reset mot de passe

```bash
cd DEL-api
npm run seed:admin:reset
```

Alternative temporaire : `ADMIN_RESET_PASSWORD_ON_START=true`, uniquement hors production et à remettre à `false` après usage. Le code ne modifie jamais le fichier `.env`.

## Sécurité

* Aucun mot de passe en clair n’est stocké.
* `passwordHash`, `resetToken` et `resetTokenExpires` sont retirés des réponses API.
* L’inscription publique refuse `ADMIN`, `SUPER_ADMIN` et `SYSTEM`.
* Seul un admin authentifié peut appeler `POST /api/users/admin`.

## Routes admin

* `GET /api/users`
* `GET /api/users/:id`
* `PATCH /api/users/:id`
* `PATCH /api/users/:id/status`
* `POST /api/users/admin`
* `PATCH /api/users/:id/reset-password`

Toutes ces routes sont protégées par `requireAuth` et `requireAdmin`.

## Erreurs fréquentes

* `Configuration admin invalide`: vérifier `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL` et la robustesse de `ADMIN_PASSWORD`.
* Connexion refusée: vérifier le statut utilisateur (`SUSPENDED`, `REJECTED`, `ARCHIVED` sont bloqués).
* CMS refusé: le compte doit avoir `role === "ADMIN"`.

## Commandes de test

```bash
cd DEL-api
npm install
npm test
npm run seed:admin
npm run seed:admin:reset
npm run dev
```
