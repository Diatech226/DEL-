import type { Notification } from '../types';

const asString = (value: unknown, fallback = '') => value === undefined || value === null || value === '' ? fallback : String(value);

export function mapApiNotificationToAdmin(apiNotification: any): Notification {
  return {
    id: asString(apiNotification?._id || apiNotification?.id, `notification-${Date.now()}`),
    recipientUserId: asString(apiNotification?.recipientUserId),
    recipientRole: asString(apiNotification?.recipientRole, 'SYSTEM'),
    recipientName: asString(apiNotification?.recipientName, 'Destinataire DEL'),
    title: asString(apiNotification?.title, 'Notification DEL'),
    message: asString(apiNotification?.message, 'Notification système'),
    type: asString(apiNotification?.type, 'SYSTEM'),
    relatedEntityType: asString(apiNotification?.relatedEntityType, 'SYSTEM'),
    relatedEntityId: asString(apiNotification?.relatedEntityId),
    actionUrl: asString(apiNotification?.actionUrl),
    priority: asString(apiNotification?.priority, 'NORMAL'),
    isRead: Boolean(apiNotification?.isRead),
    readAt: apiNotification?.readAt || '',
    createdAt: apiNotification?.createdAt || '',
    updatedAt: apiNotification?.updatedAt || '',
  };
}

export function mapApiNotificationListToAdmin(apiItems: any): Notification[] {
  const items = Array.isArray(apiItems) ? apiItems : Array.isArray(apiItems?.data) ? apiItems.data : Array.isArray(apiItems?.items) ? apiItems.items : [];
  return items.map(mapApiNotificationToAdmin);
}
