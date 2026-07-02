# DEL-api

API Express/MongoDB de la plateforme DEL. Elle sert les applications `DEL-web` et `DEL-cms` pour l’authentification, les profils, les équipements, les demandes, les appels d’offres, les propositions, les contrats, les factures, les paiements, les missions, la maintenance, les notifications, les paramètres, les exports, les rapports PDF et les journaux d’audit.

## Installation

```bash
cd DEL-api
npm install
```

Un fichier `.npmrc` local force le registry npm officiel :

```ini
registry=https://registry.npmjs.org/
strict-ssl=true
```

## Configuration `.env`

Copier `.env.example` vers `.env` puis renseigner au minimum :

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/del
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
ADMIN_EMAILS=
```

Aucun secret réel ne doit être versionné. En développement, l’API peut démarrer sans `MONGODB_URI` pour exposer le healthcheck, mais les routes métier nécessitent MongoDB.

## Scripts

```bash
npm run dev            # nodemon server.js
npm start              # node server.js
npm run test           # node --test
npm run seed:admin     # crée / met à jour les administrateurs depuis ADMIN_EMAILS
npm run seed:settings  # initialise les paramètres plateforme
```

## Démarrage et healthcheck

```bash
npm run dev
curl http://localhost:5000/api/health
```

Réponse attendue :

```json
{
  "success": true,
  "status": "ok",
  "service": "DEL-api"
}
```

## Tests

Les tests utilisent le runner Node.js intégré et vérifient le healthcheck ainsi que la validation minimale de `/api/auth/register` et `/api/auth/login`.

```bash
npm run test
```

Les tests d’intégration métier complets nécessitent une base MongoDB via `MONGODB_URI`.

## Routes principales

- Public : `GET /api/health`, `GET /api/settings/public`, `POST /api/auth/register`, `POST /api/auth/login`.
- Utilisateur connecté : `/api/auth/me`, `/api/me/*`, notifications utilisateur.
- Administration : `/api/users`, validations de profils/documents, paramètres admin, audit logs, exports, changements de statuts sensibles.
- Métier : équipements, demandes, appels d’offres, lots, propositions, contrats, documents, factures, paiements, missions, maintenance, planning.
- Reporting : `/api/reports/*/:id/pdf`.
- Exports : `/api/exports/equipment`, `/api/exports/requests`, `/api/exports/tenders`, `/api/exports/proposals`, `/api/exports/contracts`, `/api/exports/invoices`, `/api/exports/payments`, `/api/exports/missions`, `/api/exports/maintenance`, `/api/exports/documents`, `/api/exports/users`, `/api/exports/audit-logs`, `/api/exports/full-backup`.

## Sécurité

- Authentification JWT Bearer via `requireAuth`.
- Administration via `requireAdmin` (`req.user.role === "ADMIN"`).
- Rôles multiples via `requireRole`.
- Authentification optionnelle via `optionalAuth` pour les routes publiques enrichies.
- Les mots de passe sont hashés avec `bcryptjs`. Les anciens hashes `scrypt:` restent vérifiables pour compatibilité.
- Les réponses utilisateur n’exposent pas `passwordHash`.

## Limites actuelles

- Certains modules restent des bases fonctionnelles et demandent des tests d’intégration avec MongoDB.
- La messagerie métier et les tender submissions dédiées ne sont pas encore implémentées comme modules complets.
- Le scoring existe partiellement et doit être durci lors d’une itération dédiée.
- Les permissions fines par rôle métier doivent être auditées route par route avant production.

## Dépannage npm / jsonwebtoken 403

Si `npm install` échoue avec `403 Forbidden - GET https://registry.npmjs.org/jsonwebtoken` ou un autre package :

1. Vérifier le registry :
   ```bash
   npm config get registry
   ```
2. Forcer le registry officiel :
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```
3. Supprimer les artefacts locaux si nécessaire sous PowerShell :
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   ```
4. Relancer :
   ```bash
   npm install
   ```

Ne pas lancer automatiquement `npm audit fix --force` : cela peut introduire des changements majeurs non contrôlés.

## Prochaines améliorations

- Ajouter une base MongoDB de test et couvrir les parcours auth complets.
- Finaliser messages métier, tender submissions dédiées et scoring.
- Renforcer les permissions par module et documenter une matrice de rôles.
- Ajouter des tests d’exports CSV/JSON et de rapports PDF.
