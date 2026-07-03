import { mapApiEquipmentToAdmin } from './equipment.mapper';

export function mapApiMatchToAdmin(item: any) {
  return {
    equipment: item?.equipment ? mapApiEquipmentToAdmin(item.equipment) : item?.equipmentId,
    matchScore: Number(item?.matchScore || item?.score || 0),
    reasons: item?.reasons || [],
    warnings: item?.warnings || [],
  };
}

export const mapApiMatchListToAdmin = (items: any[] = []) => items.map(mapApiMatchToAdmin);
