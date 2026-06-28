# DEL Web

Application Next.js publique pour consulter les engins, déposer un engin, publier une demande et accéder à un dashboard utilisateur.

## Installation
```bash
cd dEL/DEL-web
npm install
cp .env.example .env.local
```

## Variables d'environnement
- `NEXT_PUBLIC_API_URL`: URL de l'API, par défaut conseillé `http://localhost:5000/api`.

## Lancement
```bash
npm run dev
```
L'application démarre sur `http://localhost:3000`.

## Build
```bash
npm run build
npm start
```

## Déploiement recommandé
Déployer sur Vercel, Netlify ou un hébergement Node.js compatible Next.js.
