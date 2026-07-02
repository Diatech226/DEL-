# NEXT_ITERATIONS_CONTEXT — Continuité ChatGPT/Codex

## 1. Résumé du projet

DEL est une plateforme numérique pour commercialiser et opérer des engins industriels : placement, location, vente, suivi, maintenance, facturation, administration et reporting. Les secteurs visés sont les mines, le BTP, la logistique et les grands chantiers.

Le dépôt contient trois applications indépendantes :

- `DEL-api` : backend Express.js + MongoDB.
- `DEL-web` : site public + espace utilisateur Next.js.
- `DEL-cms` : back-office administrateur Next.js.

Le modèle métier principal relie propriétaires d'engins, entreprises clientes, administrateurs et techniciens autour d'un workflow : inventaire d'engins → demandes/appels d'offres → matching → propositions → contrats → documents → factures/paiements → missions/maintenance → reporting.

## 2. Architecture actuelle

```text
DEL/
├── DEL-api/
├── DEL-cms/
├── DEL-web/
├── docs/
├── package.json
├── README.md
└── .gitignore
```

Ports :

- API : `5000`, healthcheck `GET /api/health`.
- Web : `3000`.
- CMS : `3001`.

Scripts racine :

- `npm run dev` lance les trois apps avec `concurrently`.
- `npm run dev:api`, `npm run dev:web`, `npm run dev:cms` lancent une app.
- `npm run install:all` installe les dépendances des trois apps.
- `npm run build:all` build Web puis CMS.

Dépendances principales : Express, Mongoose, JWT, PDFKit côté API ; Next.js 15, React 19 et Tailwind côté frontends.

## 3. État réel des apps

### DEL-api

Ce qui marche structurellement : `server.js`, configuration CORS/env, routes nombreuses, contrôleurs et modèles alignés sur la plupart des modules. `GET /api/health` est déclaré.

Partiellement fait : permissions, validation, audit exhaustif, pagination, scoring, tender submissions, messagerie.

Non validé dans l'environnement d'audit : `npm install` API a échoué avec `403 Forbidden - GET https://registry.npmjs.org/jsonwebtoken`, donc le démarrage réel n'a pas pu être exécuté faute de dépendances locales.

Points fragiles : routes publiques trop permissives, absence de tests, absence de MongoDB dans l'environnement, workflows complexes sans tests bout-en-bout.

### DEL-web

Ce qui marche : App Router, layout, homepage, pages publiques, dashboard, appels d'offres, équipement, demandes, documents, contrats, factures, paiements, missions, notifications, profil. Le build Next passe.

Partiellement fait : design premium, UX de formulaires, états vides homogènes, messages.

Points fragiles : dépendance forte à l'API ; si l'API renvoie des erreurs ou manque de données, l'expérience peut être pauvre même si le build passe.

### DEL-cms

Ce qui marche : App Router, dashboard, AdminSidebar, AdminGuard, nombreuses pages admin, `lib/api.js`, build Next validé sur 28 pages.

Partiellement fait : messages, scoring et tender submissions sont encore très légers ; certaines pages nécessitent meilleure pagination/filtres/actions.

Points fragiles : erreurs API à mieux afficher, besoin d'un vrai modèle de permissions admin, risque d'EPERM Windows sur `.next`.

## 4. Modules présents

