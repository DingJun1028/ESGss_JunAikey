
import React, { useState, useRef, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon, 
  Activity, Puzzle, Tag, HelpCircle
} from 'lucide-react';
import { OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence, OmniEsgColor, UniversalLabel } from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { analyzeDataAnomaly } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { GLOBAL_GLOSSARY } from '../constants';

// Import Minimal Atomic Components
import { DataLinkIndicator } from './minimal/DataLinkIndicator';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { QuantumValueEditor } from './minimal/QuantumValueEditor';
import { InsightTooltip } from './minimal/InsightTooltip';

// Static Theme Configuration (Optimization: Defined once outside component)
const THEMES = {
  emerald: { 
    border: 'group-hover:border-emerald-500/40', 
    glow: 'bg-emerald-500', 
    text: 'text-emerald-400', 
    iconBg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20' 
  },
  gold: { 
    border: 'group-hover:border-amber-500/40', 
    glow: 'bg-amber-500', 
    text: 'text-amber-400', 
    iconBg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20' 
  },
  purple: { 
    border: 'group-hover:border-purple-500/40', 
    glow: 'bg-purple-500', 
    text: 'text-purple-400', 
    iconBg: 'bg-purple-500/10',
    gradient: 'from-purple-500/20' 
  },
  blue: { 
    border: 'group-hover:border-blue-500/40', 
    glow: 'bg-blue-500', 
    text: 'text-blue-400', 
    iconBg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20' 
  },
  slate: { 
    border: 'group-hover:border-slate-400/40', 
    glow: 'bg-slate-400', 
    text: 'text-slate-400', 
    iconBg: 'bg-slate-500/10',
    gradient: 'from-slate-500/20' 
  },
};

const getTheme = (color: OmniEsgColor) => THEMES[color] || THEMES.emerald;

interface OmniEsgCellBaseProps {
  id?: string;
  mode: OmniEsgMode;
  label?: string | UniversalLabel;
  value?: string | number;
  subValue?: string;
  confidence?: OmniEsgConfidence;
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  traits?: OmniEsgTrait[];
  tags?: string[];
  icon?: LucideIcon;
  color?: OmniEsgColor;
  className?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  onAiAnalyze?: () => void;
  onClick?: () => void;
}

type OmniEsgCellProps = OmniEsgCellBaseProps & InjectedProxyProps;

// Helper to check if string matches glossary key (Memoized inside useMemo usually, or kept static if data is static)
const resolveLabel = (label: string | UniversalLabel): UniversalLabel => {
    if (typeof label === 'object') return label;
    // Attempt to match against glossary keys
    // Optimization: Quick check if string exists in glossary keys to avoid Object.keys overhead every time
    if (GLOBAL_GLOSSARY[label]) {
         const entry = GLOBAL_GLOSSARY[label];
         return {
            text: label,
            definition: entry.definition,
            formula: entry.formula,
            rationale: entry.rationale
        };
    }
    
    // Fallback: substring match (slower, use sparingly or optimize glossary structure)
    const glossaryKey = Object.keys(GLOBAL_GLOSSARY).find(key => label.includes(key));
    if (glossaryKey) {
        const entry = GLOBAL_GLOSSARY[glossaryKey];
        return {
            text: label,
            definition: entry.definition,
            formula: entry.formula,
            rationale: entry.rationale
        };
    }
    
    return { text: label };
};

