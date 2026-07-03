# DEL-cms-main — Itération 6 Paramètres

## Objectif
Connecter progressivement `DEL-cms-main` à `DEL-api` uniquement pour le module Paramètres CMS, sans refonte globale, sans workspace et sans package partagé.

## Page connectée
- Vue `Paramètres` dans `DEL-cms-main`, onglet `Paramètres Plateforme`.
- La vue charge les paramètres admin depuis DEL-api, affiche un formulaire complet, sauvegarde les changements et permet le reset par défaut avec confirmation.

## Service créé
- `DEL-cms-main/src/services/settings.service.ts`
  - `getAdminSettings()`
  - `updateAdminSettings(payload)`
  - `resetSettingsToDefault()`

## Mapper créé
- `DEL-cms-main/src/mappers/settings.mapper.ts`
  - `mapApiSettingsToAdminForm(apiSettings)`
  - `mapAdminFormToApiSettingsPayload(formState)`
  - fallbacks intégrés : `DEL`, `XOF`, `['XOF', 'USD', 'EUR']`, commission `10`, taxe `0`.

## Endpoints utilisés
- `GET /api/settings/admin`
- `PATCH /api/settings/admin`
- `POST /api/settings/reset`

Ces routes utilisent la couche HTTP existante, donc le token admin est envoyé via `Authorization: Bearer <token>` et les erreurs `401/403` restent affichées avec les messages centralisés.

## Sections du formulaire
1. Identité DEL.
2. Coordonnées.
3. Informations légales.
4. Paramètres financiers.
5. Options métier.
6. Textes légaux.
7. Textes publics.

## Actions disponibles
- Charger les paramètres admin.
- Modifier et sauvegarder les paramètres.
- Modifier `platformName`, `defaultCurrency`, `defaultPlatformCommissionRate` et les textes légaux.
- Réinitialiser les paramètres par défaut après confirmation navigateur.
- Afficher les messages de succès et les erreurs API sans les masquer.

## Reset paramètres
Le bouton `Réinitialiser par défaut` appelle `POST /api/settings/reset` uniquement après confirmation explicite. Le formulaire est ensuite remappé depuis la réponse API.

## Résumé dashboard
Une carte `Paramètres plateforme` a été ajoutée au dashboard avec :
- `platformName` ;
- `defaultCurrency` ;
- `defaultPlatformCommissionRate` ;
- état synthétique des modules PDF, notifications, scoring et tenders ;
- lien `Modifier les paramètres`.

## Utilisation minimale dans le CMS
- Le header affiche le `platformName` synchronisé.
- Le dashboard et quelques libellés financiers utilisent `defaultCurrency` comme fallback minimal.
- Aucune refonte globale des modules existants n'a été faite.

## Mocks restants
- Audit, exports, notifications, messages et scoring ne sont pas connectés dans cette itération.
- Les vues hors Paramètres gardent leurs comportements existants.

## Limites
- La validation fonctionnelle complète dépend d'une API lancée avec MongoDB et d'un compte admin valide.
- Les modules non ciblés ne sont pas refactorés.
- Les labels techniques des options métier restent proches des clés API pour éviter une couche de traduction lourde.

## Commandes de test
- `npm run build --prefix DEL-cms-main`
- `git diff -- DEL-cms`
- `git diff -- DEL-web`
- `git diff -- DEL-web-main`

## Prochaine itération recommandée
Connecter un module administratif isolé à la fois, de préférence `audit` ou `exports`, tout en gardant notifications, messages et scoring hors périmètre tant que les workflows centraux ne sont pas stabilisés.
