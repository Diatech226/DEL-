import { apiGet } from '../lib/http';
export const getPublicSettings=()=>apiGet('/api/settings/public');
