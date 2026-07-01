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
