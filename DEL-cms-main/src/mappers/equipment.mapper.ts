import { Engine } from '../types';
import { normalizeStatus } from '../constants/status';

const frenchStatus = (status?: string): Engine['status'] => {
  const normalized = normalizeStatus(status);
  if (normalized === 'AVAILABLE') return 'Disponible';
  if (['PLACED', 'RESERVED'].includes(normalized)) return 'En Mission';
  if (normalized === 'UNDER_MAINTENANCE') return 'En Maintenance';
  return 'En Panne';
};

export function mapApiEquipmentToAdmin(item: any): Engine {
  const id = String(item?._id || item?.id || '');
  const title = item?.title || item?.name || [item?.brand, item?.model].filter(Boolean).join(' ') || 'Engin DEL';
  return {
    id,
    code: item?.code || item?.reference || `ENG-${id.slice(-6) || 'API'}`,
    name: title,
    category: item?.category || item?.equipmentCategory || 'Engin',
    brand: item?.brand || '—',
    model: item?.model || '—',
    power: Number(item?.power || item?.powerKw || item?.capacity || 0),
    status: frenchStatus(item?.status),
    hourlyRate: Number(item?.rentalPricePerHour || item?.hourlyRate || 0),
    dailyRate: Number(item?.rentalPricePerDay || item?.dailyRate || 0),
    currentHours: Number(item?.currentHours || item?.hours || 0),
    ownerId: String(item?.ownerUserId || item?.ownerId || ''),
    ownerName: item?.ownerName || item?.owner?.fullName || item?.owner?.name || 'Propriétaire non renseigné',
    location: [item?.city, item?.country].filter(Boolean).join(', ') || item?.location || 'Localisation non renseignée',
    year: Number(item?.year || new Date(item?.createdAt || Date.now()).getFullYear()),
    serialNumber: item?.serialNumber || '—',
    nextMaintenance: item?.nextMaintenance || '',
  };
}

export const mapApiEquipmentListToAdmin = (items: any[] = []) => items.map(mapApiEquipmentToAdmin);
