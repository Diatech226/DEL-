# Correction de l'intégration Clerk DEL-web-main

## Cause exacte

`DEL-web-main/src/lib/clerkLoadScriptCompat.ts` avait été ajouté comme couche de compatibilité pour contourner un changement d'export interne Clerk. Le fichier importait directement `../../node_modules/@clerk/shared/dist/runtime/loadClerkJsScript.mjs`, puis `DEL-web-main/vite.config.ts` exposait ce fichier via un alias Vite `@clerk/shared/loadClerkJsScript`.

Cette approche était fragile car elle dépendait d'un fichier interne de `@clerk/shared` dans `node_modules`. Après la mise à jour effective de l'arbre Clerk, Vite ne pouvait plus résoudre ce chemin interne et échouait avec `Could not resolve "../../node_modules/@clerk/shared/dist/runtime/loadClerkJsScript.mjs"`.

## Correction appliquée

- Suppression de `DEL-web-main/src/lib/clerkLoadScriptCompat.ts`.
- Suppression de l'alias Vite qui ciblait `@clerk/shared/loadClerkJsScript`.
- Conservation d'un `ClerkProvider` standard dans `DEL-web-main/src/main.tsx`, sans `loadClerkJsScript` personnalisé.
- Conservation des providers applicatifs existants sous `ClerkProvider` : `LanguageProvider` puis `AuthProvider`.
- Vérification que le code source de `DEL-web-main/src` n'importe plus `@clerk/shared`, `node_modules/@clerk`, `loadClerkJsScript` ou `clerkLoadScriptCompat`.

## Version Clerk utilisée

La version installée localement est :

```text
@clerk/react@5.54.0
└── @clerk/shared@3.47.8
```

`@clerk/shared` reste une dépendance transitive gérée par `@clerk/react`; elle n'est pas installée ni importée directement par le code source.

La tentative de `npm install @clerk/react@latest` a été bloquée par le registry dans l'environnement courant avec une erreur `403 Forbidden - GET https://registry.npmjs.org/@clerk%2freact`. L'installation existante cohérente a donc été conservée.

## Imports publics Clerk utilisés

Les fichiers applicatifs utilisent uniquement les exports publics de `@clerk/react` :

- `ClerkProvider` dans `src/main.tsx`.
- `SignedIn`, `SignedOut`, `SignInButton`, `SignUpButton`, `UserButton` dans `src/components/Header.tsx`.
- `SignedIn`, `SignedOut`, `SignIn`, `SignUp`, `UserButton` dans `src/components/Connexion.tsx`.
- `useAuth`, `useClerk`, `useUser` dans `src/context/AuthContext.tsx`.

Note : avec `@clerk/react@5.54.0`, l'export `Show` n'est pas disponible dans le paquet installé. Les composants publics `SignedIn` et `SignedOut`, disponibles dans cette version, sont donc conservés pour préserver un build fonctionnel sans import interne.

## Fichiers modifiés

- `DEL-web-main/src/main.tsx`
- `DEL-web-main/vite.config.ts`
- `DEL-web-main/src/lib/clerkLoadScriptCompat.ts` supprimé
- `DEL-api/src/models/User.js`
- `DEL-api/.env.example`
- `DEL-api/README.md`
- `docs/CLERK_INTEGRATION_FIX.md`
- `docs/NEXT_ITERATIONS_CONTEXT.md`

## Résultat build

`npm run build` dans `DEL-web-main` ne rencontre plus l'ancien chemin supprimé `src/lib/clerkLoadScriptCompat.ts` ni l'import relatif vers `node_modules`. Dans l'environnement courant, le build reste bloqué par une incohérence transitive dans les paquets installés : `@clerk/react@5.54.0` importe l'export `loadClerkUiScript`, absent de `@clerk/shared@3.47.8`.

La correction conforme aux contraintes ne réintroduit pas d'alias Vite, de patch local ou d'import interne Clerk. Il faut installer une version cohérente de `@clerk/react` dès que le registry npm autorise à nouveau le téléchargement du paquet.

## Résultat dev

`npm run dev` dans `DEL-web-main` démarre Vite, puis l'optimisation de dépendances échoue sur la même incohérence transitive `loadClerkUiScript` entre les paquets Clerk installés. Aucun import direct vers `node_modules/@clerk` ou `@clerk/shared` n'est présent dans `DEL-web-main/src`.
