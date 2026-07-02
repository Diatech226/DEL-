# Connexion DEL-web-main à DEL-api

## Objectif

Connecter progressivement le prototype premium `DEL-web-main` à `DEL-api` sans modifier `DEL-web`, sans workspace et sans package partagé.

## Variables d'environnement

`DEL-web-main` utilise :

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DEL
```

`DEL-api` doit autoriser le port Vite local : `http://localhost:5173` dans `CORS_ORIGINS`.

## Couche HTTP

`DEL-web-main/src/lib/http.ts` centralise :

- base URL depuis `VITE_API_URL` avec fallback `http://localhost:5000` ;
- stockage du token dans `localStorage` ;
- ajout automatique de `Authorization: Bearer <token>` ;
- helpers `apiGet`, `apiPost`, `apiPatch`, `apiDelete` ;
- erreurs utilisateur pour 401, 403, 500 et réseau.

## Services créés

- `auth.service.ts` : login, register, me, updateMe, logout.
- `settings.service.ts` : settings publics.
- `equipment.service.ts` : catalogue, détail, création, mes engins.
- `request.service.ts` : création de demande, mes demandes.
- `tender.service.ts` : base appels d'offres.
- `proposal.service.ts` : mes propositions et décisions company/owner.
- `contract.service.ts`, `invoice.service.ts`, `payment.service.ts`, `mission.service.ts`.
- `document.service.ts`, `maintenance.service.ts`, `notification.service.ts`.

## Mappers créés

- `equipment.mapper.ts` mappe les équipements API vers le type design `Machine` avec fallbacks image, statut, prix et localisation.
- Mappers de base pour request, proposal, contract, invoice, mission, document et profile.

## Écrans connectés dans cette étape

- Connexion / inscription : AuthContext réel et appels `/api/auth/*`.
- Liste des engins : chargement `/api/equipment` via mapper.
- Détail engin : hooks disponibles pour `/api/equipment/:id`, documents et maintenance par équipement.
- Déposer un engin : soumission vers `/api/equipment`.
- Demander des engins : soumission vers `/api/requests`.
- Dashboards : si connecté, chargement des ressources `/api/me/*` disponibles.
- Accueil : garde le fallback visuel premium ; le service settings public est prêt pour enrichissement.

## Mocks restants

`src/data.ts` est conservé comme fallback progressif. Restent notamment mockés ou partiellement simulés : certaines listes de maintenance, appels d'offres affichés, signatures de contrats, acceptation/refus local de propositions, widgets de télémétrie premium et documents si les endpoints ne renvoient pas encore toutes les données design.

## Endpoints utilisés

- `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- `/api/settings/public`
- `/api/equipment`, `/api/equipment/:id`, `/api/me/equipment`
- `/api/requests`, `/api/me/requests`
- `/api/me/proposals`, `/api/me/contracts`, `/api/me/invoices`, `/api/me/payments`, `/api/me/missions`, `/api/me/documents`, `/api/me/notifications`
- `/api/documents`, `/api/documents/entity/:entityType/:entityId`
- `/api/maintenance/equipment/:equipmentId`

## Commandes de test

```bash
cd DEL-web-main
npm install
npm run build
npm run dev

cd ../DEL-api
npm run dev
curl http://localhost:5000/api/health
```

## Limites restantes

- `activeScreen` reste temporaire pour préserver la maquette ; migration router à planifier.
- Certains payloads API peuvent nécessiter un ajustement fin selon les champs réellement renvoyés en environnement local.
- Les composants premium ne sont pas tous entièrement découplés des mocks ; la migration doit continuer écran par écran.
