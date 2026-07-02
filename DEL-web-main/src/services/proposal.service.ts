import { apiGet, apiPatch } from '../lib/http';
export const getMyProposals=()=>apiGet('/api/me/proposals');
export const acceptCompanyProposal=(id:string,notes?:string)=>apiPatch(`/api/me/proposals/${id}/company-decision`,{decision:'ACCEPTED',notes});
export const rejectCompanyProposal=(id:string,rejectionReason:string)=>apiPatch(`/api/me/proposals/${id}/company-decision`,{decision:'REJECTED',rejectionReason});
export const acceptOwnerProposal=(id:string,notes?:string)=>apiPatch(`/api/me/proposals/${id}/owner-decision`,{decision:'ACCEPTED',notes});
export const rejectOwnerProposal=(id:string,rejectionReason:string)=>apiPatch(`/api/me/proposals/${id}/owner-decision`,{decision:'REJECTED',rejectionReason});
