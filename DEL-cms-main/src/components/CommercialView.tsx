import React, { useEffect, useMemo, useState } from 'react';
import { Check, X, FileSignature, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { Contract, PdfReport, Proposal } from '../types';
import { getStatusLabel, getStatusVariant } from '../constants/status';
import { createContractFromProposal, getContractById, getContractList, updateContractStatus } from '../services/contract.service';
import { createInvoiceFromContract } from '../services/invoice.service';
import { getProposalById, getProposalList, updateCompanyDecisionAsAdmin, updateOwnerDecisionAsAdmin } from '../services/proposal.service';

interface CommercialViewProps {
  initialTab: 'proposals' | 'contracts';
  proposals: Proposal[];
  contracts: Contract[];
  pdfReports: PdfReport[];
  onDownloadReport: (id: string) => void;
  onProposalsLoaded: (items: Proposal[]) => void;
  onContractsLoaded: (items: Contract[]) => void;
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('fr-FR') : '—';
const formatMoney = (amount = 0, currency = 'XOF') => new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
const badge = (status?: string) => ({ success: 'bg-emerald-100 text-emerald-800', warning: 'bg-amber-100 text-amber-800', danger: 'bg-rose-100 text-rose-800', info: 'bg-blue-100 text-blue-800', neutral: 'bg-slate-100 text-slate-700' }[getStatusVariant(status)] || 'bg-slate-100 text-slate-700');

export const CommercialView: React.FC<CommercialViewProps> = ({ initialTab, proposals, contracts, pdfReports, onDownloadReport, onProposalsLoaded, onContractsLoaded }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'contracts'>(initialTab);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractForm, setContractForm] = useState({ title: 'Contrat lié à la proposition', startDate: '', endDate: '', amount: 0, currency: 'XOF', paymentTerms: '', conditions: '', responsibilities: '' });
  const [invoiceForm, setInvoiceForm] = useState({ title: '', subtotal: 0, taxRate: 0, dueDate: '', periodStart: '', periodEnd: '', notes: '', status: 'SENT' });
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);

  useEffect(() => setActiveTab(initialTab), [initialTab]);

  const loadProposals = async () => {
    setLoading(true); setError(null);
    try { onProposalsLoaded(await getProposalList()); }
    catch (e: any) { setError(e?.message || 'Impossible de charger les propositions depuis l’API DEL.'); }
    finally { setLoading(false); }
  };
  const loadContracts = async () => {
    setLoading(true); setError(null);
    try { onContractsLoaded(await getContractList()); }
    catch (e: any) { setError(e?.message || 'Impossible de charger les contrats depuis l’API DEL.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProposals(); loadContracts(); }, []);

  const filteredProposals = useMemo(() => proposals.filter((p) => [p.title, p.code, p.companyName, p.status, p.workflowStatus].join(' ').toLowerCase().includes(search.toLowerCase())), [proposals, search]);
  const filteredContracts = useMemo(() => contracts.filter((c) => [c.contractNumber, c.code, c.title, c.companyName, c.status].join(' ').toLowerCase().includes(search.toLowerCase())), [contracts, search]);

  const openProposal = async (id: string) => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      const detail = await getProposalById(id);
      setSelectedProposal(detail); setSelectedContract(null);
      setContractForm((prev) => ({ ...prev, amount: detail.finalPrice || detail.totalEstimated || 0, currency: detail.currency || 'XOF' }));
    } catch (e: any) { setError(e?.message || 'Impossible de charger le détail proposition depuis l’API DEL.'); }
    finally { setLoading(false); }
  };
  const openContract = async (id: string) => {
    setLoading(true); setError(null); setSuccess(null);
    try { const contract = await getContractById(id); setSelectedContract(contract); setSelectedProposal(null); setCreatedInvoiceId(null); setInvoiceForm({ title: `Facture liée au contrat ${contract.contractNumber || contract.code}`, subtotal: contract.amount || contract.totalAmount || 0, taxRate: 0, dueDate: '', periodStart: contract.startDate || '', periodEnd: contract.endDate || '', notes: '', status: 'SENT' }); }
    catch (e: any) { setError(e?.message || 'Impossible de charger le détail contrat depuis l’API DEL.'); }
    finally { setLoading(false); }
  };
  const refreshAll = async () => { await Promise.all([loadProposals(), loadContracts()]); };

  const decideCompany = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!selectedProposal) return;
    try { const updated = await updateCompanyDecisionAsAdmin(selectedProposal.id, { status }); setSelectedProposal(updated); setSuccess(`Décision entreprise ${getStatusLabel(status).toLowerCase()} synchronisée.`); await loadProposals(); }
    catch (e: any) { setError(e?.message || 'Décision entreprise non synchronisée.'); }
  };
  const decideOwner = async (index: number, status: 'ACCEPTED' | 'REJECTED') => {
    if (!selectedProposal) return;
    try { const updated = await updateOwnerDecisionAsAdmin(selectedProposal.id, index, { status }); setSelectedProposal(updated); setSuccess(`Décision propriétaire ${index + 1} synchronisée.`); await loadProposals(); }
    catch (e: any) { setError(e?.message || 'Décision propriétaire non synchronisée.'); }
  };
  const submitContract = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selectedProposal) return;
    try {
      const created = await createContractFromProposal(selectedProposal.id, contractForm);
      setSuccess(`Contrat ${created.contractNumber || created.code} créé avec succès.`); setSelectedContract(created); setSelectedProposal(null); await refreshAll();
    } catch (e: any) { setError(e?.message || 'Création contrat refusée par DEL-api.'); }
  };

  const submitInvoiceFromContract = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedContract) return;
    try {
      const created = await createInvoiceFromContract(selectedContract.id, invoiceForm);
      setCreatedInvoiceId(created.id);
      setSuccess(`Facture ${created.invoiceNumber || created.code} créée depuis le contrat.`);
    } catch (e: any) { setError(e?.message || 'Création facture refusée par DEL-api.'); }
  };

  const changeContractStatus = async (status: string) => {
    if (!selectedContract) return;
    try { const updated = await updateContractStatus(selectedContract.id, status); setSelectedContract(updated); setSuccess(`Statut contrat changé en ${getStatusLabel(status)}.`); await loadContracts(); }
    catch (e: any) { setError(e?.message || 'Changement de statut contrat non synchronisé.'); }
  };

  if (selectedProposal) {
    const ready = selectedProposal.workflowStatus === 'READY_FOR_CONTRACT' || selectedProposal.status === 'ACCEPTED';
    return <div className="space-y-5">
      <button onClick={() => setSelectedProposal(null)} className="text-xs font-bold text-slate-600 flex items-center gap-1"><ArrowLeft size={14}/> Retour aux propositions</button>
      {error && <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded p-3 text-xs">{error}</div>}{success && <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded p-3 text-xs">{success}</div>}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex justify-between gap-3 flex-wrap"><h2 className="text-xl font-black text-slate-950">{selectedProposal.title}</h2><div className="flex gap-2"><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(selectedProposal.status)}`}>{getStatusLabel(selectedProposal.status)}</span><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(selectedProposal.workflowStatus)}`}>{getStatusLabel(selectedProposal.workflowStatus)}</span></div></div>
        <div className="grid md:grid-cols-4 gap-3 text-xs"><Info label="Entreprise" value={selectedProposal.companyName}/><Info label="Montant" value={formatMoney(selectedProposal.finalPrice || selectedProposal.totalEstimated, selectedProposal.currency)}/><Info label="Durée" value={`${selectedProposal.durationMonths || 0} mois`}/><Info label="Création" value={formatDate(selectedProposal.createdAt)}/></div>
        <div className="grid md:grid-cols-3 gap-3 text-xs"><Info label="Demande" value={selectedProposal.requestId}/><Info label="Tender" value={selectedProposal.tenderId || '—'}/><Info label="Lot" value={selectedProposal.tenderLotId || '—'}/></div>
        <Info label="Engins proposés" value={(selectedProposal.equipmentIds || []).join(', ') || selectedProposal.engineName || '—'}/>
      </section>
      <section className="grid lg:grid-cols-2 gap-4">
        <DecisionCard title="Décision entreprise" decision={selectedProposal.companyDecision} onAccept={() => decideCompany('ACCEPTED')} onReject={() => decideCompany('REJECTED')} />
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"><h3 className="font-bold">Décisions propriétaires</h3>{(selectedProposal.ownerDecisions || []).length ? selectedProposal.ownerDecisions?.map((d, i) => <DecisionCard key={i} title={d.ownerName || selectedProposal.ownerNames?.[i] || `Propriétaire ${i + 1}`} decision={d} onAccept={() => decideOwner(i, 'ACCEPTED')} onReject={() => decideOwner(i, 'REJECTED')} />) : <p className="text-xs text-slate-500">Aucune décision propriétaire disponible.</p>}</div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><FileSignature size={16}/> Créer contrat</h3>{!ready && <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded p-3">Le contrat pourra être créé après acceptation de l’entreprise et des propriétaires.</p>}{ready && <form onSubmit={submitContract} className="grid md:grid-cols-2 gap-3 text-xs"><Input label="Titre" value={contractForm.title} onChange={(v) => setContractForm({...contractForm, title:v})}/><Input label="Montant" type="number" value={String(contractForm.amount)} onChange={(v) => setContractForm({...contractForm, amount:Number(v)})}/><Input label="Devise" value={contractForm.currency} onChange={(v) => setContractForm({...contractForm, currency:v})}/><Input label="Date début" type="date" value={contractForm.startDate} onChange={(v) => setContractForm({...contractForm, startDate:v})}/><Input label="Date fin" type="date" value={contractForm.endDate} onChange={(v) => setContractForm({...contractForm, endDate:v})}/><Input label="Conditions paiement" value={contractForm.paymentTerms} onChange={(v) => setContractForm({...contractForm, paymentTerms:v})}/><Textarea label="Conditions" value={contractForm.conditions} onChange={(v) => setContractForm({...contractForm, conditions:v})}/><Textarea label="Responsabilités" value={contractForm.responsibilities} onChange={(v) => setContractForm({...contractForm, responsibilities:v})}/><button className="md:col-span-2 bg-amber-500 text-slate-950 font-black rounded px-4 py-2">Créer le contrat depuis DEL-api</button></form>}</section>
    </div>;
  }

  if (selectedContract) return <div className="space-y-5"><button onClick={() => setSelectedContract(null)} className="text-xs font-bold text-slate-600 flex items-center gap-1"><ArrowLeft size={14}/> Retour aux contrats</button>{error && <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded p-3 text-xs">{error}</div>}{success && <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded p-3 text-xs">{success}</div>}<section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"><div className="flex justify-between flex-wrap gap-3"><h2 className="text-xl font-black">{selectedContract.contractNumber} — {selectedContract.title}</h2><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(selectedContract.status)}`}>{getStatusLabel(selectedContract.status)}</span></div><div className="grid md:grid-cols-3 gap-3 text-xs"><Info label="Entreprise" value={selectedContract.companyName}/><Info label="Propriétaires" value={(selectedContract.ownerNames || []).join(', ') || '—'}/><Info label="Engins" value={(selectedContract.equipmentIds || []).join(', ') || '—'}/></div><div className="grid md:grid-cols-4 gap-3 text-xs"><Info label="Montant" value={formatMoney(selectedContract.amount || selectedContract.totalAmount, selectedContract.currency)}/><Info label="Commission" value={`${selectedContract.platformCommissionRate || 0}% / ${formatMoney(selectedContract.platformCommissionAmount, selectedContract.currency)}`}/><Info label="Part propriétaires" value={formatMoney(selectedContract.ownerAmount, selectedContract.currency)}/><Info label="Période" value={`${formatDate(selectedContract.startDate)} → ${formatDate(selectedContract.endDate)}`}/></div><div className="grid md:grid-cols-3 gap-3 text-xs"><Info label="Paiement" value={selectedContract.paymentTerms || '—'}/><Info label="Conditions" value={selectedContract.conditions || '—'}/><Info label="Responsabilités" value={selectedContract.responsibilities || '—'}/></div><div className="flex flex-wrap gap-2 pt-2">{['PENDING_SIGNATURE','ACTIVE','COMPLETED','CANCELLED'].map(s => <button key={s} onClick={() => changeContractStatus(s)} className="px-3 py-2 rounded bg-slate-900 text-white text-xs font-bold">Passer en {getStatusLabel(s)}</button>)}</div></section>{selectedContract.status !== 'CANCELLED' && <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"><h3 className="font-bold">Créer une facture</h3>{createdInvoiceId && <p className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded p-3">Facture créée. Ouvrez le module Factures puis recherchez l’identifiant {createdInvoiceId}.</p>}<form onSubmit={submitInvoiceFromContract} className="grid md:grid-cols-2 gap-3 text-xs"><Input label="Titre" value={invoiceForm.title} onChange={(v) => setInvoiceForm({...invoiceForm, title:v})}/><Input label="Sous-total" type="number" value={String(invoiceForm.subtotal)} onChange={(v) => setInvoiceForm({...invoiceForm, subtotal:Number(v)})}/><Input label="Taxe (%)" type="number" value={String(invoiceForm.taxRate)} onChange={(v) => setInvoiceForm({...invoiceForm, taxRate:Number(v)})}/><Input label="Échéance" type="date" value={invoiceForm.dueDate} onChange={(v) => setInvoiceForm({...invoiceForm, dueDate:v})}/><Input label="Début période" type="date" value={invoiceForm.periodStart} onChange={(v) => setInvoiceForm({...invoiceForm, periodStart:v})}/><Input label="Fin période" type="date" value={invoiceForm.periodEnd} onChange={(v) => setInvoiceForm({...invoiceForm, periodEnd:v})}/><label className="space-y-1"><span className="font-bold text-slate-600">Statut</span><select value={invoiceForm.status} onChange={(e)=>setInvoiceForm({...invoiceForm,status:e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2"><option value="SENT">Envoyée</option><option value="DRAFT">Brouillon</option></select></label><Textarea label="Notes" value={invoiceForm.notes} onChange={(v) => setInvoiceForm({...invoiceForm, notes:v})}/><button className="md:col-span-2 bg-amber-500 text-slate-950 font-black rounded px-4 py-2">Créer une facture depuis ce contrat</button></form></section>}</div>;

  return <div id="commercial-view" className="space-y-6"><div className="flex flex-col sm:flex-row justify-between gap-4 bg-slate-900 text-white p-4 rounded-lg"><div className="flex gap-2"><button onClick={() => setActiveTab('proposals')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab==='proposals'?'bg-amber-500 text-slate-950':'text-slate-300'}`}>Propositions ({proposals.length})</button><button onClick={() => setActiveTab('contracts')} className={`px-4 py-2 text-xs font-bold rounded ${activeTab==='contracts'?'bg-amber-500 text-slate-950':'text-slate-300'}`}>Contrats ({contracts.length})</button></div><div className="flex gap-2"><input placeholder="Filtrer..." value={search} onChange={(e)=>setSearch(e.target.value)} className="bg-slate-950 text-xs text-white border border-slate-800 rounded px-3 py-2"/><button onClick={refreshAll} className="bg-slate-800 rounded px-3"><RefreshCw size={14}/></button></div></div>{error && <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded p-3 text-xs">{error}</div>}{loading && <div className="text-xs text-slate-500">Chargement depuis DEL-api…</div>}{activeTab === 'proposals' ? <ListProposals items={filteredProposals} open={openProposal}/> : <ListContracts items={filteredContracts} open={openContract}/>}<div className="hidden">{pdfReports.map(r => <button key={r.id} onClick={() => onDownloadReport(r.id)}><Download size={1}/></button>)}</div></div>;
};

function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="bg-slate-50 border border-slate-100 rounded p-3"><span className="block text-[10px] uppercase text-slate-400 font-bold">{label}</span><span className="font-semibold text-slate-800 break-words">{value || '—'}</span></div>; }
function Input({ label, value, onChange, type='text' }: { label:string; value:string; onChange:(v:string)=>void; type?:string }) { return <label className="space-y-1"><span className="font-bold text-slate-600">{label}</span><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2"/></label>; }
function Textarea({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) { return <label className="space-y-1"><span className="font-bold text-slate-600">{label}</span><textarea value={value} onChange={(e)=>onChange(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2" rows={3}/></label>; }
const DecisionCard: React.FC<{ title:string; decision:any; onAccept:()=>void; onReject:()=>void }> = ({ title, decision, onAccept, onReject }) => <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2"><div className="flex justify-between"><h4 className="font-bold text-sm">{title}</h4><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(decision?.status)}`}>{getStatusLabel(decision?.status)}</span></div><p className="text-xs text-slate-500">Décidé le {formatDate(decision?.decidedAt)}</p>{decision?.notes && <p className="text-xs">Notes : {decision.notes}</p>}{decision?.rejectionReason && <p className="text-xs text-rose-700">Motif : {decision.rejectionReason}</p>}<div className="flex gap-2"><button onClick={onAccept} className="px-2 py-1 bg-emerald-500 text-white rounded text-xs flex gap-1"><Check size={12}/> Accepter</button><button onClick={onReject} className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs flex gap-1"><X size={12}/> Refuser</button></div></div>;
function ListProposals({ items, open }: { items: Proposal[]; open:(id:string)=>void }) { if (!items.length) return <p className="bg-white rounded border p-5 text-sm text-slate-500">Aucune proposition pour le moment.</p>; return <div className="grid gap-4">{items.map(p => <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between gap-4 flex-wrap"><div><div className="flex gap-2"><span className="font-mono text-[10px] bg-slate-950 text-amber-400 px-2 py-1 rounded">{p.code}</span><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(p.status)}`}>{getStatusLabel(p.status)}</span><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(p.workflowStatus)}`}>{getStatusLabel(p.workflowStatus)}</span></div><h3 className="font-bold mt-2">{p.title || p.requestTitle}</h3><p className="text-xs text-slate-500">{p.companyName} · Propriétaires : {(p.ownerNames || []).join(', ') || '—'} · Créée le {formatDate(p.createdAt)}</p></div><div className="text-right"><p className="font-black">{formatMoney(p.finalPrice || p.totalEstimated, p.currency)}</p><button onClick={() => open(p.id)} className="mt-2 px-3 py-2 bg-slate-900 text-white rounded text-xs font-bold">Voir détail</button></div></div>)}</div>; }
function ListContracts({ items, open }: { items: Contract[]; open:(id:string)=>void }) { if (!items.length) return <p className="bg-white rounded border p-5 text-sm text-slate-500">Aucun contrat pour le moment.</p>; return <div className="grid gap-4">{items.map(c => <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between gap-4 flex-wrap"><div><div className="flex gap-2"><span className="font-mono text-[10px] bg-slate-950 text-amber-400 px-2 py-1 rounded">{c.contractNumber || c.code}</span><span className={`px-2 py-1 rounded text-[10px] font-bold ${badge(c.status)}`}>{getStatusLabel(c.status)}</span></div><h3 className="font-bold mt-2">{c.title}</h3><p className="text-xs text-slate-500">{c.companyName} · Propriétaires : {(c.ownerNames || []).join(', ') || '—'} · {formatDate(c.startDate)} au {formatDate(c.endDate)}</p></div><div className="text-right"><p className="font-black">{formatMoney(c.amount || c.totalAmount, c.currency)}</p><button onClick={() => open(c.id)} className="mt-2 px-3 py-2 bg-slate-900 text-white rounded text-xs font-bold">Voir détail</button></div></div>)}</div>; }
