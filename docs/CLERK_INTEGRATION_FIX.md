# Correction intégration Clerk — DEL-web-main

## Version Clerk utilisée

- Package frontend : `@clerk/react` version exacte installée `5.54.0`.
- Package transitive installé : `@clerk/shared` `3.47.8`.
- Le dépôt possède maintenant un `DEL-web-main/package-lock.json` afin de figer la résolution réellement testée par `npm install`.

## Diagnostic

Le code TypeScript déclarait manuellement des exports Clerk dans `src/vite-env.d.ts`, ce qui masquait les vrais types du package installé. La vérification runtime des exports Node de `@clerk/react@5.54.0` confirme que l'API retenue expose notamment `ClerkProvider`, `SignedIn`, `SignedOut`, `SignIn`, `SignUp`, `SignInButton`, `SignUpButton`, `UserButton`, `UserProfile`, `Protect`, `useAuth`, `useUser` et `useClerk`.

Le build Vite révélait aussi une incompatibilité de bundle entre `@clerk/react@5.54.0` et le sous-module `@clerk/shared/loadClerkJsScript` installé : `@clerk/react` importe `loadClerkUiScript`, absent de `@clerk/shared@3.47.8`. Comme le registre npm est indisponible dans cet environnement (`403 Forbidden` sur `npm view`), le correctif conserve la version installée et ajoute un alias Vite de compatibilité qui exporte `loadClerkUiScript` comme alias de `loadClerkJsScript`.

## Documentation Clerk correspondant à l'API

La documentation officielle Clerk React documente cette API de composants préconstruits et hooks côté React :

- `ClerkProvider` enveloppe l'application et reçoit la publishable key.
- `SignedIn` / `SignedOut` rendent conditionnellement selon l'état de session.
- `SignIn` / `SignUp` fournissent les formulaires email et les connexions sociales activées dans le dashboard Clerk, dont Google si configuré.
- `SignInButton` / `SignUpButton` ouvrent les flows Clerk.
- `UserButton` affiche le bouton utilisateur et ses actions, dont sign-out.
- `useAuth`, `useUser` et `useClerk` exposent l'état de session, l'utilisateur Clerk et les actions client.

## API utilisée dans DEL-web-main

L'application utilise une seule API Clerk cohérente : les composants et hooks de `@clerk/react` v5.

### Composants/hooks conservés

- `ClerkProvider`
- `SignedIn`
- `SignedOut`
- `SignIn`
- `SignUp`
- `SignInButton`
- `SignUpButton`
- `UserButton`
- `useAuth`
- `useUser`
- `useClerk`

### Composants supprimés ou évités

- Aucune ancienne déclaration locale de module `@clerk/react` n'est conservée.
- Aucun composant incompatible (`Show`, ancienne API custom ou mélange d'API) n'est utilisé dans `DEL-web-main/src`.

## Corrections effectuées

- Suppression des déclarations manuelles `@clerk/react` dans `src/vite-env.d.ts` pour utiliser les types réels du package installé.
- Ajout de `package-lock.json` côté `DEL-web-main` pour verrouiller `@clerk/react@5.54.0`.
- Ajout d'un alias Vite `@clerk/shared/loadClerkJsScript` vers `src/lib/clerkLoadScriptCompat.ts` pour résoudre l'export manquant `loadClerkUiScript` avec la dépendance transitive installée.
- Correction du Header sans modifier le design : boutons Clerk pour connexion/inscription, `UserButton` et déconnexion via `useAuth().logout()`.
- Correction de Connexion sans remplacer le design : tabs email connexion/inscription, composants `SignIn`/`SignUp`, Google via connexions sociales activées dans Clerk, `UserButton` si connecté.
- Correction d'AuthContext : conservation de l'interface exposée, récupération token Clerk, appel de synchronisation puis lecture profil DEL.
- Vérification du `ClerkProvider` dans `src/main.tsx` avec `VITE_CLERK_PUBLISHABLE_KEY` et erreur explicite si absente.
- Ajout d'un favicon SVG DEL dans `public/favicon.svg` et déclaration dans `index.html` pour supprimer le 404 `/favicon.ico`.
- Nettoyage du cache Vite local (`node_modules/.vite` et `.vite`).

## Variables d'environnement frontend

Variables attendues dans `DEL-web-main` :

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
```

`CLERK_SECRET_KEY` ne doit jamais être placée dans le frontend. Elle est uniquement côté `DEL-api`.

## Endpoints API utilisés

Le frontend synchronise l'utilisateur DEL après connexion Clerk avec :

- `POST /api/auth/clerk/sync`
- `GET /api/auth/clerk/me`

Ces routes existent côté `DEL-api` dans `src/routes/auth.routes.js` et sont protégées par `requireClerkAuth`, qui vérifie le token Clerk puis synchronise l'utilisateur DEL.
