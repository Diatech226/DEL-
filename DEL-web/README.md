# DEL-web

Site public et espace utilisateur Next.js autonome de DEL.

## Installation
```bash
npm install
cp .env.example .env
```
## Variables d’environnement
- `NEXT_PUBLIC_API_URL=http://localhost:5000`
## Commandes
```bash
npm run dev
npm run build
npm start
```
## Développement local
Démarrer `DEL-api`, puis lancer `npm run dev`. L’application écoute sur le port 3000.
## Build
```bash
npm run build
```
## Déploiement recommandé
Déployer sur Vercel avec `NEXT_PUBLIC_API_URL` pointant vers l’API Render.
