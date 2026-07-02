import React from 'react';
import { 
  Sliders, 
  Wrench, 
  Calendar, 
  Layers, 
  FileCheck, 
  FileText, 
  ShieldAlert, 
  FolderLock, 
  HelpCircle,
  Briefcase,
  Search,
  PlusCircle,
  Truck,
  Building,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeScreen: string;
  activeRole: 'proprietaire' | 'locataire';
  onNavigate: (screen: string) => void;
}

export default function Sidebar({ activeScreen, activeRole, onNavigate }: SidebarProps) {
  const { t } = useLanguage();
  
  const ownerMenuItems = [
    { 
      name: "Dashboard Personnalisé", 
      key: "sidebar.owner_personalized",
      screen: "Dashboard Propriétaire Personnalisé - DEL-web", 
      icon: Sliders 
    },
    { 
      name: "Dashboard Flotte (Général)", 
      key: "sidebar.owner_general",
      screen: "Dashboard Propriétaire - DEL-web", 
      icon: Building 
    },
    { 
      name: "Ma Flotte d'Engins", 
      key: "sidebar.owner_fleet",
      screen: "Liste des Engins - DEL-web", 
      icon: Layers 
    },
    { 
      name: "Maintenance & VGP", 
      key: "sidebar.owner_maintenance",
      screen: "Liste Détaillée de Maintenance - DEL-web", 
      icon: Wrench 
    },
    { 
      name: "Calendrier de Maintenance", 
      key: "sidebar.owner_calendar",
      screen: "Calendrier de Maintenance Global - DEL-web", 
      icon: Calendar 
    },
    { 
      name: "Contrats de Location", 
      key: "sidebar.owner_contracts",
      screen: "Gestion des Contrats - DEL-web", 
      icon: FileCheck 
    },
    { 
      name: "Propositions & Devis", 
      key: "sidebar.owner_proposals",
      screen: "Propositions - DEL-web", 
      icon: FileText 
    },
    { 
      name: "Appels d'Offres Publics", 
      key: "sidebar.owner_tenders",
      screen: "Appels d'Offres - DEL-web", 
      icon: ShieldAlert 
    },
    { 
      name: "Déposer / Enregistrer Engin", 
      key: "sidebar.owner_register",
      screen: "Déposer un Engin - DEL-web", 
      icon: PlusCircle,
      highlight: true
    },
    { 
      name: "Coffre-fort Documents", 
      key: "sidebar.owner_safe",
      screen: "Coffre-fort Documents - DEL-web", 
      icon: FolderLock 
    },
    { 
      name: "Mes Factures", 
      key: "sidebar.owner_invoices",
      screen: "Factures - DEL-web", 
      icon: DollarSign 
    }
  ];

  const renterMenuItems = [
    { 
      name: "Dashboard Entreprise", 
      key: "sidebar.renter_dashboard",
      screen: "Dashboard Entreprise - DEL-web", 
      icon: Building 
    },
    { 
      name: "Rechercher un Engin", 
      key: "sidebar.renter_search",
      screen: "Liste des Engins - DEL-web", 
      icon: Search 
    },
    { 
      name: "Publier un Appel d'Offres", 
      key: "sidebar.renter_publish",
      screen: "Demander des Engins - DEL-web", 
      icon: PlusCircle,
      highlight: true
    },
    { 
      name: "Suivi des Missions", 
      key: "sidebar.renter_missions",
      screen: "Suivi des Missions - DEL-web", 
      icon: Truck 
    },
    { 
      name: "Gestion des Contrats", 
      key: "sidebar.renter_contracts",
      screen: "Gestion des Contrats - DEL-web", 
      icon: FileCheck 
    },
    { 
      name: "Nos Propositions Reçues", 
      key: "sidebar.renter_proposals",
      screen: "Propositions - DEL-web", 
      icon: FileText 
    },
    { 
      name: "Coffre-fort Documents", 
      key: "sidebar.renter_safe",
      screen: "Coffre-fort Documents - DEL-web", 
      icon: FolderLock 
    },
    { 
      name: "Factures & Budgets", 
      key: "sidebar.renter_invoices",
      screen: "Factures - DEL-web", 
      icon: DollarSign 
    }
  ];

  const items = activeRole === 'proprietaire' ? ownerMenuItems : renterMenuItems;

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-100 bg-white p-4 md:flex shrink-0" id="del-sidebar">
      {/* Scrollable menu content */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          {activeRole === 'proprietaire' ? t('sidebar.owner_menu_title') : t('sidebar.renter_menu_title')}
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? item.highlight 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-amber-50 text-amber-900 border-l-4 border-amber-500 rounded-l-none'
                  : item.highlight
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 border-dashed'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive && !item.highlight ? 'text-amber-600' : ''}`} />
              <span className="truncate text-left">{t(item.key)}</span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto border-t border-gray-100 pt-4">
        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <p className="text-[11px] font-bold text-gray-900">{t('sidebar.support_title')}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{t('sidebar.support_hours')}</p>
          <a href="tel:+33472402020" className="inline-block mt-2 text-[10px] font-bold text-amber-600 hover:underline">
            +33 4 72 40 20 20
          </a>
        </div>
      </div>
    </aside>
  );
}

