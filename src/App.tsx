/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bus, 
  Map as MapIcon, 
  SlidersHorizontal, 
  Radio, 
  Search, 
  Bookmark, 
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  BusStop, 
  BusServiceArrival, 
  FilterCategory, 
  ViewMode, 
  TransitDisruption 
} from './types/transit';
import { 
  INITIAL_STOPS, 
  INITIAL_DISRUPTIONS 
} from './data/transitData';
import { 
  generateArrivalsForStop, 
  tickArrivals,
  parseLtaBusArrivalResponse,
  LtaApiResponseRaw
} from './utils/transitEngine';
import { transitAudio } from './utils/audio';
import { Header } from './components/Header';
import { DisruptionBanner } from './components/DisruptionBanner';
import { StopSearchPanel } from './components/StopSearchPanel';
import { ArrivalsTablePanel } from './components/ArrivalsTablePanel';
import { CorridorMapPanel } from './components/CorridorMapPanel';
import { DispatcherFleetView } from './components/DispatcherFleetView';

export default function App() {
  // State
  const [stops] = useState<BusStop[]>(INITIAL_STOPS);
  const [selectedStop, setSelectedStop] = useState<BusStop>(INITIAL_STOPS[0]);
  const [arrivals, setArrivals] = useState<BusServiceArrival[]>(() => 
    generateArrivalsForStop(INITIAL_STOPS[0])
  );
  const [disruptions, setDisruptions] = useState<TransitDisruption[]>(INITIAL_DISRUPTIONS);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<string>('Initializing');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('commuter');
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Favorites / Starred items with localStorage fallback
  const [favoriteStops, setFavoriteStops] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_transit_fav_stops');
      return saved ? JSON.parse(saved) : ['09048', '08057'];
    } catch {
      return ['09048', '08057'];
    }
  });

  const [starredServices, setStarredServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_transit_starred_svc');
      return saved ? JSON.parse(saved) : ['65', '147'];
    } catch {
      return ['65', '147'];
    }
  });

  const [selectedServiceNoForMap, setSelectedServiceNoForMap] = useState<string | null>(null);
  
  // Mobile active tab view ('stops' | 'arrivals' | 'map')
  const [mobileTab, setMobileTab] = useState<'stops' | 'arrivals' | 'map'>('arrivals');

  // Fetch from LTA Bus Arrival API Gateway (/api/bus-arrival)
  const fetchArrivalsFromApi = useCallback(async (stop: BusStop, singleService?: string) => {
    try {
      let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(stop.code)}`;
      if (singleService) {
        url += `&ServiceNo=${encodeURIComponent(singleService)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data: LtaApiResponseRaw = await res.json();
      const parsed = parseLtaBusArrivalResponse(data, stop);
      
      if (parsed.length > 0) {
        setArrivals(parsed);
      }
      setIsLiveFeed(Boolean(data._meta?.liveFeed));
      setApiSource(data._meta?.source || 'API Gateway');
    } catch {
      // Fallback to local simulation engine if network or server unavailable
      setArrivals(generateArrivalsForStop(stop));
      setIsLiveFeed(false);
      setApiSource('Telemetry Mesh (Local)');
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_transit_fav_stops', JSON.stringify(favoriteStops));
    } catch {
      // Ignored
    }
  }, [favoriteStops]);

  useEffect(() => {
    try {
      localStorage.setItem('sg_transit_starred_svc', JSON.stringify(starredServices));
    } catch {
      // Ignored
    }
  }, [starredServices]);

  // Update arrivals whenever selectedStop changes
  useEffect(() => {
    fetchArrivalsFromApi(selectedStop);
    // On mobile switch to arrivals tab when user picks a stop
    setMobileTab('arrivals');
  }, [selectedStop, fetchArrivalsFromApi]);

  // 20-second API polling cycle matching LTA DataMall refresh rate
  useEffect(() => {
    if (!autoRefresh) return;

    const ltaCycleInterval = setInterval(() => {
      fetchArrivalsFromApi(selectedStop);
    }, 20000); // 20 seconds as specified

    return () => clearInterval(ltaCycleInterval);
  }, [selectedStop, autoRefresh, fetchArrivalsFromApi]);

  // 1-second interval ticker for smooth countdowns between 20-second API intervals
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setArrivals(prev => {
        const { updatedServices, justArrivedList } = tickArrivals(prev);

        if (justArrivedList.length > 0 && soundEnabled) {
          transitAudio.playArrivalChime();
        }

        return updatedServices;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  // Manual refresh handler
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (soundEnabled) transitAudio.playClick();
    await fetchArrivalsFromApi(selectedStop);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, [selectedStop, soundEnabled, fetchArrivalsFromApi]);

  const toggleFavoriteStop = (code: string) => {
    if (soundEnabled) transitAudio.playClick();
    setFavoriteStops(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleStarService = (svcNo: string) => {
    if (soundEnabled) transitAudio.playClick();
    setStarredServices(prev => 
      prev.includes(svcNo) ? prev.filter(s => s !== svcNo) : [...prev, svcNo]
    );
  };

  const handleSelectStopByCode = (code: string) => {
    const found = stops.find(s => s.code === code);
    if (found) {
      setSelectedStop(found);
    }
  };

  // CSV Telemetry Export (Secondary Action implementation)
  const handleExportTelemetry = () => {
    const headers = ['StopCode', 'StopName', 'ServiceNo', 'Operator', 'Type', 'NextETA_Min', 'NextETA_Sec', 'NextCrowding', 'NextPlate', 'NextModel', 'VarianceSec', 'LoadFactorPct'];
    const rows = arrivals.map(svc => [
      selectedStop.code,
      `"${selectedStop.name}"`,
      svc.serviceNo,
      svc.operator,
      svc.serviceType,
      svc.nextArrival.etaMinutes,
      svc.nextArrival.etaSeconds,
      svc.nextArrival.capacity,
      svc.nextArrival.vehiclePlate,
      `"${svc.nextArrival.vehicleModel}"`,
      svc.nextArrival.scheduleVarianceSeconds,
      `${svc.nextArrival.passengerLoadPct}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `singapore_transit_telemetry_${selectedStop.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#6A1A78]/20 selection:text-[#6A1A78]">
      
      {/* Civic Navigation Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        onExportTelemetry={handleExportTelemetry}
        isLiveFeed={isLiveFeed}
      />

      {/* Disruption & Transit Advisory Banner */}
      <DisruptionBanner
        disruptions={disruptions}
        onSelectService={(svc) => {
          setSelectedServiceNoForMap(svc);
          setActiveFilter('all');
          setSearchQuery(svc);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col">
        
        {viewMode === 'dispatcher' ? (
          /* Dispatcher & Fleet Controller View */
          <DispatcherFleetView
            arrivals={arrivals}
            stopName={selectedStop.name}
            stopCode={selectedStop.code}
            onAddDisruption={(newDisruption) => setDisruptions([newDisruption, ...disruptions])}
            onExportCsv={handleExportTelemetry}
          />
        ) : (
          /* Commuter 12-Column Responsive View */
          <div className="grid grid-cols-12 gap-3 sm:gap-4 flex-1 items-stretch">
            
            {/* Desktop / Tablet Col 1-3 (3 Columns): Bus Stop Search & Corridors */}
            <div className={`col-span-12 lg:col-span-3 xl:col-span-3 ${
              mobileTab === 'stops' ? 'block' : 'hidden lg:block'
            } h-[calc(100vh-130px)] lg:h-[calc(100vh-110px)] min-h-[500px]`}>
              <StopSearchPanel
                stops={stops}
                selectedStop={selectedStop}
                onSelectStop={setSelectedStop}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                favorites={favoriteStops}
                onToggleFavoriteStop={toggleFavoriteStop}
              />
            </div>

            {/* Desktop / Tablet Col 4-8 (5 Columns): Live Service Arrival Tables */}
            <div className={`col-span-12 lg:col-span-5 xl:col-span-5 ${
              mobileTab === 'arrivals' ? 'block' : 'hidden lg:block'
            } h-[calc(100vh-130px)] lg:h-[calc(100vh-110px)] min-h-[500px]`}>
              <ArrivalsTablePanel
                selectedStop={selectedStop}
                arrivals={arrivals}
                activeFilter={activeFilter}
                starredServices={starredServices}
                onToggleStarService={toggleStarService}
                onSelectServiceForMap={setSelectedServiceNoForMap}
                selectedServiceNo={selectedServiceNoForMap}
                onSelectStopByCode={handleSelectStopByCode}
              />
            </div>

            {/* Desktop / Tablet Col 9-12 (4 Columns): Interactive Route Corridor Map */}
            <div className={`col-span-12 lg:col-span-4 xl:col-span-4 ${
              mobileTab === 'map' ? 'block' : 'hidden lg:block'
            } h-[calc(100vh-130px)] lg:h-[calc(100vh-110px)] min-h-[500px]`}>
              <CorridorMapPanel
                stops={stops}
                selectedStop={selectedStop}
                onSelectStop={setSelectedStop}
                arrivals={arrivals}
                selectedServiceNo={selectedServiceNoForMap}
                onClearSelectedService={() => setSelectedServiceNoForMap(null)}
              />
            </div>

          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation Bar (< 1024px) */}
      <nav className="lg:hidden sticky bottom-0 z-40 bg-[#0F172A] border-t border-[#334155] px-3 py-2 text-white shadow-lg">
        <div className="flex items-center justify-around text-xs">
          <button
            type="button"
            onClick={() => setMobileTab('stops')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              mobileTab === 'stops' ? 'text-[#E48CEE] font-bold bg-[#1E293B]' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Stops ({stops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('arrivals')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              mobileTab === 'arrivals' ? 'text-[#E48CEE] font-bold bg-[#1E293B]' : 'text-slate-400'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Live ETAs</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
              mobileTab === 'map' ? 'text-[#E48CEE] font-bold bg-[#1E293B]' : 'text-slate-400'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Corridor Map</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
