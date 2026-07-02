import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter,
  List
} from 'lucide-react';
import { MaintenanceLog, Machine } from '../types';

interface CalendrierMaintenanceProps {
  logs: MaintenanceLog[];
  machines: Machine[];
  onNavigate: (screen: string) => void;
}

export default function CalendrierMaintenance({ logs, machines, onNavigate }: CalendrierMaintenanceProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  // Days in July 2026
  const daysInMonth = 31;
  const startDayOffset = 2; // July 2026 starts on Wednesday (offset of 2 if Sun=0, Mon=1, Tue=2, Wed=3. In France, Monday is first day. July 1st, 2026 is a Wednesday, so offset is 2 days from Monday)
  
  const getDaysArray = () => {
    const arr = [];
    // Pad with empty days for offset
    for (let i = 0; i < startDayOffset; i++) {
      arr.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push(i);
    }
    return arr;
  };

  const getLogForDay = (day: number) => {
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    return logs.filter(log => log.date === dateStr);
  };

  const categories = ['Tous', 'Préventif', 'Curatif', 'VGP Réglementaire', 'Vidange'];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-calendrier-maintenance">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Calendrier de Maintenance Global</h1>
          <p className="text-xs text-gray-500">Planification des visites techniques réglementaires (VGP) et entretiens de votre flotte.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* List View button required by the Navigation Spec */}
          <button
            onClick={() => onNavigate('Liste Détaillée de Maintenance - DEL-web')}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
            id="btn-list-view"
          >
            <List className="h-4 w-4 text-amber-500" />
            List View
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-gray-950'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-indigo-500" /> VGP Réglementaire
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-amber-500" /> Curatif
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Préventif / Vidange
          </span>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Month Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-amber-500" />
            <h3 className="font-sans text-base font-extrabold text-gray-900">Juillet 2026</h3>
          </div>

          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <button className="rounded p-1.5 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold px-2">Aujourd'hui</span>
            <button className="rounded p-1.5 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 border-b border-gray-100 pb-2 mb-2">
          <span>LUN</span>
          <span>MAR</span>
          <span>MER</span>
          <span>JEU</span>
          <span>VEN</span>
          <span>SAM</span>
          <span>DIM</span>
        </div>

        {/* Calendar days cells */}
        <div className="grid grid-cols-7 gap-2 auto-rows-[110px]">
          {getDaysArray().map((day, idx) => {
            const hasDay = day !== null;
            const isToday = day === 2; // July 2nd, 2026 in metadata
            const dayLogs = hasDay ? getLogForDay(day) : [];
            const filteredLogs = dayLogs.filter(l => selectedCategory === 'Tous' || l.type === selectedCategory);

            return (
              <div 
                key={idx} 
                className={`relative rounded-xl border p-2 flex flex-col justify-between transition-all ${
                  hasDay 
                    ? isToday 
                      ? 'border-amber-500 bg-amber-50/10 shadow-sm ring-1 ring-amber-500/30' 
                      : 'border-gray-100 bg-white hover:border-amber-300' 
                    : 'border-transparent bg-gray-50/30'
                }`}
              >
                {/* Day number */}
                {hasDay && (
                  <span className={`text-xs font-bold ${
                    isToday ? 'h-6 w-6 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center font-black' : 'text-gray-500'
                  }`}>
                    {day}
                  </span>
                )}

                {/* Event previews */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[70px] pr-1">
                  {filteredLogs.map((log) => {
                    let colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    if (log.type === 'VGP Réglementaire') colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
                    if (log.type === 'Curatif') colorClass = "bg-rose-50 text-rose-800 border-rose-200";
                    if (log.type === 'Vidange') colorClass = "bg-amber-50 text-amber-800 border-amber-200";

                    return (
                      <div 
                        key={log.id} 
                        onClick={() => onNavigate('Liste Détaillée de Maintenance - DEL-web')}
                        className={`rounded border px-1.5 py-0.5 text-[9px] font-bold leading-tight cursor-pointer truncate ${colorClass}`}
                        title={`${log.machineName}: ${log.type}`}
                      >
                        {log.machineName} - {log.type.split(' ')[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
