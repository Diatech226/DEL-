import { useAsync } from './useAsync';
import { getMyContracts, getMyEquipment, getMyProposals, getMyRequests, getMySummary } from '../services/dashboard.service';
import { unwrapData } from '../lib/http';
import { mapApiEquipmentListToDesign } from '../mappers/equipment.mapper';
import { mapApiProposalListToDesign } from '../mappers/proposal.mapper';
import { mapApiContractListToDesign } from '../mappers/contract.mapper';

export const useMyDashboardData = (enabled = true) => useAsync(async () => {
  if (!enabled) return null;
  const [summary, equipment, requests, proposals, contracts] = await Promise.allSettled([
    getMySummary(),
    getMyEquipment(),
    getMyRequests(),
    getMyProposals(),
    getMyContracts(),
  ]);
  const val = (result: PromiseSettledResult<any>, fallback: any = []) => result.status === 'fulfilled' ? unwrapData(result.value) : fallback;
  return {
    summary: val(summary, null),
    equipment: mapApiEquipmentListToDesign(val(equipment)),
    requests: val(requests),
    proposals: mapApiProposalListToDesign(val(proposals)),
    contracts: mapApiContractListToDesign(val(contracts)),
  };
}, [enabled]);
