
import React, { useState } from 'react';
import { OmniEsgCell } from './OmniEsgCell';
import { MapPin, Wind, Zap, AlertTriangle, Factory } from 'lucide-react';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';

interface Location {
  id: string;
  name: string;
  region: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  status: 'optimal' | 'warning' | 'critical';
  metrics: {
    co2: string;
    energy: string;
    output: string;
  };
}

const LOCATIONS: Location[] = [
  { id: 'tpe', name: 'Taipei HQ', region: 'APAC', x: 82, y: 45, status: 'optimal', metrics: { co2: '120t', energy: '450kWh', output: '100%' } },
  { id: 'ber', name: 'Berlin Plant', region: 'EMEA', x: 52, y: 32, status: 'optimal', metrics: { co2: '340t', energy: '890kWh', output: '98%' } },
  { id: 'aus', name: 'Austin R&D', region: 'NA', x: 22, y: 42, status: 'warning', metrics: { co2: '85t', energy: '320kWh', output: '85%' } },
  { id: 'hcm', name: 'Ho Chi Minh', region: 'APAC', x: 78, y: 55, status: 'critical', metrics: { co2: '560t', energy: '1.2MWh', output: '110%' } },
];

// ----------------------------------------------------------------------
// Universal Agent: Geo-Spatial Node
// ----------------------------------------------------------------------
interface MapPinProps extends InjectedProxyProps {
    location: Location;
    onClick: (loc: Location) => void;
}

const MapPinBase: React.FC<MapPinProps> = ({ location, onClick, adaptiveTraits, trackInteraction, isAgentActive }) => {
    
    // Agent Traits Visuals
    const isEvolved = adaptiveTraits?.includes('evolution'); // High interaction
    const isOptimizing = adaptiveTraits?.includes('optimization'); // AI Working
    
    const statusColor = location.status === 'critical' ? 'bg-red-500' : location.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
    
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        trackInteraction?.('click', location);
        onClick(location);
    };

    return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          onClick={handleClick}
        >
          {/* Pulse Ring (Agent Activity) */}
          <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${statusColor} ${isOptimizing ? 'duration-500' : 'duration-1000'}`} />
          
          {/* Core Dot (Physical Manifestation) */}
          <div className={`
              relative rounded-full border-2 border-white shadow-lg transition-transform 
              ${statusColor}
              ${isEvolved ? 'w-6 h-6 scale-110' : 'w-4 h-4 group-hover/marker:scale-125'}
          `} />

          {/* AI Awareness Indicator */}
          {isAgentActive && (
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-celestial-purple rounded-full border border-white animate-bounce" />
          )}

          {/* Label */}
          <div className={`
              absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-white/20 backdrop-blur-md z-20
              ${isEvolved ? 'opacity-100' : 'opacity-0 group-hover/marker:opacity-100'}
          `}>
              {location.name}
          </div>
        </div>
    );
};

const GeoSpatialAgent = withUniversalProxy(MapPinBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const GlobalOperations: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  return (
    <div className="w-full h-[500px] relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group select-none">
      
      {/* Map Background (Abstract Dot Matrix) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <svg width="100%" height="100%" className="fill-celestial-blue">
            <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
         </svg>
         {/* Simplified World Map Shape (SVG Path) */}
         <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full text-white/10 fill-current">
             <path d="M150,150 Q200,100 250,150 T350,150 T450,100 T550,150 T650,120 T750,150 T850,200 T950,250 V400 H50 V200 Q100,180 150,150 Z" /> 
             <text x="500" y="250" textAnchor="middle" className="text-[100px] font-bold opacity-5 pointer-events-none">GLOBAL OPS</text>
         </svg>
      </div>

      {/* Radar Scan Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-celestial-emerald/5 to-transparent w-[50%] h-full animate-[scan_4s_linear_infinite] pointer-events-none border-r border-celestial-emerald/20 blur-sm" />

      {/* Location Markers - Now Agents */}
      {LOCATIONS.map((loc) => (
        <GeoSpatialAgent 
            key={loc.id}
            id={`geo-${loc.id}`} // Brain ID
            label={loc.name}
            location={loc}
            onClick={setSelectedLoc}
        />
      ))}

      {/* Data Overlay Panel */}
      {selectedLoc && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass-panel p-4 rounded-xl border-white/20 animate-fade-in backdrop-blur-xl bg-slate-900/90 z-30">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Factory className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{selectedLoc.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {selectedLoc.region}
                        </div>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedLoc(null); }} className="text-gray-400 hover:text-white">
                    ×
                </button>
            </div>

            <div className="space-y-3">
                <OmniEsgCell 
                    id={`metric-co2-${selectedLoc.id}`}
                    mode="list" 
                    label="Carbon Emission" 
                    value={selectedLoc.metrics.co2} 
                    icon={Wind} 
                    color={selectedLoc.status === 'critical' ? 'blue' : 'emerald'} 
                    subValue="Real-time IoT"
                    traits={['bridging']}
                />
                <OmniEsgCell 
                    id={`metric-eng-${selectedLoc.id}`}
                    mode="list" 
                    label="Energy Usage" 
                    value={selectedLoc.metrics.energy} 
                    icon={Zap} 
                    color="gold" 
                    subValue="Peak Load"
                />
                {selectedLoc.status !== 'optimal' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-xs font-bold text-red-400">Anomaly Detected</div>
                            <p className="text-[10px] text-red-200 leading-tight mt-1">
                                Unusual energy spike detected in Sector 7. Recommendation: Check HVAC systems.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* HUD Overlay Elements */}
      <div className="absolute top-4 left-4 flex gap-4 text-[10px] text-celestial-blue font-mono opacity-70">
          <div>LAT: 24.08 N</div>
          <div>LNG: 120.55 E</div>
          <div className="animate-pulse">SIGNAL: ONLINE</div>
      </div>
    </div>
  );
};
