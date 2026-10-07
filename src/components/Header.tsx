import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Radio, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { ViewMode } from '../types/transit';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  onExportTelemetry: () => void;
  isLiveFeed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  soundEnabled,
  onToggleSound,
  autoRefresh,
  onToggleAutoRefresh,
  onManualRefresh,
  isRefreshing,
  onExportTelemetry,
  isLiveFeed = false
}) => {
  const [sgtTime, setSgtTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Singapore Time (UTC+8)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Singapore',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setSgtTime(now.toLocaleTimeString('en-SG', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-[#334155] shadow-md">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6A1A78] flex items-center justify-center text-white shadow-inner border border-white/20 shrink-0">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  SINGAPORE TRANSIT PULSE
                </h1>
                <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                  isLiveFeed 
                    ? 'bg-[#16A34A]/20 text-[#4ADE80] border-[#16A34A]/40' 
                    : 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveFeed ? 'bg-[#4ADE80] animate-ping' : 'bg-sky-400'}`} />
                  {isLiveFeed ? 'LTA DATAMALL LIVE (20s)' : 'LTA GATEWAY (20s)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Commuter Transit Mesh &bull; Fleet Telemetry &bull; SGT Hub
              </p>
            </div>
          </div>

          {/* SGT Clock & System Status */}
          <div className="hidden lg:flex items-center gap-4 bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#334155] text-xs">
            <div className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#E48CEE]" />
              <span className="text-slate-400">SGT:</span>
              <span className="font-display font-bold tabular-nums text-white tracking-wide">
                {sgtTime || '21:48:00'}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-600" />
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[11px] font-medium">DataMall v3.0 Synced</span>
            </div>
            <div className="h-3 w-px bg-slate-600" />
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Civic Grade</span>
            </div>
          </div>

          {/* Controls & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#1E293B] p-0.5 rounded-lg border border-[#334155]">
              <button
                type="button"
                onClick={() => onToggleViewMode('commuter')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'commuter'
                    ? 'bg-[#6A1A78] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Commuter
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('dispatcher')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                  viewMode === 'dispatcher'
                    ? 'bg-[#6A1A78] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                Dispatcher
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute arrival chimes' : 'Enable arrival chime alerts'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-[#6A1A78]/30 border-[#E48CEE]/40 text-[#E48CEE] hover:bg-[#6A1A78]/50'
                  : 'bg-[#1E293B] border-[#334155] text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Auto Refresh Toggle */}
            <button
              type="button"
              onClick={onToggleAutoRefresh}
              title={autoRefresh ? 'Auto-refresh active (30s)' : 'Auto-refresh paused'}
              className={`hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                autoRefresh
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#1E293B] border-[#334155] text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              Auto-Sync
            </button>

            {/* Manual Sync Button */}
            <button
              type="button"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="Manual refresh from LTA feed"
              className="p-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#E48CEE]' : ''}`} />
            </button>

            {/* Telemetry Export (Secondary Action) */}
            <button
              type="button"
              onClick={onExportTelemetry}
              title="Export live transit telemetry snapshot (CSV)"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Export</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
