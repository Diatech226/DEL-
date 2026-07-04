# DEL-web-main — Itération 2 Auth + formulaires

## Objectif
Connecter uniquement `DEL-web-main` à `DEL-api` pour l’authentification réelle, le dépôt public d’engins, la demande publique d’engins et un dashboard minimal après connexion.

## Auth connectée
- `POST /api/auth/login` via `auth.service.login`.
- `POST /api/auth/register` via `auth.service.register`.
- `GET /api/auth/me` via `AuthContext.refreshMe` après connexion.
- `PATCH /api/auth/me` est exposé pour les prochaines évolutions de profil.
- Le token est conservé avec les helpers de `src/lib/http.ts`; un 401 efface le token.

## Formulaires connectés
- `Connexion.tsx` utilise `AuthContext` pour login/register, sans simulation locale ni compte démo codé en dur.
- `DeposerEngin.tsx` appelle `createEquipment` avec `mapDesignEquipmentToApiPayload`.
- `DemanderEngin.tsx` appelle `createEquipmentRequest` avec `mapDesignRequestToApiPayload`.

## Services créés ou complétés
- `src/services/auth.service.ts`
- `src/services/equipment.service.ts`
- `src/services/request.service.ts`
- `src/services/dashboard.service.ts`

## Mappers créés ou complétés
- `src/mappers/equipment.mapper.ts` ajoute le mapping design vers API pour la création d’engin.
- `src/mappers/request.mapper.ts` ajoute le mapping design vers API pour la création de demande.

## Endpoints utilisés
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `GET /api/equipment`
- `GET /api/equipment/:id`
- `POST /api/equipment`
- `POST /api/requests`
- `GET /api/me/summary`
- `GET /api/me/equipment`
- `GET /api/me/requests`

## Mocks restants
Les propositions, contrats, factures, missions, documents, notifications, maintenance, paiements et appels d’offres avancés restent non connectés dans cette itération.

## Limites
- Aucun upload réel de documents ou photos n’est ajouté; `photos` accepte des URLs ou reste vide.
- Le dashboard reste volontairement minimal et ne connecte pas les modules métiers avancés.
- Les erreurs sont affichées sans page blanche avec les messages standards 401/403/500/réseau.

## Commandes de test
```bash
cd DEL-api && npm run dev
curl http://localhost:5000/api/health
cd DEL-web-main && npm install && npm run build && npm run dev
```

## Prochaine itération recommandée
Connecter les propositions et le flux simple de réponse à une demande, puis seulement ensuite les contrats et documents.
