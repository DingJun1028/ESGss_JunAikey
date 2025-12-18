
import React, { useEffect, useState, useRef } from 'react';
import { filter } from 'rxjs/operators';
import { universalIntelligence } from '../../services/evolutionEngine';
import { OmniEsgTrait, UniversalLabel, EvolutionStage } from '../../types';
import { GitCommit, Sparkles, Activity, Infinity } from 'lucide-react';

interface ProxyConfig {
  enableTelemetry?: boolean;
  enableEvolution?: boolean;
}

export interface InjectedProxyProps {
  adaptiveTraits?: OmniEsgTrait[];
  trackInteraction?: (type: 'click' | 'hover' | 'edit' | 'ai-trigger', payload?: any) => void;
  isHighFrequency?: boolean;
  isAgentActive?: boolean;
  evolutionStage?: EvolutionStage;
}

export const withUniversalProxy = <P extends object>(
  WrappedComponent: React.ComponentType<P & InjectedProxyProps>,
  config: ProxyConfig = { enableTelemetry: true, enableEvolution: true }
) => {
  const ComponentWithProxy = (props: P & { id?: string; label?: string | UniversalLabel; value?: any; className?: string; style?: React.CSSProperties }) => {
    const idRef = useRef(props.id || (typeof props.label === 'string' ? props.label : props.label?.id) || `anon-${Math.random().toString(36).substr(2,9)}`);
    const componentId = idRef.current;
    
    const [adaptiveTraits, setAdaptiveTraits] = useState<OmniEsgTrait[]>([]);
    const [evolutionStage, setEvolutionStage] = useState<EvolutionStage>('Seed');
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [showLedger, setShowLedger] = useState(false);

    useEffect(() => {
      if (config.enableEvolution) {
        universalIntelligence.registerNode(componentId, props.label || 'Unknown', props.value);
        const node = universalIntelligence.getNode(componentId);
        if (node) {
            setAdaptiveTraits(node.traits);
            setEvolutionStage(node.evolutionStage);
        }

        const sub = universalIntelligence.neuralBus$
            .pipe(filter(e => e.type === 'EVOLUTION_UPGRADE' && e.payload.componentId === componentId))
            .subscribe(({ payload }) => {
                setEvolutionStage(payload.stage);
            });

        return () => sub.unsubscribe();
      }
    }, [componentId]);

    const trackInteraction = (type: 'click' | 'hover' | 'edit' | 'ai-trigger', payload?: any) => {
      if (config.enableTelemetry) {
        universalIntelligence.recordInteraction({
          componentId,
          eventType: type,
          timestamp: Date.now(),
          payload
        });
      }
    };

    const getEvolutionVisuals = () => {
        switch (evolutionStage) {
            case 'Infinite': return { color: 'text-celestial-gold', icon: Infinity, glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]' };
            case 'Autonomous': return { color: 'text-celestial-purple', icon: Sparkles, glow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]' };
            case 'Optimized': return { color: 'text-emerald-400', icon: Activity, glow: 'shadow-[0_0_8px_rgba(16,185,129,0.2)]' };
            default: return { color: 'text-gray-500', icon: GitCommit, glow: '' };
        }
    };

    const visuals = getEvolutionVisuals();
    const EvoIcon = visuals.icon;

    return (
        <div className={`relative group/proxy ${props.className || ''}`} style={props.style}>
            {/* Evolution Pulse Marker */}
            <div 
                className={`absolute -top-2 -left-2 z-30 p-1 bg-slate-900 rounded-full border border-white/10 ${visuals.color} ${visuals.glow} cursor-help hover:scale-110 transition-all`}
                onMouseEnter={() => setShowLedger(true)}
                onMouseLeave={() => setShowLedger(false)}
            >
                <EvoIcon className="w-3 h-3" />
            </div>

            {/* Component Ledger (Tooltip) */}
            {showLedger && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-64 bg-slate-950 border border-white/20 rounded-xl p-4 shadow-2xl animate-fade-in backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <GitCommit className="w-4 h-4 text-celestial-gold" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Evolution Ledger</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-500">Active State</span>
                            <span className={`font-bold ${visuals.color}`}>{evolutionStage}</span>
                        </div>
                        <div className="h-[1px] bg-white/5" />
                        <div className="text-[10px] text-gray-400 leading-relaxed italic">
                            "This agent has manifested through {universalIntelligence.getNode(componentId)?.interactionCount || 0} logic interactions."
                        </div>
                    </div>
                </div>
            )}

            <WrappedComponent
                {...(props as P)}
                adaptiveTraits={adaptiveTraits}
                trackInteraction={trackInteraction}
                isHighFrequency={adaptiveTraits.includes('optimization')}
                isAgentActive={isAgentActive}
                evolutionStage={evolutionStage}
            />
        </div>
    );
  };

  ComponentWithProxy.displayName = `UniversalProxy(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return React.memo(ComponentWithProxy);
};
