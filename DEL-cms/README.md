# DEL-cms

Back-office DEL connecté à `DEL-api` pour administrer les engins, demandes et propositions.

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
2. Lancer le CMS sur le port `3001` :

```bash
npm run dev -- -p 3001
```

## Endpoints utilisés

- `GET /api/equipment`
- `PATCH /api/equipment/:id/status`
- `GET /api/requests`
- `PATCH /api/requests/:id/status`
- `GET /api/proposals`
- `POST /api/proposals`
- `PATCH /api/proposals/:id/status`

## Notes de test

- Ouvrir `http://localhost:3001` et vérifier les statistiques.
- Aller dans `/equipment` et changer un statut d'engin.
- Aller dans `/requests` et changer un statut de demande.
- Aller dans `/proposals`, créer une proposition puis changer son statut.
