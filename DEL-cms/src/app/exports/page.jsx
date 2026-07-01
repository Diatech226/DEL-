'use client';
import { useState } from 'react';
import { downloadExport } from '../../lib/api';

const exportsList = [
  ['equipment','Engins'], ['requests','Demandes simples'], ['tenders','Appels d’offres'], ['proposals','Propositions'], ['contracts','Contrats'], ['invoices','Factures'], ['payments','Paiements'], ['missions','Missions'], ['maintenance','Maintenance'], ['documents','Documents'], ['users','Utilisateurs'], ['audit-logs','Audit logs'],
];

export default function ExportsPage(){
  const [filters,setFilters]=useState({dateFrom:'',dateTo:'',status:'',limit:'5000'});
  const [loading,setLoading]=useState('');
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const update=(key,value)=>setFilters((f)=>({...f,[key]:value}));
  async function run(resource,format){
    setLoading(`${resource}-${format}`); setMessage(''); setError('');
    try { const filename=await downloadExport(resource,format,filters); setMessage(`Export téléchargé : ${filename}`); }
    catch(e){ setError(e.message); }
    finally{ setLoading(''); }
  }
  const Button=({resource,format})=><button disabled={!!loading} onClick={()=>run(resource,format)} className="rounded bg-forest px-3 py-2 text-sm font-bold text-white disabled:opacity-50">{loading===`${resource}-${format}`?'Téléchargement...':format.toUpperCase()}</button>;
  return <section><div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><h1 className="text-4xl font-black">Exports & sauvegarde</h1><p className="mt-2 text-slate-600">Téléchargez les données administratives DEL en CSV ou JSON.</p></div></div>
    <div className="panel mt-6 grid gap-4 md:grid-cols-4"><label className="grid gap-1 text-sm font-bold">Date début<input type="date" value={filters.dateFrom} onChange={e=>update('dateFrom',e.target.value)} className="rounded border p-2 font-normal"/></label><label className="grid gap-1 text-sm font-bold">Date fin<input type="date" value={filters.dateTo} onChange={e=>update('dateTo',e.target.value)} className="rounded border p-2 font-normal"/></label><label className="grid gap-1 text-sm font-bold">Statut<input value={filters.status} onChange={e=>update('status',e.target.value)} placeholder="OPEN, ACTIVE, PAID..." className="rounded border p-2 font-normal"/></label><label className="grid gap-1 text-sm font-bold">Limite<input type="number" min="1" max="20000" value={filters.limit} onChange={e=>update('limit',e.target.value)} className="rounded border p-2 font-normal"/></label></div>
    {message&&<p className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-green-800">{message}</p>}{error&&<p className="alert-error mt-4">{error}</p>}
    <div className="mt-6 grid gap-4 md:grid-cols-3">{exportsList.map(([resource,label])=><article key={resource} className="panel"><h2 className="text-xl font-black">{label}</h2><p className="mt-2 text-sm text-slate-600">Export protégé administrateur pour reporting, contrôle interne et sauvegarde manuelle.</p><div className="mt-4 flex gap-2"><Button resource={resource} format="csv"/><Button resource={resource} format="json"/></div></article>)}</div>
    <article className="panel mt-8 border-2 border-gold bg-amber-50"><h2 className="text-2xl font-black">Sauvegarde administrative complète</h2><p className="mt-2 font-semibold text-amber-900">La sauvegarde complète JSON est un export administratif, pas une restauration MongoDB.</p><p className="mt-2 text-sm text-slate-700">Elle regroupe les collections principales et exclut les hash de mots de passe des utilisateurs.</p><div className="mt-4"><Button resource="full-backup" format="json"/></div></article>
  </section>;
}
