import React from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Star, 
  Compass, 
  ShieldCheck,
  Flame
} from 'lucide-react';
import { BusStop, FilterCategory } from '../types/transit';
import { getMrtLineColor } from '../utils/transitEngine';

interface StopSearchPanelProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  favorites: string[];
  onToggleFavoriteStop: (code: string) => void;
}

export const StopSearchPanel: React.FC<StopSearchPanelProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  favorites,
  onToggleFavoriteStop
}) => {
  // Filter logic
  const filteredStops = stops.filter(stop => {
    // Text search matching code, name, road, or service numbers
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query || (
      stop.code.toLowerCase().includes(query) ||
      stop.name.toLowerCase().includes(query) ||
      stop.road.toLowerCase().includes(query) ||
      stop.corridor.toLowerCase().includes(query) ||
      stop.services.some(s => s.toLowerCase().includes(query))
    );

    if (!matchesQuery) return false;

    // Filter category
    if (activeFilter === 'favorites') {
      return favorites.includes(stop.code);
    }
    return true;
  });

  const filterChips: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'trunk', label: 'Trunk Routes' },
    { id: 'express', label: 'Express (Red)' },
    { id: 'feeder', label: 'Feeder Loops' },
    { id: 'seats', label: 'Seats Avail' },
    { id: 'low-wait', label: '< 5m Wait' },
    { id: 'favorites', label: `Starred (${favorites.length})` }
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      
      {/* Top Header & Search Area */}
      <div className="p-3.5 border-b border-[#E2E8F0] bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#6A1A78]" />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-700">
              Corridor Hubs & Stops
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
            {filteredStops.length} stops active
          </span>
        </div>

        {/* Input Field with civic styling */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search code '09048', road, landmark or svc..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border-[1.5px] border-[#CBD5E1] rounded-lg text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:border-[#6A1A78] focus:ring-4 focus:ring-[#6A1A78]/15 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips (Pill shape rounded-full) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {filterChips.map(chip => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onFilterChange(chip.id)}
                className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-all text-[11px] cursor-pointer ${
                  isActive
                    ? 'bg-[#6A1A78] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-slate-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Starred Quick Bar if any */}
      {favorites.length > 0 && activeFilter !== 'favorites' && (
        <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            Saved:
          </span>
          <div className="flex items-center gap-1.5">
            {stops.filter(s => favorites.includes(s.code)).map(fav => (
              <button
                key={fav.code}
                type="button"
                onClick={() => onSelectStop(fav)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors shrink-0 ${
                  selectedStop.code === fav.code
                    ? 'bg-[#6A1A78] text-white border-[#6A1A78]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {fav.code} ({fav.name.split('/')[0].trim()})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stop Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
        {filteredStops.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <MapPin className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium">No bus stops found matching &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => { onSearchChange(''); onFilterChange('all'); }}
              className="text-xs text-[#6A1A78] font-bold underline hover:text-[#541460]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredStops.map((stop) => {
            const isSelected = selectedStop.code === stop.code;
            const isFav = favorites.includes(stop.code);

            return (
              <div
                key={stop.code}
                onClick={() => onSelectStop(stop)}
                className={`p-3 cursor-pointer transition-all border-l-4 relative ${
                  isSelected
                    ? 'bg-[#F3E8F5] border-l-[#6A1A78] shadow-sm'
                    : 'bg-white hover:bg-[#F8FAFC] border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    
                    {/* Stop Code Pill & Corridor */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-display font-bold text-xs px-1.5 py-0.5 rounded bg-[#1E293B] text-white tracking-wide">
                        {stop.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight truncate">
                        {stop.corridor}
                      </span>
                      {stop.sheltered && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Sheltered
                        </span>
                      )}
                    </div>

                    {/* Stop Name & Road */}
                    <h3 className={`font-display text-sm font-bold truncate leading-snug ${isSelected ? 'text-[#6A1A78]' : 'text-slate-900'}`}>
                      {stop.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {stop.road}
                    </p>

                    {/* MRT Transfer Badges */}
                    {stop.mrtTransfers && stop.mrtTransfers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {stop.mrtTransfers.map((mrt) => {
                          const col = getMrtLineColor(mrt.line);
                          return (
                            <span
                              key={mrt.stationCode}
                              style={{ backgroundColor: col.bg, color: col.text }}
                              className="text-[9px] font-display font-bold px-1.5 py-0.2 rounded shadow-xs"
                              title={`${col.name} Line - ${mrt.stationName}`}
                            >
                              {mrt.stationCode}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Services Chips */}
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                      {stop.services.slice(0, 6).map((svc) => (
                        <span
                          key={svc}
                          className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-display font-bold border border-slate-200"
                        >
                          {svc}
                        </span>
                      ))}
                      {stop.services.length > 6 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{stop.services.length - 6} more
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Bookmark Star Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavoriteStop(stop.code);
                    }}
                    title={isFav ? 'Remove from favorites' : 'Bookmark this stop'}
                    className="p-1 rounded text-slate-300 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                {isSelected && (
                  <div className="absolute right-2 top-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#6A1A78] animate-ping" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-[#E2E8F0] text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Real-time GPS tracking active</span>
        </div>
        <span className="font-semibold text-slate-600">SMRT &bull; SBST</span>
      </div>

    </div>
  );
};
