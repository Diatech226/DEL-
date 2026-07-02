import { apiGet, apiPost } from '../lib/http';
const qs=(p?:Record<string,unknown>)=>p?`?${new URLSearchParams(Object.entries(p).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>[k,String(v)])).toString()}`:'';
export const getEquipmentList=(params?:Record<string,unknown>)=>apiGet(`/api/equipment${qs(params)}`);
export const getEquipmentById=(id:string)=>apiGet(`/api/equipment/${id}`);
export const createEquipment=(payload:unknown)=>apiPost('/api/equipment',payload);
export const getMyEquipment=()=>apiGet('/api/me/equipment');
