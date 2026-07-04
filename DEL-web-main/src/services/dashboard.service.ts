import { apiGet } from '../lib/http';

export const getMySummary = () => apiGet('/api/me/summary');
export const getMyEquipment = () => apiGet('/api/me/equipment');
export const getMyRequests = () => apiGet('/api/me/requests');

export const getMyProposals = () => apiGet('/api/me/proposals');
export const getMyContracts = () => apiGet('/api/me/contracts');
