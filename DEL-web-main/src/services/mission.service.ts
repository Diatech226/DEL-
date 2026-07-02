import { apiGet } from '../lib/http';
export const getMyMissions=()=>apiGet('/api/me/missions');
