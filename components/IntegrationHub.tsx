
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

// ----------------------------------------------------------------------
// 子代理組件：數據管道節點
// ----------------------------------------------------------------------
interface PipelineNodeProps extends InjectedProxyProps {
    pipe: any;
}

const PipelineNodeBase: React.FC<PipelineNodeProps> = ({ 
    pipe, adaptiveTraits, trackInteraction, isAgentActive 
}) => {
    const isStressed = pipe.status === 'warning';
    const isEvolved = adaptiveTraits?.includes('evolution');

    return (
        <div 
            className={`w-full h-full rounded-2xl border flex items-center justify-center backdrop-blur-md transition-all duration-500 cursor-pointer group
                ${isStressed 
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse' 
                    : 'bg-white/5 border-white/10 hover:border-celestial-blue/50'}
                ${isEvolved ? 'ring-1 ring-celestial-blue/30 scale-105' : ''}
            `}
            onClick={() => trackInteraction?.('click')}
        >
            {pipe.type === 'Server' && <Server className={`w-6 h-6 ${isStressed ? 'text-amber-400' : 'text-emerald-400'}`} />}
            {pipe.type === 'Wifi' && <Wifi className="w-6 h-6 text-purple-400" />}
            {pipe.type === 'Database' && <Database className="w-6 h-6 text-amber-400" />}
            {pipe.type === 'Network' && <Network className="w-6 h-6 text-blue-400" />}
            {pipe.type === 'Calendar' && <Calendar className="w-6 h-6 text-pink-400" />}
            {pipe.type === 'App' && <Box className="w-6 h-6 text-cyan-400" />}
            
            <div className="absolute top-full mt-2 text-[9px] text-gray-500 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded-lg border border-white/5 z-50">
                {pipe.name}
            </div>
        </div>
    );
};

const PipelineAgent = withUniversalProxy(PipelineNodeBase);

// ----------------------------------------------------------------------
// 中央核心節點
// ----------------------------------------------------------------------
interface CentralHubProps extends InjectedProxyProps {
    isRefreshing: boolean;
    onClick: () => void;
}

const CentralHubBase: React.FC<CentralHubProps> = ({ isRefreshing, onClick, adaptiveTraits, trackInteraction }) => {
    const isEvolved = adaptiveTraits?.includes('evolution');

    return (
        <div 
            onClick={() => { onClick(); trackInteraction?.('click'); }}
            className={`relative z-10 w-24 h-24 rounded-full bg-celestial-blue/20 border-2 border-celestial-blue flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition-transform
                ${isRefreshing ? 'animate-spin' : ''}
            `}
        >
            <Database className="w-10 h-10 text-celestial-blue" />
            <div className={`absolute -bottom-8 text-[10px] font-black tracking-[0.2em] text-celestial-blue uppercase whitespace-nowrap ${isRefreshing ? 'hidden' : 'block'}`}>
                {isEvolved ? 'Hive Mind' : 'Central Data Lake'}
            </div>
            <div className="absolute inset-0 bg-celestial-blue/20 blur-2xl rounded-full animate-pulse" />
        </div>
    );
};

const CentralHubAgent = withUniversalProxy(CentralHubBase);

