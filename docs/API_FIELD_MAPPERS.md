# Mappers API vers design DEL

Date : 2026-07-02.

## Objectif

Les mappers empêchent les composants design de dépendre des noms de champs API. L'API peut rester stable pendant que l'interface adopte un vocabulaire plus clair.

Exemple : l'API expose `equipment.rentalPricePerDay`, alors que le design consomme `dailyPrice`.

## Emplacement cible

```text
src/mappers/
├── equipment.mapper.ts
├── request.mapper.ts
├── proposal.mapper.ts
├── contract.mapper.ts
├── invoice.mapper.ts
├── mission.mapper.ts
└── profile.mapper.ts
```

## Contrat général

Chaque mapper doit exposer :

- `mapApiXToDesign(apiX)`
- `mapApiXListToDesign(apiItems)`
- `mapDesignXToApiPayload(formState)` pour les formulaires
- des valeurs par défaut explicites pour les champs absents
- une conversion des statuts via `constants/status.ts`

## `equipment.mapper.ts`

| Design | API | Fallback |
| --- | --- | --- |
| `id` | `_id` ou `id` | `''` |
| `title` | `title` | `${brand} ${model}` |
| `brand` | `brand` | `'DEL'` |
| `model` | `model` | `'Non renseigné'` |
| `type` | `type` ou `category` | `'Engin'` |
| `category` | `category` | `'GENERAL'` |
| `year` | `year` | `null` |
| `weight` | `weight` | `null` |
| `hourCounter` | `engineHours` | `0` |
| `location` | `locationText`, `city`, `country` | `'Localisation à confirmer'` |
| `dailyPrice` | `rentalPricePerDay` | `0` |
| `status` | `status` | `UNKNOWN` |
| `ownerId` | `ownerId` | `null` |
| `ownerName` | `ownerName` | `'Propriétaire DEL'` |
| `serialNumber` | `serialNumber` | `'N/A'` |
| `imageUrl` | `photos[0]` | image placeholder |
| `vgpCertDate` | `vgpCertDate` | `null` |
| `nextMaintenanceDate` | `nextMaintenanceDate` | `null` |
| `enginePower` | `enginePower` | `null` |
| `fuelType` | `fuelType` | `null` |

Pseudo-code :

```ts
export function mapApiEquipmentToDesign(equipment: ApiEquipment): DesignEquipment {
  return {
    id: equipment._id ?? equipment.id ?? '',
    title: equipment.title ?? [equipment.brand, equipment.model].filter(Boolean).join(' '),
    brand: equipment.brand ?? 'DEL',
    model: equipment.model ?? 'Non renseigné',
    category: equipment.category ?? 'GENERAL',
    hourCounter: equipment.engineHours ?? 0,
    location: equipment.locationText ?? [equipment.city, equipment.country].filter(Boolean).join(', ') || 'Localisation à confirmer',
    dailyPrice: equipment.rentalPricePerDay ?? 0,
    status: normalizeEquipmentStatus(equipment.status),
    imageUrl: equipment.photos?.[0] ?? '/images/equipment-placeholder.jpg'
  };
}
```

## `request.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `companyName` | `companyName` |
| `contactName` | `contactName` |
| `contactPhone` | `contactPhone` |
| `machineType` | `equipmentCategory` |
| `quantity` | `quantity` |
| `location` | `workSiteLocation` |
| `startDate` | `startDate` |
| `durationMonths` | `durationMonths` |
| `maxBudget` | `proposedPrice` |
| `driverRequired` | `driverRequired` |
| `status` | `status` |

## `proposal.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `tenderId` | `tenderId` |
| `machineId` | `equipmentId` |
| `machineName` | `equipment.title` ou `equipmentSnapshot.title` |
| `priceOffered` | `priceOffered` ou `dailyPrice` |
| `duration` | `duration` |
| `startDate` | `startDate` |
| `description` | `description` |
| `status` | `status` |
| `submissionDate` | `createdAt` |

## `contract.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `machineId` | `equipmentId` |
| `machineName` | `equipment.title` |
| `clientName` | `client.name` |
| `clientCompany` | `client.companyName` |
| `ownerName` | `owner.name` |
| `ownerCompany` | `owner.companyName` |
| `startDate` | `startDate` |
| `endDate` | `endDate` |
| `totalPrice` | `totalPrice` ou `amount` |
| `deposit` | `deposit` |
| `status` | `status` |
| `signatureDate` | `signatureDate` |

## `invoice.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `type` | `type` |
| `amount` | `amount` |
| `date` | `date` ou `createdAt` |
| `dueDate` | `dueDate` |
| `status` | `status` |
| `clientCompany` | `client.companyName` |
| `engineName` | `equipment.title` |
| `paymentMethod` | `payment.method` |

## `mission.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `contractId` | `contractId` |
| `machineId` | `equipmentId` |
| `machineName` | `equipment.title` |
| `status` | `status` |
| `location` | `location` ou `siteLocation` |
| `startDate` | `startDate` |
| `endDate` | `endDate` |
| `operatorName` | `operator.name` |
| `currentTask` | futur champ telemetry |
| `fuelLevel` | futur champ telemetry |

## `profile.mapper.ts`

| Design | API |
| --- | --- |
| `id` | `_id` |
| `email` | `email` |
| `fullName` | `name` ou `fullName` |
| `role` | `role` |
| `companyName` | `profile.companyName` |
| `phone` | `profile.phone` |
| `address` | `profile.address` |
| `subscription` | futur champ abonnement |
| `isVip` | futur champ VIP |

## Tests attendus

Chaque mapper doit avoir des tests unitaires couvrant :

- payload complet ;
- payload partiel ;
- statut inconnu ;
- dates absentes ;
- prix absent ;
- image absente ;
- conversion formulaire design → payload API.
