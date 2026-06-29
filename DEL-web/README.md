# DEL-web

Application publique DEL connectée à `DEL-api` pour créer et consulter les engins et demandes.

## Installation

```bash
npm install
```

## Variables d'environnement

Créer `.env.local` si nécessaire :

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Ordre de lancement

1. Lancer `DEL-api` sur le port `5000`.
2. Lancer l'application web :

```bash
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Endpoints utilisés

- `GET /api/equipment`
- `GET /api/equipment/:id`
- `POST /api/equipment`
- `GET /api/requests`
- `POST /api/requests`

## Notes de test

- Ouvrir `http://localhost:3000`.
- Déposer un engin via `/deposer-un-engin`.
- Vérifier sa présence dans `/equipment`.
- Ouvrir son détail via `/equipment/:id`.
- Publier une demande via `/demander-des-engins`.
