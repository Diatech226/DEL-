# Design System DEL

Date : 2026-07-02.

## Objectif

Le Design System DEL doit devenir la source unique des composants visuels, tokens, états et conventions d'interface. Les pages métier ne doivent plus recréer leurs propres boutons, cartes, badges, filtres ou tableaux.

## Tokens CSS

Emplacement cible : `src/styles/tokens.css`.

### Couleurs

| Token | Usage |
| --- | --- |
| `--color-primary` | Action principale, liens, CTA |
| `--color-secondary` | Actions secondaires |
| `--color-accent` | Mise en avant premium |
| `--color-success` | Succès, disponible, payé |
| `--color-warning` | Attention, en revue, échéance proche |
| `--color-danger` | Erreur, rejeté, retard |
| `--color-info` | Information, suivi, notification |
| `--color-surface` | Cartes et panneaux |
| `--color-background` | Fond application |
| `--color-border` | Bordures |
| `--color-muted` | Texte secondaire |

### Radius

- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-2xl`
- `--radius-full`

### Spacing

- `--space-1` à `--space-12`
- grille dashboard basée sur multiples de 4 px

### Shadow

- `--shadow-sm`
- `--shadow-card`
- `--shadow-floating`
- `--shadow-modal`

### Typography

- `--font-sans`: Inter ou fallback système
- `--font-mono`: JetBrains Mono ou fallback monospace
- échelles : `display`, `h1`, `h2`, `h3`, `body`, `caption`, `label`, `metric`

### Animation

- `--duration-fast`
- `--duration-normal`
- `--duration-slow`
- `--ease-standard`
- `--ease-emphasized`

## Bibliothèque UI cible

| Composant | Rôle | Variantes minimales |
| --- | --- | --- |
| `Button` | Actions | primary, secondary, ghost, danger, icon |
| `Input` | Saisie texte | default, error, disabled |
| `Textarea` | Texte long | default, error, disabled |
| `Checkbox` | Choix multiples | checked, indeterminate |
| `Radio` | Choix unique | checked, disabled |
| `Card` | Conteneur | default, elevated, interactive |
| `Modal` | Dialogue bloquant | sm, md, lg |
| `Drawer` | Détail latéral | left, right, bottom |
| `Badge` | Label court | neutral, info, success, warning, danger |
| `StatusBadge` | Statut métier | connecté à `status.ts` |
| `Avatar` | Utilisateur / entreprise | image, initials |
| `Table` | Table simple | sortable, selectable |
| `DataGrid` | Table avancée | filters, pagination, actions |
| `Pagination` | Navigation pages | compact, full |
| `Tabs` | Sections internes | line, pill |
| `Breadcrumb` | Hiérarchie | dashboard, public |
| `Timeline` | Historique | vertical, compact |
| `Stepper` | Étapes | workflow, form |
| `MetricCard` | KPI chiffré | trend, currency, percentage |
| `ChartCard` | Graphique | line, bar, donut |
| `ActionCard` | CTA métier | icon, badge, disabled |
| `StatCard` | Statistique compacte | positive, negative, neutral |
| `WorkflowCard` | Étape workflow | current, completed, blocked |
| `SearchBar` | Recherche | simple, with shortcut |
| `Filters` | Filtres | inline, drawer |
| `DatePicker` | Date | single, range |
| `CurrencyInput` | Montant | EUR par défaut |
| `UploadZone` | Upload document | single, multiple, error |
| `EmptyState` | Aucun résultat | CTA optionnel |
| `LoadingState` | Chargement | page, card, table |
| `ErrorState` | Erreur | retry optionnel |
| `ConfirmDialog` | Confirmation | danger, neutral |
| `Toast` | Feedback bref | success, warning, error, info |
| `Notification` | Notification longue | unread, read, action |

## Librairie d'icônes DEL

Emplacement cible : `src/constants/icons.ts` et `components/ui/Icon.jsx`.

Icônes métier normalisées :

- Equipment
- Contract
- Mission
- Maintenance
- Invoice
- Mine
- BTP
- Truck
- Excavator
- Finance
- Document
- Notification

Règles : un seul style de trait, une seule taille par contexte, pas de mélange libre d'icônes dans les pages.

## États obligatoires

Chaque composant de donnée doit fournir :

- état chargement ;
- état vide ;
- état erreur ;
- état succès ;
- état désactivé ;
- état action en cours.

## Documentation par composant

Chaque composant UI doit être documenté avec :

1. rôle ;
2. props ;
3. variantes ;
4. exemples d'utilisation ;
5. accessibilité ;
6. erreurs à éviter.

## Accessibilité

- Tous les boutons icon-only ont un `aria-label`.
- Les modales et drawers gèrent le focus.
- Les statuts n'utilisent pas uniquement la couleur.
- Les formulaires associent labels, aides et erreurs.
- Les contrastes respectent WCAG AA.
