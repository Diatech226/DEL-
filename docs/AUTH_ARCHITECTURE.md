# Architecture d’authentification DEL

DEL sépare désormais deux systèmes.

## DEL-web-main

Le frontend public utilise Clerk via `@clerk/react`. Seule la clé publique `VITE_CLERK_PUBLISHABLE_KEY` est exposée au navigateur. Le token Clerk est transmis explicitement à DEL-api pour synchroniser ou charger l’utilisateur métier MongoDB.

Après une première connexion email ou Google, DEL-api crée ou rattache un utilisateur MongoDB existant avec `clerkUserId`. Le rôle créé automatiquement est `USER`; l’onboarding DEL doit ensuite permettre OWNER, COMPANY ou TECHNICIAN si autorisé. Le rôle ADMIN n’est jamais créé depuis Clerk ni depuis des métadonnées navigateur.

## DEL-cms-main

Le CMS conserve le login interne `POST /api/auth/login` avec `ADMIN_EMAIL` et `ADMIN_PASSWORD` définis côté `DEL-api/.env`. Le CMS reçoit le JWT interne dans `data.token`, le stocke localement, appelle `GET /api/auth/me`, puis vérifie `user.role === "ADMIN"`.

## DEL-api

DEL-api accepte deux jetons distincts :

- JWT interne signé avec `JWT_SECRET` pour le CMS et les routes admin.
- Token Clerk vérifié avec `@clerk/backend` pour les routes web utilisateur.

Les middlewares `requireAnyAuth` et `optionalAnyAuth` essayent d’abord le JWT interne, puis Clerk. Les routes strictement admin restent protégées par `requireAdmin` et donc par le JWT interne.

## Synchronisation MongoDB

`syncClerkUser(clerkUserId)` récupère l’utilisateur Clerk, détermine son email principal, cherche d’abord par `clerkUserId`, puis par email normalisé. En cas de match par email, le compte DEL existant est rattaché sans écraser rôle, statut, profils ou données métier. Un compte ADMIN existant conserve l’accès CMS interne; Clerk ne lui accorde pas automatiquement un accès admin web.

## Variables

- `DEL-web-main`: `VITE_API_URL`, `VITE_APP_NAME`, `VITE_CLERK_PUBLISHABLE_KEY`.
- `DEL-cms-main`: `VITE_API_URL`, `VITE_APP_NAME`.
- `DEL-api`: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_AUTHORIZED_PARTIES`, `CORS_ORIGINS`.

Ne jamais placer `CLERK_SECRET_KEY`, `ADMIN_PASSWORD` ou `JWT_SECRET` dans un frontend.

## Diagnostic

En développement seulement, le login admin journalise sans secret : admin trouvé, rôle, statut, présence du hash, résultat bcrypt et génération JWT. Aucun mot de passe, hash, JWT ou secret n’est affiché.
