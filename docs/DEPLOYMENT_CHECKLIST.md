# Checklist de déploiement production DEL

## Infrastructure

- [ ] MongoDB Atlas créé.
- [ ] IP access configuré dans MongoDB Atlas.
- [ ] `MONGODB_URI` récupéré et stocké uniquement dans les variables du service API.
- [ ] API déployée sur Render, Railway ou Fly.io.
- [ ] Healthcheck API OK sur `GET /api/health`.
- [ ] DEL-web déployé sur Vercel.
- [ ] DEL-cms déployé sur Vercel.
- [ ] `CORS_ORIGINS` mis à jour avec les URLs Vercel finales de DEL-web et DEL-cms.

## Initialisation métier

- [ ] `ADMIN_EMAILS` renseigné avec les emails administrateurs autorisés.
- [ ] Admin seedé avec `npm run seed:admin` depuis `DEL-api`.
- [ ] Settings seedés avec `npm run seed:settings` depuis `DEL-api`.
- [ ] Login CMS testé avec un compte admin.
- [ ] Mot de passe temporaire admin changé après connexion si la fonctionnalité est disponible.

## Validation fonctionnelle

- [ ] Workflow simple testé : création compte, création équipement, création demande, matching/proposition, contrat.
- [ ] Génération PDF testée depuis le CMS ou les endpoints de rapports.
- [ ] Exports testés depuis le CMS ou les endpoints `/api/exports/*`.
