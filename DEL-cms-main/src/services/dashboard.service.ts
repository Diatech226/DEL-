import { getEquipmentList } from './equipment.service';
import { getRequestList } from './request.service';

export async function getAdminDashboardData() {
  const [equipmentResult, requestResult] = await Promise.allSettled([getEquipmentList(), getRequestList()]);
  const equipment = equipmentResult.status === 'fulfilled' ? equipmentResult.value : [];
  const requests = requestResult.status === 'fulfilled' ? requestResult.value : [];
  return {
    equipment,
    requests,
    errors: [equipmentResult, requestResult].filter((r) => r.status === 'rejected').map((r: any) => r.reason?.message),
  };
}
