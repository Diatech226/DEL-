const assert = require('assert');
require('../src/app');
require('../src/routes/request.routes');
require('../src/routes/proposal.routes');
require('../src/routes/contract.routes');
require('../src/routes/invoice.routes');
require('../src/routes/mission.routes');
require('../src/routes/workflow.routes');
const { recalculateProposalWorkflow } = require('../src/utils/proposalWorkflow');
function check(input, status, workflowStatus) {
  const result = recalculateProposalWorkflow(input);
  assert.strictEqual(result.status, status);
  assert.strictEqual(result.workflowStatus, workflowStatus);
}
check({ companyDecision: { status: 'PENDING' }, ownerDecisions: [] }, 'SENT', 'PENDING_COMPANY');
check({ companyDecision: { status: 'REJECTED' }, ownerDecisions: [] }, 'REJECTED', 'REJECTED_BY_COMPANY');
check({ companyDecision: { status: 'ACCEPTED' }, ownerDecisions: [{ status: 'PENDING' }] }, 'SENT', 'PENDING_OWNERS');
check({ companyDecision: { status: 'ACCEPTED' }, ownerDecisions: [{ status: 'REJECTED' }] }, 'REJECTED', 'REJECTED_BY_OWNER');
check({ companyDecision: { status: 'ACCEPTED' }, ownerDecisions: [{ status: 'ACCEPTED' }] }, 'ACCEPTED', 'READY_FOR_CONTRACT');
console.log('Workflow routes and proposal workflow imports OK');
