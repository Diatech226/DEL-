import { apiGet } from '../lib/http';
export const getMaintenanceByEquipment=(equipmentId:string)=>apiGet(`/api/maintenance/equipment/${equipmentId}`);
