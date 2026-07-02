import React, { useState } from 'react';
import { Proposal, Contract, PdfReport } from '../types';
import { 
  FileText, 
  Check, 
  X, 
  FileSignature, 
  PenTool, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  ArrowDownToLine,
  RefreshCw
} from 'lucide-react';

interface CommercialViewProps {
  proposals: Proposal[];
  contracts: Contract[];
  pdfReports: PdfReport[];
  onDownloadReport: (id: string) => void;
  onAcceptProposal: (id: string) => void;
  onRejectProposal: (id: string) => void;
  onGenerateContract: (proposalId: string) => void;
  onSignContract: (id: string) => void;
  onActivateContract: (id: string) => void;
}

export const CommercialView: React.FC<CommercialViewProps> = ({
  proposals,
  contracts,
  pdfReports,
  onDownloadReport,
  onAcceptProposal,
  onRejectProposal,
  onGenerateContract,
  onSignContract,
  onActivateContract
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'contracts'>('proposals');
  const [search, setSearch] = useState('');
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

  // Filter lists
  const filteredProposals = proposals.filter(p => 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.companyName.toLowerCase().includes(search.toLowerCase()) ||
    p.requestTitle.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContracts = contracts.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.engineName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="commercial-view" className="space-y-6">
      {/* Tab Switcher & Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-4 rounded-lg border border-slate-800">
        <div className="flex gap-2">
          <button
            id="tab-proposals"
            onClick={() => { setActiveTab('proposals'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'proposals' 
                ? 'bg-amber-500 text-slate-950 font-black' 
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Propositions Commerciales ({proposals.length})
          </button>
          <button
            id="tab-contracts"
            onClick={() => { setActiveTab('contracts'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'contracts' 
                ? 'bg-amber-500 text-slate-950 font-black' 
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            Contrats d'Exploitation ({contracts.length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            id="commercial-search-input"
            type="text"
            placeholder={activeTab === 'proposals' ? "Filtrer les propositions..." : "Filtrer les contrats..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Main tab content */}
      {activeTab === 'proposals' ? (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registre des propositions commerciales</h2>
              <p className="text-xs text-slate-500">De l'offre tarifaire brute jusqu'à la validation définitive de l'entreprise cliente.</p>
            </div>
            <button
              id="btn-download-report-commercial"
              onClick={() => setShowReportSelector(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1.5 border border-slate-800"
            >
              <Download size={14} className="text-amber-500" />
              Télécharger Rapport PDF
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredProposals.map(prop => (
              <div key={prop.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors">
                
                {/* Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-950 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {prop.code}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• Créée le {prop.createdAt}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      prop.status === 'Brouillon' ? 'bg-slate-100 text-slate-600' :
                      prop.status === 'Envoyée' ? 'bg-amber-100 text-amber-800' :
                      prop.status === 'Acceptée' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800 font-semibold'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{prop.requestTitle}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Client destinataire :</span>
                      <span className="font-semibold text-slate-800 font-mono">{prop.companyName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Machine assignée :</span>
                      <span className="font-semibold text-slate-800 font-mono">{prop.engineName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Validité de l'offre :</span>
                      <span className="font-semibold text-rose-700 font-mono">jusqu'au {prop.validUntil}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing / Financial summaries */}
                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-3.5 md:pt-0 md:pl-5 space-y-2 text-right shrink-0 w-full md:w-auto">
                  <div className="font-mono">
                    <span className="text-slate-400 text-[10px] block">Taux jour négocié :</span>
                    <span className="text-base font-black text-slate-950">{prop.dailyRate} € HT</span>
                  </div>
                  <div className="font-mono text-xs text-slate-500">
                    Transport : {prop.transportCost} € • Logistique : {prop.otherCosts} €
                  </div>
                  <div className="bg-slate-50 px-3 py-1.5 rounded border border-slate-100 inline-block font-mono font-bold text-xs text-indigo-950">
                    Total Estimé : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prop.totalEstimated)}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => alert(`Téléchargement du document d'offre PDF pour la proposition ${prop.code}`)}
                      className="p-1.5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded cursor-pointer transition-all"
                      title="Télécharger l'offre PDF"
                    >
                      <Download size={14} />
                    </button>

                    {prop.status === 'Envoyée' && (
                      <>
                        <button
                          onClick={() => onRejectProposal(prop.id)}
                          className="px-2.5 py-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-[11px] cursor-pointer transition-all flex items-center gap-1"
                        >
                          <X size={12} />
                          Refuser
                        </button>
                        <button
                          onClick={() => onAcceptProposal(prop.id)}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Check size={12} />
                          Accepter (Client)
                        </button>
                      </>
                    )}

                    {prop.status === 'Acceptée' && (
                      <button
                        onClick={() => onGenerateContract(prop.id)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      >
                        <FileSignature size={12} />
                        Générer le contrat d'exploitation
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        // Screen 8: Contrats Tab
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registre des Contrats de Location</h2>
              <p className="text-xs text-slate-500">Supervisez l'exécution légale, vérifiez les polices d'assurance et activez la facturation automatique.</p>
            </div>
            <button
              id="btn-download-report-contracts"
              onClick={() => setShowReportSelector(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1.5 border border-slate-800"
            >
              <Download size={14} className="text-amber-500" />
              Télécharger Rapport PDF
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredContracts.map(ctr => (
              <div key={ctr.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors">
                
                {/* Contract Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-950 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {ctr.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      ctr.status === 'Brouillon' ? 'bg-slate-100 text-slate-600' :
                      ctr.status === 'En Signature' ? 'bg-amber-100 text-amber-800' :
                      ctr.status === 'Signé' ? 'bg-teal-100 text-teal-800' :
                      ctr.status === 'Actif' ? 'bg-emerald-100 text-emerald-800 font-semibold' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ctr.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    Location : {ctr.engineName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Locataire :</span>
                      <span className="font-semibold text-slate-800">{ctr.companyName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Période de location :</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {ctr.startDate} au {ctr.endDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Attestation RC décennale :</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <ShieldCheck size={12} className="text-indigo-500" />
                        {ctr.insuranceNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial overview & contract triggers */}
                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-3.5 md:pt-0 md:pl-5 text-right shrink-0 w-full md:w-auto space-y-2">
                  <div className="font-mono">
                    <span className="text-slate-400 text-[10px] block">Montant du contrat :</span>
                    <span className="text-base font-black text-slate-950">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(ctr.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Basé sur {ctr.dailyRate} €/jour d'exploitation</span>
                  </div>

                  {ctr.signedAt && (
                    <p className="text-[10px] text-emerald-600 font-semibold font-mono">✓ Signé électroniquement le {ctr.signedAt}</p>
                  )}

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => alert(`Téléchargement de la charte contractuelle PDF pour le contrat ${ctr.code}`)}
                      className="p-1.5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded cursor-pointer"
                      title="Télécharger le contrat juridique signé"
                    >
                      <Download size={14} />
                    </button>

                    {ctr.status === 'En Signature' && (
                      <button
                        onClick={() => onSignContract(ctr.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      >
                        <PenTool size={12} />
                        Signer le contrat
                      </button>
                    )}

                    {ctr.status === 'Signé' && (
                      <button
                        onClick={() => onActivateContract(ctr.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle size={12} />
                        Activer & Mettre en service
                      </button>
                    )}

                    {ctr.status === 'Actif' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200">
                        <FileCheck2 size={12} />
                        Contrat Actif / Facturation en cours
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
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
