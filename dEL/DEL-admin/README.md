# DEL Admin

Application Next.js d'administration pour voir les engins, demandes, propositions, utilisateurs et entreprises.

## Installation
```bash
cd dEL/DEL-admin
npm install
cp .env.example .env.local
```

## Variables d'environnement
- `NEXT_PUBLIC_API_URL`: URL de l'API, par défaut conseillé `http://localhost:5000/api`.

## Lancement
```bash
npm run dev
```
L'application démarre sur `http://localhost:3001`.

## Build
```bash
npm run build
npm start
```

## Déploiement recommandé
Déployer sur Vercel, Netlify ou un hébergement Node.js compatible Next.js avec accès sécurisé.
