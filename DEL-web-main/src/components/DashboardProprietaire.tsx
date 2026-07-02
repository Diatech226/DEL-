import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Layers, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  TrendingUp, 
  PlusCircle, 
  FileCheck2, 
  Clock, 
  MapPin, 
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Award,
  Bell,
  X,
  CheckCircle2,
  Sun,
  Moon,
  Info,
  Sliders,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  Check,
  FileText,
  Shield
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Machine, MaintenanceLog, Contract, DocumentFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import AlertPanel from './AlertPanel';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProprietaireProps {
  user: any;
  machines: Machine[];
  maintenanceLogs: MaintenanceLog[];
  contracts: Contract[];
  documents?: DocumentFile[];
  isPersonalized: boolean; // Toggle between Screen 2 (Customized) and Screen 17 (Fleet General)
  onNavigate: (screen: string) => void;
  simulatedEmails?: Array<{
    id: string;
    to: string;
    subject: string;
    body: string;
    dateSent: string;
    machineId: string;
    status: 'Envoyé';
    read: boolean;
  }>;
  onMarkEmailAsRead?: (id: string) => void;
}

export default function DashboardProprietaire({ 
  user, 
  machines, 
  maintenanceLogs, 
  contracts, 
  documents = [],
  isPersonalized,
  onNavigate,
  simulatedEmails = [],
  onMarkEmailAsRead = () => {}
}: DashboardProprietaireProps) {

  // Owner specific fleet calculations
  const ownerMachines = machines.filter(m => m.ownerId === user.id);
  const totalEnginesCount = ownerMachines.length;
  const rentedCount = ownerMachines.filter(m => m.status === 'rented').length;
  const availableCount = ownerMachines.filter(m => m.status === 'available').length;
  const maintenanceCount = ownerMachines.filter(m => m.status === 'maintenance').length;
  const availabilityRate = Math.round(((totalEnginesCount - maintenanceCount) / totalEnginesCount) * 100);

  // Income calculations
  const activeContracts = contracts.filter(c => c.status === 'Actif');
  const monthlyRevenue = activeContracts.reduce((sum, c) => {
    // Basic calculation of revenue
    return sum + (c.totalPrice / 3); // Divided roughly per month
  }, 0);

  const today = new Date('2026-07-02');

  // Active Alerts: e.g. maintenance upcoming, VGP expiring or expired
  const activeAlerts = ownerMachines.filter(m => {
    const nextMaint = new Date(m.nextMaintenanceDate);
    const diffTime = nextMaint.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 || m.status === 'maintenance';
  });

  // State for dismissed notifications
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([]);

  // Theme state: light or dark
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Security widget active tab
  const [securityTab, setSecurityTab] = useState<'risks' | 'strengths'>('risks');

  // Memoized critical maintenance notifications (occurring under 7 days or overdue)
  const criticalNotifications = useMemo(() => {
    const list: Array<{
      id: string;
      machineId: string;
      title: string;
      description: string;
      dueDate: string;
      type: 'overdue' | 'upcoming';
      severity: 'critical' | 'warning';
      daysLeft: number;
    }> = [];

    ownerMachines.forEach(m => {
      const nextMaint = new Date(m.nextMaintenanceDate);
      const diffTime = nextMaint.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        const isOverdue = diffDays < 0;
        const daysLabel = isOverdue 
          ? `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
          : diffDays === 0 
            ? "Aujourd'hui !" 
            : diffDays === 1 
              ? "Demain !" 
              : `Dans ${diffDays} jours`;

        // Check for associated non-completed logs
        const associatedLog = maintenanceLogs.find(log => log.machineId === m.id && log.status !== 'Terminé');

        list.push({
          id: `maint-crit-${m.id}`,
          machineId: m.id,
          title: `Maintenance Critique : ${m.brand} ${m.model}`,
          description: isOverdue 
            ? `L'entretien obligatoire est dépassé depuis le ${m.nextMaintenanceDate}.`
            : associatedLog 
              ? `${associatedLog.type} planifiée (${associatedLog.description}).`
              : `Échéance de maintenance sous 7 jours (${m.nextMaintenanceDate}). Veuillez planifier une intervention.`,
          dueDate: m.nextMaintenanceDate,
          type: isOverdue ? 'overdue' : 'upcoming',
          severity: isOverdue ? 'critical' : 'warning',
          daysLeft: diffDays
        });
      }
    });

    return list;
  }, [ownerMachines, maintenanceLogs]);

  // Filter out those that are dismissed
  const visibleNotifications = criticalNotifications.filter(n => !dismissedNotifs.includes(n.id));

  // Profitability Simulator state & calculations
  const { t, language } = useLanguage();
  const [targetUtilization, setTargetUtilization] = useState<number>(65);
  const [avgMaintCost, setAvgMaintCost] = useState<number>(3500);
  const [rentalDaysYear, setRentalDaysYear] = useState<number>(220);

  const totalFleetDailyValue = useMemo(() => {
    return ownerMachines.reduce((sum, m) => sum + m.dailyPrice, 0);
  }, [ownerMachines]);

  const projectedGrossRevenue = useMemo(() => {
    return totalFleetDailyValue * (targetUtilization / 100) * rentalDaysYear;
  }, [totalFleetDailyValue, targetUtilization, rentalDaysYear]);

  const projectedMaintenanceCosts = useMemo(() => {
    return avgMaintCost * totalEnginesCount;
  }, [avgMaintCost, totalEnginesCount]);

  const estimatedNetProfit = useMemo(() => {
    return Math.max(0, projectedGrossRevenue - projectedMaintenanceCosts);
  }, [projectedGrossRevenue, projectedMaintenanceCosts]);

  const profitabilityMargin = useMemo(() => {
    return projectedGrossRevenue > 0 ? Math.round((estimatedNetProfit / projectedGrossRevenue) * 100) : 0;
  }, [estimatedNetProfit, projectedGrossRevenue]);

  const simulatorChartData = useMemo(() => {
    return [
      {
        quarter: 'Q1',
        Revenue: Math.round(projectedGrossRevenue * 0.20),
        Maintenance: Math.round(projectedMaintenanceCosts * 0.35),
        Profit: Math.round(projectedGrossRevenue * 0.20 - projectedMaintenanceCosts * 0.35),
      },
      {
        quarter: 'Q2',
        Revenue: Math.round(projectedGrossRevenue * 0.27),
        Maintenance: Math.round(projectedMaintenanceCosts * 0.15),
        Profit: Math.round(projectedGrossRevenue * 0.27 - projectedMaintenanceCosts * 0.15),
      },
      {
        quarter: 'Q3',
        Revenue: Math.round(projectedGrossRevenue * 0.33),
        Maintenance: Math.round(projectedMaintenanceCosts * 0.15),
        Profit: Math.round(projectedGrossRevenue * 0.33 - projectedMaintenanceCosts * 0.15),
      },
      {
        quarter: 'Q4',
        Revenue: Math.round(projectedGrossRevenue * 0.20),
        Maintenance: Math.round(projectedMaintenanceCosts * 0.35),
        Profit: Math.round(projectedGrossRevenue * 0.20 - projectedMaintenanceCosts * 0.35),
      },
    ];
  }, [projectedGrossRevenue, projectedMaintenanceCosts]);

  // Security and Compliance Score calculations
  const securityCompliance = useMemo(() => {
    let score = 100;
    const strengths: Array<{ id: string; text: string; category: 'vgp' | 'cartegrise' | 'assurance' | 'contrat' }> = [];
    const risks: Array<{ id: string; text: string; severity: 'critical' | 'warning'; machineId?: string; contractId?: string; category: 'vgp' | 'cartegrise' | 'assurance' | 'contrat'; actionText: string; actionScreen: string }> = [];
    const today = new Date('2026-07-02');

    // 1. Global Fleet Insurance Check
    const hasGlobalInsurance = documents.some(d => d.category === 'Assurance' && d.status === 'Valide');
    if (hasGlobalInsurance) {
      strengths.push({
        id: 'global-insurance',
        text: language === 'fr' 
          ? "Attestation d'assurance de flotte active et conforme (SMABTP)."
          : "Global fleet insurance certificate active and compliant (SMABTP).",
        category: 'assurance'
      });
    } else {
      score -= 20;
      risks.push({
        id: 'global-insurance-missing',
        text: language === 'fr'
          ? "Aucune attestation d'assurance de flotte valide trouvée dans le Coffre-Fort."
          : "No valid global fleet insurance certificate found in the safe.",
        severity: 'critical',
        category: 'assurance',
        actionText: language === 'fr' ? "Uploader l'attestation" : "Upload certificate",
        actionScreen: "Coffre-fort Numérique - DEL-web"
      });
    }

    // 2. Machine Level Checks (VGP and Carte Grise)
    ownerMachines.forEach(m => {
      // VGP check
      const vgpDate = new Date(m.vgpCertDate);
      const limit = new Date(vgpDate);
      limit.setMonth(limit.getMonth() + 6); // Valid for 6 months
      const isVgpExpired = limit.getTime() < today.getTime();
      const vgpExpiredLabel = limit.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      if (isVgpExpired) {
        score -= 10;
        risks.push({
          id: `vgp-expired-${m.id}`,
          machineId: m.id,
          text: language === 'fr'
            ? `Visite Générale Périodique (VGP) expirée pour l'engin ${m.brand} ${m.model} (échéance le ${vgpExpiredLabel}).`
            : `Mandatory VGP inspection expired for ${m.brand} ${m.model} (due on ${vgpExpiredLabel}).`,
          severity: 'critical',
          category: 'vgp',
          actionText: language === 'fr' ? "Planifier VGP" : "Schedule VGP",
          actionScreen: "Calendrier de Planification de Maintenance - DEL-web"
        });
      } else {
        strengths.push({
          id: `vgp-valid-${m.id}`,
          text: language === 'fr'
            ? `VGP valide pour l'engin ${m.brand} ${m.model} jusqu'au ${vgpExpiredLabel}.`
            : `VGP up-to-date for ${m.brand} ${m.model} until ${vgpExpiredLabel}.`,
          category: 'vgp'
        });
      }

      // Carte Grise check
      const hasCarteGrise = documents.some(d => 
        d.category === 'Carte Grise' && 
        (d.name.toLowerCase().includes(m.brand.toLowerCase()) || d.name.toLowerCase().includes(m.model.toLowerCase()))
      );

      if (!hasCarteGrise) {
        score -= 5;
        risks.push({
          id: `cartegrise-missing-${m.id}`,
          machineId: m.id,
          text: language === 'fr'
            ? `Carte Grise manquante dans le Coffre-Fort pour ${m.brand} ${m.model}.`
            : `Missing Registration Card in the safe for ${m.brand} ${m.model}.`,
          severity: 'warning',
          category: 'cartegrise',
          actionText: language === 'fr' ? "Téléverser la carte grise" : "Upload registration",
          actionScreen: "Coffre-fort Numérique - DEL-web"
        });
      } else {
        strengths.push({
          id: `cartegrise-valid-${m.id}`,
          text: language === 'fr'
            ? `Carte Grise archivée et vérifiée pour ${m.brand} ${m.model}.`
            : `Registration Card archived and verified for ${m.brand} ${m.model}.`,
          category: 'cartegrise'
        });
      }
    });

    // 3. Contract Insurance Check
    contracts.forEach(c => {
      const isMyMachine = ownerMachines.some(m => m.id === c.machineId);
      if (isMyMachine) {
        if (c.status === 'Actif') {
          const hasInsurance = c.insuranceOption && c.insuranceOption !== 'Aucune';
          if (!hasInsurance) {
            score -= 15;
            risks.push({
              id: `contract-uninsured-${c.id}`,
              contractId: c.id,
              text: language === 'fr'
                ? `Le contrat actif pour ${c.machineName} avec ${c.clientCompany} n'a aucune garantie d'assurance spécifiée.`
                : `The active contract for ${c.machineName} with ${c.clientCompany} has no insurance option configured.`,
              severity: 'critical',
              category: 'contrat',
              actionText: language === 'fr' ? "Sécuriser le contrat" : "Secure contract",
              actionScreen: "Gestion des Contrats - DEL-web"
            });
          } else {
            strengths.push({
              id: `contract-secured-${c.id}`,
              text: language === 'fr'
                ? `Contrat actif sécurisé par '${c.insuranceOption}' (${c.clientCompany} pour ${c.machineName}).`
                : `Active contract secured by '${c.insuranceOption}' (${c.clientCompany} for ${c.machineName}).`,
              category: 'contrat'
            });
          }
        }
      }
    });

    return {
      score: Math.max(0, Math.min(100, score)),
      strengths,
      risks
    };
  }, [ownerMachines, documents, contracts, language]);

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'}`} id={isPersonalized ? "screen-dashboard-prop-personalized" : "screen-dashboard-prop-general"}>
      {/* Upper Welcome Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 transition-colors ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              Compte Premium DEL
            </span>
            <span className="text-xs text-gray-400">• ID: {user.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className={`font-sans text-2xl font-black transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
              {isPersonalized 
                ? `Bonjour, ${user.fullName} 👋` 
                : "Suivi Général de Flotte d'Engins"
              }
            </h1>
            {criticalNotifications.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white animate-pulse shadow-sm shadow-rose-600/20" id="critical-maint-badge-title">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                {criticalNotifications.length} critique{criticalNotifications.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className={`text-xs transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {isPersonalized
              ? `Vue d'ensemble personnalisée pour Mercier Levage.`
              : "Supervision globale du parc d'engins lourds de chantier."
            }
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
              theme === 'dark'
                ? 'border-gray-800 bg-gray-900 text-amber-400 hover:bg-gray-800'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            id="theme-toggle-btn"
            title="Basculer le thème"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-600" />
                <span>Mode Sombre</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('Calendrier de Maintenance Global - DEL-web')}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
              theme === 'dark' 
                ? 'border-gray-800 bg-gray-900 text-gray-200 hover:bg-gray-800' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
            id="btn-calendar"
          >
            <Calendar className="h-4 w-4 text-amber-500" />
            Calendrier
          </button>
          <button
            onClick={() => onNavigate('Déposer un Engin - DEL-web')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-md shadow-amber-500/10 hover:bg-amber-400 transition-all cursor-pointer"
            id="btn-add-machine"
          >
            <PlusCircle className="h-4 w-4" />
            Enregistrer un Engin
          </button>
        </div>
      </div>

      {/* Notifications de Maintenance Critique (Under 7 days / Overdue) */}
      {visibleNotifications.length > 0 && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm space-y-4" id="maint-critical-notifications">
          <div className="flex items-center justify-between border-b border-rose-100/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="h-5 w-5 text-rose-600 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                </span>
              </div>
              <div>
                <h3 className="font-sans text-sm font-extrabold text-gray-950">
                  Alertes de Maintenance Critiques (&lt; 7 jours)
                </h3>
                <p className="text-[11px] font-medium text-rose-700">
                  {visibleNotifications.length} engin{visibleNotifications.length > 1 ? 's requièrent' : ' requiert'} une attention immédiate (échéance ou retard de maintenance)
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissedNotifs(criticalNotifications.map(n => n.id))}
              className="text-[11px] font-bold text-rose-700 hover:text-rose-900 transition-colors cursor-pointer"
            >
              Tout masquer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {visibleNotifications.map((notif) => {
                const isOverdue = notif.type === 'overdue';
                return (
                  <motion.div
                    layout
                    key={notif.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`relative rounded-xl border p-4 flex flex-col justify-between gap-3 shadow-xs bg-white transition-all ${
                      isOverdue
                        ? 'border-l-4 border-l-rose-500 border-gray-200 hover:border-gray-300'
                        : 'border-l-4 border-l-amber-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Dismiss Button */}
                    <button
                      onClick={() => setDismissedNotifs(prev => [...prev, notif.id])}
                      className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                      title="Masquer l'alerte"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isOverdue 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isOverdue 
                            ? `EN RETARD (${Math.abs(notif.daysLeft)}j)` 
                            : notif.daysLeft === 0 
                              ? "AUJOURD'HUI" 
                              : notif.daysLeft === 1 
                                ? 'DEMAIN' 
                                : `J-${notif.daysLeft}`
                          }
                        </span>
                        <h4 className="text-xs font-black text-gray-950">
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {notif.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-[10px] font-semibold text-gray-400">
                        Date limite : {notif.dueDate}
                      </span>
                      <button
                        onClick={() => onNavigate('Liste Détaillée de Maintenance - DEL-web')}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold shadow-xs transition-all cursor-pointer ${
                          isOverdue
                            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/10'
                            : 'bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-sm shadow-amber-500/10'
                        }`}
                      >
                        Gérer l'entretien
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Success banner if all critical maintenance notices are resolved */}
      {criticalNotifications.length > 0 && visibleNotifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Toutes les alertes de maintenance sont traitées</h4>
              <p className="text-xs text-gray-500">Aucun entretien critique n'est en attente d'action immédiate sous 7 jours.</p>
            </div>
          </div>
          <button
            onClick={() => setDismissedNotifs([])}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
          >
            Réinitialiser les alertes
          </button>
        </motion.div>
      )}

      {/* AlertPanel of simulated emails */}
      <AlertPanel 
        emails={simulatedEmails} 
        onMarkAsRead={onMarkEmailAsRead} 
        onNavigate={onNavigate} 
      />

      {/* Primary KPI Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Parc d'Engins</span>
            <div className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 p-2 text-amber-600'}`}>
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className={`font-sans text-3xl font-extrabold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{totalEnginesCount}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                {availableCount} Disponibles
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                {rentedCount} En cours de loc.
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Taux de Disponibilité</span>
            <div className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 p-2 text-blue-600'}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className={`font-sans text-3xl font-extrabold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{availabilityRate}%</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`h-2 w-24 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="h-full bg-emerald-500" style={{ width: `${availabilityRate}%` }} />
              </div>
              <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Objectif: 90%</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Revenu Estimé (Mensuel)</span>
            <div className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 p-2 text-emerald-600'}`}>
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className={`font-sans text-3xl font-extrabold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{(monthlyRevenue).toLocaleString('fr-FR')} €</h3>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-semibold">
              <span className="text-emerald-600 font-bold">↑ 12%</span> par rapport au mois dernier
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Alertes de Maintenance</span>
            <div className={`relative rounded-lg p-2 ${theme === 'dark' ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
              <ShieldAlert className="h-4 w-4" />
              {criticalNotifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white animate-pulse" id="critical-maint-badge-icon">
                  {criticalNotifications.length}
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className={`font-sans text-3xl font-extrabold transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{activeAlerts.length}</h3>
            <p className="text-[10px] text-rose-600 mt-1 font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              {activeAlerts.length > 0 ? "Intervention critique requise" : "Aucun problème majeur"}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Dynamic Section: Personalized Smart Tips (Screen 2 Exclusive) */}
      {isPersonalized && (
        <div className={`rounded-2xl border p-4 flex gap-4 items-start ${theme === 'dark' ? 'border-amber-500/20 bg-amber-500/10 text-gray-100' : 'border-amber-500/20 bg-amber-500/5'}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-gray-900'}`}>Conseil d'optimisation DEL-web</h4>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Le taux de location pour les pelles hydrauliques de <span className="font-bold">20 tonnes</span> est en forte hausse de <span className="font-bold text-emerald-500">+18% sur Lyon</span> ce mois-ci. Votre <span className="font-bold">Caterpillar 320 GC</span> est actuellement disponible au dépôt. Nous vous conseillons de répondre à l'Appel d'Offres d'Eiffage pour optimiser vos revenus.
            </p>
            <button 
              onClick={() => onNavigate('Appels d\'Offres - DEL-web')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline mt-1 cursor-pointer"
            >
              Voir les Appels d'Offres correspondants <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Security and Compliance Score Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`rounded-2xl border p-6 shadow-sm space-y-6 transition-colors duration-300 ${
          theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'
        }`}
        id="widget-security-compliance-score"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${
              securityCompliance.score >= 85 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : securityCompliance.score >= 60 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'bg-rose-500/10 text-rose-500'
            }`}>
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className={`font-sans text-lg font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('owner.security.title')}
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('owner.security.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
              securityCompliance.score >= 85 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : securityCompliance.score >= 60 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              {securityCompliance.score >= 85 
                ? (language === 'fr' ? 'Excellent' : 'Excellent') 
                : securityCompliance.score >= 60 
                  ? (language === 'fr' ? 'Vigilance Requise' : 'Attention Required') 
                  : (language === 'fr' ? 'Risque Critique' : 'Critical Risk')
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Circular Progress Meter */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/40 dark:bg-gray-800/10 border border-gray-100/50 dark:border-gray-800/30">
            <span className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('owner.security.score_label')}
            </span>
            
            <div className="relative flex items-center justify-center h-36 w-36">
              {/* SVG Circular Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-gray-100 dark:stroke-gray-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className={`transition-all duration-1000 ease-out ${
                    securityCompliance.score >= 85 
                      ? 'stroke-emerald-500' 
                      : securityCompliance.score >= 60 
                        ? 'stroke-amber-500' 
                        : 'stroke-rose-500'
                  }`}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * securityCompliance.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              {/* Dynamic Center Score Text */}
              <div className="absolute text-center">
                <span className="text-4xl font-black tracking-tight block">
                  {securityCompliance.score}
                </span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                  / 100 PTS
                </span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-center text-gray-500 dark:text-gray-400 mt-4 px-2">
              {t('owner.security.score_desc')}
            </p>
          </div>

          {/* Right Column: Interactive Tabbed Alerts & Achievements */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tabs Trigger */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 p-0.5 gap-1 bg-gray-50 dark:bg-gray-900/60 rounded-xl">
              <button
                onClick={() => setSecurityTab('risks')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  securityTab === 'risks'
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <AlertCircle className={`h-4 w-4 ${securityCompliance.risks.length > 0 ? 'text-rose-500' : 'text-gray-400'}`} />
                {t('owner.security.weaknesses')}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  securityCompliance.risks.length > 0 
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                }`}>
                  {securityCompliance.risks.length}
                </span>
              </button>
              <button
                onClick={() => setSecurityTab('strengths')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  securityTab === 'strengths'
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                {t('owner.security.strengths')}
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {securityCompliance.strengths.length}
                </span>
              </button>
            </div>

            {/* Tab content 1: Risks and Actions */}
            <AnimatePresence mode="wait">
              {securityTab === 'risks' && (
                <motion.div
                  key="risks-panel"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  {securityCompliance.risks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                      <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 animate-bounce">
                        <ShieldCheck className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {language === 'fr' ? "Félicitations ! Votre conformité est totale" : "Congratulations! Fully Compliant"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                          {language === 'fr' 
                            ? "Tous vos engins possèdent des VGP valides, des cartes grises enregistrées et des contrats entièrement assurés."
                            : "All your machinery have valid VGPs, registration cards uploaded, and fully insured active contracts."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {securityCompliance.risks.map((risk) => (
                        <div 
                          key={risk.id}
                          className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            risk.severity === 'critical'
                              ? theme === 'dark' 
                                ? 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10' 
                                : 'border-rose-100 bg-rose-50/30 hover:bg-rose-50/50'
                              : theme === 'dark'
                                ? 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
                                : 'border-amber-100 bg-amber-50/30 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg p-1.5 mt-0.5 shrink-0 ${
                              risk.severity === 'critical' 
                                ? 'bg-rose-500/15 text-rose-500' 
                                : 'bg-amber-500/15 text-amber-500'
                            }`}>
                              <AlertTriangle className="h-4 w-4 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-relaxed text-gray-900 dark:text-white">
                                {risk.text}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                <span>•</span>
                                <span>
                                  {risk.category === 'vgp' 
                                    ? (language === 'fr' ? 'Réglementation VGP obligatoire' : 'Mandatory VGP Inspection')
                                    : risk.category === 'cartegrise'
                                      ? (language === 'fr' ? 'Pièce administrative d\'identité' : 'Official registration file')
                                      : (language === 'fr' ? 'Garantie contractuelle d\'assurance' : 'Contractual insurance warranty')
                                  }
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => onNavigate(risk.actionScreen)}
                            className={`shrink-0 self-start sm:self-center px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              risk.severity === 'critical'
                                ? 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-[1.02]'
                                : 'bg-amber-500 text-white hover:bg-amber-600 hover:scale-[1.02]'
                            }`}
                          >
                            <span>{risk.actionText}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab content 2: Strengths */}
              {securityTab === 'strengths' && (
                <motion.div
                  key="strengths-panel"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 max-h-[260px] overflow-y-auto pr-1"
                >
                  {securityCompliance.strengths.map((str) => (
                    <div 
                      key={str.id}
                      className={`rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                        theme === 'dark' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' 
                          : 'border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/40'
                      }`}
                    >
                      <div className="rounded-full bg-emerald-100 dark:bg-emerald-500/20 p-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                          {str.text}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {str.category === 'vgp' 
                            ? (language === 'fr' ? 'VGP conforme J-180' : 'VGP compliant J-180')
                            : str.category === 'cartegrise'
                              ? (language === 'fr' ? 'Archivage cloud sécurisé' : 'Secure cloud archiving')
                              : str.category === 'assurance'
                                ? (language === 'fr' ? 'Garantie RC & Bris Active' : 'Active third-party & machinery damage policy')
                                : (language === 'fr' ? 'Contrat sécurisé' : 'Contract secure')
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Profitability Simulator */}
      <div className={`rounded-2xl border p-6 shadow-sm space-y-6 transition-colors duration-300 ${
        theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className={`font-sans text-lg font-extrabold flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Sliders className="h-5 w-5 text-amber-500 animate-pulse" />
              {t('owner.sim.title')}
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('owner.sim.subtitle')}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
            <TrendingUp className="h-3.5 w-3.5" />
            {language === 'fr' ? `Flotte Active : ${totalEnginesCount} machines` : `Active Fleet: ${totalEnginesCount} units`}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Controls Panel (4 columns) */}
          <div className="xl:col-span-4 space-y-5 rounded-xl bg-gray-50/50 p-4 border border-gray-100/50 dark:bg-gray-800/30 dark:border-gray-800/50">
            {/* Target Utilization */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('owner.sim.utilization')}
                </span>
                <span className="text-amber-500 font-extrabold">{targetUtilization}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={targetUtilization}
                onChange={(e) => setTargetUtilization(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Billable Days per Year */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('owner.sim.active_days')}
                </span>
                <span className="text-amber-500 font-extrabold">{rentalDaysYear} {language === 'fr' ? 'jours' : 'days'}</span>
              </div>
              <input
                type="range"
                min="50"
                max="365"
                step="5"
                value={rentalDaysYear}
                onChange={(e) => setRentalDaysYear(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>50 {language === 'fr' ? 'j' : 'd'}</span>
                <span>220 {language === 'fr' ? 'j (Moyenne)' : 'd (Average)'}</span>
                <span>365 {language === 'fr' ? 'j' : 'd'}</span>
              </div>
            </div>

            {/* Projected Average Annual Maintenance Cost per machine */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('owner.sim.maint_cost')}
                </span>
                <span className="text-amber-500 font-extrabold">{(avgMaintCost).toLocaleString('fr-FR')} €</span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={avgMaintCost}
                onChange={(e) => setAvgMaintCost(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>500 €</span>
                <span>5 000 €</span>
                <span>15 000 €</span>
              </div>
            </div>

            <div className="rounded-lg bg-amber-500/5 p-3 flex gap-2 border border-amber-500/10 text-[11px] text-gray-500 dark:text-gray-300 leading-relaxed">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {language === 'fr' 
                  ? `Calculs indexés sur le coût journalier réel de vos engins enregistrés (${totalFleetDailyValue} €/jour cumulé).`
                  : `Calculations based on the actual daily rates of your registered fleet (${totalFleetDailyValue} €/day total).`
                }
              </span>
            </div>
          </div>

          {/* KPI Output Panel (4 columns) */}
          <div className="xl:col-span-4 space-y-4">
            {/* KPI 1: Gross revenue */}
            <div className={`rounded-xl border p-4 transition-all duration-300 ${
              theme === 'dark' ? 'border-gray-800 bg-gray-800/30' : 'border-gray-150 bg-gray-50/50'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('owner.sim.projected_gross')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-lg font-extrabold">
                  {(Math.round(projectedGrossRevenue)).toLocaleString('fr-FR')} €
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold">/ {language === 'fr' ? 'an' : 'year'}</span>
              </div>
            </div>

            {/* KPI 2: Maintenance Cost */}
            <div className={`rounded-xl border p-4 transition-all duration-300 ${
              theme === 'dark' ? 'border-gray-800 bg-gray-800/30' : 'border-gray-150 bg-gray-50/50'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('owner.sim.projected_maint')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-lg font-extrabold text-rose-500">
                  - {(Math.round(projectedMaintenanceCosts)).toLocaleString('fr-FR')} €
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold">/ {language === 'fr' ? 'an' : 'year'}</span>
              </div>
            </div>

            {/* KPI 3: Net Profit */}
            <div className={`rounded-xl border-2 p-4 transition-all duration-300 ${
              theme === 'dark' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/20'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {t('owner.sim.net_profit')}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-2xl font-black text-emerald-500">
                  {(Math.round(estimatedNetProfit)).toLocaleString('fr-FR')} €
                </h4>
                <span className="text-xs text-emerald-500 font-bold">/ {language === 'fr' ? 'an' : 'year'}</span>
              </div>
            </div>

            {/* Profitability Margin Gauge */}
            <div className="space-y-1.5 px-1">
              <div className="flex justify-between text-xs font-bold">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {t('owner.sim.roi_label')}
                </span>
                <span className="text-emerald-500 font-extrabold">{profitabilityMargin}%</span>
              </div>
              <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full transition-all duration-500 ${
                    profitabilityMargin > 50 ? 'bg-emerald-500' : profitabilityMargin > 25 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} 
                  style={{ width: `${profitabilityMargin}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Line Chart Panel (4 columns) */}
          <div className={`xl:col-span-4 rounded-xl border p-4 space-y-4 ${
            theme === 'dark' ? 'border-gray-800 bg-gray-800/10' : 'border-gray-150 bg-white'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('owner.sim.chart_title')}
            </h4>
            <div className="h-[210px] w-full" id="simulator-chart-recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={simulatorChartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1f2937' : '#f3f4f6'} />
                  <XAxis 
                    dataKey="quarter" 
                    stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} 
                    fontSize={10}
                    fontWeight="700"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} 
                    fontSize={9}
                    fontWeight="600"
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111827' : '#ffffff', 
                      borderRadius: '12px', 
                      border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '11px',
                      color: theme === 'dark' ? '#f3f4f6' : '#111827'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    itemStyle={{ fontWeight: 'semibold' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    name={language === 'fr' ? 'Revenu' : 'Revenue'}
                    stroke="#d97706"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Maintenance"
                    name="Maint."
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Profit"
                    name="Net"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Fleet Status & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Fleet Machines Status List */}
        <div className={`lg:col-span-8 rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
            <div>
              <h3 className={`font-sans text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>État Opérationnel de Vos Engins</h3>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Supervision en direct de vos machines</p>
            </div>
            <button
              onClick={() => onNavigate('Liste des Engins - DEL-web')}
              className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {ownerMachines.slice(0, 4).map((machine) => (
              <div 
                key={machine.id} 
                onClick={() => onNavigate(`Détail de l'Engin avec Historique d'Entretien - DEL-web` /* Navigate to details of engine */)}
                className={`flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={machine.imageUrl} 
                    alt={machine.brand} 
                    className="h-10 w-12 rounded-lg object-cover bg-gray-100 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{machine.brand} {machine.model}</h4>
                    <div className={`flex items-center gap-2 mt-0.5 text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{machine.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3 text-gray-400" /> {machine.hourCounter} h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Location badge */}
                  <div className="text-right hidden sm:block">
                    <p className={`text-[10px] font-semibold flex items-center gap-0.5 justify-end ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                      {machine.location.split(' - ')[0]}
                    </p>
                    <p className="text-[9px] text-gray-400">{machine.category}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    machine.status === 'available'
                      ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                      : machine.status === 'rented'
                      ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                      : theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {machine.status === 'available' ? 'Disponible' : machine.status === 'rented' ? 'Loué' : 'Maintenance'}
                  </span>

                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Urgences de Maintenance & Contrats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Urgent Maintenance alert panel */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              <div>
                <h3 className={`font-sans text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Échéances de Maintenance</h3>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Prochaines interventions requises</p>
              </div>
              <button
                onClick={() => onNavigate('Liste Détaillée de Maintenance - DEL-web')}
                className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
              >
                Gérer
              </button>
            </div>

            <div className="space-y-3">
              {maintenanceLogs.filter(log => log.status !== 'Terminé').slice(0, 3).map((log) => (
                <div key={log.id} className={`rounded-xl border p-3.5 space-y-2 transition-colors ${theme === 'dark' ? 'border-gray-800 bg-gray-800/40' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      log.status === 'En cours'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {log.status}
                    </span>
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{log.date}</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{log.machineName} {log.machineModel}</h4>
                    <p className={`text-[11px] truncate mt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{log.type} : {log.description}</p>
                  </div>
                  <div className={`flex items-center justify-between text-[10px] border-t pt-2 mt-2 ${theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-gray-400 border-gray-200/60'}`}>
                    <span>Tech: {log.technician}</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{log.cost} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links shortcuts */}
          <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 text-white' : 'border-gray-100 bg-white'}`}>
            <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Accès Rapide Portails</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('Coffre-fort Documents - DEL-web')}
                className={`rounded-xl border p-3 text-center transition-all ${
                  theme === 'dark' 
                    ? 'border-gray-800 bg-gray-800/40 hover:bg-amber-500/10 hover:border-amber-500/30' 
                    : 'border-gray-100 bg-gray-50 hover:bg-amber-50'
                }`}
              >
                <FileCheck2 className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
                <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Documents Safe</span>
              </button>
              <button
                onClick={() => onNavigate('Factures - DEL-web')}
                className={`rounded-xl border p-3 text-center transition-all ${
                  theme === 'dark' 
                    ? 'border-gray-800 bg-gray-800/40 hover:bg-amber-500/10 hover:border-amber-500/30' 
                    : 'border-gray-100 bg-gray-50 hover:bg-amber-50'
                }`}
              >
                <DollarSign className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
                <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Factures</span>
              </button>
              <button
                onClick={() => onNavigate('Propositions - DEL-web')}
                className={`rounded-xl border p-3 text-center transition-all ${
                  theme === 'dark' 
                    ? 'border-gray-800 bg-gray-800/40 hover:bg-amber-500/10 hover:border-amber-500/30' 
                    : 'border-gray-100 bg-gray-50 hover:bg-amber-50'
                }`}
              >
                <FileCheck2 className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
                <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Nos Devis</span>
              </button>
              <button
                onClick={() => onNavigate('Gestion des Contrats - DEL-web')}
                className={`rounded-xl border p-3 text-center transition-all ${
                  theme === 'dark' 
                    ? 'border-gray-800 bg-gray-800/40 hover:bg-amber-500/10 hover:border-amber-500/30' 
                    : 'border-gray-100 bg-gray-50 hover:bg-amber-50'
                }`}
              >
                <Clock className="h-5 w-5 text-amber-500 mx-auto mb-1.5" />
                <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Contrats</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
