function normalizeDecisionStatus(value) {
  return value || 'PENDING';
}

function recalculateProposalWorkflow(proposal) {
  if (!proposal.companyDecision) proposal.companyDecision = { status: 'PENDING' };
  if (!Array.isArray(proposal.ownerDecisions)) proposal.ownerDecisions = [];
  const companyStatus = normalizeDecisionStatus(proposal.companyDecision.status);
  if (companyStatus === 'REJECTED') {
    proposal.status = 'REJECTED';
    proposal.workflowStatus = 'REJECTED_BY_COMPANY';
    return proposal;
  }
  if (proposal.ownerDecisions.some((decision) => normalizeDecisionStatus(decision.status) === 'REJECTED')) {
    proposal.status = 'REJECTED';
    proposal.workflowStatus = 'REJECTED_BY_OWNER';
    return proposal;
  }
  if (companyStatus !== 'ACCEPTED') {
    proposal.status = 'SENT';
    proposal.workflowStatus = 'PENDING_COMPANY';
    return proposal;
  }
  if (proposal.ownerDecisions.some((decision) => normalizeDecisionStatus(decision.status) === 'PENDING')) {
    proposal.status = 'SENT';
    proposal.workflowStatus = 'PENDING_OWNERS';
    return proposal;
  }
  if (companyStatus === 'ACCEPTED' && proposal.ownerDecisions.every((decision) => normalizeDecisionStatus(decision.status) === 'ACCEPTED')) {
    proposal.status = 'ACCEPTED';
    proposal.workflowStatus = 'READY_FOR_CONTRACT';
  }
  return proposal;
}

module.exports = { recalculateProposalWorkflow };
