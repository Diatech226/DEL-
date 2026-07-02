import { getEquipmentById, getEquipmentList } from '../services/equipment.service';
import { getDocumentsByEntity } from '../services/document.service';
import { getMaintenanceByEquipment } from '../services/maintenance.service';
import { unwrapData } from '../lib/http';
import { mapApiEquipmentListToDesign, mapApiEquipmentToDesign } from '../mappers/equipment.mapper';
import { useAsync } from './useAsync';
export const useEquipmentList=(params?:Record<string,unknown>)=>useAsync(async()=>mapApiEquipmentListToDesign(unwrapData(await getEquipmentList(params))),[JSON.stringify(params||{})]);
export const useEquipmentDetail=(id?:string)=>useAsync(async()=>{if(!id)return null; const [equipment,documents,maintenance]=await Promise.allSettled([getEquipmentById(id),getDocumentsByEntity('equipment',id),getMaintenanceByEquipment(id)]); return { machine: equipment.status==='fulfilled'?mapApiEquipmentToDesign(unwrapData(equipment.value)):null, documents: documents.status==='fulfilled'?unwrapData(documents.value):[], maintenance: maintenance.status==='fulfilled'?unwrapData(maintenance.value):[] };},[id]);
