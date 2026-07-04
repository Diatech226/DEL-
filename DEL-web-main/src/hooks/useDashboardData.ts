import { useAsync } from './useAsync';
import { getMyEquipment, getMyRequests, getMySummary } from '../services/dashboard.service';
import { unwrapData } from '../lib/http';
import { mapApiEquipmentListToDesign } from '../mappers/equipment.mapper';

export const useMyDashboardData = (enabled = true) => useAsync(async () => {
  if (!enabled) return null;
  const [summary, equipment, requests] = await Promise.allSettled([
    getMySummary(),
    getMyEquipment(),
    getMyRequests(),
  ]);
  const val = (result: PromiseSettledResult<any>, fallback: any = []) => result.status === 'fulfilled' ? unwrapData(result.value) : fallback;
  return {
    summary: val(summary, null),
    equipment: mapApiEquipmentListToDesign(val(equipment)),
    requests: val(requests),
  };
}, [enabled]);
