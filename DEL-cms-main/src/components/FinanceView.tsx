import React, { useState } from 'react';
import { Invoice, Payment, PdfReport } from '../types';
import { 
  Plus, 
  Search, 
  Download, 
  Check, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  CreditCard, 
  Globe,
  ArrowDownToLine,
  FileText
} from 'lucide-react';

interface FinanceViewProps {
  invoices: Invoice[];
  payments: Payment[];
  pdfReports: PdfReport[];
  onDownloadReport: (id: string) => void;
  onAddInvoice: (invoice: Omit<Invoice, 'id' | 'code'>) => void;
  onPayInvoice: (id: string, method: Payment['method']) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  invoices,
  payments,
  pdfReports,
  onDownloadReport,
  onAddInvoice,
  onPayInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReportSelector, setShowReportSelector] = useState(false);

  const triggerMockDownload = (report: PdfReport) => {
    // Increment download count and trigger standard text blob file download
    onDownloadReport(report.id);

    const content = `DEL-cms - Rapport PDF d'Activité Officiel\n` +
      `===========================================\n\n` +
      `ID Rapport: ${report.id}\n` +
      `Titre: ${report.title}\n` +
      `Type de document: ${report.type}\n` +
      `Période de synthèse: ${report.period}\n` +
      `Date d'impression: ${new Date().toLocaleString('fr-FR')}\n` +
      `Compilateur: Moteur de Rendu PDF DEL-Report® (v2.5)\n` +
      `Téléchargements cumulés: ${report.downloadCount + 1}\n\n` +
      `-------------------------------------------\n` +
      `CONFIDENTIALITÉ COMMERCIALE & INDUSTRIELLE\n` +
      `-------------------------------------------\n\n` +
      `Ce document atteste de l'évaluation officielle des performances, des propositions, ou du bilan d'exploitation de la plateforme DEL.\n` +
      `Généré automatiquement par le système d'administration de DEL-cms.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[\s']+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Form fields
  const [newInvoice, setNewInvoice] = useState({
    contractId: 'ctr-401',
    companyName: 'Bouygues Travaux Publics',
    amountExclTax: 12500,
    dueDate: ''
  });

  // KPI Calculations
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Payée').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalLate = invoices.filter(i => i.status === 'En Retard').reduce((sum, i) => sum + i.totalAmount, 0);

  // Filter handlers
  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = i.code.toLowerCase().includes(search.toLowerCase()) || 
                          i.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(p => 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.companyName.toLowerCase().includes(search.toLowerCase()) ||
    p.invoiceCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const excl = Number(newInvoice.amountExclTax);
    const tax = Math.round(excl * 0.2); // 20% VAT
    onAddInvoice({
      contractId: newInvoice.contractId,
      companyName: newInvoice.companyName,
      amountExclTax: excl,
      taxAmount: tax,
      totalAmount: excl + tax,
      status: 'Brouillon',
      issuedAt: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate
    });
    setShowAddForm(false);
  };

  return (
    <div id="finance-view" className="space-y-6">
      
      {/* Financial Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Volume total facturé</span>
            <p className="text-2xl font-black text-slate-900">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalInvoiced)}
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total des encaissements</span>
            <p className="text-2xl font-black text-emerald-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalPaid)}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Check size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Créances en retard</span>
            <p className="text-2xl font-black text-rose-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalLate)}
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Selector & Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
        <div className="flex gap-2">
          <button
            id="tab-invoices"
            onClick={() => { setActiveTab('invoices'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'invoices' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Registre de Facturation ({invoices.length})
          </button>
          <button
            id="tab-payments"
            onClick={() => { setActiveTab('payments'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Journal de Paiement ({payments.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              id="search-finance-input"
              type="text"
              placeholder={activeTab === 'invoices' ? "Rechercher une facture..." : "Rechercher un paiement..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-60 bg-slate-950 text-xs text-white border border-slate-800 rounded px-3 py-2 pl-8 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {activeTab === 'invoices' && (
            <select
              id="finance-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded text-xs px-3 py-2 text-slate-300 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Envoyée">Envoyée</option>
              <option value="Payée">Payée</option>
              <option value="En Retard">En Retard</option>
            </select>
          )}
        </div>
      </div>

      {/* Screen 9: Factures manager layout */}
      {activeTab === 'invoices' ? (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Suivi de Facturation clients</h2>
              <p className="text-xs text-slate-500">Gérez les créances clients, validez les brouillons de factures, et générez des rapports d'acompte.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                id="btn-download-report-finance"
                onClick={() => setShowReportSelector(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1.5 border border-slate-800"
              >
                <Download size={14} className="text-amber-500" />
                Télécharger Rapport PDF
              </button>
              <button 
                id="btn-add-invoice"
                onClick={() => setShowAddForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Créer un brouillon de facture
              </button>
            </div>
          </div>

          {/* Add Invoice Form Popup */}
          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full overflow-hidden shadow-lg animate-in zoom-in-95 duration-150">
                <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Nouvelle facture</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dossier contrat associé</label>
                    <select
                      value={newInvoice.contractId}
                      onChange={(e) => setNewInvoice({...newInvoice, contractId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      <option value="ctr-401">CTR-401 (Bouygues TP - PC800)</option>
                      <option value="ctr-402">CTR-402 (Colas IDF - LTM 1050)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Entreprise locataire *</label>
                    <select
                      value={newInvoice.companyName}
                      onChange={(e) => setNewInvoice({...newInvoice, companyName: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      <option value="Bouygues Travaux Publics">Bouygues Travaux Publics</option>
                      <option value="Vinci Construction France">Vinci Construction France</option>
                      <option value="Colas Île-de-France">Colas Île-de-France</option>
                      <option value="Eiffage Route Ouest">Eiffage Route Ouest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Montant Hors Taxe (€ HT) *</label>
                    <input
                      type="number"
                      required
                      value={newInvoice.amountExclTax}
                      onChange={(e) => setNewInvoice({...newInvoice, amountExclTax: Number(e.target.value)})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">TVA appliquée par défaut : 20% (soit {(newInvoice.amountExclTax * 0.2).toFixed(0)} €)</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date d'échéance de règlement *</label>
                    <input
                      type="date"
                      required
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-bold cursor-pointer"
                    >
                      Créer brouillon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Invoices grid list */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">Code Facture</th>
                    <th className="px-5 py-3.5">Locataire destinataire</th>
                    <th className="px-5 py-3.5">Date émission</th>
                    <th className="px-5 py-3.5">Échéance de paiement</th>
                    <th className="px-5 py-3.5 text-right font-mono">Montant HT</th>
                    <th className="px-5 py-3.5 text-right font-mono">TVA (20%)</th>
                    <th className="px-5 py-3.5 text-right font-mono">Total TTC</th>
                    <th className="px-5 py-3.5">Statut</th>
                    <th className="px-5 py-3.5 text-center">Actions d'encaissement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600">{inv.code}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{inv.companyName}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono">{inv.issuedAt}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-600 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-500 font-mono">
                        {inv.amountExclTax.toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-400 font-mono">
                        {inv.taxAmount.toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-950 font-mono">
                        {inv.totalAmount.toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          inv.status === 'Brouillon' ? 'bg-slate-100 text-slate-600' :
                          inv.status === 'Envoyée' ? 'bg-sky-100 text-sky-800' :
                          inv.status === 'Payée' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'En Retard' ? 'bg-rose-100 text-rose-800 font-bold animate-pulse' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => alert(`Téléchargement de la facture PDF commerciale ${inv.code}`)}
                            className="p-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                            title="Télécharger facture PDF"
                          >
                            <Download size={12} />
                          </button>

                          {(inv.status === 'Envoyée' || inv.status === 'En Retard') && (
                            <button
                              onClick={() => {
                                const method = window.confirm("Encaisser via Virement bancaire ? (OK) ou Prélèvement SEPA (Annuler)") 
                                  ? 'Virement bancaire' 
                                  : 'Prélèvement SEPA';
                                onPayInvoice(inv.id, method);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] transition-all cursor-pointer"
                            >
                              Confirmer encaissement
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Screen 10: Journal des flux de Paiements list
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Journal des flux financiers</h2>
              <p className="text-xs text-slate-500">Consultez en temps réel les virements bancaires, prélèvements SEPA et transactions par cartes industriels reçus.</p>
            </div>
            <button
              id="btn-download-report-payments"
              onClick={() => setShowReportSelector(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1.5 border border-slate-800"
            >
              <Download size={14} className="text-amber-500" />
              Télécharger Rapport PDF
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">Réf Transaction</th>
                    <th className="px-5 py-3.5">Code Facture</th>
                    <th className="px-5 py-3.5">Locataire payeur</th>
                    <th className="px-5 py-3.5">Date opération</th>
                    <th className="px-5 py-3.5">Méthode de règlement</th>
                    <th className="px-5 py-3.5 text-right font-mono">Montant Encaissé</th>
                    <th className="px-5 py-3.5">État bancaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredPayments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-indigo-950">{pay.reference}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-semibold">{pay.invoiceCode}</td>
                      <td className="px-5 py-3.5 font-sans font-semibold text-slate-900">{pay.companyName}</td>
                      <td className="px-5 py-3.5 text-slate-600">{pay.transactionDate}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-slate-700 font-sans font-medium">
                          {pay.method === 'Carte bancaire' ? <CreditCard size={12} className="text-blue-500" /> : <Globe size={12} className="text-slate-500" />}
                          {pay.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-950 text-sm">
                        {pay.amount.toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-5 py-3.5 font-sans">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          pay.status === 'Réussi' ? 'bg-emerald-100 text-emerald-800' :
                          pay.status === 'En Cours' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800 font-semibold'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Selector Modal */}
      {showReportSelector && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-lg animate-in zoom-in-95 duration-150 text-slate-900">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <FileText className="text-amber-500" size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Centre de Rapports PDF</h3>
              </div>
              <button onClick={() => setShowReportSelector(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Rapports d'activité disponibles</h4>
                <p className="text-slate-500 text-[11px]">Sélectionnez un document officiel pour lancer la simulation de téléchargement sécurisé du fichier PDF.</p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {pdfReports.map(rep => (
                  <div 
                    key={rep.id} 
                    className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                          {rep.type}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                          rep.status === 'Prêt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">{rep.title}</h5>
                      <p className="text-slate-400 text-[10px] font-mono">Période: {rep.period} • Téléchargements : {rep.downloadCount}</p>
                    </div>

                    {rep.status === 'Prêt' ? (
                      <button
                        onClick={() => {
                          triggerMockDownload(rep);
                          alert(`Téléchargement de "${rep.title}" démarré avec succès !`);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer flex items-center gap-1 shrink-0 self-end sm:self-auto"
                      >
                        <ArrowDownToLine size={12} className="text-amber-400" />
                        Télécharger
                      </button>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 text-[10px] font-mono shrink-0">
                        <RefreshCw size={11} className="animate-spin" />
                        Génération...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowReportSelector(false)} 
                className="border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-md text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
