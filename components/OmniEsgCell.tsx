
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon, 
  Activity, Puzzle, Tag, HelpCircle
} from 'lucide-react';
import { OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence, OmniEsgColor, UniversalLabel } from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { analyzeDataAnomaly } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { GLOBAL_GLOSSARY } from '../constants';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

import { DataLinkIndicator } from './minimal/DataLinkIndicator';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { QuantumValueEditor } from './minimal/QuantumValueEditor';
import { InsightTooltip } from './minimal/InsightTooltip';

const THEMES = {
  emerald: { 
    border: 'hover:border-emerald-500/40', 
    text: 'text-emerald-600', 
    iconBg: 'bg-emerald-50',
    lightText: 'text-emerald-700'
  },
  gold: { 
    border: 'hover:border-amber-500/40', 
    text: 'text-amber-600', 
    iconBg: 'bg-amber-50',
    lightText: 'text-amber-700'
  },
  purple: { 
    border: 'hover:border-blue-600/40', 
    text: 'text-blue-700', 
    iconBg: 'bg-blue-50',
    lightText: 'text-blue-800'
  },
  blue: { 
    border: 'hover:border-cyan-500/40', 
    text: 'text-cyan-600', 
    iconBg: 'bg-cyan-50',
    lightText: 'text-cyan-700'
  },
  slate: { 
    border: 'hover:border-slate-400/40', 
    text: 'text-slate-600', 
    iconBg: 'bg-slate-50',
    lightText: 'text-slate-700'
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
  trend?: { value: number; direction: 'up' | 'down' | 'neutral'; };
  onAiAnalyze?: () => void;
  onClick?: () => void;
}

type OmniEsgCellProps = OmniEsgCellBaseProps & InjectedProxyProps;

const resolveLabel = (label: string | UniversalLabel): UniversalLabel => {
    if (typeof label === 'object') return label;
    if (GLOBAL_GLOSSARY[label]) {
         const entry = GLOBAL_GLOSSARY[label];
         return { text: label, definition: entry.definition, formula: entry.formula, rationale: entry.rationale };
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
  const { themeMode } = useUniversalAgent();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const resolvedLabel = useMemo(() => resolveLabel(label || 'Unknown'), [label]);
  const labelText = resolvedLabel.text;
  const isRichLabel = !!(resolvedLabel.definition || resolvedLabel.formula || resolvedLabel.rationale);
  const theme = getTheme(color);

  if (loading) return <div className={`h-24 w-full bg-slate-100 animate-pulse rounded-2xl ${className}`} />;

  const isLight = themeMode === 'light';

  const wrapperClasses = `
    group relative overflow-visible transition-all duration-400 glass-panel
    ${isLight ? 'bg-white border-slate-200 shadow-sm hover:shadow-xl' : 'bg-slate-900/40 border-white/5 shadow-lg'}
    ${theme.border}
    ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
    ${className}
  `;

  if (mode === 'card') {
    return (
      <div className={wrapperClasses} onClick={onClick}>
        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {labelText}
                  </span>
                  <QuantumAiTrigger onClick={onAiAnalyze} label={labelText} />
               </div>
               <div className="flex flex-wrap gap-2">
                 {dataLink && <DataLinkIndicator type={dataLink} />}
               </div>
            </div>
            <div className={`p-3 rounded-xl ${isLight ? theme.iconBg + ' ' + theme.text : 'bg-white/5 text-inherit'} transition-all`}>
               {Icon ? <Icon className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-6 mb-2">
             <QuantumValueEditor 
                value={value || 0} 
                theme={theme} 
                onUpdate={(val) => addToast('success', `Value updated to ${val}`)}
             />
          </div>
          
          <div className="flex items-end justify-between pt-4 border-t border-inherit">
             <div>
                {subValue && <p className="text-[11px] text-slate-500 font-medium mb-1 uppercase tracking-wider">{subValue}</p>}
                {trend && (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${trend.direction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                    {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(trend.value)}%
                  </span>
                )}
             </div>
             <ConfidenceIndicator level={confidence} verified={verified} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className={`${wrapperClasses} p-4 rounded-xl flex items-center justify-between`} onClick={onClick}>
          <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${isLight ? theme.iconBg + ' ' + theme.text : 'bg-white/5'}`}>
                  {Icon ? <Icon className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>
              <div>
                  <div className="text-sm font-bold text-inherit">{labelText}</div>
                  {subValue && <div className="text-[10px] text-slate-500 uppercase tracking-widest">{subValue}</div>}
              </div>
          </div>
          <div className="text-right">
              <div className={`text-base font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{value}</div>
              <ConfidenceIndicator level={confidence} compact />
          </div>
      </div>
    );
  }

  return null;
};

export const OmniEsgCell = withUniversalProxy(OmniEsgCellBase);
