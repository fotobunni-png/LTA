import React, { useState } from 'react';
import { 
  Bus, 
  Accessibility, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  MapPin, 
  Share2, 
  Sliders, 
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { 
  BusStop, 
  BusServiceArrival, 
  BusArrivalInfo, 
  FilterCategory 
} from '../types/transit';
import { 
  getMrtLineColor, 
  formatEtaString, 
  getCapacityDetails 
} from '../utils/transitEngine';
import { SERVICE_DEFINITIONS } from '../data/transitData';

interface ArrivalsTablePanelProps {
  selectedStop: BusStop;
  arrivals: BusServiceArrival[];
  activeFilter: FilterCategory;
  starredServices: string[];
  onToggleStarService: (serviceNo: string) => void;
  onSelectServiceForMap: (serviceNo: string) => void;
  selectedServiceNo: string | null;
  onSelectStopByCode: (code: string) => void;
}

export const ArrivalsTablePanel: React.FC<ArrivalsTablePanelProps> = ({
  selectedStop,
  arrivals,
  activeFilter,
  starredServices,
  onToggleStarService,
  onSelectServiceForMap,
  selectedServiceNo,
  onSelectStopByCode
}) => {
  const [expandedServiceNo, setExpandedServiceNo] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter arrivals according to filter category
  const filteredArrivals = arrivals.filter(item => {
    if (activeFilter === 'trunk') return item.serviceType === 'trunk';
    if (activeFilter === 'express') return item.serviceType === 'express';
    if (activeFilter === 'feeder') return item.serviceType === 'feeder';
    if (activeFilter === 'seats') return item.nextArrival.capacity === 'seats';
    if (activeFilter === 'low-wait') return item.nextArrival.etaMinutes <= 4;
    if (activeFilter === 'favorites') return starredServices.includes(item.serviceNo);
    return true;
  });

  const toggleExpand = (svcNo: string) => {
    if (expandedServiceNo === svcNo) {
      setExpandedServiceNo(null);
    } else {
      setExpandedServiceNo(svcNo);
      onSelectServiceForMap(svcNo);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Singapore Transit Pulse: Stop ${selectedStop.code} (${selectedStop.name}) - ${selectedStop.road}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Helper for service badge styling
  const getBadgeStyle = (serviceType: 'trunk' | 'express' | 'feeder') => {
    switch (serviceType) {
      case 'express':
        return 'bg-[#D8232A] text-white'; // Transit red
      case 'feeder':
        return 'bg-[#1E293B] text-white'; // Slate navy
      case 'trunk':
      default:
        return 'bg-[#6A1A78] text-white'; // SBS Transit deep purple
    }
  };

  const renderArrivalSlot = (label: string, arr: BusArrivalInfo, isNext: boolean) => {
    const etaStr = formatEtaString(arr.etaMinutes, arr.etaSeconds);
    const cap = getCapacityDetails(arr.capacity);
    const isArriving = etaStr === 'Arr' || etaStr === '<1m';

    return (
      <div 
        className={`flex-1 min-w-[85px] sm:min-w-[95px] p-2 rounded-lg border transition-all text-center ${
          isNext 
            ? isArriving 
              ? 'bg-[#FDF2F8] border-[#6A1A78]/40 shadow-xs ring-1 ring-[#6A1A78]/20' 
              : 'bg-white border-[#CBD5E1] shadow-xs'
            : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        {/* Slot Label (Next / 2nd / 3rd) */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1 px-0.5">
          <span>{label}</span>
          <span 
            className="text-[9px] font-bold px-1 rounded bg-slate-200 text-slate-700" 
            title={arr.deckType === 'DD' ? 'Double Decker Bus' : arr.deckType === 'BD' ? 'Bendy Articulated Bus' : 'Single Deck Bus'}
          >
            {arr.deckType}
          </span>
        </div>

        {/* Big ETA Number in Space Grotesk tabular */}
        <div className="my-0.5 flex items-center justify-center gap-1">
          <span 
            className={`font-display font-bold tabular-nums text-lg sm:text-xl tracking-tight ${
              isArriving 
                ? 'text-[#6A1A78] animate-pulse font-extrabold' 
                : 'text-slate-900'
            }`}
          >
            {etaStr}
          </span>
          {arr.etaMinutes <= 0 && arr.etaSeconds > 0 && (
            <span className="text-[10px] text-slate-400 font-display tabular-nums">
              {arr.etaSeconds}s
            </span>
          )}
        </div>

        {/* Crowding status pill & Wheelchair indicator */}
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <div 
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${cap.badgeClass}`}
            title={`Crowding: ${cap.label}`}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: cap.dotColor }}
            />
            <span className="truncate">{cap.label}</span>
          </div>

          {arr.isWheelchairAccessible && (
            <span 
              className="p-0.5 text-[#0284C7] bg-[#0284C7]/10 rounded" 
              title="Wheelchair Accessible Bus (WAB)"
            >
              <Accessibility className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      
      {/* Hero Stop Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-[#1E293B] to-[#0F172A] text-white border-b border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-display font-bold text-sm px-2.5 py-0.5 rounded-full bg-[#6A1A78] text-white shadow-xs border border-white/20">
                {selectedStop.code}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {selectedStop.corridor}
              </span>
              {selectedStop.sheltered && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Fully Sheltered
                </span>
              )}
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {selectedStop.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#E48CEE]" />
              <span>{selectedStop.road}</span>
            </p>

            {/* Interchange Transfer Lines */}
            {selectedStop.mrtTransfers && selectedStop.mrtTransfers.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-700/80">
                <span className="text-[11px] text-slate-400 font-medium">MRT Connections:</span>
                {selectedStop.mrtTransfers.map((mrt) => {
                  const col = getMrtLineColor(mrt.line);
                  return (
                    <span
                      key={mrt.stationCode}
                      style={{ backgroundColor: col.bg, color: col.text }}
                      className="text-xs font-display font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1"
                    >
                      <span>{mrt.stationCode}</span>
                      <span className="text-[10px] opacity-90">{mrt.stationName}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-colors text-xs flex items-center gap-1"
              title="Copy Stop Details"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-header status bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">
            {filteredArrivals.length} Services Monitored
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-[#6A1A78]" />
            Arrival intervals updating continuously
          </span>
        </div>
        <div className="text-[11px] font-semibold text-slate-500 hidden sm:block">
          Tabular Num: Space Grotesk
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0] p-2 sm:p-3 space-y-2.5">
        {filteredArrivals.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Bus className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No services match current filter</p>
            <p className="text-xs">Try switching filter to &quot;All Services&quot;</p>
          </div>
        ) : (
          filteredArrivals.map((service) => {
            const isStarred = starredServices.includes(service.serviceNo);
            const isExpanded = expandedServiceNo === service.serviceNo;
            const isMapActive = selectedServiceNo === service.serviceNo;
            const svcDef = SERVICE_DEFINITIONS[service.serviceNo];

            return (
              <div
                key={service.serviceNo}
                className={`rounded-xl border transition-all ${
                  isMapActive
                    ? 'border-[#6A1A78] bg-[#FBF7FC] shadow-sm ring-1 ring-[#6A1A78]/30'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                }`}
              >
                {/* Main Service Row */}
                <div className="p-3 sm:p-3.5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left: Service Badge & Route Info */}
                    <div className="flex items-start gap-3 min-w-[200px]">
                      
                      {/* Compact Route Badge */}
                      <button
                        type="button"
                        onClick={() => onSelectServiceForMap(service.serviceNo)}
                        className={`w-14 sm:w-16 h-12 rounded-lg flex items-center justify-center font-display font-bold text-xl sm:text-2xl shadow-sm tracking-tight shrink-0 transition-transform active:scale-95 ${getBadgeStyle(
                          service.serviceType
                        )}`}
                        title={`Click to preview Service ${service.serviceNo} on Corridor Map`}
                      >
                        {service.serviceNo}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {service.operator}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            service.serviceType === 'express' ? 'bg-red-100 text-red-700' :
                            service.serviceType === 'feeder' ? 'bg-slate-200 text-slate-800' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {service.serviceType}
                          </span>
                          {service.routeType === 'loop' && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              Loop
                            </span>
                          )}
                        </div>

                        <div className="mt-1">
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <span>To:</span>
                            <span className="font-bold text-slate-900 truncate">
                              {service.destination}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            Headway ~{service.headwayMinutes} mins
                          </div>
                        </div>
                      </div>

                      {/* Favorite button */}
                      <button
                        type="button"
                        onClick={() => onToggleStarService(service.serviceNo)}
                        className="p-1 text-slate-300 hover:text-amber-500 transition-colors ml-auto"
                        title={isStarred ? 'Unstar service' : 'Star service'}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>

                    </div>

                    {/* Center: Three Sequential Arrival Slots */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-1 max-w-full md:max-w-[340px]">
                      {renderArrivalSlot('Next Bus', service.nextArrival, true)}
                      {renderArrivalSlot('2nd Bus', service.subsequentArrival, false)}
                      {renderArrivalSlot('3rd Bus', service.thirdArrival, false)}
                    </div>

                    {/* Right: Route Explorer Toggle */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleExpand(service.serviceNo)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          isExpanded
                            ? 'bg-[#6A1A78] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="View route corridor stops & live vehicle location"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Route Stops</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Expanded Route Timeline Accordion */}
                {isExpanded && svcDef && (
                  <div className="p-3 sm:p-4 bg-slate-50 border-t border-[#E2E8F0] space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#6A1A78]" />
                        <span>Live Route Corridor: {svcDef.origin} &rarr; {svcDef.destination}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Vehicle #{service.nextArrival.vehiclePlate} Approaching
                      </span>
                    </div>

                    {/* Transit Stop Lists & Accordion with vertical line spine and 8px nodes */}
                    <div className="relative pl-6 space-y-3 pt-1">
                      {/* Vertical line spine */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#CBD5E1]" />

                      {svcDef.routeStops.map((node, nIdx) => {
                        const isCurrentStop = node.stopCode === selectedStop.code;
                        const isInterchange = !!(node.mrtTransfers && node.mrtTransfers.length > 0);
                        const isBusHere = nIdx === service.nextArrival.currentStopIndex;

                        return (
                          <div 
                            key={node.stopCode}
                            className={`relative flex items-center justify-between gap-2 p-1.5 rounded-lg text-xs transition-colors ${
                              isCurrentStop 
                                ? 'bg-white border border-[#6A1A78]/30 shadow-xs ring-1 ring-[#6A1A78]/20 font-bold text-[#6A1A78]' 
                                : 'hover:bg-white text-slate-700'
                            }`}
                          >
                            {/* Circular node dot (8px diameter) */}
                            <div 
                              className={`absolute -left-[19px] w-[10px] h-[10px] rounded-full transition-all ${
                                isCurrentStop
                                  ? 'bg-[#6A1A78] ring-4 ring-[#6A1A78]/20'
                                  : isInterchange
                                    ? 'bg-[#D8232A] ring-2 ring-white border border-[#D8232A]'
                                    : 'bg-white border-2 border-slate-400'
                              }`} 
                            />

                            {/* Node details */}
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-display font-semibold text-[11px] px-1.5 py-0.2 bg-slate-200/70 rounded text-slate-800">
                                {node.stopCode}
                              </span>
                              <button
                                type="button"
                                onClick={() => onSelectStopByCode(node.stopCode)}
                                className={`text-left hover:underline truncate ${isCurrentStop ? 'font-bold text-[#6A1A78]' : 'text-slate-800'}`}
                              >
                                {node.stopName}
                              </button>
                              <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                                ({node.roadName})
                              </span>
                            </div>

                            {/* Right: MRT Transfers or Bus Approaching indicator */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isBusHere && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <Bus className="w-3 h-3 text-emerald-600 animate-bounce" />
                                  Bus here
                                </span>
                              )}

                              {node.mrtTransfers && node.mrtTransfers.map(m => {
                                const c = getMrtLineColor(m.line);
                                return (
                                  <span
                                    key={m.stationCode}
                                    style={{ backgroundColor: c.bg, color: c.text }}
                                    className="text-[9px] font-display font-bold px-1 rounded"
                                  >
                                    {m.stationCode}
                                  </span>
                                );
                              })}

                              <span className="text-[10px] text-slate-400 font-display tabular-nums">
                                {node.distanceKm} km
                              </span>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Fleet Vehicle Meta Strip */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800">Next Vehicle:</span>{' '}
                        <span className="font-mono text-slate-900 font-semibold">{service.nextArrival.vehiclePlate}</span> ({service.nextArrival.vehicleModel})
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Load: <strong>{service.nextArrival.passengerLoadPct}%</strong></span>
                        <span>&bull;</span>
                        <span>Distance: <strong>{service.nextArrival.distanceKm} km away</strong></span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