| Module | API | Routes clés | CMS | Web | Améliorations nécessaires |
| --- | --- | --- | --- | --- | --- |
| Auth | Présent complet de base | `/api/auth/*` | login + guard | login/register | rôles, refresh, durcissement JWT |
| Profiles | Présent | owner/company/technician profiles | pages profils | onboarding/profil | validations KYC plus fortes |
| Equipment | Présent | `/api/equipment` | liste/détail | liste/détail/dépôt | médias, disponibilité, qualité fiches |
| Requests | Présent | `/api/requests`, matches | liste/détail | création/dashboard | matching testé et explicable |
| Tenders | Présent | `/api/tenders` | liste/détail | création/dashboard | workflow appel d'offres complet |
| Tender submissions | Absent dédié | pas de modèle dédié | placeholder | absent dédié | créer modèle ou fusion assumée avec proposals |
| Matching | Partiel | request/tender-lot matches | visible via détails | indirect | scoring explicable, pondération |
| Proposals | Présent | `/api/proposals` | liste/actions | dashboard | états, décisions, notifications |
| Contracts | Présent | `/api/contracts` | liste/détail | dashboard | génération PDF et signature |
| Documents | Présent | `/api/documents` | validation | dashboard | KYC, stockage fichiers réel |
| Invoices | Présent | `/api/invoices` | liste/détail | dashboard | taxes, PDF, numérotation auditée |
| Payments | Présent manuel | `/api/payments` | liste | dashboard | rapprochement, PSP plus tard |
| Missions | Présent | `/api/missions` | liste/détail | dashboard | planning terrain, rapports |
| Maintenance | Présent | `/api/maintenance` | liste/détail | indirect | SLA, pièces, coûts |
| Planning | Présent via schedules | `/api/equipment-schedules` | planning | indirect | calendrier visuel |
| Notifications | Présent | `/api/notifications`, `/api/me/notifications` | gestion | dashboard | temps réel plus tard |
| Messages | Absent métier | aucune route dédiée | placeholder | placeholder | créer conversations/messages |
| Settings | Présent | `/api/settings` | page settings | settings publics | config complète production |
| Audit | Présent | `/api/audit-logs` | liste/détail | absent | couverture de toutes actions sensibles |
| Exports | Présent | `/api/exports/*` | page exports | absent | filtres, formats, volumes |
| Scoring | Partiel | via matching | placeholder | absent | modèle dédié et règles business |
| Reports PDF | Présent | `/api/reports/*/pdf` | boutons PDF | boutons PDF | templates propres et branding |

## 5. Ce qui est intéressant

- La séparation API/Web/CMS est saine pour une plateforme métier.
- Le workflow demande → matching → proposition → contrat est le cœur business et différenciant.
- Les modules documents, factures, paiements, missions et maintenance transforment DEL en outil opérationnel, pas seulement marketplace.
- Les exports, audit logs et settings donnent une base de back-office professionnel.

## 6. Ce qui est moins intéressant ou trop tôt

- Paiement réel, GPS réel, vidéo, investissement fractionné, dividendes et IA avancée sont trop tôt pour le MVP.
- Scoring avancé sans données historiques risque d'être fragile.
- Messagerie temps réel peut attendre une version stabilisée des workflows.
- Multiplier les modules sans finaliser les parcours critiques augmente le risque de bugs.

## 7. Roadmap priorisée

### Priorité 1 — Stabilisation

- Corriger installation/démarrage API dans un environnement propre.
- Vérifier MongoDB + healthcheck.
- Garder les builds Web/CMS verts.
- Rendre toutes les pages sans crash.
- Harmoniser design et composants locaux.

### Priorité 2 — Expérience utilisateur

- Dashboard clair par rôle.
- Navigation guidée.
- Formulaires robustes.
- États loading/error/empty.
- Responsive mobile.
- Messages clairs.

### Priorité 3 — Fonctionnalités métier essentielles

- Workflow demande → matching → proposition → validation → contrat.
- Documents/KYC.
- Factures.
- Paiements manuels.
- Missions.
- Maintenance.

### Priorité 4 — Professionnalisation

- PDF brandés.
- Audit généralisé.
- Exports fiables.
- Paramètres CMS.
- Notifications.
- Messagerie.
- Scoring.

### Priorité 5 — Plus tard

- Paiement réel.
- GPS réel.
- Vidéo.
- Investissement fractionné.
- Dividendes.
- IA avancée.
- App mobile.

## 8. Recommandations design

Style recommandé : industriel premium, fiable, sobre. Palette : bleu nuit/graphite, orange sécurité ou jaune chantier en accent, gris clairs pour surfaces, vert pour états validés. Priorités : accueil, dashboard CMS, fiches équipement, écrans demande/proposition/contrat. Unifier les composants dans chaque app sans créer de package partagé : boutons, cards, tableaux, badges statut, formulaires, alertes.

## 9. Recommandations techniques

- Ajouter tests API et tests de build en CI.
- Normaliser réponses API, pagination et filtres.
- Protéger routes sensibles par rôle.
- Ajouter validation Zod systématique.
- Créer conventions de statuts communes documentées, sans package partagé.
- Déployer Web/CMS sur Vercel et API sur Render/Railway/Fly avec MongoDB Atlas.
- Prévoir logs structurés, rate limiting et politique CORS stricte en production.

## 10. Dix prochaines itérations suggérées

