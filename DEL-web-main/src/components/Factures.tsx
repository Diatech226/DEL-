import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  X,
  Loader2,
  Check,
  Printer,
  ShieldCheck,
  FileDown
} from 'lucide-react';
import { Invoice } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FacturesProps {
  invoices: Invoice[];
  onNavigate: (screen: string) => void;
}

export default function Factures({ invoices, onNavigate }: FacturesProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  // Simulation of PDF Export States
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [exportPhase, setExportPhase] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [exportProgress, setExportProgress] = useState(0);

  const startPdfSimulation = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setExportPhase('generating');
    setExportProgress(0);
  };

  useEffect(() => {
    let interval: any;
    if (exportPhase === 'generating') {
      interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setExportPhase('completed');
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exportPhase]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || 
                          inv.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
                          inv.engineName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Tous' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter(i => i.status === 'Payé').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'En attente').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-factures">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Facturation & Transactions</h1>
          <p className="text-xs text-gray-500">Gérez vos factures de locations, frais d'entretien d'atelier, et primes d'assurance flotte.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Montant Perçu</p>
          <p className="font-sans text-2xl font-black text-emerald-600">+{totalRevenue.toLocaleString('fr-FR')} €</p>
          <span className="text-[9px] text-gray-400">Transactions validées</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">En Attente de Règlement</p>
          <p className="font-sans text-2xl font-black text-amber-500">+{pendingRevenue.toLocaleString('fr-FR')} €</p>
          <span className="text-[9px] text-gray-400">Échéance à 30 jours</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compte B2B Associé</p>
          <p className="font-sans text-sm font-extrabold text-gray-800">RIB Mercier Levage</p>
          <span className="text-[9px] text-gray-400">FR76 3000 6000 0123...</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n° de facture, entreprise ou engin..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200 self-start">
          {['Tous', 'Payé', 'En attente'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                statusFilter === status ? 'bg-amber-500 text-gray-950' : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400">
                <th className="p-4 pl-6">Numéro</th>
                <th className="p-4">Type / Libellé</th>
                <th className="p-4">Tiers</th>
                <th className="p-4">Date Émission</th>
                <th className="p-4">Montant HT</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right pr-6">Téléchargement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-xs font-semibold text-gray-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-gray-900">{inv.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">{inv.type}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{inv.engineName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{inv.clientCompany}</td>
                  <td className="p-4 text-gray-500">{inv.date}</td>
                  <td className="p-4 font-bold text-gray-950">{inv.amount.toLocaleString('fr-FR')} €</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      inv.status === 'Payé'
                        ? 'bg-emerald-50 text-emerald-700'
                        : inv.status === 'En attente'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {inv.status === 'Payé' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {inv.status === 'En attente' && <Clock className="h-3.5 w-3.5" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => startPdfSimulation(inv)}
                      className="rounded-lg border border-gray-200 p-2 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer"
                      title="Télécharger l'export PDF de la facture"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation PDF Modal Overlay */}
      <AnimatePresence>
        {selectedInvoice && exportPhase !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" id="pdf-export-simulation-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-150 overflow-hidden flex flex-col"
            >
              {exportPhase === 'generating' ? (
                /* Phase 1: Generating Animation */
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
                    <FileText className="h-6 w-6 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2 w-full max-w-xs">
                    <h3 className="font-sans text-base font-black text-gray-900">
                      Génération du Document PDF
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Préparation de la facture <span className="font-mono font-bold text-gray-800">{selectedInvoice.id}</span>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md space-y-1.5">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-amber-500 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${exportProgress}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold font-mono text-gray-400">
                      <span>
                        {exportProgress < 30 ? 'Extraction des données...' : 
                         exportProgress < 60 ? 'Calcul des taxes (TVA 20%)...' : 
                         exportProgress < 90 ? 'Génération de la signature cryptographique...' : 
                         'Finalisation du PDF...'}
                      </span>
                      <span>{exportProgress}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Phase 2: PDF Simulated Viewer */
                <div className="flex flex-col h-[85vh] max-h-[680px]">
                  {/* Modal Header */}
                  <div className="bg-gray-900 text-white p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <FileDown className="h-5 w-5 text-amber-500" />
                      <div>
                        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest leading-none">Simulation Export</h3>
                        <p className="text-sm font-bold font-sans mt-0.5">Facture_{selectedInvoice.id}.pdf</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInvoice(null);
                        setExportPhase('idle');
                      }}
                      className="rounded-full p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* PDF Document Canvas */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-100/50 flex justify-center">
                    {/* Simulated Paper sheet */}
                    <div className="w-full max-w-xl bg-white rounded-lg shadow-md border border-gray-200/80 p-8 flex flex-col justify-between font-sans text-xs text-gray-800 space-y-6 relative overflow-hidden">
                      {/* Diagonal draft watermark */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-emerald-500/5 font-black text-7xl select-none pointer-events-none tracking-widest font-sans">
                        PAYÉ
                      </div>

                      {/* Paper Top section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-150 pb-5">
                          <div>
                            <h2 className="text-sm font-black text-gray-950 uppercase tracking-tight">DEL-web SAS</h2>
                            <p className="text-[10px] text-gray-500 font-medium">Logistique & Levage International</p>
                            <p className="text-[9px] text-gray-400 mt-1 font-mono">
                              15 Rue d'Atelier, 75013 Paris<br />
                              SIRET: 843 902 110 00021<br />
                              TVA Intracom: FR 42 843902110
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200/50">
                              <ShieldCheck className="h-3 w-3" /> Certifié Conforme
                            </span>
                            <h3 className="text-lg font-black text-gray-900 mt-2 font-mono">{selectedInvoice.id}</h3>
                            <p className="text-[10px] text-gray-500">Date : {selectedInvoice.date}</p>
                          </div>
                        </div>

                        {/* Addresses block */}
                        <div className="grid grid-cols-2 gap-6 pt-2">
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Émetteur :</h4>
                            <p className="font-bold text-gray-900">DEL-web SAS</p>
                            <p className="text-gray-500 text-[11px]">Département Facturation B2B</p>
                            <p className="text-gray-400 text-[10px]">contact@del-web.fr</p>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destinataire :</h4>
                            <p className="font-bold text-gray-900">{selectedInvoice.clientCompany}</p>
                            <p className="text-gray-500 text-[11px]">Compte Client Associé</p>
                            <p className="text-gray-400 text-[10px]">Type d'opération: {selectedInvoice.type}</p>
                          </div>
                        </div>

                        {/* Invoice details list */}
                        <div className="pt-4 space-y-2">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Détails des Prestations :</h4>
                          <div className="border border-gray-150 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-[11px]">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-150 text-[9px] font-extrabold uppercase text-gray-500">
                                  <th className="p-3">Désignation</th>
                                  <th className="p-3 text-right">Qté</th>
                                  <th className="p-3 text-right">Prix Unitaire HT</th>
                                  <th className="p-3 text-right">Total HT</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 font-medium">
                                <tr>
                                  <td className="p-3">
                                    <p className="font-bold text-gray-900">{selectedInvoice.type}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Matériel : {selectedInvoice.engineName}</p>
                                  </td>
                                  <td className="p-3 text-right text-gray-500">1</td>
                                  <td className="p-3 text-right text-gray-900">{selectedInvoice.amount.toLocaleString('fr-FR')} €</td>
                                  <td className="p-3 text-right font-bold text-gray-900">{selectedInvoice.amount.toLocaleString('fr-FR')} €</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Calculations total */}
                      <div className="flex justify-end pt-4 border-t border-gray-150 shrink-0">
                        <div className="w-64 space-y-1.5 text-[11px]">
                          <div className="flex justify-between text-gray-500">
                            <span>Total HT</span>
                            <span className="font-semibold">{selectedInvoice.amount.toLocaleString('fr-FR')} €</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>TVA (20%)</span>
                            <span className="font-semibold">{(selectedInvoice.amount * 0.2).toLocaleString('fr-FR')} €</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-xs text-gray-900 font-bold">
                            <span>Total TTC</span>
                            <span className="text-sm text-gray-950">{(selectedInvoice.amount * 1.2).toLocaleString('fr-FR')} €</span>
                          </div>
                        </div>
                      </div>

                      {/* Certifications and signatures */}
                      <div className="flex justify-between items-end pt-4 text-[9px] text-gray-400 font-medium shrink-0">
                        <div>
                          <p>Généré automatiquement par DEL-web</p>
                          <p className="font-mono text-[8px] mt-0.5 text-gray-400">UUID d'export: pdf_arc_2026_{selectedInvoice.id.toLowerCase()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-emerald-600 flex items-center gap-0.5 justify-end uppercase">
                            <Check className="h-3 w-3" /> Signé Électriquement
                          </p>
                          <p className="font-mono text-[8px]">SHA-256: e8f5...7b2a</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap gap-3 justify-between items-center shrink-0">
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="h-4 w-4 bg-emerald-100 rounded-full p-0.5 shrink-0" /> Export PDF simulé avec succès !
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Simuler l'impression du document"
                      >
                        <Printer className="h-3.5 w-3.5 text-gray-500" />
                        Imprimer
                      </button>
                      <button
                        onClick={() => startPdfSimulation(selectedInvoice)}
                        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Relancer le processus d'export"
                      >
                        <FileDown className="h-3.5 w-3.5 text-gray-500" />
                        Exporter à nouveau
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(null);
                          setExportPhase('idle');
                        }}
                        className="rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-950 px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Fermer l'aperçu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
