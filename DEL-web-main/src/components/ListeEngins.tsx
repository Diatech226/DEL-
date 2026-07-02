import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Layers, 
  Sliders, 
  ChevronRight,
  Sparkles,
  Plus,
  Compass
} from 'lucide-react';
import { Machine } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ListeEnginsProps {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
  onNavigate: (screen: string) => void;
}

export default function ListeEngins({ machines, onSelectMachine, onNavigate }: ListeEnginsProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filteredMachines = machines.filter(m => {
    const statusLabel = m.status === 'available' ? 'disponible' : m.status === 'rented' ? 'loué' : 'maintenance';
    const matchesSearch = m.brand.toLowerCase().includes(search.toLowerCase()) || 
                          m.model.toLowerCase().includes(search.toLowerCase()) ||
                          m.type.toLowerCase().includes(search.toLowerCase()) ||
                          m.location.toLowerCase().includes(search.toLowerCase()) ||
                          statusLabel.includes(search.toLowerCase()) ||
                          (search.toLowerCase() === 'libre' && m.status === 'available') ||
                          (search.toLowerCase() === 'dispo' && m.status === 'available');
    const matchesCat = categoryFilter === 'Tous' || m.category === categoryFilter;
    const matchesStatus = statusFilter === 'Tous' || m.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const categories = ['Tous', 'Terrassement', 'Levage', 'Route', 'Manutention'];

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('Tous');
    setStatusFilter('Tous');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-liste-engins">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">{t('catalog.title')}</h1>
          <p className="text-xs text-gray-500">{t('catalog.subtitle')}</p>
        </div>

        <button
          onClick={() => onNavigate('Déposer un Engin - DEL-web')}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          {t('catalog.register_btn')}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalog.search_placeholder')}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 px-2 uppercase">{t('catalog.category_filter')}:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                  categoryFilter === cat ? 'bg-amber-500 text-gray-950' : 'text-gray-500 hover:text-gray-950'
                }`}
              >
                {t(`cat.${cat}`)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 px-2 uppercase">{t('catalog.status_filter')}:</span>
            {['Tous', 'available', 'rented', 'maintenance'].map((st) => {
              const label = st === 'Tous' 
                ? t('catalog.all') 
                : st === 'available' 
                  ? (t('catalog.available') === 'Disponible' ? 'Dispo' : 'Avail.') 
                  : st === 'rented' 
                    ? (t('catalog.rented') === 'Loué' ? 'Loué' : 'Rented') 
                    : 'Maint.';
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-amber-500 text-gray-950' : 'text-gray-500 hover:text-gray-950'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* Grid of Machines */}
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => {
            return (
              <div 
                key={machine.id}
                onClick={() => onSelectMachine(machine)}
                className="group rounded-2xl border border-gray-150 bg-white shadow-sm overflow-hidden hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image panel */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={machine.imageUrl} 
                      alt={`${machine.brand} ${machine.model}`} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category overlay */}
                    <span className="absolute top-4 left-4 rounded-full bg-gray-950/80 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
                      {t(`cat.${machine.category}`)}
                    </span>

                    {/* Status Overlay */}
                    <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm ${
                      machine.status === 'available'
                        ? 'bg-emerald-500'
                        : machine.status === 'rented'
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                    }`}>
                      {machine.status === 'available' ? t('catalog.available') : machine.status === 'rented' ? t('catalog.rented') : t('catalog.maintenance')}
                    </span>
                  </div>

                  {/* Content details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans text-sm font-black text-gray-900">{machine.brand} {machine.model}</h3>
                      <span className="text-xs font-black text-amber-500">{machine.dailyPrice} {t('catalog.price_per_day')}</span>
                    </div>

                    <p className="text-[11px] text-gray-500 font-semibold">{machine.type}</p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-2 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" /> {machine.hourCounter} h
                      </span>
                      <span className="flex items-center gap-1 justify-end">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" /> {machine.location.split(' - ')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer action button */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-amber-50/20 transition-all">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('catalog.view_tech_sheet')}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-sm font-bold text-gray-900">{t('catalog.empty_title')}</h3>
            <p className="text-xs text-gray-500">
              {t('catalog.empty_desc')}
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            {t('catalog.reset')}
          </button>
        </div>
      )}
    </div>
  );
}
