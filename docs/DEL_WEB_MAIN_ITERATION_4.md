# DEL-web-main — Itération 4 Factures & Paiements

## Objectif
Connecter uniquement les modules utilisateur **Factures** et **Paiements** de `DEL-web-main` à `DEL-api`, sans modifier `DEL-web`, `DEL-cms` ni `DEL-cms-main`.

## Factures connectées
- `Factures.tsx` charge les factures liées à l'utilisateur via `GET /api/me/invoices`.
- La liste affiche numéro, titre, entreprise, total, payé, solde, devise, statut et échéance.
- Un détail simple est affiché depuis les données déjà reçues de la liste, sans dépendre d'un endpoint admin.

## Paiements connectés
- `Factures.tsx` charge les paiements liés à l'utilisateur via `GET /api/me/payments`.
- La liste affiche numéro, facture liée, contrat lié, montant, devise, méthode, référence, statut et date.
- Les paiements restent en lecture seule : aucune création ni confirmation côté utilisateur.

## PDF facture
- Le téléchargement PDF utilise `GET /api/reports/invoices/:id/pdf` via `downloadInvoicePdf(id)`.
- Les erreurs 401, 403, 404, 500 et réseau sont affichées sans page blanche.

## Résumé financier minimal
- Un résumé financier est calculé côté frontend depuis les factures et paiements utilisateur.
- Il affiche total factures, montant total dû, montant payé, solde restant et nombre de paiements.
- Il est visible dans le dashboard entreprise et dans l'écran Factures & Paiements.

## Services créés ou complétés
- `DEL-web-main/src/services/invoice.service.ts`
- `DEL-web-main/src/services/payment.service.ts`
- `DEL-web-main/src/services/report.service.ts`

## Mappers créés ou complétés
- `DEL-web-main/src/mappers/invoice.mapper.ts`
- `DEL-web-main/src/mappers/payment.mapper.ts`

## Endpoints utilisés
- `GET /api/me/invoices`
- `GET /api/me/payments`
- `GET /api/reports/invoices/:id/pdf`

## Paiement réel non connecté
Le bouton de paiement réel n'est pas actif. Le MVP indique que le paiement en ligne est à venir et que les paiements sont enregistrés par l'administration DEL.

## Mocks restants
- Missions, documents, notifications, messages et maintenance restent hors périmètre de cette itération.
- Les données historiques non financières encore présentes dans certains dashboards restent à migrer lors d'itérations dédiées.

## Limites
- Aucun endpoint détail facture/paiement utilisateur n'est appelé depuis l'écran utilisateur afin d'éviter d'utiliser un endpoint potentiellement admin.
- Le résumé financier est volontairement minimal et ne connecte pas de graphiques complexes.

## Commandes de test
```bash
cd DEL-api && npm run dev
curl http://localhost:5000/api/health
cd DEL-web-main && npm install
cd DEL-web-main && npm run build
cd DEL-web-main && npm run dev
git diff -- DEL-web
git diff -- DEL-cms
git diff -- DEL-cms-main
```

## Prochaine itération recommandée
Connecter progressivement les modules documents ou missions utilisateur, avec garde-fous identiques : périmètre limité, pas de workspace partagé, pas de refonte globale.
