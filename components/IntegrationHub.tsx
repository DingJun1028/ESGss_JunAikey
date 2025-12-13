
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Network, Database, Server, Wifi, RefreshCw, CheckCircle, Activity, Loader2, Zap, Calendar, Box, Layers } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { universalIntelligence } from '../services/evolutionEngine';
import { UniversalPageHeader } from './UniversalPageHeader';

interface IntegrationHubProps {
  language: Language;
}

// ... (Agent Components: PipelineNodeBase, PipelineAgent, CentralHubBase, CentralHubAgent - No changes needed here, keeping logic same) ...
// Re-declaring interfaces/components for context in this file block replacement
interface PipelineNodeProps extends InjectedProxyProps {
    id: string;
    pipe: any;
    index: number;
    total: number;
    isRefreshing: boolean;
}

const PipelineNodeBase: React.FC<PipelineNodeProps> = ({ 
    pipe, index, total, isRefreshing, adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    const isStressed = pipe.status === 'warning';
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isLearning = adaptiveTraits?.includes('learning') || isAgentActive;

    useEffect(() => {
        if (isStressed) {
            universalIntelligence.agentUpdate('Data Lake', { confidence: 'medium' }); 
        }
    }, [isStressed]);

    return (
        <div 
            className={`absolute w-16 h-16 rounded-2xl border flex items-center justify-center backdrop-blur-md transition-all duration-500 cursor-pointer group
                ${isStressed 
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse' 
                    : 'bg-white/5 border-white/10 hover:border-celestial-blue/50'}
                ${isEvolved ? 'scale-110 ring-1 ring-celestial-blue/30' : ''}
            `}
            style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * (360/total)}deg) translate(140px) rotate(-${index * (360/total)}deg)`
            }}
            onClick={() => trackInteraction?.('click')}
        >
            {pipe.type === 'Server' && <Server className={`w-6 h-6 ${isStressed ? 'text-amber-400' : 'text-emerald-400'}`} />}
            {pipe.type === 'Wifi' && <Wifi className="w-6 h-6 text-purple-400" />}
            {pipe.type === 'Database' && <Database className="w-6 h-6 text-amber-400" />}
            {pipe.type === 'Network' && <Network className="w-6 h-6 text-blue-400" />}
            {pipe.type === 'Calendar' && <Calendar className="w-6 h-6 text-pink-400" />}
            {pipe.type === 'App' && <Box className="w-6 h-6 text-cyan-400" />}
            
            <div 
            className={`absolute h-[1px] w-[100px] origin-left -z-10 transition-colors duration-500 ${isStressed ? 'bg-amber-500/50' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`}
            style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${index * (360/total) + 180}deg) translate(30px)`,
                width: '110px'
            }}
            />
            
            {!isRefreshing && (
                <div 
                className={`absolute w-2 h-2 rounded-full top-1/2 left-1/2 -z-10 animate-ping ${isStressed ? 'bg-amber-400' : 'bg-white'}`}
                style={{
                    animationDuration: isStressed ? '3s' : '2s',
                    animationDelay: `${index * 0.5}s`
                }}
                />
            )}

            <div className="absolute top-full mt-2 text-[9px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                {pipe.name}
            </div>
        </div>
    );
};

const PipelineAgent = withUniversalProxy(PipelineNodeBase);

interface CentralHubProps extends InjectedProxyProps {
    isRefreshing: boolean;
    onClick: () => void;
}

const CentralHubBase: React.FC<CentralHubProps> = ({ isRefreshing, onClick, adaptiveTraits, trackInteraction }) => {
    const isEvolved = adaptiveTraits?.includes('evolution');
    const isOptimizing = adaptiveTraits?.includes('optimization');

    return (
        <div 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`relative z-10 w-24 h-24 rounded-full bg-celestial-blue/20 border-2 border-celestial-blue flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition-transform
                ${isRefreshing ? 'animate-spin' : isOptimizing ? 'animate-pulse' : ''}
            `}
        >
            <Database className="w-10 h-10 text-celestial-blue" />
            <div className={`absolute -bottom-8 text-xs font-bold text-celestial-blue whitespace-nowrap ${isRefreshing ? 'hidden' : 'block'}`}>
                {isEvolved ? 'Hive Mind' : 'Data Lake'}
            </div>
            <div className="absolute inset-0 bg-celestial-blue/30 blur-xl rounded-full animate-pulse" />
        </div>
    );
};

