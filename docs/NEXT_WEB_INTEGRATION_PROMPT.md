# Prompt pour l'intégration réelle du nouveau design DEL-web

Tu travailles dans le repo DEL. Objectif : intégrer progressivement le design analysé dans `DEL-web-main` vers l'application existante `DEL-web`, sans casser `DEL-api`, `DEL-web` ni `DEL-cms`.

Avant de coder, lis :

- `docs/WEB_DESIGN_INTEGRATION_PLAN.md`
- `docs/WEB_DESIGN_API_MAPPING.json`
- `DEL-web/src/lib/api.js`
- les routes existantes dans `DEL-web/src/app`
- les modèles/routes utiles dans `DEL-api/src`

Contraintes strictes :

- Ne pas écraser brutalement `DEL-web`.
- Ne pas créer de workspace.
- Ne pas créer de packages partagés.
- Garder `DEL-api`, `DEL-web`, `DEL-cms` indépendants.
- Ne pas migrer tout le prototype d'un coup.
- Ne pas copier la navigation `activeScreen` de `DEL-web-main`; utiliser le Next App Router existant.
- Ne pas remplacer l'auth réelle par la simulation du composant `Connexion`.
- Remplacer les mocks `INITIAL_*` par les fonctions de `DEL-web/src/lib/api.js`.
- Ajouter systématiquement des états loading/error/empty.
- Protéger tout usage de `localStorage`/`window` côté client uniquement.
- Conserver les pages légales et les flows existants.

Phase recommandée pour une première intégration :

1. Préparer `DEL-web` :
   - vérifier les dépendances nécessaires (`lucide-react`, `motion`, `recharts`) et n'installer que celles réellement utilisées par les composants migrés ;
   - conserver Tailwind 3 sauf demande explicite ;
   - créer des mappers locaux pour convertir les champs API vers les props de composants.

2. Migrer une tranche publique limitée :
   - homepage `/` depuis `AccueilPremium` ;
   - catalogue `/equipment` depuis `ListeEngins` ;
   - détail `/equipment/[id]` depuis `DetailEngin` si possible.

3. Connecter l'API :
   - `/` utilise `getPublicSettings` ou du contenu statique assumé ;
   - `/equipment` utilise `getEquipmentList()` ;
   - `/equipment/[id]` utilise `getEquipmentById(id)`, puis documents/maintenance si disponibles ;
   - remplacer les statuts du prototype par un mapping depuis les enums API.

4. Migrer les formulaires publics :
   - `/deposer-un-engin` vers `createEquipment(payload)` ;
   - `/demander-des-engins` vers `createEquipmentRequest(payload)` ;
   - validation minimale côté client ;
   - affichage succès/erreur clair.

5. Migrer ensuite le dashboard par lots :
   - layout/sidebar ;
   - dashboard résumé ;
   - propositions ;
   - contrats ;
   - factures ;
   - missions ;
   - documents.

6. Tests obligatoires :
   - `cd DEL-web && npm run build`
   - si des endpoints API sont modifiés : `cd DEL-api && npm test`
   - vérifier un workflow manuel : login/register, dépôt engin, liste, détail, demande, dashboard.

Critères d'acceptation :

- `DEL-web` build sans erreur.
- Les pages migrées n'utilisent plus `DEL-web-main/src/data.ts`.
- Les routes existantes restent accessibles.
- Les appels API passent par `DEL-web/src/lib/api.js`.
- Les erreurs API, états vides et chargements sont visibles.
- Aucun endpoint non demandé n'est créé sauf validation explicite.

Commence par une petite PR ciblée plutôt qu'une refonte totale.
