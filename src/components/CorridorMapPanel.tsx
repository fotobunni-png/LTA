import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Activity, 
  Eye, 
  EyeOff, 
  Info,
  Maximize2,
  Minimize2,
  Navigation,
  Radio,
  Zap
} from 'lucide-react';
import { BusStop, BusServiceArrival } from '../types/transit';
import { getMrtLineColor } from '../utils/transitEngine';

interface CorridorMapPanelProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  arrivals: BusServiceArrival[];
  selectedServiceNo: string | null;
  onClearSelectedService: () => void;
}

export const CorridorMapPanel: React.FC<CorridorMapPanelProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  arrivals,
  selectedServiceNo,
  onClearSelectedService
}) => {
  const [showMrtLayers, setShowMrtLayers] = useState(true);
  const [showTrafficCongestion, setShowTrafficCongestion] = useState(true);
  const [activeCorridorFilter, setActiveCorridorFilter] = useState<string>('all');
  const [selectedBusVehicle, setSelectedBusVehicle] = useState<string | null>(null);

  // Filter stops according to corridor if active
  const corridors = Array.from(new Set(stops.map(s => s.corridor)));

  const displayStops = activeCorridorFilter === 'all' 
    ? stops 
    : stops.filter(s => s.corridor === activeCorridorFilter);

  // SVG coordinate transformation for Singapore central area
  // Min Lat: 1.25, Max Lat: 1.34; Min Lng: 103.75, Max Lng: 103.95
  const getCoordinates = (lat: number, lng: number) => {
    // Map bounding box: lng 103.75 -> 103.95 (width 0.2), lat 1.25 -> 1.34 (height 0.09)
    const x = ((lng - 103.75) / 0.20) * 580 + 30;
    // Invert y because SVG y goes down
    const y = 380 - ((lat - 1.25) / 0.09) * 320;
    return { x: Math.max(30, Math.min(610, x)), y: Math.max(30, Math.min(370, y)) };
  };

  const currentCoords = getCoordinates(selectedStop.lat, selectedStop.lng);

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      
      {/* Map Panel Header */}
      <div className="p-3 bg-[#1E293B] text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#E48CEE]" />
          <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-100">
            Corridor Telemetry & Rail Links
          </span>
        </div>

        {/* Quick Corridor Selection */}
        <div className="flex items-center gap-1">
          <select
            value={activeCorridorFilter}
            onChange={(e) => setActiveCorridorFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded text-xs px-2 py-1 text-slate-200 focus:outline-none focus:border-[#E48CEE]"
          >
            <option value="all">All Corridors (Singapore Mesh)</option>
            {corridors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Toolbar Controls */}
      <div className="px-3 py-1.5 bg-slate-50 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMrtLayers(!showMrtLayers)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
              showMrtLayers
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            {showMrtLayers ? <Eye className="w-3 h-3 text-sky-400" /> : <EyeOff className="w-3 h-3" />}
            MRT Grid
          </button>

          <button
            type="button"
            onClick={() => setShowTrafficCongestion(!showTrafficCongestion)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
              showTrafficCongestion
                ? 'bg-emerald-900 text-white border-emerald-800'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            Speed Flow
          </button>
        </div>

        {selectedServiceNo && (
          <div className="flex items-center gap-1.5 text-[11px] bg-purple-100 text-[#6A1A78] px-2 py-0.5 rounded-full font-bold">
            <span>Tracking Service {selectedServiceNo}</span>
            <button
              type="button"
              onClick={onClearSelectedService}
              className="text-purple-600 hover:text-purple-900 underline font-normal"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* SVG Interactive Transit Map Canvas */}
      <div className="relative flex-1 bg-[#F8FAFC] overflow-hidden min-h-[300px] flex items-center justify-center">
        
        {/* Subtle Map Grid lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <svg 
          viewBox="0 0 640 400" 
          className="w-full h-full object-contain select-none"
        >
          {/* Decorative Coastline / Waterway contours for Singapore Downtown & Marina */}
          <path
            d="M 20 370 Q 180 360 280 340 T 440 330 T 620 370"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="8"
            opacity="0.4"
          />
          <text x="460" y="375" fill="#94A3B8" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">
            SINGAPORE STRAIT / MARINA BAY
          </text>

          {/* Major MRT Trunk Rails if toggled */}
          {showMrtLayers && (
            <g opacity="0.65">
              {/* North South Line (Red) */}
              <path
                d="M 120 40 L 160 120 L 260 210 L 330 240 L 360 280"
                fill="none"
                stroke="#D42E12"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              {/* East West Line (Green) */}
              <path
                d="M 60 210 L 230 220 L 350 250 L 450 210 L 590 190"
                fill="none"
                stroke="#009640"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              {/* Downtown Line (Blue) */}
              <path
                d="M 170 140 L 290 200 L 370 240 L 410 200 L 530 195"
                fill="none"
                stroke="#005EC4"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="3 3"
              />
              {/* Circle Line (Orange) */}
              <path
                d="M 140 230 Q 250 170 380 200 T 360 300 Q 260 330 190 310"
                fill="none"
                stroke="#FA9E0D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </g>
          )}

          {/* Bus Corridor Paths */}
          {/* Orchard to Raffles/Downtown Trunk Corridor */}
          <path
            d="M 230 215 Q 280 220 330 238 T 390 250 T 450 220"
            fill="none"
            stroke={selectedServiceNo ? '#94A3B8' : '#6A1A78'}
            strokeWidth={selectedServiceNo ? '3' : '4.5'}
            strokeLinecap="round"
          />

          {/* Chinatown / HarbourFront Connector */}
          <path
            d="M 290 245 Q 310 280 250 310"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Congestion flow heatmap overlay */}
          {showTrafficCongestion && (
            <g opacity="0.7">
              {/* Heavy delay segment near Orchard */}
              <path
                d="M 270 220 L 320 235"
                fill="none"
                stroke="#D8232A"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Free-flow green segments */}
              <path
                d="M 330 238 L 410 245"
                fill="none"
                stroke="#16A34A"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.7"
              />
            </g>
          )}

          {/* Render Transit Stop Nodes */}
          {displayStops.map(stop => {
            const { x, y } = getCoordinates(stop.lat, stop.lng);
            const isSelected = selectedStop.code === stop.code;
            const hasMrt = !!(stop.mrtTransfers && stop.mrtTransfers.length > 0);

            return (
              <g 
                key={stop.code}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectStop(stop)}
              >
                {/* Active Stop Pulse Glow */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="#6A1A78"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? '#6A1A78' : hasMrt ? '#0F172A' : '#FFFFFF'}
                  stroke={isSelected ? '#FFFFFF' : '#6A1A78'}
                  strokeWidth={isSelected ? '2.5' : '2'}
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.15))"
                />

                {/* Inner dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 4 : 2.5}
                  fill={isSelected ? '#FFFFFF' : hasMrt ? '#E48CEE' : '#6A1A78'}
                />

                {/* Stop Code Callout Tag */}
                <g transform={`translate(${x + 9}, ${y - 8})`}>
                  <rect
                    x="0"
                    y="0"
                    width={stop.code.length * 6 + 10}
                    height="14"
                    rx="3"
                    fill={isSelected ? '#6A1A78' : '#1E293B'}
                    opacity={isSelected ? 0.95 : 0.8}
                  />
                  <text
                    x="5"
                    y="10"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontFamily="Space Grotesk"
                    fontWeight="700"
                  >
                    {stop.code}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Active Live Bus Vehicle Indicators on Map */}
          {arrivals.slice(0, 4).map((svc, idx) => {
            // Position bus along corridor near stop coords
            const offset = (idx - 1.5) * 28;
            const bx = currentCoords.x - 30 + offset;
            const by = currentCoords.y - 15 - Math.sin(idx) * 18;

            return (
              <g 
                key={svc.serviceNo}
                className="cursor-pointer"
                onClick={() => setSelectedBusVehicle(svc.nextArrival.vehiclePlate)}
              >
                {/* Bus marker backdrop */}
                <rect
                  x={bx - 14}
                  y={by - 10}
                  width="28"
                  height="20"
                  rx="4"
                  fill={svc.serviceType === 'express' ? '#D8232A' : '#6A1A78'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                />
                <text
                  x={bx}
                  y={by + 4}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontFamily="Space Grotesk"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {svc.serviceNo}
                </text>
                {/* Movement radar pulse */}
                <circle
                  cx={bx}
                  cy={by}
                  r="16"
                  fill="none"
                  stroke={svc.serviceType === 'express' ? '#D8232A' : '#6A1A78'}
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Bus Telemetry Overlay HUD */}
        {selectedBusVehicle && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 text-white p-2.5 rounded-lg border border-slate-700 text-xs shadow-lg backdrop-blur-xs flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sky-400">{selectedBusVehicle}</span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">GPS Lock</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">Speed: 34 km/h &bull; Signal: -62dBm 5G NR</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBusVehicle(null)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Close HUD
            </button>
          </div>
        )}
      </div>

      {/* Real-time Telemetry Monitor Strip */}
      <div className="p-3 bg-slate-50 border-t border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#6A1A78]" />
            Corridor Telemetry Monitor
          </span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
            LTA SGT Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-1.5 bg-white rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 block">Avg Commercial Speed</span>
            <span className="font-display font-bold text-slate-800">24.8 km/h</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 block">Corridor Flow Index</span>
            <span className="font-display font-bold text-emerald-600">Optimal 92%</span>
          </div>
          <div className="p-1.5 bg-white rounded border border-slate-200">
            <span className="text-[10px] text-slate-400 block">GPS Polling Jitter</span>
            <span className="font-display font-bold text-slate-800">&plusmn;0.8s</span>
          </div>
        </div>
      </div>

    </div>
  );
};
