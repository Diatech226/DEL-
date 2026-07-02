import { apiGet, apiPost } from '../lib/http';
export const getMyDocuments=()=>apiGet('/api/me/documents');
export const createDocument=(payload:unknown)=>apiPost('/api/documents',payload);
export const getDocumentsByEntity=(entityType:string,entityId:string)=>apiGet(`/api/documents/entity/${entityType}/${entityId}`);