const CentralHubAgent = withUniversalProxy(CentralHubBase);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export const IntegrationHub: React.FC<IntegrationHubProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addAuditLog } = useCompany();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pageData = {
      title: { zh: '集成中樞', en: 'Integration Hub' },
      desc: { zh: '整合 Blue CC, Flowlu, Google/Apple Calendar', en: 'Unifying Blue CC, Flowlu, Google/Apple Calendar' },
      tag: { zh: '連結核心', en: 'Nexus Core' }
  };

  const [pipelines, setPipelines] = useState([
    { id: 'pipe-1', name: 'Blue CC (ERP)', status: 'active', latency: '45ms', throughput: '1.2 GB/h', type: 'Database' },
    { id: 'pipe-2', name: 'Siemens IoT', status: 'active', latency: '12ms', throughput: '500 MB/h', type: 'Wifi' },
    { id: 'pipe-3', name: 'Google Calendar', status: 'active', latency: '200ms', throughput: 'Sync', type: 'Calendar' },
    { id: 'pipe-4', name: 'Scope 3 API', status: 'active', latency: '80ms', throughput: '50 MB/h', type: 'Network' },
    { id: 'pipe-5', name: 'Flowlu CRM', status: 'warning', latency: '350ms', throughput: 'Check', type: 'App' },
    { id: 'pipe-6', name: 'Apple iCloud', status: 'active', latency: '60ms', throughput: 'Sync', type: 'Calendar' },
  ]);

  const handleRefresh = () => {
      setIsRefreshing(true);
      addToast('info', isZh ? '正在同步所有外部連接器...' : 'Synchronizing all external connectors...', 'Integration Hub');
      
      universalIntelligence.agentUpdate('Data Lake', { 
          traits: ['optimization', 'performance'], 
          confidence: 'high' 
      });

      setTimeout(() => {
          setIsRefreshing(false);
          setPipelines(prev => prev.map(p => 
              p.id === 'pipe-5' ? { ...p, status: 'active', latency: '45ms' } : p
          ));
          addAuditLog('System Integration', 'Manual ETL Synchronization Triggered. All pipelines healthy.');
          addToast('success', isZh ? '同步完成。Flowlu 連接已修復。' : 'Sync Complete. Flowlu connection fixed.', 'System');
      }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in overflow-hidden">
      <div className="shrink-0">
          <UniversalPageHeader 
              icon={Network}
              title={pageData.title}
              description={pageData.desc}
              language={language}
              tag={pageData.tag}
          />
      </div>

      <div className="flex justify-end -mt-16 mb-2 relative z-10 shrink-0">
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isZh ? '刷新神經元' : 'Refresh Neurons'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Visual Topology - Responsive Height */}
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-center relative overflow-hidden bg-slate-900/50 border border-white/10 group h-full">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-celestial-blue/10 via-slate-900/0 to-slate-900/0 pointer-events-none" />
              
              {/* Central Agent */}
              <CentralHubAgent 
                  id="Data Lake" 
                  label="Data Lake" 
                  isRefreshing={isRefreshing} 
                  onClick={handleRefresh} 
              />

              {/* Satellite Agents */}
              {pipelines.map((pipe, i) => (
                  <PipelineAgent 
                      key={pipe.id}
                      id={pipe.name} 
                      label={pipe.name}
                      pipe={pipe}
                      index={i}
                      total={pipelines.length}
                      isRefreshing={isRefreshing}
                  />
              ))}
          </div>

          {/* Pipeline List - Scrollable */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-2 shrink-0">{isZh ? '連接狀態' : 'Connection Status'}</h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                  {pipelines.map((pipe) => (
                      <OmniEsgCell 
                        key={pipe.id}
                        id={`cell-${pipe.id}`}
                        mode="list"
                        label={pipe.name}
                        value={pipe.status === 'active' ? 'Running' : 'Warning'}
                        subValue={`Latency: ${pipe.latency} • ${pipe.throughput}`}
                        color={pipe.status === 'active' ? 'emerald' : 'gold'}
                        icon={pipe.type === 'Wifi' ? Wifi : pipe.type === 'Database' ? Database : pipe.type === 'Calendar' ? Calendar : Server}
                        confidence={pipe.status === 'active' ? 'high' : 'medium'}
                        verified={true}
                        traits={pipe.status === 'active' ? ['seamless', 'bridging'] : ['gap-filling']}
                      />
                  ))}
              </div>
              
              <div className="p-3 rounded-xl bg-celestial-purple/10 border border-celestial-purple/20 mt-4 flex items-start gap-3 shrink-0">
                  <div className="p-2 bg-celestial-purple/20 rounded-lg">
                      <Activity className="w-4 h-4 text-celestial-purple" />
                  </div>
                  <div>
                      <h4 className="text-xs font-bold text-white mb-1">{isZh ? '系統神經反射報告' : 'Neural Reflex Report'}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                          {isZh ? '集成中心運行穩定。Flowlu API 偶發延遲，已列入觀察名單。' : 'Integration Hub stable. Flowlu API showing sporadic latency, added to watch list.'}
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
