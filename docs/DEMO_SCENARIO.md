# Scénario de démonstration MVP DEL

## URLs de démonstration

- Web Main : http://localhost:5173
- CMS Main : http://localhost:5174
- API health : http://localhost:5000/api/health

## Comptes de démonstration

> Mot de passe commun de démo : `Demo@DEL2026!`  
> À utiliser uniquement en local ou en environnement de démonstration, jamais en production.

- Admin CMS : `admin@del.demo`
- Propriétaire : `proprietaire@del.demo` — Société Faso Engins
- Entreprise : `entreprise@del.demo` — Mine Houndé Operations

## Parcours recommandé

1. Ouvrir le CMS puis se connecter avec le compte admin.
2. Aller dans **Engins** et vérifier les 3 engins de démonstration : camion benne, pelle hydraulique, bulldozer.
3. Valider ou consulter l’engin “Camion benne — Faso Engins”.
4. Aller dans **Demandes** et ouvrir la demande “2 camions bennes à Houndé pour 6 mois”.
5. Lancer le **Matching** ou sélectionner manuellement les engins compatibles.
6. Aller dans **Propositions** et créer/consulter la proposition DEL liée à la demande.
7. Depuis le Web entreprise, accepter la proposition.
8. Depuis le Web propriétaire, accepter la proposition côté propriétaire.
9. Revenir dans le CMS et créer le contrat simple depuis la proposition acceptée.
10. Créer une facture simple rattachée au contrat.
11. Créer une mission simple pour le site de Houndé.
12. Ajouter ou vérifier un document administratif rattaché à l’engin ou à la demande.
13. Télécharger les PDF essentiels disponibles : contrat, facture ou document.

## Notes de stabilité

Si une étape avancée n’est pas automatisée dans l’interface, utiliser l’écran CMS correspondant pour créer l’objet suivant manuellement. Le workflow à démontrer reste : demande → matching → proposition → acceptations → contrat → facture → mission → documents/PDF.
