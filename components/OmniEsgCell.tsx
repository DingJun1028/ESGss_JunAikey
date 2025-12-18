
import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, RefreshCw, Activity, 
  ChevronRight, ArrowUpRight, Search, GitBranch
} from 'lucide-react';
/* Added OmniEsgTrait to imports */
import { OmniEsgConfidence, OmniEsgDataLink, OmniEsgMode, OmniEsgColor, UniversalLabel, OmniEsgTrait } from '../types';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';

interface OmniEsgCellProps {
  id?: string;
  mode: OmniEsgMode;
  label?: string | UniversalLabel;
  value?: string | number;
  subValue?: string;
  confidence?: OmniEsgConfidence;
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  tags?: string[];
  /* Added traits property to interface */
  traits?: OmniEsgTrait[];
  icon?: any;
  color?: OmniEsgColor;
  className?: string;
  trend?: { value: number; direction: 'up' | 'down' | 'neutral'; };
  onAiAnalyze?: () => void;
  onClick?: () => void;
}

export const OmniEsgCell: React.FC<OmniEsgCellProps> = ({ 
    /* Destructured traits from props */
    mode, label, value, subValue, confidence = 'high', verified = false, 
    loading = false, dataLink, tags = [], traits = [], icon: Icon, color = 'emerald', className = '', trend, onClick
}) => {
  const [showInference, setShowInference] = useState(false);
  const { agentMode } = useUniversalAgent();

  const labelText = typeof label === 'string' ? label : label?.text || 'Unknown Node';

  if (loading) return (
    <div className="h-full w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
  );

  const colors = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    gold: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  if (mode === 'card') {
    return (
      <div 
        onClick={onClick}
        className={`group relative glass-card p-5 rounded-[1.5rem] flex flex-col justify-between h-full cursor-pointer overflow-hidden transition-all duration-500 ${className}`}
      >
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/40 transition-all" />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {/* HIGH LUMINANCE LABEL */}
              <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md">{labelText}</span>
              {verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tighter">{value ?? '---'}</span>
              <span className="text-[10px] font-mono text-gray-400">{subValue}</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-xl ${colors[color]} border shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3`}>
            {Icon ? <Icon className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-3">
              {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trend.direction === 'up' ? <ArrowUpRight className="w-3 h-3" /> : '↓'}
                  {trend.value}%
                </div>
              )}
              <ConfidenceIndicator level={confidence} compact />
            </div>
            <div className="flex gap-1">
               {tags.slice(0, 1).map(tag => (
                 <span key={tag} className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-300 uppercase">{tag}</span>
               ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`group glass-card px-4 py-3 rounded-xl flex items-center gap-4 hover:border-celestial-purple/30 cursor-pointer ${className}`}
    >
      <div className={`p-2 rounded-lg ${colors[color]} border shrink-0`}>
        {Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[11px] font-bold text-white truncate">{labelText}</span>
          <span className="text-sm font-black text-white">{value ?? '---'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-400 uppercase tracking-wider">{subValue}</span>
          <div className="flex items-center gap-1">
             <ConfidenceIndicator level={confidence} compact />
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-celestial-purple group-hover:translate-x-1 transition-all" />
    </div>
  );
};
