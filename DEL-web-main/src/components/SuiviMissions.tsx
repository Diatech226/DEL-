import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Fuel, 
  Clock, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Mission } from '../types';

interface SuiviMissionsProps {
  missions: Mission[];
  onNavigate: (screen: string) => void;
}

export default function SuiviMissions({ missions, onNavigate }: SuiviMissionsProps) {
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id || '');

  const activeMission = missions.find(m => m.id === selectedMissionId) || missions[0];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-suivi-missions">
      {/* Title */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Suivi Logistique des Missions en Cours</h1>
        <p className="text-xs text-gray-500">Supervision géolocalisée et télémétrique de vos engins lourds en mission sur les chantiers partenaires.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Mission list cards */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Engins en Activité</p>
          {missions.map((m) => {
            const isSelected = m.id === selectedMissionId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMissionId(m.id)}
                className={`rounded-2xl border p-4 shadow-sm cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' 
                    : 'border-gray-150 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                    m.status === 'Sur site' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {m.status}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Réf : {m.id}</span>
                </div>
                <h3 className="font-sans text-xs font-black text-gray-950">{m.machineName} {m.machineModel}</h3>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {m.location.split(' (')[0]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Active Mission Map / Live telemetry */}
        <div className="lg:col-span-8 space-y-6">
          {activeMission ? (
            <div className="space-y-6">
              
              {/* Simulated Map Container using pure, styled HTML/CSS */}
              <div className="rounded-2xl border border-gray-200 bg-gray-950 p-4 shadow-sm h-80 relative overflow-hidden flex flex-col justify-between text-white">
                {/* Background grid representation */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Simulated map graphic/points */}
                <div className="absolute top-1/4 left-1/3 h-24 w-24 rounded-full border border-blue-500/30 animate-ping" />
                <div className="absolute top-1/4 left-1/3 h-4 w-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>

                <div className="absolute top-2/3 right-1/4 h-4 w-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>

                {/* Top Overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="rounded bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-gray-800">
                    Lyon Métropole GPS Live
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                    Signaux Télématiques OK
                  </span>
                </div>

                {/* Bottom Overlay card on the map */}
                <div className="relative z-10 rounded-xl bg-black/95 p-4 border border-gray-800 backdrop-blur-md space-y-2 max-w-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-black text-white">{activeMission.machineName} {activeMission.machineModel}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Position : {activeMission.location}</p>
                </div>
              </div>

              {/* Live telemetry bento cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="rounded-2xl border border-gray-150 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-2 text-amber-600 shrink-0">
                    <Fuel className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase">Jauge GNR</h4>
                    <p className="font-sans text-sm font-black text-gray-950">{activeMission.fuelLevel} %</p>
                    <span className="text-[9px] text-gray-400">Autonomie ok</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-150 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase">Heures d'activité</h4>
                    <p className="font-sans text-sm font-black text-gray-950">{activeMission.hourCounter} h</p>
                    <span className="text-[9px] text-gray-400">Donnée transmise</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-150 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase">Statut Moteur</h4>
                    <p className="font-sans text-sm font-black text-emerald-600">En marche</p>
                    <span className="text-[9px] text-gray-400">Pas de code défaut</span>
                  </div>
                </div>

              </div>

              {/* Site Crew / Site details */}
              <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm space-y-4">
                <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                  Intervenants Chantier & Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-gray-50 p-3.5 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Chauffeur assigné</p>
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      {activeMission.driverName}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {activeMission.operatorContact}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3.5 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Chef de chantier (Maître d'œuvre)</p>
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                      <ShieldCheck className="h-4 w-4 text-gray-400" />
                      {activeMission.siteSupervisor}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              Sélectionnez une mission active pour afficher sa géolocalisation.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
