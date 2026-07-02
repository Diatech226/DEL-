# TECHNICAL_AUDIT — Audit technique DEL

## Synthèse

Le dépôt respecte la structure attendue : `DEL-api`, `DEL-web`, `DEL-cms`, `package.json`, `README.md`, `.gitignore`. Aucun dossier `packages/*`, workspace ou dépôt `.git` imbriqué inutile n'a été détecté. Les apps conservent leurs `package.json` indépendants.

## Erreurs trouvées

- `npm install` dans `DEL-api` échoue dans l'environnement courant avec `403 Forbidden - GET https://registry.npmjs.org/jsonwebtoken`.
- Le démarrage API n'a pas pu être validé car `express` n'était pas installé localement après l'échec d'installation.
- `DEL-web` et `DEL-cms` buildent correctement.
- Les pages CMS `messages`, `scoring` et `tender-submissions` existent mais sont très minimales.

## Fichiers corrigés ou mis à jour

- `README.md`
- `DEL-api/README.md`
- `DEL-web/README.md`
- `DEL-cms/README.md`
- `DEL-api/.env.example`
- `DEL-web/.env.example`
- `DEL-cms/.env.example`
- `docs/NEXT_ITERATIONS_CONTEXT.md`
- `docs/TECHNICAL_AUDIT.md`
- `docs/PRODUCT_REVIEW.md`

## Modules incomplets

- Tender submissions : pas de modèle ni contrôleur dédié.
- Messages/conversations : pages placeholders, pas de backend dédié.
- Scoring : logique partielle via matching, pas de module robuste.
- Notifications : présentes, mais pas temps réel.
- PDF : présent, mais templates à professionnaliser.

## Routes cassées ou à vérifier

Aucune route cassée par import n'a été confirmée dans l'audit statique. Les routes déclarées dans `server.js` correspondent à des fichiers existants. Les routes sensibles à vérifier en exécution après installation API :

- `/api/me/*` avec authentification.
- `/api/reports/*/pdf` avec JWT.
- `/api/exports/*` avec rôle admin.
- `/api/tender-lots/:id/matches` et `/api/requests/:id/matches`.

## Fonctions frontend manquantes ou fragiles

`DEL-web/src/lib/api.js` et `DEL-cms/src/lib/api.js` couvrent la plupart des appels utilisés. Les zones à compléter restent liées aux modules non finalisés : tender submissions, scoring détaillé et conversations/messages.

## Pages cassées ou incomplètes

- CMS messages : placeholder.
- CMS scoring : placeholder.
- CMS tender submissions : placeholder.
- Web messages : placeholder.

Les builds Next n'ont pas révélé d'erreurs bloquantes sur ces pages.

## Sécurité

Risques actuels :

- Plusieurs routes CRUD sont publiques ou protégées seulement partiellement.
- `JWT_SECRET` possède une valeur par défaut de développement ; obligatoire à remplacer en production.
- Pas de rate limiting.
- Pas de politique RBAC détaillée documentée.
- Exports et PDF doivent rester strictement admin/authentifiés.

Actions recommandées :

1. Auditer chaque route et imposer `requireAuth`/`requireAdmin` selon le rôle.
2. Ajouter validation Zod sur tous les payloads.
3. Ajouter rate limiting sur auth et exports.
4. Ne jamais accepter de secrets dans `.env.example`.

## Performance

- Ajouter pagination côté API sur listes lourdes.
- Ajouter index MongoDB sur statuts, dates, users, equipmentId, requestId, tenderId.
- Limiter exports volumineux ou les rendre asynchrones.
- Optimiser les dashboards avec agrégations côté API.

## Structure

Points positifs : séparation claire routes/controllers/models/utils. Points à améliorer : normalisation des réponses, conventions de noms de statuts, couverture tests, documentation des workflows.

## Dépendances à vérifier

- `jsonwebtoken`, `express`, `mongoose`, `pdfkit` côté API après résolution du problème npm registry.
- Next.js 15/React 19 côté frontends : builds validés.
- Scripts `next lint` peuvent être obsolètes selon la version Next ; prévoir ESLint explicite si nécessaire.

## Recommandations de refactoring

- Introduire un helper de réponse API standard.
- Centraliser pagination/filtres par contrôleur.
- Ajouter services métier pour matching, contrats, factures et paiements.
- Ajouter tests unitaires services + tests intégration routes.
- Documenter les statuts dans les README ou docs.

## Risques actuels

- API impossible à valider tant que l'installation npm est bloquée.
- Complexité métier élevée avant stabilisation MVP.
- Permissions insuffisantes en production.
- Absence de tests sur workflows critiques.

## Actions urgentes

1. Résoudre l'accès npm registry puis installer `DEL-api`.
2. Démarrer API et tester `GET /api/health`.
3. Ajouter tests health/auth.
4. Durcir les routes admin.
5. Transformer les placeholders messages/scoring/tender submissions en écrans d'état assumés ou modules complets.

## Addendum API — stabilisation DEL-api (2026-07-01)

### Problèmes trouvés

- `server.js` configurait Express, connectait MongoDB et lançait `app.listen` dans le même fichier, ce qui empêchait de tester l’application avec un runner HTTP sans démarrer le serveur.
- `DEL-api/package.json` ne contenait pas `bcryptjs` alors que le standard cible demande un hash de mot de passe via `bcryptjs`.
- Aucun script `test` ni test minimal API n’était disponible.
- Aucun `.npmrc` local ne forçait explicitement le registry officiel npm.
- Le healthcheck ne contenait pas le champ `success` attendu par la normalisation API.

### Corrections faites

- Création de `DEL-api/src/app.js` pour configurer Express, les middlewares, les routes, le 404 et le gestionnaire d’erreurs global sans connexion MongoDB ni `listen`.
- Simplification de `DEL-api/server.js` pour charger l’environnement, connecter MongoDB et démarrer le serveur.
- Ajout de `.npmrc` local.
- Ajout du script `test`, de `supertest` en devDependency et de tests `health` / `auth` basiques.
- Ajout de `bcryptjs` et migration du helper password vers bcrypt, avec compatibilité de vérification pour les anciens hashes `scrypt:`.
- Normalisation du healthcheck avec `{ success: true, status: "ok", service: "DEL-api" }`.
- Mise à jour de `.env.example` et de `DEL-api/README.md`.

### Risques restants

- `npm install --prefix DEL-api` reste bloqué par l’environnement avec `403 Forbidden - GET https://registry.npmjs.org/bcryptjs`; les tests ne peuvent donc pas être exécutés localement tant que les dépendances API ne sont pas installées.
- Les tests ajoutés couvrent uniquement la base de démarrage et la validation auth minimale; les routes métier doivent être couvertes avec une base MongoDB de test.
- La messagerie métier, les tender submissions dédiées et le scoring restent des chantiers fonctionnels à finaliser.
- Les permissions fines doivent encore être auditées avec des scénarios de rôles réels avant une mise en production.

## Audit workflow central

Le cœur business DEL est maintenant représenté côté API par des routes explicites pour matching, proposition, décisions, contrat, facture, mission et résumé workflow. Les modèles ont été alignés avec les statuts nécessaires au cycle central. Limites actuelles : les tests automatisés restent des tests d'import/recalcul sans base MongoDB; le scénario manuel complet doit encore être rejoué avec les trois applications lancées et des comptes réels.
