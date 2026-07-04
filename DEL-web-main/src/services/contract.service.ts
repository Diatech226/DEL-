import { apiGet } from '../lib/http';

export const getMyContracts = () => apiGet('/api/me/contracts');

// Exposé pour les API qui autorisent l'utilisateur lié au contrat.
// Les écrans utilisateur privilégient les données de getMyContracts() afin d'éviter
// tout appel accidentel à un endpoint détail qui serait réservé admin.
export const getContractById = (id: string) => apiGet(`/api/contracts/${id}`);
