# Configuration Clerk pour DEL-web-main

1. Créer ou ouvrir l’application DEL dans le dashboard Clerk.
2. Copier la clé publique dans `DEL-web-main/.env` sous `VITE_CLERK_PUBLISHABLE_KEY`.
3. Copier la clé secrète uniquement dans `DEL-api/.env` sous `CLERK_SECRET_KEY`.
4. Définir `CLERK_AUTHORIZED_PARTIES=http://localhost:5173` en local.
5. Activer Email/password dans les méthodes de connexion Clerk.
6. Activer Google dans Social connections du dashboard Clerk. Ne pas créer d’OAuth Google artisanal et ne pas stocker de secret Google dans `DEL-web-main`.
7. Ajouter les URLs/domaines locaux autorisés pour `DEL-web-main`, par exemple `http://localhost:5173`.
8. Ajouter les domaines de production avant déploiement.
9. Vérifier les redirections sign-in/sign-up/sign-out dans Clerk.
10. Tester email, inscription, Google, synchronisation `/api/auth/clerk/sync`, puis accès `/api/me/*`.

La connexion Google ne doit être déclarée fonctionnelle qu’après vérification de son activation dans l’instance Clerk réelle.