1. Stabilisation CMS + build + API install/démarrage.
2. Refonte UI dashboard CMS.
3. Refonte page accueil DEL-web.
4. Finalisation workflow engin/demande/matching/proposition.
5. Finalisation contrats/factures/paiements.
6. Finalisation documents/KYC.
7. Finalisation missions/maintenance.
8. Ajout PDF propres et brandés.
9. Ajout audit/export/settings complets.
10. Préparation déploiement production.

## 11. Instructions pour la prochaine session ChatGPT

État exact : structure correcte, pas de workspace, pas de packages partagés, builds Web/CMS validés, API non validée à cause d'un blocage npm registry sur `jsonwebtoken` dans l'environnement courant.

Fichiers à regarder en priorité : `DEL-api/server.js`, `DEL-api/src/routes/*`, `DEL-api/src/middlewares/auth.middleware.js`, `DEL-web/src/lib/api.js`, `DEL-cms/src/lib/api.js`, `DEL-cms/src/components/AdminSidebar.jsx`, `DEL-web/src/app/page.jsx`, `DEL-cms/src/app/page.jsx`.

Bugs/risques restants : installation API bloquée par registry, absence de tests, pages messages/scoring/tender-submissions placeholders, permissions à durcir.

Prochaine étape recommandée : rendre l'API installable et testable dans un environnement avec accès npm normal, puis ajouter tests health/auth/workflow.

Commandes de test :

```bash
npm install
npm run install:all
npm run build:all
npm run dev
curl http://localhost:5000/api/health
```

## Mise à jour API — stabilisation DEL-api (2026-07-01)

- `DEL-api/package.json` a été complété avec `bcryptjs`, `supertest` et le script `test` (`node --test`).
- `DEL-api/.npmrc` force maintenant `https://registry.npmjs.org/` avec `strict-ssl=true` sans token ni secret.
- L’application Express est séparée de `server.js` via `DEL-api/src/app.js` pour permettre les tests sans lancer `app.listen` ni connecter MongoDB.
- `server.js` charge `dotenv`, connecte MongoDB via `connectDB()`, puis lance l’écoute sur `PORT`.
- Le healthcheck `GET /api/health` retourne `{ success: true, status: "ok", service: "DEL-api" }`.
- Des tests Node natifs ont été ajoutés pour le healthcheck et la validation minimale de `/api/auth/register` et `/api/auth/login`.
- Le hashing de mot de passe utilise maintenant `bcryptjs`; les anciens hashes `scrypt:` restent vérifiables pour compatibilité.
- `.env.example` documente les variables minimales et les URLs locales utiles.
- Installation non validée dans cet environnement : `npm install --prefix DEL-api` échoue encore avec `403 Forbidden - GET https://registry.npmjs.org/bcryptjs`, ce qui confirme un blocage registry/environnement plutôt qu’un problème propre à `jsonwebtoken`.
- Prochaine étape recommandée : relancer `npm install` dans un environnement avec accès npm autorisé, puis exécuter `npm run test`, `npm run dev` et un audit de permissions route par route avec MongoDB disponible.

## Workflow central stabilisé

### Ce qui fonctionne
- Matching exploitable via `GET /api/requests/:id/matches` avec score, raisons et alertes.
- Création de proposition depuis demande avec décisions entreprise/propriétaires initialisées.
- Recalcul centralisé du workflow proposition (`PENDING_COMPANY`, `PENDING_OWNERS`, `READY_FOR_CONTRACT`, rejets).
- Création de contrat, facture et mission depuis les entités amont.
- Route CMS `GET /api/workflows/requests/:id` pour suivre l'avancement d'un dossier.

### Ce qui reste à tester
- Scénario manuel complet avec MongoDB, comptes entreprise/propriétaire/admin et données réelles.
- Notifications et audit en conditions réelles.
- Génération PDF selon disponibilité du module reports.

### Prochains modules à améliorer
- Écrans CMS détaillés avec timeline enrichie et formulaires préremplis.
- Dashboards web avec filtres par rôle et vues détail proposition.
- Tests d'intégration MongoDB dédiés au cycle complet.

## UI/UX refondue

### Ce qui a été amélioré

- Identité visuelle DEL renforcée : palette bleu nuit/graphite, accent chantier, cartes blanches, statuts lisibles et tonalité industrielle premium.
- DEL-web dispose maintenant d’une page d’accueil plus claire, orientée propriétaires, entreprises, appels d’offres et pilotage opérationnel.
- DEL-cms dispose d’un dashboard admin plus exploitable avec indicateurs, alertes, raccourcis et activité récente.
- Navigation améliorée sur DEL-web et DEL-cms, avec menus responsive.

