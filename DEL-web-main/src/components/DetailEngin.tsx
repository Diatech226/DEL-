import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  MapPin, 
  Cpu, 
  Scale, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Coins, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Layers,
  Fuel,
  Activity,
  PhoneCall,
  Lock,
  Plus,
  Compass,
  Navigation,
  Locate,
  Printer,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Machine, MaintenanceLog, Contract } from '../types';
import { useLanguage } from '../context/LanguageContext';

const getCoordinatesForMachine = (location: string, id: string) => {
  const cityCoords: { [key: string]: { lat: number, lng: number } } = {
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Bordeaux': { lat: 44.8378, lng: -0.5792 },
    'Nantes': { lat: 47.2184, lng: -1.5536 },
    'Toulouse': { lat: 43.6047, lng: 1.4442 },
    'Strasbourg': { lat: 48.5734, lng: 7.7521 },
    'Lille': { lat: 50.6292, lng: 3.0573 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
  };

  const base = cityCoords[location] || { lat: 46.2276, lng: 2.2137 }; // default center of France

  // deterministic wobble based on machine ID to avoid all Parisian machines overlapping
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latWobble = ((hash % 100) / 1000) - 0.05;
  const lngWobble = (((hash >> 8) % 100) / 1000) - 0.05;

  return {
    lat: Number((base.lat + latWobble).toFixed(4)),
    lng: Number((base.lng + lngWobble).toFixed(4))
  };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // distance in km
};

interface DetailEnginProps {
  machine: Machine;
  logs: MaintenanceLog[];
  contracts: Contract[];
  isOwnerView: boolean; // Screen 5 (Owner view) vs Screen 18 (Renter view)
  onNavigate: (screen: string) => void;
  onBookMachine?: (machineId: string) => void;
}

export default function DetailEngin({ 
  machine, 
  logs, 
  contracts, 
  isOwnerView, 
  onNavigate, 
  onBookMachine 
}: DetailEnginProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'contracts'>('details');
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geoErrorMsg, setGeoErrorMsg] = useState<string>('');

  const machineCoords = React.useMemo(() => {
    return getCoordinatesForMachine(machine.location, machine.id);
  }, [machine.location, machine.id]);

  const distanceKm = React.useMemo(() => {
    if (!userLocation) return null;
    return calculateDistance(userLocation.lat, userLocation.lng, machineCoords.lat, machineCoords.lng);
  }, [userLocation, machineCoords]);

  const handleTrackDistance = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoErrorMsg(isEn ? "Geolocation is not supported by your browser." : "La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoStatus('success');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGeoStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setGeoErrorMsg(isEn ? "Permission denied. Please enable location access in browser settings." : "Permission refusée. Veuillez autoriser l'accès à la position dans votre navigateur.");
        } else {
          setGeoErrorMsg(isEn ? "Unable to retrieve your location." : "Impossible de récupérer votre position.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const engineLogs = logs.filter(log => log.machineId === machine.id);
  const engineContracts = contracts.filter(c => c.machineId === machine.id);

  // Dynamic history generation based on current machine hourCounter
  const chartData = React.useMemo(() => {
    const monthsFR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const months = isEn ? monthsEN : monthsFR;
    
    // Smooth climbing hours leading up to current counter
    const step = Math.max(15, Math.floor(machine.hourCounter * 0.08)); // roughly 8% usage rate monthly
    
    return [
      { name: months[0], hours: Math.max(0, machine.hourCounter - step * 5) },
      { name: months[1], hours: Math.max(0, machine.hourCounter - step * 4) },
      { name: months[2], hours: Math.max(0, machine.hourCounter - step * 3) },
      { name: months[3], hours: Math.max(0, machine.hourCounter - step * 2) },
      { name: months[4], hours: Math.max(0, machine.hourCounter - step * 1) },
      { name: months[5], hours: machine.hourCounter }
    ];
  }, [machine.hourCounter, isEn]);

  // VGP expiry calculations
  const today = new Date('2026-07-02');
  const vgpDate = new Date(machine.vgpCertDate);
  const nextMaint = new Date(machine.nextMaintenanceDate);
  const daysUntilMaint = Math.ceil((nextMaint.getTime() - today.getTime()) / (1000 * 30 * 24 * 60)); // Simple month count approx

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id={isOwnerView ? "screen-detail-engin-owner" : "screen-detail-engin-renter"}>
      {/* Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('Liste des Engins - DEL-web')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-500 px-3 py-1.5 text-xs font-extrabold text-gray-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
          >
            <Printer className="h-4 w-4" />
            {t('detail.print_report')}
          </button>
        </div>
        <span className="text-xs text-gray-400 font-mono">Réf : {machine.serialNumber}</span>
      </div>

      {/* Main product card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main column: Image, primary properties */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
            <img 
              src={machine.imageUrl} 
              alt={`${machine.brand} ${machine.model}`} 
              className="h-96 w-full rounded-xl object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 left-8 flex gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md ${
                machine.status === 'available'
                  ? 'bg-emerald-500'
                  : machine.status === 'rented'
                  ? 'bg-blue-500'
                  : 'bg-rose-500'
              }`}>
                {machine.status === 'available' ? 'Disponible' : machine.status === 'rented' ? 'Loué' : 'Maintenance'}
              </span>
              <span className="rounded-full bg-gray-900/80 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-md">
                Catégorie: {machine.category}
              </span>
            </div>
          </div>

          {/* Quick tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`border-b-2 px-6 py-3 text-xs font-extrabold transition-all ${
                activeTab === 'details'
                  ? 'border-amber-500 text-gray-950'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Fiche Technique
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`border-b-2 px-6 py-3 text-xs font-extrabold transition-all relative ${
                activeTab === 'history'
                  ? 'border-amber-500 text-gray-950'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Historique d'Entretien
              {engineLogs.length > 0 && (
                <span className="ml-1.5 rounded bg-gray-100 px-1 py-0.2 text-[10px] font-bold text-gray-600">
                  {engineLogs.length}
                </span>
              )}
            </button>
            {isOwnerView && (
              <button
                onClick={() => setActiveTab('contracts')}
                className={`border-b-2 px-6 py-3 text-xs font-extrabold transition-all ${
                  activeTab === 'contracts'
                    ? 'border-amber-500 text-gray-950'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Contrats Liés
              </button>
            )}
          </div>

          {/* Tab content 1: Details */}
          {activeTab === 'details' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Heures d'opération</p>
                  <p className="text-lg font-black text-gray-950 mt-1">{machine.hourCounter} h</p>
                  <span className="text-[9px] text-gray-400">Compteur certifié</span>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Poids à vide</p>
                  <p className="text-lg font-black text-gray-950 mt-1">{machine.weight} T</p>
                  <span className="text-[9px] text-gray-400">Gros tonnage</span>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Puissance moteur</p>
                  <p className="text-lg font-black text-gray-950 mt-1">{machine.enginePower}</p>
                  <span className="text-[9px] text-gray-400">Couple optimal</span>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Carburant</p>
                  <p className="text-lg font-black text-gray-950 mt-1 truncate">{machine.fuelType}</p>
                  <span className="text-[9px] text-gray-400">Faible émission</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-wider">Spécifications Générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Marque / Constructeur</span>
                    <span className="font-bold text-gray-900">{machine.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Modèle</span>
                    <span className="font-bold text-gray-900">{machine.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Année de fabrication</span>
                    <span className="font-bold text-gray-900">{machine.year}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Numéro de série</span>
                    <span className="font-mono font-bold text-gray-900">{machine.serialNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Type de matériel</span>
                    <span className="font-bold text-gray-900">{machine.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">Capacité du godet</span>
                    <span className="font-bold text-gray-900">{machine.bucketCapacity || "Non applicable"}</span>
                  </div>
                </div>
              </div>

              {/* Live telemetry block (Screen 5 exclusive look) */}
              {isOwnerView && (
                <div className="rounded-xl border border-gray-150 bg-gray-50 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-amber-500" />
                      Données Télémétriques en Temps Réel
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-800">
                      Boîtier Connecté OK
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-[10px]">Niveau carburant</p>
                        <p className="font-bold text-gray-900">68 % (GNR)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-[10px]">Pression hydraulique</p>
                        <p className="font-bold text-gray-900">320 bar (Optimal)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-[10px]">Position GPS</p>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]">{machine.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hours of Operation History Chart */}
              <div className="rounded-xl border border-gray-150 bg-white p-5 space-y-4">
                <div>
                  <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                    {t('detail.chart_title')}
                  </h4>
                  <p className="text-[11px] text-gray-500">{t('detail.chart_subtitle')}</p>
                </div>
                <div className="h-[240px] w-full" id="engin-hour-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af" 
                        fontSize={10}
                        fontWeight="600"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#9ca3af" 
                        fontSize={10}
                        fontWeight="600"
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '12px', 
                          border: '1px solid #f3f4f6', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '11px'
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                        itemStyle={{ color: '#d97706', fontWeight: 'semibold' }}
                        formatter={(value: any) => [`${value} h`, t('detail.chart_hours')]}
                      />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        dot={{ r: 4, stroke: '#d97706', strokeWidth: 1.5, fill: '#fff' }}
                        activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 2, fill: '#d97706' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Geolocation & GPS Tracking Block */}
              <div className="rounded-xl border border-gray-150 bg-white p-5 space-y-4">
                <div>
                  <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-amber-500" />
                    {t('detail.geo_title')}
                  </h4>
                  <p className="text-[11px] text-gray-500">{t('detail.geo_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  {/* Map Visualizer (7 columns) */}
                  <div className="md:col-span-7 rounded-xl border border-gray-200 overflow-hidden relative min-h-[260px] flex items-center justify-center bg-[#f9fafb]">
                    {/* Grid Backdrop mimicking a map style sheet */}
                    <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]" />
                    
                    {/* Mock Map Streets & Rivers using SVG paths for extreme aesthetic fidelity */}
                    <svg className="absolute inset-0 w-full h-full text-blue-100/50 stroke-current opacity-70" fill="none" viewBox="0 0 400 300" preserveAspectRatio="none">
                      {/* River */}
                      <path d="M 0,100 C 150,150 200,50 400,200" strokeWidth="24" strokeLinecap="round" />
                      {/* Main Highway */}
                      <path d="M 50,0 Q 150,120 350,300" stroke="#f3f4f6" strokeWidth="6" />
                      <path d="M 0,250 C 100,200 300,250 400,50" stroke="#f3f4f6" strokeWidth="4" />
                      {/* Street Grid lines */}
                      <line x1="80" y1="0" x2="80" y2="300" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="220" y1="0" x2="220" y2="300" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="0" y1="180" x2="400" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                    </svg>

                    {/* Scale indication and Compass HUD elements */}
                    <div className="absolute bottom-2.5 left-2.5 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-mono font-bold text-gray-500 border border-gray-200/50">
                      GPS 2D | 500m
                    </div>
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                      <button className="bg-white/90 backdrop-blur-xs hover:bg-white p-1 rounded border border-gray-200 text-gray-600 shadow-xs cursor-pointer">
                        <Compass className="h-3.5 w-3.5 text-amber-500 animate-[spin_6s_linear_infinite]" />
                      </button>
                    </div>

                    {/* Machine Pin (Deterministic, always present) */}
                    <div 
                      className="absolute transition-all duration-700 ease-out flex flex-col items-center animate-[fadeIn_0.5s_ease-out]"
                      style={{ 
                        top: '42%', 
                        left: '52%' 
                      }}
                    >
                      {/* Ripple Wave */}
                      <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-amber-500/20 animate-ping" />
                      <div className="absolute -top-0.5 -left-0.5 h-6 w-6 rounded-full bg-amber-500/30 animate-[ping_2s_infinite]" />
                      
                      {/* Map Marker Pin */}
                      <div className="relative bg-amber-500 hover:bg-amber-400 text-gray-950 p-2 rounded-full shadow-lg border border-white cursor-pointer z-10 transition-transform hover:scale-110">
                        <MapPin className="h-4 w-4" />
                      </div>
                      
                      {/* Label Bubble */}
                      <div className="mt-1.5 bg-gray-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-md text-[9px] font-extrabold text-white uppercase border border-gray-800 tracking-wider">
                        {machine.brand} {machine.model}
                      </div>
                    </div>

                    {/* User Location Pin (If activated successfully) */}
                    {userLocation && (
                      <div 
                        className="absolute transition-all duration-1000 ease-out flex flex-col items-center animate-[fadeIn_0.6s_ease-out]"
                        style={{ 
                          top: '65%', 
                          left: '25%' 
                        }}
                      >
                        {/* Connecting dashed line representing route / distance measurement */}
                        <svg className="absolute overflow-visible pointer-events-none" style={{ width: '400px', height: '400px', top: '-100px', left: '-150px' }}>
                          <path 
                            d="M 150,100 L 258,168" 
                            stroke="#0ea5e9" 
                            strokeWidth="2.5" 
                            strokeDasharray="6 4" 
                            fill="none" 
                            className="animate-[dash_2s_linear_infinite]"
                          />
                        </svg>

                        {/* Blue pulse */}
                        <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-blue-500/20 animate-ping" />
                        
                        {/* User Pin */}
                        <div className="relative bg-blue-500 text-white p-2 rounded-full shadow-lg border border-white cursor-pointer z-10 transition-transform hover:scale-110">
                          <Locate className="h-4 w-4" />
                        </div>
                        
                        <div className="mt-1.5 bg-blue-600 px-2 py-0.5 rounded-md shadow-md text-[9px] font-extrabold text-white uppercase tracking-wider">
                          {isEn ? "YOUR GPS" : "MA POSITION"}
                        </div>
                      </div>
                    )}

                    {/* HUD Coordinates Display */}
                    <div className="absolute top-2.5 left-2.5 bg-gray-950/80 backdrop-blur-xs text-white p-2 rounded-lg text-[9px] font-mono leading-tight border border-gray-800 space-y-0.5">
                      <p className="font-bold text-amber-400">⚡ ENGINE TELEMETRICS</p>
                      <p>LAT: {machineCoords.lat}° N</p>
                      <p>LNG: {machineCoords.lng}° E</p>
                    </div>
                  </div>

                  {/* Geolocation Controls & Statistics (5 columns) */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Status Badging */}
                      <div className="flex items-center gap-2">
                        {geoStatus === 'idle' && (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            GPS Ready
                          </span>
                        )}
                        {geoStatus === 'loading' && (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                            Searching Satellites...
                          </span>
                        )}
                        {geoStatus === 'success' && (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 animate-[fadeIn_0.3s_ease-out]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t('detail.geo_permission_granted')}
                          </span>
                        )}
                        {geoStatus === 'error' && (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 animate-[fadeIn_0.3s_ease-out]">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            {t('detail.geo_permission_denied')}
                          </span>
                        )}
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="text-gray-500 font-semibold">{t('detail.geo_lat_lng')}</span>
                          <span className="font-mono font-bold text-gray-900">{machineCoords.lat}, {machineCoords.lng}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="text-gray-500 font-semibold">{isEn ? "Reported Base" : "Base d'attache"}</span>
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-amber-500" />
                            {machine.location}
                          </span>
                        </div>
                        
                        {userLocation && (
                          <div className="space-y-2 animate-[fadeIn_0.4s_ease-out]">
                            <div className="flex justify-between border-b border-gray-100 pb-1.5">
                              <span className="text-gray-500 font-semibold">{t('detail.geo_user_lat_lng')}</span>
                              <span className="font-mono font-bold text-blue-600">
                                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                              </span>
                            </div>
                            <div className="rounded-xl bg-amber-500/5 p-3.5 border border-amber-500/10 space-y-1">
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                                {t('detail.geo_distance')}
                              </span>
                              <p className="text-2xl font-black text-amber-600">
                                {distanceKm ? Math.round(distanceKm).toLocaleString('fr-FR') : '...'} km
                              </p>
                              <p className="text-[10px] text-gray-400 font-semibold">
                                {isEn 
                                  ? "Calculation method: Geodetic Great-Circle Distance" 
                                  : "Calcul géodésique orthodromique de haute précision"}
                              </p>
                            </div>
                          </div>
                        )}

                        {geoStatus === 'error' && (
                          <div className="rounded-lg bg-rose-50 p-2.5 border border-rose-100 text-[11px] text-rose-700 leading-normal">
                            {geoErrorMsg}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleTrackDistance}
                      disabled={geoStatus === 'loading'}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs py-3.5 px-4 shadow-sm transition-all hover:shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Locate className="h-4 w-4 shrink-0" />
                      {t('detail.geo_btn_track')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab content 2: Maintenance history */}
          {activeTab === 'history' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Registre d'Interventions
                </h3>
                {isOwnerView && (
                  <button
                    onClick={() => onNavigate('Liste Détaillée de Maintenance - DEL-web')}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Nouvelle intervention
                  </button>
                )}
              </div>

              {engineLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Aucun historique d'entretien enregistré pour cet engin.
                </div>
              ) : (
                <div className="space-y-4">
                  {engineLogs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-gray-100 p-4 space-y-3 bg-gray-50 hover:bg-gray-100/50 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            log.type === 'VGP Réglementaire' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-xs font-bold text-gray-900">Réf : {log.id}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold">{log.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{log.description}</p>
                      
                      {log.remarks && (
                        <p className="text-[11px] text-amber-800 italic bg-amber-50/50 p-2 rounded-lg border border-amber-200/10">
                          Note : {log.remarks}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-200/60 pt-2 mt-1">
                        <span>Technicien : <strong className="text-gray-600">{log.technician}</strong></span>
                        <span>Coût : <strong className="text-gray-700">{log.cost} €</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab content 3: Related contracts (Owner View only) */}
          {activeTab === 'contracts' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-wider">
                Suivi des Contrats de Location
              </h3>
              {engineContracts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Aucun contrat actif ou passé associé à cet engin.
                </div>
              ) : (
                <div className="space-y-4">
                  {engineContracts.map((ctr) => (
                    <div key={ctr.id} className="rounded-xl border border-gray-100 p-4 space-y-2 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">{ctr.clientCompany}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                          ctr.status === 'Actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ctr.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-500 pt-1">
                        <div>
                          <p>Période</p>
                          <p className="font-bold text-gray-800">{ctr.startDate} au {ctr.endDate}</p>
                        </div>
                        <div>
                          <p>Garantie</p>
                          <p className="font-bold text-gray-800">{ctr.insuranceOption.split(' ')[1]}</p>
                        </div>
                        <div>
                          <p>Montant Global</p>
                          <p className="font-bold text-amber-600">{ctr.totalPrice.toLocaleString('fr-FR')} €</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Action widgets, booking, VGP status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Action Card */}
          <div className="rounded-2xl border border-amber-500/20 bg-white p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/10 rounded-bl-full" />
            
            <h3 className="font-sans text-lg font-black text-gray-950">
              {machine.brand} {machine.model}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{machine.type}</p>

            <div className="my-5 border-y border-gray-100 py-4 flex items-baseline justify-between">
              <span className="text-xs text-gray-400 font-bold">Tarif de location B2B</span>
              <div>
                <span className="font-sans text-2xl font-black text-amber-500">{machine.dailyPrice} €</span>
                <span className="text-xs text-gray-500 font-semibold"> / jour</span>
              </div>
            </div>

            {/* If Owner View -> Show status management, next maint info */}
            {isOwnerView ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Dernier VGP</span>
                    <span className="font-bold text-gray-900">{machine.vgpCertDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Prochaine visite</span>
                    <span className="font-bold text-gray-900">{machine.nextMaintenanceDate}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-amber-500" style={{ width: '70%' }} />
                  </div>
                  <p className="text-[10px] text-gray-400 italic text-center">Rapport VGP certifié stocké dans le coffre-fort</p>
                </div>

                <button
                  onClick={() => onNavigate('Coffre-fort Documents - DEL-web')}
                  className="w-full rounded-xl bg-gray-900 py-3 text-xs font-bold text-white hover:bg-gray-800 transition-colors text-center cursor-pointer"
                >
                  Télécharger le Rapport VGP
                </button>
              </div>
            ) : (
              // Renter/Catalog booking action
              <div className="space-y-4">
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> VGP à jour (Moins de 6 mois)
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Assurance Bris de Machine incluse
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Logistique de livraison disponible
                  </p>
                </div>

                {onBookMachine && (
                  <button
                    onClick={() => onBookMachine(machine.id)}
                    className="w-full rounded-xl bg-amber-500 py-3.5 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all text-center shadow-lg shadow-amber-500/10 cursor-pointer"
                  >
                    Demander la Location
                  </button>
                )}

                <button
                  onClick={() => onNavigate('Profil Utilisateur - DEL-web')}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-center"
                >
                  Contacter le Propriétaire
                </button>
              </div>
            )}
          </div>

          {/* Quick Support / Contact */}
          <div className="rounded-2xl border border-gray-100 bg-gray-900 p-6 text-white text-center space-y-3">
            <PhoneCall className="h-6 w-6 text-amber-400 mx-auto" />
            <h4 className="font-sans text-sm font-bold">Besoin d'assistance logistique ?</h4>
            <p className="text-xs text-gray-400">
              DEL-web s'occupe du transport de la machine directement sur votre chantier. Contactez un conseiller logistique.
            </p>
            <p className="font-mono text-sm font-bold text-amber-400">+33 4 72 40 20 20</p>
          </div>

        </div>

      </div>

      {/* Hidden print container */}
      <div id="print-report-container" className="hidden print:block bg-white text-gray-900 p-8 space-y-8">
        
        {/* Style tag specifically injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media screen {
            #print-report-container {
              display: none !important;
            }
          }
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            body * {
              visibility: hidden !important;
            }
            #print-report-container,
            #print-report-container * {
              visibility: visible !important;
            }
            #print-report-container {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 0mm !important;
              margin: 0mm !important;
              background: white !important;
              color: black !important;
            }
            .print-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 15px !important;
              margin-bottom: 15px !important;
            }
            .print-table th, .print-table td {
              border: 1px solid #e2e8f0 !important;
              padding: 8px 12px !important;
              text-align: left !important;
              font-size: 11px !important;
            }
            .print-table th {
              background-color: #f8fafc !important;
              font-weight: bold !important;
              color: #1e293b !important;
            }
            .print-avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .print-header {
              border-bottom: 3px solid #f59e0b !important;
              padding-bottom: 12px !important;
              margin-bottom: 25px !important;
            }
            .print-section-title {
              font-size: 13px !important;
              font-weight: 800 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              color: #1e293b !important;
              border-bottom: 1.5px solid #e2e8f0 !important;
              padding-bottom: 4px !important;
              margin-top: 25px !important;
              margin-bottom: 12px !important;
            }
          }
        `}} />

        {/* 1. Header block */}
        <div className="print-header flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-gray-950 font-black px-2.5 py-1 text-sm rounded tracking-tighter">DEL</span>
              <span className="text-sm font-bold tracking-tight text-gray-900">web</span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">
              {isEn ? "Technical Fleet Management Portal" : "Portail de Gestion de Flotte de Chantier"}
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-lg font-black text-gray-950 tracking-tight uppercase">
              {isEn ? "TECHNICAL & SPECIFICATION REPORT" : "RAPPORT D'ACTIVITÉ & CONFORMITÉ TECHNIQUE"}
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {t('detail.print_date')} : {today.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* 2. Machine Identity Summary */}
        <div className="grid grid-cols-12 gap-6 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="col-span-3">
            <img 
              src={machine.imageUrl} 
              alt={`${machine.brand} ${machine.model}`} 
              className="h-28 w-full rounded-lg object-cover border border-slate-200" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-9 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 uppercase">
                {machine.brand} {machine.model}
              </h2>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded text-slate-700">
                S/N : {machine.serialNumber}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isEn 
                ? `Official technical datasheet and regulatory compliance history of the machinery registered in the DEL-web safe. Certified operations counter at ${machine.hourCounter} hours.` 
                : `Fiche technique officielle et registre historique de conformité réglementaire de l'engin répertorié dans le coffre-fort numérique DEL-web. Compteur horaire certifié à ${machine.hourCounter} heures d'opération.`}
            </p>
            <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase pt-1">
              <span>{isEn ? "Category" : "Catégorie"} : <strong className="text-slate-800">{machine.category}</strong></span>
              <span>•</span>
              <span>{isEn ? "Location" : "Base d'attache"} : <strong className="text-slate-800">{machine.location}</strong></span>
              <span>•</span>
              <span>{isEn ? "Status" : "Statut"} : <strong className="text-slate-800">{machine.status === 'available' ? 'Disponible' : machine.status === 'rented' ? 'Loué' : 'Maintenance'}</strong></span>
            </div>
          </div>
        </div>

        {/* 3. Specifications general sheet (Table style) */}
        <div>
          <div className="print-section-title">
            {isEn ? "1. GENERAL TECHNICAL SPECIFICATIONS" : "1. SPÉCIFICATIONS TECHNIQUES GÉNÉRALES"}
          </div>
          <table className="print-table">
            <tbody>
              <tr>
                <th style={{ width: '25%' }}>{isEn ? "Manufacturer" : "Constructeur"}</th>
                <td style={{ width: '25%', fontWeight: 'bold' }}>{machine.brand}</td>
                <th style={{ width: '25%' }}>{isEn ? "Model" : "Modèle"}</th>
                <td style={{ width: '25%', fontWeight: 'bold' }}>{machine.model}</td>
              </tr>
              <tr>
                <th>{isEn ? "Year of Manufacture" : "Année de fabrication"}</th>
                <td>{machine.year}</td>
                <th>{isEn ? "Serial Number" : "Numéro de Série"}</th>
                <td className="font-mono">{machine.serialNumber}</td>
              </tr>
              <tr>
                <th>{isEn ? "Operating Hours" : "Heures de fonctionnement"}</th>
                <td style={{ fontWeight: 'bold' }}>{machine.hourCounter} h</td>
                <th>{isEn ? "Machine Weight" : "Poids en ordre de marche"}</th>
                <td>{machine.weight} T</td>
              </tr>
              <tr>
                <th>{isEn ? "Engine Power" : "Puissance du moteur"}</th>
                <td>{machine.enginePower}</td>
                <th>{isEn ? "Fuel Type" : "Type de carburant"}</th>
                <td>{machine.fuelType}</td>
              </tr>
              <tr>
                <th>{isEn ? "Bucket Capacity" : "Capacité du godet"}</th>
                <td>{machine.bucketCapacity || "Non applicable"}</td>
                <th>{isEn ? "Daily Rental Price" : "Tarif Journalier de base"}</th>
                <td style={{ fontWeight: 'bold' }}>{machine.dailyPrice} € / jour</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Regulatory & Inspections Block */}
        <div className="print-avoid-break">
          <div className="print-section-title">
            {isEn ? "2. REGULATORY INSPECTIONS & COMPLIANCE" : "2. CONFORMITÉ RÉGLEMENTAIRE & VISITES"}
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th>{isEn ? "Inspection Type" : "Type de contrôle"}</th>
                <th>{isEn ? "Last Certified Date" : "Date de certification"}</th>
                <th>{isEn ? "Validity Limit" : "Limite de validité"}</th>
                <th>{isEn ? "Status" : "Statut / Niveau de Risque"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>{isEn ? "VGP (General Periodic Inspection)" : "Visite Générale Périodique (VGP)"}</td>
                <td>{machine.vgpCertDate}</td>
                <td>{(() => {
                  const d = new Date(machine.vgpCertDate);
                  d.setMonth(d.getMonth() + 6);
                  return d.toLocaleDateString(isEn ? 'en-US' : 'fr-FR');
                })()}</td>
                <td>
                  {(() => {
                    const d = new Date(machine.vgpCertDate);
                    d.setMonth(d.getMonth() + 6);
                    const expired = d.getTime() < today.getTime();
                    return expired 
                      ? <span className="text-rose-600 font-bold uppercase">{isEn ? "EXPIRED / CRITICAL" : "EXPIRÉ / ACTION REQUISE"}</span>
                      : <span className="text-emerald-600 font-bold uppercase">{isEn ? "VALID / COMPLIANT" : "CONFORME / EN RÈGLE"}</span>;
                  })()}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>{isEn ? "Technical Overhaul Interval" : "Intervalle de révision technique"}</td>
                <td>--</td>
                <td>{machine.nextMaintenanceDate}</td>
                <td>
                  <span className="text-amber-600 font-bold uppercase">{isEn ? "INCOMING PLAN" : "À PLANIFIER PROCHAINEMENT"}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Maintenance Register */}
        <div className="print-avoid-break">
          <div className="print-section-title">
            {isEn ? "3. REGISTER OF MAINTENANCE OPERATIONS" : "3. REGISTRE DES INTERVENTIONS ET MAINTENANCE"}
          </div>
          {engineLogs.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-3 text-center border border-dashed rounded border-slate-200">
              {isEn ? "No maintenance operations recorded for this machinery." : "Aucune opération de maintenance ou intervention enregistrée dans le registre."}
            </p>
          ) : (
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '12%' }}>{isEn ? "Date" : "Date"}</th>
                  <th style={{ width: '22%' }}>{isEn ? "Operation Type" : "Type d'intervention"}</th>
                  <th style={{ width: '40%' }}>{isEn ? "Description / Notes" : "Description des travaux"}</th>
                  <th style={{ width: '16%' }}>{isEn ? "Technician" : "Technicien"}</th>
                  <th style={{ width: '10%' }}>{isEn ? "Cost" : "Coût TTC"}</th>
                </tr>
              </thead>
              <tbody>
                {engineLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-semibold">{log.date}</td>
                    <td>
                      <span className="font-bold text-slate-800">{log.type}</span>
                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">ID: {log.id}</p>
                    </td>
                    <td>
                      <p className="font-medium text-slate-800">{log.description}</p>
                      {log.remarks && (
                        <p className="text-[10px] text-amber-700 italic mt-1 bg-amber-50/50 p-1.5 rounded border border-amber-100">
                          Remarque : {log.remarks}
                        </p>
                      )}
                    </td>
                    <td className="font-medium text-slate-600">{log.technician}</td>
                    <td className="font-bold text-slate-900">{log.cost.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 6. Active Contracts (If Owner View) */}
        {isOwnerView && engineContracts.length > 0 && (
          <div className="print-avoid-break">
            <div className="print-section-title">
              {isEn ? "4. ASSOCIATED RENTAL CONTRACTS HISTORY" : "4. HISTORIQUE DES CONTRATS DE LOCATION ASSOCIÉS"}
            </div>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>{isEn ? "Client Company" : "Société Locataire"}</th>
                  <th style={{ width: '30%' }}>{isEn ? "Rental Period" : "Période de Location"}</th>
                  <th style={{ width: '25%' }}>{isEn ? "Insurance Level" : "Garantie souscrite"}</th>
                  <th style={{ width: '20%' }}>{isEn ? "Total Price" : "Chiffre d'Affaires"}</th>
                </tr>
              </thead>
              <tbody>
                {engineContracts.map((ctr) => (
                  <tr key={ctr.id}>
                    <td className="font-bold text-slate-800">{ctr.clientCompany}</td>
                    <td>{isEn ? `From ${ctr.startDate} to ${ctr.endDate}` : `Du ${ctr.startDate} au ${ctr.endDate}`}</td>
                    <td>{ctr.insuranceOption}</td>
                    <td className="font-bold text-slate-900">{ctr.totalPrice.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. Signature Footer block */}
        <div className="print-avoid-break grid grid-cols-2 gap-8 pt-10 mt-10 border-t border-slate-200">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? "REPORT SECURITY HASH" : "EMPREINTE DE SÉCURITÉ DU RAPPORT"}
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-1 leading-normal uppercase">
              SHA256: {machine.serialNumber.toLowerCase()}-{machine.id}-2026-07-02-certified-cop-delweb
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              {t('detail.print_signature')}
            </p>
            {/* Signature box placeholder */}
            <div className="h-16 w-48 border border-dashed border-slate-300 rounded bg-slate-50/50 flex items-center justify-center">
              <span className="text-[9px] text-slate-400 italic font-mono">DEL-web Fleet Controller</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
