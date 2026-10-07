import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  AlertTriangle, 
  Bus, 
  Send, 
  Download, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Activity,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { BusServiceArrival, TransitDisruption } from '../types/transit';

interface DispatcherFleetViewProps {
  arrivals: BusServiceArrival[];
  stopName: string;
  stopCode: string;
  onAddDisruption: (disruption: TransitDisruption) => void;
  onExportCsv: () => void;
}

export const DispatcherFleetView: React.FC<DispatcherFleetViewProps> = ({
  arrivals,
  stopName,
  stopCode,
  onAddDisruption,
  onExportCsv
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'warning' | 'info' | 'critical'>('warning');
  const [selectedServices, setSelectedServices] = useState<string[]>(['65']);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const newAlert: TransitDisruption = {
      id: `disp-${Date.now()}`,
      severity: broadcastSeverity,
      title: broadcastTitle,
      affectedServices: selectedServices.length > 0 ? selectedServices : ['All'],
      affectedCorridor: `${stopName} (${stopCode})`,
      timestamp: 'Just now',
      message: broadcastMessage
    };

    onAddDisruption(newAlert);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const toggleServiceSelect = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter(s => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              OCC STATION CONTROLLER & FLEET DISPATCH
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active monitoring node: <strong className="text-slate-800">{stopName} ({stopCode})</strong> &bull; Telemetry Mesh Frequency: 1 Hz
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-2 bg-[#1E293B] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Fleet Telemetry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Headway Bunching Alert Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>AUTOMATED HEADWAY SPACING REGULATION</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
              ALGO ACTIVE
            </span>
          </div>
          <p className="text-amber-800 leading-relaxed text-xs">
            Service 65 vehicles (SBS3221U and SG5920C) gap is currently 4.1 minutes. Telemetry suggests holding lead bus for 45 seconds at Dhoby Ghaut to preserve optimal 7-minute passenger service headway.
          </p>
        </div>
      </div>

      {/* Real-time Fleet Roster Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#6A1A78]" />
            ACTIVE FLEET ROSTER & SCHEDULE ADHERENCE
          </h3>
          <span className="text-xs text-slate-500">
            {arrivals.length * 3} Fleet Units Tracked
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Vehicle Plate</th>
                <th className="py-2.5 px-3">Chassis Model</th>
                <th className="py-2.5 px-3">Deck</th>
                <th className="py-2.5 px-3">ETA</th>
                <th className="py-2.5 px-3">Schedule Variance</th>
                <th className="py-2.5 px-3">Load Factor</th>
                <th className="py-2.5 px-3">Crowding</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arrivals.flatMap((svc) => [
                { svc, arr: svc.nextArrival, tier: '1st' },
                { svc, arr: svc.subsequentArrival, tier: '2nd' }
              ]).map(({ svc, arr, tier }, idx) => {
                const variance = arr.scheduleVarianceSeconds;
                const isLate = variance < 0;

                return (
                  <tr key={`${svc.serviceNo}-${arr.vehiclePlate}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-2.5 px-3 font-display font-bold text-sm text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-[#6A1A78] text-white">
                        {svc.serviceNo}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {arr.vehiclePlate}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[180px]">
                      {arr.vehicleModel}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {arr.deckType}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-display font-bold text-slate-900 tabular-nums">
                      {arr.etaMinutes}m {arr.etaSeconds}s ({tier})
                    </td>

                    <td className="py-2.5 px-3 font-display tabular-nums font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        Math.abs(variance) <= 20 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isLate 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-sky-100 text-sky-800'
                      }`}>
                        {variance > 0 ? `+${variance}s Ahead` : `${variance}s Delayed`}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              arr.passengerLoadPct > 80 ? 'bg-[#DC2626]' :
                              arr.passengerLoadPct > 50 ? 'bg-[#D97706]' : 'bg-[#16A34A]'
                            }`}
                            style={{ width: `${arr.passengerLoadPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-700 font-bold">{arr.passengerLoadPct}%</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        arr.capacity === 'seats' ? 'text-emerald-700 bg-emerald-100' :
                        arr.capacity === 'standing' ? 'text-amber-700 bg-amber-100' :
                        'text-red-700 bg-red-100'
                      }`}>
                        {arr.capacity}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Holding signal dispatched to On-Board Unit for ${arr.vehiclePlate}.`)}
                        className="px-2 py-1 bg-slate-200 hover:bg-[#6A1A78] hover:text-white text-slate-700 rounded text-[10px] font-semibold transition-colors"
                      >
                        Signal OBU
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Broadcast Composer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#6A1A78]" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              OPERATIONS ADVISORY BROADCASTER (LIVE FEED TO COMMUTER SCREENS)
            </h3>
          </div>
          {broadcastSuccess && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Broadcast pushed live to all displays</span>
            </div>
          )}
        </div>

        <form onSubmit={handleBroadcastSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Alert Severity</label>
              <select
                value={broadcastSeverity}
                onChange={(e) => setBroadcastSeverity(e.target.value as 'warning' | 'info' | 'critical')}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#6A1A78]"
              >
                <option value="warning">Warning (Yellow/Amber)</option>
                <option value="critical">Critical (Red Disruption)</option>
                <option value="info">Informational Notice (Blue)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Advisory Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g., Heavy Traffic Dwell along Bras Basah Road"
                required
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#6A1A78]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase">Affected Services Tagged</label>
            <div className="flex flex-wrap gap-1.5">
              {['65', '147', '190', '502', '10e', '222', '851', '124', '174'].map(svc => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => toggleServiceSelect(svc)}
                  className={`px-2 py-0.5 rounded text-xs font-display font-bold transition-all ${
                    selectedServices.includes(svc)
                      ? 'bg-[#6A1A78] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase">Full Bulletin Message</label>
            <textarea
              rows={2}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g., Due to unexpected lane blockage near stop 04121, services 65 and 190 are delayed by 4-6 minutes. Commuters advised to utilize Downtown MRT line."
              required
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#6A1A78]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#6A1A78] hover:bg-[#541460] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Advisory to Network</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