### Pages refondues

- DEL-web : accueil, navbar, footer.
- DEL-cms : dashboard administrateur, sidebar admin, nouvelle page `/workflows`.

### Composants ajoutés

- DEL-web : composants UI locaux dans `DEL-web/src/components/ui` et statut local dans `DEL-web/src/lib/status.js`.
- DEL-cms : composants UI locaux dans `DEL-cms/src/components/ui` et statut local dans `DEL-cms/src/lib/status.js`.
- Aucun package partagé, workspace ou librairie UI lourde n’a été ajouté.

### Problèmes restants

- Les pages listes/détails et formulaires existants restent partiellement hétérogènes : elles compilent, mais toutes ne sont pas encore migrées vers les nouveaux composants UI.
- Les tests manuels complets avec API et navigateurs doivent être faits dans un environnement persistant avec données de démonstration.
- Les pages CMS placeholder (`messages`, `scoring`, certains lots/soumissions) restent simples.

### Prochaine étape recommandée

Migrer par lot les pages métier les plus importantes vers les composants UI locaux : demandes, propositions, contrats, factures, engins et documents. Priorité : détails `requests/[id]`, `proposals/[id]`, `contracts/[id]`, `invoices/[id]`, `equipment/[id]`, puis formulaires web.

## Préparation déploiement production

### Variables nécessaires

API (`DEL-api`) :

- `PORT=5000`
- `NODE_ENV=production`
- `MONGODB_URI` obligatoire en production, à fournir depuis MongoDB Atlas.
- `CORS_ORIGINS` obligatoire à maintenir avec les domaines Vercel finaux, séparés par virgule.
- `JWT_SECRET` obligatoire en production et différent de la valeur de développement.
- `JWT_EXPIRES_IN=7d`
- `ADMIN_EMAILS` pour le seed des comptes administrateurs.
- `APP_URL`, `CMS_URL`, `API_URL` pour documenter les URLs publiques des trois services.

Web (`DEL-web`) :

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME=DEL`

CMS (`DEL-cms`) :

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME=DEL`
- `NEXT_PUBLIC_WEB_URL`

### État de préparation

- Les scripts de production restent indépendants par app : `npm start` côté API, `next build` puis `next start -p 3000` côté Web, `next build` puis `next start -p 3001` côté CMS.
- `CORS_ORIGINS` supporte plusieurs domaines séparés par virgule et conserve des valeurs localhost par défaut hors production.
- `helmet` est activé dans Express.
- `express.json` est limité à `1mb`.
- Les réponses d'erreur ne renvoient pas de stack en production.
- `passwordHash` est exclu par défaut des requêtes Mongoose et supprimé du JSON utilisateur.
- `JWT_SECRET` et `MONGODB_URI` sont maintenant obligatoires au démarrage lorsque `NODE_ENV=production`.
- `render.yaml` est présent à la racine pour faciliter un déploiement Render sans secrets commités.
- `docs/DEPLOYMENT_CHECKLIST.md` liste les étapes de mise en production.

### Risques

- Les URLs Vercel définitives devront être copiées dans `CORS_ORIGINS` après le premier déploiement Web/CMS, sinon le navigateur bloquera les appels API.
- Les seeds production nécessitent une connexion MongoDB Atlas valide et les variables `ADMIN_EMAILS`, `MONGODB_URI` et `JWT_SECRET` disponibles dans l'environnement du shell/API.
- Le mot de passe temporaire admin `changer-moi-123` doit être changé rapidement après la première connexion si le changement de mot de passe est disponible.
- Les workflows métier critiques, PDF et exports doivent être validés avec de vraies données Atlas avant ouverture utilisateur.
- L'absence de rate limiting et de tests end-to-end reste un point de durcissement pour une production publique.

### Prochaines actions

1. Créer le cluster MongoDB Atlas et configurer l'IP access.
2. Déployer DEL-api sur Render, Railway ou Fly.io avec les variables de production.
3. Vérifier `GET /api/health` sur l'URL publique API.
4. Déployer DEL-web sur Vercel avec `Root Directory: DEL-web`.
5. Déployer DEL-cms sur Vercel avec `Root Directory: DEL-cms`.
6. Mettre à jour `CORS_ORIGINS` côté API avec les deux URLs Vercel finales.
7. Lancer `npm run seed:admin` puis `npm run seed:settings` dans l'environnement API production.
8. Tester login CMS, workflow simple, PDF et exports.
