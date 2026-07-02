import { apiGet, apiPatch } from '../lib/http';
export const getMyNotifications=()=>apiGet('/api/me/notifications');
export const markNotificationRead=(id:string)=>apiPatch(`/api/me/notifications/${id}/read`,{});
