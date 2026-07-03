import React, { useEffect, useState } from 'react';
import { GlobalParams, AuditLog, ExportJob, PdfReport } from '../types';
import { getAdminSettings, resetSettingsToDefault, updateAdminSettings } from '../services/settings.service';
import { getAuditLogById, getAuditLogs, type AuditFilters } from '../services/audit.service';
import { downloadExport, type ExportFormat, type ExportResource } from '../services/export.service';
import { getAuditActionLabel, getAuditModuleLabel, getSeverityLabel, getSeverityVariant } from '../constants/status';
import { defaultAdminSettingsForm, mapApiSettingsToAdminForm, type AdminSettingsForm } from '../mappers/settings.mapper';
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
  initialTab?: 'params' | 'audit' | 'exports' | 'reports';
}

type Field = keyof AdminSettingsForm;
const textFields = (items: Array<[Field, string, string?]>, form: AdminSettingsForm, setValue: (field: Field, value: string | number | boolean | string[]) => void) => items.map(([field, label, type = 'text']) => (
  <div key={field}>
    <label className="block font-semibold text-slate-700 mb-1">{label}</label>
    <input type={type} value={String(form[field] ?? '')} onChange={(e) => setValue(field, type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500" />
  </div>
));

const textAreas = (items: Array<[Field, string]>, form: AdminSettingsForm, setValue: (field: Field, value: string) => void) => items.map(([field, label]) => (
  <div key={field}>
    <label className="block font-semibold text-slate-700 mb-1">{label}</label>
    <textarea rows={3} value={String(form[field] ?? '')} onChange={(e) => setValue(field, e.target.value)} className="w-full p-2.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500" />
  </div>
));

export const AdminView: React.FC<AdminViewProps> = ({
  params,
  auditLogs,
  exports,
  pdfReports,
  onUpdateParams,
  onAddExportJob,
  onGeneratePdfReport,
  initialTab = 'params'
}) => {
  const [adminTab, setAdminTab] = useState<'params' | 'audit' | 'exports' | 'reports'>(initialTab);
  const [apiAuditLogs, setApiAuditLogs] = useState<AuditLog[]>(auditLogs);
  const [auditFilters, setAuditFilters] = useState<AuditFilters>({ limit: 100 });
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const [auditDetailLoading, setAuditDetailLoading] = useState(false);
  const [exportFilters, setExportFilters] = useState({ dateFrom: '', dateTo: '', status: '', limit: '5000' });
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Parameters form state
  const [formParams, setFormParams] = useState<AdminSettingsForm>(defaultAdminSettingsForm);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsResetting, setSettingsResetting] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);



  // PDF report form state
  const [reportTitle, setReportTitle] = useState('Rapport de Performances Plateforme T3');
  const [reportType, setReportType] = useState<'Mensuel' | 'Annuel' | 'Performance' | 'Financier'>('Performance');
  const [reportPeriod, setReportPeriod] = useState('Troisième Trimestre 2026');

  useEffect(() => setAdminTab(initialTab), [initialTab]);

  const syncParentParams = (form: AdminSettingsForm) => onUpdateParams({
    ...params,
    platformName: form.platformName,
    legalName: form.legalName,
    defaultCurrency: form.defaultCurrency,
    enabledCurrencies: form.enabledCurrencies,
    defaultPlatformCommissionRate: form.defaultPlatformCommissionRate,
    defaultTaxRate: form.defaultTaxRate,
    platformFeeRate: form.defaultPlatformCommissionRate,
    taxRate: form.defaultTaxRate,
    enablePdfReports: form.enablePdfReports,
    enableNotifications: form.enableNotifications,
    enableScoring: form.enableScoring,
    enableTenderModule: form.enableTenderModule
  });

  const loadSettings = () => {
    setSettingsLoading(true); setSettingsError(null);
    getAdminSettings()
      .then((payload) => { const form = mapApiSettingsToAdminForm(payload); setFormParams(form); syncParentParams(form); })
      .catch((error) => setSettingsError(error?.message || 'Impossible de charger les paramètres admin.'))
      .finally(() => setSettingsLoading(false));
  };

  useEffect(loadSettings, []);

  const setValue = (field: Field, value: string | number | boolean | string[]) => setFormParams((prev) => ({ ...prev, [field]: value }));

  const handleParamsSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSettingsSaving(true); setSettingsError(null); setSettingsSuccess(null);
    try { const saved = await updateAdminSettings(formParams); const form = mapApiSettingsToAdminForm(saved); setFormParams(form); syncParentParams(form); setSettingsSuccess('Paramètres plateforme sauvegardés.'); }
    catch (error: any) { setSettingsError(error?.message || 'Sauvegarde des paramètres impossible.'); }
    finally { setSettingsSaving(false); }
  };

  const handleResetSettings = async () => {
    if (!window.confirm('Réinitialiser les paramètres DEL aux valeurs par défaut ?')) return;
    setSettingsResetting(true); setSettingsError(null); setSettingsSuccess(null);
    try { const reset = await resetSettingsToDefault(); const form = mapApiSettingsToAdminForm(reset); setFormParams(form); syncParentParams(form); setSettingsSuccess('Paramètres réinitialisés par défaut.'); }
    catch (error: any) { setSettingsError(error?.message || 'Réinitialisation des paramètres impossible.'); }
    finally { setSettingsResetting(false); }
  };

  const loadAuditLogs = () => {
    setAuditLoading(true); setAuditError(null);
    getAuditLogs(auditFilters)
      .then(setApiAuditLogs)
      .catch((error) => setAuditError(error?.message || 'Impossible de charger l’audit depuis l’API DEL.'))
      .finally(() => setAuditLoading(false));
  };

  useEffect(() => { if (adminTab === 'audit') loadAuditLogs(); }, [adminTab]);

  const setAuditFilter = (field: keyof AuditFilters, value: string) => setAuditFilters((prev) => ({ ...prev, [field]: value }));
  const setExportFilter = (field: keyof typeof exportFilters, value: string) => setExportFilters((prev) => ({ ...prev, [field]: value }));

  const openAuditDetail = async (id: string) => {
    setAuditDetailLoading(true); setAuditError(null);
    try { setSelectedAudit(await getAuditLogById(id)); }
    catch (error: any) { setAuditError(error?.message || 'Impossible de charger le détail audit depuis l’API DEL.'); }
    finally { setAuditDetailLoading(false); }
  };

  const prettyJson = (value: unknown) => {
    if (value === undefined || value === null || value === '') return '—';
    try { return JSON.stringify(value, null, 2); } catch { return String(value); }
  };

  const runExport = async (resource: ExportResource, format: ExportFormat = 'csv') => {
    const key = `${resource}-${format}`;
    setExportLoading(key); setExportError(null);
    try { await downloadExport(resource, format, exportFilters); }
    catch (error: any) { setExportError(error?.message || 'Téléchargement export impossible depuis DEL-api.'); }
    finally { setExportLoading(null); }
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
        <form onSubmit={handleParamsSubmit} className="space-y-6 animate-in fade-in duration-150 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Paramètres plateforme connectés à DEL-api</h2>
              <p className="text-xs text-slate-500">Lecture, modification et reset via les endpoints admin protégés.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleResetSettings} disabled={settingsResetting || settingsSaving} className="border border-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-md disabled:opacity-60">{settingsResetting ? 'Réinitialisation…' : 'Réinitialiser par défaut'}</button>
              <button type="submit" disabled={settingsSaving || settingsResetting} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-md disabled:opacity-60">{settingsSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
          {settingsLoading && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">Chargement des paramètres…</div>}
          {settingsError && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">{settingsError}</div>}
          {settingsSuccess && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">{settingsSuccess}</div>}

          {[
            ['Identité DEL', [['platformName','Nom plateforme'],['legalName','Nom légal'],['slogan','Slogan'],['description','Description'],['logoUrl','Logo URL'],['faviconUrl','Favicon URL'],['primaryColor','Couleur primaire'],['secondaryColor','Couleur secondaire'],['accentColor','Couleur accent']]],
            ['Coordonnées', [['email','Email'],['phone','Téléphone'],['whatsapp','WhatsApp'],['website','Site web'],['address','Adresse'],['country','Pays'],['city','Ville']]],
            ['Informations légales', [['rccm','RCCM'],['ifu','IFU'],['taxNumber','Numéro fiscal'],['registrationNumber','Numéro enregistrement']]],
            ['Paramètres financiers', [['defaultCurrency','Devise par défaut'],['invoicePrefix','Préfixe facture'],['contractPrefix','Préfixe contrat'],['paymentPrefix','Préfixe paiement'],['defaultPlatformCommissionRate','Commission plateforme (%)','number'],['defaultTaxRate','Taxe (%)','number']]]
          ].map(([title, fields]) => (
            <section key={title as string} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900">{title as string}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{textFields(fields as Array<[Field,string,string?]>, formParams, setValue)}</div>
              {title === 'Paramètres financiers' && <div><label className="block font-semibold text-slate-700 mb-1">Devises activées (séparées par virgules)</label><input value={formParams.enabledCurrencies.join(', ')} onChange={(e) => setValue('enabledCurrencies', e.target.value.split(',').map(v => v.trim()).filter(Boolean))} className="w-full p-2.5 border border-slate-200 rounded text-slate-900" /></div>}
            </section>
          ))}

          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900">Options métier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{(['allowPublicEquipmentSubmission','allowPublicRequestSubmission','requireAdminApprovalForEquipment','requireAdminApprovalForRequests','requireDocumentsForVerification','enableTenderModule','enableTenderSubmissions','enableScoring','enablePdfReports','enableInternalMessaging','enableNotifications'] as Field[]).map((field) => <label key={field} className="flex items-center justify-between gap-3 rounded border border-slate-100 p-3"><span className="font-semibold text-slate-700">{field}</span><input type="checkbox" checked={Boolean(formParams[field])} onChange={(e) => setValue(field, e.target.checked)} className="w-5 h-5 accent-amber-500" /></label>)}</div>
          </section>
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4"><h3 className="font-bold text-slate-900">Textes légaux</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{textAreas([['termsOfService','Conditions générales'],['privacyPolicy','Politique confidentialité'],['rentalTerms','Conditions location'],['ownerTerms','Conditions propriétaires'],['companyTerms','Conditions entreprises'],['investmentDisclaimer','Disclaimer investissement'],['paymentTerms','Conditions paiement'],['contractLegalNotice','Mention contrat'],['invoiceLegalNotice','Mention facture']], formParams, (f,v)=>setValue(f,v))}</div></section>
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4"><h3 className="font-bold text-slate-900">Textes publics</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{textAreas([['homepageHeroTitle','Titre hero'],['homepageHeroSubtitle','Sous-titre hero'],['homepageCtaText','Texte CTA'],['equipmentSubmissionNotice','Notice dépôt engin'],['requestSubmissionNotice','Notice demande'],['tenderSubmissionNotice','Notice appel d’offres']], formParams, (f,v)=>setValue(f,v))}</div></section>
        </form>
      )}

      {/* Screen 18: Audit (Security Log) */}
      {adminTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Journal de traçabilité d'Audit Sécurité</h2>
              <p className="text-xs text-slate-500">Logs administrateur chargés depuis DEL-api avec filtres simples.</p>
            </div>
            <button onClick={loadAuditLogs} disabled={auditLoading} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-60">{auditLoading ? 'Chargement…' : 'Rafraîchir'}</button>
          </div>

          <form onSubmit={(e)=>{e.preventDefault(); loadAuditLogs();}} className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            {(['module','action','actorRole','entityType','severity','dateFrom','dateTo','limit'] as Array<keyof AuditFilters>).map((field) => (
              <div key={field}>
                <label className="block font-bold text-slate-600 mb-1">{field}</label>
                <input type={field.toString().startsWith('date') ? 'date' : field === 'limit' ? 'number' : 'text'} value={String(auditFilters[field] ?? '')} onChange={(e)=>setAuditFilter(field, e.target.value)} className="w-full border border-slate-200 rounded p-2" placeholder={field === 'limit' ? '100' : ''} />
              </div>
            ))}
            <button className="col-span-2 md:col-span-4 lg:col-span-8 bg-amber-500 text-slate-950 rounded p-2 font-black">Appliquer les filtres</button>
          </form>
          {auditLoading && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-xs">Chargement de l’audit DEL-api…</div>}
          {auditError && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs">{auditError || 'Impossible de charger l’audit depuis l’API DEL.'}</div>}
          {auditDetailLoading && <div className="rounded-lg border border-slate-200 bg-white p-3 text-slate-500 text-xs">Chargement du détail audit…</div>}

          {selectedAudit && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between gap-3"><h3 className="font-bold text-slate-900">Détail audit #{selectedAudit.id}</h3><button onClick={()=>setSelectedAudit(null)} className="text-slate-600 underline">Retour à la liste</button></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <section><h4 className="font-bold mb-2">Action</h4><p>{getAuditActionLabel(selectedAudit.action)}</p><p>{getAuditModuleLabel(selectedAudit.module)}</p><p>{getSeverityLabel(selectedAudit.severity)}</p><p>{selectedAudit.createdAt}</p></section>
                <section><h4 className="font-bold mb-2">Acteur</h4><p>{selectedAudit.actorName}</p><p>{selectedAudit.actorRole}</p><p>{selectedAudit.actorUserId || '—'}</p></section>
                <section><h4 className="font-bold mb-2">Entité</h4><p>{selectedAudit.entityType || '—'}</p><p>{selectedAudit.entityId || '—'}</p><p>{selectedAudit.entityLabel || '—'}</p></section>
              </div>
              <section><h4 className="font-bold mb-2">Message</h4><p className="text-slate-700">{selectedAudit.message || selectedAudit.details}</p></section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><section><h4 className="font-bold mb-2">Ancienne valeur</h4><pre className="bg-slate-950 text-slate-100 rounded p-3 overflow-auto text-[11px]">{prettyJson(selectedAudit.oldValue)}</pre></section><section><h4 className="font-bold mb-2">Nouvelle valeur</h4><pre className="bg-slate-950 text-slate-100 rounded p-3 overflow-auto text-[11px]">{prettyJson(selectedAudit.newValue)}</pre></section></div>
              <section><h4 className="font-bold mb-2">Contexte technique</h4><p>IP : {selectedAudit.ipAddress || '—'}</p><p className="break-all">User agent : {selectedAudit.userAgent || '—'}</p></section>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><th className="px-4 py-3">Date</th><th className="px-4 py-3">Acteur</th><th className="px-4 py-3">Rôle</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Module</th><th className="px-4 py-3">Entité</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Sévérité</th><th className="px-4 py-3">Détail</th></tr></thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {!auditLoading && apiAuditLogs.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">Aucun log d’audit pour le moment.</td></tr>}
                  {apiAuditLogs.map(log => <tr key={log.id} className="hover:bg-slate-50/50"><td className="px-4 py-3 font-mono text-slate-500">{log.createdAt || log.timestamp}</td><td className="px-4 py-3 font-semibold">{log.actorName || log.user}</td><td className="px-4 py-3">{log.actorRole || 'SYSTEM'}</td><td className="px-4 py-3">{getAuditActionLabel(log.action)}</td><td className="px-4 py-3">{getAuditModuleLabel(log.module)}</td><td className="px-4 py-3">{log.entityLabel || log.entityType || '—'}</td><td className="px-4 py-3 max-w-xs truncate" title={log.message || log.details}>{log.message || log.details}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityVariant(log.severity) === 'danger' ? 'bg-rose-100 text-rose-800' : getSeverityVariant(log.severity) === 'warning' ? 'bg-amber-100 text-amber-800' : getSeverityVariant(log.severity) === 'info' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}`}>{getSeverityLabel(log.severity)}</span></td><td className="px-4 py-3"><button onClick={()=>openAuditDetail(log.id)} className="text-amber-700 font-bold hover:underline">Voir détail</button></td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen 19: Exports Center */}
      {adminTab === 'exports' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div><h2 className="text-base font-bold text-slate-900">Centre d'Exports DEL-api</h2><p className="text-xs text-slate-500">Exports CSV/JSON administratifs sans ouvrir de page blanche.</p></div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">{(['dateFrom','dateTo','status','limit'] as const).map(field => <div key={field}><label className="block font-bold text-slate-600 mb-1">{field}</label><input type={field.startsWith('date') ? 'date' : field === 'limit' ? 'number' : 'text'} value={exportFilters[field]} onChange={(e)=>setExportFilter(field, e.target.value)} className="w-full border border-slate-200 rounded p-2" /></div>)}</div>
          {exportError && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs">{exportError}</div>}
          {[
            ['Données opérationnelles', [['Engins','equipment'], ['Demandes','requests'], ['Appels d’offres','tenders'], ['Propositions','proposals'], ['Contrats','contracts'], ['Missions','missions'], ['Maintenance','maintenance']]],
            ['Finance', [['Factures','invoices'], ['Paiements','payments']]],
            ['Administration', [['Documents','documents'], ['Utilisateurs','users'], ['Audit logs','audit-logs']]],
          ].map(([title, rows]) => <section key={title as string} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs"><h3 className="font-bold text-slate-900 mb-4">{title as string}</h3><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{(rows as string[][]).map(([label, resource]) => <div key={resource} className="border border-slate-100 rounded-lg p-4 flex items-center justify-between gap-3"><span className="font-semibold text-sm">{label}</span><div className="flex gap-2"><button onClick={()=>runExport(resource as ExportResource, 'csv')} disabled={!!exportLoading} className="px-3 py-1.5 rounded bg-slate-900 text-white text-[11px] font-bold disabled:opacity-60">{exportLoading === `${resource}-csv` ? '…' : 'CSV'}</button><button onClick={()=>runExport(resource as ExportResource, 'json')} disabled={!!exportLoading} className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 text-[11px] font-bold disabled:opacity-60">{exportLoading === `${resource}-json` ? '…' : 'JSON'}</button></div></div>)}</div></section>)}
          <section className="bg-slate-950 text-white border border-slate-900 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h3 className="font-bold">Sauvegarde administrative</h3><p className="text-xs text-slate-300 mt-1">La sauvegarde complète JSON est un export administratif, pas une restauration MongoDB complète.</p></div><button onClick={()=>runExport('full-backup', 'json')} disabled={!!exportLoading} className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-black disabled:opacity-60">{exportLoading === 'full-backup-json' ? 'Téléchargement…' : 'Full backup JSON'}</button></section>
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
