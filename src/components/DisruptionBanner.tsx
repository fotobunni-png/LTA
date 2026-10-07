import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronRight, X, ChevronDown } from 'lucide-react';
import { TransitDisruption } from '../types/transit';

interface DisruptionBannerProps {
  disruptions: TransitDisruption[];
  onSelectService?: (serviceNo: string) => void;
}

export const DisruptionBanner: React.FC<DisruptionBannerProps> = ({
  disruptions,
  onSelectService
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed || disruptions.length === 0) return null;

  const primary = disruptions[0];

  return (
    <div className="bg-[#FFF1F2] border-b border-[#FCA5A5] text-[#991B1B] transition-all">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[#D8232A] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold tracking-tight text-[#991B1B]">
                TRANSIT ADVISORY:
              </span>
              <span className="font-semibold text-slate-800">
                {primary.title}
              </span>
              <span className="text-slate-600 hidden md:inline">
                ({primary.affectedCorridor})
              </span>
              <span className="text-slate-500 text-[11px]">
                &bull; {primary.timestamp}
              </span>
              
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">Affected:</span>
                {primary.affectedServices.map(svc => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => onSelectService && onSelectService(svc)}
                    className="px-1.5 py-0.2 bg-[#D8232A] hover:bg-[#BB0119] text-white rounded text-[11px] font-display font-bold cursor-pointer transition-colors"
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-0.5 text-xs font-semibold text-[#991B1B] hover:text-[#7F1D1D] px-2 py-0.5 rounded hover:bg-red-100 transition-colors"
            >
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-red-100 transition-colors"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-red-200 text-xs text-slate-700 space-y-2">
            <p className="leading-relaxed bg-white/70 p-2.5 rounded border border-red-200/60">
              {primary.message}
            </p>
            {disruptions.length > 1 && (
              <div className="space-y-1.5">
                <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
                  Additional Notices ({disruptions.length - 1}):
                </div>
                {disruptions.slice(1).map(d => (
                  <div key={d.id} className="p-2 rounded bg-white/60 border border-slate-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">{d.title} ({d.affectedCorridor})</div>
                      <div className="text-slate-600 text-[11px]">{d.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