const OmniEsgCellBase: React.FC<OmniEsgCellProps> = (props) => {
  const { 
    mode, label, value, subValue, confidence = 'high', verified = false, 
    loading = false, dataLink, traits = [], tags = [], icon: Icon, color = 'emerald', className = '', trend, onClick, onAiAnalyze,
    adaptiveTraits = [], trackInteraction, isHighFrequency, isAgentActive
  } = props;
  
  const { addToast } = useToast();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Optimization: Memoize label resolution
  const resolvedLabel = useMemo(() => resolveLabel(label || 'Unknown'), [label]);
  const labelText = resolvedLabel.text;
  const isRichLabel = !!(resolvedLabel.definition || resolvedLabel.formula || resolvedLabel.rationale);
  
  // Optimization: Memoize active traits combination
  const activeTraits = useMemo(() => Array.from(new Set([...traits, ...adaptiveTraits])), [traits, adaptiveTraits]);

  // Derived state (Booleans) - Fast enough to compute, no memo needed unless expensive
  const isGapFilling = activeTraits.includes('gap-filling');
  const isTagging = activeTraits.includes('tagging');
  const isPerformance = activeTraits.includes('performance');
  const isLearning = activeTraits.includes('learning') || isAgentActive; 
  const isEvolution = activeTraits.includes('evolution');
  const isBridging = activeTraits.includes('bridging');
  const isSeamless = activeTraits.includes('seamless');

  const theme = getTheme(color);

  const handleInternalAiTrigger = () => {
    trackInteraction?.('ai-trigger');
    addToast('info', `Universal Agent analyzing node: ${labelText}...`, 'JunAiKey');
    // ... async logic kept separate from render
    analyzeDataAnomaly(
        labelText || 'Unknown Metric',
        value || 'N/A',
        "Historical Avg",
        "Agent invoked via Neural Link.",
        'en-US'
    ).then(() => {
        addToast('success', 'Agent memory updated. Traits evolved.', 'JunAiKey');
    }).catch(() => {
        addToast('error', 'Agent disconnected.', 'System Error');
    });
  };

  const handleEditStart = () => trackInteraction?.('edit');
  const handleEditUpdate = (newValue: string | number) => {
    trackInteraction?.('edit', newValue);
    addToast('success', `Value updated. Neural weights adjusted.`, 'Universal Intelligence');
  };

  const handleMouseEnter = () => { if (isRichLabel) { setIsTooltipVisible(true); trackInteraction?.('hover'); } };
  const handleMouseLeave = () => setIsTooltipVisible(false);
  const handleTouchStart = () => {
      if (!isRichLabel) return;
      touchTimer.current = setTimeout(() => { setIsTooltipVisible(true); trackInteraction?.('hover'); }, 600);
  };
  const handleTouchEnd = () => {
      if (touchTimer.current) { clearTimeout(touchTimer.current); touchTimer.current = null; }
      if (isTooltipVisible) setTimeout(() => setIsTooltipVisible(false), 2500);
  };

  if (loading) return <div className={`h-24 w-full bg-white/5 animate-pulse rounded-xl ${className}`} />;

  const wrapperClasses = `
    group relative overflow-visible transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-celestial-purple/50
    ${isSeamless ? 'bg-transparent border-none' : `backdrop-blur-xl bg-slate-900/40 border ${isGapFilling ? 'border-dashed border-amber-500/30' : 'border-white/5'} hover:bg-white/5`}
    ${!isSeamless && theme.border}
    ${isSeamless ? '' : 'shadow-lg shadow-black/20 hover:shadow-2xl'}
    ${isHighFrequency ? 'ring-1 ring-celestial-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : ''}
    ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
    ${className}
  `;

  // Sub-components memoized to prevent re-creation
  const LabelWithIcon = (
      <div 
        className="flex items-center gap-2 relative select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
          <span className={`text-gray-400 text-sm font-medium tracking-wide transition-colors ${isRichLabel ? 'border-b border-dashed border-gray-600 hover:text-white cursor-help' : ''}`}>
              {labelText}
          </span>
          {isRichLabel && (
              <HelpCircle className="w-3 h-3 text-gray-600 group-hover:text-celestial-gold transition-colors opacity-50 group-hover:opacity-100" />
          )}
          {isRichLabel && <InsightTooltip label={resolvedLabel} isVisible={isTooltipVisible} />}
      </div>
  );

  const AgentIndicator = isLearning ? (
        <div className="absolute top-0 right-0 p-1">
            <div className="relative">
                <div className="absolute inset-0 bg-celestial-purple rounded-full animate-ping opacity-75" />
                <div className="relative w-2 h-2 bg-celestial-purple rounded-full border border-white" title="Universal Agent Active" />
            </div>
        </div>
  ) : null;

  if (mode === 'card') {
    return (
      <div className={wrapperClasses} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
        {AgentIndicator}
        {!isSeamless && (
          <>
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl pointer-events-none ${theme.glow}`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
          </>
        )}
        
        {isBridging && (
          <div className="pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2">
                  {LabelWithIcon}
                  <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {dataLink && <DataLinkIndicator type={dataLink} />}
                 {isGapFilling && (
                   <div className="flex items-center gap-1.5 text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-dashed border-amber-500/30">
                      <Puzzle className="w-3 h-3" />
                      <span className="font-semibold tracking-wider">AI FILL</span>
                   </div>
                 )}
                 {isTagging && tags.map(tag => (
                   <span key={tag} className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-gray-400">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                   </span>
                 ))}
               </div>
            </div>

            <div className={`p-2.5 rounded-xl border border-white/5 ${theme.iconBg} ${theme.text} transition-all duration-300 group-hover:scale-110 shadow-inner`}>
               {Icon ? <Icon className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-4 mb-1">
             <QuantumValueEditor 
                value={value || 0} 
                theme={theme} 
                onEditStart={handleEditStart} 
                onUpdate={handleEditUpdate}
             />
          </div>
          
          <div className="flex items-end justify-between">
             <div>
                {subValue && <p className="text-xs text-gray-500 font-medium mb-1">{subValue}</p>}
                <div className="flex items-center gap-2">
                   {trend ? (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${trend.direction === 'up' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                         {isPerformance && trend.direction === 'up' ? <TrendingUp className="w-3 h-3 animate-pulse text-celestial-gold" /> : (trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                         {Math.abs(trend.value)}%
                      </span>
                   ) : <span className="text-xs text-gray-600 flex items-center gap-1"><Minus className="w-3 h-3"/> Stable</span>}
                </div>
             </div>
             <ConfidenceIndicator level={confidence} verified={verified} />
          </div>
        </div>
        
        {isEvolution && (
           <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:rotate-45 z-0">
              <Activity className="w-32 h-32 text-white" />
           </div>
        )}
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className={`${wrapperClasses} p-3 rounded-xl flex items-center justify-between`} onClick={onClick} role={onClick ? "button" : undefined}>
          {AgentIndicator}
          <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border border-white/5 ${theme.iconBg} ${theme.text} relative`}>
                  {Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              </div>
              <div>
                  <div className="flex items-center gap-2">
                    {LabelWithIcon}
                    <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                      {subValue && <span className="text-gray-500">{subValue}</span>}
                      {dataLink && <DataLinkIndicator type={dataLink} />}
                  </div>
              </div>
          </div>
          <div className="text-right">
              <div className={`text-sm font-bold font-mono ${theme.text} ${isGapFilling ? 'animate-pulse' : ''}`}>{value}</div>
              <div className="flex justify-end mt-1 items-center gap-1">
                  <ConfidenceIndicator level={confidence} verified={verified} compact />
              </div>
          </div>
      </div>
    );
  }

  if (mode === 'cell') {
      return (
        <div className={`${wrapperClasses} p-4 rounded-xl flex flex-col justify-between h-full`} onClick={onClick} role={onClick ? "button" : undefined}>
            {AgentIndicator}
            <div className="flex justify-between items-start">
               <div className="relative">
                   {LabelWithIcon}
               </div>
               <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} label={labelText} />
            </div>
            <div className={`text-xl font-bold text-white mt-2 ${theme.text} ${isGapFilling ? 'opacity-80' : ''}`}>{value}</div>
             {trend && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1 text-[10px]">
                   <TrendingUp className="w-3 h-3 text-emerald-400" />
                   <span className="text-emerald-400">+{trend.value}%</span>
                </div>
             )}
        </div>
      );
  }
  
  if (mode === 'badge') {
     return (
        <div className="flex items-center gap-2 group/badge" aria-label={`Badge: ${value}`}>
           <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
               <div className={`h-full absolute left-0 top-0 rounded-full transition-all duration-1000 ${theme.glow} ${confidence === 'high' ? 'w-full' : 'w-1/2'}`} />
           </div>
           <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={handleInternalAiTrigger} />
        </div>
     );
  }

  return null;
};

export const OmniEsgCell = withUniversalProxy(OmniEsgCellBase);