// ----------------------------------------------------------------------
// 主組件
// ----------------------------------------------------------------------
export const IntegrationHub: React.FC<IntegrationHubProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addAuditLog } = useCompany();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      addToast('info', isZh ? '正在刷新數據管道與 ETL 合約...' : 'Refreshing pipelines & ETL contracts...', 'Integration Hub');
      
      setTimeout(() => {
          setIsRefreshing(false);
          setPipelines(prev => prev.map(p => p.id === 'pipe-5' ? { ...p, status: 'active', latency: '45ms' } : p));
          addAuditLog('System Integration', 'ETL Synchronization Triggered. Pipelines synchronized.');
          addToast('success', isZh ? '數據同步完成' : 'Sync Complete', 'System');
      }, 2000);
  };

  const radius = 160;

  return (
    <div className="space-y-8 animate-fade-in pb-12 overflow-hidden h-full flex flex-col">
        <UniversalPageHeader 
            icon={Network}
            title={{ zh: '集成中樞', en: 'Integration Hub' }}
            description={{ zh: '整合 Blue CC, Flowlu 與外部日曆數據流', en: 'Unified data streams from ERP, CRM & Calendars' }}
            language={language}
            tag={{ zh: '連結核心', en: 'Nexus Core' }}
            accentColor="text-celestial-blue"
        />

        <div className="flex justify-end -mt-16 mb-4 relative z-10">
            <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50 shadow-xl backdrop-blur-md"
            >
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="text-xs font-black uppercase tracking-widest">{isZh ? '刷新同步' : 'Sync Neurons'}</span>
            </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
            {/* Visual Topology Layer */}
            <div className="glass-panel p-4 rounded-[3rem] flex items-center justify-center relative overflow-hidden bg-slate-900/50 border border-white/10 min-h-[450px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
                
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="warnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    {pipelines.map((pipe, i) => {
                        const angle = (i * (360 / pipelines.length) - 90) * (Math.PI / 180);
                        const startX = 50 + Math.cos(angle) * 15; // From hub center %
                        const startY = 50 + Math.sin(angle) * 15;
                        const endX = 50 + Math.cos(angle) * 35; // To satellite center %
                        const endY = 50 + Math.sin(angle) * 35;
                        const isWarn = pipe.status === 'warning';

                        return (
                            <g key={pipe.id}>
                                <line 
                                    x1={`${startX}%`} y1={`${startY}%`} 
                                    x2={`${endX}%`} y2={`${endY}%`} 
                                    stroke={isWarn ? 'url(#warnGrad)' : 'url(#lineGrad)'} 
                                    strokeWidth="2" 
                                    strokeDasharray="4 4"
                                />
                                <circle r="3" fill={isWarn ? "#fbbf24" : "#3b82f6"}>
                                    <animateMotion 
                                        dur={isRefreshing ? "0.5s" : isWarn ? "1.5s" : "3s"} 
                                        repeatCount="indefinite" 
                                        path={`M ${startX * 4},${startY * 4} L ${endX * 4},${endY * 4}`}
                                        keyPoints="1;0" keyTimes="0;1"
                                    />
                                </circle>
                            </g>
                        );
                    })}
                </svg>

                {/* Central Hub Agent */}
                <CentralHubAgent 
                    id="CentralDataLake"
                    label="Central Data Lake"
                    isRefreshing={isRefreshing}
                    onClick={handleRefresh}
                    className="absolute z-20"
                />

                {/* Pipeline Satellite Agents */}
                {pipelines.map((pipe, i) => {
                    const angle = (i * (360 / pipelines.length) - 90) * (Math.PI / 180);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <PipelineAgent 
                            key={pipe.id}
                            id={`pipe-${pipe.id}`}
                            label={pipe.name}
                            pipe={pipe}
                            className="absolute z-10 w-16 h-16"
                            style={{ 
                                left: `calc(50% + ${x}px - 32px)`, 
                                top: `calc(50% + ${y}px - 32px)` 
                            }}
                        />
                    );
                })}
            </div>

            {/* Pipeline Status List */}
            <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pr-2">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] ml-2">{isZh ? '連線狀態日誌' : 'Connection Status'}</h3>
                <div className="space-y-3">
                    {pipelines.map(pipe => (
                        <OmniEsgCell 
                            key={pipe.id}
                            mode="list"
                            label={pipe.name}
                            value={pipe.status === 'active' ? 'Active' : 'Latency'}
                            subValue={`${pipe.latency} • ${pipe.throughput}`}
                            color={pipe.status === 'active' ? 'blue' : 'gold'}
                            icon={pipe.type === 'Wifi' ? Wifi : pipe.type === 'Database' ? Database : pipe.type === 'Calendar' ? Calendar : Server}
                            confidence={pipe.status === 'active' ? 'high' : 'medium'}
                            traits={pipe.status === 'active' ? ['bridging', 'seamless'] : ['gap-filling']}
                        />
                    ))}
                </div>

                <div className="mt-auto p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">{isZh ? '系統神經反射' : 'Neural Reflex Report'}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            {isZh 
                                ? '集成中樞正持續監控 API 穩定性。Flowlu 延遲已透過緩存代理自動修正。' 
                                : 'Orchestrator is monitoring API stability. Flowlu latency handled via cache proxy.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
