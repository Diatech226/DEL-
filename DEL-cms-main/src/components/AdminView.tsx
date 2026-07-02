import React, { useState } from 'react';
import { GlobalParams, AuditLog, ExportJob, PdfReport } from '../types';
import { 
  Sliders, 
  ShieldAlert, 
  Download, 
  Plus, 
  Check, 
  Activity, 
  FileText, 
  Settings, 
  ArrowDownToLine, 
  Database, 
  HelpCircle,
  ToggleLeft,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface AdminViewProps {
  params: GlobalParams;
  auditLogs: AuditLog[];
  exports: ExportJob[];
  pdfReports: PdfReport[];
  onUpdateParams: (newParams: GlobalParams) => void;
  onAddExportJob: (job: Omit<ExportJob, 'id' | 'timestamp' | 'status' | 'size'>) => void;
  onGeneratePdfReport: (report: Omit<PdfReport, 'id' | 'generatedAt' | 'status' | 'downloadCount'>) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  params,
  auditLogs,
  exports,
  pdfReports,
  onUpdateParams,
  onAddExportJob,
  onGeneratePdfReport
}) => {
  const [adminTab, setAdminTab] = useState<'params' | 'audit' | 'exports' | 'reports'>('params');

  // Parameters form state
  const [formParams, setFormParams] = useState<GlobalParams>({ ...params });

  // Exports form state
  const [exportFormat, setExportFormat] = useState<'CSV' | 'Excel' | 'JSON'>('Excel');
  const [exportTarget, setExportTarget] = useState('Registre_Engins_Complet');

  // PDF report form state
  const [reportTitle, setReportTitle] = useState('Rapport de Performances Plateforme T3');
  const [reportType, setReportType] = useState<'Mensuel' | 'Annuel' | 'Performance' | 'Financier'>('Performance');
  const [reportPeriod, setReportPeriod] = useState('Troisième Trimestre 2026');

  const handleParamsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateParams(formParams);
    alert("Les réglages généraux de la plateforme DEL ont été sauvegardés.");
  };

  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExportJob({
      name: `${exportTarget}_${new Date().toISOString().split('T')[0]}`,
      format: exportFormat,
      recordsCount: exportTarget.includes('Engins') ? 8 : exportTarget.includes('Factures') ? 4 : 15
    });
    alert(`Lancement de l'exportation au format ${exportFormat}. Le traitement s'effectue en arrière-plan.`);
  };

  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePdfReport({
      title: reportTitle,
      type: reportType,
      period: reportPeriod
    });
    alert(`Lancement du moteur de rendu PDF DEL-Report®. Le rapport "${reportTitle}" sera disponible au téléchargement d'ici quelques instants.`);
  };

  return (
    <div id="admin-view" className="space-y-6">
      
      {/* Tab select header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            id="adm-tab-params"
            onClick={() => setAdminTab('params')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              adminTab === 'params' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Paramètres Plateforme
          </button>
          <button
            id="adm-tab-audit"
            onClick={() => setAdminTab('audit')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              adminTab === 'audit' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Registre d'Audit
          </button>
          <button
            id="adm-tab-exports"
            onClick={() => setAdminTab('exports')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              adminTab === 'exports' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Centre d'Exports
          </button>
          <button
            id="adm-tab-reports"
            onClick={() => setAdminTab('reports')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              adminTab === 'reports' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Rapports PDF d'Activité
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden md:inline-block">System Kernel v2.5.0-Prod</span>
      </div>

      {/* Screen 17: Paramètres */}
      {adminTab === 'params' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Variables de Configuration Plateforme</h2>
              <p className="text-xs text-slate-500">Ajustez les taux d'intermédiation financiers par défaut, la fiscalité de la plateforme, et les seuils d'alertes.</p>
            </div>

            <form onSubmit={handleParamsSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taux de Commission Plateforme par défaut (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formParams.platformFeeRate}
                    onChange={(e) => setFormParams({ ...formParams, platformFeeRate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Prélèvement brut appliqué aux propriétaires</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taux de Taxe / TVA appliqué (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formParams.taxRate}
                    onChange={(e) => setFormParams({ ...formParams, taxRate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">TVA légale sur la facturation de prestations</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Délai par défaut de paiement de factures (jours)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formParams.defaultPaymentTermDays}
                    onChange={(e) => setFormParams({ ...formParams, defaultPaymentTermDays: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Nombre de jours maximum avant mise en retard</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seuil minimal d'Auto-Matching (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formParams.autoMatchingMinScore}
                    onChange={(e) => setFormParams({ ...formParams, autoMatchingMinScore: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Score requis pour que le moteur de matching propose une alerte</span>
                </div>

                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">Activer les alertes SMS automatisées</p>
                      <p className="text-[10px] text-slate-400">Notifie instantanément les techniciens d'urgences de pannes critiques par SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formParams.enableSmsAlerts}
                      onChange={(e) => setFormParams({ ...formParams, enableSmsAlerts: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">Seuil d'alerte de maintenance anticipée (heures compteur)</p>
                      <p className="text-[10px] text-slate-400">Émet une notification d'intervention quand la machine approche d'un cycle</p>
                    </div>
                    <input
                      type="number"
                      value={formParams.maintenanceAlertThresholdHours}
                      onChange={(e) => setFormParams({ ...formParams, maintenanceAlertThresholdHours: Number(e.target.value) })}
                      className="p-2 border border-slate-200 rounded w-20 text-right focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-md transition-all shadow-sm cursor-pointer"
                >
                  Sauvegarder les réglages plateforme
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 text-slate-100 border border-slate-900 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-500">Moteur Automatisé</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                La plateforme s'exécute de façon décentralisée. En configurant un seuil d'auto-matching minimal élevé, vous limitez le volume de propositions envoyées aux clients, mais améliorez le taux de transformation de 18% en moyenne.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Screen 18: Audit (Security Log) */}
      {adminTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-base font-bold text-slate-900">Journal de traçabilité d'Audit Sécurité</h2>
            <p className="text-xs text-slate-500">Registre réglementaire inaltérable listant l'ensemble des actions initiées par les administrateurs et exploitants.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">ID Log</th>
                    <th className="px-5 py-3.5 font-mono">Date & Heure</th>
                    <th className="px-5 py-3.5">Auteur exploitant</th>
                    <th className="px-5 py-3.5">Action tracée</th>
                    <th className="px-5 py-3.5">Module</th>
                    <th className="px-5 py-3.5">Détails techniques</th>
                    <th className="px-5 py-3.5 font-mono">Adresse IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-slate-400 font-bold">{log.id}</td>
                      <td className="px-5 py-3 text-slate-500">{log.timestamp}</td>
                      <td className="px-5 py-3 font-sans font-semibold text-slate-900">{log.user}</td>
                      <td className="px-5 py-3 font-sans font-medium text-slate-800">{log.action}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          log.category === 'Sécurité' ? 'bg-rose-100 text-rose-800' :
                          log.category === 'Facturation' ? 'bg-emerald-100 text-emerald-800' :
                          log.category === 'Demande' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-sans text-slate-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                      <td className="px-5 py-3 text-slate-600 font-medium">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen 19: Exports Center */}
      {adminTab === 'exports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 self-start">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Database size={16} className="text-amber-500" />
              <h3 className="font-bold text-sm">Générer une extraction de base</h3>
            </div>

            <form onSubmit={handleExportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Données cibles à exporter</label>
                <select
                  value={exportTarget}
                  onChange={(e) => setExportTarget(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                >
                  <option value="Registre_Engins_Complet">Registre complet du parc d'engins</option>
                  <option value="Historique_Factures_Annee">Registre financier des factures émises</option>
                  <option value="Contrats_Locataires_Actifs">Registre des baux et contrats locataires</option>
                  <option value="Audit_Securite_Systeme">Journal complet des accès d'audit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Format de fichier</label>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  {(['Excel', 'CSV', 'JSON'] as const).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={`py-2 rounded border transition-all cursor-pointer ${
                        exportFormat === fmt 
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-black' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded transition-all cursor-pointer text-xs"
              >
                Lancer l'extraction de données
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Centre d'Exports et Téléchargements</h2>
              <p className="text-xs text-slate-500">Téléchargez les exports bruts générés pour les analyser sur vos outils BI ou comptables.</p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
              {exports.map(job => (
                <div key={job.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        {job.format}
                      </span>
                      <span className="font-bold text-slate-900">{job.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Généré le {job.timestamp} • {job.recordsCount} lignes extraites</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-500">{job.size || '34 KB'}</span>
                    
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      job.status === 'Terminé' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'En Cours' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      'bg-rose-100 text-rose-800 font-semibold'
                    }`}>
                      {job.status}
                    </span>

                    {job.status === 'Terminé' && (
                      <button
                        onClick={() => alert(`Téléchargement de l'export de base de données : ${job.name}.${job.format.toLowerCase()}`)}
                        className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded cursor-pointer"
                        title="Télécharger l'extraction"
                      >
                        <ArrowDownToLine size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Screen 20: Rapports PDF */}
      {adminTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 self-start">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <FileText size={16} className="text-amber-500" />
              <h3 className="font-bold text-sm">Générer un Rapport DEL-Report®</h3>
            </div>

            <form onSubmit={handlePdfSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre du document imprimable</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type de synthèse d'activité</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                >
                  <option value="Mensuel">Synthèse mensuelle globale</option>
                  <option value="Annuel">Bilan annuel d'exploitation</option>
                  <option value="Performance">Analyse de performance flotte</option>
                  <option value="Financier">Bilan financier de facturation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Période concernée</label>
                <input
                  type="text"
                  required
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  placeholder="ex: Juillet 2026"
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded transition-all cursor-pointer text-xs shadow-sm"
              >
                Compiler le PDF d'Activité
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registre des rapports d'activité PDF</h2>
              <p className="text-xs text-slate-500">Compilations PDF officielles prêtes pour impression, destinées à la direction générale ou aux investisseurs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pdfReports.map(rep => (
                <div key={rep.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors bg-slate-50/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {rep.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        rep.status === 'Prêt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{rep.title}</h4>
                    <p className="text-slate-500 text-xs font-mono">Période : {rep.period}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Téléchargé : {rep.downloadCount} fois</span>
                    
                    {rep.status === 'Prêt' ? (
                      <button
                        onClick={() => alert(`Impression / Téléchargement du document PDF : ${rep.title}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 font-sans font-bold text-[10px]"
                      >
                        <ArrowDownToLine size={12} />
                        Ouvrir le PDF
                      </button>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <RefreshCw size={12} className="animate-spin" />
                        Compilation...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
