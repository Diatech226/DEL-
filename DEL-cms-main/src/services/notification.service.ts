import { apiDelete, apiGet, apiPost } from '../lib/http';
import { mapApiNotificationListToAdmin, mapApiNotificationToAdmin } from '../mappers/notification.mapper';

export type NotificationFilters = Record<string, string | number | boolean | undefined | null>;
function toQuery(params: NotificationFilters = {}) { const q = new URLSearchParams(); Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && String(v).trim() !== '') q.set(k, String(v)); }); return q.toString() ? `?${q}` : ''; }
export async function getNotificationList(params: NotificationFilters = {}) { return mapApiNotificationListToAdmin(await apiGet(`/api/notifications${toQuery(params)}`)); }
export async function getNotificationById(id: string) { return mapApiNotificationToAdmin(await apiGet(`/api/notifications/${encodeURIComponent(id)}`)); }
export async function createNotificationManual(payload: unknown) { return mapApiNotificationToAdmin(await apiPost('/api/notifications', payload)); }
export async function deleteNotification(id: string) { return mapApiNotificationToAdmin(await apiDelete(`/api/notifications/${encodeURIComponent(id)}`)); }
